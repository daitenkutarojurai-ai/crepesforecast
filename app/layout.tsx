import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Glaces en Seine · Briefing",
  description: "Briefing du prochain service (Sam/Dim/fériés 14h–19h) pour la caravane Glaces en Seine.",
  applicationName: "Glaces en Seine"
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#cfe4f0"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-seine-bg text-seine-ink antialiased">
        {children}
      </body>
    </html>
  );
}
