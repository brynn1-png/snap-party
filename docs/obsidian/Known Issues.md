---
tags: [snapparty, issues]
created: 2026-07-27
---

# Known Issues

Part of [[SnapParty]]. Source: `PROGRESS.md` (2026-07-05 snapshot).

- Dev server WebSocket HMR fails when accessing the app from other devices on the local network (dev-only; not present in production builds) — relevant when testing [[Guest Flow]] on an actual phone during local development.
- `<img>` tags (rather than `next/image`) are used for external Supabase Storage URLs — intentional, produces lint warnings, tracked as accepted rather than a bug.
- `react-hooks/exhaustive-deps` warning on the camera page's session-init effect (missing `router`/`slug`/`supabase` deps) — pre-existing, deliberately suppressed with an inline eslint-disable since re-running it on every render would restart the camera.
- Mobile responsiveness was code-audited (viewport/safe-area/breakpoint review, production build passed) but **not visually confirmed on a real device or browser** — the Chrome extension wasn't connected in that session. Worth a real-phone check, especially the camera page's safe-area behavior on a notched iPhone.

## Fixed 2026-07-27 (code review pass)

- **Shot limit was client-trust only.** `/api/upload` never checked `events.photo_limit` server-side — a guest could bypass the UI cap entirely by POSTing directly to the endpoint. Fixed via a new atomic `increment_session_shots()` Postgres function (`supabase/migrations/005_atomic_shot_increment.sql`) that enforces the limit and eliminates the prior read-then-write race on `sessions.shots_used` in the same change.
- **`/api/upload-cover` had zero authorization.** It used the service-role key with no check that the caller was even logged in, let alone owned the event — anyone who knew/guessed an `eventId` could overwrite that event's cover photo and consume storage. Fixed by requiring an authenticated session and verifying `events.organizer_id` matches the caller, plus adding server-side file-type/size validation (previously client-only).
- Client and [[Offline Queue]] sync worker now distinguish a permanent server rejection (403/404 — can never succeed on retry) from a transient failure, so a rejected upload is dropped instead of retried forever on every reconnect. This was a new failure mode introduced by the shot-limit fix above and had to be handled at the same time.

## Fixed (later same session): `qr_token` was dead data

[[Events Table]] generated and stored `qr_token` at creation, but nothing ever read it — the QR image and guest URL were both built from `slug` alone, so the schema's stated intent ("rotate the QR without losing the readable slug URL") never actually worked. Wired it up for real:
- The QR code image now encodes `${baseUrl}/e/{slug}?qr={qr_token}`; the "Share Event" link still uses the bare slug URL with no `qr` param.
- `/e/[slug]` validates a present `qr` param against `events.qr_token` and shows a distinct "This QR code is no longer valid" state on mismatch — but only when `qr` is present, so the plain share link is unaffected by rotation.
- Added a "Regenerate QR" action on the event detail page (`handleRegenerateQr`) that assigns a new token via the shared `src/lib/generateToken.ts` helper (extracted from `dashboard/create/page.tsx`, which generated its own local copy before).

## Fixed (later same session): flow bugs

- **Logout sent the organizer to `/login` instead of the landing page**, with no way back to `/` from there short of the small logo link. `LogoutButton.tsx` now `router.push("/")`.
- **`/live/[slug]` ([[Live Slideshow]]) was gated behind organizer login**, silently breaking the event page's "Project" button — a TV/projector browser with no session just bounced to `/login`. Fixed by removing `/live` from the auth check in `src/lib/supabase/middleware.ts`; it now uses the same public, slug-as-secret trust model as [[Guest Flow]].

## Fixed (later same session): dashboard visual + mobile pass

- Restyled the entire organizer dashboard (`dashboard/layout.tsx`, `dashboard/page.tsx`, `dashboard/create/page.tsx`, `dashboard/events/[id]/page.tsx`, `Carousel.tsx`'s non-fullscreen mode) from a light "clean SaaS" theme to the dark glassmorphism system already used by the guest/auth pages — see [[Architecture]]. Photo-heavy tools (Lightroom, Google Photos) lean dark deliberately; photos read better against a dark neutral surface than white.
- Added a mobile-first pass: `viewport-fit: cover` + `env(safe-area-inset-*)` padding on the camera page's control bars, and a hamburger menu on the marketing `Navbar` (its "How It Works/Features/Pricing" links had no mobile fallback at all below `md`). See [[Guest Flow]], [[Components]].

See [[Roadmap]] for forward-looking open product questions (moderation timing, shot-limit scoping, retention policy) that are design gaps rather than bugs.
