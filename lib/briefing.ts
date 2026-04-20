import {
  buildPulses,
  buildRecommendation,
  competitorProxy,
  computeBribeOMeter,
  computeCardigan,
  computeDrinkStock,
  computePivot,
  computeTerrasse,
  horoscope,
  LOCATION,
  lycraCoefficient,
  napkinForecast,
  nutellaIndex,
  poussetteFactor,
  socialSentiment
} from "./engine";
import { fetchExternals } from "./externals";
import { fetchSeineLevel } from "./hubeau";
import { fetchPollen } from "./pollen";
import {
  formatWorkingDayLabel,
  nextWorkingDays,
  resolveNextWorkingDay,
  SHIFT_END_HOUR,
  SHIFT_START_HOUR,
  WorkingDay
} from "./schedule";
import { fetchWeather } from "./weather";
import {
  Briefing,
  LocalEvent,
  SeineLevelView,
  SourceStatus,
  WeekBriefing,
  WeekBriefingDay
} from "./types";

function seineView(heightM: number, timestamp: string): SeineLevelView {
  let mood: SeineLevelView["mood"] = "calme";
  let note = "Seine calme, quai praticable.";
  if (heightM >= 3 && heightM < 4) {
    mood = "surveillé";
    note = "Montée modérée — jette un œil au chemin de halage.";
  } else if (heightM >= 4) {
    mood = "haut";
    note = "Seine haute — accès quai réduit, prévois un plan B.";
  }
  return { heightM, mood, note, timestamp };
}

function shiftBounds(target: Date): { start: Date; end: Date } {
  const start = new Date(target);
  start.setHours(SHIFT_START_HOUR, 0, 0, 0);
  const end = new Date(target);
  end.setHours(SHIFT_END_HOUR, 0, 0, 0);
  return { start, end };
}

function affluenceScore(
  weather: { tempC: number; isSunny: boolean; precipProbPct: number; windKmh: number },
  topBump: number
): number {
  let weatherScore = 0;
  if (weather.isSunny && weather.tempC >= 22) weatherScore += 15;
  else if (weather.isSunny && weather.tempC >= 18) weatherScore += 8;
  if (weather.precipProbPct > 60) weatherScore -= 20;
  else if (weather.precipProbPct > 35) weatherScore -= 8;
  if (weather.windKmh > 30) weatherScore -= 5;
  return topBump + weatherScore;
}

function affluenceFrom(score: number): { tier: WeekBriefingDay["affluenceTier"]; label: string } {
  if (score >= 25) return { tier: "peak", label: "Pic d'affluence" };
  if (score >= 12) return { tier: "high", label: "Forte affluence" };
  if (score >= 0) return { tier: "steady", label: "Affluence stable" };
  return { tier: "quiet", label: "Quai calme" };
}

