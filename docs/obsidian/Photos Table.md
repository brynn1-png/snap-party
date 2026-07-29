---
tags: [snapparty, data-model, table]
created: 2026-07-27
---

# photos

Part of [[Data Model]].

One row per uploaded photo. The binary itself lives in Supabase Storage; this row is metadata + pointer.

| Field | Type | Purpose |
|---|---|---|
| id | uuid, PK | Primary key |
| event_id | uuid, FK → [[Events Table\|events]] | Cascade delete with event |
| session_id | uuid, FK → [[Sessions Table\|sessions]] | Cascade delete with session |
| image_url | text | Pointer to Supabase Storage object |
| file_size | int, nullable | Compressed file size in bytes |
| guest_name | text, nullable | Denormalized copy of the guest's name for fast dashboard/gallery display |
| status | text, default `'approved'` | `'approved'` or `'retaken'` — added in `006_add_photo_status.sql` for [[Guest Flow\|final-shot review]] |
| uploaded_at | timestamptz | Upload timestamp |

Written by `POST /api/upload` using the Supabase **service role key** (bypasses RLS on insert, since the endpoint itself is trusted). Selected in real time by [[Organizer Flow]]'s live gallery and by [[Live Slideshow]] via Supabase Realtime `postgres_changes` subscriptions (`INSERT`/`DELETE` on `photos`).

`status = 'retaken'` rows are shots the guest rejected during final-shot review — still uploaded (nothing captured is silently discarded) but stored under a `retaken/` subfolder (see storage structure in [[Data Model]]), excluded from the default gallery query, [[Live Slideshow]], and ZIP export, and don't increment `sessions.shots_used`. They only surface in the organizer dashboard's Outtakes tab ([[Organizer Flow]]).
