import type { SourceStatus } from "./types";

export interface SeineLevel {
  heightM: number;
  timestamp: string;
  stationCode: string;
}

const STATION = "H300000201";

export async function fetchSeineLevel(): Promise<{
  level: SeineLevel | undefined;
  source: SourceStatus;
}> {
  const url =
    `https://hubeau.eaufrance.fr/api/v2/hydrometrie/observations_tr` +
    `?code_entite=${STATION}&grandeur_hydro=H&size=1&sort=desc`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 1800 },
      signal: AbortSignal.timeout(4000)
    } as unknown as RequestInit);
    if (!res.ok) throw new Error(`Hubeau ${res.status}`);
    const raw: unknown = await res.json();
    if (!raw || typeof raw !== "object") throw new Error("Hubeau: réponse invalide");
    const data = raw as {
      data?: Array<{
        resultat_obs?: number;
        date_obs?: string;
        code_station?: string;
      }>;
    };
    const first = data.data?.[0];
    if (!first || typeof first.resultat_obs !== "number") {
      throw new Error("Pas de mesure Hubeau");
    }
    return {
      level: {
        heightM: Math.round((first.resultat_obs / 1000) * 100) / 100,
        timestamp: first.date_obs ?? new Date().toISOString(),
        stationCode: first.code_station ?? STATION
      },
      source: {
        id: "hubeau-seine",
        label: "Hubeau — niveau Seine",
        confidence: "live",
        note: `Station ${STATION}`,
        fetchedAt: new Date().toISOString()
      }
    };
  } catch (err) {
    const estimated = estimateSeineLevel();
    return {
      level: estimated,
      source: {
        id: "hubeau-seine",
        label: "Hubeau — niveau Seine",
        confidence: "simulated",
        note: `Estimation saisonnière (${err instanceof Error ? err.message : "Hubeau injoignable"})`,
        fetchedAt: new Date().toISOString()
      }
    };
  }
}

// Seasonal Seine level estimate for station H300000201 (La Frette / Herblay area)
// Based on typical annual profile: higher in winter/spring, lower in summer
function estimateSeineLevel(): SeineLevel {
  const month = new Date().getMonth() + 1; // 1–12
  const monthlyAvg: Record<number, number> = {
    1: 2.0, 2: 2.2, 3: 2.0, 4: 1.8, 5: 1.5, 6: 1.0,
    7: 0.8, 8: 0.8, 9: 1.0, 10: 1.2, 11: 1.5, 12: 1.8
  };
  return {
    heightM: monthlyAvg[month] ?? 1.2,
    timestamp: new Date().toISOString(),
    stationCode: STATION
  };
}
