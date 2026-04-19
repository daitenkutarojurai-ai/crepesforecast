import { ShieldAlert } from "lucide-react";
import type { CardiganResult } from "@/lib/types";

const STYLES: Record<CardiganResult["level"], { dot: string; text: string; label: string; chip: string }> = {
  green: {
    dot: "bg-seine-ok",
    text: "text-seine-chipInk",
    label: "OK",
    chip: "bg-seine-chip border-seine-chip"
  },
  amber: {
    dot: "bg-seine-warn",
    text: "text-[#7a4b10]",
    label: "Attention",
    chip: "bg-[#f7e6cc] border-[#f0d9ad]"
  },
  red: {
    dot: "bg-seine-danger",
    text: "text-[#7a2a2a]",
    label: "Rouge",
    chip: "bg-[#f7d5d5] border-[#f0b9b9]"
  }
};

export function GrandMereLight({ cardigan }: { cardigan: CardiganResult }) {
  const s = STYLES[cardigan.level];
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 ${s.chip}`}
    >
      <span
        className={`h-2.5 w-2.5 rounded-full ${s.dot} ${cardigan.level === "red" ? "animate-pulseRing" : ""}`}
      />
      <span className={`inline-flex items-center gap-1 text-xs font-semibold ${s.text}`}>
        <ShieldAlert className="h-3 w-3" />
        Grand-Mère · {s.label}
      </span>
    </div>
  );
}
