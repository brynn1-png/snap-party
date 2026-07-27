---
tags: [snapparty, architecture]
created: 2026-07-27
---

# Architecture

Part of [[SnapParty]].

## Stack

| Layer | Technology | Notes |
|---|---|---|
| Frontend | Next.js 16 (App Router), React 19, Tailwind CSS v4 | Mobile-first responsive UI |
| Camera capture | MediaDevices API (`getUserMedia`) | Browser-native, no plugin/app |
| Backend | Next.js API Routes (Route Handlers) | No standalone backend server |
| Database | Supabase (PostgreSQL) — see [[Data Model]] | Metadata & relational data only |
| File storage | Supabase Storage | Actual image binaries |
| Auth | Supabase Auth | Organizer-only; guests never authenticate |
| Realtime | Supabase Realtime (`postgres_changes`) | Live gallery + [[Live Slideshow]] |

No standalone backend service — Next.js API routes are the entire server layer, deployable as a single app (e.g. Vercel).

## Routing (App Router)

```
/                        Landing page → [[Components]] (Hero, HowItWorks, Features, ...)
/login                   Organizer login (email/password + magic link)
/signup                  Organizer signup
/dashboard               Event list                        → [[Organizer Flow]]
/dashboard/create        Create event form
/dashboard/events/[id]   Event detail: QR, stats, live gallery, ZIP download
/e/[slug]                Guest landing — event lookup + session creation → [[Guest Flow]]
/e/[slug]/name           Guest name input (stamped on photos)
/e/[slug]/camera         Full-screen camera interface
/e/[slug]/done           Thank-you / completion screen
/live/[slug]             Public ambient slideshow (TV/projector)      → [[Live Slideshow]]
/api/upload              Server-side photo upload endpoint (service role key)
/api/upload-cover        Event cover photo upload endpoint
```

`src/proxy.ts` is the Next.js 16 replacement for the deprecated `middleware.ts` — it refreshes the Supabase session and protects `/dashboard` (redirects unauthenticated users to `/login`). Logic lives in `src/lib/supabase/middleware.ts`.

## Supabase client layer (`src/lib/supabase/`)

- `provider.tsx` — `SupabaseProvider` + `useSupabase()` hook; creates a browser client via `createBrowserClient` (anon key) and exposes it through React context for all client components.
- `middleware.ts` — session refresh logic invoked from `proxy.ts` on every request.

## Data flow: capture → upload → live dashboard

```
Guest camera capture
  → client-side compression (browser-image-compression: WebP, 1280px, 0.82 quality)
  → POST /api/upload (FormData: image, event_id, session_id, guest_name)
  → server uses Supabase service role key to write to Storage bucket "photos"
  → row inserted into `photos` table, `sessions.shots_used` incremented
  → Supabase Realtime pushes INSERT event on `photos`
  → Organizer dashboard ([[Organizer Flow]]) and [[Live Slideshow]] both subscribe
    via `postgres_changes` and update without a page refresh
```

If the guest is offline, capture is diverted into the [[Offline Queue]] instead of the direct upload path.

## Design system

Dark gradient glassmorphism, unified across the whole app as of 2026-07-27: `sp-midnight` background, translucent `bg-white/[0.03] border-white/10` glass cards, blurred `sp-coral`/`sp-violet`/`sp-magenta` glow orbs, gradient text on brand/CTAs. Tokens live in `src/app/globals.css`. The dashboard was the last holdout on a light "clean SaaS" look (white cards, `gray-50` background) and was restyled to match this session — see [[Known Issues]]. (`PROGRESS.md`'s "Neobrutalism" description no longer matches the source.)

## Mobile / viewport

`layout.tsx` sets `viewport-fit: cover` so full-bleed screens (the camera page) can draw under the notch/home-indicator on notched phones; `/e/[slug]/camera`'s top and bottom bars pad themselves with `env(safe-area-inset-top/bottom)` on top of their base padding so controls clear those cutouts. The marketing `Navbar` has a hamburger menu below `md` — the nav links were previously `hidden md:flex` with no mobile fallback at all.
