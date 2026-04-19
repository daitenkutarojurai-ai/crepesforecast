import { CloudRain, Sun, ThermometerSun, Users, Wind } from "lucide-react";
import { Card, Chip, Stat } from "./Card";
import type { Briefing, HourlyPoint } from "@/lib/types";

export function WeatherCustomerCard({ briefing }: { briefing: Briefing }) {
  const { weather, hourly, pivot, bribe, poussetteFactor } = briefing;
  const window = hourly.filter((h) => {
    const d = new Date(h.time).getHours();
    return d >= 8 && d <= 21;
  });
  const minT = Math.min(...window.map((h) => h.tempC));
  const maxT = Math.max(...window.map((h) => h.tempC));

  return (
    <Card
      title="Météo & Clientèle"
      subtitle="Priorité 1"
      icon={ThermometerSun}
      tone="accent"
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Ressenti" value={`${Math.round(weather.feelsLikeC)}°`} />
        <Stat label="Vent" value={Math.round(weather.windKmh)} unit="km/h" />
        <Stat label="UV" value={weather.uvIndex.toFixed(1)} />
        <Stat label="Pluie" value={`${weather.precipProbPct}%`} />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
        <Chip tone="accent">
          <Sun className="h-3 w-3" />
          Lever {timeOf(weather.sunrise)}
        </Chip>
        <Chip tone="default">
          <Sun className="h-3 w-3 opacity-60" />
          Coucher {timeOf(weather.sunset)}
        </Chip>
        <Chip tone="default">
          <Wind className="h-3 w-3" />
          Min {Math.round(minT)}° · Max {Math.round(maxT)}°
        </Chip>
        {weather.precipProbPct > 40 ? (
          <Chip tone="warn">
            <CloudRain className="h-3 w-3" />
            Prévoir abri toile
          </Chip>
        ) : null}
      </div>

      <HourlyBars hourly={window} />

      <div className="mt-4 rounded-xl border border-seine-border bg-seine-bg/40 px-3 py-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-seine-ink">
          <Users className="h-4 w-4" />
          Clientèle attendue
        </div>
        <p className="mt-1 text-sm text-seine-ink">{pivot.description}</p>
        <ul className="mt-2 space-y-1 text-xs text-seine-muted">
          <li>• Grand-mères & petits-enfants : fenêtre sortie de messe vers 11:45.</li>
          <li>
            • Familles avec poussettes : {poussetteFactor.window} — densité{" "}
            {poussetteFactor.density === "high"
              ? "forte"
              : poussetteFactor.density === "medium"
                ? "moyenne"
                : "faible"}
            .
          </li>
          <li>
            • Format enfant : {timeOf(bribe.window.startISO)}–{timeOf(bribe.window.endISO)} à 2 €.
          </li>
        </ul>
      </div>
    </Card>
  );
}

function HourlyBars({ hourly }: { hourly: HourlyPoint[] }) {
  if (hourly.length === 0) return null;
  const min = Math.min(...hourly.map((h) => h.tempC));
  const max = Math.max(...hourly.map((h) => h.tempC));
  const span = Math.max(1, max - min);
  return (
    <div className="mt-4 flex items-end gap-1.5 overflow-x-auto">
      {hourly.map((h) => {
        const height = 20 + ((h.tempC - min) / span) * 50;
        const hour = new Date(h.time).getHours();
        const warm = h.tempC >= 18;
        return (
          <div key={h.time} className="flex flex-col items-center text-[10px] text-seine-muted">
            <span className="mb-1 font-mono text-seine-ink">{Math.round(h.tempC)}</span>
            <div
              className={`w-3 rounded-t-md ${warm ? "bg-seine-crepe" : "bg-seine-glace"}`}
              style={{ height: `${height}px` }}
              title={`${hour}h · ${Math.round(h.tempC)}°C · pluie ${h.precipProbPct}%`}
            />
            <span className="mt-1">{hour}h</span>
          </div>
        );
      })}
    </div>
  );
}

function timeOf(iso: string): string {
  return new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}
