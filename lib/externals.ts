import { LocalEvent, SourceStatus } from "./types";

// Deterministic stub signals for data sources without free public APIs.
// Each returns a SourceStatus tagged "simulated" or "unavailable" so the UI
// can clearly mark non-live values. Replace with real fetchers as keys arrive.

export interface ExternalsBundle {
  seineFlowCubicMS: number | undefined;
  pollenRisk: "low" | "moderate" | "high" | undefined;
  sncfDelayMin: number | undefined;
  cherryBlossomBuzz: number;
  competitorBusiness: "quiet" | "typical" | "busier";
  localEvents: LocalEvent[];
  sources: SourceStatus[];
}

function buildCatalog(target: Date): LocalEvent[] {
  return [
    {
      id: "brocante-cormeilles",
      title: "Brocante de Cormeilles",
      startISO: atHour(target, 9),
      endISO: atHour(target, 18),
      distanceKm: 1.1,
      kind: "brocante",
      expectedBump: 25
    },
    {
      id: "aviron-seine",
      title: "Régate Aviron — Seine",
      startISO: atHour(target, 10, 30),
      endISO: atHour(target, 13),
      distanceKm: 0.4,
      kind: "rowing",
      expectedBump: 18
    },
    {
      id: "marche-dominical",
      title: "Marché dominical La Frette",
      startISO: atHour(target, 8),
      endISO: atHour(target, 13),
      distanceKm: 0.6,
      kind: "market",
      expectedBump: 12
    }
  ];
}

function atHour(base: Date, h: number, m = 0): string {
  const d = new Date(base);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
}

function hashDay(target: Date): number {
  return (target.getUTCFullYear() * 372 + target.getUTCMonth() * 31 + target.getUTCDate()) % 97;
}

export async function fetchVigicrues(): Promise<{ flow: number | undefined; source: SourceStatus }> {
  // Vigicrues exposes data via https://www.vigicrues.gouv.fr/services/observations.json/
  // but requires station codes and returns dense XML/JSON. Stub with a plausible value.
  try {
    const url = "https://www.vigicrues.gouv.fr/services/observations.json/index.php?CdStationHydro=H580001001&GrdSerie=Q";
    const res = await fetch(url, { next: { revalidate: 1800 }, signal: AbortSignal.timeout(4000) });
    if (!res.ok) throw new Error(`Vigicrues ${res.status}`);
    const data = (await res.json()) as { Serie?: { ObssHydro?: Array<{ ResObsHydro: number }> } };
    const last = data.Serie?.ObssHydro?.slice(-1)[0]?.ResObsHydro;
    if (typeof last === "number") {
      return {
        flow: Math.round(last),
        source: { id: "vigicrues", label: "Vigicrues (débit Seine)", confidence: "live", fetchedAt: new Date().toISOString() }
      };
    }
    throw new Error("No flow data");
  } catch (err) {
    return {
      flow: 280 + (hashDay(new Date()) % 120),
      source: {
        id: "vigicrues",
        label: "Vigicrues (débit Seine)",
        confidence: "simulated",
        note: err instanceof Error ? err.message : "Code station non confirmé — valeur plausible Q (m³/s).",
        fetchedAt: new Date().toISOString()
      }
    };
  }
}

export function getExternalsStubs(target: Date): Omit<ExternalsBundle, "seineFlowCubicMS" | "sources"> & { sources: SourceStatus[] } {
  const h = hashDay(target);
  const pollenOptions: Array<"low" | "moderate" | "high"> = ["low", "moderate", "high"];
  const busyOptions: Array<"quiet" | "typical" | "busier"> = ["quiet", "typical", "busier"];

  const sources: SourceStatus[] = [
    {
      id: "rnsa",
      label: "RNSA (pollen)",
      confidence: "simulated",
      note: "Pas de JSON public gratuit. Brancher le bulletin Airparif quand dispo.",
      fetchedAt: new Date().toISOString()
    },
    {
      id: "sncf",
      label: "SNCF Ligne J (retards)",
      confidence: "simulated",
      note: "API Navitia nécessite SNCF_NAVITIA_TOKEN. Baseline 0 min.",
      fetchedAt: new Date().toISOString()
    },
    {
      id: "instagram",
      label: "Instagram / TikTok #QuaiDeSeine",
      confidence: "unavailable",
      note: "APIs Meta / TikTok derrière validation business. À remplacer par RSS/Nitter.",
      fetchedAt: new Date().toISOString()
    },
    {
      id: "gmaps-busy",
      label: "Google Maps « plus fréquenté »",
      confidence: "unavailable",
      note: "Popular-times nécessite Places API + scraping. Valeur « typique ».",
      fetchedAt: new Date().toISOString()
    },
    {
      id: "nutella",
      label: "Leclerc Cormeilles (promos toppings)",
      confidence: "simulated",
      note: "Pas d'API promo publique. À parser depuis drive.leclerc.",
      fetchedAt: new Date().toISOString()
    },
    {
      id: "astrology",
      label: "Transits célestes",
      confidence: "simulated",
      note: "Seed déterministe — brancher swisseph ou astrologyapi.com plus tard.",
      fetchedAt: new Date().toISOString()
    },
    {
      id: "events",
      label: "Sortir en Val d'Oise / mairies",
      confidence: "simulated",
      note: "Scraping HTML requis — catalogue de départ inclus.",
      fetchedAt: new Date().toISOString()
    }
  ];

  return {
    pollenRisk: pollenOptions[h % pollenOptions.length],
    sncfDelayMin: 0,
    cherryBlossomBuzz: (h % 40) / 100,
    competitorBusiness: busyOptions[(h + 1) % busyOptions.length],
    localEvents: buildCatalog(target),
    sources
  };
}
