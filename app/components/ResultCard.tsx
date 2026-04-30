"use client";

import { useState } from "react";
import type { RecyclingInfo } from "@/lib/recycling-data";

interface ResultCardProps {
  result: {
    scanId: string;
    detectedObject: string;
    confidence: number;
    allLabels: { description: string; score: number }[];
    dominantColors: string[];
    category: string;
    recyclingInfo: RecyclingInfo;
  };
}

export default function ResultCard({ result }: ResultCardProps) {
  const [showAllLabels, setShowAllLabels] = useState(false);
  const { detectedObject, confidence, allLabels, recyclingInfo, category } = result;

  const badgeClass = `badge-${category}`;

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Detection Header */}
      <div className="card p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${badgeClass}`}>
                {category}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  recyclingInfo.recyclable
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {recyclingInfo.recyclable ? "✓ Recyclable" : "✗ Not Recyclable"}
              </span>
            </div>
            <h2
              className="text-3xl font-extrabold capitalize"
              style={{ fontFamily: "var(--font-display)", color: "var(--green-950)" }}
            >
              {recyclingInfo.icon} {detectedObject}
            </h2>
          </div>

          {/* Confidence dial */}
          <div className="text-center flex-shrink-0">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold border-4"
              style={{
                borderColor: confidence > 80 ? "#22c55e" : confidence > 50 ? "#f59e0b" : "#ef4444",
                color: confidence > 80 ? "#16a34a" : confidence > 50 ? "#d97d1a" : "#dc2626",
                fontFamily: "var(--font-display)",
              }}
            >
              {confidence}%
            </div>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              confidence
            </p>
          </div>
        </div>

        {/* Bin info */}
        <div
          className="flex items-center gap-3 p-4 rounded-xl"
          style={{ backgroundColor: `${recyclingInfo.binColor}18` }}
        >
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xl flex-shrink-0"
            style={{ backgroundColor: recyclingInfo.binColor }}
          >
            🗑️
          </div>
          <div>
            <p className="font-semibold text-sm" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
              Goes in: {recyclingInfo.bin}
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {recyclingInfo.recyclable
                ? "This item can be recycled"
                : "Handle with special care"}
            </p>
          </div>
        </div>

        {/* Detected labels (collapsible) */}
        <div className="mt-4">
          <button
            onClick={() => setShowAllLabels((v) => !v)}
            className="text-xs font-medium flex items-center gap-1 hover:text-green-600 transition-colors"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-display)" }}
          >
            <svg
              className={`w-3 h-3 transition-transform ${showAllLabels ? "rotate-90" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            {showAllLabels ? "Hide" : "Show"} all detected labels ({allLabels.length})
          </button>

          {showAllLabels && (
            <div className="mt-3 flex flex-wrap gap-2">
              {allLabels.map((label) => (
                <span
                  key={label.description}
                  className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium"
                >
                  {label.description}
                  <span className="ml-1 opacity-60">{label.score}%</span>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="card p-6">
        <h3
          className="text-lg font-bold mb-4"
          style={{ fontFamily: "var(--font-display)", color: "var(--green-900)" }}
        >
          📋 Recycling Instructions
        </h3>
        <ol className="space-y-3">
          {recyclingInfo.instructions.map((instruction, i) => (
            <li key={i} className="flex gap-3">
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                style={{
                  background: "linear-gradient(135deg, #22c55e, #16a34a)",
                  color: "white",
                  fontFamily: "var(--font-display)",
                }}
              >
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {instruction}
              </p>
            </li>
          ))}
        </ol>
      </div>

      {/* Accepted / Not Accepted */}
      {(recyclingInfo.acceptedMaterials.length > 0 || recyclingInfo.notAccepted.length > 0) && (
        <div className="grid grid-cols-2 gap-4">
          {recyclingInfo.acceptedMaterials.length > 0 && (
            <div className="card p-5">
              <h4
                className="font-bold text-sm mb-3 text-green-700"
                style={{ fontFamily: "var(--font-display)" }}
              >
                ✓ Accepted
              </h4>
              <ul className="space-y-2">
                {recyclingInfo.acceptedMaterials.map((item) => (
                  <li
                    key={item}
                    className="text-xs flex items-start gap-2"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <span className="text-green-400 flex-shrink-0 mt-0.5">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {recyclingInfo.notAccepted.length > 0 && (
            <div className="card p-5">
              <h4
                className="font-bold text-sm mb-3 text-red-600"
                style={{ fontFamily: "var(--font-display)" }}
              >
                ✗ Not Accepted
              </h4>
              <ul className="space-y-2">
                {recyclingInfo.notAccepted.map((item) => (
                  <li
                    key={item}
                    className="text-xs flex items-start gap-2"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <span className="text-red-400 flex-shrink-0 mt-0.5">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Tips */}
      <div className="card p-6 bg-gradient-to-br from-green-50 to-emerald-50">
        <h3
          className="text-sm font-bold mb-3 text-green-800"
          style={{ fontFamily: "var(--font-display)" }}
        >
          💡 Pro Tips
        </h3>
        <ul className="space-y-2">
          {recyclingInfo.tips.map((tip, i) => (
            <li
              key={i}
              className="text-sm flex items-start gap-2"
              style={{ color: "var(--text-secondary)" }}
            >
              <span className="text-green-500 flex-shrink-0 mt-1">→</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* Environmental Impact quick stats */}
      <div className="card p-6">
        <h3
          className="text-lg font-bold mb-4"
          style={{ fontFamily: "var(--font-display)", color: "var(--green-900)" }}
        >
          🌍 Environmental Impact (per item)
        </h3>
        <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
          {recyclingInfo.environmentalImpact.description}
        </p>
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: "CO₂ Saved",
              value: `${recyclingInfo.environmentalImpact.co2SavedKg} kg`,
              icon: "💨",
              color: "#22c55e",
            },
            {
              label: "Water Saved",
              value: `${recyclingInfo.environmentalImpact.waterSavedLiters} L`,
              icon: "💧",
              color: "#3b82f6",
            },
            {
              label: "Energy Saved",
              value: `${recyclingInfo.environmentalImpact.energySavedKwh} kWh`,
              icon: "⚡",
              color: "#f59e0b",
            },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-3 bg-green-50 rounded-xl">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div
                className="text-lg font-bold"
                style={{ fontFamily: "var(--font-display)", color: stat.color }}
              >
                {stat.value}
              </div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {recyclingInfo.environmentalImpact.decompositionYears > 0 && (
          <div className="mt-3 p-3 bg-amber-50 rounded-xl text-center">
            <p className="text-xs" style={{ color: "#92400e" }}>
              ⚠️ Without recycling, this item takes{" "}
              <strong>
                {recyclingInfo.environmentalImpact.decompositionYears.toLocaleString()} years
              </strong>{" "}
              to decompose in a landfill
            </p>
          </div>
        )}
      </div>
    </div>
  );
}