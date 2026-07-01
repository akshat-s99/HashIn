# HashIn — Frontend UI/UX Architecture

> **Version**: 1.0  
> **Date**: 2026-07-01  
> **Status**: Draft — awaiting user reference/inspiration inputs  
> **Design Philosophy**: Developer-first, premium, intentional — not generic, not "AI-ish"

---

## 1. Design Principles

These five rules govern every UI decision:

| # | Principle | What It Means |
|---|-----------|---------------|
| 1 | **Intentional, not decorative** | Every element earns its place. No gradients for the sake of gradients. Whitespace is a feature. |
| 2 | **Developer identity** | The platform should feel like it was built *by* developers *for* developers. Monospace accents, code-editor undertones, subtle terminal aesthetics. |
| 3 | **Quiet confidence** | Premium doesn't mean loud. Think Linear, Vercel, Raycast — not Dribbble fantasy UI. Muted tones, sharp typography, purposeful motion. |
| 4 | **Content-first hierarchy** | Skills, headlines, and posts are the hero — not the chrome around them. The UI frames content, never competes with it. |
| 5 | **Functional beauty** | Animations serve navigation (page transitions, swipe physics). They communicate state, not just delight. |

---

## 2. Typography

### Font Stack

| Role | Font | Weight(s) | Why |
|------|------|-----------|-----|
| **Headings** | [Outfit](https://fonts.google.com/specimen/Outfit) | 600, 700 | Geometric sans-serif. Modern, clean, distinctive. Slightly rounded terminals give warmth without being playful. |
| **Body / UI** | [Inter](https://fonts.google.com/specimen/Inter) | 400, 500, 600 | The industry standard for UI text. Exceptional legibility at small sizes. Variable font for precision. |
| **Code / Skills / Tags** | [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) | 400, 500 | Developer identity. Used for skill tags, code snippets, usernames. Instantly signals "this is a dev platform." |

### Type Scale (rem-based, 16px root)

```
--text-xs:    0.75rem   (12px)  — Captions, timestamps
--text-sm:    0.875rem  (14px)  — Secondary text, labels
--text-base:  1rem      (16px)  — Body text, paragraphs
--text-lg:    1.125rem  (18px)  — Subheadings, card titles
--text-xl:    1.25rem   (20px)  — Section headers
--text-2xl:   1.5rem    (24px)  — Page titles
--text-3xl:   1.875rem  (30px)  — Hero text
--text-4xl:   2.25rem   (36px)  — Landing page hero only
```

### Usage Rules
- Headings: `Outfit` at 600–700 weight, tight letter-spacing (`-0.02em`)
- Body: `Inter` at 400 weight, normal letter-spacing
- Skill tags: `JetBrains Mono` at 400 weight inside pill-shaped badges
- Never use more than 3 font sizes on a single screen
- Line height: 1.5 for body, 1.2 for headings

---

## 3. Colour Palette

### Philosophy
No pure black. No pure white. No saturated primaries. Colours are muted, layered, and have **undertones** — they feel like they belong in the same room.

### Dark Mode (Default)

```
┌────────────────────────────────────────────────────────────┐
│  DARK MODE — "Midnight Slate"                              │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Backgrounds                                               │
│  ├── --bg-primary:    #0c0c14    Deep ink (page bg)        │
│  ├── --bg-secondary:  #141420    Raised surfaces (cards)   │
│  ├── --bg-tertiary:   #1c1c2e    Hover states, wells       │
│  └── --bg-elevated:   #24243a    Modals, dropdowns         │
│                                                            │
│  Borders & Dividers                                        │
│  ├── --border-subtle: #2a2a40    Card borders               │
│  └── --border-active: #3d3d5c    Focus rings, active        │
│                                                            │
│  Text                                                      │
│  ├── --text-primary:  #e8e8ed    Headings, primary content  │
│  ├── --text-secondary:#9898a8    Descriptions, labels       │
│  ├── --text-tertiary: #5c5c72    Placeholders, disabled     │
│  └── --text-inverse:  #0c0c14    Text on bright buttons     │
│                                                            │
│  Accent — Brand                                            │
│  ├── --accent-primary:   #7c6aef  Muted indigo (CTAs)      │
│  ├── --accent-hover:     #9585f5  Lighter on hover          │
│  ├── --accent-subtle:    #7c6aef1a  10% opacity (badges)   │
│  └── --accent-secondary: #ef8c6a  Warm coral (notifications,│
│                                    match alerts)            │
│                                                            │
│  Semantic                                                  │
│  ├── --success:  #4ade80    Connections accepted            │
│  ├── --warning:  #fbbf24    Pending states                  │
│  ├── --error:    #f87171    Validation, rejections          │
│  └── --info:     #60a5fa    Informational toasts            │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Light Mode

```
┌────────────────────────────────────────────────────────────┐
│  LIGHT MODE — "Paper & Ink"                                │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Backgrounds                                               │
│  ├── --bg-primary:    #f8f8fa    Warm off-white (page bg)  │
│  ├── --bg-secondary:  #ffffff    Cards, surfaces            │
│  ├── --bg-tertiary:   #f0f0f5    Hover, input backgrounds   │
│  └── --bg-elevated:   #ffffff    Modals (with shadow)       │
│                                                            │
│  Borders & Dividers                                        │
│  ├── --border-subtle: #e4e4eb    Card borders               │
│  └── --border-active: #c8c8d6    Focus rings                │
│                                                            │
│  Text                                                      │
│  ├── --text-primary:  #18181b    Near-black (headings)      │
│  ├── --text-secondary:#52525b    Descriptions               │
│  ├── --text-tertiary: #a1a1aa    Placeholders               │
│  └── --text-inverse:  #ffffff    Text on dark buttons        │
│                                                            │
│  Accent — same hue, adjusted for light bg                  │
│  ├── --accent-primary:   #6355d8  Slightly deeper indigo    │
│  ├── --accent-hover:     #5346c4  Darker on hover           │
│  ├── --accent-subtle:    #6355d81a  10% opacity             │
│  └── --accent-secondary: #d9734e  Warmer coral              │
│                                                            │
│  Semantic — same as dark mode (high enough contrast)       │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Why This Palette Works
- **No pure extremes**: `#0c0c14` instead of `#000000`, `#f8f8fa` instead of `#ffffff` — avoids harshness
- **Blue undertones in dark mode**: Feels like a code editor (VS Code Dark+, Fleet, Warp Terminal)
- **Warm accent pair**: Indigo + coral creates visual tension without clashing — indigo for actions, coral for attention
- **Semantic colours are universal**: Same green/yellow/red across themes

---

## 4. Page Architecture — Complete Sitemap

### 4.1 Page Inventory

```
HashIn/
├── PUBLIC (no auth required)
│   ├── /login              → Login Page
│   ├── /register           → Registration Page
│   └── /forgot-password    → Password Reset (P1)
│
├── ONBOARDING (auth required, incomplete profile)
│   └── /onboarding         → Profile Setup Wizard (skills, bio, links)
│
├── CORE APP (auth required, profile complete)
│   ├── /                   → Home / Feed Page
│   ├── /discover           → Discovery / Swipe Page
│   ├── /connections        → Connections Page (tabs: all / pending / sent)
│   ├── /profile            → Own Profile Page (view mode)
│   ├── /profile/edit       → Edit Profile Page
│   ├── /profile/:userId    → Other User's Profile Page
│   ├── /messages           → Chat Page (P1 — real-time messaging)
│   ├── /settings           → Settings Page (account, theme, privacy)
│   └── /notifications      → Notifications Page (P1)
│
├── ADMIN (role === 'admin')
│   ├── /admin              → Admin Dashboard
│   ├── /admin/users        → User Management
│   └── /admin/reports      → Content Moderation (P1)
│
└── SYSTEM
    └── /*                  → 404 Not Found Page
```

### 4.2 Page Wireframes & Specifications

---

#### 🔐 LOGIN PAGE (`/login`)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                    ┌──────────────────────┐                      │
│                    │      HashIn Logo     │                      │
│                    │                      │                      │
│                    │   "Connect with      │                      │
│                    │    developers who     │                      │
│                    │    share your stack"  │                      │
│                    │                      │                      │
│                    │  ┌────────────────┐  │                      │
│                    │  │  Email         │  │                      │
│                    │  └────────────────┘  │                      │
│                    │  ┌────────────────┐  │                      │
│                    │  │  Password  👁   │  │                      │
│                    │  └────────────────┘  │                      │
│                    │                      │                      │
│                    │  [  Sign In        ] │  ← accent-primary    │
│                    │                      │                      │
│                    │  ─── or continue ─── │                      │
│                    │                      │                      │
│                    │  [G  Google Sign In] │  ← P1 (greyed/hidden)│
│                    │                      │                      │
│                    │  Don't have account? │                      │
│                    │  Register →          │                      │
│                    └──────────────────────┘                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Design Notes:**
- Centered card layout, generous padding
- Subtle background — soft gradient or grain texture (not an illustration)
- Logo + tagline above form — sets tone immediately
- Password toggle (eye icon) for UX
- Form validation: inline errors below each field, red border
- Google Sign In button appears in P1 (architect the space now)

---

#### 📝 REGISTRATION PAGE (`/register`)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                    ┌──────────────────────┐                      │
│                    │    Join HashIn        │                      │
│                    │                      │                      │
│                    │  ┌──────┐ ┌──────┐   │                      │
│                    │  │First │ │Last  │   │  ← Side by side      │
│                    │  └──────┘ └──────┘   │                      │
│                    │  ┌────────────────┐  │                      │
│                    │  │  Email         │  │                      │
│                    │  └────────────────┘  │                      │
│                    │  ┌────────────────┐  │                      │
│                    │  │  Password  👁   │  │                      │
│                    │  └────────────────┘  │                      │
│                    │  ┌────────────────┐  │                      │
│                    │  │Confirm Pass 👁  │  │                      │
│                    │  └────────────────┘  │                      │
│                    │                      │                      │
│                    │  Password strength:  │                      │
│                    │  [████████░░] Strong  │ ← Visual indicator  │
│                    │                      │                      │
│                    │  [  Create Account ] │                      │
│                    │                      │                      │
│                    │  Already a member?   │                      │
│                    │  Sign in →           │                      │
│                    └──────────────────────┘                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Design Notes:**
- Same centered card as login — visual consistency
- Password strength meter (colour-coded bar: red → amber → green)
- Confirm password field prevents typos
- After successful registration → redirect to `/onboarding`

---

#### 🧭 ONBOARDING PAGE (`/onboarding`)

```
┌──────────────────────────────────────────────────────────────────┐
│  Step 1 of 3  ───●─────────○─────────○                           │
│                                                                  │
│  "Let's set up your developer profile"                           │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │                                                            │   │
│  │  Headline                                                  │   │
│  │  ┌──────────────────────────────────────────────────────┐  │   │
│  │  │  e.g. "Full Stack Developer | React & Node.js"      │  │   │
│  │  └──────────────────────────────────────────────────────┘  │   │
│  │                                                            │   │
│  │  Bio                                                       │   │
│  │  ┌──────────────────────────────────────────────────────┐  │   │
│  │  │                                                      │  │   │
│  │  │  Tell us about yourself...                           │  │   │
│  │  │                                                      │  │   │
│  │  └──────────────────────────────────────────────────────┘  │   │
│  │  238 / 500 characters                                      │   │
│  │                                                            │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                  │
│                                         [ Skip ]  [ Next → ]     │
└──────────────────────────────────────────────────────────────────┘

Step 2: Skills (tag input — type and press Enter)
Step 3: Links (GitHub, LinkedIn, Portfolio URLs)
```

**Design Notes:**
- 3-step wizard with progress indicator
- Each step is skippable (profile can be completed later in settings)
- Skill input: type → autocomplete suggestions → Enter to add → pills with × to remove
- On final step, preview the profile card as it will appear in Discovery
- After completion → redirect to `/discover` (start discovering immediately)

---

#### 🏠 HOME / FEED PAGE (`/`)

```
┌──────────────────────────────────────────────────────────────────┐
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  HashIn   [🔍 Search]              🔔  👤  ⚙️             │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────┐  ┌──────────────────────────────┐  ┌──────────┐   │
│  │          │  │                              │  │          │   │
│  │  Left    │  │  ┌──────────────────────┐    │  │  Right   │   │
│  │  Sidebar │  │  │  What's on your mind? │    │  │  Sidebar │   │
│  │          │  │  │  [  Post  ]           │    │  │          │   │
│  │  ┌─────┐ │  │  └──────────────────────┘    │  │  Trending│   │
│  │  │ Me  │ │  │                              │  │  Skills  │   │
│  │  │     │ │  │  ┌──────────────────────┐    │  │          │   │
│  │  │Jane │ │  │  │ 👤 John Doe          │    │  │  #React  │   │
│  │  │Dev  │ │  │  │ Full Stack Developer │    │  │  #Node   │   │
│  │  └─────┘ │  │  │                      │    │  │  #Python │   │
│  │          │  │  │ Just shipped v2.0 of  │    │  │  #AI     │   │
│  │  5       │  │  │ my portfolio site!    │    │  │          │   │
│  │  connect │  │  │                      │    │  │  ──────  │   │
│  │  ions    │  │  │ ♡ 12  💬 3   ↗ Share │    │  │          │   │
│  │          │  │  └──────────────────────┘    │  │  Suggest- │   │
│  │  12      │  │                              │  │  ed       │   │
│  │  posts   │  │  ┌──────────────────────┐    │  │  Connects │   │
│  │          │  │  │  Next post...        │    │  │          │   │
│  │          │  │  └──────────────────────┘    │  │  [View →] │   │
│  │          │  │                              │  │          │   │
│  └──────────┘  └──────────────────────────────┘  └──────────┘   │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  🏠 Home   🧭 Discover   👥 Connections   💬 Chat   👤    │   │
│  └────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

**Layout:**
- 3-column on desktop (sidebar | feed | widgets), single-column on mobile
- Left sidebar: mini profile card, quick stats, navigation
- Center: Create post box (collapses to a single-line prompt, expands on click) + infinite-scroll feed
- Right sidebar: trending skills, suggested connections (P1 can add ad slots)
- Bottom nav bar on mobile (replaces sidebars)

**Post Card Anatomy:**
- Author avatar + name + headline + timestamp (relative: "2h ago")
- Post content (text, max 500 chars with "Read more" truncation at 200)
- Action bar: Like (heart icon + count), Comment (P1), Share (P1)
- Like animation: subtle scale + colour fill (not a jarring bounce)

---

#### 🧭 DISCOVERY / SWIPE PAGE (`/discover`)

```
┌──────────────────────────────────────────────────────────────────┐
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  HashIn   ← Discovery                    🔔  👤            │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                  │
│                 ┌──────────────────────────┐                      │
│                 │                          │                      │
│                 │     ┌──────────────┐     │                      │
│                 │     │              │     │                      │
│                 │     │   Avatar /   │     │                      │
│                 │     │   Initials   │     │                      │
│                 │     │              │     │                      │
│                 │     └──────────────┘     │                      │
│                 │                          │                      │
│                 │     Jane Smith           │                      │
│                 │     Backend Engineer     │                      │
│                 │     Mumbai, India        │                      │
│                 │                          │                      │
│                 │  ┌──────┐ ┌──────┐      │                      │
│                 │  │Node  │ │Python│      │  ← JetBrains Mono   │
│                 │  └──────┘ └──────┘      │    skill pills      │
│                 │  ┌──────┐ ┌──────┐      │                      │
│                 │  │React │ │Mongo │      │                      │
│                 │  └──────┘ └──────┘      │                      │
│                 │                          │                      │
│                 │  Match: ███░░  3/5       │  ← skill overlap    │
│                 │  common skills           │    indicator        │
│                 │                          │                      │
│                 └──────────────────────────┘                      │
│                                                                  │
│              [ ✕ Pass ]              [ ✓ Connect ]               │
│                 grey                    accent                    │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Interactions:**
- Card is swipeable (drag left = pass, drag right = like) with spring physics
- Keyboard accessible: ← = pass, → = like
- Card stack: 3 cards visible (current + 2 stacked behind, slightly offset)
- On mutual match: overlay modal with confetti-free celebration (just a clean "It's a match!" modal with the two profile cards side by side)
- Match score bar: visual indicator of skill overlap (e.g., 3 out of 5 skills match)
- Empty state: "No more developers to discover. Check back later!" with illustration

**Swipe Physics:**
- Card follows finger/cursor with slight rotation (max ±15°)
- Background colour tint shifts: greenish tint (right/like), reddish tint (left/pass)
- Release threshold: 40% of card width to confirm action, else spring back
- Exit animation: card flies off-screen in swipe direction with deceleration

---

#### 👤 PROFILE PAGE (`/profile` and `/profile/:userId`)

```
┌──────────────────────────────────────────────────────────────────┐
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  HashIn   ← Back                         🔔  ⚙️            │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │                                                            │   │
│  │  ┌──────────┐  Jane Smith                                  │   │
│  │  │          │  Backend Engineer @ Acme Corp                │   │
│  │  │  Avatar  │  Mumbai, India                               │   │
│  │  │          │                                              │   │
│  │  └──────────┘  🔗 github  🔗 linkedin  🔗 portfolio       │   │
│  │                                                            │   │
│  │  [ Edit Profile ]  or  [ Connect ✓ ] / [ Pending ⏳ ]      │   │
│  │                                                            │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────┐  ┌──────────────────────────────┐      │
│  │  Skills              │  │  About                       │      │
│  │                      │  │                              │      │
│  │  ┌──────┐ ┌──────┐  │  │  Passionate backend          │      │
│  │  │React │ │Node  │  │  │  engineer with 3 years       │      │
│  │  └──────┘ └──────┘  │  │  of experience building      │      │
│  │  ┌──────┐ ┌──────┐  │  │  scalable APIs...            │      │
│  │  │Python│ │AWS   │  │  │                              │      │
│  │  └──────┘ └──────┘  │  │                              │      │
│  └──────────────────────┘  └──────────────────────────────┘      │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  Posts (12)                                                │   │
│  │  ┌──────────────────────────────────────────────────────┐  │   │
│  │  │  Post content here...                                │  │   │
│  │  │  ♡ 5   • 2 hours ago                                 │  │   │
│  │  └──────────────────────────────────────────────────────┘  │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Own Profile vs. Other's Profile:**
- Own: Shows "Edit Profile" button, all posts
- Other's: Shows "Connect" / "Pending" / "Connected" button based on state
- Connection state button is a state machine:
  - No relation → `[ Connect ]` (accent-primary)
  - Request sent → `[ Pending ⏳ ]` (warning outline)
  - Connected → `[ Connected ✓ ]` (success outline) + `[ Message ]` (P1)
  - Received request → `[ Accept ]` + `[ Decline ]`

---

#### 👥 CONNECTIONS PAGE (`/connections`)

```
┌──────────────────────────────────────────────────────────────────┐
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  HashIn   Connections                     🔔  👤            │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  [ All (23) ]  [ Received (3) ]  [ Sent (2) ]              │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐     │
│  │  👤 John Doe · Full Stack Developer                      │     │
│  │  Skills: React, Node.js, MongoDB                         │     │
│  │  Connected 2 weeks ago              [ View ] [ Remove ]  │     │
│  └──────────────────────────────────────────────────────────┘     │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐     │
│  │  👤 Alice Chen · ML Engineer                              │     │
│  │  Skills: Python, TensorFlow                              │     │
│  │  Connected 1 month ago              [ View ] [ Remove ]  │     │
│  └──────────────────────────────────────────────────────────┘     │
│                                                                  │
│  "Received" Tab:                                                 │
│  ┌──────────────────────────────────────────────────────────┐     │
│  │  👤 Bob Park · DevOps Engineer                            │     │
│  │  Wants to connect         [ Accept ✓ ]  [ Decline ✕ ]   │     │
│  └──────────────────────────────────────────────────────────┘     │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Design Notes:**
- Tab navigation: All / Received / Sent — count badges on tabs
- Each connection card: avatar, name, headline, shared skills, action buttons
- Search/filter bar at top of list (search by name or skill)
- Accept/Decline buttons on received tab
- "Cancel Request" on sent tab

---

#### ⚙️ SETTINGS PAGE (`/settings`)

```
┌──────────────────────────────────────────────────────────────────┐
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  HashIn   Settings                        🔔  👤            │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────┐  ┌──────────────────────────────────────────────┐  │
│  │          │  │                                              │  │
│  │ Account  │  │  Account Settings                            │  │
│  │ ───────  │  │                                              │  │
│  │ Appear-  │  │  Email: jane@example.com     [ Change ]     │  │
│  │ ance     │  │  Password: ••••••••          [ Change ]     │  │
│  │ ───────  │  │                                              │  │
│  │ Privacy  │  │  ─────────────────────────────────────────   │  │
│  │ ───────  │  │                                              │  │
│  │ Linked   │  │  Connected Accounts                         │  │
│  │ Accounts │  │  Google: Not connected      [ Connect ]     │  │
│  │ ───────  │  │                                              │  │
│  │ Danger   │  │  ─────────────────────────────────────────   │  │
│  │ Zone     │  │                                              │  │
│  │          │  │  Danger Zone                                 │  │
│  │          │  │  [ Delete Account ]  ← red, with confirm     │  │
│  │          │  │                                              │  │
│  └──────────┘  └──────────────────────────────────────────────┘  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Sections:**
1. **Account**: Email, password change
2. **Appearance**: Theme toggle (Light / Dark / System), density (Comfortable / Compact)
3. **Privacy**: Profile visibility, discovery opt-in/out
4. **Linked Accounts**: Google OAuth connection (P1)
5. **Danger Zone**: Account deletion (with "type your email to confirm" pattern)

---

#### 💬 CHAT / MESSAGES PAGE (`/messages`) — P1

```
┌──────────────────────────────────────────────────────────────────┐
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  HashIn   Messages                        🔔  👤            │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌───────────────┐  ┌────────────────────────────────────────┐   │
│  │  Conversations │  │  John Doe · Online 🟢                 │   │
│  │               │  │  ─────────────────────────────────────  │   │
│  │  🔍 Search     │  │                                        │   │
│  │               │  │  Hey! I saw we both use React and       │   │
│  │  John Doe  🟢 │  │  Node. Would love to collaborate!      │   │
│  │  "Hey! I s.." │  │                              2:30 PM   │   │
│  │  2 min ago    │  │                                        │   │
│  │  ───────────  │  │       That sounds great! I'm working   │   │
│  │  Alice Chen   │  │       on an open-source project right   │   │
│  │  "Thanks f.." │  │       now actually.            2:32 PM │   │
│  │  1 hour ago   │  │                                        │   │
│  │               │  │  ─────────────────────────────────────  │   │
│  │               │  │  ┌────────────────────────────┐ [ ➤ ]  │   │
│  │               │  │  │ Type a message...          │        │   │
│  │               │  │  └────────────────────────────┘        │   │
│  └───────────────┘  └────────────────────────────────────────┘   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Design Notes (P1):**
- Only connected users can message each other
- Real-time via Socket.io
- Conversation list on left, chat window on right
- Mobile: conversation list → tap → full-screen chat view
- Online status indicator (green dot)
- Typing indicator ("John is typing...")
- Message timestamps grouped by day

---

#### 🛡️ ADMIN DASHBOARD (`/admin`) — P1

```
┌──────────────────────────────────────────────────────────────────┐
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  HashIn Admin                              👤 Admin User    │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────┐  ┌──────────────────────────────────────────────┐  │
│  │          │  │                                              │  │
│  │ Overview │  │  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐        │  │
│  │ ───────  │  │  │ 247 │  │ 89  │  │ 156 │  │ 42  │        │  │
│  │ Users    │  │  │Users│  │Today│  │Conn.│  │Posts│        │  │
│  │ ───────  │  │  └─────┘  └─────┘  └─────┘  └─────┘        │  │
│  │ Posts    │  │                                              │  │
│  │ ───────  │  │  ┌──────────────────────────────────────┐    │  │
│  │ Reports  │  │  │  User Growth (Chart)                 │    │  │
│  │          │  │  │  ┌───────────────────────────────┐    │    │  │
│  │          │  │  │  │  📈                            │    │    │  │
│  │          │  │  │  └───────────────────────────────┘    │    │  │
│  │          │  │  └──────────────────────────────────────┘    │  │
│  │          │  │                                              │  │
│  │          │  │  Recent Registrations                        │  │
│  │          │  │  ┌──────────────────────────────────────┐    │  │
│  │          │  │  │  Name   │ Email  │ Date  │ Actions   │    │  │
│  │          │  │  │  ───────│────────│───────│───────    │    │  │
│  │          │  │  │  ...    │  ...   │  ...  │ Ban/Edit  │    │  │
│  │          │  │  └──────────────────────────────────────┘    │  │
│  └──────────┘  └──────────────────────────────────────────────┘  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Admin capabilities (P1):**
- Dashboard: stat cards (total users, active today, connections, posts)
- User Management: search, view profile, ban/unban, promote to admin
- Content Moderation: flagged posts, delete inappropriate content
- Protected by RBAC middleware: `role === 'admin'` check

---

#### 🚫 404 PAGE

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│                         404                                      │
│                                                                  │
│              "This page doesn't exist."                          │
│              "Maybe the developer who built                      │
│               it swiped left."                                   │
│                                                                  │
│                    [ Go Home ]                                    │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Component Library (Design System)

### 5.1 Core Components

| Component | Variants | Used In |
|-----------|----------|---------|
| `Button` | primary, secondary, outline, ghost, danger | Everywhere |
| `Input` | text, email, password (with toggle), textarea | Forms |
| `Card` | base, post, profile, connection, discovery | Feed, Profiles, Discovery |
| `Badge / Pill` | skill, status (pending/accepted/rejected), count | Profiles, Connections |
| `Avatar` | xs, sm, md, lg, xl — with initials fallback | Everywhere |
| `Navbar` | desktop (horizontal), mobile (bottom tab bar) | App shell |
| `Modal` | confirmation, form, match celebration | Actions |
| `Toast` | success, error, warning, info | Notifications |
| `Tabs` | underline style, with count badges | Connections, Settings |
| `Skeleton` | card, text, avatar — shimmer animation | Loading states |
| `EmptyState` | illustration + message + CTA | All list pages |
| `Dropdown` | menu, select | Navbar, Settings |

### 5.2 Button Variants

```
Primary:     [████████████]  bg: accent-primary, text: white
             Solid fill. Main CTAs (Sign In, Post, Connect)

Secondary:   [░░░░░░░░░░░░]  bg: bg-tertiary, text: text-primary
             Muted fill. Secondary actions (Cancel, Skip)

Outline:     [┌──────────┐]  border: border-active, text: accent-primary
             Border only. Tertiary actions (View Profile)

Ghost:       [            ]  bg: transparent, text: text-secondary
             No border. Icon buttons, subtle links

Danger:      [████████████]  bg: error, text: white
             Destructive. Delete, Remove, Ban
```

### 5.3 Spacing System

```
--space-1:   0.25rem   (4px)
--space-2:   0.5rem    (8px)
--space-3:   0.75rem   (12px)
--space-4:   1rem      (16px)
--space-5:   1.25rem   (20px)
--space-6:   1.5rem    (24px)
--space-8:   2rem      (32px)
--space-10:  2.5rem    (40px)
--space-12:  3rem      (48px)
--space-16:  4rem      (64px)
```

### 5.4 Border Radius

```
--radius-sm:   0.375rem  (6px)   — Inputs, small elements
--radius-md:   0.5rem    (8px)   — Cards, buttons
--radius-lg:   0.75rem   (12px)  — Modals, large cards
--radius-xl:   1rem      (16px)  — Feature cards
--radius-full: 9999px             — Avatars, pills
```

### 5.5 Shadows (Dark mode: use border instead of shadow)

```
Light mode:
--shadow-sm:   0 1px 2px rgba(0, 0, 0, 0.05)
--shadow-md:   0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.05)
--shadow-lg:   0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px rgba(0, 0, 0, 0.04)

Dark mode:
Cards use --border-subtle (1px solid) instead of shadows.
Elevated elements (modals) use subtle glow: 0 0 0 1px rgba(124, 106, 239, 0.1)
```

---

## 6. Motion & Animation

### Principles
- **Purpose**: Every animation communicates something (state change, direction, feedback)
- **Duration**: Micro-interactions 150–200ms, page transitions 300–400ms
- **Easing**: `cubic-bezier(0.4, 0, 0.2, 1)` (Material standard) for most. Spring physics for swipe cards.

### Key Animations

| Element | Trigger | Animation |
|---------|---------|-----------|
| Page transitions | Route change | Fade + subtle slide (20px vertical) |
| Card swipe | Drag release | Spring physics to exit point |
| Like button | Click | Scale 1 → 1.2 → 1 + colour fill |
| Toast | Appear/dismiss | Slide down from top + fade |
| Skeleton loading | Data fetching | Shimmer (gradient sweep left to right) |
| Modal | Open/close | Scale 0.95 → 1 + backdrop fade |
| Tab switch | Click | Underline indicator slides to active tab |
| Button hover | Mouse enter | Subtle brightness increase (filter: brightness(1.1)) |

### What NOT to animate
- No bouncing loaders
- No parallax scrolling on content pages
- No auto-playing carousels
- No decorative particle effects
- No gradient shifting backgrounds

---

## 7. Responsive Breakpoints

```
--bp-mobile:   0 – 639px       (single column, bottom nav)
--bp-tablet:   640px – 1023px  (2 columns, collapsible sidebar)
--bp-desktop:  1024px – 1279px (3 columns, full layout)
--bp-wide:     1280px+         (max-width container, centered)
```

### Layout Shifts

| Page | Mobile | Tablet | Desktop |
|------|--------|--------|---------|
| Feed | Full-width feed, bottom nav | Feed + right sidebar | Left sidebar + Feed + Right sidebar |
| Discovery | Full-screen card | Full-screen card | Centered card with decorative space |
| Profile | Stacked sections | 2-column (info + posts) | 2-column with sidebar |
| Connections | List, full-width | 2-column grid | 3-column grid |
| Settings | Stacked sections | Side nav + content | Side nav + content |
| Chat (P1) | Conversation list OR chat (not both) | Split view | Split view |

---

## 8. Accessibility Baseline

| Requirement | Implementation |
|---|---|
| Colour contrast | All text meets WCAG AA (4.5:1 normal, 3:1 large) |
| Keyboard navigation | All interactive elements focusable, visible focus ring (accent-primary) |
| Screen reader | Semantic HTML, ARIA labels on icon-only buttons |
| Reduced motion | `@media (prefers-reduced-motion: reduce)` disables animations |
| Focus management | Modal traps focus, page transitions return focus to main |

---

## 9. Implementation Notes

### CSS Architecture

```
styles/
├── index.css              # CSS custom properties (tokens), resets, base styles
├── components/
│   ├── button.css
│   ├── card.css
│   ├── input.css
│   ├── avatar.css
│   ├── badge.css
│   ├── navbar.css
│   ├── modal.css
│   ├── toast.css
│   ├── skeleton.css
│   └── tabs.css
└── pages/
    ├── auth.css
    ├── feed.css
    ├── discovery.css
    ├── profile.css
    ├── connections.css
    └── settings.css
```

### Theme Switching Implementation

```css
/* index.css — tokens defined on :root and [data-theme="light"] */
:root {
  /* Dark mode is default */
  --bg-primary: #0c0c14;
  --text-primary: #e8e8ed;
  /* ... all dark mode tokens */
}

[data-theme="light"] {
  --bg-primary: #f8f8fa;
  --text-primary: #18181b;
  /* ... all light mode tokens */
}

@media (prefers-color-scheme: light) {
  :root:not([data-theme="dark"]) {
    /* Auto-switch if no explicit preference */
    --bg-primary: #f8f8fa;
    --text-primary: #18181b;
  }
}
```

```javascript
// ThemeContext.jsx
const themes = ['light', 'dark', 'system'];
// Store preference in localStorage, apply data-theme attribute to <html>
```
