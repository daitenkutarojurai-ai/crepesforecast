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
  let strategy = "Standard cadence. Volume + speed.";
  let hint = "Run the normal Sunday deck.";
  if (value > 15) {
    level = "red";
    strategy = "Quality over Speed.";
    hint = "Check organic labels. Grand-Mère is watching.";
  } else if (value > 8) {
    level = "amber";
    strategy = "Balanced: presentation matters.";
    hint = "Wipe the counter between orders.";
  }
  return { value, level, strategy, hint };
}

export function computePivot(tempC: number, isSunny: boolean): PivotResult {
  const sFactor = isSunny ? 3 : 0;
  const value = Math.round((((tempC + sFactor) - 21) / 5) * 100) / 100;
  const mode = value < 0 ? "crepe" : "glace";
  const heatAlert = value > 2;
  const description = heatAlert
    ? "Extreme Heat Drink Alert — push cold drinks and sorbets."
    : mode === "crepe"
      ? "Crepe Mode — warm dough, hot chocolate, Nutella front and center."
      : "Ice Cream Mode — glace display lit, sorbets forward.";
  return { value, mode, heatAlert, description };
}

export function computeBribeOMeter(now: Date): BribeResult {
  const value =
    Math.round(((DIST_FROM_PARKING_M / AVG_CHILD_AGE_YEARS) * FATIGUE_CONSTANT) * 10) / 10;
  const start = new Date(now);
  start.setHours(16, 0, 0, 0);
  const end = new Date(now);
  end.setHours(17, 30, 0, 0);
  const active = now >= start && now <= end;
  return {
    value,
    active,
    window: { startISO: start.toISOString(), endISO: end.toISOString() },
    recommendation: active
      ? "Kid-Size Sugar Crepe: push the €2 format, pre-fold 10."
      : "Pre-position the kid-size menu card for the 16:00 window."
  };
}

const PULSE_SCHEDULE: Array<Omit<Pulse, "minutesFromNow" | "timeISO"> & { hhmm: [number, number] }> = [
  { id: "ferry-10", kind: "ferry", label: "Bac Traversier — matinée", note: "Human Funnel Landing Imminent.", severity: "watch", hhmm: [10, 0] },
  { id: "church-1145", kind: "church", label: "Amen Rush — Saint-Nicolas", note: "Mass exit. Check for baptisms/communions — double whipped cream.", severity: "high", hhmm: [11, 45] },
  { id: "ferry-1230", kind: "ferry", label: "Bac Traversier — midi", note: "Human Funnel Landing Imminent.", severity: "watch", hhmm: [12, 30] },
  { id: "ferry-14", kind: "ferry", label: "Bac Traversier — après-midi", note: "Human Funnel Landing Imminent.", severity: "watch", hhmm: [14, 0] },
  { id: "theater-1630", kind: "theater", label: "Le Petit Théâtre — entracte", note: "High-speed preparation. Pre-fold 12 crepes.", severity: "high", hhmm: [16, 30] },
  { id: "ferry-18", kind: "ferry", label: "Bac Traversier — soir", note: "Human Funnel Landing Imminent.", severity: "watch", hhmm: [18, 0] }
];

