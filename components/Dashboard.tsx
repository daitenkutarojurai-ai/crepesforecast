"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { MapPin, RefreshCcw, Waves } from "lucide-react";
import { BattleSheet } from "./BattleSheet";
import { GrandMereLight } from "./GrandMereLight";
import { ModeToggle } from "./ModeToggle";
import { PulseTimeline } from "./PulseTimeline";
import { SecondaryGrid } from "./SecondaryGrid";
import { SourcesPanel } from "./SourcesPanel";
import { WeatherPanel } from "./WeatherPanel";
import type { Briefing, Mode } from "@/lib/types";

export function Dashboard({ initial }: { initial: Briefing }) {
  const [briefing, setBriefing] = useState<Briefing>(initial);
  const [mode, setMode] = useState<Mode>(initial.mode);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/briefing", { cache: "no-store" });
      if (res.ok) {
        const data = (await res.json()) as Briefing;
        setBriefing(data);
        setMode(data.mode);
      }
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const id = setInterval(refresh, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, [refresh]);

  const generatedAt = useMemo(
    () => new Date(briefing.generatedAt).toLocaleString("fr-FR", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "short" }),
    [briefing.generatedAt]
  );

  return (
    <div className="relative min-h-screen">
      <div className="grid-bg absolute inset-0 opacity-40" aria-hidden />
      <div className="relative">
        <header className="sticky top-0 z-20 border-b border-mission-border bg-mission-bg/85 backdrop-blur">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3">
            <div className="flex items-center gap-2">
              <Waves className="h-5 w-5 text-mission-accent" />
              <div className="leading-tight">
                <h1 className="text-sm font-semibold tracking-wide">Glaces en Seine · Mission Control</h1>
                <p className="text-[10px] uppercase tracking-[0.2em] text-mission-muted">
                  <MapPin className="mr-1 inline h-3 w-3" />
                  {briefing.location.name} · {briefing.location.postalCodes.join(" / ")}
                </p>
              </div>
            </div>
            <div className="ml-auto flex flex-wrap items-center gap-2">
              <GrandMereLight cardigan={briefing.cardigan} />
              <ModeToggle mode={mode} onChange={setMode} />
              <button
                type="button"
                onClick={refresh}
                disabled={refreshing}
                className="inline-flex items-center gap-2 rounded-md border border-mission-border bg-mission-panel px-3 py-1.5 text-xs text-mission-muted hover:text-mission-ink disabled:opacity-60"
              >
                <RefreshCcw className={`h-3 w-3 ${refreshing ? "animate-spin" : ""}`} />
                {refreshing ? "…" : generatedAt}
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl space-y-4 px-4 py-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <WeatherPanel weather={briefing.weather} hourly={briefing.hourly} />
            </div>
            <div>
              <BattleSheet briefing={briefing} />
            </div>
          </div>

          <PulseTimeline pulses={briefing.pulses} />

          <SecondaryGrid briefing={briefing} />

          <SourcesPanel sources={briefing.sources} />

          <footer className="pb-10 pt-2 text-center text-[10px] uppercase tracking-[0.22em] text-mission-muted">
            Briefing généré {generatedAt} · Quai de Seine · Bon service ⚓
          </footer>
        </main>
      </div>
    </div>
  );
}
