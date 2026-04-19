import { Bell, Church, Coffee, Train, Clapperboard, Ship, Sparkles } from "lucide-react";
import { Panel } from "./Panel";
import type { Pulse } from "@/lib/types";

const KIND_ICON: Record<Pulse["kind"], React.ReactNode> = {
  ferry: <Ship className="h-4 w-4" />,
  church: <Church className="h-4 w-4" />,
  theater: <Clapperboard className="h-4 w-4" />,
  sncf: <Train className="h-4 w-4" />,
  influencer: <Sparkles className="h-4 w-4" />,
  competitor: <Coffee className="h-4 w-4" />
};

const SEVERITY: Record<Pulse["severity"], string> = {
  info: "text-mission-muted",
  watch: "text-mission-warn",
  high: "text-mission-danger"
};

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

export function PulseTimeline({ pulses }: { pulses: Pulse[] }) {
  return (
    <Panel title="Dynamic Pulses · Timeline" subtitle="Fenêtres de rush programmées" icon={<Bell className="h-4 w-4" />}>
      <ol className="relative space-y-3 border-l border-mission-border/80 pl-4">
        {pulses.map((p) => {
          const past = p.minutesFromNow < 0;
          const imminent = p.minutesFromNow >= 0 && p.minutesFromNow <= 30;
          return (
            <li key={p.id} className={`relative ${past ? "opacity-40" : ""}`}>
              <span
                className={`absolute -left-[21px] top-1 inline-flex h-3 w-3 items-center justify-center rounded-full border border-mission-border bg-mission-panel2 ${
                  imminent ? "ring-2 ring-mission-danger/60" : ""
                }`}
              />
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={SEVERITY[p.severity]}>{KIND_ICON[p.kind]}</span>
                  <span className="text-sm font-semibold">{p.label}</span>
                </div>
                <span className="font-mono text-xs text-mission-muted">
                  {formatTime(p.timeISO)}
                  {past ? " · passé" : p.minutesFromNow < 60 ? ` · T-${p.minutesFromNow}′` : ""}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-mission-muted">{p.note}</p>
            </li>
          );
        })}
      </ol>
    </Panel>
  );
}
