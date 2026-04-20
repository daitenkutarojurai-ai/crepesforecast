import { Armchair, Baby, Bike, CupSoda } from "lucide-react";
import { Card, Chip } from "./Card";
import { LinearGauge } from "./Gauge";
import type { Briefing, DrinkStock } from "@/lib/types";

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

const DRINK_TIER_LABEL: Record<DrinkStock["tier"], string> = {
  base: "Charge standard",
  renforcé: "Charge renforcée",
  canicule: "Mode canicule"
};

const DRINK_TIER_TONE: Record<DrinkStock["tier"], "default" | "ok" | "warn" | "danger"> = {
  base: "default",
  renforcé: "warn",
  canicule: "danger"
};

export function Details({ briefing }: { briefing: Briefing }) {
  const { lycraCoefficient, poussetteFactor, terrasse, drinks } = briefing;
  const lycraPct = Math.min(100, (lycraCoefficient.coefficient / 15) * 100);
  const tablesLit = Math.round((terrasse.expectedFillPct / 100) * terrasse.tables);

  return (
    <section className="space-y-3">
      <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-seine-muted">
        Détails dérivés de la météo & du calendrier
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card title="Terrasse · 6 tables" subtitle="Occupation prévue" icon={Armchair} tone="sage">
          <p className="text-sm font-semibold text-seine-ink">
            {tablesLit}/{terrasse.tables} tables · pic {terrasse.peakWindow}
          </p>
          <div className="mt-2">
            <LinearGauge
              value={terrasse.expectedFillPct}
              color={
                terrasse.expectedFillPct >= 85
                  ? "bg-seine-danger"
                  : terrasse.expectedFillPct >= 60
                    ? "bg-seine-warn"
                    : "bg-seine-ok"
              }
              label="Remplissage"
              sublabel={`${terrasse.expectedFillPct}%`}
            />
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Chip>{terrasse.seats} assises</Chip>
            <Chip tone={terrasse.expectedFillPct >= 85 ? "danger" : terrasse.expectedFillPct >= 60 ? "warn" : "ok"}>
              {terrasse.expectedFillPct >= 85 ? "saturée" : terrasse.expectedFillPct >= 60 ? "soutenue" : "confortable"}
            </Chip>
          </div>
          <p className="mt-2 text-xs text-seine-muted">{terrasse.note}</p>
        </Card>

        <Card title="Stock boissons" subtitle="Rappel avant service" icon={CupSoda} tone="peach">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-seine-ink">{DRINK_TIER_LABEL[drinks.tier]}</p>
            <Chip tone={DRINK_TIER_TONE[drinks.tier]}>Charge {drinks.loadoutPct}%</Chip>
          </div>
          <ul className="mt-3 space-y-1.5">
            {drinks.priorities.map((p) => (
              <li
                key={p.label}
                className="flex items-center gap-2 rounded-xl bg-seine-bg/40 px-3 py-1.5 text-xs"
              >
                <span aria-hidden className="text-base leading-none">{p.emoji}</span>
                <span className="flex-1 font-medium text-seine-ink">{p.label}</span>
                <span className="font-mono text-seine-muted">{p.units}</span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-seine-muted">{drinks.note}</p>
        </Card>

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
