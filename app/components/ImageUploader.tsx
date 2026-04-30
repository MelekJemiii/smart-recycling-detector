"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";

interface ImageUploaderProps {
  onImageUpload: (base64Image: string, previewUrl: string) => void;
  isAnalyzing: boolean;
  imagePreview: string | null;
  onReset: () => void;
}

const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export default function ImageUploader({
  onImageUpload,
  isAnalyzing,
  imagePreview,
  onReset,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const processFile = useCallback(
    (file: File) => {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        toast.error("Please upload a JPEG, PNG, WebP, or GIF image.");
        return;
      }
      if (file.size > MAX_SIZE_BYTES) {
        toast.error(`File too large. Maximum size is ${MAX_SIZE_MB}MB.`);
        return;
      }

      const previewUrl = URL.createObjectURL(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        onImageUpload(base64, previewUrl);
      };
      reader.onerror = () => toast.error("Failed to read the image file.");
      reader.readAsDataURL(file);
    },
    [onImageUpload]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setIsDragging(false);
      if (acceptedFiles.length > 0) {
        processFile(acceptedFiles[0]);
      }
    },
    [processFile]
  );

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp", ".gif"] },
    maxFiles: 1,
    disabled: isAnalyzing,
    noClick: !!imagePreview,
  });

  if (imagePreview) {
    return (
      <div className="card p-2 max-w-2xl mx-auto">
        <div className="relative rounded-2xl overflow-hidden aspect-video bg-green-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imagePreview}
            alt="Uploaded item"
            className="w-full h-full object-contain"
          />
          {isAnalyzing && (
            <div className="absolute inset-0 bg-green-950/40 flex items-center justify-center">
              <div className="bg-white rounded-2xl px-6 py-4 flex items-center gap-3 shadow-xl">
                <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                <span
                  className="font-semibold text-green-900"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Analyzing...
                </span>
              </div>
            </div>
          )}
        </div>
        {!isAnalyzing && (
          <div className="p-4 flex items-center justify-between">
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Image uploaded successfully
            </p>
            <button
              onClick={onReset}
              className="flex items-center gap-2 px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl text-sm font-medium transition-colors"
              style={{ fontFamily: "var(--font-display)" }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
              Scan another item
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`
          card p-10 text-center cursor-pointer select-none
          transition-all duration-300
          ${isDragging ? "ring-2 ring-green-400 scale-[1.01] bg-green-50" : "hover:scale-[1.005]"}
          ${isAnalyzing ? "opacity-60 cursor-not-allowed" : ""}
        `}
      >
        <input {...getInputProps()} />

        {/* Upload icon */}
        <div
          className={`
            w-20 h-20 rounded-3xl mx-auto flex items-center justify-center text-4xl mb-6
            transition-transform duration-300
            ${isDragging ? "scale-110" : ""}
          `}
          style={{
            background: isDragging
              ? "linear-gradient(135deg, #86efac, #4ade80)"
              : "linear-gradient(135deg, #dcfce7, #bbf7d0)",
          }}
        >
          {isDragging ? "🎯" : "📸"}
        </div>

        <h3
          className="text-2xl font-bold mb-2"
          style={{ fontFamily: "var(--font-display)", color: "var(--green-900)" }}
        >
          {isDragging ? "Drop it here!" : "Upload an item photo"}
        </h3>
        <p className="mb-6" style={{ color: "var(--text-secondary)" }}>
          {isDragging
            ? "Release to analyze your item"
            : "Drag & drop a photo here, or click to browse"}
        </p>

        <div className="flex items-center gap-4 justify-center mb-6">
          <div className="h-px bg-green-100 flex-1" />
          <span className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
            or
          </span>
          <div className="h-px bg-green-100 flex-1" />
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            open();
          }}
          disabled={isAnalyzing}
          className="
            px-8 py-3 rounded-xl font-semibold text-white text-sm
            transition-all duration-200 hover:scale-105 active:scale-95
            disabled:opacity-50 disabled:cursor-not-allowed
          "
          style={{
            fontFamily: "var(--font-display)",
            background: "linear-gradient(135deg, #22c55e, #16a34a)",
            boxShadow: "0 4px 14px rgba(22, 163, 74, 0.35)",
          }}
        >
          Choose Image
        </button>

        {/* Supported formats */}
        <p className="mt-6 text-xs" style={{ color: "var(--text-muted)" }}>
          Supports JPEG, PNG, WebP, GIF · Max {MAX_SIZE_MB}MB
        </p>
      </div>

      {/* Tips */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        {[
          { icon: "☀️", text: "Good lighting" },
          { icon: "🎯", text: "Center the item" },
          { icon: "🔍", text: "Clear & close-up" },
        ].map((tip) => (
          <div
            key={tip.text}
            className="card p-3 text-center"
          >
            <div className="text-2xl mb-1">{tip.icon}</div>
            <p className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
              {tip.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}