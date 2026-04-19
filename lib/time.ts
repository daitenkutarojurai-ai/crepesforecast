export function resolveTargetSunday(now: Date): Date {
  const d = new Date(now);
  const weekday = d.getDay();
  const daysUntilSunday = weekday === 0 ? 0 : 7 - weekday;
  d.setDate(d.getDate() + daysUntilSunday);
  d.setHours(10, 0, 0, 0);
  return d;
}

export function formatSundayLong(target: Date): string {
  return target.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long"
  });
}

export function formatRefreshedAt(iso: string): string {
  return new Date(iso).toLocaleString("fr-FR", {
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "short"
  });
}

export function toYmd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
