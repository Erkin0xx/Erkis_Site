-- ================================================================
-- ERKI DASHBOARD - SUPABASE DATABASE SCHEMA
-- ================================================================
-- Project: Erki Dashboard
-- Purpose: Complete database schema with RLS policies
-- Version: 1.0.0
-- Strict Security: All tables use Row Level Security
-- ================================================================

-- ================================================================
-- SECTION 1: EXTENSIONS
-- ================================================================

-- Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================================
-- SECTION 2: PROFILES TABLE
-- ================================================================
-- Purpose: Extended user metadata beyond auth.users
-- Security: RLS enabled with granular policies
-- ================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
    -- Primary Key (References auth.users)
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

    -- User Information
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    is_approved BOOLEAN NOT NULL DEFAULT FALSE,

    -- Profile Data
    avatar_url TEXT,
    full_name TEXT,

    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_seen TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- SECTION 3: R6 STATS CACHE TABLE
-- ================================================================
-- Purpose: Cache Rainbow Six Siege statistics to reduce API calls
-- TTL: 15 minutes (900 seconds)
-- ================================================================

CREATE TABLE IF NOT EXISTS public.r6_cache (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- User Reference
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

    -- Game Data
    username TEXT NOT NULL,
    platform TEXT NOT NULL CHECK (platform IN ('pc', 'psn', 'xbl')),

    -- Cached Stats (JSONB for flexibility)
    stats JSONB NOT NULL,

    -- Cache Management
    cached_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '15 minutes'),

    -- Constraints
    UNIQUE(user_id, username, platform)
);

-- Index for fast cache lookups
CREATE INDEX IF NOT EXISTS idx_r6_cache_user_lookup
    ON public.r6_cache(user_id, username, platform);

-- Index for cache expiration cleanup
CREATE INDEX IF NOT EXISTS idx_r6_cache_expiration
    ON public.r6_cache(expires_at);

-- ================================================================
-- SECTION 4: ROW LEVEL SECURITY POLICIES
-- ================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.r6_cache ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------
-- Profiles Table Policies
-- ----------------------------------------------------------------

-- Policy 1: Users can view their own profile
CREATE POLICY "Users can view own profile"
    ON public.profiles
    FOR SELECT
    USING (auth.uid() = id);

-- Policy 2: Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
    ON public.profiles
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Policy 3: Users can update their own profile (limited fields)
CREATE POLICY "Users can update own profile"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (
        auth.uid() = id
        AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
        AND is_approved = (SELECT is_approved FROM public.profiles WHERE id = auth.uid())
    );

-- Policy 4: Admins can update any profile
CREATE POLICY "Admins can update any profile"
    ON public.profiles
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Policy 5: Prevent direct inserts (handled by trigger)
CREATE POLICY "Prevent manual profile creation"
    ON public.profiles
    FOR INSERT
    WITH CHECK (false);

-- ----------------------------------------------------------------
-- R6 Cache Table Policies
-- ----------------------------------------------------------------

-- Policy 1: Users can view their own cache
CREATE POLICY "Users can view own cache"
    ON public.r6_cache
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy 2: Users can insert their own cache
CREATE POLICY "Users can insert own cache"
    ON public.r6_cache
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy 3: Users can update their own cache
CREATE POLICY "Users can update own cache"
    ON public.r6_cache
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Policy 4: Users can delete their own cache
CREATE POLICY "Users can delete own cache"
    ON public.r6_cache
    FOR DELETE
    USING (auth.uid() = user_id);

-- ================================================================
-- SECTION 5: AUTOMATIC PROFILE CREATION TRIGGER
-- ================================================================
-- Purpose: Auto-create profile when user signs up via auth.users
-- Security: New users default to is_approved = FALSE (gatekeeper)
-- ================================================================

-- Function: Handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, role, is_approved)
    VALUES (
        NEW.id,
        NEW.email,
        'user',
        FALSE
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Execute after user creation in auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ================================================================
-- SECTION 6: UPDATED_AT TRIGGER
-- ================================================================
-- Purpose: Automatically update updated_at timestamp
-- ================================================================

-- Function: Update timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Update profiles.updated_at
DROP TRIGGER IF EXISTS set_updated_at ON public.profiles;
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ================================================================
-- SECTION 7: CACHE CLEANUP FUNCTION
-- ================================================================
-- Purpose: Remove expired R6 cache entries
-- Usage: Can be called manually or via pg_cron
-- ================================================================

CREATE OR REPLACE FUNCTION public.cleanup_expired_cache()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM public.r6_cache
    WHERE expires_at < NOW();

    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================================
-- SECTION 8: INITIAL ADMIN USER SETUP
-- ================================================================
-- Purpose: Create first admin user (OPTIONAL - Run after first signup)
-- Instructions:
--   1. Sign up normally through the app
--   2. Get your user ID from Supabase Dashboard > Authentication > Users
--   3. Uncomment and run the UPDATE below with your ID
-- ================================================================

-- UNCOMMENT AND REPLACE 'your-user-id-here' after first signup:
--
-- UPDATE public.profiles
-- SET role = 'admin', is_approved = TRUE
-- WHERE id = 'your-user-id-here';

-- ================================================================
-- SECTION 9: HELPER VIEWS (OPTIONAL)
-- ================================================================

-- View: Recent unapproved users (for admin dashboard)
CREATE OR REPLACE VIEW public.pending_approvals AS
SELECT
    id,
    email,
    full_name,
    created_at
FROM public.profiles
WHERE is_approved = FALSE
ORDER BY created_at DESC;

-- Grant access to authenticated users with admin role
GRANT SELECT ON public.pending_approvals TO authenticated;

-- ================================================================
-- VERIFICATION QUERIES
-- ================================================================
-- Run these after migration to verify setup:
-- ================================================================

-- Check tables exist:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Check RLS is enabled:
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- Check policies:
-- SELECT schemaname, tablename, policyname FROM pg_policies WHERE schemaname = 'public';

-- ================================================================
-- MIGRATION COMPLETE
-- ================================================================
-- Next Steps:
-- 1. Run this SQL in Supabase SQL Editor
-- 2. Verify all tables and policies are created
-- 3. Generate TypeScript types: supabase gen types typescript
-- 4. Create first user and promote to admin
-- ================================================================
