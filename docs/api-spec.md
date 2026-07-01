# HashIn — REST API Specification

> **Version**: 1.0  
> **Base URL**: `http://localhost:5000/api`  
> **Auth**: Bearer Token (JWT)  
> **Content-Type**: `application/json`

---

## Response Envelope

All responses follow a standardized format:

```json
// Success
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}

// Error
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": []  // Validation errors only
  }
}
```

---

## 1. Authentication — `/api/auth`

### POST `/api/auth/register`
Register a new user account.

**Rate Limit**: 5 requests / 15 minutes

| Field | Type | Required | Constraints |
|---|---|---|---|
| firstName | string | ✅ | 2–50 chars |
| lastName | string | ✅ | 2–50 chars |
| email | string | ✅ | Valid email format |
| password | string | ✅ | Min 8 chars, 1 uppercase, 1 number |

**Success Response** `201 Created`
```json
{
  "success": true,
  "data": {
    "user": { "_id": "...", "firstName": "...", "lastName": "...", "email": "..." },
    "accessToken": "eyJhbGciOi..."
  },
  "message": "User registered successfully"
}
```
+ `Set-Cookie: refreshToken=...; HttpOnly; Secure; SameSite=Strict; Path=/api/auth; Max-Age=604800`

**Error Responses**:
- `400` — Validation error (invalid fields)
- `409` — Email already registered

---

### POST `/api/auth/login`
Authenticate and receive tokens.

**Rate Limit**: 5 requests / 15 minutes

| Field | Type | Required |
|---|---|---|
| email | string | ✅ |
| password | string | ✅ |

**Success Response** `200 OK`
```json
{
  "success": true,
  "data": {
    "user": { "_id": "...", "firstName": "...", "lastName": "...", "email": "..." },
    "accessToken": "eyJhbGciOi..."
  },
  "message": "Login successful"
}
```
+ `Set-Cookie: refreshToken=...`

**Error Responses**:
- `401` — Invalid email or password

---

### POST `/api/auth/refresh`
Refresh the access token using the refresh token cookie.

**Headers**: Cookie with `refreshToken`

**Success Response** `200 OK`
```json
{
  "success": true,
  "data": { "accessToken": "eyJhbGciOi..." },
  "message": "Token refreshed"
}
```

**Error Responses**:
- `401` — Missing or invalid refresh token

---

### POST `/api/auth/logout`
Invalidate the refresh token and clear the cookie.

**Auth**: Required (Bearer Token)

**Success Response** `200 OK`
```json
{
  "success": true,
  "data": null,
  "message": "Logged out successfully"
}
```

---

## 2. Users — `/api/users`

### GET `/api/users/me`
Get the authenticated user's profile.

**Auth**: Required

**Success Response** `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "headline": "Full Stack Developer",
    "bio": "...",
    "skills": ["React", "Node.js", "MongoDB"],
    "location": "Mumbai, India",
    "githubUrl": "https://github.com/johndoe",
    "linkedinUrl": "https://linkedin.com/in/johndoe",
    "portfolioUrl": "https://johndoe.dev",
    "role": "user",
    "createdAt": "2026-07-01T00:00:00.000Z"
  }
}
```

---

### PATCH `/api/users/me`
Update the authenticated user's profile.

**Auth**: Required

| Field | Type | Required | Constraints |
|---|---|---|---|
| firstName | string | ❌ | 2–50 chars |
| lastName | string | ❌ | 2–50 chars |
| headline | string | ❌ | Max 120 chars |
| bio | string | ❌ | Max 500 chars |
| skills | string[] | ❌ | 1–15 items, each 1–30 chars |
| location | string | ❌ | Max 100 chars |
| githubUrl | string | ❌ | Valid URL |
| linkedinUrl | string | ❌ | Valid URL |
| portfolioUrl | string | ❌ | Valid URL |

**Success Response** `200 OK`
```json
{
  "success": true,
  "data": { /* updated user object */ },
  "message": "Profile updated successfully"
}
```

**Error Responses**:
- `400` — Validation error

---

### GET `/api/users/:id`
Get a user's public profile by ID.

**Auth**: Required

**Success Response** `200 OK` — User object (excluding password, tokens)

**Error Responses**:
- `404` — User not found

---

## 3. Discovery — `/api/discovery`

### GET `/api/discovery/feed`
Get skill-matched candidate profiles for the swipe interface.

**Auth**: Required

**Query Parameters**:
| Param | Type | Default | Description |
|---|---|---|---|
| limit | number | 20 | Max candidates to return (1–50) |

**Success Response** `200 OK`
```json
{
  "success": true,
  "data": {
    "candidates": [
      {
        "_id": "...",
        "firstName": "Jane",
        "lastName": "Smith",
        "headline": "Backend Engineer",
        "skills": ["Node.js", "Python", "MongoDB"],
        "matchScore": 2
      }
    ],
    "remaining": 45
  }
}
```

