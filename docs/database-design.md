# HashIn — Database Design Document

> **Version**: 1.0  
> **Database**: MongoDB (via Mongoose ODM)  
> **Date**: 2026-07-01

---

## 1. Schema Overview

### 1.1 Collections

| Collection | Purpose | Estimated P0 Size |
|---|---|---|
| `users` | User accounts and profiles | Hundreds |
| `connections` | Professional connections between users | Thousands |
| `posts` | Text content shared by users | Thousands |
| `swipes` | Discovery swipe actions (like/pass) | Tens of thousands |

### 1.2 Relationship Map

```
users ──┬── 1:N ──► posts        (user authors posts)
        ├── 1:N ──► swipes       (user performs swipes)
        ├── M:N ──► connections   (user↔user via connection doc)
        └── M:N ──► posts.likes  (user likes posts)
```

---

## 2. Schema Definitions

### 2.1 User Schema

```javascript
const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    select: false        // Excluded from queries by default
  },
  headline: {
    type: String,
    maxlength: 120,
    default: ''
  },
  about: {
    type: String,
    maxlength: 500,
    default: ''
  },
  skills: {
    type: [String],
    default: [],
    validate: [v => v.length <= 15, 'Maximum 15 skills allowed']
  },
  location: {
    type: String,
    maxlength: 100,
    default: ''
  },
  githubUrl: { type: String, default: '' },
  linkedinUrl: { type: String, default: '' },
  portfolioUrl: { type: String, default: '' },

  // P1 hooks (present from day 1, used later)
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  avatarUrl: {            // P1: Profile picture
    type: String,
    default: ''
  },
  refreshToken: {
    type: String,
    select: false         // Never exposed in queries
  }
}, {
  timestamps: true        // createdAt, updatedAt
});
```

**Indexes:**
```javascript
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ skills: 1 });                    // Discovery skill matching
userSchema.index({ firstName: 'text', lastName: 'text', headline: 'text' }); // Search
```

**Pre-save hook:** Hash password on change using bcrypt (12 rounds).

**Instance method:** `toPublicJSON()` — returns user object without password, refreshToken.

---

### 2.2 Connection Schema

```javascript
const connectionSchema = new Schema({
  senderId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiverId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});
```

**Indexes:**
```javascript
// Prevent duplicate connections (in either direction)
connectionSchema.index({ senderId: 1, receiverId: 1 }, { unique: true });

// Efficient lookup: "find all connections for user X"
connectionSchema.index({ senderId: 1, status: 1 });
connectionSchema.index({ receiverId: 1, status: 1 });
```

**Business Rules:**
- Before creating, check both `(A→B)` and `(B→A)` don't already exist
- Only receiver can accept/reject
- Either party can remove (delete) an accepted connection

---

### 2.3 Post Schema

```javascript
const postSchema = new Schema({
  authorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 500
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],

  // P1 hooks
  mediaUrl: {              // P1: Image/video URL
    type: String,
    default: ''
  },
  mediaType: {             // P1: 'image' | 'video'
    type: String,
    enum: ['image', 'video', ''],
    default: ''
  }
}, {
  timestamps: true
});
```

**Indexes:**
```javascript
postSchema.index({ authorId: 1, createdAt: -1 });  // User's posts, newest first
postSchema.index({ createdAt: -1 });                 // Global feed ordering
```

**Virtual field:** `likeCount` — returns `this.likes.length`

---

### 2.4 Swipe Schema

```javascript
const swipeSchema = new Schema({
  swiperId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  swipedId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    enum: ['like', 'pass'],
    required: true
  }
}, {
  timestamps: { createdAt: true, updatedAt: false }  // Only createdAt needed
});
```

**Indexes:**
```javascript
// Prevent duplicate swipes
swipeSchema.index({ swiperId: 1, swipedId: 1 }, { unique: true });

// Efficient lookup: "who has user X swiped?" (for discovery exclusion)
swipeSchema.index({ swiperId: 1 });

// Efficient lookup: "who liked user X?" (for mutual match check)
swipeSchema.index({ swipedId: 1, action: 1 });
```

---

## 3. Query Patterns & Optimization

### 3.1 Discovery Feed — The Critical Query

This is the most complex query in the system and the one that must be optimized:

```javascript
// Step 1: Get IDs to exclude (already swiped + self)
const swipedIds = await Swipe.find({ swiperId: userId }).distinct('swipedId');
const excludeIds = [...swipedIds, userId];

// Step 2: Aggregation pipeline
const candidates = await User.aggregate([
  // Stage 1: Filter — uses { skills: 1 } index
  {
    $match: {
      _id: { $nin: excludeIds },
      skills: { $in: currentUser.skills }   // At least 1 common skill
    }
  },
  // Stage 2: Score — computed field
  {
    $addFields: {
      matchScore: {
        $size: { $setIntersection: ['$skills', currentUser.skills] }
      }
    }
  },
  // Stage 3: Sort by relevance
  { $sort: { matchScore: -1, createdAt: -1 } },
  // Stage 4: Paginate
  { $limit: 20 },
  // Stage 5: Project — exclude sensitive fields
  {
    $project: {
      password: 0,
      refreshToken: 0,
      email: 0
    }
  }
]);
```

**Performance notes:**
- The `$match` stage uses the `skills` index for initial filtering
- `$nin` with `excludeIds` may be slow with very large swipe histories (>10K) — at that scale, consider a bloom filter or date-based windowing
- For P0 (college demo with hundreds of users), this performs well under 500ms

### 3.2 Feed Query

```javascript
// Get IDs of accepted connections
const connectionIds = await Connection.find({
  $or: [
    { senderId: userId, status: 'accepted' },
    { receiverId: userId, status: 'accepted' }
  ]
}).then(conns => conns.map(c =>
  c.senderId.equals(userId) ? c.receiverId : c.senderId
));

// Fetch posts from connections + self
const posts = await Post.find({
  authorId: { $in: [...connectionIds, userId] }
})
  .sort({ createdAt: -1 })
  .skip((page - 1) * limit)
  .limit(limit)
  .populate('authorId', 'firstName lastName headline');
```

### 3.3 Mutual Match Check

```javascript
// After user A swipes "like" on user B, check if B already liked A
const mutual = await Swipe.findOne({
  swiperId: targetId,
  swipedId: userId,
  action: 'like'
});

if (mutual) {
  await Connection.create({
    senderId: userId,
    receiverId: targetId,
    status: 'pending'    // or 'accepted' if auto-accepting mutual likes
  });
}
```

---

## 4. Data Integrity Rules

| Rule | Implementation |
|---|---|
| No duplicate emails | Unique index on `users.email` |
| No duplicate swipes | Compound unique index on `swipes(swiperId, swipedId)` |
| No duplicate connections | Check both directions before creating |
| Passwords never exposed | `select: false` on password field |
| Refresh tokens never exposed | `select: false` on refreshToken field |
| Cascading deletes | When user deleted: remove their posts, swipes, connections |

---

## 5. P1/P2 Schema Evolution

| Phase | Schema Change | Impact |
|---|---|---|
| P1 | Add `avatarUrl` to User | Already in schema, just unused |
| P1 | Add `mediaUrl`, `mediaType` to Post | Already in schema, just unused |
| P1 | Add `Message` collection for chat | New collection, no existing changes |
| P2 | Add follower/following arrays or collection | May add `Follow` collection |
| P2 | Add aggregation pipeline views | Read-only, no schema changes |
