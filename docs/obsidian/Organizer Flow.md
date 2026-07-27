---
tags: [snapparty, flow, organizer]
created: 2026-07-27
---

# Organizer Flow

Part of [[SnapParty]]. Organizers are the only authenticated users in the system (Supabase Auth) — see [[Data Model]] RLS notes.

## Flow

```
/login (email/password or magic link)  →  /dashboard
    ↓
/dashboard — event list: guest count, photo count per event
    ↓
/dashboard/create — new event form (name, photo limit)
    ↓
/dashboard/events/[id] — event detail:
    • QR code (generated client-side via `qrcode`, encodes `slug` + `qr_token` as `?qr=` param)
    • "Regenerate QR" — assigns a new `qr_token`; old printed/shared QR codes stop working, "Share Event" link (slug-only, no `qr` param) is unaffected — see [[Events Table]]
    • Live gallery, updated in real time via Supabase Realtime
    • Uploads-over-time chart (`UploadsChart`, 24h bucketed)
    • Guest sessions list (name, shots used)
    • Guestbook messages (see [[Messages Table]])
    • Delete/moderate photos (hover to reveal delete button)
    • Bulk ZIP download (jszip + file-saver)
    • [[Live Slideshow]] launch/toggle
```

Route protection: `/dashboard/**` redirects unauthenticated visitors to `/login`, enforced in `src/proxy.ts` (Next.js 16's replacement for `middleware.ts`) using the session-refresh logic in `src/lib/supabase/middleware.ts`.

## Dashboard widgets

- Total guests, total photos, shots-per-guest
- Upload activity chart (hourly buckets over the last 24h, computed client-side from `photos.uploaded_at`)
- Real-time photo insertion — subscribes to `postgres_changes` INSERT/DELETE on the `photos` table filtered by `event_id`, same pattern used by [[Live Slideshow]]

## Related

- [[Events Table]] — organizer owns via `organizer_id`
- [[Photos Table]], [[Sessions Table]], [[Messages Table]] — data shown in the dashboard
- [[Guest Flow]] — the flow feeding this dashboard live
