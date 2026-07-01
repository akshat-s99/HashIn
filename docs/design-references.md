# HashIn — Design References & Adaptation Guide

> **Purpose**: Maps design inspiration from reference products to HashIn-specific implementations  
> **References**: Pinterest (Feed), Apple.in (Navbar), Notion (Auth), LinkedIn (Profile)  
> **Date**: 2026-07-01

---

## 1. Reference Map

| Page/Component | Inspiration | What We Take | What We Change |
|---|---|---|---|
| **Navbar** | Apple.in | Thin dark bar, generous spacing, minimal items, right-aligned icons | Developer context — add search, notifications, avatar dropdown |
| **Login / Register** | Notion | Centered card, stark white bg, single-focus form, social auth row, minimal copy | Our dark mode default, indigo accent instead of blue, "or continue with" divider |
| **Feed / Home** | Pinterest | Masonry grid layout, variable-height cards, rounded corners, category pills at top | Text-only posts (P0), dev skill pills instead of interest pills, no left icon sidebar |
| **Profile** | LinkedIn | Banner + overlapping avatar, name/headline/location stack, sectioned cards, right sidebar | Simpler — fewer sections, skill pills in monospace, connection actions more prominent |
| **Discovery** | *Original design* | N/A — no direct reference | Swipe card stack, unique to HashIn |
| **Settings** | *Standard pattern* | Side nav + content panel | Clean, sectioned |
| **Chat** | WhatsApp Web / Discord | Conversation list + chat pane | P1 — kept simple |
| **Admin** | *Dashboard pattern* | Stat cards + tables | P1 — functional over fancy |

---

## 2. Navbar — Adapted from Apple.in

### What Apple Does Right
- **Height**: Thin bar (~44px), never dominates the page
- **Background**: Solid dark (`#1d1d1f`) — creates consistent anchor across all pages
- **Typography**: SF Pro at ~12px, letter-spaced, all items equal visual weight
- **Spacing**: Generous gaps between nav items — nothing feels cramped
- **Interaction**: Dropdown megamenu on hover, no jarring page reloads
- **Icons**: Only 2 right-aligned icons (search + bag), clean and symbolic

### Our Adaptation for HashIn

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│   #  HashIn        Home    Discover    Connections     🔍   🔔   👤  │
│                                                                      │
│   ←  logo          ← text nav links →           ← icon group →      │
│                                                                      │
│   Height: 48px                                                       │
│   Background: var(--bg-secondary) with 1px bottom border             │
│   Dark mode: #141420 bar, #2a2a40 border                             │
│   Light mode: #ffffff bar, #e4e4eb border                            │
│   Font: Inter 500, 14px, letter-spacing 0.01em                       │
│   Logo: Outfit 700, 18px, accent-primary colour                      │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

**Key Design Decisions:**

```
DESKTOP (≥1024px):
┌────────────────────────────────────────────────────────────────────┐
│  # HashIn          Home    Discover    Connections       🔍  🔔  👤│
└────────────────────────────────────────────────────────────────────┘
  │                  │                                     │
  Logo (left)        Text links (center-left)              Icons (right)
  Outfit 700         Inter 500, 14px                       24px icons
  accent-primary     text-secondary, active = text-primary Search, Notif, Avatar

  Active link indicator: 2px bottom line in accent-primary
  Hover: text-primary colour transition (200ms)
  
  Avatar click → dropdown:
  ┌─────────────────┐
  │  My Profile      │
  │  Settings         │
  │  ─────────────── │
  │  Admin Panel  ⚡  │  ← Only if role === 'admin'
  │  ─────────────── │
  │  Sign Out         │
  └─────────────────┘


MOBILE (<640px):
  Top bar: Logo + 🔍 + 🔔 only
  Bottom tab bar (like Pinterest mobile):
  ┌──────────────────────────────────────────┐
  │  🏠 Home   🧭 Discover   👥   💬   👤   │
  └──────────────────────────────────────────┘
  Active tab: accent-primary icon + dot indicator below
  Inactive: text-tertiary
  Height: 56px, translucent bg with backdrop-filter blur
```