---

### POST `/api/discovery/swipe`
Record a swipe action on a candidate.

**Auth**: Required

| Field | Type | Required | Constraints |
|---|---|---|---|
| targetId | string | ✅ | Valid MongoDB ObjectId |
| action | string | ✅ | `"like"` or `"pass"` |

**Success Response** `201 Created`
```json
{
  "success": true,
  "data": {
    "swipe": { "_id": "...", "swiperId": "...", "swipedId": "...", "action": "like" },
    "isMatch": true  // true if mutual like
  },
  "message": "Swipe recorded"
}
```

**Error Responses**:
- `400` — Invalid target ID or action
- `409` — Already swiped on this user

---

## 4. Connections — `/api/connections`

### POST `/api/connections/request/:userId`
Send a connection request.

**Auth**: Required

**Success Response** `201 Created`
```json
{
  "success": true,
  "data": {
    "connection": {
      "_id": "...",
      "senderId": "...",
      "receiverId": "...",
      "status": "pending"
    }
  },
  "message": "Connection request sent"
}
```

**Error Responses**:
- `404` — Target user not found
- `409` — Connection already exists or request already pending

---

### PATCH `/api/connections/:connectionId/accept`
Accept a pending connection request.

**Auth**: Required (must be the receiver)

**Success Response** `200 OK`
```json
{
  "success": true,
  "data": { "connection": { "status": "accepted", ... } },
  "message": "Connection accepted"
}
```

**Error Responses**:
- `403` — Not the receiver of this request
- `404` — Connection not found
- `400` — Connection is not in "pending" status

---

### PATCH `/api/connections/:connectionId/reject`
Reject a pending connection request.

**Auth**: Required (must be the receiver)

**Success Response** `200 OK` — Same structure as accept

---

### GET `/api/connections`
Get the authenticated user's accepted connections.

**Auth**: Required

**Query Parameters**:
| Param | Type | Default |
|---|---|---|
| page | number | 1 |
| limit | number | 20 |

**Success Response** `200 OK`
```json
{
  "success": true,
  "data": {
    "connections": [
      {
        "_id": "...",
        "user": { "_id": "...", "firstName": "...", "headline": "..." },
        "connectedAt": "2026-07-01T00:00:00.000Z"
      }
    ],
    "pagination": { "page": 1, "limit": 20, "total": 5 }
  }
}
```

---

### GET `/api/connections/requests`
Get pending connection requests (sent and received).

**Auth**: Required

**Success Response** `200 OK`
```json
{
  "success": true,
  "data": {
    "sent": [ { "connection": {...}, "user": {...} } ],
    "received": [ { "connection": {...}, "user": {...} } ]
  }
}
```

---

### DELETE `/api/connections/:connectionId`
Remove an accepted connection.

**Auth**: Required (must be sender or receiver)

**Success Response** `200 OK`
```json
{
  "success": true,
  "data": null,
  "message": "Connection removed"
}
```

---

## 5. Posts & Feed — `/api/posts`

### POST `/api/posts`
Create a new text post.

**Auth**: Required

| Field | Type | Required | Constraints |
|---|---|---|---|
| content | string | ✅ | 1–500 chars |

**Success Response** `201 Created`
```json
{
  "success": true,
  "data": {
    "post": {
      "_id": "...",
      "authorId": "...",
      "content": "Just shipped a new feature!",
      "likes": [],
      "createdAt": "..."
    }
  },
  "message": "Post created"
}
```

---

### GET `/api/posts/feed`
Get the feed (posts from connections + own posts).

**Auth**: Required

**Query Parameters**:
| Param | Type | Default | Description |
|---|---|---|---|
| page | number | 1 | Page number |
| limit | number | 10 | Posts per page (max 50) |

**Success Response** `200 OK`
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "_id": "...",
        "author": { "_id": "...", "firstName": "...", "headline": "..." },
        "content": "...",
        "likes": ["userId1", "userId2"],
        "likeCount": 2,
        "isLiked": false,
        "createdAt": "..."
      }
    ],
    "pagination": { "page": 1, "limit": 10, "total": 42 }
  }
}
```

---

### POST `/api/posts/:postId/like`
Toggle like on a post.

**Auth**: Required

**Success Response** `200 OK`
```json
{
  "success": true,
  "data": { "liked": true, "likeCount": 3 },
  "message": "Post liked"
}
```

---

### DELETE `/api/posts/:postId`
Delete own post.

**Auth**: Required (must be author)

**Success Response** `200 OK`
```json
{
  "success": true,
  "data": null,
  "message": "Post deleted"
}
```

**Error Responses**:
- `403` — Not the author
- `404` — Post not found
