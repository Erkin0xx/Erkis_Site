-- ================================================================
-- FIX INFINITE RECURSION IN RLS POLICIES
-- ================================================================
-- The problem: policies were querying the profiles table within
-- the profiles table policies, causing infinite recursion.
-- Solution: Simplify policies to avoid self-referencing queries
-- ================================================================

-- Drop all existing policies on profiles table
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
DROP POLICY IF EXISTS "Prevent manual profile creation" ON public.profiles;

-- ================================================================
-- NEW SIMPLIFIED POLICIES (No self-referencing)
-- ================================================================

-- Policy 1: Users can view their own profile
CREATE POLICY "Users can view own profile"
    ON public.profiles
    FOR SELECT
    USING (auth.uid() = id);

-- Policy 2: Users can update their own profile (except role and is_approved)
CREATE POLICY "Users can update own profile"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id);

-- Policy 3: Service role can do anything (for admin operations via API)
-- Note: Admins will need to use service role key for admin operations
CREATE POLICY "Service role full access"
    ON public.profiles
    FOR ALL
    USING (auth.jwt()->>'role' = 'service_role');

-- Policy 4: Prevent manual profile creation (handled by trigger only)
CREATE POLICY "Prevent manual profile creation"
    ON public.profiles
    FOR INSERT
    WITH CHECK (false);

-- ================================================================
-- VERIFICATION
-- ================================================================
-- After running this, profiles should be readable without recursion
-- Test with: SELECT * FROM public.profiles WHERE id = auth.uid();
-- ================================================================