**What We DON'T Copy from Apple:**
- No mega-dropdown menus (we have only 3-4 nav items)
- No opacity-based background (Apple uses `rgba(29,29,31,0.72)` with blur — nice but not essential for P0)
- No breadcrumb-style navigation

---

## 3. Login / Register — Adapted from Notion

### What Notion Does Right
- **Centering**: Form card is dead-center, generous vertical whitespace above and below
- **Logo first**: Small logo icon above the heading — establishes identity instantly
- **Minimal copy**: "Your AI workspace." + "Log in to your Notion account" — two lines, done
- **Single-field focus**: Only shows email first, then password on next step (progressive disclosure)
- **CTA button**: Full-width, solid blue, high contrast, clear label ("Continue")
- **Social auth**: Clean divider ("or continue with") + icon-label buttons in a grid
- **Footer**: "New user? Sign up" + legal links — minimal, doesn't compete
- **Background**: Pure white, no distractions, no illustrations, no gradients

### Our Adaptation for HashIn

```
LOGIN PAGE:
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│                    bg: var(--bg-primary)                              │
│                    #0c0c14 (dark) / #f8f8fa (light)                  │
│                                                                      │
│              ┌─────────────────────────────────┐                      │
│              │                                 │                      │
│              │         #  HashIn               │  ← Outfit 700, 24px │
│              │                                 │     accent-primary   │
│              │    Welcome back.                │  ← Outfit 600, 20px │
│              │    Sign in to your network.     │  ← Inter 400, 14px  │
│              │                                 │     text-secondary   │
│              │    ┌─────────────────────────┐  │                      │
│              │    │ 📧  Email               │  │  ← Input with icon  │
│              │    └─────────────────────────┘  │     prefix           │
│              │    ┌─────────────────────────┐  │                      │
│              │    │ 🔒  Password         👁  │  │  ← Toggle visibility│
│              │    └─────────────────────────┘  │                      │
│              │                                 │                      │
│              │    [      Sign In             ] │  ← Full-width btn   │
│              │                                 │     accent-primary   │
│              │                                 │     height: 44px     │
│              │    ──── or continue with ────   │  ← Divider line +   │
│              │                                 │     text-tertiary    │
│              │    ┌───────────┐ ┌───────────┐  │                      │
│              │    │ G Google  │ │ 🐙 GitHub │  │  ← Outline buttons  │
│              │    └───────────┘ └───────────┘  │     side by side     │
│              │                                 │     (Google P1,      │
│              │                                 │      GitHub P2)      │
│              │    Don't have an account?       │                      │
│              │    Create one →                 │  ← accent-primary    │
│              │                                 │     text link        │
│              └─────────────────────────────────┘                      │
│                                                                      │
│              Card: var(--bg-secondary) #141420                        │
│              Border: 1px solid var(--border-subtle)                   │
│              Border-radius: var(--radius-lg) 12px                     │
│              Padding: 40px                                            │
│              Max-width: 420px                                         │
│              Shadow (light mode): var(--shadow-lg)                    │
│              Shadow (dark mode): none (border only)                   │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

```
REGISTER PAGE (same layout, different fields):
┌─────────────────────────────────┐
│                                 │
│         #  HashIn               │
│                                 │
│    Join the network.            │
│    Create your developer        │
│    profile in seconds.          │
│                                 │
│    ┌────────────┐ ┌──────────┐  │  ← First + Last side by side
│    │ First Name │ │Last Name │  │
│    └────────────┘ └──────────┘  │
│    ┌─────────────────────────┐  │
│    │ 📧  Email               │  │
│    └─────────────────────────┘  │
│    ┌─────────────────────────┐  │
│    │ 🔒  Password         👁  │  │
│    └─────────────────────────┘  │
│                                 │
│    Password strength            │
│    [██████░░░░] Good            │  ← Colour-coded bar
│                                 │
│    [    Create Account        ] │
│                                 │
│    ──── or continue with ────   │
│                                 │
│    ┌───────────┐ ┌───────────┐  │
│    │ G Google  │ │ 🐙 GitHub │  │
│    └───────────┘ └───────────┘  │
│                                 │
│    Already have an account?     │
│    Sign in →                    │
│                                 │
└─────────────────────────────────┘
```

**Input Field Design (Notion-inspired):**
```
Resting state:
┌─────────────────────────────────────┐
│ 📧  Enter your email               │   bg: var(--bg-tertiary)
└─────────────────────────────────────┘   border: 1px solid var(--border-subtle)
                                          border-radius: 8px
                                          height: 44px
                                          padding: 0 12px
                                          icon: text-tertiary
                                          placeholder: text-tertiary

