import {
  BribeResult,
  CardiganResult,
  EngineInputs,
  HoroscopeCard,
  LycraForecast,
  NapkinForecast,
  NutellaIndex,
  PivotResult,
  PoussetteForecast,
  Pulse,
  Recommendation,
  SocialSignal,
  CompetitorSignal
} from "./types";

export const LOCATION = {
  name: "Quai de Seine — La Frette / Cormeilles-en-Parisis",
  lat: 48.9843,
  lon: 2.1836,
  postalCodes: ["95240", "95530"]
} as const;

const FATIGUE_CONSTANT = 1.4;
const AVG_CHILD_AGE_YEARS = 6;
const DIST_FROM_PARKING_M = 180;

export function computeCardigan(tempC: number, isSunny: boolean, windKmh: number): CardiganResult {
  const sunFactor = isSunny ? 1.0 : 0.5;
  const value = Math.round(((tempC * sunFactor) - windKmh) * 10) / 10;
  let level: CardiganResult["level"] = "green";
  let strategy = "Cadence standard. Volume + vitesse.";
  let hint = "Déroule la routine dominicale classique.";
  if (value > 15) {
    level = "red";
    strategy = "Qualité avant tout.";
    hint = "Vérifie les étiquettes bio. Grand-Mère veille au grain.";
  } else if (value > 8) {
    level = "amber";
    strategy = "Équilibre : la présentation compte.";
    hint = "Nettoie le comptoir entre les commandes.";
  }
  return { value, level, strategy, hint };
}

export function computePivot(tempC: number, isSunny: boolean): PivotResult {
  const sFactor = isSunny ? 3 : 0;
  const value = Math.round((((tempC + sFactor) - 21) / 5) * 100) / 100;
  const mode = value < 0 ? "crepe" : "glace";
  const heatAlert = value > 2;
  const description = heatAlert
    ? "Alerte canicule — boissons fraîches et sorbets en avant."
    : mode === "crepe"
      ? "Mode Crêpe — pâte chaude, chocolat chaud, Nutella en vitrine."
      : "Mode Glace — vitrine réfrigérée allumée, sorbets en vedette.";
  return { value, mode, heatAlert, description };
}

export function computeBribeOMeter(target: Date): BribeResult {
  const value =
    Math.round(((DIST_FROM_PARKING_M / AVG_CHILD_AGE_YEARS) * FATIGUE_CONSTANT) * 10) / 10;
  const start = new Date(target);
  start.setHours(16, 0, 0, 0);
  const end = new Date(target);
  end.setHours(17, 30, 0, 0);
  return {
    value,
    active: true,
    window: { startISO: start.toISOString(), endISO: end.toISOString() },
    recommendation:
      "Crêpe sucre format enfant : pré-plie 10 à 2 €, fenêtre 16:00–17:30."
  };
}

const PULSE_SCHEDULE: Array<Omit<Pulse, "minutesFromNow" | "timeISO"> & { hhmm: [number, number] }> = [
  { id: "ferry-10", kind: "ferry", label: "Bac Traversier — matinée", note: "Vague de piétons imminente.", severity: "watch", hhmm: [10, 0] },
  { id: "church-1145", kind: "church", label: "Sortie de messe — Saint-Nicolas", note: "Surveille baptêmes/communions : double crème chantilly.", severity: "high", hhmm: [11, 45] },
  { id: "ferry-1230", kind: "ferry", label: "Bac Traversier — midi", note: "Vague de piétons imminente.", severity: "watch", hhmm: [12, 30] },
  { id: "ferry-14", kind: "ferry", label: "Bac Traversier — après-midi", note: "Vague de piétons imminente.", severity: "watch", hhmm: [14, 0] },
  { id: "theater-1630", kind: "theater", label: "Le Petit Théâtre — entracte", note: "Service ultra-rapide : pré-plie 12 crêpes.", severity: "high", hhmm: [16, 30] },
  { id: "ferry-18", kind: "ferry", label: "Bac Traversier — soir", note: "Vague de piétons imminente.", severity: "watch", hhmm: [18, 0] }
];

export function buildPulses(target: Date, sncfDelayMin = 0): Pulse[] {
  const pulses: Pulse[] = PULSE_SCHEDULE.map((p) => {
    const t = new Date(target);
    t.setHours(p.hhmm[0], p.hhmm[1], 0, 0);
    return {
      id: p.id,
      kind: p.kind,
      label: p.label,
      note: p.note,
      severity: p.severity,
      timeISO: t.toISOString(),
      minutesFromNow: 0
    };
  });

  if (sncfDelayMin > 15) {
    const t = new Date(target);
    t.setHours(10, 15, 0, 0);
    pulses.push({
      id: "sncf-captive",
      kind: "sncf",
      label: `SNCF Ligne J — retard ${sncfDelayMin} min`,
      note: "Captifs en gare — oriente l'ardoise 3 € vers la gare.",
      severity: "high",
      timeISO: t.toISOString(),
      minutesFromNow: 0
    });
  }

  return pulses.sort(
    (a, b) => new Date(a.timeISO).getTime() - new Date(b.timeISO).getTime()
  );
}

