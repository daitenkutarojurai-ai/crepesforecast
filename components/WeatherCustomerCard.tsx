import { Baby, Bike, CloudRain, Sun, ThermometerSun, Users, Wind } from "lucide-react";
import { Card, Chip, Stat } from "./Card";
import { TempSparkline } from "./Sparkline";
import { describeSky, pickWeatherIcon } from "@/lib/weather-icon";
import type { Briefing } from "@/lib/types";

export function WeatherCustomerCard({ briefing }: { briefing: Briefing }) {
  const { weather, hourly, pivot, bribe, poussetteFactor, lycraCoefficient } = briefing;
  const window = hourly.filter((h) => {
    const d = new Date(h.time).getHours();
    return d >= 8 && d <= 21;
  });
  const minT = Math.min(...window.map((h) => h.tempC));
  const maxT = Math.max(...window.map((h) => h.tempC));
  const Icon = pickWeatherIcon(weather.cloudCoverPct, weather.precipProbPct);
  const sky = describeSky(weather.cloudCoverPct, weather.precipProbPct);

  return (
    <Card title="Météo & Clientèle" subtitle="Priorité 1" icon={ThermometerSun} tone="accent">
      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-seine-border bg-gradient-to-r from-seine-header/40 via-seine-bg/30 to-transparent px-4 py-3">
        <Icon className="h-12 w-12 text-seine-accent" strokeWidth={1.5} />
        <div className="flex flex-col">
          <span className="font-mono text-3xl font-semibold text-seine-ink">
            {Math.round(weather.tempC)}°C
          </span>
          <span className="text-xs text-seine-muted">
            {sky} · ressenti {Math.round(weather.feelsLikeC)}°
          </span>
        </div>
        <div className="ml-auto flex flex-wrap gap-2 text-xs">
          <Chip tone="accent">
            <Sun className="h-3 w-3" /> Lever {timeOf(weather.sunrise)}
          </Chip>
          <Chip tone="default">
            <Sun className="h-3 w-3 opacity-60" /> Coucher {timeOf(weather.sunset)}
          </Chip>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Vent" value={Math.round(weather.windKmh)} unit="km/h" />
        <Stat label="UV" value={weather.uvIndex.toFixed(1)} />
        <Stat label="Pluie" value={`${weather.precipProbPct}%`} />
        <Stat label="Min / Max" value={`${Math.round(minT)}° / ${Math.round(maxT)}°`} />
      </div>

      {weather.precipProbPct > 40 ? (
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-[#f0d9ad] bg-[#fdf2de] px-3 py-2 text-xs text-[#7a4b10]">
          <CloudRain className="h-4 w-4" />
          <span>Risque de pluie {weather.precipProbPct}% — prévoir l'abri toile.</span>
        </div>
      ) : null}

      <div className="mt-4 rounded-2xl border border-seine-border bg-seine-bg/30 px-3 py-3">
        <div className="mb-1 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.12em] text-seine-muted">
          <span>Courbe horaire (8h → 21h)</span>
          <span className="font-mono normal-case text-seine-ink">{Math.round(weather.tempC)}°</span>
        </div>
        <TempSparkline points={window} />
      </div>

      <div className="mt-4 rounded-2xl border border-seine-border bg-gradient-to-br from-seine-chip/40 to-seine-bg/30 px-4 py-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-seine-muted">
          <Users className="h-3.5 w-3.5" />
          Clientèle attendue
        </div>
        <p className="mt-1 text-base font-semibold text-seine-ink">
          {pivot.mode === "glace"
            ? "Promeneurs gourmands & familles glace"
            : "Grand-mères & petits-enfants en sortie"}
        </p>
        <p className="text-xs text-seine-muted">{pivot.description}</p>

        <ul className="mt-3 grid gap-2 sm:grid-cols-3">
          <AudienceCard
            icon={Users}
            title="Sortie de messe"
            sub="Vers 11:45 — Saint-Nicolas"
          />
          <AudienceCard
            icon={Baby}
            title="Familles & poussettes"
            sub={`${poussetteFactor.window} · densité ${
              poussetteFactor.density === "high" ? "forte" : poussetteFactor.density === "medium" ? "moyenne" : "faible"
            }`}
          />
          <AudienceCard
            icon={Bike}
            title="Cyclistes EuroVelo 3"
            sub={`Coefficient ${lycraCoefficient.coefficient}`}
          />
        </ul>

        <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-seine-chip bg-seine-chip/60 px-3 py-1 text-xs font-semibold text-seine-chipInk">
          <Wind className="h-3 w-3" />
          Format enfant {timeOf(bribe.window.startISO)}–{timeOf(bribe.window.endISO)} à 2 €
        </div>
      </div>
    </Card>
  );
}

function AudienceCard({
  icon: Icon,
  title,
  sub
}: {
  icon: typeof Users;
  title: string;
  sub: string;
}) {
  return (
    <li className="flex items-start gap-2 rounded-xl border border-seine-border bg-seine-card px-2.5 py-2">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-seine-header text-seine-headerInk">
        <Icon className="h-4 w-4" />
      </span>
      <div className="leading-tight">
        <div className="text-xs font-semibold text-seine-ink">{title}</div>
        <div className="text-[11px] text-seine-muted">{sub}</div>
      </div>
    </li>
  );
}

function timeOf(iso: string): string {
  return new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}
