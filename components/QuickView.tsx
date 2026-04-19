import { Baby, Bike, Sparkles, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, Chip } from "./Card";
import { ArcGauge, LinearGauge, PivotSlider } from "./Gauge";
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

function totalBump(briefing: Briefing): number {
  return briefing.events
    .filter((e) => e.distanceKm <= 1.5)
    .reduce((sum, e) => sum + e.expectedBump, 0);
}

function affluenceLabel(bump: number): { label: string; tone: "ok" | "warn" | "danger"; pct: number } {
  if (bump >= 40) return { label: "Très forte", tone: "danger", pct: 95 };
  if (bump >= 20) return { label: "Soutenue", tone: "warn", pct: 65 };
  return { label: "Normale", tone: "ok", pct: 35 };
}

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

export function QuickView({ briefing }: { briefing: Briefing }) {
  const { weather, pivot, cardigan, recommendation } = briefing;
  const bump = totalBump(briefing);
  const affluence = affluenceLabel(bump);
  const Icon = pickWeatherIcon(weather.cloudCoverPct, weather.precipProbPct);
  const sky = describeSky(weather.cloudCoverPct, weather.precipProbPct);
  const audiences = audienceTags(briefing);

  return (
    <Card title="Aperçu · Dimanche" subtitle="L'essentiel en un coup d'œil" icon={Sparkles} tone="accent">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-seine-border bg-gradient-to-b from-seine-header/40 to-transparent p-4 text-center">
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
              Affluence
            </div>
            <div className="mt-1 text-lg font-semibold text-seine-ink">
              {affluence.label}
            </div>
            <div className="text-xs text-seine-muted">
              {bump > 0 ? `+${bump} % d'événements proches` : "Pas d'événement majeur"}
            </div>
          </div>
          <LinearGauge
            value={affluence.pct}
            color={
              affluence.tone === "danger"
                ? "bg-seine-danger"
                : affluence.tone === "warn"
                  ? "bg-seine-warn"
                  : "bg-seine-ok"
            }
          />
          <div className="flex items-center justify-between text-[10px] text-seine-muted">
            <span>Calme</span>
            <span>Bondé</span>
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
