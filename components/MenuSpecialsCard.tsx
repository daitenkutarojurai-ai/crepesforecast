import { Baby, ChefHat, IceCreamCone, Sparkles, Target } from "lucide-react";
import { Card, Chip } from "./Card";
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

export function MenuSpecialsCard({ briefing }: { briefing: Briefing }) {
  const { recommendation, horoscope, bribe, pivot, cardigan } = briefing;
  return (
    <Card title="Menu & Specials" subtitle={recommendation.headline} icon={ChefHat}>
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-seine-border bg-seine-bg/40 px-3 py-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-seine-muted">
            <Target className="h-3 w-3" />
            Topping vedette
          </div>
          <p className="mt-1 text-base font-semibold text-seine-ink">{recommendation.topping}</p>
          <p className="text-xs text-seine-muted">{pivot.description}</p>
        </div>

        <div className="rounded-xl border border-seine-border bg-seine-bg/40 px-3 py-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-seine-muted">
            <Baby className="h-3 w-3" />
            Fenêtre enfants
          </div>
          <p className="mt-1 text-base font-semibold text-seine-ink">16:00 – 17:30</p>
          <p className="text-xs text-seine-muted">{bribe.recommendation}</p>
        </div>

        <div
          className={`rounded-xl border px-3 py-3 ${
            horoscope.roadblock
              ? "border-[#f0d9ad] bg-[#fdf2de]"
              : "border-seine-border bg-seine-bg/40"
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-seine-muted">
            <Sparkles className="h-3 w-3" />
            Special céleste
          </div>
          <p className="mt-1 text-base font-semibold text-seine-ink">{horoscope.headline}</p>
          <p className="text-xs text-seine-muted">{horoscope.body}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
        <Chip tone="accent">
          <IceCreamCone className="h-3 w-3" />
          {Math.round(recommendation.batterVolumePct)} % pâte
        </Chip>
        <Chip tone={STAFFING_TONE[recommendation.staffing]}>
          {STAFFING_LABEL[recommendation.staffing]}
        </Chip>
        <Chip tone={cardigan.level === "red" ? "danger" : cardigan.level === "amber" ? "warn" : "ok"}>
          {cardigan.strategy}
        </Chip>
      </div>

      {recommendation.rationale.length ? (
        <ul className="mt-3 space-y-1 text-xs text-seine-muted">
          {recommendation.rationale.map((r, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-seine-accent" />
              <span>{r}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </Card>
  );
}
