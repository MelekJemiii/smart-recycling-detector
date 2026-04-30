"use client";

import { useEffect, useState } from "react";

const MESSAGES = [
  "Scanning your item with AI...",
  "Identifying materials...",
  "Checking recycling guidelines...",
  "Calculating environmental impact...",
  "Finding the best disposal method...",
];

export default function LoadingSpinner() {
  const [messageIdx, setMessageIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIdx((i) => (i + 1) % MESSAGES.length);
    }, 1400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-2xl mx-auto card p-10 text-center">
      {/* Animated recycling icon */}
      <div className="relative w-20 h-20 mx-auto mb-6">
        {/* Outer ring */}
        <div
          className="absolute inset-0 rounded-full border-4 border-green-100"
          style={{ borderTopColor: "#22c55e", animation: "spin 1.2s linear infinite" }}
        />
        {/* Inner ring */}
        <div
          className="absolute inset-3 rounded-full border-4 border-green-50"
          style={{
            borderBottomColor: "#4ade80",
            animation: "spin 0.8s linear infinite reverse",
          }}
        />
        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center text-2xl">
          ♻️
        </div>
      </div>

      <h3
        className="text-xl font-bold mb-2"
        style={{ fontFamily: "var(--font-display)", color: "var(--green-900)" }}
      >
        Analyzing Your Item
      </h3>

      {/* Cycling message */}
      <p
        className="text-sm transition-all duration-500"
        style={{ color: "var(--text-secondary)", minHeight: "1.5em" }}
      >
        {MESSAGES[messageIdx]}
      </p>

      {/* Progress dots */}
      <div className="flex justify-center gap-2 mt-6">
        {MESSAGES.map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full transition-all duration-300"
            style={{
              backgroundColor: i === messageIdx ? "#22c55e" : "#d1fae5",
              transform: i === messageIdx ? "scale(1.3)" : "scale(1)",
            }}
          />
        ))}
      </div>

      {/* Fun fact */}
      <div className="mt-6 p-4 bg-green-50 rounded-xl text-left">
        <p className="text-xs font-semibold text-green-700 mb-1" style={{ fontFamily: "var(--font-display)" }}>
          🌱 Did you know?
        </p>
        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
          Recycling one aluminum can saves enough energy to run a TV for 3 hours.
          Every scan you make helps build smarter recycling habits!
        </p>
      </div>
    </div>
  );
}