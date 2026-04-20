import type { LocalEvent, SourceStatus } from "./types";

const KEY = "08b058313d04488086059187a8a1cd4c";
const LAT_LNG = "48.9728,2.1936";
const RADIUS_KM = 10;

interface OAEvent {
  uid?: number | string;
  slug?: string;
  canonicalUrl?: string;
  permalink?: string;
  originAgenda?: { uid?: number | string; slug?: string };
  title?: Record<string, string> | string;
  firstTiming?: { begin?: string; end?: string };
  lastTiming?: { begin?: string; end?: string };
  timings?: Array<{ begin?: string; end?: string }>;
  location?: {
    latitude?: number;
    longitude?: number;
    name?: string;
    city?: string;
  };
}

function pickUrl(ev: OAEvent): string | undefined {
  if (ev.canonicalUrl) return ev.canonicalUrl;
  if (ev.permalink) return ev.permalink;
  const agendaSlug = ev.originAgenda?.slug;
  if (agendaSlug && ev.slug) {
    return `https://openagenda.com/${agendaSlug}/events/${ev.slug}`;
  }
  if (ev.uid) return `https://openagenda.com/events/${ev.uid}`;
  return undefined;
}

function pickTitle(t: OAEvent["title"]): string {
  if (!t) return "Événement";
  if (typeof t === "string") return t;
  return t.fr ?? t.en ?? Object.values(t)[0] ?? "Événement";
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function haversineKm(a: [number, number], b: [number, number]): number {
  const [lat1, lon1] = a;
  const [lat2, lon2] = b;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

function classify(title: string): LocalEvent["kind"] {
  const t = title.toLowerCase();
  if (/brocante|vide[-\s]?grenier/.test(t)) return "brocante";
  if (/march[ée]/.test(t)) return "market";
  if (/aviron|r[ée]gate|kayak|canoë/.test(t)) return "rowing";
  if (/marathon|course|run|foulées/.test(t)) return "marathon";
  if (/messe|procession|c[ée]r[ée]monie|c[ée]l[ée]bration/.test(t)) return "religious";
  if (/th[éeê][âa]tre|concert|spectacle|festival|cin[ée]ma/.test(t)) return "theater";
  return "other";
}

function bumpFor(kind: LocalEvent["kind"], distanceKm: number): number {
  const base: Record<LocalEvent["kind"], number> = {
    brocante: 25,
    market: 12,
    rowing: 18,
    marathon: 20,
    religious: 15,
    theater: 10,
    other: 8
  };
  const falloff = distanceKm <= 1 ? 1 : distanceKm <= 3 ? 0.7 : distanceKm <= 6 ? 0.4 : 0.2;
  return Math.max(4, Math.round(base[kind] * falloff));
}

function pickTiming(
  ev: OAEvent,
  target: Date
): { begin: string; end?: string } | undefined {
  const targetDay = target.toISOString().slice(0, 10);
  const all: Array<{ begin?: string; end?: string }> = [];
  if (ev.firstTiming) all.push(ev.firstTiming);
  if (ev.lastTiming) all.push(ev.lastTiming);
  if (ev.timings) all.push(...ev.timings);
  const sameDay = all.find((t) => t.begin?.slice(0, 10) === targetDay);
  if (sameDay?.begin) return { begin: sameDay.begin, end: sameDay.end };
  if (all[0]?.begin) return { begin: all[0].begin, end: all[0].end };
  return undefined;
}

export async function fetchOpenAgendaEvents(
  target: Date
): Promise<{ events: LocalEvent[]; source: SourceStatus }> {
  const targetDay = target.toISOString().slice(0, 10);
  const url =
    `https://api.openagenda.com/v2/events` +
    `?key=${KEY}&latLng=${LAT_LNG}&radius=${RADIUS_KM}` +
    `&lang=fr&size=20&relative[]=current&relative[]=upcoming` +
    `&detailed=1`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5000)
    });
    if (!res.ok) throw new Error(`OpenAgenda ${res.status}`);
    const data = (await res.json()) as { events?: OAEvent[] };
    const origin: [number, number] = [48.9728, 2.1936];
    const mapped: LocalEvent[] = [];
    for (let idx = 0; idx < (data.events?.length ?? 0); idx++) {
      const ev = data.events![idx];
      const timing = pickTiming(ev, target);
      if (!timing?.begin) continue;
      const title = pickTitle(ev.title);
      const lat = ev.location?.latitude;
      const lon = ev.location?.longitude;
      const distanceKm =
        typeof lat === "number" && typeof lon === "number"
          ? Math.round(haversineKm(origin, [lat, lon]) * 10) / 10
          : RADIUS_KM;
      const kind = classify(title);
      const entry: LocalEvent = {
        id: `oa-${ev.uid ?? idx}`,
        title,
        startISO: timing.begin,
        distanceKm,
        kind,
        expectedBump: bumpFor(kind, distanceKm)
      };
      if (timing.end) entry.endISO = timing.end;
      const url = pickUrl(ev);
      if (url) {
        entry.sourceUrl = url;
        entry.sourceLabel = "OpenAgenda";
      }
      if (entry.startISO.slice(0, 10) === targetDay) mapped.push(entry);
    }

    return {
      events: mapped,
      source: {
        id: "openagenda",
        label: "OpenAgenda",
        confidence: "live",
        note: `${mapped.length} évén. dans 10 km`,
        fetchedAt: new Date().toISOString()
      }
    };
  } catch (err) {
    return {
      events: [],
      source: {
        id: "openagenda",
        label: "OpenAgenda",
        confidence: "unavailable",
        note: err instanceof Error ? err.message : "OpenAgenda injoignable",
        fetchedAt: new Date().toISOString()
      }
    };
  }
}
