-- Rate limiting table for serverless-compatible rate limiting
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS rate_limits (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Index for fast lookups by identifier and time
CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier_created 
ON rate_limits (identifier, created_at DESC);

-- Auto-cleanup old entries (older than 24 hours)
-- Run this as a scheduled function or cron job
CREATE OR REPLACE FUNCTION cleanup_old_rate_limits()
RETURNS void AS $$
BEGIN
  DELETE FROM rate_limits WHERE created_at < now() - interval '24 hours';
END;
$$ LANGUAGE plpgsql;

-- Enable RLS
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert their own rate limit entries
CREATE POLICY "Users can insert rate limits" ON rate_limits
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Allow service role to read all (for counting)
CREATE POLICY "Service can read rate limits" ON rate_limits
  FOR SELECT TO authenticated
  USING (true);

-- Allow service role to delete old entries
CREATE POLICY "Service can delete rate limits" ON rate_limits
  FOR DELETE TO service_role
  USING (true);
