---
tags: [snapparty, moc]
created: 2026-07-27
type: map-of-content
---

# SnapParty

Mobile-first, web-based event photo booth platform. Guests scan a QR code, take photos in their mobile browser (no app, no signup), and photos upload automatically and instantly to a live organizer dashboard.

> **Core insight:** event photos are lost, not missing. SnapParty removes the "send it later" step by uploading at the moment of capture.

The long-term ambition is not to be a gallery uploader but an **Interactive Event Experience Platform** — see [[Vision & Positioning]].

## Map of Content

- [[Architecture]] — stack, folder structure, request flow
- [[Data Model]] — Postgres schema overview
  - [[Events Table]]
  - [[Sessions Table]]
  - [[Photos Table]]
  - [[Messages Table]]
- [[Guest Flow]] — scan → name → camera → done
- [[Organizer Flow]] — login → dashboard → create event → event detail
- [[Live Slideshow]] — public ambient display for TV/projector
- [[Offline Queue]] — IndexedDB queue + background sync
- [[Components]] — UI component inventory
- [[Roadmap]] — Phase 1/2/3 status
- [[Vision & Positioning]] — problem statement, target users, differentiators, monetization
- [[Known Issues]]

## Quick Facts

- **Repo:** `C:\Users\bryan\github\snap\snap-party`
- **Stack:** Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · Supabase (Postgres + Storage + Auth + Realtime)
- **Design system:** Neobrutalism (thick borders, hard shadows, saturated colors)
- **Status (as of 2026-07-05):** Phase 1 MVP core complete, in polish; guest-name flow / slideshow / offline queue built 2026-07-13 (see [[Roadmap]])
