"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DecorativeBackground } from "./DecorativeBackground";
import { Details } from "./Details";
import { EventsCrowdCard } from "./EventsCrowdCard";
import { Header, type DashboardTab } from "./Header";
import { QuickView } from "./QuickView";
import { SourcesPanel } from "./SourcesPanel";
import { WeatherCustomerCard } from "./WeatherCustomerCard";
import { WeekView } from "./WeekView";
import type { Briefing, WeekBriefing } from "@/lib/types";

export function Dashboard({ initial }: { initial: Briefing }) {
  const [briefing, setBriefing] = useState<Briefing>(initial);
  const [week, setWeek] = useState<WeekBriefing | null>(null);
  const [tab, setTab] = useState<DashboardTab>("day");
  const [refreshing, setRefreshing] = useState(false);
  const [weekLoading, setWeekLoading] = useState(false);
  const weekFetched = useRef(false);

  const loadWeek = useCallback(async () => {
    setWeekLoading(true);
    try {
      const res = await fetch("/api/briefing/week", {
        cache: "no-store",
        signal: AbortSignal.timeout(15000)
      });
      if (!res.ok) return;
      const data = (await res.json()) as WeekBriefing;
      setWeek(data);
      weekFetched.current = true;
    } catch (err) {
      console.error("Week briefing fetch failed", err);
    } finally {
      setWeekLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/briefing", {
        cache: "no-store",
        signal: AbortSignal.timeout(10000)
      });
      if (res.ok) {
        const data = (await res.json()) as Briefing;
        setBriefing(data);
      }
      if (weekFetched.current) await loadWeek();
    } catch (err) {
      console.error("Briefing refresh failed", err);
    } finally {
      setRefreshing(false);
    }
  }, [loadWeek]);

  useEffect(() => {
    const id = setInterval(refresh, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, [refresh]);

  useEffect(() => {
    if (tab === "week" && !weekFetched.current && !weekLoading) {
      loadWeek();
    }
  }, [tab, weekLoading, loadWeek]);

  return (
    <div className="relative min-h-screen">
      <DecorativeBackground />
      <Header
        briefing={briefing}
        onRefresh={refresh}
        refreshing={refreshing}
        tab={tab}
        onTabChange={setTab}
      />
      <main className="relative mx-auto max-w-6xl space-y-4 px-4 py-5">
        {tab === "day" ? (
          <>
            <QuickView briefing={briefing} />

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <WeatherCustomerCard briefing={briefing} />
              <EventsCrowdCard briefing={briefing} />
            </div>

            <Details briefing={briefing} />
          </>
        ) : (
          <WeekView week={week} loading={weekLoading} />
        )}

        <SourcesPanel sources={briefing.sources} />

        <footer className="pb-8 pt-1 text-center text-[11px] text-seine-muted">
          Glaces en Seine · Quai de Seine · Service 14h–19h · Bon service ⚓
        </footer>
      </main>
    </div>
  );
}
