import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "var(--font-nunito)",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif"
        ],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"]
      },
      colors: {
        seine: {
          bg: "#fdf3e3",
          card: "#fffdf8",
          ink: "#2a1c10",
          muted: "#8a7060",
          border: "#e6d0a8",
          header: "#f5c048",
          headerInk: "#2c1600",
          accent: "#c25f1a",
          crepe: "#c98a2a",
          glace: "#e8703a",
          ok: "#5a8042",
          warn: "#b87020",
          danger: "#b03830",
          chip: "#d8e3b0",
          chipInk: "#3a5220",
          peach: "#f5d5b0",
          peachInk: "#7a4010",
          sage: "#cfe0b0",
          sageInk: "#3c5a2a",
          rose: "#f4cfc0",
          roseInk: "#7a2a2a",
          cream: "#fdeecf",
          creamInk: "#6a4a1a"
        }
      },
      boxShadow: {
        card: "0 1px 3px rgba(42,28,16,0.05), 0 8px 28px rgba(42,28,16,0.09)"
      },
      keyframes: {
        pulseRing: {
          "0%": { boxShadow: "0 0 0 0 rgba(176,56,48,0.55)" },
          "70%": { boxShadow: "0 0 0 12px rgba(176,56,48,0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(176,56,48,0)" }
        }
      },
      animation: {
        pulseRing: "pulseRing 1.8s cubic-bezier(0.4,0,0.6,1) infinite"
      }
    }
  },
  plugins: []
};

export default config;
