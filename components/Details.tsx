import { Baby, Bike } from "lucide-react";
import { Card } from "./Card";
import { LinearGauge } from "./Gauge";
import type { Briefing } from "@/lib/types";

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
  const { lycraCoefficient, poussetteFactor } = briefing;
  const lycraPct = Math.min(100, (lycraCoefficient.coefficient / 15) * 100);

  return (
    <section className="space-y-3">
      <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-seine-muted">
        Détails dérivés de la météo & du calendrier
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card title="Coefficient Lycra" subtitle="Dérivé météo" icon={Bike} tone="rose">
          <p className="text-sm font-semibold text-seine-ink">Indice {lycraCoefficient.coefficient}</p>
          <div className="mt-2">
            <LinearGauge
              value={lycraPct}
              color="bg-seine-accent"
              label="Cyclistes attendus"
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

        <Card title="Facteur Poussette" subtitle="Saison & créneau" icon={Baby} tone="cream">
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
