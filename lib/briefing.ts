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
import { fetchVigicrues, getExternalsStubs } from "./externals";
import { fetchWeather } from "./weather";
import { Briefing, SourceStatus } from "./types";

export async function buildBriefing(now: Date = new Date()): Promise<Briefing> {
  const [{ weather, hourly, source: weatherSource }, { flow, source: vigicruesSource }] = await Promise.all([
    fetchWeather(now),
    fetchVigicrues()
  ]);

  const externals = getExternalsStubs();

  const cardigan = computeCardigan(weather.tempC, weather.isSunny, weather.windKmh);
  const pivot = computePivot(weather.tempC, weather.isSunny);
  const bribe = computeBribeOMeter(now);
  const pulses = buildPulses(now, externals.sncfDelayMin);

  const recommendation = buildRecommendation(
    {
      weather,
      hourly,
      now,
      seineFlowCubicMS: flow,
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

  const sources: SourceStatus[] = [weatherSource, vigicruesSource, ...externals.sources];

  return {
    generatedAt: now.toISOString(),
    location: { name: LOCATION.name, lat: LOCATION.lat, lon: LOCATION.lon, postalCodes: [...LOCATION.postalCodes] },
    mode: pivot.mode,
    weather,
    hourly,
    cardigan,
    pivot,
    bribe,
    pulses,
    events: externals.localEvents,
    horoscope: horoscope(now),
    napkinForecast: napkinForecast(externals.pollenRisk),
    lycraCoefficient: lycraCoefficient(weather.tempC, weather.windKmh, weather.isSunny, weather.precipProbPct),
    poussetteFactor: poussetteFactor(now),
    nutellaIndex: nutellaIndex(now),
    socialSentiment: socialSentiment(externals.cherryBlossomBuzz),
    competitorProxy: competitorProxy(externals.competitorBusiness),
    recommendation,
    sources
  };
}
