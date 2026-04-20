import { toYmd } from "./time";

export const SHIFT_START_HOUR = 14;
export const SHIFT_END_HOUR = 19;

export type WorkingDayKind = "saturday" | "sunday" | "holiday";

export interface WorkingDay {
  date: Date;
  ymd: string;
  weekday: number;
  kind: WorkingDayKind;
  holidayName?: string;
}

function computeEaster(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

function holidaysForYear(year: number): Map<string, string> {
  const easter = computeEaster(year);
  const map = new Map<string, string>();
  const set = (d: Date, name: string) => map.set(toYmd(d), name);

  set(new Date(year, 0, 1), "Jour de l'An");
  set(addDays(easter, 1), "Lundi de Pâques");
  set(new Date(year, 4, 1), "Fête du Travail");
  set(new Date(year, 4, 8), "Victoire 1945");
  set(addDays(easter, 39), "Ascension");
  set(addDays(easter, 50), "Lundi de Pentecôte");
  set(new Date(year, 6, 14), "Fête nationale");
  set(new Date(year, 7, 15), "Assomption");
  set(new Date(year, 10, 1), "Toussaint");
  set(new Date(year, 10, 11), "Armistice 1918");
  set(new Date(year, 11, 25), "Noël");

  return map;
}

export function holidayNameFor(d: Date): string | undefined {
  return holidaysForYear(d.getFullYear()).get(toYmd(d));
}

function kindFor(d: Date): WorkingDayKind | null {
  const wd = d.getDay();
  if (wd === 6) return "saturday";
  if (wd === 0) return "sunday";
  if (holidayNameFor(d)) return "holiday";
  return null;
}

function anchor(d: Date): Date {
  const r = new Date(d);
  r.setHours(SHIFT_START_HOUR, 0, 0, 0);
  return r;
}

function build(d: Date, kind: WorkingDayKind): WorkingDay {
  const date = anchor(d);
  return {
    date,
    ymd: toYmd(date),
    weekday: date.getDay(),
    kind,
    holidayName: kind === "holiday" ? holidayNameFor(date) : undefined
  };
}

export function resolveNextWorkingDay(now: Date): WorkingDay {
  const cutoff = new Date(now);
  cutoff.setHours(SHIFT_END_HOUR, 0, 0, 0);
  const start = now.getTime() < cutoff.getTime() ? new Date(now) : addDays(now, 1);
  for (let i = 0; i < 14; i++) {
    const d = addDays(start, i);
    const kind = kindFor(d);
    if (kind) return build(d, kind);
  }
  return build(start, "sunday");
}

export function nextWorkingDayOfKind(
  now: Date,
  kind: WorkingDayKind,
  horizonDays = 14
): WorkingDay | null {
  const cutoff = new Date(now);
  cutoff.setHours(SHIFT_END_HOUR, 0, 0, 0);
  const start = now.getTime() < cutoff.getTime() ? new Date(now) : addDays(now, 1);
  for (let i = 0; i < horizonDays; i++) {
    const d = addDays(start, i);
    const actual = kindFor(d);
    if (!actual) continue;
    if (actual === kind) return build(d, actual);
  }
  return null;
}

export interface AvailableDays {
  saturday: WorkingDay | null;
  sunday: WorkingDay | null;
  holiday: WorkingDay | null;
}

export function availableWorkingDays(now: Date, horizonDays = 14): AvailableDays {
  return {
    saturday: nextWorkingDayOfKind(now, "saturday", horizonDays),
    sunday: nextWorkingDayOfKind(now, "sunday", horizonDays),
    holiday: nextWorkingDayOfKind(now, "holiday", horizonDays)
  };
}

export function nextWorkingDays(now: Date, horizonDays = 8): WorkingDay[] {
  const out: WorkingDay[] = [];
  const cutoff = new Date(now);
  cutoff.setHours(SHIFT_END_HOUR, 0, 0, 0);
  const start = now.getTime() < cutoff.getTime() ? new Date(now) : addDays(now, 1);
  for (let i = 0; i < horizonDays; i++) {
    const d = addDays(start, i);
    const kind = kindFor(d);
    if (kind) out.push(build(d, kind));
  }
  return out;
}

export function formatWorkingDayLabel(wd: WorkingDay): string {
  const weekday = wd.date.toLocaleDateString("fr-FR", { weekday: "long" });
  const dm = wd.date.toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
  if (wd.holidayName) return `${weekday} ${dm} · ${wd.holidayName}`;
  return `${weekday} ${dm}`;
}

export function isWithinShift(d: Date): boolean {
  const h = d.getHours();
  return h >= SHIFT_START_HOUR && h < SHIFT_END_HOUR;
}
