-- SnapParty Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Events table
create table if not exists events (
  id uuid primary key default uuid_generate_v4(),
  organizer_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  slug text unique not null,
  qr_token text unique not null,
  photo_limit int not null default 15,
  created_at timestamptz not null default now()
);

-- Sessions table (anonymous guest sessions)
create table if not exists sessions (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid references events(id) on delete cascade not null,
  session_token text unique not null,
  guest_name text,
  shots_used int not null default 0,
  device text,
  created_at timestamptz not null default now()
);

-- Photos table
create table if not exists photos (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid references events(id) on delete cascade not null,
  session_id uuid references sessions(id) on delete cascade not null,
  image_url text not null,
  file_size int,
  guest_name text,
  uploaded_at timestamptz not null default now()
);

-- Messages table (guestbook)
create table if not exists messages (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid references events(id) on delete cascade not null,
  session_id uuid references sessions(id) on delete cascade not null,
  guest_name text not null,
  message text not null,
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists events_organizer_id on events(organizer_id);
create index if not exists events_slug on events(slug);
create index if not exists events_qr_token on events(qr_token);
create index if not exists sessions_event_id on sessions(event_id);
create index if not exists sessions_session_token on sessions(session_token);
create index if not exists photos_event_id on photos(event_id);
create index if not exists photos_session_id on photos(session_id);
create index if not exists messages_event_id on messages(event_id);
create index if not exists messages_session_id on messages(session_id);

-- Row Level Security
alter table events enable row level security;
alter table sessions enable row level security;
alter table photos enable row level security;
alter table messages enable row level security;

-- Events policies
create policy "Organizers can view their own events"
  on events for select
  using (organizer_id = auth.uid());

create policy "Anyone can view events by slug"
  on events for select
  using (true);

create policy "Organizers can create events"
  on events for insert
  with check (organizer_id = auth.uid());

create policy "Organizers can update their own events"
  on events for update
  using (organizer_id = auth.uid());

create policy "Organizers can delete their own events"
  on events for delete
  using (organizer_id = auth.uid());

-- Sessions policies (public read for guests, insert for anyone)
create policy "Anyone can view sessions for event lookup"
  on sessions for select
  using (true);

create policy "Anyone can create sessions"
  on sessions for insert
  with check (true);

create policy "Sessions can update their own shot count"
  on sessions for update
  using (true);

-- Photos policies
create policy "Anyone can view photos"
  on photos for select
  using (true);

create policy "Anyone can insert photos"
  on photos for insert
  with check (true);

create policy "Organizers can delete photos from their events"
  on photos for delete
  using (
    event_id in (
      select id from events where organizer_id = auth.uid()
    )
  );

-- Storage bucket (run separately in Supabase Dashboard > Storage)
-- Create a bucket named "photos" with public access

-- Messages policies
create policy "Anyone can view messages"
  on messages for select
  using (true);

create policy "Anyone can insert messages"
  on messages for insert
  with check (true);

create policy "Organizers can delete messages from their events"
  on messages for delete
  using (
    event_id in (
      select id from events where organizer_id = auth.uid()
    )
  );