export function napkinForecast(risk?: "low" | "moderate" | "high"): NapkinForecast {
  const effective = risk ?? "moderate";
  const recommendation =
    effective === "high"
      ? "RNSA: pollen élevé. Double la pile de serviettes côté comptoir."
      : effective === "moderate"
        ? "Pollen modéré. Prépare 1,5x le stock serviettes."
        : "Pollen bas. Stock standard.";
  return { risk: effective, recommendation };
}

export function lycraCoefficient(tempC: number, windKmh: number, isSunny: boolean, precipProbPct: number): LycraForecast {
  const base = Math.max(0, (tempC - 5) * 0.6);
  const sunBoost = isSunny ? 4 : 0;
  const windPenalty = Math.min(windKmh * 0.25, 6);
  const rainPenalty = Math.min(precipProbPct * 0.08, 6);
  const coefficient = Math.max(0, Math.round((base + sunBoost - windPenalty - rainPenalty) * 10) / 10);
  const note =
    coefficient > 10
      ? "EuroVelo 3 saturée. Prépare des formats à emporter."
      : coefficient > 5
        ? "Flux cycliste normal."
        : "Peu de cyclistes. Focus piétons et familles.";
  return { coefficient, note };
}

export function poussetteFactor(target: Date): PoussetteForecast {
  const month = target.getMonth();
  const isSeason = month === 2 || month === 3 || month === 4;
  const density: PoussetteForecast["density"] = isSeason ? "high" : "medium";
  return {
    density,
    window: "15:00 – 17:00",
    note: density === "high"
      ? "Période cerisiers/Pâques. Laisse 1,5 m devant le comptoir pour les poussettes."
      : "Trafic familial normal. Garde l'allée dégagée de 15:00 à 17:00."
  };
}

const MOON_PHASES: Array<{ label: string; emoji: string; vibe: string }> = [
  { label: "Nouvelle Lune", emoji: "🌑", vibe: "Ciel discret : clientèle timide, ils regardent deux fois avant d'entrer. Interpelle-les d'un sourire." },
  { label: "Premier croissant", emoji: "🌒", vibe: "Énergie qui monte : la file gonflera après 11h. Pré-plie les classiques tôt." },
  { label: "Premier quartier", emoji: "🌓", vibe: "Journée équilibrée : flux régulier sans gros pic. Bon jour pour tester une nouveauté." },
  { label: "Lune gibbeuse croissante", emoji: "🌔", vibe: "Les gens ont la langue bien pendue. Prévois des bavardages aux caisses." },
  { label: "Pleine Lune", emoji: "🌕", vibe: "Foule imprévisible et gourmande : double les portions et les sourires." },
  { label: "Lune gibbeuse décroissante", emoji: "🌖", vibe: "Les pourboires pleuvent. Soigne la présentation des grandes parts." },
  { label: "Dernier quartier", emoji: "🌗", vibe: "Clients pressés en fin d'après-midi. Formules à 30 secondes." },
  { label: "Dernier croissant", emoji: "🌘", vibe: "Rythme qui retombe. Fenêtre idéale pour préparer la semaine." }
];

const ZODIACS: Array<{
  sign: string;
  emoji: string;
  range: [number, number];
  trait: string;
  tip: string;
}> = [
  { sign: "Capricorne", emoji: "♑", range: [1222, 119], trait: "négocient le prix et comptent leurs pièces", tip: "sors ta formule à 5 € bien visible." },
  { sign: "Verseau", emoji: "♒", range: [120, 218], trait: "veulent du jamais-vu — tapenade-banane ?", tip: "prépare deux toppings déroutants." },
  { sign: "Poissons", emoji: "♓", range: [219, 320], trait: "ont les yeux plus grands que le ventre", tip: "propose le format enfant en porte de sortie." },
  { sign: "Bélier", emoji: "♈", range: [321, 419], trait: "débarquent enthousiastes et veulent tout tester", tip: "mets le combo découverte à 7 € en avant." },
  { sign: "Taureau", emoji: "♉", range: [420, 520], trait: "reviennent pour leur beurre-sucre habituel", tip: "offre la deuxième au 5e achat pour fidéliser." },
  { sign: "Gémeaux", emoji: "♊", range: [521, 620], trait: "commandent puis changent d'avis deux fois", tip: "reste patiente, propose deux options max." },
  { sign: "Cancer", emoji: "♋", range: [621, 722], trait: "sont nostalgiques et veulent la recette d'antan", tip: "pousse la crêpe beurre-sucre à l'ancienne." },
  { sign: "Lion", emoji: "♌", range: [723, 822], trait: "veulent être vus et commandent la plus grosse", tip: "monte la chantilly en spirale haute pour les stories." },
  { sign: "Vierge", emoji: "♍", range: [823, 922], trait: "demandent la liste exacte des ingrédients", tip: "affiche le panneau allergènes lisible." },
  { sign: "Balance", emoji: "♎", range: [923, 1022], trait: "arrivent en couple et partagent tout en deux", tip: "propose la crêpe duo à 6 € avec deux fourchettes." },
  { sign: "Scorpion", emoji: "♏", range: [1023, 1121], trait: "goûtent le piquant et le salé inattendu", tip: "ressors la crêpe chèvre-miel-piment d'Espelette." },
  { sign: "Sagittaire", emoji: "♐", range: [1122, 1221], trait: "testent les combos bizarres sans broncher", tip: "laisse-leur ton ardoise blanche à personnaliser." }
];

