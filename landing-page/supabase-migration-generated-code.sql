-- Migration: Add generated_code column to games table
-- This column stores AI-generated Python code for each game

ALTER TABLE games
ADD COLUMN IF NOT EXISTS generated_code TEXT;

COMMENT ON COLUMN games.generated_code IS 'AI-generated Python code for the game (optional, null if using template)';

-- Update existing games to have null generated_code (they use the template)
UPDATE games
SET generated_code = NULL
WHERE generated_code IS NULL;

-- No index needed as we won't query by this column

