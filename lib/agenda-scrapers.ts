import type { LocalEvent, SourceStatus } from "./types";

const MONTHS_FR: Record<string, number> = {
  janvier: 0,
  février: 1,
  fevrier: 1,
  mars: 2,
  avril: 3,
  mai: 4,
  juin: 5,
  juillet: 6,
  août: 7,
  aout: 7,
  septembre: 8,
  octobre: 9,
  novembre: 10,
  décembre: 11,
  decembre: 11
};

function stripTags(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&eacute;/g, "é")
    .replace(/&egrave;/g, "è")
    .replace(/&agrave;/g, "à")
    .replace(/&ecirc;/g, "ê")
    .replace(/&ocirc;/g, "ô")
    .replace(/&ccedil;/g, "ç")
    .replace(/&rsquo;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function classify(title: string): LocalEvent["kind"] {
  const t = title.toLowerCase();
  if (/brocante|vide[-\s]?grenier/.test(t)) return "brocante";
  if (/march[ée]/.test(t)) return "market";
  if (/aviron|r[ée]gate|kayak|canoë/.test(t)) return "rowing";
  if (/marathon|course|foulées|run/.test(t)) return "marathon";
  if (/messe|procession|célébration|celebration/.test(t)) return "religious";
  if (/th[éeê][âa]tre|concert|spectacle|festival|cin[ée]ma/.test(t)) return "theater";
  return "other";
}

function parseFrenchDate(raw: string, fallbackYear: number): Date | undefined {
  const txt = raw.toLowerCase();
  const m = txt.match(/(\d{1,2})\s+(janvier|février|fevrier|mars|avril|mai|juin|juillet|août|aout|septembre|octobre|novembre|décembre|decembre)(?:\s+(\d{4}))?/);
  if (!m) return undefined;
  const day = parseInt(m[1], 10);
  const month = MONTHS_FR[m[2]];
  const year = m[3] ? parseInt(m[3], 10) : fallbackYear;
  if (Number.isNaN(day) || month === undefined) return undefined;
  const d = new Date(year, month, day, 10, 0, 0);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, {
    next: { revalidate: 3600 },
    signal: AbortSignal.timeout(6000),
    headers: { "User-Agent": "GlacesEnSeineBriefing/1.0" }
  });
  if (!res.ok) throw new Error(`${url} ${res.status}`);
  return res.text();
}

function extractCards(html: string): Array<{ title: string; blob: string; href?: string }> {
  const cards: Array<{ title: string; blob: string; href?: string }> = [];
  const articleRegex = /<article[\s\S]*?<\/article>/gi;
  const matches = html.match(articleRegex) ?? [];
  for (const art of matches) {
    const titleMatch = art.match(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/i);
    if (!titleMatch) continue;
    const title = stripTags(titleMatch[1]);
    if (!title) continue;
    const hrefMatch = art.match(/href="([^"]+)"/i);
    cards.push({ title, blob: stripTags(art), href: hrefMatch?.[1] });
  }
  if (cards.length === 0) {
    const liRegex = /<li[\s\S]*?<\/li>/gi;
    for (const li of html.match(liRegex) ?? []) {
      const titleMatch = li.match(/<h[234][^>]*>([\s\S]*?)<\/h[234]>/i);
      if (!titleMatch) continue;
      const title = stripTags(titleMatch[1]);
      if (!title) continue;
      cards.push({ title, blob: stripTags(li) });
    }
  }
  return cards;
}

function absolutize(href: string | undefined, base: string): string | undefined {
  if (!href) return undefined;
  if (href.startsWith("http")) return href;
  try {
    return new URL(href, base).toString();
  } catch {
    return undefined;
  }
}

async function scrapeList(
  url: string,
  fallbackDistanceKm: number,
  target: Date,
  label: string
): Promise<LocalEvent[]> {
  const html = await fetchText(url);
  const cards = extractCards(html);
  const targetDay = target.toISOString().slice(0, 10);
  const results: LocalEvent[] = [];
  for (const c of cards) {
    const date = parseFrenchDate(c.blob, target.getFullYear());
    if (!date) continue;
    if (date.toISOString().slice(0, 10) !== targetDay) continue;
    const kind = classify(c.title);
    const bumpBase: Record<LocalEvent["kind"], number> = {
      brocante: 22,
      market: 10,
      rowing: 18,
      marathon: 20,
      religious: 14,
      theater: 10,
      other: 8
    };
    const entry: LocalEvent = {
      id: `scrape-${Buffer.from(c.title).toString("base64").slice(0, 12)}`,
      title: c.title.slice(0, 80),
      startISO: date.toISOString(),
      distanceKm: fallbackDistanceKm,
      kind,
      expectedBump: bumpBase[kind]
    };
    const absolute = absolutize(c.href, url);
    if (absolute) {
      entry.sourceUrl = absolute;
      entry.sourceLabel = label;
    } else {
      entry.sourceUrl = url;
      entry.sourceLabel = label;
    }
    results.push(entry);
  }
  return results;
}

export async function fetchAgendaScrapes(
  target: Date
): Promise<{ events: LocalEvent[]; sources: SourceStatus[] }> {
  const targets = [
    { id: "lafrette", label: "La Frette-sur-Seine · agenda", url: "https://www.lafrettesurseine.fr/agenda", distance: 0.5 },
    { id: "valparisis-0", label: "Val Parisis · agenda (p.1)", url: "https://valparisis.fr/agglomeration/en-ce-moment/agenda-des-sorties?page=0", distance: 4 },
    { id: "valparisis-1", label: "Val Parisis · agenda (p.2)", url: "https://valparisis.fr/agglomeration/en-ce-moment/agenda-des-sorties?page=1", distance: 4 }
  ];

  const outs = await Promise.all(
    targets.map(async (t) => {
      try {
        const events = await scrapeList(t.url, t.distance, target, t.label);
        return {
          events,
          source: {
            id: t.id,
            label: t.label,
            confidence: "live" as const,
            note: `${events.length} évén. le jour ciblé`,
            fetchedAt: new Date().toISOString()
          }
        };
      } catch (err) {
        return {
          events: [] as LocalEvent[],
          source: {
            id: t.id,
            label: t.label,
            confidence: "unavailable" as const,
            note: err instanceof Error ? err.message : "Scrape échoué",
            fetchedAt: new Date().toISOString()
          }
        };
      }
    })
  );

  return {
    events: outs.flatMap((o) => o.events),
    sources: outs.map((o) => o.source)
  };
}
