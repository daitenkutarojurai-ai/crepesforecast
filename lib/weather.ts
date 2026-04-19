import { HourlyPoint, WeatherNow, SourceStatus } from "./types";
import { LOCATION, daylightMinutesLeft } from "./engine";

interface OpenMeteoResponse {
  current: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    wind_speed_10m: number;
    cloud_cover: number;
    precipitation_probability?: number;
    uv_index?: number;
  };
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
    sunrise: string[];
    sunset: string[];
  };
}

const ENDPOINT =
  `https://api.open-meteo.com/v1/forecast?latitude=${LOCATION.lat}&longitude=${LOCATION.lon}` +
  "&current=temperature_2m,apparent_temperature,wind_speed_10m,cloud_cover,precipitation_probability,uv_index" +
  "&hourly=temperature_2m,apparent_temperature,wind_speed_10m,precipitation_probability,uv_index,cloud_cover" +
  "&daily=sunrise,sunset&timezone=Europe%2FParis&forecast_days=1";

export async function fetchWeather(now: Date): Promise<{
  weather: WeatherNow;
  hourly: HourlyPoint[];
  source: SourceStatus;
}> {
  try {
    const res = await fetch(ENDPOINT, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error(`Open-Meteo ${res.status}`);
    const data = (await res.json()) as OpenMeteoResponse;
    const sunrise = new Date(data.daily.sunrise[0]).toISOString();
    const sunset = new Date(data.daily.sunset[0]).toISOString();
    const cloudCover = data.current.cloud_cover;
    const weather: WeatherNow = {
      tempC: data.current.temperature_2m,
      feelsLikeC: data.current.apparent_temperature,
      windKmh: data.current.wind_speed_10m,
      uvIndex: data.current.uv_index ?? 0,
      cloudCoverPct: cloudCover,
      isSunny: cloudCover < 40,
      precipProbPct: data.current.precipitation_probability ?? 0,
      sunrise,
      sunset,
      daylightMinutesLeft: daylightMinutesLeft(now, sunset)
    };
    const hourly: HourlyPoint[] = data.hourly.time.slice(0, 24).map((t, i) => ({
      time: new Date(t).toISOString(),
      tempC: data.hourly.temperature_2m[i],
      feelsLikeC: data.hourly.apparent_temperature[i],
      windKmh: data.hourly.wind_speed_10m[i],
      uvIndex: data.hourly.uv_index[i],
      precipProbPct: data.hourly.precipitation_probability[i],
      cloudCoverPct: data.hourly.cloud_cover[i]
    }));
    return {
      weather,
      hourly,
      source: {
        id: "open-meteo",
        label: "Open-Meteo (weather + UV + sunset)",
        confidence: "live",
        fetchedAt: new Date().toISOString()
      }
    };
  } catch (err) {
    return { ...mockWeather(now), source: {
      id: "open-meteo",
      label: "Open-Meteo (weather + UV + sunset)",
      confidence: "unavailable",
      note: err instanceof Error ? err.message : "Network error",
      fetchedAt: new Date().toISOString()
    } };
  }
}

function mockWeather(now: Date): { weather: WeatherNow; hourly: HourlyPoint[] } {
  const sunrise = new Date(now);
  sunrise.setHours(7, 10, 0, 0);
  const sunset = new Date(now);
  sunset.setHours(20, 45, 0, 0);
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
    daylightMinutesLeft: daylightMinutesLeft(now, sunset.toISOString())
  };
  const hourly: HourlyPoint[] = Array.from({ length: 24 }, (_, i) => {
    const t = new Date(now);
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
  return { weather, hourly };
}
