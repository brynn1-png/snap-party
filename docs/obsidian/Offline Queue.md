---
tags: [snapparty, feature]
created: 2026-07-27
---

# Offline Queue

Part of [[SnapParty]]. Handles poor venue Wi-Fi (weddings, festivals) so a failed or offline upload during [[Guest Flow]] capture isn't silently lost — flagged as an open question in [[Vision & Positioning]] §13 and implemented per `PLAN-guest-name-flow.md` Part 3.

## Components

- `src/lib/offlineQueue.ts` — IndexedDB wrapper. Queue item shape: `{ id, blob, eventId, sessionId, guestName, timestamp }`. Methods: `enqueue()`, `dequeue()`, `getAll()`, `remove()`, `clear()`. IndexedDB was chosen over `localStorage` specifically because it handles binary blobs with no practical size limit.
- `src/lib/syncWorker.ts` — background sync worker. Runs on page load and on the browser `online` event; drains the IndexedDB queue in order, retries each upload against `/api/upload`, removes successful entries, and updates a "syncing" UI state.

## Camera integration

In `/e/[slug]/camera`:
- Checks `navigator.onLine` before attempting upload.
- Offline → compress photo → `enqueue()` into IndexedDB → show "X photos queued" indicator.
- Online but upload fails → same fallback into the queue.
- On reconnect → `syncWorker` drains the queue → UI shows "Syncing..." then "All synced!"

A `public/sw.js` service worker for true background sync (retrying uploads even if the tab is closed) was scoped as a stretch goal, requiring HTTPS in production.

## Related

- [[Guest Flow]] — this is the fallback path off the main capture loop
- [[Photos Table]], [[Sessions Table]] — eventual destination once synced
