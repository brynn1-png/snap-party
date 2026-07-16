-- Migration: Add cover_photo_url column and fix update RLS policy
-- Run this in Supabase SQL Editor

-- Add cover_photo_url column
ALTER TABLE events ADD COLUMN IF NOT EXISTS cover_photo_url text;

-- Fix the update policy to include WITH CHECK (required for PATCH to work)
DROP POLICY IF EXISTS "Organizers can update their own events" ON events;
CREATE POLICY "Organizers can update their own events"
  ON events FOR UPDATE
  USING (organizer_id = auth.uid())
  WITH CHECK (organizer_id = auth.uid());

-- Refresh PostgREST schema cache
NOTIFY pgrst, 'reload schema';
