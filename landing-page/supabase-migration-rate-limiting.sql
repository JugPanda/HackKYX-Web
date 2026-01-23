-- Add rate limiting table for persistent rate limiting
-- Run this in your Supabase SQL Editor

-- Create rate_limits table
CREATE TABLE IF NOT EXISTS public.rate_limits (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    identifier TEXT NOT NULL,
    action TEXT NOT NULL,
    count INTEGER NOT NULL DEFAULT 1,
    window_start TIMESTAMP WITH TIME ZONE NOT NULL,
    window_end TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT unique_identifier_action_window UNIQUE(identifier, action, window_start)
);

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier_action ON public.rate_limits(identifier, action);
CREATE INDEX IF NOT EXISTS idx_rate_limits_window_end ON public.rate_limits(window_end);

-- Function to check and increment rate limit
CREATE OR REPLACE FUNCTION public.check_rate_limit(
    p_identifier TEXT,
    p_action TEXT,
    p_max_requests INTEGER,
    p_window_ms INTEGER
)
RETURNS JSONB AS $$
DECLARE
    v_window_start TIMESTAMP WITH TIME ZONE;
    v_window_end TIMESTAMP WITH TIME ZONE;
    v_current_count INTEGER;
    v_allowed BOOLEAN;
BEGIN
    -- Calculate window boundaries
    v_window_start := DATE_TRUNC('milliseconds', NOW() - (p_window_ms || ' milliseconds')::INTERVAL);
    v_window_end := DATE_TRUNC('milliseconds', NOW());
    
    -- Try to get or create rate limit entry
    INSERT INTO public.rate_limits (identifier, action, count, window_start, window_end)
    VALUES (p_identifier, p_action, 1, v_window_start, v_window_end)
    ON CONFLICT (identifier, action, window_start)
    DO UPDATE SET 
        count = rate_limits.count + 1,
        updated_at = NOW()
    RETURNING count INTO v_current_count;
    
    -- Check if limit exceeded
    v_allowed := v_current_count <= p_max_requests;
    
    RETURN jsonb_build_object(
        'allowed', v_allowed,
        'count', v_current_count,
        'limit', p_max_requests,
        'remaining', GREATEST(0, p_max_requests - v_current_count),
        'resetAt', v_window_end
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up old rate limit entries
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS void AS $$
BEGIN
    DELETE FROM public.rate_limits
    WHERE window_end < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create scheduled job to clean up old entries (optional, requires pg_cron)
-- SELECT cron.schedule(
--     'cleanup-rate-limits',
--     '0 * * * *', -- Run every hour
--     'SELECT public.cleanup_old_rate_limits();'
-- );

-- Enable RLS on rate_limits table
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Only service role can access rate limits
CREATE POLICY "Service role only"
ON public.rate_limits
USING (false);
