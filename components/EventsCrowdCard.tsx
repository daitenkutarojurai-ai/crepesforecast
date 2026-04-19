import {
  Calendar,
  Church,
  Clapperboard,
  Hash,
  Ship,
  Sparkles,
  Store,
  Train,
  Users
} from "lucide-react";
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

export function EventsCrowdCard({ briefing }: { briefing: Briefing }) {
  const { pulses, events, socialSentiment, competitorProxy } = briefing;

  return (
    <Card title="Événements & Affluence" subtitle="Dimanche" icon={Users}>
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-seine-muted">
          Horaires de rush
        </h3>
        <ul className="mt-2 space-y-1.5">
          {pulses.map((p) => {
            const Icon = PULSE_ICON[p.kind];
            return (
              <li
                key={p.id}
                className="flex items-start gap-3 rounded-xl border border-seine-border bg-seine-bg/40 px-3 py-2"
              >
                <Icon className="mt-0.5 h-4 w-4 text-seine-accent" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-seine-muted">{timeOf(p.timeISO)}</span>
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
      </div>

      <div className="mt-4">
        <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-seine-muted">
          Agenda local
        </h3>
        <ul className="mt-2 space-y-1.5">
          {events.map((e) => (
            <li
              key={e.id}
              className="flex items-start gap-3 rounded-xl border border-seine-border bg-seine-bg/40 px-3 py-2"
            >
              <Calendar className="mt-0.5 h-4 w-4 text-seine-accent" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-seine-ink">{e.title}</span>
                  <Chip tone="ok">+{e.expectedBump}%</Chip>
                </div>
                <p className="text-xs text-seine-muted">
                  {timeOf(e.startISO)}
                  {e.endISO ? `–${timeOf(e.endISO)}` : ""} · {e.distanceKm.toFixed(1)} km
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <div className="rounded-xl border border-seine-border bg-seine-bg/40 px-3 py-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-seine-muted">
            <Hash className="h-3 w-3" />
            Social {socialSentiment.hashtag}
          </div>
          <p className="mt-1 text-sm text-seine-ink">
            {socialSentiment.spikePct >= 0 ? "+" : ""}
            {socialSentiment.spikePct}%
          </p>
          <p className="text-xs text-seine-muted">{socialSentiment.note}</p>
        </div>
        <div className="rounded-xl border border-seine-border bg-seine-bg/40 px-3 py-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-seine-muted">
            <Store className="h-3 w-3" />
            Concurrence
          </div>
          <p className="mt-1 text-sm capitalize text-seine-ink">
            {competitorProxy.status === "quiet"
              ? "Calme"
              : competitorProxy.status === "busier"
                ? "Plus fréquentée"
                : "Typique"}
          </p>
          <p className="text-xs text-seine-muted">{competitorProxy.note}</p>
        </div>
      </div>
    </Card>
  );
}

function timeOf(iso: string): string {
  return new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}
