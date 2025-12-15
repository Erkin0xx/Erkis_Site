-- Add public read access to cities table for landing page
-- This allows anyone (including unauthenticated users) to view all cities

CREATE POLICY "Allow public read access to all cities"
  ON public.cities
  FOR SELECT
  USING (true);
