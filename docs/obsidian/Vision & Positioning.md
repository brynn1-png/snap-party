---
tags: [snapparty, vision, product]
created: 2026-07-27
---

# Vision & Positioning

Part of [[SnapParty]]. Source: `SnapParty-Vision-Implementation-Plan.md` (v1.0, July 2026).

## Problem statement

| Problem | Consequence |
|---|---|
| Guests take photos but don't send them | Organizers get a fraction of the memories captured |
| Photos scattered across multiple apps/platforms | No single source of truth, painful to collect |
| Traditional photo booths require hardware/staff | Expensive, limited to the event's physical footprint |
| "Upload later" gallery apps depend on guest follow-through | Low completion/compliance rate |

**Solution principle:** remove every point of friction between "guest takes a photo" and "organizer has the photo." Capture = upload. No submit button, no login, no app. See [[Guest Flow]].

## Target users

- **Organizer** — creates/manages events; needs to create in minutes, generate a shareable QR, watch photos arrive live, download everything, moderate lightly, get post-event insights. See [[Organizer Flow]].
- **Guest** — anonymous, zero friction; scan and go, simple/fast camera, know shots remaining, trust the photo is "sent" automatically. See [[Guest Flow]].

## Target events

Weddings · Birthdays · Debuts · Graduations · Corporate Events · Conferences · School Events · Festivals · Brand Activations · Family Reunions — all share a bounded time window, a concentrated guest list, and strong emotional/social incentive to capture the moment, which is why the product favors ephemeral sessions ([[Sessions Table]]) over persistent guest accounts.

## Authentication model

Asymmetric by design, core to the "zero friction" promise: organizers get full Supabase Auth accountability, guests get pure anonymity via a generated `session_token`. See [[Data Model]] RLS notes.

## Design philosophy

- **Mobile-first** — the guest experience is the product; lives entirely on a phone browser
- **Zero-install, zero-registration** — any friction here directly reduces photo volume
- **Fast** — camera-to-upload latency is a core UX metric, not an afterthought
- **Beautiful & simple** — a celebration moment; the UI shouldn't feel like a form

## Success metric

North star: SnapParty should be measurably the *easiest and most engaging* way for an organizer to collect memories, judged by (a) % of guests completing a session, (b) time from event end to organizer having all photos, (c) photos-per-guest vs. a traditional "please send us your photos" ask.

## Monetization (forward-looking, ties to [[Roadmap]] phases)

| Tier | Included | Roadmap phase |
|---|---|---|
| Free | Limited events, limited storage | Phase 1 |
| Basic | More storage, custom branding | Phase 1 |
| Pro | Unlimited photos, [[Live Slideshow]], analytics, AI Photo Strip | Phase 2–3 |
| Enterprise | Multiple organizers, white-label, custom domains, priority support | Phase 3 |
