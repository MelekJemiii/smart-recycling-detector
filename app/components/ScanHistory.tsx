"use client";

import { useEffect, useState } from "react";

interface ScanRecord {
  _id: string;
  detectedObject: string;
  category: string;
  recyclable: boolean;
  co2Saved: number;
  waterSaved: number;
  energySaved: number;
  createdAt: string;
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

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

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ScanHistory() {
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const fetchScans = async (p: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/scans?page=${p}&limit=12`);
      const data = await res.json();
      if (data.success) {
        setScans(data.scans);
        setPagination(data.pagination);
      } else {
        setError(data.error || "Failed to load history");
      }
    } catch {
      setError("Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScans(page);
  }, [page]);

  if (error) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="text-4xl mb-4">⚠️</div>
        <p className="font-semibold" style={{ color: "var(--green-900)", fontFamily: "var(--font-display)" }}>
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2
            className="text-3xl font-extrabold mb-1"
            style={{ fontFamily: "var(--font-display)", color: "var(--green-950)" }}
          >
            📋 Scan History
          </h2>
          <p style={{ color: "var(--text-secondary)" }}>
            {pagination ? `${pagination.total} items scanned` : "Loading..."}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card p-5">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-xl shimmer flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-32 shimmer rounded" />
                  <div className="h-3 w-20 shimmer rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : scans.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3
            className="text-2xl font-bold mb-2"
            style={{ fontFamily: "var(--font-display)", color: "var(--green-900)" }}
          >
            No scans yet
          </h3>
          <p style={{ color: "var(--text-secondary)" }}>
            Switch to the Scan tab and upload your first item!
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger">
            {scans.map((scan) => (
              <div
                key={scan._id}
                className="card p-5 hover:scale-[1.01] transition-transform duration-200"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #dcfce7, #bbf7d0)" }}
                  >
                    {CATEGORY_ICONS[scan.category] || "❓"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4
                        className="font-bold capitalize truncate"
                        style={{ fontFamily: "var(--font-display)", color: "var(--green-950)" }}
                      >
                        {scan.detectedObject}
                      </h4>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                          scan.recyclable
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {scan.recyclable ? "♻️" : "⚠️"}
                      </span>
                    </div>
                    <p className="text-xs capitalize mb-2" style={{ color: "var(--text-muted)" }}>
                      {scan.category} · {formatDate(scan.createdAt)}
                    </p>

                    {/* Mini impact row */}
                    <div className="flex gap-3">
                      {scan.co2Saved > 0 && (
                        <span className="text-xs flex items-center gap-1 text-green-600">
                          💨 {scan.co2Saved}kg CO₂
                        </span>
                      )}
                      {scan.waterSaved > 0 && (
                        <span className="text-xs flex items-center gap-1 text-blue-600">
                          💧 {scan.waterSaved}L
                        </span>
                      )}
                      {scan.energySaved > 0 && (
                        <span className="text-xs flex items-center gap-1 text-amber-600">
                          ⚡ {scan.energySaved}kWh
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-green-50 text-green-700 hover:bg-green-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                style={{ fontFamily: "var(--font-display)" }}
              >
                ← Prev
              </button>
              <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-green-50 text-green-700 hover:bg-green-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}