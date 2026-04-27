import { LOCATION } from "./engine";
import { toYmd } from "./time";
import type { SourceStatus } from "./types";

export type PollenLevel = "low" | "moderate" | "high";

export interface PollenView {
  level: PollenLevel;
  dominant: string;
  score: number;
  note: string;
}

interface OpenMeteoAirQuality {
  hourly?: {
    time?: string[];
    alder_pollen?: Array<number | null>;
    birch_pollen?: Array<number | null>;
    grass_pollen?: Array<number | null>;
    mugwort_pollen?: Array<number | null>;
    olive_pollen?: Array<number | null>;
    ragweed_pollen?: Array<number | null>;
  };
}

const TYPES: Array<{ key: keyof NonNullable<OpenMeteoAirQuality["hourly"]>; label: string; moderate: number }> = [
  { key: "alder_pollen", label: "aulne", moderate: 8 },
  { key: "birch_pollen", label: "bouleau", moderate: 9 },
  { key: "grass_pollen", label: "graminées", moderate: 20 },
  { key: "mugwort_pollen", label: "armoise", moderate: 5 },
  { key: "olive_pollen", label: "olivier", moderate: 15 },
  { key: "ragweed_pollen", label: "ambroisie", moderate: 5 }
];

function endpointFor(target: Date): string {
  const ymd = toYmd(target);
  const hourly = TYPES.map((t) => t.key).join(",");
  return (
    `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${LOCATION.lat}&longitude=${LOCATION.lon}` +
    `&hourly=${hourly}` +
    `&timezone=Europe%2FParis&start_date=${ymd}&end_date=${ymd}`
  );
}

function dailyMax(series?: Array<number | null>): number {
  if (!series || series.length === 0) return 0;
  let m = 0;
  for (const v of series) {
    if (typeof v === "number" && v > m) m = v;
  }
  return m;
}

function classify(score: number): PollenLevel {
  if (score >= 2) return "high";
  if (score >= 1) return "moderate";
  return "low";
}

function noteFor(level: PollenLevel, dominant: string): string {
  if (level === "high") return `Pollen ${dominant} élevé — prévois plus de serviettes, éternuements en rafale.`;
  if (level === "moderate") return `Pollen ${dominant} modéré — stock de serviettes +50%.`;
  return "Pollen bas — service tranquille côté mouchoirs.";
}

export async function fetchPollen(target: Date): Promise<{ pollen: PollenView; source: SourceStatus }> {
  try {
    const res = await fetch(endpointFor(target), {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5000)
    } as unknown as RequestInit);
    if (!res.ok) throw new Error(`Open-Meteo AQ ${res.status}`);
    const data = (await res.json()) as OpenMeteoAirQuality;
    if (!data.hourly?.time?.length) throw new Error("Open-Meteo AQ: empty payload");

    let bestScore = 0;
    let bestLabel = "graminées";
    for (const t of TYPES) {
      const peak = dailyMax(data.hourly[t.key] as Array<number | null> | undefined);
      const score = peak / t.moderate;
      if (score > bestScore) {
        bestScore = score;
        bestLabel = t.label;
      }
    }

    const level = classify(bestScore);
    return {
      pollen: {
        level,
        dominant: bestLabel,
        score: Math.round(bestScore * 10) / 10,
        note: noteFor(level, bestLabel)
      },
      source: {
        id: "open-meteo-pollen",
        label: "Open-Meteo Air Quality (pollen)",
        confidence: "live",
        fetchedAt: new Date().toISOString()
      }
    };
  } catch (err) {
    return {
      pollen: {
        level: "moderate",
        dominant: "graminées",
        score: 1,
        note: "Estimation saisonnière — prépare 1,5x le stock serviettes."
      },
      source: {
        id: "open-meteo-pollen",
        label: "Open-Meteo Air Quality (pollen)",
        confidence: "unavailable",
        note: err instanceof Error ? err.message : "Erreur réseau",
        fetchedAt: new Date().toISOString()
      }
    };
  }
}
