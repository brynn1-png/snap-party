---
tags: [snapparty, roadmap]
created: 2026-07-27
---

# Roadmap

Part of [[SnapParty]]. Merged view of `PROGRESS.md` (last updated 2026-07-05) and `SnapParty-Vision-Implementation-Plan.md` §8.

## Phase 1 — MVP (Core Loop): ✅ core complete, in polish

Goal: prove "scan → shoot → auto-upload → organizer sees it" end to end.

**Done:** landing page, Supabase Auth (login/signup/magic link), route protection, event CRUD, QR generation, [[Guest Flow]] end to end, [[Organizer Flow]] live gallery + ZIP download + moderation, image compression pipeline (WebP/1280px/0.82 quality, ~70% storage savings).

**Left (polish):**
- [ ] Search/filter photos in gallery
- [ ] Detailed event analytics (peak upload times, storage used)
- [ ] Upload retry on network failure (partially covered by [[Offline Queue]], built after this list was written)
- [ ] Event link sharing (not just QR)
- [ ] Photo preview before upload (retake option)

## Hardening pass (2026-07-27, this session)

Not roadmap features so much as making existing Phase 1 features actually behave as designed — see [[Known Issues]] for full detail:
- Server-side shot-limit enforcement + atomic increment (was client-trust only)
- `/api/upload-cover` authorization (was wide open)
- `qr_token` actually wired up (QR image + "Regenerate QR", previously dead data — slight progress against the Phase 1 "Event link sharing (not just QR)" polish item below, though that item was really about the already-existing "Share Event" copy-link button)
- Logout destination and `/live/[slug]` public-access bugs (see [[Known Issues]])
- Dashboard restyled to match the guest-side dark theme; mobile-first pass on the camera page and marketing `Navbar`

## Interim build (2026-07-13, `PLAN-guest-name-flow.md`) — ahead of the Phase 2 list below

Three features built between the PROGRESS.md snapshot and now, all already implemented in source:
- [[Guest Flow|Guest Name Flow]] — name captured, stamped onto photos
- [[Live Slideshow]] — continuous photo display (`/live/[slug]`)
- [[Offline Queue]] — IndexedDB queue + background sync for poor venue Wi-Fi

## Phase 2 — Engagement Layer: not started (per PROGRESS.md; partially superseded above)

- [x] Live Slideshow — *actually shipped*, see [[Live Slideshow]]
- [ ] Event Branding / Photo Frames (overlay applied pre-upload)
- [ ] Digital Guestbook (photo + written message) — [[Messages Table]] schema exists, UI not confirmed
- [ ] Improved real-time dashboard (activity feed, live counts)

## Phase 3 — Intelligence & Monetization: not started

- [ ] AI Photo Strip / Collage / Memory Grid generation post-session
- [ ] Face recognition/grouping
- [ ] Advanced analytics (peak upload time, most active table, storage usage)
- [ ] Full SaaS account system + subscription billing
- [ ] White-label / multi-organizer / custom domain support (Enterprise)

## Differentiator backlog (prioritized, from [[Vision & Positioning]])

| Feature | Rating | Phase |
|---|---|---|
| Live Memory Wall | ⭐⭐⭐⭐⭐ | 2 — see [[Live Slideshow]] |
| Event Frames | ⭐⭐⭐⭐⭐ | 2 |
| AI Photo Strip | ⭐⭐⭐⭐⭐ | 3 |
| Digital Guestbook | ⭐⭐⭐⭐⭐ | 2 — see [[Messages Table]] |
| Camera Challenges | ⭐⭐⭐⭐☆ | 2/3 |
| Memory Timeline | — | 3 |
| Table QR Codes | — | 3 |
| Event Analytics | — | 3 |

## Open questions (unresolved, from Vision doc §13)

1. Moderation timing on the Live Memory Wall — instant display vs. approval-gated?
2. Is the 15-shot limit per device, per guest, or resettable via re-scan?
3. Exact compression targets balancing upload speed vs. print quality for AI Photo Strip
4. Data retention policy after an event ends
5. ~~Offline/poor connectivity handling~~ — resolved by [[Offline Queue]]

See also [[Known Issues]] for current-state bugs/limitations vs. these forward-looking open questions.
