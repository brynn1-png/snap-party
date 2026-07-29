-- Distinguishes approved shots from ones the guest retook via the final-shot
-- review modal (ShotReviewModal). Retaken shots are still uploaded and kept
-- (never silently discarded) but are excluded from the guest-facing gallery,
-- live slideshow, and ZIP export, and don't count against shots_used.
alter table photos add column if not exists status text not null default 'approved';

create index if not exists photos_status on photos(status);
