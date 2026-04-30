import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Scan from "@/models/Scan";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);
    const page = Math.max(parseInt(searchParams.get("page") || "1"), 1);
    const skip = (page - 1) * limit;

    const [scans, total] = await Promise.all([
      Scan.find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("detectedObject category recyclable co2Saved waterSaved energySaved createdAt")
        .lean(),
      Scan.countDocuments({}),
    ]);

    return NextResponse.json({
      success: true,
      scans,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error in GET /api/scans:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch scans.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}