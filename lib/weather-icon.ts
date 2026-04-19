import { Cloud, CloudDrizzle, CloudRain, CloudSun, Sun } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export function pickWeatherIcon(cloudCoverPct: number, precipProbPct: number): LucideIcon {
  if (precipProbPct >= 60) return CloudRain;
  if (precipProbPct >= 30) return CloudDrizzle;
  if (cloudCoverPct < 25) return Sun;
  if (cloudCoverPct < 60) return CloudSun;
  return Cloud;
}

export function describeSky(cloudCoverPct: number, precipProbPct: number): string {
  if (precipProbPct >= 60) return "Pluvieux";
  if (precipProbPct >= 30) return "Averses";
  if (cloudCoverPct < 25) return "Soleil";
  if (cloudCoverPct < 60) return "Éclaircies";
  return "Nuageux";
}
