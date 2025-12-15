-- Insert all cities using the user_id from existing New York city
-- Run this in Supabase SQL Editor

-- First, let's get the user_id from your existing city
-- Then insert all other cities with that same user_id

WITH user_info AS (
  SELECT user_id FROM public.cities WHERE name = 'New York' LIMIT 1
)
INSERT INTO public.cities (user_id, name, country, latitude, longitude, status, visit_date)
SELECT
  user_info.user_id,
  city.name::VARCHAR,
  city.country::VARCHAR,
  city.latitude::DECIMAL,
  city.longitude::DECIMAL,
  city.status::VARCHAR,
  city.visit_date::DATE
FROM user_info,
(VALUES
  -- Miami
  ('Miami', 'United States', 25.7617, -80.1918, 'visited', NULL::DATE),

  -- Paris
  ('Paris', 'France', 48.8566, 2.3522, 'visited', NULL::DATE),

  -- Munich
  ('Munich', 'Germany', 48.1351, 11.582, 'visited', NULL::DATE),

  -- Sofia
  ('Sofia', 'Bulgaria', 42.6977, 23.3219, 'visited', NULL::DATE),

  -- Marrakech
  ('Marrakech', 'Morocco', 31.6295, -7.9811, 'visited', NULL::DATE),

  -- Barcelona
  ('Barcelona', 'Spain', 41.3874, 2.1686, 'visited', NULL::DATE),

  -- Valencia
  ('Valencia', 'Spain', 39.4699, -0.3763, 'visited', NULL::DATE),

  -- Toulouse
  ('Toulouse', 'France', 43.6047, 1.4442, 'visited', NULL::DATE),

  -- Limoges
  ('Limoges', 'France', 45.8336, 1.2611, 'visited', NULL::DATE),

  -- Rome
  ('Rome', 'Italy', 41.9028, 12.4964, 'visited', NULL::DATE),

  -- Palermo (Sicily)
  ('Palermo', 'Italy', 38.1157, 13.3615, 'visited', NULL::DATE),

  -- Tokyo (wishlist - will blink)
  ('Tokyo', 'Japan', 35.6762, 139.6503, 'wishlist', NULL::DATE)
) AS city(name, country, latitude, longitude, status, visit_date)
ON CONFLICT (user_id, name, country) DO NOTHING;
