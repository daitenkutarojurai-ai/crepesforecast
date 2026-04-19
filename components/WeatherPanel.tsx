import { CloudRain, Sun, Sunrise, Sunset, ThermometerSun, Waves, Wind } from "lucide-react";
import { Panel, Stat } from "./Panel";
import type { HourlyPoint, WeatherNow } from "@/lib/types";

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

function formatDuration(min: number): string {
  if (min <= 0) return "—";
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h > 0 ? `${h} h ${m.toString().padStart(2, "0")}` : `${m} min`;
}

export function WeatherPanel({ weather, hourly }: { weather: WeatherNow; hourly: HourlyPoint[] }) {
  const chunk = hourly.slice(8, 22);
  const maxTemp = Math.max(...chunk.map((h) => h.tempC));
  const minTemp = Math.min(...chunk.map((h) => h.tempC));
  const range = Math.max(1, maxTemp - minTemp);

  return (
    <Panel
      title="Weather · Priorité 1"
      subtitle={`${weather.tempC.toFixed(1)}°C — ressenti ${weather.feelsLikeC.toFixed(1)}°C`}
      icon={<ThermometerSun className="h-4 w-4" />}
      tone="primary"
    >
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat label="Ressenti" value={weather.feelsLikeC.toFixed(1)} unit="°C" />
        <Stat
          label="Vent"
          value={Math.round(weather.windKmh)}
          unit="km/h"
          hint={<><Wind className="mr-1 inline h-3 w-3" />Quai</>}
        />
        <Stat label="UV" value={weather.uvIndex.toFixed(1)} hint={weather.uvIndex >= 6 ? "Crème solaire +" : "Standard"} />
        <Stat
          label="Pluie"
          value={weather.precipProbPct}
          unit="%"
          hint={<><CloudRain className="mr-1 inline h-3 w-3" />Prob.</>}
        />
      </div>

      <div className="mt-4 rounded-lg border border-mission-border/80 bg-mission-panel2 p-3">
        <div className="mb-2 flex items-center justify-between text-xs text-mission-muted">
          <span className="inline-flex items-center gap-1"><Sunrise className="h-3 w-3" /> {formatTime(weather.sunrise)}</span>
          <span>Heures ensoleillées restantes : <strong className="text-mission-ink">{formatDuration(weather.daylightMinutesLeft)}</strong></span>
          <span className="inline-flex items-center gap-1"><Sunset className="h-3 w-3" /> {formatTime(weather.sunset)}</span>
        </div>
        <div className="flex h-20 items-end gap-1">
          {chunk.map((h) => {
            const heightPct = 20 + ((h.tempC - minTemp) / range) * 70;
            const isWarm = h.tempC >= 18;
            return (
              <div key={h.time} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className={`w-full rounded-sm ${isWarm ? "bg-mission-crepe/70" : "bg-mission-glace/70"}`}
                  style={{ height: `${heightPct}%` }}
                  title={`${formatTime(h.time)} · ${h.tempC.toFixed(1)}°C · pluie ${h.precipProbPct}%`}
                />
                <span className="text-[9px] text-mission-muted">{new Date(h.time).getHours()}h</span>
              </div>
            );
          })}
        </div>
        <div className="mt-2 flex items-center justify-between text-[10px] text-mission-muted">
          <span className="inline-flex items-center gap-1"><Waves className="h-3 w-3" /> Min {minTemp.toFixed(1)}°C</span>
          <span className="inline-flex items-center gap-1"><Sun className="h-3 w-3" /> Max {maxTemp.toFixed(1)}°C</span>
        </div>
      </div>
    </Panel>
  );
}
