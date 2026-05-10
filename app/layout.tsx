import { Fredoka, Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"]
});

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
  display: "swap",
  weight: ["500", "600", "700"]
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://crepesforecast.vercel.app";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Glaces en Seine · Briefing du prochain service",
  description:
    "Briefing météo, affluence et menu pour la caravane Glaces en Seine sur le Quai de Seine (La Frette / Cormeilles-en-Parisis). Service Samedi, Dimanche et jours fériés de 14h à 19h.",
  applicationName: "Glaces en Seine",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE_URL,
    siteName: "Glaces en Seine",
    title: "Glaces en Seine · Briefing du prochain service",
    description:
      "Briefing météo, affluence et menu pour la caravane Glaces en Seine sur le Quai de Seine (La Frette / Cormeilles-en-Parisis).",
    images: [
      {
        url: "/bannerup.webp",
        width: 1200,
        height: 630,
        alt: "Caravane Glaces en Seine sur le quai"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Glaces en Seine · Briefing du prochain service",
    description:
      "Briefing météo, affluence et menu pour la caravane Glaces en Seine sur le Quai de Seine.",
    images: ["/bannerup.webp"]
  },
  robots: {
    index: true,
    follow: true
  }
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f5c048"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${nunito.variable} ${fredoka.variable} min-h-screen bg-seine-bg text-seine-ink antialiased`}>
        {children}
      </body>
    </html>
  );
}
