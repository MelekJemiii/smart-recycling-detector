"use client";

import { useEffect, useState } from "react";

interface RecyclingMapProps {
  detectedObject: string;
  category: string;
}

interface Place {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

export default function RecyclingMap({ detectedObject, category }: RecyclingMapProps) {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [userCity, setUserCity] = useState("your city");

  // Build search text based on category
  const searchText =
    category === "electronics"
      ? "e-waste recycling center"
      : category === "hazardous"
      ? "hazardous waste disposal"
      : category === "organic"
      ? "compost drop-off site"
      : category === "textile"
      ? "clothing donation recycling"
      : "recycling center";

  useEffect(() => {
    // Try to get city name from browser geolocation + reverse geocode (best-effort)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`
            );
            const data = await res.json();
            const city =
              data.address?.city ||
              data.address?.town ||
              data.address?.village ||
              "your city";
            setUserCity(city);
          } catch {
            // keep default
          }
        },
        () => {} // denied — keep default
      );
    }
  }, []);

  useEffect(() => {
    const fetchPlaces = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await fetch("/api/map", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: searchText, place: userCity }),
        });
        const data = await res.json();
        if (data.success && data.places.length > 0) {
          setPlaces(data.places.slice(0, 5));
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [searchText, userCity]);

  const googleMapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(searchText + " near " + userCity)}`;

  return (
    <div className="max-w-2xl mx-auto card overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-green-100 flex items-center justify-between">
        <div>
          <h3
            className="font-bold text-lg"
            style={{ fontFamily: "var(--font-display)", color: "var(--green-900)" }}
          >
            📍 Nearby Recycling Centers
          </h3>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            Drop-off locations for: <strong>{detectedObject}</strong>
          </p>
        </div>
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-2 text-xs font-semibold text-green-700 bg-green-50 hover:bg-green-100 rounded-xl transition-colors"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Open Maps →
        </a>
      </div>

      {/* Content */}
      <div className="p-5">
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-3 p-3 bg-green-50 rounded-xl">
                <div className="w-10 h-10 rounded-lg shimmer flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-40 shimmer rounded" />
                  <div className="h-3 w-56 shimmer rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : error || places.length === 0 ? (
          <div className="text-center py-6">
            <div className="text-4xl mb-3">🗺️</div>
            <p
              className="font-semibold text-sm mb-1"
              style={{ fontFamily: "var(--font-display)", color: "var(--green-900)" }}
            >
              No results found nearby
            </p>
            <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
              Try searching directly on Google Maps
            </p>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-5 py-2 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 transition-colors"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Search on Google Maps
            </a>
          </div>
        ) : (
          <div className="space-y-3">
            {places.map((place, i) => (
              <a
                key={i}
                href={`https://www.google.com/maps/search/${encodeURIComponent(place.name + " " + place.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-3 bg-green-50 hover:bg-green-100 rounded-xl transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-green-200 flex items-center justify-center text-lg flex-shrink-0">
                  🗑️
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="font-semibold text-sm group-hover:text-green-700 transition-colors truncate"
                    style={{ fontFamily: "var(--font-display)", color: "var(--green-900)" }}
                  >
                    {place.name}
                  </p>
                  <p className="text-xs mt-0.5 truncate" style={{ color: "var(--text-muted)" }}>
                    {place.address}
                  </p>
                </div>
                <svg
                  className="w-4 h-4 flex-shrink-0 mt-1 text-green-400 group-hover:text-green-600 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            ))}

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 border-2 border-green-200 hover:border-green-400 text-green-700 rounded-xl text-sm font-semibold transition-colors mt-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              🗺️ See all on Google Maps
            </a>
          </div>
        )}
      </div>
    </div>
  );
}