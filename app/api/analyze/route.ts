import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Scan from "@/models/Scan";
import { analyzeImageWithVision } from "@/lib/vision";
import { detectRecyclingCategory, getRecyclingInfo } from "@/lib/recycling-data";

export const runtime = "nodejs";
export const maxDuration = 30;

/**
 * Uploads a base64 image to imgbb (free, no account needed for small images)
 * and returns a public URL for the Vision API.
 */
async function uploadToImgbb(base64: string): Promise<string> {
  const apiKey = process.env.IMGBB_API_KEY;
  if (!apiKey) throw new Error("IMGBB_API_KEY is not set in environment variables.");

  // Strip data URL prefix if present
  const imageData = base64.includes(",") ? base64.split(",")[1] : base64;

  const formData = new FormData();
  formData.append("key", apiKey);
  formData.append("image", imageData);

  const res = await fetch("https://api.imgbb.com/1/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`imgbb upload failed ${res.status}: ${err}`);
  }

  const json = await res.json();
  return json.data.url as string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
  const { image } = body;

if (!image) {
  return NextResponse.json(
    { error: "No image provided (frontend issue)" },
    { status: 400 }
  );
}

console.log("Image received:", image.substring(0, 50));

    // 1. Upload image to get a public URL (required by RapidAPI Vision)
    const imageUrl = await uploadToImgbb(image);
    console.log("IMG URL:", imageUrl);

    // 2. Analyze with RapidAPI Cloud Vision
    const visionResult = await analyzeImageWithVision(imageUrl);

    if (!visionResult.labels || visionResult.labels.length === 0) {
      return NextResponse.json(
        { error: "Could not detect any objects. Please try a clearer photo." },
        { status: 422 }
      );
    }

    // 3. Determine recycling category
    const category = detectRecyclingCategory(visionResult.labels);
    const recyclingInfo = getRecyclingInfo(category);
    const topLabel = visionResult.labels[0];

    // 4. Save to MongoDB
    await connectDB();

    const scan = await Scan.create({
      imageUrl,
      labels: visionResult.labels.slice(0, 10),
      detectedObject: topLabel.description,
      category,
      recyclable: recyclingInfo.recyclable,
      co2Saved: recyclingInfo.environmentalImpact.co2SavedKg,
      waterSaved: recyclingInfo.environmentalImpact.waterSavedLiters,
      energySaved: recyclingInfo.environmentalImpact.energySavedKwh,
    });

    return NextResponse.json({
      success: true,
      scanId: scan._id,
      detectedObject: topLabel.description,
      confidence: topLabel.score,
      allLabels: visionResult.labels.slice(0, 8),
      dominantColors: visionResult.dominantColors ?? [],
      category,
      recyclingInfo,
    });
  } catch (error) {
    console.error("Error in /api/analyze:", error);
    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}