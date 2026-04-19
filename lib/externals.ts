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

const CATALOG: LocalEvent[] = [
  {
    id: "brocante-cormeilles",
    title: "Brocante de Cormeilles",
    startISO: atHour(9),
    endISO: atHour(18),
    distanceKm: 1.1,
    kind: "brocante",
    expectedBump: 25
  },
  {
    id: "aviron-seine",
    title: "Régate Aviron — Seine",
    startISO: atHour(10, 30),
    endISO: atHour(13),
    distanceKm: 0.4,
    kind: "rowing",
    expectedBump: 18
  },
  {
    id: "marche-dominical",
    title: "Marché dominical La Frette",
    startISO: atHour(8),
    endISO: atHour(13),
    distanceKm: 0.6,
    kind: "market",
    expectedBump: 12
  }
];

function atHour(h: number, m = 0): string {
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d.toISOString();
}

function hashDay(): number {
  const d = new Date();
  return (d.getUTCFullYear() * 372 + d.getUTCMonth() * 31 + d.getUTCDate()) % 97;
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
        source: { id: "vigicrues", label: "Vigicrues (Seine flow)", confidence: "live", fetchedAt: new Date().toISOString() }
      };
    }
    throw new Error("No flow data");
  } catch (err) {
    return {
      flow: 280 + (hashDay() % 120),
      source: {
        id: "vigicrues",
        label: "Vigicrues (Seine flow)",
        confidence: "simulated",
        note: err instanceof Error ? err.message : "Station code not confirmed — using plausible Q (m³/s).",
        fetchedAt: new Date().toISOString()
      }
    };
  }
}

export function getExternalsStubs(): Omit<ExternalsBundle, "seineFlowCubicMS" | "sources"> & { sources: SourceStatus[] } {
  const h = hashDay();
  const pollenOptions: Array<"low" | "moderate" | "high"> = ["low", "moderate", "high"];
  const busyOptions: Array<"quiet" | "typical" | "busier"> = ["quiet", "typical", "busier"];

  const sources: SourceStatus[] = [
    {
      id: "rnsa",
      label: "RNSA (pollen)",
      confidence: "simulated",
      note: "RNSA has no free public JSON. Plug Airparif pollen bulletin when key available.",
      fetchedAt: new Date().toISOString()
    },
    {
      id: "sncf",
      label: "SNCF Ligne J (delays)",
      confidence: "simulated",
      note: "Navitia API requires SNCF_NAVITIA_TOKEN. Not set — using 0 min baseline.",
      fetchedAt: new Date().toISOString()
    },
    {
      id: "instagram",
      label: "Instagram/TikTok #QuaiDeSeine",
      confidence: "unavailable",
      note: "Meta/TikTok API gated behind business review. Replace with RSS/Nitter or paid proxy.",
      fetchedAt: new Date().toISOString()
    },
    {
      id: "gmaps-busy",
      label: "Google Maps 'Busier than usual'",
      confidence: "unavailable",
      note: "Popular-times requires Places API key + scraping. Returning typical.",
      fetchedAt: new Date().toISOString()
    },
    {
      id: "nutella",
      label: "Leclerc Cormeilles (promos toppings)",
      confidence: "simulated",
      note: "No public promo API. Parse drive.leclerc/leaflet in future iteration.",
      fetchedAt: new Date().toISOString()
    },
    {
      id: "astrology",
      label: "Celestial transits",
      confidence: "simulated",
      note: "Deterministic seed from date — plug swisseph or astrologyapi.com later.",
      fetchedAt: new Date().toISOString()
    },
    {
      id: "events",
      label: "Sortir en Val d'Oise / mairies",
      confidence: "simulated",
      note: "HTML scraping required — starter catalog included.",
      fetchedAt: new Date().toISOString()
    }
  ];

  return {
    pollenRisk: pollenOptions[h % pollenOptions.length],
    sncfDelayMin: 0,
    cherryBlossomBuzz: (h % 40) / 100,
    competitorBusiness: busyOptions[(h + 1) % busyOptions.length],
    localEvents: CATALOG,
    sources
  };
}