Focused state:
┌─────────────────────────────────────┐
│ 📧  jane@example.com|              │   border: 2px solid var(--accent-primary)
└─────────────────────────────────────┘   box-shadow: 0 0 0 3px var(--accent-subtle)
                                          icon: accent-primary

Error state:
┌─────────────────────────────────────┐
│ 📧  invalid-email                   │   border: 2px solid var(--error)
└─────────────────────────────────────┘
  ⚠ Please enter a valid email address    text: var(--error), Inter 400, 12px
```

**What We DON'T Copy from Notion:**
- No progressive disclosure (email → then password) — we show all fields at once (simpler to build, less disorienting)
- No Passkey/SSO buttons (not relevant for our audience)
- We use a dark card on dark bg instead of Notion's white-on-white — developer identity

---

## 4. Feed / Home — Adapted from Pinterest

### What Pinterest Does Right
- **Masonry grid**: Variable-height columns that fill space efficiently — visually dynamic, never boring
- **Rounded corners**: Consistent `16px` radius on all cards — soft, modern
- **Minimal card chrome**: Image dominates, tiny overlay for attribution/actions
- **Category pills**: Horizontal scrollable row at top for filtering — "All", "Design", "Photography"
- **Infinite scroll**: No pagination — content loads as you scroll
- **Left sidebar**: Icon-only nav on desktop (home, search, notifications, messages, profile)
- **No borders on cards**: Cards float on the background, separated only by gap spacing

### Our Adaptation for HashIn

Since P0 is **text-only posts**, we can't do image-heavy masonry like Pinterest. Instead, we adapt the masonry *principle* — variable visual weight cards — to a text-first feed.

```
FEED PAGE (Desktop):
┌──────────────────────────────────────────────────────────────────────┐
│  [ Navbar ]                                                          │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────┐  ┌──────────────────────────────────┐  ┌──────────┐   │
│  │          │  │                                  │  │          │   │
│  │  Mini    │  │  ┌───────── Skill Filter ──────┐ │  │  Right   │   │
│  │  Profile │  │  │ All  React  Node  Python  →│ │  │  Panel   │   │
│  │  Card    │  │  └─────────────────────────────┘ │  │          │   │
│  │          │  │                                  │  │  ┌──────┐│   │
│  │  ┌─────┐│  │  ┌──────────────────────────┐    │  │  │Trend-││   │
│  │  │ AV  ││  │  │  What's happening in      │    │  │  │ing   ││   │
│  │  │     ││  │  │  your network?             │    │  │  │Skills││   │
│  │  └─────┘│  │  │  [ Share an update... ]   │    │  │  │      ││   │
│  │  Jane D │  │  └──────────────────────────┘    │  │  │#React││   │
│  │  ──────  │  │                                  │  │  │#Node ││   │
│  │  5 conn  │  │  ┌──────────────────────────┐    │  │  │#Py   ││   │
│  │  12 post │  │  │ 👤 John Doe               │    │  │  └──────┘│   │
│  │          │  │  │ Full Stack Developer       │    │  │          │   │
│  │  Quick   │  │  │ · 2 hours ago              │    │  │  ┌──────┐│   │
│  │  Links:  │  │  │                            │    │  │  │Sugg- ││   │
│  │  📊 Feed │  │  │ Just shipped v2.0 of my    │    │  │  │ested ││   │
│  │  🧭 Disc │  │  │ portfolio site using React │    │  │  │Conn. ││   │
│  │  👥 Conn │  │  │ + Framer Motion! The       │    │  │  │      ││   │
│  │          │  │  │ animations are buttery      │    │  │  │[AV]  ││   │
│  │          │  │  │ smooth now. 🚀              │    │  │  │Alice ││   │
│  │          │  │  │                            │    │  │  │Chen  ││   │
│  │          │  │  │ ♡ 12    💬 3    ↗ Share    │    │  │  │[View]││   │
│  │          │  │  └──────────────────────────┘    │  │  └──────┘│   │
│  │          │  │                                  │  │          │   │
│  │          │  │  ┌──────────────────────────┐    │  │          │   │
│  │          │  │  │  Next post...             │    │  │          │   │
│  │          │  │  └──────────────────────────┘    │  │          │   │
│  │          │  │                                  │  │          │   │
│  └──────────┘  └──────────────────────────────────┘  └──────────┘   │
│                                                                      │
│  Left sidebar: 240px   Center feed: flex-1   Right panel: 300px      │
│  Left hidden <1024px   Center full <640px    Right hidden <1024px    │
└──────────────────────────────────────────────────────────────────────┘
```

**Pinterest-Inspired Elements We Adapt:**

| Pinterest Feature | Our Adaptation |
|---|---|
| Masonry image grid | Single-column card feed (P0 text), masonry grid when images come (P1) |
| Category pills at top | **Skill filter pills**: "All", "React", "Node.js", "Python" — filter feed by topic |
| Rounded card corners | 12px radius on post cards, no visible border in dark mode |
| Infinite scroll | Intersection Observer for loading more posts |
| Minimal card design | Avatar + name + headline on one line, content below, action bar at bottom |
| No card borders | In dark mode: cards are bg-secondary on bg-primary (elevation only). Light mode: subtle shadow |

**Post Card Design (Pinterest-clean):**
```
┌──────────────────────────────────────────┐
│                                          │  bg: var(--bg-secondary)
│  ┌──┐  John Doe · 2h                    │  border-radius: 12px
│  │AV│  Full Stack Developer              │  padding: 20px
│  └──┘                                    │  margin-bottom: 12px (gap)
│                                          │
│  Just shipped v2.0 of my portfolio       │  Inter 400, 15px
│  site using React + Framer Motion!       │  line-height: 1.6
│  The animations are buttery smooth       │  text-primary
│  now. 🚀                                 │
│                                          │
│  ── ── ── ── ── ── ── ── ── ── ── ──   │  1px border-top, border-subtle
│                                          │
│  ♡ 12         💬 3          ↗ Share      │  text-tertiary, 13px
│                                          │  hover: text-primary
└──────────────────────────────────────────┘
```

**P1 Evolution → Pinterest Masonry:**
When images/videos arrive in P1, the feed evolves:
```
┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
│         │ │ IMG     │ │         │ │         │
│ Text    │ │         │ │ Text    │ │ IMG     │
│ Post    │ │         │ │ Post    │ │         │
│         │ │ Caption │ │         │ │         │
└─────────┘ │         │ └─────────┘ │ Caption │
┌─────────┐ └─────────┘ ┌─────────┐ │         │
│ IMG     │ ┌─────────┐ │         │ └─────────┘
│         │ │ Text    │ │ Text    │
│         │ │ Post    │ │ Post    │
│ Caption │ │         │ │         │
└─────────┘ └─────────┘ └─────────┘

