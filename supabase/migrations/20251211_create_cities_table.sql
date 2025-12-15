-- Create cities table for tracking visited and wishlist cities
CREATE TABLE IF NOT EXISTS public.cities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(255) NOT NULL,
  country VARCHAR(255) NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('visited', 'wishlist')),
  visit_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, name, country)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS cities_user_id_idx ON public.cities(user_id);
CREATE INDEX IF NOT EXISTS cities_status_idx ON public.cities(status);

-- Enable Row Level Security
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own cities
CREATE POLICY "Users can view own cities"
  ON public.cities
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own cities
CREATE POLICY "Users can insert own cities"
  ON public.cities
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own cities
CREATE POLICY "Users can update own cities"
  ON public.cities
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own cities
CREATE POLICY "Users can delete own cities"
  ON public.cities
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER set_cities_updated_at
  BEFORE UPDATE ON public.cities
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Insert default cities for demonstration (optional)
-- These will be inserted for the first user who runs this
INSERT INTO public.cities (user_id, name, country, latitude, longitude, status, visit_date)
SELECT
  (SELECT id FROM auth.users LIMIT 1),
  'New York', 'United States', 40.7128, -74.0060, 'visited', '2024-01-15'
WHERE NOT EXISTS (SELECT 1 FROM public.cities LIMIT 1);
