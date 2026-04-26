import { describe, it, expect } from "vitest";
import {
  computeCardigan,
  computePivot,
  computeBribeOMeter,
  lycraCoefficient,
  napkinForecast,
  buildPulses,
} from "./engine";

// ── computeCardigan ────────────────────────────────────────────────────────────
// Formula: Ct = (T × S) − W   where S = 1.0 (sunny) | 0.5 (cloudy)
// Levels:  > 15 → red  |  > 8 → amber  |  else → green

describe("computeCardigan", () => {
  it("returns green when Ct ≤ 8", () => {
    // 15°C sunny, 8 km/h wind → Ct = (15 × 1.0) − 8 = 7
    const r = computeCardigan(15, true, 8);
    expect(r.level).toBe("green");
    expect(r.value).toBe(7);
  });

  it("returns amber when Ct is between 8 and 15", () => {
    // 20°C cloudy, 2 km/h wind → Ct = (20 × 0.5) − 2 = 8  → still green (> not ≥)
    const borderBelow = computeCardigan(20, false, 2);
    expect(borderBelow.level).toBe("green");

    // 22°C cloudy, 2 km/h wind → Ct = (22 × 0.5) − 2 = 9 → amber
    const amber = computeCardigan(22, false, 2);
    expect(amber.level).toBe("amber");
    expect(amber.value).toBe(9);
  });

  it("returns red when Ct > 15 (Grand-Mère alert)", () => {
    // 32°C sunny, 0 km/h → Ct = (32 × 1.0) − 0 = 32
    const r = computeCardigan(32, true, 0);
    expect(r.level).toBe("red");
    expect(r.value).toBe(32);
  });

  it("handles exact boundary Ct = 15 as amber (not red)", () => {
    // 30°C cloudy, 0 km/h → Ct = (30 × 0.5) − 0 = 15  → amber (> 15 is red)
    const r = computeCardigan(30, false, 0);
    expect(r.level).toBe("amber");
    expect(r.value).toBe(15);
  });

  it("handles wind that pushes a warm day below amber threshold", () => {
    // 20°C sunny, 15 km/h → Ct = (20 × 1.0) − 15 = 5 → green
    const r = computeCardigan(20, true, 15);
    expect(r.level).toBe("green");
    expect(r.value).toBe(5);
  });

  it("rounds the Ct value to 1 decimal place", () => {
    // 15.3°C sunny, 1.2 km/h → Ct = 15.3 − 1.2 = 14.1
    const r = computeCardigan(15.3, true, 1.2);
    expect(r.value).toBe(14.1);
  });
});

// ── computePivot ───────────────────────────────────────────────────────────────
// Formula: Pt = ((T + S) − 21) / 5   where S = +3 (sunny) | 0 (clouds)
// Mode:    < 0 → crepe  |  ≥ 0 → glace  |  > 2 → heatAlert

describe("computePivot", () => {
  it("returns crepe mode when Pt < 0 (cold, cloudy)", () => {
    // 15°C cloudy → Pt = (15 − 21) / 5 = −1.2
    const r = computePivot(15, false);
    expect(r.mode).toBe("crepe");
    expect(r.value).toBe(-1.2);
    expect(r.heatAlert).toBe(false);
  });

  it("returns glace mode when Pt ≥ 0 (warm, sunny)", () => {
    // 22°C sunny → Pt = ((22 + 3) − 21) / 5 = 0.8
    const r = computePivot(22, true);
    expect(r.mode).toBe("glace");
    expect(r.value).toBe(0.8);
    expect(r.heatAlert).toBe(false);
  });

  it("returns heatAlert when Pt > 2", () => {
    // 30°C sunny → Pt = ((30 + 3) − 21) / 5 = 2.4
    const r = computePivot(30, true);
    expect(r.mode).toBe("glace");
    expect(r.heatAlert).toBe(true);
    expect(r.value).toBe(2.4);
  });

  it("handles exact boundary Pt = 0 as glace (not crepe)", () => {
    // 21°C cloudy → Pt = (21 − 21) / 5 = 0
    const r = computePivot(21, false);
    expect(r.mode).toBe("glace");
    expect(r.value).toBe(0);
  });

  it("handles exact boundary Pt = 2 without heatAlert", () => {
    // Pt = 2: (T + 3 − 21) / 5 = 2 → T = 28°C sunny
    const r = computePivot(28, true);
    expect(r.value).toBe(2);
    expect(r.heatAlert).toBe(false);
  });

  it("sun factor adds 3°C worth to pivot (clouds vs sunny at same temp)", () => {
    const cloudy = computePivot(25, false);
    const sunny  = computePivot(25, true);
    expect(sunny.value - cloudy.value).toBeCloseTo(0.6, 5); // 3/5 = 0.6
  });
});

