-- Atomically increments a session's shots_used, enforcing the event's
-- photo_limit in the same statement. Replaces the previous select-then-update
-- from the API route, which was both racy (lost updates under concurrent
-- captures) and unenforced (no server-side cap on shots_used).
--
-- Returns the new shots_used count, or NULL if the session is already at
-- or past the limit (caller must treat NULL as "reject the upload").
create or replace function increment_session_shots(p_session_id uuid, p_limit int)
returns int
language sql
security definer
set search_path = public
as $$
  update sessions
  set shots_used = shots_used + 1
  where id = p_session_id
    and shots_used < p_limit
  returning shots_used;
$$;
