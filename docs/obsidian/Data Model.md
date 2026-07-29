---
tags: [snapparty, architecture, data-model]
created: 2026-07-27
---

# Data Model

Part of [[SnapParty]] · [[Architecture]]. Source: `supabase/schema.sql`.

**Design principle:** Postgres stores metadata and URLs only; binary image data lives entirely in Supabase Storage (bucket `photos`). This keeps tables lightweight and query-fast as photo volume grows.

## Tables

- [[Events Table]] — one row per organizer event
- [[Sessions Table]] — one row per anonymous guest device/session
- [[Photos Table]] — one row per uploaded photo
- [[Messages Table]] — guestbook entries (photo + written message pairing)

## Entity relationships

```
auth.users (Supabase Auth)
  └─< events (organizer_id)
        └─< sessions (event_id)
              ├─< photos (event_id, session_id)
              └─< messages (event_id, session_id)
```

## Storage structure

```
events/
  {event-id}/
    {session-id}/
      photo.jpg
      retaken/
        photo.jpg
```

Retaken shots (rejected during [[Guest Flow|final-shot review]]) live in a `retaken/` subfolder alongside the session's approved photos — same event/session prefix, so cleanup and per-session export still work the same way, but they never mix into the main gallery listing since that's driven by `photos.status`, not the storage path.

This hierarchy makes per-event and per-guest-session cleanup, export, and access control straightforward — e.g. ZIP export ([[Organizer Flow]]) is just "zip this folder."

## Row Level Security summary

- **events:** organizer can select/insert/update/delete only their own rows (`organizer_id = auth.uid()`); anyone can `select` by slug (public event lookup for guests).
- **sessions:** fully open select/insert/update — guests are anonymous, identified only by `session_token`, not `auth.uid()`.
- **photos:** anyone can select/insert; only the owning organizer can delete.
- **messages:** anyone can select/insert; only the owning organizer can delete.

This asymmetric RLS model mirrors the product's [[Vision & Positioning|authentication model]]: full accountability for organizers, zero friction/anonymity for guests.

## Migrations

Incremental migrations layered on top of the base schema, in `supabase/migrations/`:

- `002_add_guest_name.sql` — added `guest_name` to sessions/photos (see [[Guest Flow]])
- `003_add_event_date.sql` — added `event_date` to events
- `004_add_cover_photo_url.sql` — added `cover_photo_url` to events (used by `/api/upload-cover` and [[Live Slideshow]] background)
- `005_atomic_shot_increment.sql` — added `increment_session_shots()`, an atomic RPC that enforces `photo_limit` and increments `sessions.shots_used` in one statement, replacing an unsafe read-then-write in `/api/upload` (see [[Known Issues]])
- `006_add_photo_status.sql` — added `status` (`'approved'` | `'retaken'`) to `photos` for [[Guest Flow|final-shot review]]
