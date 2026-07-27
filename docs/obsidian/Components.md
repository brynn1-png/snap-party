---
tags: [snapparty, components]
created: 2026-07-27
---

# Components

Part of [[SnapParty]]. Shared React components live in `src/components/`, barrel-exported from `index.ts`.

## Marketing / landing page (`/`)

Composed on `src/app/page.tsx` in order:

- `Navbar` — top nav with Admin Login link; hamburger menu below `md` reveals How It Works/Features/Pricing/Admin Login (previously unreachable on mobile — those links were `hidden md:flex` with no fallback)
- `Hero` — "Snap. Done." hero section with CTAs
- `TrustedBy` — social proof strip
- `HowItWorks` — 3-step cards (Scan → Shoot → Done), see [[Guest Flow]]
- `LiveEventExperience` — showcases the live-gallery/real-time angle of the product
- `Features` — 6-card feature grid on black background
- `MobileShowcase` — mobile camera experience preview
- `OrganizerDashboard` — dashboard preview/marketing mockup (not the real `/dashboard` route)
- `CtaBanner` — "Start Collecting Memories in 60 Seconds"
- `Footer`
- `ScrollReveal` — scroll-triggered reveal animation wrapper used throughout the landing page

## Shared functional components

- `Carousel` — full-screen photo carousel, reused by both [[Live Slideshow]] (`fullScreen` mode) and elsewhere in the gallery UI
- `Slideshow` — continuous auto-rotating photo display, auto-play with pause-on-hover, wired to Supabase Realtime for new photos — see [[Live Slideshow]] and [[Organizer Flow]]

## Design system

Dark gradient glassmorphism throughout — see [[Architecture]]. `Carousel`'s non-fullscreen mode (used only by the dashboard's carousel gallery view) was still hardcoded to a light `bg-white` card until 2026-07-27; it now matches the same glass-card tokens as everything else.
