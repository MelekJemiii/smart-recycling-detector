import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text, place } = body;

    if (!text || !place) {
      return NextResponse.json(
        { success: false, message: "Missing text or place" },
        { status: 422 }
      );
    }

    // Call RapidAPI (Google Places / Map API)
    const response = await fetch("https://google-api31.p.rapidapi.com/map", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-rapidapi-host": "google-api31.p.rapidapi.com",
        "x-rapidapi-key": process.env.RAPIDAPI_KEY as string,
      },
      body: JSON.stringify({
        text,
        place,
        street: "",
        city: place,
        country: "",
        state: "",
        postalcode: "",
        latitude: "",
        longitude: "",
        radius: "",
      }),
    });

    const data = await response.json();

    // Normalize API response → frontend format
    const places =
      data?.results?.map((p: any) => ({
        name: p.name,
        address: p.formatted_address || p.vicinity || "",
        latitude: p.geometry?.location?.lat,
        longitude: p.geometry?.location?.lng,
      })) || [];

    return NextResponse.json({
      success: true,
      places,
    });
  } catch (error) {
    console.error("MAP API ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}