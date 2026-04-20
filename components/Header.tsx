"use client";

import { Anchor, RefreshCcw } from "lucide-react";
import { AffluenceLight } from "./AffluenceLight";
import { BrandLogo } from "./Illustration";
import { formatRefreshedAt } from "@/lib/time";
import type { Briefing } from "@/lib/types";

export type DashboardTab = "day" | "week";

export function Header({
  briefing,
  onRefresh,
  refreshing,
  tab,
  onTabChange
}: {
  briefing: Briefing;
  onRefresh: () => void;
  refreshing: boolean;
  tab: DashboardTab;
  onTabChange: (t: DashboardTab) => void;
}) {
  const refreshedAt = formatRefreshedAt(briefing.generatedAt);
  const title =
    briefing.targetKind === "saturday"
      ? "Briefing Samedi"
      : briefing.targetKind === "holiday"
        ? "Briefing Férié"
        : "Briefing Dimanche";
  const subtitle = `${briefing.targetLabel.charAt(0).toUpperCase() + briefing.targetLabel.slice(1)} · ${briefing.location.postalCodes.join(" / ")}`;

  return (
    <header className="sticky top-0 z-20 bg-seine-header text-seine-headerInk shadow-sm">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
        <div className="flex items-center gap-3">
          <BrandLogo className="h-10 w-auto" />
          <div className="leading-tight border-l border-seine-headerInk/20 pl-3">
            <h1 className="text-sm font-semibold tracking-tight">{title}</h1>
            <p className="text-[11px] font-medium opacity-75">{subtitle}</p>
          </div>
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <div
            role="tablist"
            aria-label="Vue du briefing"
            className="inline-flex rounded-full border border-seine-border bg-seine-card/80 p-0.5 text-xs font-semibold"
          >
            <button
              type="button"
              role="tab"
              aria-selected={tab === "day"}
              onClick={() => onTabChange("day")}
              className={`min-h-[32px] rounded-full px-3 transition ${
                tab === "day"
                  ? "bg-seine-accent text-white shadow-sm"
                  : "text-seine-ink/80 hover:text-seine-ink"
              }`}
            >
              Jour
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === "week"}
              onClick={() => onTabChange("week")}
              className={`min-h-[32px] rounded-full px-3 transition ${
                tab === "week"
                  ? "bg-seine-accent text-white shadow-sm"
                  : "text-seine-ink/80 hover:text-seine-ink"
              }`}
            >
              Semaine
            </button>
          </div>
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
    </header>
  );
}
