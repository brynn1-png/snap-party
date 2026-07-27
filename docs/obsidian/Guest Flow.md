---
tags: [snapparty, flow, guest]
created: 2026-07-27
---

# Guest Flow

Part of [[SnapParty]]. Guiding UX principle: every guest-facing interaction should require the **minimum possible number of taps** — no submit button, the shutter action *is* the upload action.

## Flow

```
Scan QR / open link  →  /e/[slug]
    ↓
Event lookup by slug (Supabase select, RLS-open)
    ↓
Anonymous session created, session_token stored in localStorage
    ↓
/e/[slug]/name — guest enters name (skipped if already in localStorage)
    ↓
/e/[slug]/camera — full-screen camera, front/rear toggle, "N shots remaining"
    ↓
Capture → client-side compression → auto-upload (no submit button, repeats up to photo_limit)
    ↓
/e/[slug]/done — thank-you / completion screen
```

## Session resume logic (`/e/[slug]/page.tsx`)

On load, checks `localStorage` for an existing `session_{event.id}` token:
- If found and `shots_used >= photo_limit` → redirect straight to `/e/[slug]/done`.
- If found and under limit → skip straight to `/e/[slug]/camera` (or `/e/[slug]/name` if no name cached yet).
- If not found → show the "ready" state and create a new session on `handleStart()`.

This means a guest can close the browser mid-event and resume exactly where they left off without re-entering their name or losing their shot count.

## Camera capture details

- Full-screen, immersive UI (no browser chrome distraction)
- Front/rear camera toggle via MediaDevices API (`getUserMedia`)
- Guest name drawn onto the canvas (bottom-left, white text with shadow) before upload — see [[Sessions Table]] / [[Photos Table]] `guest_name`
- Client-side compression: WebP, capped at 1280px, quality 0.82, target ≤0.3MB (~70% storage savings vs. uncompressed) — via `browser-image-compression`
- If offline: photo is compressed and pushed into the [[Offline Queue]] instead of uploading directly
- Capture animation: white flash + photo flies to a corner "queue" indicator

Data lands in [[Sessions Table]] (`shots_used` incremented) and [[Photos Table]] (new row), which the organizer sees live — see [[Organizer Flow]].

## Related

- [[Sessions Table]], [[Photos Table]] — where this flow writes
- [[Offline Queue]] — fallback path when `navigator.onLine` is false
- [[Architecture]] — data flow diagram
