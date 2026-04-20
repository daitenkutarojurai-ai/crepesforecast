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
  availableWorkingDays,
  formatWorkingDayLabel,
  resolveNextWorkingDay,
  SHIFT_END_HOUR,
  SHIFT_START_HOUR,
  WorkingDay
} from "./schedule";
import { fetchWeather } from "./weather";
import {
  AvailableDaysSummary,
  Briefing,
  SeineLevelView,
  SourceStatus
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

export function summarizeAvailableDays(now: Date = new Date()): AvailableDaysSummary {
  const avail = availableWorkingDays(now);
  const encode = (d: ReturnType<typeof availableWorkingDays>["saturday"]) =>
    d
      ? {
          date: d.date.toISOString(),
          kind: d.kind,
          label: formatWorkingDayLabel(d),
          holidayName: d.holidayName
        }
      : null;
  return {
    saturday: encode(avail.saturday),
    sunday: encode(avail.sunday),
    holiday: encode(avail.holiday)
  };
}

export async function buildBriefing(
  now: Date = new Date(),
  override?: WorkingDay
): Promise<Briefing> {
  const workingDay = override ?? resolveNextWorkingDay(now);
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

