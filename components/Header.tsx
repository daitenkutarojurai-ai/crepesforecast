"use client";

import { Anchor, CalendarX, RefreshCcw } from "lucide-react";
import { AffluenceLight } from "./AffluenceLight";
import { BrandLogo } from "./Illustration";
import { formatRefreshedAt } from "@/lib/time";
import type { AvailableDaySummary, AvailableDaysSummary, Briefing, TargetKind } from "@/lib/types";

const KIND_SHORT: Record<TargetKind, string> = {
  saturday: "Samedi",
  sunday: "Dimanche",
  holiday: "Férié"
};

function formatShortDate(d: Date): string {
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

export function Header({
  briefing,
  onRefresh,
  refreshing,
  selectedKind,
  onSelect,
  availableDays,
  switching
}: {
  briefing: Briefing;
  onRefresh: () => void;
  refreshing: boolean;
  selectedKind: TargetKind;
  onSelect: (k: TargetKind) => void;
  availableDays: AvailableDaysSummary;
  switching: boolean;
}) {
  const refreshedAt = formatRefreshedAt(briefing.generatedAt);
  const title = `Briefing ${KIND_SHORT[briefing.targetKind]}`;
  const subtitle = `${briefing.targetLabel.charAt(0).toUpperCase() + briefing.targetLabel.slice(1)} · ${briefing.location.postalCodes.join(" / ")}`;

  return (
    <header className="sticky top-0 z-20 bg-seine-header text-seine-headerInk shadow-sm">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-3 py-2 sm:gap-3 sm:px-4 sm:py-3">
        <div className="flex items-center gap-3">
          <BrandLogo className="h-10 w-auto" />
          <div className="leading-tight border-l border-seine-headerInk/20 pl-3">
            <h1 className="text-sm font-semibold tracking-tight">{title}</h1>
            <p className="text-[11px] font-medium opacity-75">{subtitle}</p>
          </div>
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <AffluenceLight briefing={briefing} />
          <button
            type="button"
            onClick={onRefresh}
            disabled={refreshing}
            className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-seine-border bg-seine-card/90 px-3 py-2 text-xs font-medium text-seine-ink hover:bg-seine-card disabled:opacity-60"
            title="Rafraîchir le briefing"
          >
            <RefreshCcw className={`h-3 w-3 ${refreshing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Mis à jour :</span>
            <span>{refreshing ? "…" : refreshedAt}</span>
          </button>
          <Anchor className="hidden h-4 w-4 opacity-60 sm:block" aria-hidden />
        </div>
      </div>
      <div className="border-t border-seine-headerInk/15 bg-seine-header/60">
        <div
          role="tablist"
          aria-label="Jour de service"
          className="mx-auto flex max-w-6xl items-stretch gap-1.5 px-2 py-2 sm:px-4"
        >
          <DayButton
            kind="saturday"
            day={availableDays.saturday}
            selected={selectedKind === "saturday"}
            switching={switching && selectedKind === "saturday"}
            onSelect={onSelect}
          />
          <DayButton
            kind="sunday"
            day={availableDays.sunday}
            selected={selectedKind === "sunday"}
            switching={switching && selectedKind === "sunday"}
            onSelect={onSelect}
          />
          <DayButton
            kind="holiday"
            day={availableDays.holiday}
            selected={selectedKind === "holiday"}
            switching={switching && selectedKind === "holiday"}
            onSelect={onSelect}
          />
        </div>
      </div>
    </header>
  );
}

function DayButton({
  kind,
  day,
  selected,
  switching,
  onSelect
}: {
  kind: TargetKind;
  day: AvailableDaySummary | null;
  selected: boolean;
  switching: boolean;
  onSelect: (k: TargetKind) => void;
}) {
  const available = day !== null;
  const baseName = KIND_SHORT[kind];
  const subtitle = day
    ? day.holidayName
      ? `${formatShortDate(new Date(day.date))} · ${day.holidayName}`
      : formatShortDate(new Date(day.date))
    : kind === "holiday"
      ? "Aucun férié à venir"
      : "Indisponible";

  const cls = selected
    ? "bg-seine-card text-seine-ink shadow-card ring-2 ring-seine-accent/40"
    : available
      ? "bg-seine-card/70 text-seine-ink hover:bg-seine-card"
      : "bg-seine-card/40 text-seine-muted cursor-not-allowed";

  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      disabled={!available || switching}
      onClick={() => onSelect(kind)}
      className={`min-h-[44px] flex-1 rounded-xl border border-seine-border px-2.5 py-1.5 text-left transition sm:px-3 sm:py-2 ${cls}`}
      title={available ? `Voir le briefing ${baseName.toLowerCase()}` : subtitle}
    >
      <div className="flex items-center gap-2">
        {kind === "holiday" && !available ? (
          <CalendarX className="h-3.5 w-3.5 shrink-0 opacity-60" />
        ) : null}
        <span className="text-xs font-semibold uppercase tracking-[0.12em]">{baseName}</span>
        {switching ? (
          <span className="ml-auto h-1.5 w-1.5 animate-pulse rounded-full bg-seine-accent" aria-hidden />
        ) : null}
      </div>
      <div className="mt-0.5 truncate text-[11px] text-seine-muted">{subtitle}</div>
    </button>
  );
}
