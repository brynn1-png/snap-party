---
tags: [snapparty, flow, feature]
created: 2026-07-27
---

# Live Slideshow

Part of [[SnapParty]]. Ambient display route at `/live/[slug]` intended for a TV or projector at the event venue. **Correction:** despite the page itself doing an open, unauthenticated Supabase read, `src/proxy.ts` gates the entire `/live/**` path behind organizer login (same as `/dashboard/**`) — so in practice a TV/projector browser must be logged in as the organizer to view it. This is worth a product decision: either this is intentional (Pro-tier gating) or it's a gap against the "Live Memory Wall" vision of anyone at the venue viewing it screen. See [[Known Issues]].

Listed as a Phase 2 "Live Memory Wall" / "Live Slideshow" differentiator in [[Vision & Positioning]] and [[Roadmap]]; implementation already exists ahead of the documented roadmap status.

## Behavior (`src/app/live/[slug]/page.tsx`)

- Looks up the event by `slug` (public read, no auth) and its photos ordered newest-first
- Subscribes to Supabase Realtime `postgres_changes` (INSERT/DELETE on `photos`, filtered by `event_id`) to update live without polling — same real-time pattern as [[Organizer Flow]]
- Renders photos via the shared `Carousel` component (`fullScreen` mode) — see [[Components]]
- Fullscreen toggle bound to the `F` key (and `Escape` to exit)
- Dark "ambient" visual style: blurred/scaled `cover_photo_url` as background if set, otherwise a subtle violet/fuchsia glow — visually distinct from the neobrutalist marketing site and dashboard
- Empty state: "Waiting for photos..." until the first upload arrives

## Related

- [[Photos Table]] — `image_url`, `guest_name`, `uploaded_at` consumed here
- [[Events Table]] — `cover_photo_url`, `event_date` consumed here
- [[Components]] — `Carousel`, `Slideshow`
- [[Architecture]] — Supabase client via `useSupabase()` (`src/lib/supabase/provider.tsx`)
