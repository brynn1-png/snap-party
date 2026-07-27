---
tags: [snapparty, data-model, table]
created: 2026-07-27
---

# events

Part of [[Data Model]].

One row per organizer event — the root entity everything else hangs off.

| Field | Type | Purpose |
|---|---|---|
| id | uuid, PK | Primary key |
| organizer_id | uuid, FK → `auth.users` | Owning organizer, cascade delete |
| name | text | Event display name |
| slug | text, unique | Human-readable identifier used in URLs (`/e/[slug]`, `/live/[slug]`) |
| qr_token | text, unique | Token embedded in the generated QR code as `?qr=` — kept distinct from `slug` so "Regenerate QR" ([[Organizer Flow]]) can rotate it without changing the readable share URL. Was dead/unread data until 2026-07-27 — see [[Known Issues]] |
| photo_limit | int, default 15 | Max shots per guest session |
| event_date | date, nullable | Added in `003_add_event_date.sql` |
| cover_photo_url | text, nullable | Added in `004_add_cover_photo_url.sql`; background image on [[Live Slideshow]] |
| created_at | timestamptz | Creation timestamp |

Created via [[Organizer Flow]] (`/dashboard/create`). Looked up by `slug` in [[Guest Flow]] and [[Live Slideshow]].
