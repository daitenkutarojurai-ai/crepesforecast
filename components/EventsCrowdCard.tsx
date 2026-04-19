import { Church, Clapperboard, Clock, Ship, Sparkles, Store, Train } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, Chip } from "./Card";
import type { Briefing, Pulse } from "@/lib/types";

const PULSE_ICON: Record<Pulse["kind"], LucideIcon> = {
  ferry: Ship,
  church: Church,
  theater: Clapperboard,
  sncf: Train,
  influencer: Sparkles,
  competitor: Store
};

const PULSE_TINT: Record<Pulse["kind"], string> = {
  ferry: "bg-[#dceff7] text-[#1a3a52]",
  church: "bg-[#f7e6cc] text-[#7a4b10]",
  theater: "bg-[#f7d5d5] text-[#7a2a2a]",
  sncf: "bg-[#e8e0f5] text-[#3d2a6e]",
  influencer: "bg-[#fdf2de] text-[#7a4b10]",
  competitor: "bg-[#f0e0d0] text-[#5a3a1a]"
};

export function EventsCrowdCard({ briefing }: { briefing: Briefing }) {
  const { pulses } = briefing;

  return (
    <Card title="Planning du dimanche" subtitle="Horaires locaux fixes" icon={Clock}>
      <p className="mb-3 text-xs text-seine-muted">
        Rythmes connus du quai (bac, messe, théâtre). Pas une source externe —
        à ajuster si la sœur a des infos plus fraîches.
      </p>
      <ul className="space-y-2">
        {pulses.map((p) => {
          const Icon = PULSE_ICON[p.kind];
          return (
            <li
              key={p.id}
              className="flex items-start gap-3 rounded-2xl border border-seine-border bg-seine-card px-3 py-2"
            >
              <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${PULSE_TINT[p.kind]}`}>
                <Icon className="h-4 w-4" />
              </span>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-sm font-semibold text-seine-ink">{timeOf(p.timeISO)}</span>
                  <span className="text-sm font-semibold text-seine-ink">{p.label}</span>
                  {p.severity === "high" ? (
                    <Chip tone="warn">Gros flux</Chip>
                  ) : (
                    <Chip tone="ok">Pulse</Chip>
                  )}
                </div>
                <p className="text-xs text-seine-muted">{p.note}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

function timeOf(iso: string): string {
  return new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}
