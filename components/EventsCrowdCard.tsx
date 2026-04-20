import {
  CalendarHeart,
  Church,
  Clapperboard,
  ExternalLink,
  Landmark,
  Ship,
  ShoppingBasket,
  Sparkles,
  Tent,
  Train,
  Waves
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, Chip } from "./Card";
import { SparkleFleurs } from "./Illustration";
import type { Briefing, LocalEvent, Pulse } from "@/lib/types";

const PULSE_ICON: Record<Pulse["kind"], LucideIcon> = {
  ferry: Ship,
  church: Church,
  theater: Clapperboard,
  sncf: Train,
  influencer: Sparkles,
  competitor: ShoppingBasket
};

const PULSE_TINT: Record<Pulse["kind"], string> = {
  ferry: "bg-seine-header text-seine-headerInk",
  church: "bg-seine-peach text-seine-peachInk",
  theater: "bg-seine-rose text-seine-roseInk",
  sncf: "bg-seine-cream text-seine-creamInk",
  influencer: "bg-seine-chip text-seine-chipInk",
  competitor: "bg-seine-sage text-seine-sageInk"
};

const EVENT_ICON: Record<LocalEvent["kind"], LucideIcon> = {
  brocante: Tent,
  market: ShoppingBasket,
  rowing: Waves,
  marathon: Sparkles,
  religious: Church,
  theater: Clapperboard,
  other: Landmark
};

const EVENT_TINT: Record<LocalEvent["kind"], string> = {
  brocante: "bg-seine-peach text-seine-peachInk",
  market: "bg-seine-sage text-seine-sageInk",
  rowing: "bg-seine-header text-seine-headerInk",
  marathon: "bg-seine-rose text-seine-roseInk",
  religious: "bg-seine-cream text-seine-creamInk",
  theater: "bg-seine-chip text-seine-chipInk",
  other: "bg-seine-header text-seine-headerInk"
};

export function EventsCrowdCard({ briefing }: { briefing: Briefing }) {
  const { pulses, events } = briefing;

  return (
    <Card
      title="Événements & Affluence"
      subtitle="Sur 10 km autour du quai"
      icon={CalendarHeart}
      tone="sage"
    >
      <div className="mb-3 flex items-center gap-2 rounded-2xl border border-seine-border bg-gradient-to-r from-seine-sage/40 via-seine-bg/20 to-transparent px-3 py-2">
        <SparkleFleurs className="h-6 w-12" />
        <span className="text-xs text-seine-muted">
          Données OpenAgenda + mairies + catalogue local — à recouper avec le terrain.
        </span>
      </div>

      {events.length > 0 ? (
        <ul className="space-y-2">
          {events.slice(0, 6).map((e) => {
            const Icon = EVENT_ICON[e.kind];
            return (
              <li
                key={e.id}
                className="flex items-start gap-3 rounded-2xl border border-seine-border bg-seine-card px-3 py-2"
              >
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${EVENT_TINT[e.kind]}`}>
                  <Icon className="h-4 w-4" />
                </span>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-sm font-semibold text-seine-ink">
                      {timeOf(e.startISO)}
                    </span>
                    <span className="text-sm font-semibold text-seine-ink">{e.title}</span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <Chip tone="ok">+{e.expectedBump}% affluence</Chip>
                    <Chip>{e.distanceKm} km</Chip>
                    {e.sourceUrl ? (
                      <a
                        href={e.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-full border border-seine-accent/40 bg-seine-header px-2 py-0.5 text-xs font-medium text-seine-headerInk hover:bg-seine-accent hover:text-white"
                      >
                        <ExternalLink className="h-3 w-3" />
                        {e.sourceLabel ?? "source"}
                      </a>
                    ) : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="rounded-xl border border-dashed border-seine-border bg-seine-bg/40 px-3 py-4 text-center text-sm text-seine-muted">
          Aucun événement détecté dans la zone pour ce dimanche.
        </p>
      )}

      <div className="mt-5 border-t border-seine-border pt-4">
        <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-seine-muted">
          Rythmes habituels du quai
        </h3>
        <ul className="space-y-1.5">
          {pulses.map((p) => {
            const Icon = PULSE_ICON[p.kind];
            return (
              <li
                key={p.id}
                className="flex items-center gap-3 rounded-xl bg-seine-bg/40 px-3 py-1.5"
              >
                <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${PULSE_TINT[p.kind]}`}>
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <span className="font-mono text-xs text-seine-ink">{timeOf(p.timeISO)}</span>
                <span className="flex-1 text-xs text-seine-muted">{p.label}</span>
                {p.severity === "high" ? <Chip tone="warn">Gros flux</Chip> : null}
              </li>
            );
          })}
        </ul>
      </div>
    </Card>
  );
}

function timeOf(iso: string): string {
  return new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}
