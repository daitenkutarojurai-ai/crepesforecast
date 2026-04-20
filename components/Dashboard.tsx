"use client";

import { useCallback, useEffect, useState } from "react";
import { DecorativeBackground } from "./DecorativeBackground";
import { Details } from "./Details";
import { EventsCrowdCard } from "./EventsCrowdCard";
import { Header } from "./Header";
import { QuickView } from "./QuickView";
import { SourcesPanel } from "./SourcesPanel";
import { WeatherCustomerCard } from "./WeatherCustomerCard";
import type { Briefing } from "@/lib/types";

export function Dashboard({ initial }: { initial: Briefing }) {
  const [briefing, setBriefing] = useState<Briefing>(initial);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/briefing", { cache: "no-store" });
      if (res.ok) {
        const data = (await res.json()) as Briefing;
        setBriefing(data);
      }
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const id = setInterval(refresh, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, [refresh]);

  return (
    <div className="relative min-h-screen">
      <DecorativeBackground />
      <Header briefing={briefing} onRefresh={refresh} refreshing={refreshing} />
      <main className="relative mx-auto max-w-6xl space-y-4 px-4 py-5">
        <QuickView briefing={briefing} />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <WeatherCustomerCard briefing={briefing} />
          <EventsCrowdCard briefing={briefing} />
        </div>

        <Details briefing={briefing} />

        <SourcesPanel sources={briefing.sources} />

        <footer className="pb-8 pt-1 text-center text-[11px] text-seine-muted">
          Glaces en Seine · Quai de Seine · Bon service ⚓
        </footer>
      </main>
    </div>
  );
}