CSS: columns: 4; column-gap: 12px;
     or CSS Grid with masonry (when browser support lands)
     or JS-based masonry (masonry-layout library)
```

---

## 5. Profile — Adapted from LinkedIn

### What LinkedIn Does Right
- **Banner + Avatar overlap**: Cover photo fills width, circular avatar overlaps the bottom edge — creates strong visual hierarchy
- **Info hierarchy**: Name (largest) → Headline → Location → Links — scans naturally
- **Action buttons**: "Open to", "Add section", "Enhance profile" — clear CTAs in a row
- **Stats**: "533 followers · 487 connections" — social proof, clickable
- **Sectioned cards**: About, Experience, Skills — each in its own bordered card with padding
- **Right sidebar**: "People also viewed" — discovery doesn't stop on a profile page

### Our Adaptation for HashIn

```
PROFILE PAGE:
┌──────────────────────────────────────────────────────────────────────┐
│  [ Navbar ]                                                          │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌────────────────────────────────────────────┐  ┌──────────────┐   │
│  │                                            │  │              │   │
│  │  ┌──────────────────────────────────────┐  │  │  Shared      │   │
│  │  │                                      │  │  │  Skills      │   │
│  │  │         BANNER / GRADIENT            │  │  │              │   │
│  │  │     (or generated gradient from      │  │  │  You both    │   │
│  │  │      user's top skills)              │  │  │  know:       │   │
│  │  │                                      │  │  │              │   │
│  │  └──────────────────────────────────────┘  │  │  ┌────────┐  │   │
│  │                                            │  │  │ React  │  │   │
│  │     ┌──────┐                               │  │  │ Node   │  │   │
│  │     │      │  Akshat Singh                 │  │  └────────┘  │   │
│  │     │  AV  │  Pre-Final Year B.Tech CSE    │  │              │   │
│  │     │      │  Lucknow, India               │  │  ────────    │   │
│  │     └──────┘                               │  │              │   │
│  │                                            │  │  People      │   │
│  │  🔗 github · 🔗 linkedin · 🔗 portfolio   │  │  with        │   │
│  │                                            │  │  similar     │   │
│  │  23 connections                            │  │  skills      │   │
│  │                                            │  │              │   │
│  │  [ Edit Profile ]  (own) OR                │  │  ┌──┐ Alex   │   │
│  │  [ Connect ] [ Message ] (other's)         │  │  └──┘ ML Eng │   │
│  │                                            │  │  [View]      │   │
│  ├────────────────────────────────────────────┤  │              │   │
│  │                                            │  │  ┌──┐ Sara   │   │
│  │  About                                     │  │  └──┘ FE Dev │   │
│  │  ─────                                     │  │  [View]      │   │
│  │  Passionate backend engineer with 3 years  │  │              │   │
│  │  of experience building scalable APIs and  │  │              │   │
│  │  distributed systems...                    │  │              │   │
│  │                                            │  │              │   │
│  ├────────────────────────────────────────────┤  │              │   │
│  │                                            │  │              │   │
│  │  Skills                                    │  │              │   │
│  │  ─────                                     │  │              │   │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐      │  │              │   │
│  │  │React │ │Node  │ │Python│ │MongoDB│      │  │              │   │
│  │  └──────┘ └──────┘ └──────┘ └──────┘      │  │              │   │
│  │  ┌──────┐ ┌──────┐                         │  │              │   │
│  │  │Docker│ │AWS   │                         │  │              │   │
│  │  └──────┘ └──────┘                         │  │              │   │
│  │                                            │  │              │   │
│  ├────────────────────────────────────────────┤  │              │   │
│  │                                            │  └──────────────┘   │
│  │  Posts (12)                                │                      │
│  │  ─────                                     │                      │
│  │  ┌──────────────────────────────────────┐  │                      │
│  │  │  Post content here...                │  │                      │
│  │  │  ♡ 5   · 2 hours ago                 │  │                      │
│  │  └──────────────────────────────────────┘  │                      │
│  │                                            │                      │
│  └────────────────────────────────────────────┘                      │
│                                                                      │
│  Main column: max-width 680px    Right sidebar: 300px                │
└──────────────────────────────────────────────────────────────────────┘
```

**Banner Strategy (since we don't have image uploads in P0):**

Instead of a user-uploaded cover photo, generate a **gradient banner from the user's skills**:

```
Skill-based gradient mapping:
  React      → #61dafb (React blue)
  Node.js    → #339933 (Node green)
  Python     → #3776ab (Python blue)
  JavaScript → #f7df1e (JS yellow)
  MongoDB    → #47a248 (Mongo green)
  Default    → accent-primary gradient

Banner CSS: 
  background: linear-gradient(135deg, <skill-color-1> 0%, <skill-color-2> 50%, <skill-color-3> 100%);
  height: 180px;
  border-radius: 12px 12px 0 0;
```

This is a subtle, unique touch — the banner is procedurally generated from the user's tech stack. No upload needed, and every profile looks different.

**LinkedIn Elements We Adapt:**
| LinkedIn Feature | Our Adaptation |
|---|---|
| Cover photo + avatar overlap | Generated gradient banner + avatar circle overlapping bottom |
| Name · Headline · Location | Same hierarchy, Outfit font for name |
| "Open to" / "Add Section" buttons | "Edit Profile" (own) or "Connect" / "Message" (other's) |
| "533 followers · 487 connections" | "23 connections" — simple count, clickable |
| Sectioned cards (About, Experience, Skills) | About + Skills + Posts — 3 clean sections |
| Right sidebar "People also viewed" | "People with similar skills" — drives discovery |

**What We DON'T Copy from LinkedIn:**
- No premium/verification badges
- No "Enhance profile" AI prompts
- No "Add a past position" suggestions
- No analytics section (P2 consideration)
- No endorsement counts on skills
- Much less visual clutter — LinkedIn is information-dense; we're content-focused

---

## 6. Discovery Page — Original Design

No direct reference — this is HashIn's unique feature. But informed by Tinder/Bumble card mechanics with a professional-network context:

```
┌──────────────────────────────────────────────────────────────────────┐
│  [ Navbar ]                                                          │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│           bg: var(--bg-primary)                                      │
│           Centered content, max-width: 440px                         │
│                                                                      │
│                ┌────────────────────────────┐                         │
│               ╱│                            │╲   ← shadow of card    │
│              ╱ │  ┌────────────────────────│ ╲     behind (stacked)  │
│             ╱  │ ╱│                        │╲ ╲                      │
│                │╱ │                        │ ╲│                      │
│                │  │    ┌────────────┐      │  │                      │
│                │  │    │            │      │  │                      │
│                │  │    │  Initials  │      │  │  ← 80px circle,     │
│                │  │    │  or Avatar │      │  │     bg: accent-subtle│
│                │  │    │     AS     │      │  │     text: accent     │
│                │  │    │            │      │  │                      │
│                │  │    └────────────┘      │  │                      │
│                │  │                        │  │                      │
│                │  │    Akshat Singh        │  │  ← Outfit 600, 22px │
│                │  │    Backend Engineer    │  │  ← Inter 400, 14px  │
│                │  │    Lucknow, India      │  │     text-secondary   │
│                │  │                        │  │                      │
│                │  │  ┌──────┐ ┌──────┐     │  │  ← JetBrains Mono  │
│                │  │  │Node  │ │Python│     │  │     skill pills      │
│                │  │  └──────┘ └──────┘     │  │     accent-subtle bg │
│                │  │  ┌──────┐ ┌──────┐     │  │                      │
│                │  │  │React │ │Mongo │     │  │                      │
│                │  │  └──────┘ └──────┘     │  │                      │
│                │  │                        │  │                      │
│                │  │  Skill Match           │  │                      │
│                │  │  ████████░░  4/5       │  │  ← Match score bar  │
│                │  │                        │  │     green gradient    │
│                │  │  Common: React, Node,  │  │  ← text-secondary   │
│                │  │  MongoDB, Express      │  │     12px             │
│                │  │                        │  │                      │
│                │  └────────────────────────┘  │                      │
│                │                              │                      │
│                └──────────────────────────────┘                      │
│                                                                      │
│           ┌──────────┐              ┌──────────┐                     │
│           │          │              │          │                     │
│           │  ✕ Pass  │              │ ✓ Like   │                     │
│           │          │              │          │                     │
│           └──────────┘              └──────────┘                     │
│           bg-tertiary               accent-primary                   │
│           56px round                56px round                       │
│           text-secondary            white text                       │
│                                                                      │
│           Keyboard: ← = Pass, → = Like                               │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 7. Summary — Design DNA

```
┌───────────────────────────────────────────────────────────┐
│                                                           │
│   HashIn Design DNA                                       │
│                                                           │
│   Navbar:    Apple-thin, dark anchor, minimal items        │
│   Auth:      Notion-clean, centered card, focused form     │
│   Feed:      Pinterest-inspired, card-based, skill pills   │
│   Profile:   LinkedIn-structured, banner + sections        │
│   Discovery: Original, card-stack, skill-matching          │
│   General:   Code-editor dark vibes, developer identity    │
│                                                           │
│   Fonts:     Outfit + Inter + JetBrains Mono               │
│   Palette:   Midnight Slate dark, Paper & Ink light        │
│   Accents:   Muted indigo (#7c6aef) + warm coral (#ef8c6a)│
│   Corners:   12px cards, 8px buttons, full-round avatars   │
│   Motion:    Purposeful, 200ms micro, 300ms page           │
│                                                           │
└───────────────────────────────────────────────────────────┘
```