function moonPhase(target: Date): { label: string; emoji: string; vibe: string } {
  const ref = Date.UTC(2000, 0, 6, 18, 14);
  const daysSince = (target.getTime() - ref) / 86400000;
  const synodic = 29.53058867;
  const phase = ((daysSince % synodic) + synodic) % synodic;
  const idx = Math.floor((phase / synodic) * 8) % 8;
  return MOON_PHASES[idx];
}

function zodiacOfDay(target: Date): (typeof ZODIACS)[number] {
  const token = (target.getMonth() + 1) * 100 + target.getDate();
  for (const z of ZODIACS) {
    const [from, to] = z.range;
    if (from <= to ? token >= from && token <= to : token >= from || token <= to) return z;
  }
  return ZODIACS[0];
}

export function horoscope(target: Date): HoroscopeCard {
  const moon = moonPhase(target);
  const z = zodiacOfDay(target);
  return {
    headline: `${moon.emoji} ${moon.label} · clients ${z.sign} ${z.emoji}`,
    body: `${moon.vibe} Les ${z.sign} ${z.trait} : ${z.tip}`,
    roadblock: moon.label === "Pleine Lune"
  };
}

export function nutellaIndex(target: Date): NutellaIndex {
  const weekday = target.getDay();
  const level = weekday === 0 ? "deal" : weekday === 3 ? "shortage" : "neutral";
  const note =
    level === "deal"
      ? "Leclerc Cormeilles — promo Nutella probable le dimanche. Décale le réappro à lundi."
      : level === "shortage"
        ? "Signaux de rupture pâte à tartiner. Privilégie confiture maison."
        : "Tarifs toppings stables.";
  return { level, note };
}

export function socialSentiment(buzz?: number): SocialSignal {
  const spikePct = Math.round((buzz ?? 0) * 100);
  const note =
    spikePct >= 20
      ? `#QuaiDeSeine en hausse (+${spikePct}%). Prévois +20% d'affluence influenceurs.`
      : spikePct > 0
        ? `Légère hausse sociale (+${spikePct}%).`
        : "Pas de signal viral détecté.";
  return { spikePct, hashtag: "#QuaiDeSeine", note };
}

export function competitorProxy(status?: "quiet" | "typical" | "busier"): CompetitorSignal {
  const s = status ?? "typical";
  const note =
    s === "busier"
      ? "Alerte : prépare de la pâte en plus. Le café voisin est « plus fréquenté que d'habitude »."
      : s === "quiet"
        ? "Zone calme. Fenêtre idéale pour recalibrer la vitrine."
        : "Fréquentation concurrente normale.";
  return { status: s, note };
}

export function buildRecommendation(inputs: EngineInputs, pivot: PivotResult, cardigan: CardiganResult, bribe: BribeResult): Recommendation {
  const bumps: number[] = [];
  const rationale: string[] = [];

  const precip = inputs.weather.precipProbPct;
  if (precip < 20) {
    bumps.push(15);
    rationale.push("Pluie < 20 % → +15 % volume.");
  } else if (precip > 60) {
    bumps.push(-25);
    rationale.push("Pluie > 60 % → −25 % volume.");
  }

  for (const ev of inputs.localEvents) {
    if (ev.distanceKm <= 1.5) {
      bumps.push(ev.expectedBump);
      rationale.push(`${ev.title} (${ev.distanceKm} km) → +${ev.expectedBump} %.`);
    }
  }

  if (cardigan.level === "red") {
    bumps.push(10);
    rationale.push("Cardigan rouge → +10 % (mamies en chasse).");
  }

  rationale.push("Fenêtre 16:00–17:30 : crêpe sucre format enfant en tête de gondole.");

  const batterVolumePct = Math.max(60, Math.min(220, 100 + bumps.reduce((a, b) => a + b, 0)));

  const topping =
    pivot.heatAlert
      ? "Sorbet citron + limonade maison"
      : pivot.mode === "glace"
        ? "Glace vanille-pistache"
        : cardigan.level === "red"
          ? "Chocolat chaud + crêpe beurre-sucre"
          : "Nutella-banane";

  const staffing: Recommendation["staffing"] =
    batterVolumePct >= 150 ? "all-hands" : batterVolumePct >= 110 ? "two-hands" : "solo";

  const headline = `${Math.round(batterVolumePct)} % pâte · ${topping} · Mode ${pivot.mode === "glace" ? "Glace" : "Crêpe"}`;

  return { headline, batterVolumePct, topping, staffing, rationale };
}

export function daylightMinutesLeft(now: Date, sunsetISO: string): number {
  const sunset = new Date(sunsetISO).getTime();
  return Math.max(0, Math.round((sunset - now.getTime()) / 60000));
}
