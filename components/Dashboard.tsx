"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DecorativeBackground } from "./DecorativeBackground";
import { Details } from "./Details";
import { EventsCrowdCard } from "./EventsCrowdCard";
import { Header } from "./Header";
import { QuickView } from "./QuickView";
import { SourcesPanel } from "./SourcesPanel";
import { WeatherCustomerCard } from "./WeatherCustomerCard";
import type { AvailableDaysSummary, Briefing, TargetKind } from "@/lib/types";

export function Dashboard({
  initial,
  availableDays
}: {
  initial: Briefing;
  availableDays: AvailableDaysSummary;
}) {
  const [selectedKind, setSelectedKind] = useState<TargetKind>(initial.targetKind);
  const [briefing, setBriefing] = useState<Briefing>(initial);
  const [refreshing, setRefreshing] = useState(false);
  const [switching, setSwitching] = useState(false);
  const cache = useRef<Partial<Record<TargetKind, Briefing>>>({ [initial.targetKind]: initial });
  const reqId = useRef(0);
  const selectedKindRef = useRef<TargetKind>(initial.targetKind);

  const fetchFor = useCallback(async (kind: TargetKind): Promise<Briefing | null> => {
    try {
      const res = await fetch(`/api/briefing?day=${kind}`, {
        cache: "no-store",
        signal: AbortSignal.timeout(10000)
      });
      if (!res.ok) return null;
      return (await res.json()) as Briefing;
    } catch (err) {
      console.error(`Briefing fetch failed for ${kind}`, err);
      return null;
    }
  }, []);

  const handleSelect = useCallback(
    async (kind: TargetKind) => {
      if (kind === selectedKind) return;
      if (!availableDays[kind]) return;
      setSelectedKind(kind);
      const cached = cache.current[kind];
      if (cached) {
        setBriefing(cached);
        return;
      }
      const id = ++reqId.current;
      setSwitching(true);
      const fresh = await fetchFor(kind);
      if (id !== reqId.current) return;
      if (fresh) {
        cache.current[kind] = fresh;
        setBriefing(fresh);
      }
      setSwitching(false);
    },
    [selectedKind, availableDays, fetchFor]
  );

  // keep ref in sync so the stable `refresh` always targets the current tab
  useEffect(() => { selectedKindRef.current = selectedKind; }, [selectedKind]);

  // refresh is stable (no selectedKind dep) so the 5-min interval never resets on tab switch
  const refresh = useCallback(async () => {
    const kind = selectedKindRef.current;
    setRefreshing(true);
    const fresh = await fetchFor(kind);
    if (fresh) {
      cache.current[kind] = fresh;
      setBriefing(fresh);
      for (const other of ["saturday", "sunday", "holiday"] as TargetKind[]) {
        if (other !== kind && cache.current[other]) delete cache.current[other];
      }
    }
    setRefreshing(false);
  }, [fetchFor]);

  useEffect(() => {
    const id = setInterval(refresh, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, [refresh]);

  return (
    <div className="relative min-h-screen">
      <DecorativeBackground />
      <Header
        briefing={briefing}
        onRefresh={refresh}
        refreshing={refreshing}
        selectedKind={selectedKind}
        onSelect={handleSelect}
        availableDays={availableDays}
        switching={switching}
      />
      <main className="relative mx-auto max-w-6xl space-y-5 px-4 py-6">
        <QuickView briefing={briefing} />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <WeatherCustomerCard briefing={briefing} />
          <EventsCrowdCard briefing={briefing} />
        </div>

        <Details briefing={briefing} />

        <SourcesPanel sources={briefing.sources} />

        <footer className="pb-8 pt-2 text-center text-[11px] font-semibold text-seine-muted">
          Glaces en Seine · Quai de Seine · Service 14h–19h · Bon service ⚓
        </footer>
      </main>
    </div>
  );
}
