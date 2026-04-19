import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Glaces en Seine · Mission Control",
  description: "Sunday Morning Mission Briefing for the Glaces en Seine caravan.",
  applicationName: "Glaces en Seine"
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#05070b"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="dark">
      <body className="min-h-screen bg-mission-bg text-mission-ink antialiased">
        {children}
      </body>
    </html>
  );
}
