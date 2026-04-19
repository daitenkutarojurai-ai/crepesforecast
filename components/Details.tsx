import { Bike, Flower2, Leaf } from "lucide-react";
import { Card } from "./Card";
import { LinearGauge } from "./Gauge";
import type { Briefing } from "@/lib/types";

const POLLEN_LABEL: Record<"low" | "moderate" | "high", string> = {
  low: "bas",
  moderate: "modéré",
  high: "élevé"
};

const POLLEN_PCT: Record<"low" | "moderate" | "high", number> = {
  low: 25,
  moderate: 60,
  high: 92
};

const POLLEN_COLOR: Record<"low" | "moderate" | "high", string> = {
  low: "bg-seine-ok",
  moderate: "bg-seine-warn",
  high: "bg-seine-danger"
};

const POUSSETTE_PCT: Record<"low" | "medium" | "high", number> = {
  low: 25,
  medium: 60,
  high: 90
};

const POUSSETTE_LABEL: Record<"low" | "medium" | "high", string> = {
  low: "faible",
  medium: "moyenne",
  high: "forte"
};

export function Details({ briefing }: { briefing: Briefing }) {
  const { napkinForecast, lycraCoefficient, poussetteFactor } = briefing;
  const lycraPct = Math.min(100, (lycraCoefficient.coefficient / 15) * 100);

  return (
    <section className="space-y-3">
      <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-seine-muted">
        Détails complémentaires
      </h2>
      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Serviettes" icon={Leaf}>
          <p className="text-sm font-semibold capitalize text-seine-ink">
            Pollen {POLLEN_LABEL[napkinForecast.risk]}
          </p>
          <div className="mt-2">
            <LinearGauge
              value={POLLEN_PCT[napkinForecast.risk]}
              color={POLLEN_COLOR[napkinForecast.risk]}
              label="Risque"
              sublabel={POLLEN_LABEL[napkinForecast.risk]}
            />
          </div>
          <p className="mt-2 text-xs text-seine-muted">{napkinForecast.recommendation}</p>
        </Card>

        <Card title="Coefficient Lycra" icon={Bike}>
          <p className="text-sm font-semibold text-seine-ink">
            Indice {lycraCoefficient.coefficient}
          </p>
          <div className="mt-2">
            <LinearGauge
              value={lycraPct}
              color="bg-seine-accent"
              label="Cyclistes"
              sublabel={
                lycraCoefficient.coefficient > 10
                  ? "saturé"
                  : lycraCoefficient.coefficient > 5
                    ? "normal"
                    : "calme"
              }
            />
          </div>
          <p className="mt-2 text-xs text-seine-muted">{lycraCoefficient.note}</p>
        </Card>

        <Card title="Facteur Poussette" icon={Flower2}>
          <p className="text-sm font-semibold text-seine-ink">
            Densité {POUSSETTE_LABEL[poussetteFactor.density]} · {poussetteFactor.window}
          </p>
          <div className="mt-2">
            <LinearGauge
              value={POUSSETTE_PCT[poussetteFactor.density]}
              color={poussetteFactor.density === "high" ? "bg-seine-warn" : "bg-seine-ok"}
              label="Affluence familles"
              sublabel={POUSSETTE_LABEL[poussetteFactor.density]}
            />
          </div>
          <p className="mt-2 text-xs text-seine-muted">{poussetteFactor.note}</p>
        </Card>
      </div>
    </section>
  );
}
