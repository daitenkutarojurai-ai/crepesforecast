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
import { getExternalsStubs } from "./externals";
import { fetchWeather } from "./weather";
import { resolveTargetSunday } from "./time";
import { Briefing, SourceStatus } from "./types";

export async function buildBriefing(now: Date = new Date()): Promise<Briefing> {
  const target = resolveTargetSunday(now);

  const { weather, hourly, source: weatherSource } = await fetchWeather(target);
  const externals = getExternalsStubs(target);

  const cardigan = computeCardigan(weather.tempC, weather.isSunny, weather.windKmh);
  const pivot = computePivot(weather.tempC, weather.isSunny);
  const bribe = computeBribeOMeter(target);
  const pulses = buildPulses(target, externals.sncfDelayMin);

  const recommendation = buildRecommendation(
    {
      weather,
      hourly,
      now: target,
      pollenRisk: externals.pollenRisk,
      sncfDelayMin: externals.sncfDelayMin,
      cherryBlossomBuzz: externals.cherryBlossomBuzz,
      competitorBusiness: externals.competitorBusiness,
      localEvents: externals.localEvents
    },
    pivot,
    cardigan,
    bribe
  );

  // Only expose sources whose data actually drives something visible on the
  // dashboard right now — everything else is unused or hidden.
  const sources: SourceStatus[] = [weatherSource];

  return {
    generatedAt: now.toISOString(),
    targetDate: target.toISOString(),
    location: { name: LOCATION.name, lat: LOCATION.lat, lon: LOCATION.lon, postalCodes: [...LOCATION.postalCodes] },
    mode: pivot.mode,
    weather,
    hourly,
    cardigan,
    pivot,
    bribe,
    pulses,
    events: externals.localEvents,
    horoscope: horoscope(target),
    napkinForecast: napkinForecast(externals.pollenRisk),
    lycraCoefficient: lycraCoefficient(weather.tempC, weather.windKmh, weather.isSunny, weather.precipProbPct),
    poussetteFactor: poussetteFactor(target),
    nutellaIndex: nutellaIndex(target),
    socialSentiment: socialSentiment(externals.cherryBlossomBuzz),
    competitorProxy: competitorProxy(externals.competitorBusiness),
    recommendation,
    sources
  };
}
