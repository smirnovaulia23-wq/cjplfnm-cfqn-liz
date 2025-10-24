-- Add stream_url column to matches table
ALTER TABLE matches ADD COLUMN IF NOT EXISTS stream_url TEXT;