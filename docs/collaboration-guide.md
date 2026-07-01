# HashIn — Team Collaboration Guide

> **Team Size**: 2 developers  
> **Repo**: Single monorepo (`HashIn/`)  
> **Goal**: Work in parallel without stepping on each other's code, ship a working full-stack app

---

## 1. The Core Problem (and How We Solve It)

Two people, one repo, frontend + backend. Things that go wrong:

| Problem | Our Solution |
|---------|-------------|
| Both editing the same file → merge conflicts | **Feature branches** + domain ownership |
| Frontend built against wrong API shape | **API contract-first** — agree on spec before coding |
| "It works on my machine" | **Shared `.env.example`** + seed scripts |
| Backend changes break frontend silently | **Standardized API envelope** + integration testing |
| No one knows what the other is doing | **Daily 5-min sync** + branch naming convention |

---

## 2. Recommended Role Split

### Option A: Frontend / Backend Split (Recommended for P0)

```
┌──────────────────────────────────────────┐
│                                          │
│   Developer A: Backend Lead              │
│   ├── server/ (everything)               │
│   ├── Models, Services, Controllers      │
│   ├── Middleware, Auth, Validation        │
│   ├── API testing (Postman/Supertest)     │
│   └── Database design & seeding          │
│                                          │
│   Developer B: Frontend Lead             │
│   ├── client/ (everything)               │
│   ├── Pages, Components, Styling         │
│   ├── API integration (Axios)            │
│   ├── Auth context, routing              │
│   └── Responsive design, UX polish       │
│                                          │
│   SHARED responsibilities:               │
│   ├── docs/ — both contribute            │
│   ├── README.md                          │
│   ├── API contract reviews               │
│   └── Integration testing                │
│                                          │
└──────────────────────────────────────────┘
```

**Why this works:**
- Minimal file overlap — backend person stays in `server/`, frontend person stays in `client/`
- Merge conflicts are rare because you're editing different directories
- Clear ownership makes code review straightforward

### Option B: Feature-Based Split (Better for P1+)

Once P0 is stable, switch to feature-based ownership:

```
Developer A: Discovery Engine + Chat (P1)
  ├── server/src/services/discovery.service.js
  ├── server/src/services/chat.service.js
  ├── client/src/pages/DiscoveryPage.jsx
  └── client/src/pages/ChatPage.jsx

Developer B: Social Layer + Admin (P1)
  ├── server/src/services/social.service.js
  ├── server/src/services/admin.service.js
  ├── client/src/pages/ConnectionsPage.jsx
  └── client/src/pages/AdminPage.jsx
```

---

## 3. Git Workflow — Simplified Git Flow

### Branch Strategy

```
main                 (production-ready, protected)
  │
  ├── develop         (integration branch, where features merge)
  │     │
  │     ├── feat/auth-backend         (Developer A)
  │     ├── feat/auth-frontend        (Developer B)
  │     ├── feat/discovery-backend    (Developer A)
  │     ├── feat/discovery-frontend   (Developer B)
  │     ├── fix/login-validation      (whoever finds the bug)
  │     └── ...
  │
  └── release/v1.0    (when ready for demo/viva)
```

### Branch Naming Convention

```
feat/<feature-name>     → New feature          feat/auth-backend
fix/<bug-description>   → Bug fix              fix/token-refresh-loop
refactor/<area>         → Code cleanup         refactor/api-response-format
docs/<topic>            → Documentation        docs/api-spec-update
style/<area>            → UI/CSS changes       style/discovery-card-design
```

### Daily Workflow

```bash
# Start of day — always pull latest develop
git checkout develop
git pull origin develop

# Create your feature branch
git checkout -b feat/auth-backend

# Work... commit frequently with clear messages
git add .
git commit -m "feat(auth): add register endpoint with Zod validation"

# Push your branch
git push origin feat/auth-backend

# Create Pull Request on GitHub: feat/auth-backend → develop
# The other person reviews and approves
# Merge via GitHub (use "Squash and merge" for clean history)

# After merge, update your local develop
git checkout develop
git pull origin develop
```

