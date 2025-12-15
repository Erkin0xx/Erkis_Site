import { NextResponse } from "next/server";
import {
  getUserCities,
  createCity,
  type CreateCityInput,
} from "@/lib/services/cities-service";

export async function GET() {
  try {
    const cities = await getUserCities();
    return NextResponse.json({ cities }, { status: 200 });
  } catch (error) {
    console.error("Error fetching cities:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch cities" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    const { name, country, latitude, longitude, status } = body;

    if (!name || !country || latitude === undefined || longitude === undefined || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate status
    if (status !== "visited" && status !== "wishlist") {
      return NextResponse.json(
        { error: "Status must be 'visited' or 'wishlist'" },
        { status: 400 }
      );
    }

    const input: CreateCityInput = {
      name,
      country,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      status,
      visit_date: body.visit_date,
      notes: body.notes,
    };

    const city = await createCity(input);

    return NextResponse.json({ city }, { status: 201 });
  } catch (error) {
    console.error("Error creating city:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create city" },
      { status: 500 }
    );
  }
}
