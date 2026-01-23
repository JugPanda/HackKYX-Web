-- Add play count tracking functionality
-- Run this in your Supabase SQL Editor

-- Function to increment play count for a game
CREATE OR REPLACE FUNCTION public.increment_play_count(game_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.games
    SET play_count = play_count + 1
    WHERE id = game_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Optional: Create a detailed play tracking table for analytics
CREATE TABLE IF NOT EXISTS public.game_plays (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    game_id UUID REFERENCES public.games(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    played_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    session_duration INTEGER, -- Duration in seconds (optional, can be updated later)
    user_agent TEXT,
    ip_address TEXT,
    
    -- Indexes for analytics queries
    CONSTRAINT fk_game FOREIGN KEY (game_id) REFERENCES public.games(id) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_game_plays_game_id ON public.game_plays(game_id);
CREATE INDEX IF NOT EXISTS idx_game_plays_user_id ON public.game_plays(user_id);
CREATE INDEX IF NOT EXISTS idx_game_plays_played_at ON public.game_plays(played_at);

-- Enable RLS on game_plays table
ALTER TABLE public.game_plays ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert play records
CREATE POLICY "Anyone can record plays"
ON public.game_plays FOR INSERT
WITH CHECK (true);

-- Policy: Public read access for analytics
CREATE POLICY "Public can view play records"
ON public.game_plays FOR SELECT
USING (true);

-- Function to record detailed play (optional, for future use)
CREATE OR REPLACE FUNCTION public.record_play(
    p_game_id UUID,
    p_user_id UUID DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_ip_address TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_play_id UUID;
BEGIN
    -- Increment play count
    UPDATE public.games
    SET play_count = play_count + 1
    WHERE id = p_game_id;
    
    -- Insert detailed play record
    INSERT INTO public.game_plays (game_id, user_id, user_agent, ip_address)
    VALUES (p_game_id, p_user_id, p_user_agent, p_ip_address)
    RETURNING id INTO v_play_id;
    
    RETURN v_play_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get play analytics for a game
CREATE OR REPLACE FUNCTION public.get_game_analytics(p_game_id UUID)
RETURNS TABLE (
    total_plays BIGINT,
    unique_users BIGINT,
    plays_last_24h BIGINT,
    plays_last_7d BIGINT,
    plays_last_30d BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*)::BIGINT AS total_plays,
        COUNT(DISTINCT user_id)::BIGINT AS unique_users,
        COUNT(*) FILTER (WHERE played_at > NOW() - INTERVAL '24 hours')::BIGINT AS plays_last_24h,
        COUNT(*) FILTER (WHERE played_at > NOW() - INTERVAL '7 days')::BIGINT AS plays_last_7d,
        COUNT(*) FILTER (WHERE played_at > NOW() - INTERVAL '30 days')::BIGINT AS plays_last_30d
    FROM public.game_plays
    WHERE game_id = p_game_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
