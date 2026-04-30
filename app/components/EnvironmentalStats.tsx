"use client";

import { useEffect, useState } from "react";

interface CategoryCount {
  _id: string;
  count: number;
}

interface DailyActivity {
  _id: string;
  count: number;
}

interface Stats {
  totalScans: number;
  recyclableCount: number;
  nonRecyclableCount: number;
  recyclingRate: number;
  totalCo2Saved: number;
  totalWaterSaved: number;
  totalEnergySaved: number;
  categoryBreakdown: CategoryCount[];
  recentActivity: DailyActivity[];
}

const CATEGORY_COLORS: Record<string, string> = {
  plastic: "#3b82f6",
  glass: "#10b981",
  metal: "#f59e0b",
  paper: "#8b5cf6",
  organic: "#65a30d",
  electronics: "#6366f1",
  hazardous: "#ef4444",
  textile: "#ec4899",
  unknown: "#9ca3af",
};

const CATEGORY_ICONS: Record<string, string> = {
  plastic: "🔵",
  glass: "🟢",
  metal: "🟡",
  paper: "🟣",
  organic: "🌱",
  electronics: "🔌",
  hazardous: "🔴",
  textile: "🧵",
  unknown: "❓",
};

function StatCard({
  icon,
  label,
  value,
  sub,
  color,
}: {
  icon: string;
  label: string;
  value: string;
  sub: string;
  color: string;
}) {
  return (
    <div className="card p-6">
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4"
        style={{ backgroundColor: `${color}18` }}
      >
        {icon}
      </div>
      <div
        className="text-3xl font-extrabold mb-1"
        style={{ fontFamily: "var(--font-display)", color }}
      >
        {value}
      </div>
      <p className="font-semibold text-sm" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
        {label}
      </p>
      <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
        {sub}
      </p>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="card p-6">
      <div className="w-12 h-12 rounded-2xl shimmer mb-4" />
      <div className="h-8 w-24 shimmer rounded-lg mb-2" />
      <div className="h-4 w-32 shimmer rounded mb-2" />
      <div className="h-3 w-20 shimmer rounded" />
    </div>
  );
}

