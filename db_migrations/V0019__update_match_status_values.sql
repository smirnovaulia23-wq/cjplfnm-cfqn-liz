-- Update match status constraint to support new values
ALTER TABLE matches DROP CONSTRAINT IF EXISTS matches_status_check;

ALTER TABLE matches 
ADD CONSTRAINT matches_status_check 
CHECK (status IN ('waiting', 'live', 'playing', 'completed'));

-- Update existing values if any
UPDATE matches SET status = 'waiting' WHERE status = 'scheduled';
UPDATE matches SET status = 'playing' WHERE status = 'in_progress';