export async function buildBriefing(now: Date = new Date()): Promise<Briefing> {
  const workingDay = resolveNextWorkingDay(now);
  const target = workingDay.date;

  const [weatherBundle, externals, seine, pollenBundle] = await Promise.all([
    fetchWeather(target),
    fetchExternals(target),
    fetchSeineLevel(),
    fetchPollen(target)
  ]);

  const { weather, hourly, source: weatherSource } = weatherBundle;

  const cardigan = computeCardigan(weather.tempC, weather.isSunny, weather.windKmh);
  const pivot = computePivot(weather.tempC, weather.isSunny);
  const bribe = computeBribeOMeter(target);
  const pulses = buildPulses(target);

  const recommendation = buildRecommendation(
    {
      weather,
      hourly,
      now: target,
      competitorBusiness: "typical",
      localEvents: externals.localEvents
    },
    pivot,
    cardigan,
    bribe
  );

  const terrasse = computeTerrasse(weather, pivot, externals.localEvents);
  const drinks = computeDrinkStock(weather, pivot, terrasse.expectedFillPct);

  const seineLevel = seine.level
    ? seineView(seine.level.heightM, seine.level.timestamp)
    : undefined;

  const sources: SourceStatus[] = [weatherSource, seine.source, pollenBundle.source, ...externals.sources];

  const { start, end } = shiftBounds(target);

  return {
    generatedAt: now.toISOString(),
    targetDate: target.toISOString(),
    targetKind: workingDay.kind,
    targetLabel: formatWorkingDayLabel(workingDay),
    targetHolidayName: workingDay.holidayName,
    shiftStartISO: start.toISOString(),
    shiftEndISO: end.toISOString(),
    location: {
      name: LOCATION.name,
      lat: LOCATION.lat,
      lon: LOCATION.lon,
      postalCodes: [...LOCATION.postalCodes]
    },
    mode: pivot.mode,
    weather,
    hourly,
    cardigan,
    pivot,
    bribe,
    pulses,
    events: externals.localEvents,
    horoscope: horoscope(target),
    napkinForecast: napkinForecast(pollenBundle.pollen.level),
    lycraCoefficient: lycraCoefficient(weather.tempC, weather.windKmh, weather.isSunny, weather.precipProbPct),
    poussetteFactor: poussetteFactor(target),
    nutellaIndex: nutellaIndex(target),
    socialSentiment: socialSentiment(),
    competitorProxy: competitorProxy(),
    recommendation,
    terrasse,
    drinks,
    seineLevel,
    pollen: pollenBundle.pollen,
    sources
  };
}

async function buildWorkingDaySummary(day: WorkingDay): Promise<WeekBriefingDay & { _sources: SourceStatus[] }> {
  const [weatherBundle, externals] = await Promise.all([
    fetchWeather(day.date),
    fetchExternals(day.date)
  ]);
  const { weather, source: weatherSource } = weatherBundle;
  const pivot = computePivot(weather.tempC, weather.isSunny);
  const cardigan = computeCardigan(weather.tempC, weather.isSunny, weather.windKmh);
  const terrasse = computeTerrasse(weather, pivot, externals.localEvents);
  const drinks = computeDrinkStock(weather, pivot, terrasse.expectedFillPct);
  const spotlight = buildRecommendation(
    {
      weather,
      hourly: weatherBundle.hourly,
      now: day.date,
      competitorBusiness: "typical",
      localEvents: externals.localEvents
    },
    pivot,
    cardigan,
    computeBribeOMeter(day.date)
  );
  const topEvent: LocalEvent | undefined = externals.localEvents
    .slice()
    .sort((a, b) => b.expectedBump - a.expectedBump)[0];
  const score = affluenceScore(weather, topEvent?.expectedBump ?? 0);
  const affluence = affluenceFrom(score);

  return {
    targetDate: day.date.toISOString(),
    targetKind: day.kind,
    targetLabel: formatWorkingDayLabel(day),
    targetHolidayName: day.holidayName,
    weather,
    mode: pivot.mode,
    affluenceTier: affluence.tier,
    affluenceLabel: affluence.label,
    topEvent: topEvent ? { title: topEvent.title, bump: topEvent.expectedBump } : undefined,
    terrasseFillPct: terrasse.expectedFillPct,
    drinksTier: drinks.tier,
    menuHero: spotlight.menuSpotlight.hero,
    batterVolumePct: spotlight.batterVolumePct,
    _sources: [weatherSource, ...externals.sources]
  };
}

export async function buildWeekBriefing(now: Date = new Date()): Promise<WeekBriefing> {
  const days = nextWorkingDays(now, 8);
  const summaries = await Promise.all(days.map(buildWorkingDaySummary));
  const seen = new Map<string, SourceStatus>();
  for (const s of summaries) {
    for (const src of s._sources) {
      if (!seen.has(src.id)) seen.set(src.id, src);
    }
  }
  return {
    generatedAt: now.toISOString(),
    days: summaries.map(({ _sources, ...rest }) => rest),
    sources: Array.from(seen.values())
  };
}
