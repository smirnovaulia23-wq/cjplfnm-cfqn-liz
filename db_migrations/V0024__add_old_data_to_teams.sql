-- Add column to store old team data before editing
ALTER TABLE teams ADD COLUMN old_data JSONB DEFAULT NULL;

COMMENT ON COLUMN teams.old_data IS 'Stores previous team data before editing for moderation comparison';