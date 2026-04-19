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
    });
    if (!res.ok) throw new Error(`Hubeau ${res.status}`);
    const data = (await res.json()) as {
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
    return {
      level: undefined,
      source: {
        id: "hubeau-seine",
        label: "Hubeau — niveau Seine",
        confidence: "unavailable",
        note: err instanceof Error ? err.message : "Hubeau injoignable",
        fetchedAt: new Date().toISOString()
      }
    };
  }
}
