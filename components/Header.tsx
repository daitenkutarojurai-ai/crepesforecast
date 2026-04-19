"use client";

import { Anchor, Caravan, RefreshCcw } from "lucide-react";
import { GrandMereLight } from "./GrandMereLight";
import { ModeToggle } from "./ModeToggle";
import { formatRefreshedAt, formatSundayLong } from "@/lib/time";
import type { Briefing, Mode } from "@/lib/types";

export function Header({
  briefing,
  mode,
  onMode,
  onRefresh,
  refreshing
}: {
  briefing: Briefing;
  mode: Mode;
  onMode: (m: Mode) => void;
  onRefresh: () => void;
  refreshing: boolean;
}) {
  const targetLabel = formatSundayLong(new Date(briefing.targetDate));
  const refreshedAt = formatRefreshedAt(briefing.generatedAt);

  return (
    <header className="sticky top-0 z-20 bg-seine-header text-seine-headerInk shadow-sm">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
        <div className="flex items-center gap-2">
          <Caravan className="h-5 w-5" />
          <div className="leading-tight">
            <h1 className="text-base font-semibold tracking-tight">
              Glaces en Seine <span className="opacity-50">|</span> Briefing Dimanche
            </h1>
            <p className="text-[11px] font-medium opacity-75">
              {targetLabel.charAt(0).toUpperCase() + targetLabel.slice(1)} ·{" "}
              {briefing.location.postalCodes.join(" / ")}
            </p>
          </div>
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <GrandMereLight cardigan={briefing.cardigan} />
          <ModeToggle mode={mode} onChange={onMode} />
          <button
            type="button"
            onClick={onRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-full border border-seine-border bg-seine-card/90 px-3 py-1 text-xs font-medium text-seine-ink hover:bg-seine-card disabled:opacity-60"
            title="Rafraîchir le briefing"
          >
            <RefreshCcw className={`h-3 w-3 ${refreshing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Mis à jour :</span>
            <span>{refreshing ? "…" : refreshedAt}</span>
          </button>
          <Anchor className="hidden h-4 w-4 opacity-60 sm:block" aria-hidden />
        </div>
      </div>
    </header>
  );
}
