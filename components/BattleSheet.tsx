import { Flame, Megaphone, Snowflake, Target, Users } from "lucide-react";
import { Panel } from "./Panel";
import type { Briefing } from "@/lib/types";

const STAFFING_LABEL: Record<string, { label: string; color: string }> = {
  solo: { label: "Solo OK", color: "text-mission-ok" },
  "two-hands": { label: "Deux mains", color: "text-mission-warn" },
  "all-hands": { label: "Renfort obligatoire", color: "text-mission-danger" }
};

export function BattleSheet({ briefing }: { briefing: Briefing }) {
  const { recommendation, pivot, cardigan, bribe } = briefing;
  const staffing = STAFFING_LABEL[recommendation.staffing];

  return (
    <Panel
      title="Battle Sheet · Aujourd'hui"
      subtitle={recommendation.headline}
      icon={<Target className="h-4 w-4" />}
      tone="primary"
      footer={
        <div className="flex flex-wrap items-center gap-4">
          <span className={`inline-flex items-center gap-1 ${staffing.color}`}>
            <Users className="h-3 w-3" /> {staffing.label}
          </span>
          <span>
            Pivot thermique <strong className="font-mono text-mission-ink">{pivot.value}</strong> → {pivot.mode === "crepe" ? "Crepe" : "Glace"}
          </span>
          <span>
            Cardigan <strong className="font-mono text-mission-ink">{cardigan.value}</strong> → {cardigan.level.toUpperCase()}
          </span>
          <span>
            Bribe-O-Meter <strong className="font-mono text-mission-ink">{bribe.value}</strong> {bribe.active ? "· ACTIF" : ""}
          </span>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-mission-border/60 bg-mission-panel2 p-3">
          <div className="flex items-center gap-2 text-mission-accent">
            {pivot.mode === "glace" ? <Snowflake className="h-4 w-4" /> : <Flame className="h-4 w-4" />}
            <span className="text-xs uppercase tracking-[0.2em]">Mode</span>
          </div>
          <p className="mt-1 text-lg font-semibold">{pivot.mode === "glace" ? "Ice Cream" : "Crepe"}</p>
          <p className="text-xs text-mission-muted">{pivot.description}</p>
        </div>

        <div className="rounded-lg border border-mission-border/60 bg-mission-panel2 p-3">
          <div className="flex items-center gap-2 text-mission-accent">
            <Target className="h-4 w-4" />
            <span className="text-xs uppercase tracking-[0.2em]">Volume pâte</span>
          </div>
          <p className="mt-1 font-mono text-2xl font-semibold">{Math.round(recommendation.batterVolumePct)}%</p>
          <p className="text-xs text-mission-muted">Topping vedette : <strong>{recommendation.topping}</strong></p>
        </div>

        <div className="rounded-lg border border-mission-border/60 bg-mission-panel2 p-3">
          <div className="flex items-center gap-2 text-mission-accent">
            <Megaphone className="h-4 w-4" />
            <span className="text-xs uppercase tracking-[0.2em]">Stratégie</span>
          </div>
          <p className="mt-1 text-sm font-semibold">{cardigan.strategy}</p>
          <p className="text-xs text-mission-muted">{cardigan.hint}</p>
        </div>
      </div>

      <ul className="mt-4 space-y-1 text-xs text-mission-muted">
        {recommendation.rationale.map((r) => (
          <li key={r} className="flex items-start gap-2">
            <span className="mt-[6px] h-1 w-1 rounded-full bg-mission-accent" />
            {r}
          </li>
        ))}
        {recommendation.rationale.length === 0 ? <li>Aucun signal majeur : cadence standard.</li> : null}
      </ul>
    </Panel>
  );
}
