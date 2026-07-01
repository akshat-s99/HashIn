# HashIn — System Design Document (SDD)

> **Version**: 1.0  
> **Date**: 2026-07-01  
> **Architecture**: Service-Oriented MVC  
> **Stack**: MERN (MongoDB, Express.js, React, Node.js)

---

## 1. Architecture Overview

### 1.1 System Context

```
┌─────────────────────────────────────────────────────────┐
│                     HashIn Platform                      │
│                                                         │
│  ┌──────────────┐    HTTP/REST    ┌──────────────────┐  │
│  │   React SPA  │ ◄────────────► │  Express.js API   │  │
│  │  (Vite Dev)  │                │  (REST Server)    │  │
│  │              │                │                    │  │
│  │  Port: 5173  │                │  Port: 5000        │  │
│  └──────────────┘                └────────┬───────────┘  │
│                                           │              │
│                                  ┌────────▼───────────┐  │
│                                  │     MongoDB        │  │
│                                  │  (Mongoose ODM)    │  │
│                                  │  Port: 27017       │  │
│                                  └────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### 1.2 Architecture Style: Service-Oriented MVC (MVC-S)

Standard MVC puts business logic in controllers, creating fat controllers. MVC-S adds a **Service layer** between Controller and Model:

```
Route → Middleware → Controller → Service → Model → Database
         (auth,         (HTTP       (business    (data
          validate,      concerns)   logic)       access)
          rate limit)
```

**Why this matters for the project:**
- **Controllers** only handle HTTP (parse request, call service, format response)
- **Services** contain all business logic (testable without HTTP)
- **Models** define data shape and database operations
- **Routes** wire URLs to controllers with middleware chains

---

## 2. Module Decomposition

### 2.1 Backend Modules

```
┌─────────────────────────────────────────────────────────┐
│                    EXPRESS APPLICATION                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │                 MIDDLEWARE LAYER                  │    │
│  │  Helmet │ CORS │ RateLimit │ Auth │ Validate     │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │   Auth   │ │   User   │ │ Discovery│ │  Social  │   │
│  │  Module  │ │  Module  │ │  Module  │ │  Module  │   │
│  ├──────────┤ ├──────────┤ ├──────────┤ ├──────────┤   │
│  │ Route    │ │ Route    │ │ Route    │ │ Route    │   │
│  │ Control  │ │ Control  │ │ Control  │ │ Control  │   │
│  │ Service  │ │ Service  │ │ Service  │ │ Service  │   │
│  │ Valid.   │ │ Valid.   │ │ Valid.   │ │ Valid.   │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
│                                                         │
│  ┌──────────┐                                           │
│  │ Content  │  ┌──────────────────────────────────┐     │
│  │  Module  │  │         DATA ACCESS LAYER         │     │
│  ├──────────┤  │  User │ Connection │ Post │ Swipe │     │
│  │ Route    │  │       (Mongoose Models)           │     │
│  │ Control  │  └──────────────────────────────────┘     │
│  │ Service  │                                           │
│  │ Valid.   │  ┌──────────────────────────────────┐     │
│  └──────────┘  │           UTILITIES               │     │
│                │  JWT │ Password │ ApiResponse      │     │
│                └──────────────────────────────────┘     │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Frontend Modules

```
┌─────────────────────────────────────────────────────────┐
│                     REACT APPLICATION                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │                   APP SHELL                      │    │
│  │  React Router │ AuthContext │ ProtectedRoute     │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │   Auth   │ │ Profile  │ │ Discover │ │   Feed   │   │
│  │  Pages   │ │  Pages   │ │  Pages   │ │  Pages   │   │
│  ├──────────┤ ├──────────┤ ├──────────┤ ├──────────┤   │
│  │LoginPage │ │ProfilePg │ │DiscoverPg│ │ FeedPage │   │
│  │RegisterPg│ │EditProfPg│ │          │ │          │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
│                                                         │
│  ┌──────────┐                                           │
│  │  Social  │  ┌──────────────────────────────────┐     │
│  │  Pages   │  │         SHARED LAYER              │     │
│  ├──────────┤  │  Axios │ Hooks │ Utils │ Context  │     │
│  │ConnectPg │  └──────────────────────────────────┘     │
│  └──────────┘                                           │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Data Flow Diagrams

### 3.1 Authentication Flow

```
User                    Client                    Server                    DB
 │                        │                         │                       │
 │  1. Fill Register Form │                         │                       │
 │ ─────────────────────► │                         │                       │
 │                        │  2. POST /api/auth/register                     │
 │                        │ ──────────────────────► │                       │
 │                        │                         │  3. Validate (Zod)    │
 │                        │                         │  4. Hash password     │
 │                        │                         │  5. Create user       │
 │                        │                         │ ───────────────────►  │
 │                        │                         │  6. Generate tokens   │
 │                        │  7. { accessToken }     │                       │
 │                        │  + Set-Cookie: refresh  │                       │
 │                        │ ◄────────────────────── │                       │
 │  8. Redirect to home   │                         │                       │
 │ ◄───────────────────── │                         │                       │
