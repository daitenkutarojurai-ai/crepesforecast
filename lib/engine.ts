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

const HOROSCOPE_WEEKS: Array<{ headline: string; body: string; roadblock: boolean }> = [
  {
    headline: "Vénus en cocotte-minute · crêpes qui gonflent",
    body: "La pâte est d'humeur joyeuse. Un client va sûrement commander quatre Nutella-banane d'affilée. Résiste au fou rire.",
    roadblock: false
  },
  {
    headline: "Mercure en chantilly · les langues fondent",
    body: "Semaine bavarde : les mamies racontent leur vie. Pose trois chaises, distribue des stickers aux petits.",
    roadblock: false
  },
  {
    headline: "Mars en spatule · tout se fait vite",
    body: "Pré-plie 10 beurre-sucre avant 11h, sinon la file va déborder jusqu'au bac.",
    roadblock: true
  },
  {
    headline: "Jupiter à volonté · portefeuilles généreux",
    body: "Les pourboires pleuvent. Lève le menton, propose la grande formule avec chantilly.",
    roadblock: false
  },
  {
    headline: "Saturne grincheux · patience courte",
    body: "Un client va se plaindre du temps d'attente. Offre-lui un sucre en poudre supplémentaire, il fondra.",
    roadblock: true
  },
  {
    headline: "Soleil en caramel · flambage obligatoire",
    body: "Les enfants veulent du spectacle. Une crêpe Suzette par heure, même pour les grands.",
    roadblock: false
  },
  {
    headline: "Lune gourmande · poussettes en embuscade",
    body: "Prépare ton stock de formats enfants à 2 €. Fenêtre 16h–17h30 = dessert de dimanche.",
    roadblock: false
  },
  {
    headline: "Neptune en fraise · créativité débordante",
    body: "Un client proposera une combinaison louche (tapenade-banane ?). Teste si tu es d'humeur.",
    roadblock: false
  },
  {
    headline: "Pluton au piston · imprévu matériel",
    body: "Check la bonbonne, check la batterie du terminal. La caravane a ses humeurs aussi.",
    roadblock: true
  },
  {
    headline: "Vénus en boule vanille · nostalgie sucrée",
    body: "Les grands-parents commandent ce qu'ils mangeaient enfants. Mets le classique beurre-sucre en vedette.",
    roadblock: false
  },
  {
    headline: "Uranus en fouet · semaine imprévisible",
    body: "Soit pluie à 11h, soit foule à 15h. Garde une bâche et un sourire sous le coude.",
    roadblock: true
  },
  {
    headline: "Mercure en sirop d'érable · exotisme qui plaît",
    body: "Sors le sirop d'érable et les myrtilles. Ardoise « Glace en Seine goes Canada » à 5 €.",
    roadblock: false
  },
  {
    headline: "Trigone d'eau · soleil timide, chantilly forte",
    body: "Parfaite journée pour les crêpes chantilly-fraise. Double la commande de fraises Gariguettes.",
    roadblock: false
  }
];

function isoWeek(target: Date): number {
  const d = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth(), target.getUTCDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

export function horoscope(target: Date): HoroscopeCard {
  const week = isoWeek(target);
  const idx = (week + target.getUTCFullYear()) % HOROSCOPE_WEEKS.length;
  return HOROSCOPE_WEEKS[idx];
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
