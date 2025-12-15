import { NextResponse } from "next/server";
import { getPublicCities } from "@/lib/services/cities-service";

/**
 * GET /api/cities/public
 * Public endpoint to fetch cities for display on landing page
 * Does not require authentication
 */
export async function GET() {
  try {
    const cities = await getPublicCities();
    return NextResponse.json({ cities }, { status: 200 });
  } catch (error) {
    console.error("Error fetching public cities:", error);
    return NextResponse.json(
      { error: "Failed to fetch cities" },
      { status: 500 }
    );
  }
}
