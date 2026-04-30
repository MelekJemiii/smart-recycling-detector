import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";
export const metadata: Metadata = {
  title: "Smart Recycling Detector",
  description:
    "Upload a photo of any item and instantly learn how to recycle it correctly. Powered by Google Vision AI.",
  keywords: ["recycling", "sustainability", "AI", "environment", "waste management"],
  openGraph: {
    title: "Smart Recycling Detector",
    description: "AI-powered recycling guidance for a greener planet",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              fontFamily: "var(--font-body)",
              background: "#fff",
              border: "1px solid #d1fae5",
              borderRadius: "12px",
              color: "#0f2318",
              boxShadow: "0 4px 16px rgba(22, 163, 74, 0.12)",
            },
            success: {
              iconTheme: {
                primary: "#16a34a",
                secondary: "#f0fdf4",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fef2f2",
              },
            },
          }}
        />
      </body>
    </html>
  );
}