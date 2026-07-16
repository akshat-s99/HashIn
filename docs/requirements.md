# HashIn — Software Requirements Specification (SRS)

> **Version**: 1.0  
> **Date**: 2026-07-01  
> **Status**: Draft  
> **Project**: HashIn — Professional Developer Networking Platform

---

## 1. Introduction

### 1.1 Purpose
This document defines the functional and non-functional requirements for **HashIn**, a professional networking platform designed for developers to connect, network, and showcase their work through a skill-based discovery system.

### 1.2 Scope
HashIn is a full-stack web application (MERN) targeting developers seeking professional connections based on shared technical skills. This document covers the **P0 (Launch-Ready)** feature set with architectural provisions for P1/P2 features.

### 1.3 Definitions & Acronyms

| Term | Definition |
|---|---|
| **Discovery** | Swipe-based mechanism to find developers with matching skills |
| **Connection** | A confirmed professional link between two users |
| **Feed** | Chronological stream of text posts from connections |
| **Swipe** | A user action (like/pass) on a discovered profile |
| **JWT** | JSON Web Token — used for stateless authentication |

---

## 2. Stakeholders

| Role | Description |
|---|---|
| Developer User | Primary user — registers, creates profile, discovers peers |
| Admin | Future role — content moderation, user management (P1) |
| Evaluator/Viva Panel | Academic evaluators assessing the project |

---

## 3. Functional Requirements

### 3.1 Authentication System (AUTH)

| ID | Requirement | Priority |
|---|---|---|
| AUTH-01 | Users can register with email, password, first name, and last name | P0 |
| AUTH-02 | Users can log in with email and password | P0 |
| AUTH-03 | System issues JWT access token (15min) and refresh token (7d) | P0 |
| AUTH-04 | Refresh token is stored in httpOnly cookie | P0 |
| AUTH-05 | Users can log out (invalidate refresh token) | P0 |
| AUTH-06 | All protected routes require valid access token | P0 |
| AUTH-07 | Google OAuth login | P1 |

**Acceptance Criteria (AUTH):**
- [ ] Registration with duplicate email returns 409 Conflict
- [ ] Login with wrong password returns 401 Unauthorized
- [ ] Expired access token returns 401 with "TOKEN_EXPIRED" code
- [ ] Refresh endpoint issues new access token with valid refresh token
- [ ] Logged-out refresh token cannot be reused

### 3.2 User Profile (PROFILE)

| ID | Requirement | Priority |
|---|---|---|
| PROF-01 | Users can view their own profile | P0 |
| PROF-02 | Users can update profile fields (headline, about, skills, links) | P0 |
| PROF-03 | Users can view other users' public profiles | P0 |
| PROF-04 | Skills are stored as an array of strings | P0 |
| PROF-05 | Profile includes optional GitHub, LinkedIn, and portfolio URLs | P0 |
| PROF-06 | Profile picture upload | P1 |

**Acceptance Criteria (PROFILE):**
- [ ] Profile update with invalid URL format returns 400
- [ ] Skills array accepts 1–15 skills
- [ ] Viewing another user's profile does not expose password or tokens

### 3.3 Discovery Engine (DISCOVERY)

| ID | Requirement | Priority |
|---|---|---|
| DISC-01 | System presents candidate profiles ranked by skill overlap | P0 |
| DISC-02 | Users can swipe "like" or "pass" on candidates | P0 |
| DISC-03 | Swiped users are excluded from future discovery results | P0 |
| DISC-04 | Discovery feed returns max 20 candidates per request | P0 |
| DISC-05 | When both users "like" each other, system auto-creates a pending connection | P0 |
| DISC-06 | Location-based filtering | P2 |

**Acceptance Criteria (DISCOVERY):**
- [ ] User does not see themselves in discovery
- [ ] Previously swiped users do not reappear
- [ ] Candidates are sorted by skill match score (descending)
- [ ] Mutual like triggers connection request creation

### 3.4 Professional Networking — Connections (SOCIAL)

