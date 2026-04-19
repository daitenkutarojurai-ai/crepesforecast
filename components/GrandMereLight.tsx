import { ShieldAlert } from "lucide-react";
import type { CardiganResult } from "@/lib/types";

const COLORS: Record<CardiganResult["level"], { dot: string; ring: string; text: string; label: string }> = {
  green: { dot: "bg-mission-ok", ring: "ring-mission-ok/40", text: "text-mission-ok", label: "OK" },
  amber: { dot: "bg-mission-warn", ring: "ring-mission-warn/40", text: "text-mission-warn", label: "WATCH" },
  red: { dot: "bg-mission-danger", ring: "ring-mission-danger/50", text: "text-mission-danger", label: "RED" }
};

export function GrandMereLight({ cardigan }: { cardigan: CardiganResult }) {
  const c = COLORS[cardigan.level];
  return (
    <div className="flex items-center gap-3 rounded-md border border-mission-border bg-mission-panel/60 px-3 py-2">
      <div className="relative">
        <div className={`h-3 w-3 rounded-full ${c.dot} ${cardigan.level === "red" ? "animate-pulseRing" : ""}`} />
        <div className={`absolute inset-[-4px] rounded-full ring-2 ${c.ring}`} />
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-[10px] uppercase tracking-[0.18em] text-mission-muted">Grand-Mère</span>
        <span className={`text-xs font-semibold ${c.text}`}>
          <ShieldAlert className="mr-1 inline h-3 w-3" />
          {c.label} · Ct {cardigan.value}
        </span>
      </div>
    </div>
  );
}
