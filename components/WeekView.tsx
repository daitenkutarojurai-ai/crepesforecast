"use client";

import { CalendarDays, ChefHat, CupSoda, Flame, ThermometerSun, Users } from "lucide-react";
import { Card, Chip } from "./Card";
import { LinearGauge } from "./Gauge";
import { describeSky, pickWeatherIcon } from "@/lib/weather-icon";
import type { DrinkStock, WeekBriefing, WeekBriefingDay } from "@/lib/types";

const TIER_TONE: Record<WeekBriefingDay["affluenceTier"], "default" | "ok" | "warn" | "danger"> = {
  peak: "danger",
  high: "warn",
  steady: "ok",
  quiet: "default"
};

const DRINK_TIER_LABEL: Record<DrinkStock["tier"], string> = {
  base: "Base",
  renforcé: "Renforcé",
  canicule: "Canicule"
};

const KIND_BADGE: Record<WeekBriefingDay["targetKind"], { label: string; tone: "default" | "ok" | "warn" | "accent" }> = {
  saturday: { label: "Samedi", tone: "accent" },
  sunday: { label: "Dimanche", tone: "accent" },
  holiday: { label: "Férié", tone: "warn" }
};

export function WeekView({ week, loading }: { week: WeekBriefing | null; loading: boolean }) {
  if (loading && !week) {
    return (
      <Card title="Semaine de travail" subtitle="Sam / Dim / Fériés · 14h–19h" icon={CalendarDays} tone="sage">
        <p className="rounded-xl border border-dashed border-seine-border bg-seine-bg/40 px-3 py-6 text-center text-sm text-seine-muted">
          Chargement des prévisions météo des jours ouvrés…
        </p>
      </Card>
    );
  }
  if (!week || week.days.length === 0) {
    return (
      <Card title="Semaine de travail" subtitle="Sam / Dim / Fériés · 14h–19h" icon={CalendarDays} tone="sage">
        <p className="rounded-xl border border-dashed border-seine-border bg-seine-bg/40 px-3 py-6 text-center text-sm text-seine-muted">
          Aucun jour de service détecté dans les 8 jours à venir.
        </p>
      </Card>
    );
  }

  return (
    <Card
      title="Semaine de travail"
      subtitle={`${week.days.length} jour${week.days.length > 1 ? "s" : ""} · 14h–19h`}
      icon={CalendarDays}
      tone="sage"
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {week.days.map((d) => (
          <DayCard key={d.targetDate} day={d} />
        ))}
      </div>
    </Card>
  );
}

function DayCard({ day }: { day: WeekBriefingDay }) {
  const { weather } = day;
  const Icon = pickWeatherIcon(weather.cloudCoverPct, weather.precipProbPct);
  const sky = describeSky(weather.cloudCoverPct, weather.precipProbPct);
  const kind = KIND_BADGE[day.targetKind];

  return (
    <article className="flex flex-col gap-2 rounded-2xl border border-seine-border bg-seine-card/90 p-3">
      <header className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-seine-muted">
            {day.targetLabel.charAt(0).toUpperCase() + day.targetLabel.slice(1)}
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 text-lg font-semibold text-seine-ink">
            <Icon className="h-5 w-5 text-seine-accent" strokeWidth={1.5} />
            {Math.round(weather.tempC)}°C · {sky}
          </p>
        </div>
        <Chip tone={kind.tone}>{kind.label}</Chip>
      </header>

      <div className="flex flex-wrap items-center gap-1.5">
        <Chip tone={TIER_TONE[day.affluenceTier]}>
          <Users className="h-3 w-3" /> {day.affluenceLabel}
        </Chip>
        <Chip>
          <ThermometerSun className="h-3 w-3" /> {day.mode === "glace" ? "Mode Glace" : "Mode Crêpe"}
        </Chip>
        <Chip tone={day.drinksTier === "canicule" ? "danger" : day.drinksTier === "renforcé" ? "warn" : "default"}>
          <CupSoda className="h-3 w-3" /> {DRINK_TIER_LABEL[day.drinksTier]}
        </Chip>
        {weather.precipProbPct > 40 ? (
          <Chip tone="warn">Pluie {weather.precipProbPct}%</Chip>
        ) : null}
      </div>

      <div className="rounded-xl bg-seine-bg/50 px-3 py-2">
        <div className="flex items-center gap-2 text-xs text-seine-muted">
          <ChefHat className="h-3.5 w-3.5" />
          <span className="font-semibold uppercase tracking-[0.12em]">Carte du jour</span>
        </div>
        <p className="mt-1 text-sm font-medium text-seine-ink">{day.menuHero}</p>
      </div>

      <div className="flex items-center gap-3 rounded-xl bg-seine-bg/40 px-3 py-2">
        <div className="flex-1">
          <div className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-seine-muted">
            <Flame className="h-3 w-3" /> Terrasse
          </div>
          <LinearGauge
            value={day.terrasseFillPct}
            color={
              day.terrasseFillPct >= 85
                ? "bg-seine-danger"
                : day.terrasseFillPct >= 60
                  ? "bg-seine-warn"
                  : "bg-seine-ok"
            }
            label={`${day.terrasseFillPct}%`}
            sublabel={`Pâte ${Math.round(day.batterVolumePct)}%`}
          />
        </div>
      </div>

      {day.topEvent ? (
        <p className="text-xs text-seine-muted">
          <span className="font-medium text-seine-ink">{day.topEvent.title}</span>{" "}
          · +{day.topEvent.bump}% affluence
        </p>
      ) : (
        <p className="text-xs text-seine-muted">Pas d'événement majeur détecté.</p>
      )}
    </article>
  );
}
