"use client";

import { Anchor, RefreshCcw } from "lucide-react";
import { GrandMereLight } from "./GrandMereLight";
import { BrandLogo } from "./Illustration";
import { formatRefreshedAt, formatSundayLong } from "@/lib/time";
import type { Briefing } from "@/lib/types";

export function Header({
  briefing,
  onRefresh,
  refreshing
}: {
  briefing: Briefing;
  onRefresh: () => void;
  refreshing: boolean;
}) {
  const targetLabel = formatSundayLong(new Date(briefing.targetDate));
  const refreshedAt = formatRefreshedAt(briefing.generatedAt);

  return (
    <header className="sticky top-0 z-20 bg-seine-header text-seine-headerInk shadow-sm">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
        <div className="flex items-center gap-3">
          <BrandLogo className="h-10 w-auto" />
          <div className="leading-tight border-l border-seine-headerInk/20 pl-3">
            <h1 className="text-sm font-semibold tracking-tight">
              Briefing Dimanche
            </h1>
            <p className="text-[11px] font-medium opacity-75">
              {targetLabel.charAt(0).toUpperCase() + targetLabel.slice(1)} ·{" "}
              {briefing.location.postalCodes.join(" / ")}
            </p>
          </div>
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <GrandMereLight cardigan={briefing.cardigan} />
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
    </header>
  );
}
