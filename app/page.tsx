"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import ImageUploader from "./components/ImageUploader";
import ResultCard from "./components/ResultCard";
import RecyclingMap from "./components/RecyclingMap";
import EnvironmentalStats from "./components/EnvironmentalStats";
import ScanHistory from "./components/ScanHistory";
import LoadingSpinner from "./components/LoadingSpinner";
import type { RecyclingInfo } from "@/lib/recycling-data";

interface AnalysisResult {
  scanId: string;
  detectedObject: string;
  confidence: number;
  allLabels: { description: string; score: number }[];
  dominantColors: string[];
  category: string;
  recyclingInfo: RecyclingInfo;
}

export default function HomePage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"scan" | "history" | "stats">("scan");

  const handleImageUpload = async (base64Image: string, previewUrl: string) => {
    setImagePreview(previewUrl);
    setResult(null);
    setIsAnalyzing(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64Image }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      setResult(data);
      toast.success(`Detected: ${data.detectedObject}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Analysis failed";
      toast.error(message);
      setResult(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setImagePreview(null);
  };

  return (
    <div className="min-h-screen bg-mesh">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-green-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)" }}
            >
              ♻️
            </div>
            <div>
              <h1
                className="text-xl font-bold leading-none"
                style={{ fontFamily: "var(--font-display)", color: "var(--green-900)" }}
              >
                RecycleAI
              </h1>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Smart Recycling Detector
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex gap-1 bg-green-50 p-1 rounded-xl">
            {(["scan", "history", "stats"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-white shadow-sm text-green-700"
                    : "text-green-600 hover:text-green-700"
                }`}
                style={{ fontFamily: "var(--font-display)" }}
              >
                {tab === "scan" ? "🔍 Scan" : tab === "history" ? "📋 History" : "🌍 Impact"}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* SCAN TAB */}
        {activeTab === "scan" && (
          <div className="space-y-8">
            {/* Hero */}
            {!result && !isAnalyzing && (
              <div className="text-center py-6 animate-in">
                <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  AI-Powered Recycling Guidance
                </div>
                <h2
                  className="text-5xl font-extrabold mb-4"
                  style={{ fontFamily: "var(--font-display)", color: "var(--green-950)" }}
                >
                  Know before you
                  <span style={{ color: "var(--green-500)" }}> toss.</span>
                </h2>
                <p className="text-lg max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
                  Upload a photo of any item and instantly discover the correct way to recycle it —
                  saving the planet one scan at a time.
                </p>
              </div>
            )}

            {/* Uploader */}
            <div className="animate-in" style={{ animationDelay: "60ms" }}>
              <ImageUploader
                onImageUpload={handleImageUpload}
                isAnalyzing={isAnalyzing}
                imagePreview={imagePreview}
                onReset={handleReset}
              />
            </div>

            {/* Loading */}
            {isAnalyzing && (
              <div className="animate-in">
                <LoadingSpinner />
              </div>
            )}

            {/* Result */}
            {result && !isAnalyzing && (
              <div className="animate-in stagger space-y-6">
                <ResultCard result={result} />
                <RecyclingMap detectedObject={result.detectedObject} category={result.category} />
              </div>
            )}
          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === "history" && (
          <div className="animate-in">
            <ScanHistory />
          </div>
        )}

        {/* STATS TAB */}
        {activeTab === "stats" && (
          <div className="animate-in">
            <EnvironmentalStats />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-green-100 bg-white/50">
        <div
          className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between text-sm"
          style={{ color: "var(--text-muted)" }}
        >
          <span>RecycleAI — Powered by Google Vision AI</span>
          <span>Making recycling effortless 🌱</span>
        </div>
      </footer>
    </div>
  );
}