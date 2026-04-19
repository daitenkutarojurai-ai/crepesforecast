import { Gauge, Sparkles, Sun, ThermometerSun, Users } from "lucide-react";
import { Card, Chip, Stat } from "./Card";
import type { Briefing } from "@/lib/types";

const STAFFING_LABEL: Record<string, string> = {
  solo: "Solo OK",
  "two-hands": "Deux mains",
  "all-hands": "Renfort obligatoire"
};

const STAFFING_TONE: Record<string, "ok" | "warn" | "danger"> = {
  solo: "ok",
  "two-hands": "warn",
  "all-hands": "danger"
};

const MODE_LABEL: Record<string, string> = {
  crepe: "Crêpe",
  glace: "Glace"
};

function totalBump(briefing: Briefing): number {
  return briefing.events
    .filter((e) => e.distanceKm <= 1.5)
    .reduce((sum, e) => sum + e.expectedBump, 0);
}

function affluenceLabel(bump: number): { label: string; tone: "ok" | "warn" | "danger" } {
  if (bump >= 40) return { label: "Très forte", tone: "danger" };
  if (bump >= 20) return { label: "Soutenue", tone: "warn" };
  return { label: "Normale", tone: "ok" };
}

export function QuickView({ briefing }: { briefing: Briefing }) {
  const { weather, pivot, cardigan, recommendation } = briefing;
  const bump = totalBump(briefing);
  const affluence = affluenceLabel(bump);

  return (
    <Card
      title="Aperçu · Dimanche"
      subtitle="Ce qu'il faut savoir en 5 secondes"
      icon={Sparkles}
      tone="accent"
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Stat
          label="Ressenti"
          value={`${Math.round(weather.feelsLikeC)}°`}
          hint={weather.isSunny ? "Soleil" : "Nuageux"}
        />
        <Stat
          label="Mode"
          value={MODE_LABEL[pivot.mode]}
          hint={pivot.heatAlert ? "Alerte chaleur" : `Pivot ${pivot.value}`}
        />
        <Stat
          label="Cardigan"
          value={cardigan.level === "green" ? "OK" : cardigan.level === "amber" ? "Attention" : "Rouge"}
          hint={`Ct ${cardigan.value}`}
        />
        <Stat
          label="Pâte"
          value={`${Math.round(recommendation.batterVolumePct)} %`}
          hint={recommendation.topping}
        />
        <Stat
          label="Équipe"
          value={STAFFING_LABEL[recommendation.staffing]}
          hint={`Pluie ${weather.precipProbPct}%`}
        />
        <Stat
          label="Affluence"
          value={affluence.label}
          hint={bump > 0 ? `+${bump} % événements` : "Sans événement majeur"}
        />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
        <Chip tone="accent">
          <ThermometerSun className="h-3 w-3" />
          {Math.round(weather.tempC)}°C · vent {Math.round(weather.windKmh)} km/h
        </Chip>
        <Chip tone={STAFFING_TONE[recommendation.staffing]}>
          <Users className="h-3 w-3" />
          {STAFFING_LABEL[recommendation.staffing]}
        </Chip>
        <Chip tone="default">
          <Sun className="h-3 w-3" />
          Lever {timeOf(weather.sunrise)} · Coucher {timeOf(weather.sunset)}
        </Chip>
        <Chip tone={affluence.tone}>
          <Gauge className="h-3 w-3" />
          Affluence {affluence.label.toLowerCase()}
        </Chip>
      </div>
    </Card>
  );
}

function timeOf(iso: string): string {
  return new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}