### Commit Message Convention

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(auth): add JWT refresh token endpoint
fix(discovery): exclude self from candidate feed
style(profile): update skill badge colours
refactor(middleware): extract validation into factory function
docs(api): add connection endpoints to api-spec.md
chore(deps): update express to 4.19.2
```

Format: `type(scope): description`

| Type | When |
|------|------|
| `feat` | New feature |
| `fix` | Bug fix |
| `style` | CSS / visual changes (no logic) |
| `refactor` | Code change that neither fixes nor adds |
| `docs` | Documentation only |
| `chore` | Build, deps, config changes |
| `test` | Adding or updating tests |

---

## 4. The API Contract — How Frontend & Backend Stay in Sync

This is the **most critical piece** for a 2-person team. If the backend changes an API response shape and the frontend doesn't know, everything breaks.

### Step 1: Agree on the Contract First

Before anyone writes code for a feature, **both developers** review the endpoint spec in [api-spec.md](api-spec.md):

```
POST /api/auth/register

Request Body:
  { firstName, lastName, email, password }

Response 201:
  { success: true, data: { user: {...}, accessToken: "..." } }

Response 409:
  { success: false, error: { code: "CONFLICT", message: "Email already registered" } }
```

### Step 2: Backend Implements First (or Mock)

Two approaches:

**Approach A — Backend First (Recommended for P0):**
1. Backend developer implements the endpoint
2. Tests it with Postman and shares the collection
3. Frontend developer integrates against the live local API

**Approach B — Parallel with Mocks:**
1. Both agree on the API spec
2. Frontend creates mock responses and builds UI
3. Backend implements the real API
4. Frontend swaps mocks for real API calls

```javascript
// client/src/api/mocks/auth.mock.js (used during parallel development)
export const mockLoginResponse = {
  success: true,
  data: {
    user: { _id: "mock-1", firstName: "Jane", lastName: "Doe", email: "jane@test.com" },
    accessToken: "mock-token-xyz"
  },
  message: "Login successful"
};
```

### Step 3: Never Change the Contract Without Telling

> [!CAUTION]
> If a backend change modifies the response shape (renames a field, changes nesting, adds required fields), the frontend developer MUST be told **before** the PR is merged. Update `api-spec.md` in the same PR.

---

## 5. Environment Setup — Making "It Works on My Machine" Impossible

### Shared Configuration

```bash
# server/.env.example (committed to git)
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hashin_dev
ACCESS_TOKEN_SECRET=dev-access-secret-change-in-production
REFRESH_TOKEN_SECRET=dev-refresh-secret-change-in-production
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

```bash
# client/.env.example (committed to git)
VITE_API_URL=http://localhost:5000/api
```

**Rule**: `.env` is in `.gitignore`. `.env.example` is committed. When you clone, copy and fill in.

### Database Seeding

Create a seed script so both developers have the same test data:

```bash
# server/src/scripts/seed.js
# Populates: 10 test users with different skills, 
# some connections, some posts, some swipes
npm run seed
```

Both developers run `npm run seed` after setting up. Everyone starts from the same data state.

### Package Lock

**Always commit `package-lock.json`** (both server and client). This ensures both developers install identical dependency versions.

```bash
# If you add a new dependency
npm install zod          # This updates package-lock.json
git add package.json package-lock.json
git commit -m "chore(deps): add zod for validation"
```

---

## 6. Code Review Protocol

### PR Requirements

Every PR before merging to `develop` needs:

| Check | Who |
|-------|-----|
| Code works locally | Author (self-tested) |
| Code review (approval) | The other developer |
| No merge conflicts with develop | Author (rebase if needed) |
| Follows naming conventions | Reviewer checks |
| API spec matches implementation | Both verify |

### PR Template

```markdown
## What does this PR do?
Brief description of the change.

## Type
- [ ] Feature
- [ ] Bug Fix
- [ ] Refactor
- [ ] Docs

## Checklist
- [ ] Tested locally
- [ ] API spec updated (if backend change)
- [ ] No console.log left in code
- [ ] Follows project naming conventions
```

### Review Turnaround

- **Aim for < 4 hours** on review turnaround
- Small PRs (< 300 lines) — quick review, merge fast
- Large PRs — break into smaller pieces if possible
- Don't let PRs sit for days — stale branches = merge hell

---

## 7. Integration Points — Where Frontend Meets Backend

### The Connection Points

```
┌──────────────────────────────────────────────────┐
│                                                  │
│  Frontend (client/)         Backend (server/)    │
│                                                  │
│  axios.js ──────────────── app.js (CORS config)  │
│    baseURL: '/api'         origin: CLIENT_URL    │
│    withCredentials: true   credentials: true     │
│                                                  │
│  AuthContext.jsx ──────── auth.routes.js          │
│    stores user + token     /api/auth/*            │
│    handles refresh flow    Set-Cookie: refresh    │
│                                                  │
│  vite.config.js ──────── server.js               │
│    proxy: /api → :5000     listen(:5000)          │
│                                                  │
└──────────────────────────────────────────────────┘
```