export function buildPulses(now: Date, sncfDelayMin = 0): Pulse[] {
  const pulses: Pulse[] = PULSE_SCHEDULE.map((p) => {
    const t = new Date(now);
    t.setHours(p.hhmm[0], p.hhmm[1], 0, 0);
    const minutes = Math.round((t.getTime() - now.getTime()) / 60000);
    return {
      id: p.id,
      kind: p.kind,
      label: p.label,
      note: p.note,
      severity: p.severity,
      timeISO: t.toISOString(),
      minutesFromNow: minutes
    };
  });

  if (sncfDelayMin > 15) {
    const t = new Date(now.getTime() + 10 * 60000);
    pulses.push({
      id: "sncf-captive",
      kind: "sncf",
      label: `SNCF Ligne J — retard ${sncfDelayMin} min`,
      note: "Captive Audience Marketing — unfold the €3 board toward the station.",
      severity: "high",
      timeISO: t.toISOString(),
      minutesFromNow: 10
    });
  }

  return pulses.sort((a, b) => a.minutesFromNow - b.minutesFromNow);
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

export function poussetteFactor(now: Date): PoussetteForecast {
  const month = now.getMonth();
  const isSeason = month === 2 || month === 3 || month === 4;
  const hour = now.getHours();
  const inWindow = hour >= 15 && hour < 17;
  const density: PoussetteForecast["density"] = isSeason && inWindow ? "high" : isSeason ? "medium" : "low";
  return {
    density,
    window: "15:00 – 17:00",
    note: density === "high"
      ? "Période cerisiers/Pâques. Laisse 1,5 m devant le comptoir pour les poussettes."
      : density === "medium"
        ? "Densité moyenne. Garde l'allée dégagée."
        : "Trafic familial faible."
  };
}

export function horoscope(now: Date): HoroscopeCard {
  const day = now.getUTCDate() + now.getUTCMonth();
  const roadblock = day % 4 === 0;
  return roadblock
    ? {
        headline: "Saturn's Roadblock — Aries & Taurus indécis",
        body: "Mars / Saturne en bras de fer. Propose un combo imposé : 'La Décision' — crepe beurre-sucre + jus pomme à 5 €.",
        roadblock: true
      }
    : {
        headline: "Ciel dégagé — Vénus en Gémeaux",
        body: "Trigone favorable aux gourmandises partagées. Pousse la formule duo.",
        roadblock: false
      };
}

export function nutellaIndex(now: Date): NutellaIndex {
  const weekday = now.getDay();
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
      ? `#QuaiDeSeine en hausse (+${spikePct}%). Attends +20% d'affluence 'influenceurs'.`
      : spikePct > 0
        ? `Légère hausse sociale (+${spikePct}%).`
        : "Pas de signal viral détecté.";
  return { spikePct, hashtag: "#QuaiDeSeine", note };
}

export function competitorProxy(status?: "quiet" | "typical" | "busier"): CompetitorSignal {
  const s = status ?? "typical";
  const note =
    s === "busier"
      ? "High Alert: Prep extra dough. Le café voisin est 'plus fréquenté que d'habitude'."
      : s === "quiet"
        ? "Zone calme. Probable fenêtre pour recalibrer la vitrine."
        : "Fréquentation concurrente normale.";
  return { status: s, note };
}

export function buildRecommendation(inputs: EngineInputs, pivot: PivotResult, cardigan: CardiganResult, bribe: BribeResult): Recommendation {
  const bumps: number[] = [];
  const rationale: string[] = [];

  const precip = inputs.weather.precipProbPct;
  if (precip < 20) {
    bumps.push(15);
    rationale.push("Pluie <20% → +15% volume.");
  } else if (precip > 60) {
    bumps.push(-25);
    rationale.push("Pluie >60% → -25% volume.");
  }

  for (const ev of inputs.localEvents) {
    if (ev.distanceKm <= 1.5) {
      bumps.push(ev.expectedBump);
      rationale.push(`${ev.title} (${ev.distanceKm} km) → +${ev.expectedBump}%.`);
    }
  }

  if (cardigan.level === "red") {
    bumps.push(10);
    rationale.push("Cardigan rouge → +10% (mamies en chasse).");
  }

  if (bribe.active) {
    rationale.push("Fenêtre 16:00–17:30 active : kid-size sugar crepe en tête de gondole.");
  }

  const batterVolumePct = Math.max(60, Math.min(220, 100 + bumps.reduce((a, b) => a + b, 0)));

  const topping =
    pivot.heatAlert
      ? "Sorbet citron + limonade maison"
      : pivot.mode === "glace"
        ? "Glace vanille-pistache"
        : cardigan.level === "red"
          ? "Chocolat chaud + crepe beurre-sucre"
          : "Nutella-banane";

  const staffing: Recommendation["staffing"] =
    batterVolumePct >= 150 ? "all-hands" : batterVolumePct >= 110 ? "two-hands" : "solo";

  const headline = `${Math.round(batterVolumePct)}% pâte · ${topping} · ${pivot.mode === "glace" ? "Glace" : "Crepe"} mode`;

  return { headline, batterVolumePct, topping, staffing, rationale };
}

export function daylightMinutesLeft(now: Date, sunsetISO: string): number {
  const sunset = new Date(sunsetISO).getTime();
  return Math.max(0, Math.round((sunset - now.getTime()) / 60000));
}
