-- Migration: Add guest_name columns, public event read policy, and messages table
-- Run this in Supabase SQL Editor

-- Add guest_name to sessions table
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS guest_name text;

-- Add guest_name to photos table
ALTER TABLE photos ADD COLUMN IF NOT EXISTS guest_name text;

-- Allow guests to look up events by slug (needed for QR code landing page)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can view events by slug'
  ) THEN
    CREATE POLICY "Anyone can view events by slug"
      ON events FOR SELECT
      USING (true);
  END IF;
END $$;

-- Messages table (guestbook)
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  session_id uuid REFERENCES sessions(id) ON DELETE CASCADE NOT NULL,
  guest_name text NOT NULL,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Messages indexes
CREATE INDEX IF NOT EXISTS messages_event_id ON messages(event_id);
CREATE INDEX IF NOT EXISTS messages_session_id ON messages(session_id);

-- Messages RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can view messages'
  ) THEN
    CREATE POLICY "Anyone can view messages"
      ON messages FOR SELECT
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can insert messages'
  ) THEN
    CREATE POLICY "Anyone can insert messages"
      ON messages FOR INSERT
      WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Organizers can delete messages from their events'
  ) THEN
    CREATE POLICY "Organizers can delete messages from their events"
      ON messages FOR DELETE
      USING (
        event_id IN (
          SELECT id FROM events WHERE organizer_id = auth.uid()
        )
      );
  END IF;
END $$;
