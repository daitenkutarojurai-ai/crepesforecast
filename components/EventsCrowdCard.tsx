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
import { LinearGauge } from "./Gauge";
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
  const { pulses, events, socialSentiment, competitorProxy } = briefing;
  const totalBump = events.filter((e) => e.distanceKm <= 1.5).reduce((s, e) => s + e.expectedBump, 0);

  return (
    <Card title="Événements & Affluence" subtitle="Dimanche" icon={Users}>
      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-seine-muted">
          Horaires de rush
        </h3>
        <ul className="space-y-2">
          {pulses.map((p) => {
            const Icon = PULSE_ICON[p.kind];
            return (
              <li
                key={p.id}
                className="flex items-start gap-3 rounded-2xl border border-seine-border bg-seine-card px-3 py-2"
              >
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${PULSE_TINT[p.kind]}`}>
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
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-seine-muted">
            Agenda local
          </h3>
          <span className="font-mono text-xs font-semibold text-seine-ink">
            {totalBump > 0 ? `+${totalBump} %` : "0 %"}
          </span>
        </div>
        <ul className="space-y-2">
          {events.map((e) => {
            const cap = Math.min(50, e.expectedBump);
            const pct = (cap / 50) * 100;
            return (
              <li
                key={e.id}
                className="rounded-2xl border border-seine-border bg-seine-card px-3 py-2"
              >
                <div className="flex items-start gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-seine-chip/60 text-seine-chipInk">
                    <Calendar className="h-4 w-4" />
                  </span>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-seine-ink">{e.title}</span>
                      <Chip tone="ok">+{e.expectedBump} %</Chip>
                    </div>
                    <p className="text-xs text-seine-muted">
                      {timeOf(e.startISO)}
                      {e.endISO ? `–${timeOf(e.endISO)}` : ""} · {e.distanceKm.toFixed(1)} km
                    </p>
                    <div className="mt-2">
                      <LinearGauge value={pct} color="bg-seine-ok" />
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <div className="rounded-2xl border border-seine-border bg-seine-bg/40 px-3 py-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-seine-muted">
            <Hash className="h-3 w-3" />
            Social {socialSentiment.hashtag}
          </div>
          <p className="mt-1 font-mono text-base font-semibold text-seine-ink">
            {socialSentiment.spikePct >= 0 ? "+" : ""}
            {socialSentiment.spikePct} %
          </p>
          <p className="text-xs text-seine-muted">{socialSentiment.note}</p>
        </div>
        <div className="rounded-2xl border border-seine-border bg-seine-bg/40 px-3 py-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-seine-muted">
            <Store className="h-3 w-3" />
            Concurrence
          </div>
          <p className="mt-1 text-base font-semibold capitalize text-seine-ink">
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
