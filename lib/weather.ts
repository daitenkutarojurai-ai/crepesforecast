import { HourlyPoint, WeatherNow, SourceStatus } from "./types";
import { LOCATION, daylightMinutesLeft } from "./engine";
import { toYmd } from "./time";

interface OpenMeteoResponse {
  hourly: {
    time: string[];
    temperature_2m: number[];
    apparent_temperature: number[];
    wind_speed_10m: number[];
    precipitation_probability: number[];
    uv_index: number[];
    cloud_cover: number[];
  };
  daily: {
    time: string[];
    sunrise: string[];
    sunset: string[];
  };
}

function endpointFor(target: Date): string {
  const ymd = toYmd(target);
  return (
    `https://api.open-meteo.com/v1/forecast?latitude=${LOCATION.lat}&longitude=${LOCATION.lon}` +
    "&hourly=temperature_2m,apparent_temperature,wind_speed_10m,precipitation_probability,uv_index,cloud_cover" +
    "&daily=sunrise,sunset" +
    "&timezone=Europe%2FParis" +
    `&start_date=${ymd}&end_date=${ymd}`
  );
}

export async function fetchWeather(target: Date): Promise<{
  weather: WeatherNow;
  hourly: HourlyPoint[];
  source: SourceStatus;
}> {
  try {
    const res = await fetch(endpointFor(target), { next: { revalidate: 1800 } });
    if (!res.ok) throw new Error(`Open-Meteo ${res.status}`);
    const data = (await res.json()) as OpenMeteoResponse;
    if (!data.daily?.sunrise?.length || !data.hourly?.time?.length) {
      throw new Error("Open-Meteo: empty payload");
    }
    const sunrise = new Date(data.daily.sunrise[0]).toISOString();
    const sunset = new Date(data.daily.sunset[0]).toISOString();

    const hourly: HourlyPoint[] = data.hourly.time.map((t, i) => ({
      time: new Date(t).toISOString(),
      tempC: data.hourly.temperature_2m[i],
      feelsLikeC: data.hourly.apparent_temperature[i],
      windKmh: data.hourly.wind_speed_10m[i],
      uvIndex: data.hourly.uv_index[i],
      precipProbPct: data.hourly.precipitation_probability[i],
      cloudCoverPct: data.hourly.cloud_cover[i]
    }));

    const middayIdx = pickMiddayIndex(hourly);
    const midday = hourly[middayIdx];
    const windowAvgRain = avg(hourly.slice(2, 20).map((h) => h.precipProbPct));

    const anchor = new Date(target);
    anchor.setHours(10, 0, 0, 0);

    const weather: WeatherNow = {
      tempC: midday.tempC,
      feelsLikeC: midday.feelsLikeC,
      windKmh: midday.windKmh,
      uvIndex: midday.uvIndex,
      cloudCoverPct: midday.cloudCoverPct,
      isSunny: midday.cloudCoverPct < 40,
      precipProbPct: Math.round(windowAvgRain),
      sunrise,
      sunset,
      daylightMinutesLeft: daylightMinutesLeft(anchor, sunset)
    };

    return {
      weather,
      hourly,
      source: {
        id: "open-meteo",
        label: "Open-Meteo (météo dimanche)",
        confidence: "live",
        fetchedAt: new Date().toISOString()
      }
    };
  } catch (err) {
    return {
      ...mockWeather(target),
      source: {
        id: "open-meteo",
        label: "Open-Meteo (météo dimanche)",
        confidence: "unavailable",
        note: err instanceof Error ? err.message : "Erreur réseau",
        fetchedAt: new Date().toISOString()
      }
    };
  }
}

function pickMiddayIndex(hourly: HourlyPoint[]): number {
  let best = 0;
  let bestDelta = Infinity;
  for (let i = 0; i < hourly.length; i++) {
    const d = new Date(hourly[i].time);
    const hour = d.getHours();
    const delta = Math.abs(hour - 13);
    if (delta < bestDelta) {
      bestDelta = delta;
      best = i;
    }
  }
  return best;
}

function avg(xs: number[]): number {
  if (xs.length === 0) return 0;
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

function mockWeather(target: Date): { weather: WeatherNow; hourly: HourlyPoint[] } {
  const sunrise = new Date(target);
  sunrise.setHours(7, 10, 0, 0);
  const sunset = new Date(target);
  sunset.setHours(20, 45, 0, 0);
  const anchor = new Date(target);
  anchor.setHours(10, 0, 0, 0);

  const hourly: HourlyPoint[] = Array.from({ length: 24 }, (_, i) => {
    const t = new Date(target);
    t.setHours(i, 0, 0, 0);
    const dayCurve = Math.sin(((i - 6) / 12) * Math.PI);
    return {
      time: t.toISOString(),
      tempC: Math.round((10 + dayCurve * 6) * 10) / 10,
      feelsLikeC: Math.round((8 + dayCurve * 6) * 10) / 10,
      windKmh: 8 + (i % 5),
      uvIndex: Math.max(0, Math.round(dayCurve * 4 * 10) / 10),
      precipProbPct: 15 + ((i * 7) % 30),
      cloudCoverPct: 30 + ((i * 11) % 40)
    };
  });

  const weather: WeatherNow = {
    tempC: 14,
    feelsLikeC: 12,
    windKmh: 9,
    uvIndex: 3,
    cloudCoverPct: 35,
    isSunny: true,
    precipProbPct: 20,
    sunrise: sunrise.toISOString(),
    sunset: sunset.toISOString(),
    daylightMinutesLeft: daylightMinutesLeft(anchor, sunset.toISOString())
  };
  return { weather, hourly };
}
