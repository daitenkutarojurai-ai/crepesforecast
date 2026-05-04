"use client";

import { Anchor } from "lucide-react";
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
    }
    setRefreshing(false);
    // Refresh the inactive tabs too so the cache stays warm for instant switches
    for (const other of ["saturday", "sunday", "holiday"] as TargetKind[]) {
      if (other === kind) continue;
      if (!availableDays[other]) continue;
      const next = await fetchFor(other);
      if (next) cache.current[other] = next;
    }
  }, [fetchFor, availableDays]);

  useEffect(() => {
    const id = setInterval(refresh, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, [refresh]);

  // Warm the other available tabs on first paint so the first switch is instant
  useEffect(() => {
    let cancelled = false;
    const warm = async () => {
      for (const other of ["saturday", "sunday", "holiday"] as TargetKind[]) {
        if (cancelled) return;
        if (other === initial.targetKind) continue;
        if (!availableDays[other]) continue;
        if (cache.current[other]) continue;
        const fresh = await fetchFor(other);
        if (cancelled) return;
        if (fresh) cache.current[other] = fresh;
      }
    };
    void warm();
    return () => {
      cancelled = true;
    };
  }, [availableDays, fetchFor, initial.targetKind]);

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

        <footer className="flex flex-col items-center gap-1.5 pb-8 pt-2 text-center text-seine-muted">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold">
            <span>Glaces en Seine · Quai de Seine · 14h–19h</span>
            <Anchor className="h-3 w-3" aria-hidden />
          </div>
          <a
            href="https://diyfunproject.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-semibold underline-offset-2 hover:text-seine-ink hover:underline"
          >
            diyfunproject.com
          </a>
          <span className="text-[9px] opacity-60">Merci à Anaït pour la revue</span>
        </footer>
      </main>
    </div>
  );
}