// ── computeBribeOMeter ─────────────────────────────────────────────────────────
// Formula: Bm = (dist_parking / avg_child_age) × fatigue
// Constants: dist=180m, age=6y, fatigue=1.4  → Bm = (180/6) × 1.4 = 42

describe("computeBribeOMeter", () => {
  const sunday = new Date("2026-04-27T10:00:00Z");

  it("produces the expected constant value", () => {
    const r = computeBribeOMeter(sunday);
    expect(r.value).toBe(42);
  });

  it("is always active", () => {
    const r = computeBribeOMeter(sunday);
    expect(r.active).toBe(true);
  });

  it("sets bribe window to 16:00–17:30 of the target date", () => {
    const r = computeBribeOMeter(sunday);
    const start = new Date(r.window.startISO);
    const end   = new Date(r.window.endISO);
    expect(start.getHours()).toBe(16);
    expect(start.getMinutes()).toBe(0);
    expect(end.getHours()).toBe(17);
    expect(end.getMinutes()).toBe(30);
  });
});

// ── lycraCoefficient ───────────────────────────────────────────────────────────

describe("lycraCoefficient", () => {
  it("returns 0 when cold and rainy", () => {
    const r = lycraCoefficient(3, 0, false, 100);
    expect(r.coefficient).toBe(0);
  });

  it("increases with warm sunny weather", () => {
    const cold = lycraCoefficient(10, 5, false, 0);
    const warm = lycraCoefficient(25, 5, true, 0);
    expect(warm.coefficient).toBeGreaterThan(cold.coefficient);
  });

  it("high wind reduces coefficient", () => {
    const calm  = lycraCoefficient(20, 0,  true, 0);
    const windy = lycraCoefficient(20, 30, true, 0);
    expect(windy.coefficient).toBeLessThan(calm.coefficient);
  });
});

// ── napkinForecast ─────────────────────────────────────────────────────────────

describe("napkinForecast", () => {
  it("defaults to moderate when risk is undefined", () => {
    const r = napkinForecast();
    expect(r.risk).toBe("moderate");
  });

  it("respects explicit risk levels", () => {
    expect(napkinForecast("low").risk).toBe("low");
    expect(napkinForecast("high").risk).toBe("high");
  });
});

// ── buildPulses ────────────────────────────────────────────────────────────────

describe("buildPulses", () => {
  const sunday = new Date("2026-04-27T00:00:00Z");

  it("returns pulses sorted chronologically", () => {
    const pulses = buildPulses(sunday);
    for (let i = 1; i < pulses.length; i++) {
      expect(new Date(pulses[i].timeISO).getTime()).toBeGreaterThanOrEqual(
        new Date(pulses[i - 1].timeISO).getTime()
      );
    }
  });

  it("includes SNCF pulse only when delay > 15 min", () => {
    const without = buildPulses(sunday, 0);
    const with15  = buildPulses(sunday, 15);
    const with16  = buildPulses(sunday, 16);

    expect(without.find(p => p.id === "sncf-captive")).toBeUndefined();
    expect(with15.find(p => p.id === "sncf-captive")).toBeUndefined();
    expect(with16.find(p => p.id === "sncf-captive")).toBeDefined();
  });

  it("all pulse times fall within the shift window (14:00–19:00)", () => {
    const pulses = buildPulses(sunday);
    for (const p of pulses) {
      const h = new Date(p.timeISO).getHours();
      expect(h).toBeGreaterThanOrEqual(14);
      expect(h).toBeLessThan(19);
    }
  });
});
