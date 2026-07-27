---
tags: [snapparty, data-model, table]
created: 2026-07-27
---

# sessions

Part of [[Data Model]].

An anonymous guest session — created the moment a guest's device hits `/e/[slug]` for the first time. No `auth.users` link; identity is purely the `session_token` held in the guest's `localStorage`.

| Field | Type | Purpose |
|---|---|---|
| id | uuid, PK | Primary key |
| event_id | uuid, FK → [[Events Table\|events]] | Cascade delete with event |
| session_token | text, unique | Anonymous guest session identifier, stored client-side |
| guest_name | text, nullable | Added in `002_add_guest_name.sql`; collected in [[Guest Flow]] |
| shots_used | int, default 0 | Running counter against `events.photo_limit` |
| device | text, nullable | Device/user-agent metadata |
| created_at | timestamptz | Creation timestamp |

Incremented on every successful upload via `/api/upload`. When `shots_used >= photo_limit`, the guest is redirected straight to `/e/[slug]/done` on re-visit. See [[Guest Flow]].
