import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"]
});

export const metadata = {
  title: "Glaces en Seine · Briefing",
  description: "Briefing du prochain service (Sam/Dim/fériés 14h–19h) pour la caravane Glaces en Seine.",
  applicationName: "Glaces en Seine"
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f5c048"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${nunito.variable} min-h-screen bg-seine-bg text-seine-ink antialiased`}>
        {children}
      </body>
    </html>
  );
}
