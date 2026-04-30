export interface VisionLabel {
  description: string;
  score: number;
  topicality: number;
}

export interface VisionResult {
  labels: VisionLabel[];
  dominantColors?: string[];
}

/**
 * Analyzes an image using RapidAPI Ultimate Cloud Vision.
 * Accepts a public image URL.
 */
export async function analyzeImageWithVision(imageUrl: string): Promise<VisionResult> {
  const apiKey = process.env.RAPIDAPI_KEY;

  if (!apiKey) {
    throw new Error("RAPIDAPI_KEY is not set in environment variables.");
  }

  const response = await fetch(
    "https://ultimate-cloud-vision-image.p.rapidapi.com/google/cloudvision/labels",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-rapidapi-host": "ultimate-cloud-vision-image.p.rapidapi.com",
        "x-rapidapi-key": apiKey,
      },
      body: JSON.stringify({ image: imageUrl }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Vision API error ${response.status}: ${JSON.stringify(data)}`);
  }

  // ✅ YOUR API ALREADY RETURNS ARRAY DIRECTLY
  const raw = Array.isArray(data) ? data : data.labels || data.data || [];

  const labels: VisionLabel[] = raw.map((l: any) => ({
    description: l.description,
    score: Math.round((l.score || 0) * 100),
    topicality: Math.round((l.topicality || l.score || 0) * 100),
  }));

  return { labels };
}