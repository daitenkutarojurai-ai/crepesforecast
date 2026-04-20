import { SHIFT_END_HOUR, SHIFT_START_HOUR } from "./schedule";
import {
  BribeResult,
  CardiganResult,
  DrinkStock,
  EngineInputs,
  HoroscopeCard,
  LocalEvent,
  LycraForecast,
  MenuSpotlight,
  NapkinForecast,
  NutellaIndex,
  PivotResult,
  PoussetteForecast,
  Pulse,
  Recommendation,
  SocialSignal,
  CompetitorSignal,
  TerrasseCapacity
} from "./types";

export const LOCATION = {
  name: "55 Quai de Seine — Mairie de La Frette-sur-Seine",
  lat: 48.9745,
  lon: 2.1777,
  postalCodes: ["95530", "95240"]
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
  { id: "ferry-14", kind: "ferry", label: "Bac Traversier — ouverture", note: "Premier flux piétons à l'ouverture 14h.", severity: "watch", hhmm: [14, 0] },
  { id: "gouter-1530", kind: "church", label: "Goûter des familles", note: "Fenêtre gaufre Nutella / chocolat chaud. Pré-chauffe le gaufrier.", severity: "watch", hhmm: [15, 30] },
  { id: "theater-1630", kind: "theater", label: "Le Petit Théâtre — entracte", note: "Service ultra-rapide : pré-plie 12 crêpes.", severity: "high", hhmm: [16, 30] },
  { id: "apero-1730", kind: "competitor", label: "Promeneurs apéro quai", note: "Demande boissons et glaces à emporter : remonte la vitrine.", severity: "watch", hhmm: [17, 30] },
  { id: "ferry-18", kind: "ferry", label: "Bac Traversier — soir", note: "Dernière vague avant fermeture : garde 15 crêpes d'avance.", severity: "high", hhmm: [18, 0] }
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
  }).filter((p) => {
    const h = new Date(p.timeISO).getHours();
    return h >= SHIFT_START_HOUR && h < SHIFT_END_HOUR;
  });

  if (sncfDelayMin > 15) {
    const t = new Date(target);
    t.setHours(SHIFT_START_HOUR, 15, 0, 0);
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
  tips: string[];
}> = [
  { sign: "Capricorne", emoji: "♑", range: [1222, 119], trait: "négocient le prix et comptent leurs pièces", tips: [
    "sors ta formule à 5 € bien visible.",
    "affiche le prix à l'unité, ils comparent.",
    "propose un demi-tarif pour les enfants — ils craquent.",
    "garde la monnaie prête, ils paient en pièces."
  ] },
  { sign: "Verseau", emoji: "♒", range: [120, 218], trait: "veulent du jamais-vu — tapenade-banane ?", tips: [
    "prépare deux toppings déroutants.",
    "mets la crêpe salée du jour en ardoise.",
    "laisse une option « surprise du chef » sur la carte.",
    "ouvre la conversation, ils adorent raconter."
  ] },
  { sign: "Poissons", emoji: "♓", range: [219, 320], trait: "ont les yeux plus grands que le ventre", tips: [
    "propose le format enfant en porte de sortie.",
    "suggère de partager à deux, ils préfèrent.",
    "glisse la carte « à emporter » pour la fin.",
    "prévois des sacs kraft, ils repartent avec."
  ] },
  { sign: "Bélier", emoji: "♈", range: [321, 419], trait: "débarquent enthousiastes et veulent tout tester", tips: [
    "mets le combo découverte à 7 € en avant.",
    "sors la crêpe du jour première en vitrine.",
    "offre de goûter la nouveauté gratuite.",
    "propose le duo salé + sucré à 8 €."
  ] },
  { sign: "Taureau", emoji: "♉", range: [420, 520], trait: "reviennent pour leur beurre-sucre habituel", tips: [
    "offre la deuxième au 5e achat pour fidéliser.",
    "sors la crêpe beurre-sucre pré-pliée, ils la prennent d'office.",
    "prépare leur commande d'avance, ils aiment la régularité.",
    "garde leur café au chaud, habitude oblige."
  ] },
  { sign: "Gémeaux", emoji: "♊", range: [521, 620], trait: "commandent puis changent d'avis deux fois", tips: [
    "reste patiente, propose deux options max.",
    "limite la carte au chevalet, trop de choix les perd.",
    "propose le menu « au hasard » à 6 €.",
    "montre la vitrine directement, c'est plus rapide."
  ] },
  { sign: "Cancer", emoji: "♋", range: [621, 722], trait: "sont nostalgiques et veulent la recette d'antan", tips: [
    "pousse la crêpe beurre-sucre à l'ancienne.",
    "évoque la confiture maison, ça résonne.",
    "sors la gaufre de Liège façon Belgique.",
    "mentionne le cidre brut, ils prennent."
  ] },
  { sign: "Lion", emoji: "♌", range: [723, 822], trait: "veulent être vus et commandent la plus grosse", tips: [
    "monte la chantilly en spirale haute pour les stories.",
    "prépare la crêpe XL format photo Insta.",
    "glace 3 boules + copeaux or comestible (ok, paillettes sucre).",
    "laisse-les choisir en vitrine, ils adorent être regardés."
  ] },
  { sign: "Vierge", emoji: "♍", range: [823, 922], trait: "demandent la liste exacte des ingrédients", tips: [
    "affiche le panneau allergènes lisible.",
    "mets en avant le bio et l'origine des oeufs.",
    "prépare la fiche allergènes plastifiée.",
    "propose l'option sans gluten, ils apprécient."
  ] },
  { sign: "Balance", emoji: "♎", range: [923, 1022], trait: "arrivent en couple et partagent tout en deux", tips: [
    "propose la crêpe duo à 6 € avec deux fourchettes.",
    "glisse le menu « à partager » 12 € en ardoise.",
    "prépare deux petites cuillères avec la glace.",
    "offre une photo souvenir, ils la prendront."
  ] },
  { sign: "Scorpion", emoji: "♏", range: [1023, 1121], trait: "goûtent le piquant et le salé inattendu", tips: [
    "ressors la crêpe chèvre-miel-piment d'Espelette.",
    "glisse une option épicée sur l'ardoise.",
    "propose la gaufre salée fromage + lardons.",
    "mets la sauce relevée dans les propositions."
  ] },
  { sign: "Sagittaire", emoji: "♐", range: [1122, 1221], trait: "testent les combos bizarres sans broncher", tips: [
    "laisse-leur ton ardoise blanche à personnaliser.",
    "propose le mix improbable gaufre + sorbet citron.",
    "offre la crêpe « défi du jour » à 5 €.",
    "dis-leur « à toi de choisir » — ils foncent."
  ] }
];