| ID | Requirement | Priority |
|---|---|---|
| SOC-01 | Users can send a connection request to another user | P0 |
| SOC-02 | Users can accept a pending connection request | P0 |
| SOC-03 | Users can reject a pending connection request | P0 |
| SOC-04 | Users can view their list of accepted connections | P0 |
| SOC-05 | Users can view pending sent/received requests | P0 |
| SOC-06 | Users cannot send duplicate connection requests | P0 |
| SOC-07 | Users can remove an existing connection | P0 |

**Acceptance Criteria (SOCIAL):**
- [ ] Sending request to already-connected user returns 409
- [ ] Only the receiver can accept/reject a request
- [ ] Accepting a request changes status to "accepted"
- [ ] Connection list returns populated user profiles

### 3.5 Content System — Posts & Feed (CONTENT)

| ID | Requirement | Priority |
|---|---|---|
| CON-01 | Users can create text-only posts (max 500 chars) | P0 |
| CON-02 | Users can delete their own posts | P0 |
| CON-03 | Users can view a feed of posts from their connections | P0 |
| CON-04 | Users can like/unlike a post | P0 |
| CON-05 | Feed is paginated (cursor-based or offset) | P0 |
| CON-06 | Posts support images and videos | P1 |
| CON-07 | Pinterest-style masonry feed layout | P1 |

**Acceptance Criteria (CONTENT):**
- [ ] Post with empty content returns 400
- [ ] Post with > 500 chars returns 400
- [ ] Feed only shows posts from accepted connections + own posts
- [ ] Like toggles (like → unlike on second call)
- [ ] Deleted post returns 404 on subsequent fetch

---

## 4. Non-Functional Requirements

### 4.1 Performance

| ID | Requirement | Target |
|---|---|---|
| PERF-01 | API response time for discovery feed | < 500ms |
| PERF-02 | API response time for standard CRUD | < 200ms |
| PERF-03 | Discovery aggregation pipeline | Indexed, < 500ms for 10K users |
| PERF-04 | Frontend initial load (LCP) | < 2.5s |

### 4.2 Security

| ID | Requirement |
|---|---|
| SEC-01 | Passwords hashed with bcrypt (12 salt rounds) |
| SEC-02 | All inputs validated with Zod schemas |
| SEC-03 | HTTP headers secured with Helmet |
| SEC-04 | Rate limiting: 100 req/15min per IP (general), 5 req/15min (auth) |
| SEC-05 | CORS configured for client origin only |
| SEC-06 | Refresh tokens stored in httpOnly, secure, sameSite cookies |
| SEC-07 | No sensitive data in JWT payload (no password, no tokens) |

### 4.3 Reliability

| ID | Requirement |
|---|---|
| REL-01 | MongoDB connection retry on failure |
| REL-02 | Global error handler catches unhandled exceptions |
| REL-03 | Graceful shutdown on SIGTERM |

### 4.4 Maintainability

| ID | Requirement |
|---|---|
| MAIN-01 | Service-Oriented MVC architecture |
| MAIN-02 | Consistent file naming conventions (kebab-case.type.js) |
| MAIN-03 | Standardized API response envelope |
| MAIN-04 | Environment variables validated at startup |

---

## 5. System Constraints

| Constraint | Detail |
|---|---|
| **Tech Stack** | Node.js, Express.js, MongoDB, React, Vite |
| **Styling** | Bootstrap 5 + Vanilla CSS (Tailwind optional) |
| **Database** | MongoDB (Mongoose ODM) |
| **Authentication** | JWT (access + refresh tokens) |
| **Validation** | Zod |
| **Deployment** | Local development (production deploy out of P0 scope) |

---

## 6. Traceability Matrix

| Feature Area | Requirements | Models | Services | Routes |
|---|---|---|---|---|
| Authentication | AUTH-01 to AUTH-06 | User | AuthService | /api/auth/* |
| User Profile | PROF-01 to PROF-05 | User | UserService | /api/users/* |
| Discovery | DISC-01 to DISC-05 | User, Swipe | DiscoveryService | /api/discovery/* |
| Connections | SOC-01 to SOC-07 | Connection | SocialService | /api/connections/* |
| Content/Feed | CON-01 to CON-05 | Post | ContentService | /api/posts/* |
