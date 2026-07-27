---
tags: [snapparty, issues]
created: 2026-07-27
---

# Known Issues

Part of [[SnapParty]]. Source: `PROGRESS.md` (2026-07-05 snapshot).

- Dev server WebSocket HMR fails when accessing the app from other devices on the local network (dev-only; not present in production builds) — relevant when testing [[Guest Flow]] on an actual phone during local development.
- `<img>` tags (rather than `next/image`) are used for external Supabase Storage URLs — intentional, produces lint warnings, tracked as accepted rather than a bug.
- `/live/[slug]` ([[Live Slideshow]]) is gated behind organizer login by `src/proxy.ts`, contradicting the "anyone at the venue can view it" framing in [[Vision & Positioning]] — flagged as a product decision to make, not yet fixed.
- `react-hooks/exhaustive-deps` warning on the camera page's session-init effect (missing `router`/`slug`/`supabase` deps) — pre-existing, deliberately suppressed with an inline eslint-disable since re-running it on every render would restart the camera.

## Fixed 2026-07-27 (code review pass)

- **Shot limit was client-trust only.** `/api/upload` never checked `events.photo_limit` server-side — a guest could bypass the UI cap entirely by POSTing directly to the endpoint. Fixed via a new atomic `increment_session_shots()` Postgres function (`supabase/migrations/005_atomic_shot_increment.sql`) that enforces the limit and eliminates the prior read-then-write race on `sessions.shots_used` in the same change.
- **`/api/upload-cover` had zero authorization.** It used the service-role key with no check that the caller was even logged in, let alone owned the event — anyone who knew/guessed an `eventId` could overwrite that event's cover photo and consume storage. Fixed by requiring an authenticated session and verifying `events.organizer_id` matches the caller, plus adding server-side file-type/size validation (previously client-only).
- Client and [[Offline Queue]] sync worker now distinguish a permanent server rejection (403/404 — can never succeed on retry) from a transient failure, so a rejected upload is dropped instead of retried forever on every reconnect. This was a new failure mode introduced by the shot-limit fix above and had to be handled at the same time.

## Fixed (later same session): `qr_token` was dead data

[[Events Table]] generated and stored `qr_token` at creation, but nothing ever read it — the QR image and guest URL were both built from `slug` alone, so the schema's stated intent ("rotate the QR without losing the readable slug URL") never actually worked. Wired it up for real:
- The QR code image now encodes `${baseUrl}/e/{slug}?qr={qr_token}`; the "Share Event" link still uses the bare slug URL with no `qr` param.
- `/e/[slug]` validates a present `qr` param against `events.qr_token` and shows a distinct "This QR code is no longer valid" state on mismatch — but only when `qr` is present, so the plain share link is unaffected by rotation.
- Added a "Regenerate QR" action on the event detail page (`handleRegenerateQr`) that assigns a new token via the shared `src/lib/generateToken.ts` helper (extracted from `dashboard/create/page.tsx`, which generated its own local copy before).

See [[Roadmap]] for forward-looking open product questions (moderation timing, shot-limit scoping, retention policy) that are design gaps rather than bugs.
