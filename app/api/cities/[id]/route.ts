import { NextResponse } from "next/server";
import {
  getCityById,
  updateCity,
  deleteCity,
  type UpdateCityInput,
} from "@/lib/services/cities-service";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const city = await getCityById(params.id);

    if (!city) {
      return NextResponse.json({ error: "City not found" }, { status: 404 });
    }

    return NextResponse.json({ city }, { status: 200 });
  } catch (error) {
    console.error("Error fetching city:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch city" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    // Validate status if provided
    if (body.status && body.status !== "visited" && body.status !== "wishlist") {
      return NextResponse.json(
        { error: "Status must be 'visited' or 'wishlist'" },
        { status: 400 }
      );
    }

    const input: UpdateCityInput = {};

    if (body.name) input.name = body.name;
    if (body.country) input.country = body.country;
    if (body.latitude !== undefined) input.latitude = parseFloat(body.latitude);
    if (body.longitude !== undefined) input.longitude = parseFloat(body.longitude);
    if (body.status) input.status = body.status;
    if (body.visit_date !== undefined) input.visit_date = body.visit_date;
    if (body.notes !== undefined) input.notes = body.notes;

    const city = await updateCity(params.id, input);

    return NextResponse.json({ city }, { status: 200 });
  } catch (error) {
    console.error("Error updating city:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update city" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await deleteCity(params.id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting city:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete city" },
      { status: 500 }
    );
  }
}
