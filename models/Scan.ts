import mongoose, { Schema, Document, Model } from "mongoose";
import type { RecyclingCategory } from "@/lib/recycling-data";

export interface IScan extends Document {
  imageUrl?: string;        // Optional stored image URL
  labels: {
    description: string;
    score: number;
  }[];
  detectedObject: string;   // Top label
  category: RecyclingCategory;
  recyclable: boolean;
  co2Saved: number;
  waterSaved: number;
  energySaved: number;
  createdAt: Date;
}

const ScanSchema = new Schema<IScan>(
  {
    imageUrl: {
      type: String,
      default: null,
    },
    labels: [
      {
        description: { type: String, required: true },
        score: { type: Number, required: true },
      },
    ],
    detectedObject: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: [
        "plastic",
        "glass",
        "metal",
        "paper",
        "organic",
        "electronics",
        "hazardous",
        "textile",
        "unknown",
      ],
      required: true,
    },
    recyclable: {
      type: Boolean,
      required: true,
    },
    co2Saved: {
      type: Number,
      default: 0,
    },
    waterSaved: {
      type: Number,
      default: 0,
    },
    energySaved: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Prevent OverwriteModelError in Next.js hot reload
const Scan: Model<IScan> =
  (mongoose.models.Scan as Model<IScan>) || mongoose.model<IScan>("Scan", ScanSchema);

export default Scan;