function daySeed(target: Date): number {
  const ymd = `${target.getFullYear()}${target.getMonth() + 1}${target.getDate()}`;
  let h = 0;
  for (let i = 0; i < ymd.length; i++) h = (h * 31 + ymd.charCodeAt(i)) >>> 0;
  return h;
}

function pickFrom<T>(pool: readonly T[], target: Date, salt = 0): T {
  return pool[(daySeed(target) + salt) % pool.length];
}

function moonPhase(target: Date): { label: string; emoji: string; vibe: string } {
  const ref = Date.UTC(2000, 0, 6, 18, 14);
  const daysSince = (target.getTime() - ref) / 86400000;
  const synodic = 29.53058867;
  const phase = ((daysSince % synodic) + synodic) % synodic;
  const idx = Math.floor((phase / synodic) * 8) % 8;
  return MOON_PHASES[idx];
}

function zodiacOfDay(target: Date): (typeof ZODIACS)[number] {
  return pickFrom(ZODIACS, target, 7);
}

export function horoscope(target: Date): HoroscopeCard {
  const moon = moonPhase(target);
  const z = zodiacOfDay(target);
  const tip = pickFrom(z.tips, target);
  return {
    headline: `${moon.emoji} ${moon.label} · clients ${z.sign} ${z.emoji}`,
    body: `${moon.vibe} Les ${z.sign} ${z.trait} : ${tip}`,
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

const MENU_POOLS: {
  heat: MenuSpotlight[];
  glace: MenuSpotlight[];
  cold: MenuSpotlight[];
  rain: MenuSpotlight[];
  mild: MenuSpotlight[];
} = {
  heat: [
    { hero: "Sorbet citron maison + citronnade fraîche", heroCategory: "glace", combo: "Combo canicule : 2 boules + grand verre 6 €.", avoid: "Mets les gaufres en retrait par ≥ 25°." },
    { hero: "Sorbet fruits rouges + eau fraîche menthe", heroCategory: "glace", combo: "Formule anti-chaleur 2 boules + carafe menthée 6,50 €.", avoid: "Retire le chocolat chaud, il fond la crème." },
    { hero: "Sorbet mangue-passion + soda glaçons", heroCategory: "glace", combo: "Duo exotique : sorbet + soda 6 €.", avoid: "Pose les crêpes chaudes hors de vue." },
    { hero: "Granité citron + coupe glace vanille", heroCategory: "glace", combo: "Promo canicule : granité + coupe 7 €.", avoid: "Évite les toppings chauds aujourd'hui." }
  ],
  glace: [
    { hero: "Glace vanille-pistache + gaufre de Liège tiède", heroCategory: "glace", combo: "Gaufre + boule glace 5,50 € en tête de vitrine." },
    { hero: "Glace caramel fleur de sel + gaufre nature", heroCategory: "glace", combo: "Duo caramel : gaufre + 2 boules 6 €." },
    { hero: "Glace fraise-framboise + chantilly", heroCategory: "glace", combo: "Coupe « balade » 3 boules + chantilly 6 €." },
    { hero: "Glace chocolat noir + gaufre sucre glace", heroCategory: "glace", combo: "Combo cacao : gaufre + 2 boules choco 6 €." }
  ],
  cold: [
    { hero: "Crêpe beurre-sucre + chocolat chaud maison", heroCategory: "crepe", combo: "Formule Grand-Mère : crêpe + choc chaud 5 €.", avoid: "Range les glaces en vitrine arrière." },
    { hero: "Crêpe confiture + thé verveine chaud", heroCategory: "crepe", combo: "Pause douceur : crêpe + thé 5 €.", avoid: "Laisse les sorbets fermés." },
    { hero: "Crêpe caramel beurre salé + café gourmand", heroCategory: "crepe", combo: "Combo café : crêpe + expresso 4,50 €.", avoid: "Évite les boules glace en avant." },
    { hero: "Crêpe Nutella + lait chaud cannelle", heroCategory: "crepe", combo: "Formule cocooning : crêpe + lait chaud 5 €.", avoid: "Met les crêpes chaudes en ardoise." }
  ],
  rain: [
    { hero: "Gaufre Nutella + chocolat chaud", heroCategory: "gaufre", combo: "Abri + gaufre tiède : formule pluie 4,50 €." },
    { hero: "Gaufre beurre-sucre + café gourmand", heroCategory: "gaufre", combo: "Pause café : gaufre + expresso 4 €." },
    { hero: "Gaufre caramel + chocolat viennois", heroCategory: "gaufre", combo: "Formule douceur abritée : gaufre + choc 5 €." },
    { hero: "Gaufre Liège chaude + thé chaï", heroCategory: "gaufre", combo: "Duo réconfort : gaufre + thé 5 €." }
  ],
  mild: [
    { hero: "Crêpe Nutella-banane", heroCategory: "crepe", combo: "Duo crêpe + boisson fraîche 6 € en ardoise." },
    { hero: "Crêpe beurre-sucre citron", heroCategory: "crepe", combo: "Classique : crêpe + cidre brut 5,50 €." },
    { hero: "Crêpe caramel beurre salé", heroCategory: "crepe", combo: "Combo sucré : crêpe + boisson 6 €." },
    { hero: "Crêpe confiture fraise maison", heroCategory: "crepe", combo: "Formule printanière : crêpe + jus pomme 5,50 €." },
    { hero: "Crêpe pomme-cannelle flambée", heroCategory: "crepe", combo: "Douceur du jour : crêpe + café 5,50 €." },
    { hero: "Gaufre Liège vanille-sucre", heroCategory: "gaufre", combo: "Pause goûter : gaufre + jus maison 5 €." }
  ]
};

export function menuSpotlight(
  pivot: PivotResult,
  cardigan: CardiganResult,
  weather: EngineInputs["weather"],
  target: Date
): MenuSpotlight {
  if (pivot.heatAlert) return pickFrom(MENU_POOLS.heat, target);
  if (pivot.mode === "glace") return pickFrom(MENU_POOLS.glace, target);
  if (cardigan.level === "red") return pickFrom(MENU_POOLS.cold, target);
  if (weather.precipProbPct > 50) return pickFrom(MENU_POOLS.rain, target);
  return pickFrom(MENU_POOLS.mild, target);
}

export function computeTerrasse(
  weather: EngineInputs["weather"],
  pivot: PivotResult,
  events: LocalEvent[]
): TerrasseCapacity {
  const tables = 6;
  const seats = tables * 4;
  let fill = 40;
  if (weather.isSunny) fill += 25;
  if (weather.tempC >= 22) fill += 15;
  else if (weather.tempC >= 16) fill += 8;
  else if (weather.tempC < 10) fill -= 25;
  if (weather.precipProbPct > 60) fill -= 45;
  else if (weather.precipProbPct > 35) fill -= 20;
  if (weather.windKmh > 30) fill -= 10;
  if (pivot.heatAlert) fill -= 8;
  const nearbyBump = events
    .filter((e) => e.distanceKm <= 1.5)
    .reduce((a, e) => a + Math.min(e.expectedBump, 25), 0);
  fill += Math.min(nearbyBump * 0.6, 20);

  const expectedFillPct = Math.max(0, Math.min(100, Math.round(fill)));
  const peakWindow = pivot.mode === "glace" ? "15:30 – 18:00" : "16:00 – 18:30";
  const note =
    expectedFillPct >= 85
      ? `Terrasse saturée · pré-bus les tables ${tables}/${tables} dès 15:00.`
      : expectedFillPct >= 60
        ? `Rotation soutenue · ~${Math.round((expectedFillPct / 100) * tables)} tables sur ${tables} en simultané.`
        : expectedFillPct >= 30
          ? `Fréquentation douce · quelques tables libres, idéal pour familles.`
          : `Terrasse calme · prévois une carte "à emporter" en avant.`;

  return { tables, seats, expectedFillPct, peakWindow, note };
}

export function computeDrinkStock(
  weather: EngineInputs["weather"],
  pivot: PivotResult,
  terrasseFillPct: number
): DrinkStock {
  const heat = pivot.heatAlert || weather.tempC >= 25;
  const warm = !heat && (weather.tempC >= 20 || weather.uvIndex >= 6);
  const crowded = terrasseFillPct >= 70;

  const tier: DrinkStock["tier"] = heat ? "canicule" : warm || crowded ? "renforcé" : "base";
  const loadoutPct = tier === "canicule" ? 180 : tier === "renforcé" ? 130 : 100;

  const priorities: DrinkStock["priorities"] =
    tier === "canicule"
      ? [
          { emoji: "💧", label: "Eau plate 50 cl", units: "3 packs" },
          { emoji: "🍋", label: "Citronnade maison", units: "10 L" },
          { emoji: "🧊", label: "Sac de glaçons 5 kg", units: "2 sacs" },
          { emoji: "🥤", label: "Sodas (Orangina / Coca)", units: "2 packs" }
        ]
      : tier === "renforcé"
        ? [
            { emoji: "💧", label: "Eau plate 50 cl", units: "2 packs" },
            { emoji: "🍋", label: "Citronnade maison", units: "6 L" },
            { emoji: "🥤", label: "Sodas variés", units: "1,5 pack" },
            { emoji: "🧊", label: "Glaçons", units: "1 sac" }
          ]
        : pivot.mode === "crepe"
          ? [
              { emoji: "☕", label: "Café + chocolat chaud", units: "1,5x base" },
              { emoji: "🍵", label: "Thés (menthe, verveine)", units: "base" },
              { emoji: "💧", label: "Eau plate", units: "1 pack" },
              { emoji: "🧃", label: "Jus de pomme artisanal", units: "base" }
            ]
          : [
              { emoji: "💧", label: "Eau plate 50 cl", units: "1,5 pack" },
              { emoji: "🥤", label: "Sodas variés", units: "1 pack" },
              { emoji: "🍋", label: "Citronnade maison", units: "4 L" },
              { emoji: "☕", label: "Café glacé", units: "base" }
            ];

  const note =
    tier === "canicule"
      ? "Alerte chaleur : double le frais, eau fraîche offerte aux enfants, garde 2 bouteilles au congélo."
      : tier === "renforcé"
        ? "Temps doux + terrasse animée : pousse la citronnade et garde les sodas fraîches."
        : pivot.mode === "crepe"
          ? "Mode crêpe : boissons chaudes en avant, minimum vital côté frais."
          : "Charge standard : équilibre chaud/froid, vérifie le stock jus.";

  return { tier, loadoutPct, priorities, note };
}

export function buildRecommendation(
  inputs: EngineInputs,
  pivot: PivotResult,
  cardigan: CardiganResult,
  bribe: BribeResult
): Recommendation {
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
  rationale.push(`Service 14h–19h : cadence le pic sur ${pivot.mode === "glace" ? "15:30–18:00" : "16:00–18:30"}.`);

  const batterVolumePct = Math.max(60, Math.min(220, 100 + bumps.reduce((a, b) => a + b, 0)));

  const spotlight = menuSpotlight(pivot, cardigan, inputs.weather, inputs.now);

  const staffing: Recommendation["staffing"] =
    batterVolumePct >= 150 ? "all-hands" : batterVolumePct >= 110 ? "two-hands" : "solo";

  const headline = `${Math.round(batterVolumePct)} % pâte · ${spotlight.hero} · Mode ${pivot.mode === "glace" ? "Glace" : "Crêpe"}`;

  return {
    headline,
    batterVolumePct,
    topping: spotlight.hero,
    staffing,
    rationale,
    menuSpotlight: spotlight
  };
}

export function daylightMinutesLeft(now: Date, sunsetISO: string): number {
  const sunset = new Date(sunsetISO).getTime();
  return Math.max(0, Math.round((sunset - now.getTime()) / 60000));
}
