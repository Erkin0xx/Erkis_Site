import { createClient } from "@/lib/supabase/server";

export interface City {
  id: string;
  user_id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  status: "visited" | "wishlist";
  visit_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCityInput {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  status: "visited" | "wishlist";
  visit_date?: string;
  notes?: string;
}

export interface UpdateCityInput {
  name?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  status?: "visited" | "wishlist";
  visit_date?: string;
  notes?: string;
}

/**
 * Get all cities for public display (landing page)
 * Returns cities from the site owner (first user with cities)
 */
export async function getPublicCities(): Promise<City[]> {
  const supabase = await createClient();

  // Get the site owner's user_id (from any existing city)
  const { data: ownerCity } = await supabase
    .from("cities")
    .select("user_id")
    .limit(1)
    .single();

  if (!ownerCity) {
    return []; // No cities yet
  }

  // Get all cities for that user
  const { data, error } = await supabase
    .from("cities")
    .select("*")
    .eq("user_id", ownerCity.user_id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch public cities:", error);
    return [];
  }

  return data as City[];
}

/**
 * Get all cities for the authenticated user
 */
export async function getUserCities(): Promise<City[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("cities")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch cities: ${error.message}`);
  }

  return data as City[];
}

/**
 * Get a single city by ID
 */
export async function getCityById(cityId: string): Promise<City | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("cities")
    .select("*")
    .eq("id", cityId)
    .eq("user_id", user.id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(`Failed to fetch city: ${error.message}`);
  }

  return data as City;
}

/**
 * Create a new city
 */
export async function createCity(input: CreateCityInput): Promise<City> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("cities")
    .insert({
      user_id: user.id,
      ...input,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create city: ${error.message}`);
  }

  return data as City;
}

/**
 * Update an existing city
 */
export async function updateCity(
  cityId: string,
  input: UpdateCityInput
): Promise<City> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("cities")
    .update(input)
    .eq("id", cityId)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update city: ${error.message}`);
  }

  return data as City;
}

/**
 * Delete a city
 */
export async function deleteCity(cityId: string): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { error } = await supabase
    .from("cities")
    .delete()
    .eq("id", cityId)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(`Failed to delete city: ${error.message}`);
  }
}

/**
 * Get cities by status
 */
export async function getCitiesByStatus(
  status: "visited" | "wishlist"
): Promise<City[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("cities")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", status)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch cities: ${error.message}`);
  }

  return data as City[];
}
