# HashIn — Frontend Developer (Dev B) Context

> **Welcome to HashIn, Dev B!** This document contains everything you need to get your Antigravity assistant up to speed on the frontend requirements for Sprint 1.

## What is HashIn?
HashIn is a skill-based professional networking platform where developers discover peers through a swipe-based skill-matching engine, connect, and share updates via a text-based feed.

## Your Mission for Sprint 1
Build the frontend foundation (`client/` directory). 
**You own the frontend completely.** Developer A is working in parallel on the backend (`server/`).
There should be zero file overlap in Sprint 1.

### Sprint 1 Checklist for Frontend (Dev B)
1. Initialize Vite + React project in the `client` directory.
2. Install dependencies: `react-router-dom`, `axios`, `bootstrap`.
3. Set up Vite config to proxy `/api` to `http://localhost:5000`.
4. Create the CSS Design System (see Design DNA below) in `client/src/styles/index.css`.
5. Build core components (`Button`, `Input`, `Navbar`, `Card`, `Avatar`, `Badge`, `Toast`, `Modal`, `Skeleton`).
6. Set up React Router in `App.jsx`.
7. Create page shells (placeholder components) for: Login, Register, Feed, Discovery, Profile, Connections, Settings, 404.
8. Create layouts: `AuthLayout` (centered card) and `MainLayout` (with Navbar).
9. Set up the Axios instance (`client/src/api/axios.js`) configured for cookies (`withCredentials: true`).

## Design DNA
- **Theme**: "Midnight Slate" (dark default) / "Paper & Ink" (light). Code-editor vibes.
- **Typography**: Outfit (headings), Inter (body), JetBrains Mono (skills/code).
- **Inspirations**: 
  - Navbar: Apple.in (thin, clean, dark anchor).
  - Auth: Notion (centered card, focused, minimal).
  - Feed: Pinterest (cards on background).
  - Profile: LinkedIn (generated gradient banner from skills + overlapping avatar).
- **Styles**: Use CSS Custom Properties (tokens) defined in `:root` and `[data-theme="light"]`.
- **UI Architecture**: We are using Bootstrap 5 for base resets/utilities, but writing custom CSS components using the design tokens for the premium feel. **No "AI-ish" or generic Dribbble designs. Function over decoration.**

## Getting Started
Feed this context to your Antigravity instance and ask it to execute the Sprint 1 Checklist for Developer B (Frontend). 
You can find the full UI/UX architecture in `docs/ui-ux-architecture.md` and the collaboration guide in `docs/collaboration-guide.md` if you need more details.