export default function EnvironmentalStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setStats(data.stats);
        else setError(data.error || "Failed to load stats");
      })
      .catch(() => setError("Could not connect to the server."))
      .finally(() => setLoading(false));
  }, []);

  if (error) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="text-4xl mb-4">⚠️</div>
        <p className="font-semibold" style={{ color: "var(--green-900)", fontFamily: "var(--font-display)" }}>
          {error}
        </p>
        <p className="text-sm mt-2" style={{ color: "var(--text-muted)" }}>
          Make sure your MongoDB connection is configured.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  if (!stats || stats.totalScans === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16 card">
        <div className="text-6xl mb-4">🌱</div>
        <h3
          className="text-2xl font-bold mb-2"
          style={{ fontFamily: "var(--font-display)", color: "var(--green-900)" }}
        >
          No scans yet
        </h3>
        <p style={{ color: "var(--text-secondary)" }}>
          Start scanning items to see your environmental impact here!
        </p>
      </div>
    );
  }

  const maxCategoryCount = Math.max(...stats.categoryBreakdown.map((c) => c.count), 1);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h2
          className="text-3xl font-extrabold mb-1"
          style={{ fontFamily: "var(--font-display)", color: "var(--green-950)" }}
        >
          🌍 Your Environmental Impact
        </h2>
        <p style={{ color: "var(--text-secondary)" }}>
          Cumulative impact from {stats.totalScans.toLocaleString()} scans
        </p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger">
        <StatCard
          icon="📊"
          label="Total Scans"
          value={stats.totalScans.toLocaleString()}
          sub={`${stats.recyclingRate}% recycling rate`}
          color="#16a34a"
        />
        <StatCard
          icon="💨"
          label="CO₂ Saved"
          value={`${stats.totalCo2Saved} kg`}
          sub="Equivalent to trees planted"
          color="#22c55e"
        />
        <StatCard
          icon="💧"
          label="Water Saved"
          value={`${stats.totalWaterSaved.toLocaleString()} L`}
          sub="Liters conserved through recycling"
          color="#3b82f6"
        />
        <StatCard
          icon="⚡"
          label="Energy Saved"
          value={`${stats.totalEnergySaved} kWh`}
          sub="Kilowatt-hours of energy recovered"
          color="#f59e0b"
        />
      </div>

      {/* Recycling Rate Ring */}
      <div className="card p-6 flex items-center gap-8">
        <div className="flex-shrink-0 relative w-32 h-32">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#dcfce7" strokeWidth="12" />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#22c55e"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${(stats.recyclingRate / 100) * 251.2} 251.2`}
              style={{ transition: "stroke-dasharray 1s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="text-2xl font-extrabold"
              style={{ fontFamily: "var(--font-display)", color: "var(--green-700)" }}
            >
              {stats.recyclingRate}%
            </span>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              recycled
            </span>
          </div>
        </div>
        <div>
          <h3
            className="text-xl font-bold mb-2"
            style={{ fontFamily: "var(--font-display)", color: "var(--green-900)" }}
          >
            Recycling Rate
          </h3>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <span className="w-3 h-3 rounded-full bg-green-400" />
              <span style={{ color: "var(--text-secondary)" }}>
                {stats.recyclableCount} recyclable items
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="w-3 h-3 rounded-full bg-gray-300" />
              <span style={{ color: "var(--text-secondary)" }}>
                {stats.nonRecyclableCount} non-recyclable / special disposal
              </span>
            </div>
          </div>
          {stats.recyclingRate >= 80 && (
            <div className="mt-3 px-3 py-2 bg-green-100 text-green-800 rounded-xl text-xs font-semibold inline-block">
              🏆 Excellent recycling habits!
            </div>
          )}
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="card p-6">
        <h3
          className="text-lg font-bold mb-5"
          style={{ fontFamily: "var(--font-display)", color: "var(--green-900)" }}
        >
          📦 Items Scanned by Category
        </h3>
        <div className="space-y-3">
          {stats.categoryBreakdown.map((cat) => {
            const pct = Math.round((cat.count / maxCategoryCount) * 100);
            const color = CATEGORY_COLORS[cat._id] || "#9ca3af";
            const icon = CATEGORY_ICONS[cat._id] || "❓";
            return (
              <div key={cat._id} className="flex items-center gap-3">
                <span className="text-xl w-7 text-center">{icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className="text-sm font-semibold capitalize"
                      style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
                    >
                      {cat._id}
                    </span>
                    <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                      {cat.count} scan{cat.count !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: color,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      {stats.recentActivity.length > 0 && (
        <div className="card p-6">
          <h3
            className="text-lg font-bold mb-5"
            style={{ fontFamily: "var(--font-display)", color: "var(--green-900)" }}
          >
            📅 Activity (Last 7 Days)
          </h3>
          <div className="flex items-end gap-2 h-24">
            {(() => {
              const maxVal = Math.max(...stats.recentActivity.map((d) => d.count), 1);
              return stats.recentActivity.map((day) => {
                const pct = (day.count / maxVal) * 100;
                const label = new Date(day._id + "T00:00:00").toLocaleDateString("en", {
                  weekday: "short",
                });
                return (
                  <div key={day._id} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs font-medium" style={{ color: "var(--green-700)", fontFamily: "var(--font-display)" }}>
                      {day.count}
                    </span>
                    <div className="w-full bg-green-100 rounded-t-lg relative" style={{ height: "64px" }}>
                      <div
                        className="absolute bottom-0 left-0 right-0 bg-green-400 rounded-t-lg transition-all duration-700"
                        style={{ height: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {label}
                    </span>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      )}

      {/* Fun equivalencies */}
      <div className="card p-6 bg-gradient-to-br from-green-50 to-emerald-50">
        <h3
          className="text-lg font-bold mb-4"
          style={{ fontFamily: "var(--font-display)", color: "var(--green-900)" }}
        >
          🌿 What your impact equals
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              icon: "🌳",
              value: Math.round(stats.totalCo2Saved / 21.77),
              label: "Trees worth of CO₂",
            },
            {
              icon: "🚗",
              value: Math.round(stats.totalEnergySaved / 3.4),
              label: "km not driven",
            },
            {
              icon: "🚿",
              value: Math.round(stats.totalWaterSaved / 65),
              label: "showers saved",
            },
          ].map((item) => (
            <div key={item.label} className="text-center p-4 bg-white rounded-xl shadow-sm">
              <div className="text-3xl mb-2">{item.icon}</div>
              <div
                className="text-2xl font-extrabold text-green-700 mb-1"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {item.value.toLocaleString()}
              </div>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}