# Plan: SnapParty Updates

**Date:** July 13, 2026
**Status:** In Progress

---

## Overview

Three major updates:
1. **Guest Name Flow** — Add name input step, stamp name on photos
2. **Slideshow** — Continuous photo slideshow on admin dashboard
3. **Offline Queue** — Queue uploads when offline, retry when online

---

## Part 1: Guest Name Flow

### Desired Flow

```
Guest scans QR/LINK
    ↓
Custom landing page for event
    ↓
System asks name for the stamp
    ↓
Prompt to shoot / camera permission
    ↓
15 shots
    ↓
15 shots consumed
    ↓
Outro custom landing (done page)
```

### Changes Required

#### 1.1 Add `guest_name` to DB schema
**File:** `supabase/schema.sql`

- Add `guest_name text` column to `sessions` table
- Add `guest_name text` column to `photos` table (for direct reference)

---

#### 1.2 Create name input page
**New file:** `src/app/e/[slug]/name/page.tsx`

- Shows event name at top
- Text input for guest name
- "Continue" button → saves name to localStorage → redirects to `/e/[slug]/camera`
- If name already in localStorage, skip this step (like camera does)

---

#### 1.3 Update landing page flow
**File:** `src/app/e/[slug]/page.tsx`

- After session creation, redirect to `/e/[slug]/name` instead of `/e/[slug]/camera`

---

#### 1.4 Update camera page
**File:** `src/app/e/[slug]/camera/page.tsx`

- Draw guest name on canvas (bottom-left, white text with shadow for readability)
- Pass `guest_name` to upload API
- Remove `photo_limit` from localStorage reads (hardcode 15)

---

#### 1.5 Update upload API
**File:** `src/app/api/upload/route.ts`

- Accept `guest_name` in FormData
- Store in `photos` table

---

#### 1.6 Update dashboard
**File:** `src/app/dashboard/events/[id]/page.tsx`

- Show `guest_name` under each photo in gallery
- Show `guest_name` in sessions list

---

#### 1.7 Fix shot limit
**Files:** `src/app/dashboard/create/page.tsx`, `src/app/e/[slug]/page.tsx`

- Remove `photo_limit` from event creation form
- Default to 15 in event creation logic

---

## Part 2: Slideshow (Admin Dashboard)

### Desired Flow

```
Event panel
    ↓
Guest takes pictures
    ↓
Admin dashboard shows a slideshow (continuous)
```

### Changes Required

#### 2.1 Create slideshow component
**New file:** `src/components/Slideshow.tsx`

- Continuous auto-rotating display of photos
- Minimal controls: auto-play with pause on hover
- Uses Supabase Realtime to add new photos dynamically
- Responsive design (works on desktop and mobile)

---

#### 2.2 Add slideshow to event detail page
**File:** `src/app/dashboard/events/[id]/page.tsx`

- Add "Slideshow" button or toggle
- Opens slideshow in full-screen or dedicated section
- Shows photos as they're uploaded in real-time

---

#### 2.3 Slideshow styling
**File:** `src/app/globals.css`

- Add slideshow-specific animations
- Transition effects between photos

---

## Part 3: Offline Queue

### Desired Flow

```
Backend/DB
    ↓
Guest takes photo
    ↓
System uploads everything realtime
    ↓
Queue if offline, stored in browser memory (IndexedDB)
    ↓
Data fetched from database then sent to the admin dashboard
```

### Changes Required

#### 3.1 Create offline queue utility
**New file:** `src/lib/offlineQueue.ts`

- IndexedDB wrapper for storing pending uploads
- Queue structure: `{ id, blob, eventId, sessionId, guestName, timestamp }`
- Methods: `enqueue()`, `dequeue()`, `getAll()`, `remove()`, `clear()`

---

#### 3.2 Update camera page for offline support
**File:** `src/app/e/[slug]/camera/page.tsx`

- Check `navigator.onLine` before upload
- If offline: compress photo → save to IndexedDB queue → show queue indicator
- If online: try upload, on failure → save to queue

---

#### 3.3 Create background sync worker
**New file:** `src/lib/syncWorker.ts`

- Runs on page load and on `online` event
- Checks IndexedDB for pending uploads
- Retries uploads in order
- Removes successful uploads from queue
- Updates UI with sync status

---

#### 3.4 Add queue status indicator
**File:** `src/app/e/[slug]/camera/page.tsx`

- Show "X photos queued" when offline
- Show "Syncing..." when reconnecting
- Show "All synced!" when queue is empty

---

#### 3.5 Service worker for background sync (stretch)
**New file:** `public/sw.js`

- Register service worker for background sync
- Auto-retry uploads when connection is restored
- Note: Requires HTTPS in production

---

## Decisions

| Question | Answer |
|---|---|
| Name flow | Separate page (`/e/[slug]/name`) |
| Name stamp position | Bottom-left corner |
| Outro page | Generic for now |
| Shot limit | Fixed 15 (no organizer customization for now) |
| Name usage | Both on photos AND in dashboard |
| Slideshow | Continuous, minimal controls (auto-play + pause on hover) |
| Offline storage | IndexedDB (better for binary data, no size limit) |

---

## Tech Stack

- Next.js 16, React 19, Tailwind CSS v4
- Supabase (Auth, DB, Storage, Realtime)
- Neobrutalism design system
- IndexedDB (for offline queue)
- Service Workers (for background sync - stretch)

---

## File Structure

```
src/app/e/[slug]/
├── page.tsx              # Event landing page (updated)
├── name/page.tsx         # NEW: Guest name input
├── camera/page.tsx       # Camera interface (updated + offline queue)
└── done/page.tsx         # Done page (generic)

src/app/dashboard/events/[id]/
└── page.tsx              # Event detail page (updated + slideshow)

src/components/
├── Slideshow.tsx         # NEW: Photo slideshow component
└── ...existing components

src/lib/
├── offlineQueue.ts       # NEW: IndexedDB queue utility
├── syncWorker.ts         # NEW: Background sync worker
└── supabase/
    ├── client.ts
    ├── server.ts
    └── middleware.ts

public/
└── sw.js                 # NEW: Service worker (stretch)
```

---

## Implementation Order

1. **Part 1: Guest Name Flow** (Core feature)
   - DB schema update
   - Name input page
   - Camera updates
   - Dashboard updates

2. **Part 3: Offline Queue** (Do before slideshow)
   - IndexedDB utility
   - Camera offline support
   - Sync worker
   - Queue indicator

3. **Part 2: Slideshow** (Final feature)
   - Slideshow component
   - Integration with event detail page
   - Styling and animations
