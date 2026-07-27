---
tags: [snapparty, data-model, table]
created: 2026-07-27
---

# messages

Part of [[Data Model]].

Digital guestbook entries — a written message paired with a guest session, distinct from a photo upload. Listed as a Phase 2 "Digital Guestbook" feature in [[Vision & Positioning]] and [[Roadmap]]; the table already exists in `schema.sql` even though a dedicated UI for authoring messages isn't documented elsewhere in this vault.

| Field | Type | Purpose |
|---|---|---|
| id | uuid, PK | Primary key |
| event_id | uuid, FK → [[Events Table\|events]] | Cascade delete with event |
| session_id | uuid, FK → [[Sessions Table\|sessions]] | Cascade delete with session |
| guest_name | text | Author's name |
| message | text | Guestbook message body |
| created_at | timestamptz | Creation timestamp |

RLS: anyone can select/insert; only the owning organizer can delete (same pattern as [[Photos Table]]).
