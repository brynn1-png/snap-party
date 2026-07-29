---
tags: [snapparty, flow, guest]
created: 2026-07-27
---

# Guest Flow

Part of [[SnapParty]]. Guiding UX principle: every guest-facing interaction should require the **minimum possible number of taps** — no submit button, the shutter action *is* the upload action. One deliberate exception: the guest's *final* shot (see "Final-shot review" below).

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
Capture → client-side compression → auto-upload (no submit button, repeats up to photo_limit - 1)
    ↓
Final shot → review modal (approve/retake) instead of auto-upload
    ↓
/e/[slug]/done — thank-you / completion screen
```

## Final-shot review (2026-07-29)

Every shot except the last still auto-uploads with zero gate, unchanged from the original "shutter = upload" design. Only the shot that would consume the guest's *last* remaining slot is held back, because once the session ends there's no way to go back and retake a bad final photo — every earlier shot is recoverable in the sense that the guest still has attempts left.

- `capture()` in `/e/[slug]/camera/page.tsx` detects this case (`shotsUsed + pendingCount + queuedCount + 1 >= photoLimit`) and, instead of uploading, holds the compressed file and shows `ShotReviewModal` (see [[Components]]) with **Retake** / **Use This Photo**.
- **Approve** uploads normally (`status = 'approved'`, counts toward `shots_used`) and redirects to `/e/[slug]/done`.
- **Retake** still uploads the rejected shot — nothing a guest captures is silently discarded — but tagged `status = 'retaken'`, stored under `events/{event-id}/{session-id}/retaken/` (see [[Photos Table]]), and does **not** increment `shots_used`. The guest is returned to the live camera to try the final shot again.
- Retaken shots flow through the same [[Offline Queue]] path as everything else, just with a `retaken` flag threaded through `QueuedPhoto` → `/api/upload`.
- Retaken shots are excluded from the guest-facing gallery, [[Live Slideshow]], and ZIP export — they only ever surface in the organizer dashboard's Outtakes tab, see [[Organizer Flow]].

## QR token validation (`/e/[slug]/page.tsx`)

If the URL has a `?qr=` param (meaning the guest scanned a physical QR code rather than following the plain shareable link), it's checked against `events.qr_token`. A mismatch — because the organizer hit "Regenerate QR" (see [[Organizer Flow]]) — shows a distinct "This QR code is no longer valid" state instead of the generic "Event not found." No `qr` param at all (the slug-only share link) always works regardless of rotation. See [[Events Table]].

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
- Mobile-first safe-area handling: top/bottom control bars pad themselves with `env(safe-area-inset-top/bottom)` (on top of base padding) so they clear the notch/Dynamic Island and home-indicator gesture area on notched phones — requires `viewport-fit: cover` set in `layout.tsx`, see [[Architecture]]

Data lands in [[Sessions Table]] (`shots_used` incremented) and [[Photos Table]] (new row), which the organizer sees live — see [[Organizer Flow]].

## Related

- [[Sessions Table]], [[Photos Table]] — where this flow writes
- [[Offline Queue]] — fallback path when `navigator.onLine` is false
- [[Architecture]] — data flow diagram
