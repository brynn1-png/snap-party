# SnapParty — Progress Tracker

**Last updated:** July 29, 2026

---

## Phase 1 MVP Status: ✅ Core Complete

### Completed

#### Landing Page (Public)
- [x] Neobrutalism design system (thick borders, hard shadows, saturated colors)
- [x] Hero section — "Snap. Done." with CTAs
- [x] How It Works — 3-step cards (Scan → Shoot → Done)
- [x] Features grid — 6 cards on black background
- [x] CTA banner — "Start Collecting Memories in 60 Seconds"
- [x] Navbar with Admin Login link
- [x] Footer

#### Authentication
- [x] Supabase Auth setup (browser + server clients)
- [x] Login page — email/password + magic link
- [x] Signup page — account creation
- [x] Proxy middleware (renamed from deprecated middleware.ts)
- [x] Route protection — `/dashboard` redirects to login if unauthenticated

#### Organizer Dashboard
- [x] Event list — shows all events with guest/photo counts
- [x] Event creation form — name + cover photo
- [x] Event detail page — QR code, stats, live gallery
- [x] Live gallery — real-time via Supabase Realtime, grid + carousel views, all/photos filter tabs
- [x] Delete/moderate photos — hover to reveal delete button
- [x] Bulk ZIP download — jszip + file-saver
- [x] Basic stats — guest count, photo count, shots per guest
- [x] Event link sharing — copy-link button (in addition to QR)
- [x] Live Slideshow — continuous auto-rotating display (`/live/[slug]`, TV/projector-friendly)
- [x] Guestbook messages — guest-submitted messages shown alongside gallery, real-time
- [x] Outtakes tab — shots guests retook on their final shot are kept (not discarded), shown in a separate dashboard tab, excluded from ZIP/slideshow/default gallery

#### Guest Experience
- [x] Landing page `/e/[slug]` — event lookup + session creation
- [x] Guest name step `/e/[slug]/name` — collected before camera, stamped onto photos (bottom-left)
- [x] Camera interface — full-screen, front/rear toggle
- [x] Shot counter — tracks used vs limit (fixed at 15)
- [x] Auto-upload — capture → compress → upload (no submit button)
- [x] Client-side compression — WebP, 1280px, 0.82 quality
- [x] Background uploads — no blocking modal, queue indicator
- [x] Offline queue — IndexedDB queue + background sync worker, retries on reconnect
- [x] Capture animation — white flash + photo fly to corner
- [x] Final-shot review — the shot that would consume the guest's last slot pops a preview modal (Approve/Retake) instead of auto-uploading; earlier shots stay auto-upload with no gate
- [x] Thank-you / completion screen — includes "leave a message" guestbook form

#### Upload Pipeline
- [x] Server-side upload API route (`/api/upload`) — uses service role key
- [x] Supabase Storage integration
- [x] Automatic shot count increment
- [x] Real-time photo insertion on organizer dashboard

#### Image Optimization
- [x] WebP format (vs JPG) — ~30% smaller
- [x] Resolution cap at 1280px (vs 1920px) — ~50% smaller
- [x] Quality reduction to 0.82 (vs 0.95) — ~20% smaller
- [x] Max file size limit 0.3MB
- [x] Estimated ~70% storage savings per photo

---

## What's Left (Phase 1 polish)

- [ ] Real text/name search over gallery (only an all/photos filter tab exists today, not a search box)
- [ ] Detailed event analytics (peak upload times, storage used)
- [x] ~~Photo preview before upload (retake option)~~ — shipped, scoped to the final shot only (see Guest Experience above)

---

## Phase 2

- [x] Live Slideshow (TV/projector display)
- [x] Digital Guestbook (message, not tied to a specific photo)
- [ ] Event Branding / Photo Frames (event cover photo exists, but no overlay/frame applied to guest photos pre-upload)
- [ ] Improved real-time dashboard (activity feed, live counts) — live gallery updates in real time, but no dedicated activity feed

---

## Phase 3 (Not started)

- [ ] AI Photo Strip / Collage generation
- [ ] Face recognition/grouping
- [ ] Advanced analytics
- [ ] SaaS account system + billing
- [ ] White-label / multi-organizer support

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 16, React 19, Tailwind CSS v4 |
| Camera | MediaDevices API (getUserMedia) |
| Backend | Next.js API Routes |
| Database | Supabase (PostgreSQL) |
| Storage | Supabase Storage |
| Auth | Supabase Auth |
| Design | Neobrutalism |

---

## Known Issues

- Dev server WebSocket HMR fails when accessing from other devices on network (dev-only, not in production)
- `<img>` tags used for external Supabase Storage URLs (lint warnings, intentional)

---

## File Structure

```
snap-party/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Landing page
│   │   ├── layout.tsx                  # Root layout
│   │   ├── template.tsx                # Route transition wrapper
│   │   ├── Providers.tsx               # Client-side providers
│   │   ├── globals.css                 # Neobrutalism design tokens
│   │   ├── login/page.tsx              # Login (email/password + magic link)
│   │   ├── signup/page.tsx             # Account creation
│   │   ├── dashboard/
│   │   │   ├── page.tsx                # Event list
│   │   │   ├── layout.tsx              # Dashboard layout with logout
│   │   │   ├── LogoutButton.tsx        # Client logout component
│   │   │   ├── create/page.tsx         # Create event form (+ cover photo)
│   │   │   └── events/[id]/page.tsx    # Event detail + gallery + slideshow launch + messages
│   │   ├── e/[slug]/
│   │   │   ├── page.tsx                # Guest landing
│   │   │   ├── name/page.tsx           # Guest name capture (stamped on photos)
│   │   │   ├── camera/page.tsx         # Camera interface + offline queue
│   │   │   └── done/page.tsx           # Completion screen + guestbook message form
│   │   ├── live/[slug]/page.tsx        # Public live slideshow (TV/projector)
│   │   └── api/
│   │       ├── upload/route.ts         # Server-side photo upload endpoint
│   │       └── upload-cover/route.ts   # Server-side event cover photo upload
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── Features.tsx
│   │   ├── CtaBanner.tsx
│   │   ├── Footer.tsx
│   │   ├── Slideshow.tsx               # Auto-rotating real-time photo display
│   │   ├── ShotReviewModal.tsx         # Approve/retake preview for the final shot
│   │   ├── Carousel.tsx                # Gallery carousel view
│   │   ├── MobileShowcase.tsx
│   │   ├── LiveEventExperience.tsx
│   │   ├── TrustedBy.tsx
│   │   └── ScrollReveal.tsx
│   ├── lib/
│   │   ├── offlineQueue.ts             # IndexedDB pending-upload queue
│   │   ├── syncWorker.ts               # Background sync/retry on reconnect
│   │   ├── generateToken.ts            # QR/session token generation
│   │   └── supabase/
│   │       ├── client.ts               # Browser client
│   │       ├── server.ts               # Server client
│   │       ├── provider.tsx            # Supabase context provider
│   │       └── middleware.ts           # Session refresh logic
│   └── proxy.ts                        # Next.js 16 proxy (was middleware)
├── supabase/
│   └── schema.sql                      # Database schema + RLS policies
├── .env.local                          # Supabase credentials
└── package.json
```

---

## Supabase Setup Required

1. Run `supabase/schema.sql` in SQL Editor
2. Create Storage bucket named `photos` (public)
3. Enable Realtime on `photos` and `messages` tables (Database → Replication)
4. Add redirect URL in Auth settings: `http://localhost:3000/dashboard`
