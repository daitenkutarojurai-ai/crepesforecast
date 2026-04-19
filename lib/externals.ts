import { fetchAgendaScrapes } from "./agenda-scrapers";
import { getKnownEvents } from "./known-events";
import { fetchOpenAgendaEvents } from "./openagenda";
import { LocalEvent, SourceStatus } from "./types";

export interface ExternalsBundle {
  localEvents: LocalEvent[];
  sources: SourceStatus[];
}

function dedupe(events: LocalEvent[]): LocalEvent[] {
  const seen = new Map<string, LocalEvent>();
  for (const e of events) {
    const key = `${e.startISO.slice(0, 10)}|${e.title.toLowerCase().replace(/\s+/g, " ").slice(0, 40)}`;
    const prior = seen.get(key);
    if (!prior || e.distanceKm < prior.distanceKm) {
      seen.set(key, e);
    }
  }
  return Array.from(seen.values()).sort((a, b) => b.expectedBump - a.expectedBump);
}

export async function fetchExternals(target: Date): Promise<ExternalsBundle> {
  const [openAgenda, scrapes] = await Promise.all([
    fetchOpenAgendaEvents(target),
    fetchAgendaScrapes(target)
  ]);

  const known = getKnownEvents(target);

  const merged = dedupe([...openAgenda.events, ...scrapes.events, ...known.events]);

  return {
    localEvents: merged,
    sources: [openAgenda.source, ...scrapes.sources, known.source]
  };
}
