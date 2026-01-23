-- Update language default and add generated_code field
-- Run this in your Supabase SQL Editor

-- Add language column if it doesn't exist (it should from main schema)
-- and change default to 'javascript'
ALTER TABLE public.games
ALTER COLUMN language SET DEFAULT 'javascript';

-- Add generated_code column if it doesn't exist
ALTER TABLE public.games
ADD COLUMN IF NOT EXISTS generated_code TEXT;

-- Update existing games without language to use javascript
UPDATE public.games
SET language = 'javascript'
WHERE language IS NULL OR language = '';

-- Update existing Python games to keep their language
-- (no action needed, they already have language = 'python')

-- Create index for language-based queries
CREATE INDEX IF NOT EXISTS idx_games_language ON public.games(language);

-- Function to get language statistics
CREATE OR REPLACE FUNCTION public.get_language_stats()
RETURNS TABLE (
    language TEXT,
    game_count BIGINT,
    total_plays BIGINT,
    avg_likes NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        g.language,
        COUNT(*)::BIGINT AS game_count,
        SUM(g.play_count)::BIGINT AS total_plays,
        ROUND(AVG(g.like_count)::NUMERIC, 2) AS avg_likes
    FROM public.games g
    WHERE g.status = 'published'
    GROUP BY g.language
    ORDER BY game_count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
