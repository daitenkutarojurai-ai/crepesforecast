import { Baby, Bike, Clock, Sparkles, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, Chip } from "./Card";
import { ArcGauge, PivotSlider } from "./Gauge";
import { describeSky, pickWeatherIcon } from "@/lib/weather-icon";
import type { Briefing } from "@/lib/types";

const STAFFING_LABEL: Record<string, string> = {
  solo: "Solo OK",
  "two-hands": "Deux mains",
  "all-hands": "Renfort"
};

const STAFFING_TONE: Record<string, "ok" | "warn" | "danger"> = {
  solo: "ok",
  "two-hands": "warn",
  "all-hands": "danger"
};

const CARDIGAN_SEGMENTS = [
  { to: 8, color: "#4a8f5a" },
  { to: 15, color: "#c98a2a" },
  { to: 25, color: "#c04545" }
];

const CARDIGAN_LABEL: Record<string, string> = {
  green: "OK",
  amber: "Attention",
  red: "Rouge"
};

function audienceTags(briefing: Briefing): Array<{ label: string; icon: LucideIcon }> {
  const tags: Array<{ label: string; icon: LucideIcon }> = [];
  tags.push({ label: "Grand-mères & petits-enfants", icon: Users });
  if (briefing.poussetteFactor.density !== "low") {
    tags.push({ label: "Familles avec poussettes", icon: Baby });
  }
  if (briefing.lycraCoefficient.coefficient > 5) {
    tags.push({ label: "Cyclistes EuroVelo 3", icon: Bike });
  }
  return tags;
}

function daylightLabel(weather: Briefing["weather"]): string {
  const sunrise = timeOf(weather.sunrise);
  const sunset = timeOf(weather.sunset);
  const total = hoursBetween(weather.sunrise, weather.sunset);
  return `${sunrise} → ${sunset} · ${total}h de jour`;
}

export function QuickView({ briefing }: { briefing: Briefing }) {
  const { weather, pivot, cardigan, recommendation } = briefing;
  const Icon = pickWeatherIcon(weather.cloudCoverPct, weather.precipProbPct);
  const sky = describeSky(weather.cloudCoverPct, weather.precipProbPct);
  const audiences = audienceTags(briefing);

  return (
    <Card title="Aperçu · Dimanche" subtitle="L'essentiel en un coup d'œil" icon={Sparkles} tone="accent">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-seine-border bg-gradient-to-b from-seine-header/50 to-transparent p-4 text-center">
          <Icon className="h-10 w-10 text-seine-accent" strokeWidth={1.6} />
          <div className="font-mono text-3xl font-semibold text-seine-ink">
            {Math.round(weather.tempC)}°
          </div>
          <div className="text-xs text-seine-muted">
            {sky} · ressenti {Math.round(weather.feelsLikeC)}°
          </div>
        </div>

        <div className="flex flex-col justify-between gap-3 rounded-2xl border border-seine-border bg-seine-bg/40 p-4">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-seine-muted">
              Mode recommandé
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl">{pivot.mode === "glace" ? "🍦" : "🥞"}</span>
              <span className="text-lg font-semibold text-seine-ink">
                {pivot.mode === "glace" ? "Mode Glace" : "Mode Crêpe"}
              </span>
            </div>
            <div className="text-xs text-seine-muted">
              {pivot.heatAlert ? "Alerte chaleur — sorbets en avant" : `Pivot ${pivot.value.toFixed(1)}`}
            </div>
          </div>
          <PivotSlider value={pivot.value} />
        </div>

        <div className="rounded-2xl border border-seine-border bg-seine-bg/40 p-4">
          <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-seine-muted">
            Cardigan · Grand-Mère
          </div>
          <div className="mt-1 flex justify-center">
            <ArcGauge
              value={Math.max(0, cardigan.value)}
              min={0}
              max={25}
              segments={CARDIGAN_SEGMENTS}
              label={CARDIGAN_LABEL[cardigan.level]}
              sublabel={`Ct ${cardigan.value}`}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-seine-border bg-seine-bg/40 p-4">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-seine-muted">
              Jour & équipe
            </div>
            <div className="mt-1 flex items-center gap-2 text-lg font-semibold text-seine-ink">
              <Clock className="h-4 w-4 text-seine-accent" />
              {daylightLabel(weather)}
            </div>
            <div className="text-xs text-seine-muted">
              Pluie {weather.precipProbPct}% · vent {Math.round(weather.windKmh)} km/h
            </div>
          </div>
          <Chip tone={STAFFING_TONE[recommendation.staffing]}>
            <Users className="h-3 w-3" />
            {STAFFING_LABEL[recommendation.staffing]}
          </Chip>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl border border-seine-border bg-seine-bg/40 px-3 py-2.5 text-sm">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-seine-muted">
          Clientèle attendue
        </span>
        {audiences.map((a) => {
          const I = a.icon;
          return (
            <Chip key={a.label} tone="accent">
              <I className="h-3 w-3" /> {a.label}
            </Chip>
          );
        })}
      </div>
    </Card>
  );
}

function timeOf(iso: string): string {
  return new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

function hoursBetween(isoA: string, isoB: string): number {
  const diff = new Date(isoB).getTime() - new Date(isoA).getTime();
  return Math.round((diff / 3_600_000) * 10) / 10;
}
