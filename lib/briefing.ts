import {
  buildPulses,
  buildRecommendation,
  competitorProxy,
  computeBribeOMeter,
  computeCardigan,
  computePivot,
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
import { resolveTargetSunday } from "./time";
import { fetchWeather } from "./weather";
import { Briefing, SeineLevelView, SourceStatus } from "./types";

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

export async function buildBriefing(now: Date = new Date()): Promise<Briefing> {
  const target = resolveTargetSunday(now);

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

  const seineLevel = seine.level
    ? seineView(seine.level.heightM, seine.level.timestamp)
    : undefined;

  const sources: SourceStatus[] = [weatherSource, seine.source, pollenBundle.source, ...externals.sources];

  return {
    generatedAt: now.toISOString(),
    targetDate: target.toISOString(),
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
    seineLevel,
    pollen: pollenBundle.pollen,
    sources
  };
}