### Critical Sync Points

1. **CORS**: Backend must allow `http://localhost:5173` with `credentials: true`
2. **Vite Proxy**: Frontend proxies `/api` to backend in development
3. **Cookie Path**: Refresh token cookie path must match the refresh endpoint
4. **Response Envelope**: Frontend expects `{ success, data, message }` — always

### Integration Testing Checklist

Before merging to `main` for demo/viva:

```
[ ] Register → Login → Token in cookie → Access protected route
[ ] Token expires → Auto-refresh → Retry original request
[ ] Invalid token → Redirect to login
[ ] Create post → Appears in feed
[ ] Discovery feed loads → Swipe → Records correctly
[ ] Send connection → Accept → Appears in connections list
[ ] CORS works (no browser errors)
[ ] Rate limiting works (429 on abuse)
[ ] Validation errors display correctly in UI
```

---

## 8. Sprint Coordination (2-Person)

### Sprint Plan — Who Does What

| Sprint | Developer A (Backend) | Developer B (Frontend) |
|--------|----------------------|----------------------|
| **1** | Project setup, DB config, models, middleware stack | Project setup, routing, auth pages UI, component library |
| **2** | Auth endpoints (register, login, refresh, logout) | Auth forms, AuthContext, protected routes |
| **3** | User profile endpoints, Zod validators | Profile page, edit profile, skill tags component |
| **4** | Discovery service (aggregation pipeline), swipe endpoint | Discovery page, swipe card UI, swipe physics |
| **5** | Connection endpoints (send, accept, reject, list) | Connections page (tabs, request cards) |
| **6** | Post endpoints (create, feed, like, delete) | Feed page, post card, create post form |
| **7** | Security hardening, error handling, seed script | Settings page, theme toggle, loading states, error states |
| **8** | Integration testing, API documentation final | Responsive design, polish, empty states, 404 page |
| **9** | Bug fixes from integration | Bug fixes from integration |
| **10** | Final testing, deployment prep | Final testing, demo prep |

### Daily Sync (5 minutes)

Every day, answer 3 questions (via message or quick call):

1. **What I did yesterday**
2. **What I'm doing today**
3. **Am I blocked on anything?**

Block = "I need an API endpoint that doesn't exist yet" or "I need the response format for X"

---

## 9. Tools for Collaboration

| Need | Tool | Why |
|------|------|-----|
| Version control | **GitHub** | PRs, code review, branch protection |
| API testing | **Postman** (shared collection) | Backend tests endpoints, shares collection with frontend |
| Communication | **WhatsApp / Discord** | Quick questions, "I just pushed X" |
| Task tracking | **GitHub Issues** or **Notion** | Track what's done, what's left |
| API documentation | **api-spec.md** (in repo) | Single source of truth for both |
| Design reference | **ui-ux-architecture.md** (in repo) | Both reference the same design spec |

---

## 10. .gitignore

```gitignore
# Dependencies
node_modules/

# Environment
.env
.env.local

# Build output
dist/
build/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*

# Coverage
coverage/

# Temp
tmp/
temp/
```

---

## 11. Emergency Protocols

### "I Accidentally Pushed to Main"

```bash
# Don't panic. Revert the commit.
git checkout main
git revert HEAD
git push origin main
# Then cherry-pick your commit to the correct feature branch
```

### "We Have a Merge Conflict"

```bash
# On your feature branch
git checkout develop
git pull origin develop
git checkout feat/your-feature
git rebase develop
# Resolve conflicts file by file
# Test everything locally
git push --force-with-lease origin feat/your-feature
```

### "Something Broke After Merging"

```bash
# Option 1: Revert the merge commit on develop
git checkout develop
git revert -m 1 <merge-commit-hash>
git push origin develop

# Option 2: Fix forward (quick hotfix)
git checkout -b fix/broken-thing
# Fix the issue
git push origin fix/broken-thing
# PR into develop immediately
```

### "My Partner's Branch is Outdated"

```bash
# Don't merge their old branch. Ask them to rebase:
git checkout feat/their-branch
git rebase develop
git push --force-with-lease origin feat/their-branch
```
