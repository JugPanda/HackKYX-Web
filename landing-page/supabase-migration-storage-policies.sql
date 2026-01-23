-- Fix storage policies to match actual folder structure
-- Run this in your Supabase SQL Editor

-- Drop existing policies for game-bundles bucket
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload to their folders" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own files" ON storage.objects;

-- Create corrected policies for game-bundles bucket

-- Public read access to all game bundles
CREATE POLICY "Public can read game bundles"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'game-bundles'
);

-- Service role and build service can insert files
-- Files are stored at: games/{game_id}/...
CREATE POLICY "Authenticated users can upload game bundles"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'game-bundles' AND
    auth.role() IN ('authenticated', 'service_role')
);

-- Users can update game files they own
CREATE POLICY "Users can update their game bundles"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'game-bundles' AND
    auth.role() IN ('authenticated', 'service_role')
);

-- Users can delete game files they own
CREATE POLICY "Users can delete their game bundles"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'game-bundles' AND
    auth.role() IN ('authenticated', 'service_role')
);

-- Create policies for game-sprites bucket (user uploads)

-- Public read access to sprites
CREATE POLICY "Public can read sprites"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'game-sprites'
);

-- Users can upload to their own sprite folder: {user_id}/...
CREATE POLICY "Users can upload their sprites"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'game-sprites' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can update their own sprites
CREATE POLICY "Users can update their sprites"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'game-sprites' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can delete their own sprites
CREATE POLICY "Users can delete their sprites"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'game-sprites' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

-- Ensure buckets exist and are configured correctly
-- Note: Run these via Supabase dashboard or API, not SQL

-- game-bundles bucket should be:
-- - public: true
-- - file_size_limit: 50MB (52428800 bytes)
-- - allowed_mime_types: ['text/html', 'application/javascript', 'application/wasm', 'application/octet-stream', 'image/png', 'image/jpeg', 'application/json']

-- game-sprites bucket should be:
-- - public: true
-- - file_size_limit: 5MB (5242880 bytes)
-- - allowed_mime_types: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']

-- Cleanup function for orphaned storage files
CREATE OR REPLACE FUNCTION public.cleanup_orphaned_game_files()
RETURNS void AS $$
BEGIN
    -- This function can be used to clean up storage files
    -- for games that no longer exist in the database
    -- Implementation depends on your cleanup strategy
    RAISE NOTICE 'Storage cleanup should be handled via application logic or scheduled jobs';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
