-- Add role field to profiles table for admin access control
-- Run this in your Supabase SQL Editor

-- Add role column to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user';

-- Add constraint for role values
ALTER TABLE public.profiles
ADD CONSTRAINT role_check CHECK (role IN ('user', 'moderator', 'admin'));

-- Create index for role lookups
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Update the handle_new_user function to include role field
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id, 
        username, 
        avatar_url,
        subscription_tier,
        games_created_this_month,
        last_reset_date,
        role
    )
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
        NEW.raw_user_meta_data->>'avatar_url',
        'free',  -- All new users start on free tier
        0,       -- Start with 0 games created
        NOW(),   -- Set reset date to now
        'user'   -- All new users start with user role
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- For existing users, set default role if needed
UPDATE public.profiles
SET role = 'user'
WHERE role IS NULL;

-- Grant admin role to first user (you can change this email to your admin email)
-- IMPORTANT: Update this with your actual admin email before running!
-- UPDATE public.profiles
-- SET role = 'admin'
-- WHERE id = (SELECT id FROM auth.users WHERE email = 'your-admin-email@example.com' LIMIT 1);

-- Create RLS policies for admin access
-- Admins and moderators can view all reports
CREATE POLICY "Admins and moderators can view all reports"
ON public.reports FOR SELECT
USING (
    auth.uid() IN (
        SELECT id FROM public.profiles 
        WHERE role IN ('admin', 'moderator')
    )
);

-- Admins and moderators can update reports
CREATE POLICY "Admins and moderators can update reports"
ON public.reports FOR UPDATE
USING (
    auth.uid() IN (
        SELECT id FROM public.profiles 
        WHERE role IN ('admin', 'moderator')
    )
);

-- Only admins can change user roles
CREATE POLICY "Only admins can update user roles"
ON public.profiles FOR UPDATE
USING (
    auth.uid() IN (
        SELECT id FROM public.profiles 
        WHERE role = 'admin'
    )
);

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = user_id AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is admin or moderator
CREATE OR REPLACE FUNCTION public.is_moderator_or_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = user_id AND role IN ('admin', 'moderator')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
