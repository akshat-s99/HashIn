# HashIn — Testing Strategy

> **Version**: 1.0  
> **Date**: 2026-07-01

---

## 1. Testing Approach

### 1.1 Testing Pyramid (P0 Scope)

```
        ┌─────────┐
        │  Manual  │  ← Smoke tests, UX validation, demo flows
        │  E2E     │
        ├─────────┤
        │  Integr- │  ← API endpoint tests (supertest)
        │  ation   │  ← Database operation tests
        ├─────────┤
        │   Unit   │  ← Service logic, utilities, validators
        │  Tests   │  ← Pure function tests
        └─────────┘
```

### 1.2 Tools

| Tool | Purpose |
|---|---|
| **Jest** | Test runner and assertion library |
| **Supertest** | HTTP integration testing for Express routes |
| **mongodb-memory-server** | In-memory MongoDB for test isolation |
| **Zod** | Validators are self-documenting tests (parse or throw) |

---

## 2. Unit Tests

### 2.1 Utility Functions

| Module | Test Cases |
|---|---|
| `jwt.utils.js` | Generate access token, verify valid token, reject expired token, reject malformed token |
| `password.utils.js` | Hash password, compare correct password, reject wrong password |
| `apiResponse.utils.js` | Format success response, format error response |

### 2.2 Validators (Zod Schemas)

| Module | Test Cases |
|---|---|
| `auth.validator.js` | Valid registration data passes, missing email fails, weak password fails, email format validation |
| `user.validator.js` | Valid profile update passes, skills array > 15 fails, invalid URL format fails |
| `post.validator.js` | Valid post passes, empty content fails, > 500 chars fails |
| `connection.validator.js` | Valid ObjectId passes, invalid ID format fails |

### 2.3 Service Layer

| Service | Test Cases |
|---|---|
| `auth.service.js` | Register creates user + hashes password, login returns tokens, duplicate email throws ConflictError |
| `discovery.service.js` | Excludes self from candidates, excludes already-swiped, ranks by skill overlap, mutual like creates connection |
| `social.service.js` | Send request creates pending connection, accept updates status, reject updates status, duplicate request throws |
| `content.service.js` | Create post, toggle like (add/remove), feed returns only connection posts |

---

## 3. Integration Tests

### 3.1 API Endpoint Tests

Each endpoint tested with valid and invalid inputs:

#### Auth Endpoints
```
POST /api/auth/register
  ✓ 201 — Registers user with valid data
  ✓ 400 — Missing required fields
  ✓ 400 — Invalid email format
  ✓ 400 — Weak password
  ✓ 409 — Duplicate email

POST /api/auth/login
  ✓ 200 — Valid credentials
  ✓ 401 — Wrong password
  ✓ 401 — Non-existent email

POST /api/auth/refresh
  ✓ 200 — Valid refresh token cookie
  ✓ 401 — Missing refresh token
  ✓ 401 — Invalid refresh token

POST /api/auth/logout
  ✓ 200 — Clears refresh token
  ✓ 401 — Unauthenticated request
```

#### User Endpoints
```
GET /api/users/me
  ✓ 200 — Returns authenticated user
  ✓ 401 — No auth token

PATCH /api/users/me
  ✓ 200 — Updates profile fields
  ✓ 400 — Invalid URL format
  ✓ 400 — Too many skills

GET /api/users/:id
  ✓ 200 — Returns public profile
  ✓ 404 — Non-existent user
```

#### Discovery Endpoints
```
GET /api/discovery/feed
  ✓ 200 — Returns skill-matched candidates
  ✓ 200 — Excludes already-swiped users
  ✓ 200 — Excludes self
  ✓ 200 — Sorted by match score

POST /api/discovery/swipe
  ✓ 201 — Records like swipe
  ✓ 201 — Records pass swipe
  ✓ 201 — Mutual like creates match
  ✓ 409 — Duplicate swipe
```

#### Connection Endpoints
```
POST /api/connections/request/:userId
  ✓ 201 — Creates pending request
  ✓ 409 — Duplicate request
  ✓ 404 — Target user not found

PATCH /api/connections/:id/accept
  ✓ 200 — Accepts pending request
  ✓ 403 — Non-receiver tries to accept
  ✓ 400 — Already accepted

GET /api/connections
  ✓ 200 — Returns accepted connections with pagination

DELETE /api/connections/:id
  ✓ 200 — Removes connection
  ✓ 403 — Non-participant tries to remove
```

#### Post Endpoints
```
POST /api/posts
  ✓ 201 — Creates text post
  ✓ 400 — Empty content
  ✓ 400 — Exceeds 500 chars

GET /api/posts/feed
  ✓ 200 — Returns connection + own posts
  ✓ 200 — Paginated correctly
  ✓ 200 — Sorted newest first

POST /api/posts/:id/like
  ✓ 200 — Likes post (adds userId to likes array)
  ✓ 200 — Unlikes post (removes userId on second call)

DELETE /api/posts/:id
  ✓ 200 — Author deletes own post
  ✓ 403 — Non-author cannot delete
```

### 3.2 Middleware Tests

```
Auth Middleware
  ✓ Passes with valid Bearer token
  ✓ Rejects missing Authorization header
  ✓ Rejects expired token
  ✓ Rejects malformed token
  ✓ Attaches user to req.user

Validation Middleware
  ✓ Passes valid body to next()
  ✓ Returns 400 with Zod error details on invalid body

Rate Limiter
  ✓ Allows requests under limit
  ✓ Returns 429 when limit exceeded
  ✓ Resets after window expires
```

---

## 4. Manual Testing Scenarios

### 4.1 Critical User Flows (Demo/Viva)

| # | Flow | Steps |
|---|---|---|
| 1 | **Registration → Login** | Register with valid data → Receive tokens → Access protected route |
| 2 | **Profile Setup** | Login → Update headline, about, skills → Verify profile displays |
| 3 | **Discovery & Match** | User A and B both add overlapping skills → A discovers B → A swipes right → B discovers A → B swipes right → Match notification → Connection created |
| 4 | **Connection Management** | View pending requests → Accept request → View in connections list → Remove connection |
| 5 | **Content Feed** | Create post → Post appears in own feed → Connected user sees post in their feed → Like/unlike post |
| 6 | **Security Demo** | Access protected route without token (401) → Rate limit triggers (429) → Malformed input rejected (400) |

### 4.2 Edge Cases to Test Manually

- [ ] Register with an email that already exists
- [ ] Login with wrong password 5+ times (rate limit)
- [ ] Swipe on yourself (should not appear in feed)
- [ ] Send connection request to already-connected user
- [ ] Accept a request that's already accepted
- [ ] Delete someone else's post
- [ ] Access expired token → refresh → retry original request
- [ ] Create post with exactly 500 characters (boundary)
- [ ] Create post with 501 characters (should fail)

---

## 5. Test Configuration

### 5.1 Test Environment

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  setupFilesAfterSetup: ['./tests/setup.js'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/config/**',
    '!src/app.js'
  ]
};
```

### 5.2 Test Database Setup

```javascript
// tests/setup.js
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
});
```

---

## 6. Coverage Targets

| Layer | Target | Rationale |
|---|---|---|
| Utils / Validators | **90%+** | Pure functions, easy to test exhaustively |
| Services | **80%+** | Core business logic, critical for correctness |
| Controllers | **70%+** | Thin layer, mostly delegation |
| Middleware | **80%+** | Security-critical components |
| Frontend Components | **60%+** | Focus on interactive components |
