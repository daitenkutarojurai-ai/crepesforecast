import { Bike, Droplets, Flower2, Leaf, TrendingUp } from "lucide-react";
import { Card } from "./Card";
import type { Briefing, SourceStatus } from "@/lib/types";

function vigicruesSource(sources: SourceStatus[]): SourceStatus | undefined {
  return sources.find((s) => s.id === "vigicrues");
}

export function Details({ briefing }: { briefing: Briefing }) {
  const { napkinForecast, lycraCoefficient, poussetteFactor, nutellaIndex, sources } = briefing;
  const vigi = vigicruesSource(sources);
  return (
    <section className="space-y-3">
      <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-seine-muted">
        Détails complémentaires
      </h2>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card title="Serviettes" icon={Leaf}>
          <p className="text-sm font-semibold capitalize text-seine-ink">
            Pollen {napkinForecast.risk === "low" ? "bas" : napkinForecast.risk === "moderate" ? "modéré" : "élevé"}
          </p>
          <p className="mt-1 text-sm text-seine-muted">{napkinForecast.recommendation}</p>
        </Card>

        <Card title="Coefficient Lycra" icon={Bike}>
          <p className="text-sm font-semibold text-seine-ink">
            Coefficient {lycraCoefficient.coefficient}
          </p>
          <p className="mt-1 text-sm text-seine-muted">{lycraCoefficient.note}</p>
        </Card>

        <Card title="Facteur Poussette" icon={Flower2}>
          <p className="text-sm font-semibold text-seine-ink">
            Densité{" "}
            {poussetteFactor.density === "high"
              ? "forte"
              : poussetteFactor.density === "medium"
                ? "moyenne"
                : "faible"}
            {" · "}
            {poussetteFactor.window}
          </p>
          <p className="mt-1 text-sm text-seine-muted">{poussetteFactor.note}</p>
        </Card>

        <Card title="Index Nutella" icon={TrendingUp}>
          <p className="text-sm font-semibold capitalize text-seine-ink">
            {nutellaIndex.level === "deal"
              ? "Promo probable"
              : nutellaIndex.level === "shortage"
                ? "Tension approvisionnement"
                : "Tarifs stables"}
          </p>
          <p className="mt-1 text-sm text-seine-muted">{nutellaIndex.note}</p>
        </Card>

        <Card title="Vigicrues · Seine" icon={Droplets}>
          <p className="text-sm font-semibold text-seine-ink">
            {vigi?.confidence === "live" ? "Relevé live" : "Valeur simulée"}
          </p>
          <p className="mt-1 text-sm text-seine-muted">
            {vigi?.note ?? "Station de référence La Frette / Herblay."}
          </p>
          <p className="mt-2 text-xs text-seine-muted">
            Un fort débit peut dévier les promeneurs vers le haut du quai —
            repositionne l'ardoise si besoin.
          </p>
        </Card>
      </div>
    </section>
  );
}
