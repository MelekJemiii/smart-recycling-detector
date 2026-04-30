import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Scan from "@/models/Scan";

export const runtime = "nodejs";

export async function GET() {
  try {
    await connectDB();

    const [aggregation, categoryBreakdown, recentActivity] = await Promise.all([
      // Total environmental impact
      Scan.aggregate([
        {
          $group: {
            _id: null,
            totalScans: { $sum: 1 },
            totalCo2Saved: { $sum: "$co2Saved" },
            totalWaterSaved: { $sum: "$waterSaved" },
            totalEnergySaved: { $sum: "$energySaved" },
            recyclableCount: {
              $sum: { $cond: ["$recyclable", 1, 0] },
            },
          },
        },
      ]),

      // Category breakdown
      Scan.aggregate([
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ]),

      // Scans per day (last 7 days)
      Scan.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    const totals = aggregation[0] ?? {
      totalScans: 0,
      totalCo2Saved: 0,
      totalWaterSaved: 0,
      totalEnergySaved: 0,
      recyclableCount: 0,
    };

    return NextResponse.json({
      success: true,
      stats: {
        totalScans: totals.totalScans,
        recyclableCount: totals.recyclableCount,
        nonRecyclableCount: totals.totalScans - totals.recyclableCount,
        recyclingRate:
          totals.totalScans > 0
            ? Math.round((totals.recyclableCount / totals.totalScans) * 100)
            : 0,
        totalCo2Saved: Math.round(totals.totalCo2Saved * 10) / 10,
        totalWaterSaved: Math.round(totals.totalWaterSaved),
        totalEnergySaved: Math.round(totals.totalEnergySaved * 10) / 10,
        categoryBreakdown,
        recentActivity,
      },
    });
  } catch (error) {
    console.error("Error in GET /api/stats:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch stats.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}