```

### 3.2 Discovery (Swipe) Flow

```
User                    Client                    Server                    DB
 │                        │                         │                       │
 │  1. Open Discovery     │                         │                       │
 │ ─────────────────────► │                         │                       │
 │                        │  2. GET /api/discovery/feed                     │
 │                        │ ──────────────────────► │                       │
 │                        │                         │  3. Get user skills   │
 │                        │                         │  4. Get swiped IDs    │
 │                        │                         │  5. Aggregate:        │
 │                        │                         │     - Exclude swiped  │
 │                        │                         │     - Match skills    │
 │                        │                         │     - Score & sort    │
 │                        │                         │ ───────────────────►  │
 │                        │  6. [candidates]        │                       │
 │                        │ ◄────────────────────── │                       │
 │  7. Show card stack    │                         │                       │
 │ ◄───────────────────── │                         │                       │
 │                        │                         │                       │
 │  8. Swipe RIGHT (like) │                         │                       │
 │ ─────────────────────► │                         │                       │
 │                        │  9. POST /api/discovery/swipe                   │
 │                        │    { targetId, action }  │                       │
 │                        │ ──────────────────────► │                       │
 │                        │                         │  10. Record swipe     │
 │                        │                         │  11. Check mutual?    │
 │                        │                         │  12. If mutual →      │
 │                        │                         │      create connection│
 │                        │  13. { match: true/false }                      │
 │                        │ ◄────────────────────── │                       │
 │  14. Show match alert  │                         │                       │
 │      (if mutual)       │                         │                       │
 │ ◄───────────────────── │                         │                       │
```

### 3.3 Connection Lifecycle State Machine

```
                    ┌──────────┐
                    │  NONE    │  (No relationship exists)
                    └────┬─────┘
                         │
                    Send Request
                         │
                    ┌────▼─────┐
               ┌────│ PENDING  │────┐
               │    └──────────┘    │
           Accept               Reject
               │                    │
          ┌────▼─────┐        ┌────▼─────┐
          │ ACCEPTED │        │ REJECTED │
          └────┬─────┘        └──────────┘
               │
           Remove
               │
          ┌────▼─────┐
          │  NONE    │  (Can re-request)
          └──────────┘
```

---

## 4. Middleware Pipeline

Every request passes through this ordered pipeline:

```
Request
  │
  ▼
┌──────────────┐
│   Helmet     │  ← Security headers (X-Frame-Options, CSP, etc.)
└──────┬───────┘
  │
  ▼
┌──────────────┐
│    CORS      │  ← Allow client origin, credentials
└──────┬───────┘
  │
  ▼
┌──────────────┐
│ JSON Parser  │  ← express.json({ limit: '10kb' })
└──────┬───────┘
  │
  ▼
┌──────────────┐
│ Cookie Parser│  ← Parse httpOnly refresh token cookie
└──────┬───────┘
  │
  ▼
┌──────────────┐
│ Rate Limiter │  ← 100 req/15min general, 5 req/15min auth
└──────┬───────┘
  │
  ▼
┌──────────────┐
│   Router     │  ← Route matching → per-route middleware:
└──────┬───────┘
  │
  ├── Auth Middleware (protect)  ← Verify JWT, attach req.user
  ├── Zod Validator (validate)   ← Validate req.body/params/query
  │
  ▼
┌──────────────┐
│  Controller  │  ← Handle request
└──────┬───────┘
  │
  ▼
┌──────────────┐
│Error Handler │  ← Global catch-all (last middleware)
└──────────────┘
```

---

## 5. Security Architecture

### 5.1 Authentication Token Strategy

```
┌─────────────────────────────────────────────────┐
│              TOKEN ARCHITECTURE                  │
├─────────────────────────────────────────────────┤
│                                                 │
│  ACCESS TOKEN                                   │
│  ├── Storage: Memory (React state / context)    │
│  ├── Lifetime: 15 minutes                       │
│  ├── Payload: { userId, role }                  │
│  ├── Sent via: Authorization: Bearer <token>    │
│  └── On expiry: Silent refresh via refresh      │
│                                                 │
│  REFRESH TOKEN                                  │
│  ├── Storage: httpOnly cookie                   │
│  ├── Lifetime: 7 days                           │
│  ├── Flags: httpOnly, secure, sameSite: strict  │
│  ├── Sent via: Cookie (automatic)               │
│  └── On expiry: Force re-login                  │
│                                                 │
└─────────────────────────────────────────────────┘
```

### 5.2 Input Validation Strategy

Every incoming request body, URL parameter, and query string is validated using Zod schemas:

```
Route Definition:
  router.post('/register', validate(registerSchema), authController.register)

Where validate() middleware:
  1. Parses req.body against the Zod schema
  2. On success: attaches parsed data to req.validated, calls next()
  3. On failure: returns 400 with structured error details
```

---

## 6. Scalability Provisions (P1/P2 Hooks)

The P0 architecture includes intentional extension points:

| Future Feature | Architectural Hook |
|---|---|
| Google OAuth | AuthService uses strategy pattern — add OAuthStrategy |
| Image/Video Posts | ContentService + multer middleware + Post model `mediaUrl` field |
| Real-time Chat | Socket.io attaches to same HTTP server in `server.js` |
| Admin Dashboard | User model has `role` field (enum: user, admin) from day 1 |
| Theme Switching | CSS custom properties defined globally, toggle via context |
| Aggregation Pipelines | Mongoose models indexed for aggregation-friendly queries |

---

## 7. Error Handling Strategy

### 7.1 Error Classification

| Error Type | HTTP Status | Code |
|---|---|---|
| Validation Error | 400 | `VALIDATION_ERROR` |
| Authentication Error | 401 | `UNAUTHORIZED` |
| Forbidden | 403 | `FORBIDDEN` |
| Not Found | 404 | `NOT_FOUND` |
| Conflict (duplicate) | 409 | `CONFLICT` |
| Rate Limited | 429 | `RATE_LIMITED` |
| Server Error | 500 | `INTERNAL_ERROR` |

### 7.2 Custom Error Class

```javascript
class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
  }
}
```

The global error handler differentiates **operational errors** (expected, send to client) from **programming errors** (unexpected, log and return generic 500).
