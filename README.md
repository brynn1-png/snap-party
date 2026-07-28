# SnapParty

A mobile-first, web-based event photo booth. Guests scan a QR code, take photos directly in their mobile browser (no app install, no registration), and photos upload automatically to a live organizer dashboard.

See [`SnapParty-Vision-Implementation-Plan.md`](../SnapParty-Vision-Implementation-Plan.md) (root of repo) for the product vision and roadmap, and [`PROGRESS.md`](./PROGRESS.md) for current build status.

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Supabase Setup

1. Run `supabase/schema.sql` in the SQL Editor
2. Create a Storage bucket named `photos` (public)
3. Enable Realtime on the `photos` and `messages` tables (Database → Replication)
4. Add a redirect URL in Auth settings: `http://localhost:3000/dashboard`
5. Copy `.env.local` with your Supabase project URL, anon key, and service role key

## Tech Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Supabase (Postgres, Storage, Auth, Realtime)

## Project Structure

- `src/app/e/[slug]` — guest flow (landing → name → camera → done)
- `src/app/dashboard` — organizer flow (event list → create → event detail/gallery/slideshow)
- `src/app/live/[slug]` — public live slideshow view (TV/projector)
- `src/app/api/upload`, `src/app/api/upload-cover` — server-side upload endpoints
- `src/lib/offlineQueue.ts`, `src/lib/syncWorker.ts` — IndexedDB offline upload queue + background sync

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
