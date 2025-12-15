-- ================================================================
-- APPROVE CURRENT USER AS ADMIN
-- ================================================================
-- This script approves the current authenticated user and sets them as admin
-- Run this in the Supabase SQL Editor while logged in
-- ================================================================

-- Approve and set as admin for the currently authenticated user
UPDATE public.profiles
SET
    role = 'admin',
    is_approved = TRUE
WHERE id = auth.uid();

-- Verify the update
SELECT
    id,
    email,
    role,
    is_approved,
    created_at
FROM public.profiles
WHERE id = auth.uid();
