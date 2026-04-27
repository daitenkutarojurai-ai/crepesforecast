import type { LocalEvent, SourceStatus } from "./types";

// Recurring local events known from the municipality calendars and press.
// Used as a fallback when OpenAgenda / scraping return nothing for a given
// target Sunday. Every entry is dated against the *target* date so the UI
// always shows something concrete on a quiet Sunday.

type Rule =
  | { kind: "weekly"; weekday: 0 | 1 | 2 | 3 | 4 | 5 | 6 }
  | { kind: "monthly-nth"; weekday: 0 | 1 | 2 | 3 | 4 | 5 | 6; nth: 1 | 2 | 3 | 4 | "last"; months: number[] }
  | { kind: "annual"; month: number; day: number };

interface KnownEvent {
  id: string;
  title: string;
  startHour: [number, number];
  distanceKm: number;
  kind: LocalEvent["kind"];
  expectedBump: number;
  rule: Rule;
  sourceUrl: string;
  sourceLabel: string;
}

// Only keep entries we can actually vouch for. Recurring brocantes,
// vide-greniers and régates rotate every year — guessing them from a fixed
// nth-Sunday rule produced false positives, so those now come exclusively
// from OpenAgenda + municipal scrapers (lib/openagenda.ts, lib/agenda-scrapers.ts).
const KNOWN_EVENTS: KnownEvent[] = [
  {
    id: "marche-lafrette",
    title: "Marché dominical — La Frette-sur-Seine",
    startHour: [8, 0],
    distanceKm: 0.6,
    kind: "market",
    expectedBump: 12,
    rule: { kind: "weekly", weekday: 0 },
    sourceUrl: "https://www.lafrettesurseine.fr/",
    sourceLabel: "Mairie La Frette"
  },
  {
    id: "fete-musique",
    title: "Fête de la musique",
    startHour: [18, 0],
    distanceKm: 2,
    kind: "theater",
    expectedBump: 15,
    rule: { kind: "annual", month: 5, day: 21 },
    sourceUrl: "https://fetedelamusique.culture.gouv.fr/",
    sourceLabel: "Culture.gouv"
  },
  {
    id: "fete-nationale",
    title: "Fête nationale — feu d'artifice",
    startHour: [21, 0],
    distanceKm: 3,
    kind: "other",
    expectedBump: 18,
    rule: { kind: "annual", month: 6, day: 14 },
    sourceUrl: "https://valparisis.fr/",
    sourceLabel: "Val Parisis"
  }
];

function nthWeekdayOfMonth(year: number, month: number, weekday: number, nth: 1 | 2 | 3 | 4 | "last"): Date {
  if (nth === "last") {
    const last = new Date(year, month + 1, 0);
    const diff = (last.getDay() - weekday + 7) % 7;
    return new Date(year, month, last.getDate() - diff);
  }
  const first = new Date(year, month, 1);
  const diff = (weekday - first.getDay() + 7) % 7;
  return new Date(year, month, 1 + diff + (nth - 1) * 7);
}

function matches(event: KnownEvent, target: Date): boolean {
  const r = event.rule;
  if (r.kind === "weekly") {
    return target.getDay() === r.weekday;
  }
  if (r.kind === "annual") {
    return target.getMonth() === r.month && target.getDate() === r.day;
  }
  if (r.kind === "monthly-nth") {
    if (!r.months.includes(target.getMonth())) return false;
    const anchor = nthWeekdayOfMonth(target.getFullYear(), target.getMonth(), r.weekday, r.nth);
    return (
      anchor.getFullYear() === target.getFullYear() &&
      anchor.getMonth() === target.getMonth() &&
      anchor.getDate() === target.getDate()
    );
  }
  return false;
}

export function getKnownEvents(target: Date): { events: LocalEvent[]; source: SourceStatus } {
  const events: LocalEvent[] = KNOWN_EVENTS.filter((e) => matches(e, target)).map((e) => {
    const start = new Date(target);
    start.setHours(e.startHour[0], e.startHour[1], 0, 0);
    return {
      id: e.id,
      title: e.title,
      startISO: start.toISOString(),
      distanceKm: e.distanceKm,
      kind: e.kind,
      expectedBump: e.expectedBump,
      sourceUrl: e.sourceUrl,
      sourceLabel: e.sourceLabel
    };
  });
  return {
    events,
    source: {
      id: "known-events",
      label: "Catalogue local récurrent",
      confidence: "cached",
      note: `${events.length} évén. connus pour ce jour`,
      fetchedAt: new Date().toISOString()
    }
  };
}
