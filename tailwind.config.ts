import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"]
      },
      colors: {
        mission: {
          bg: "#05070b",
          panel: "#0b1018",
          panel2: "#101723",
          border: "#1b2433",
          ink: "#e6edf7",
          muted: "#8a97ac",
          accent: "#22d3ee",
          warn: "#f59e0b",
          danger: "#ef4444",
          ok: "#10b981",
          crepe: "#f59e0b",
          glace: "#38bdf8"
        }
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(34,211,238,0.25), 0 0 24px rgba(34,211,238,0.15)",
        danger: "0 0 0 1px rgba(239,68,68,0.35), 0 0 24px rgba(239,68,68,0.2)"
      },
      keyframes: {
        pulseRing: {
          "0%": { boxShadow: "0 0 0 0 rgba(239,68,68,0.55)" },
          "70%": { boxShadow: "0 0 0 14px rgba(239,68,68,0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(239,68,68,0)" }
        },
        ticker: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" }
        }
      },
      animation: {
        pulseRing: "pulseRing 1.8s cubic-bezier(0.4,0,0.6,1) infinite",
        ticker: "ticker 40s linear infinite"
      }
    }
  },
  plugins: []
};

export default config;
