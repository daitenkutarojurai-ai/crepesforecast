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
          bg: "#fbf1dc",
          card: "#fffcf5",
          ink: "#3a2a1a",
          muted: "#8a7258",
          border: "#ecd9b3",
          header: "#f5d8b8",
          headerInk: "#6a3a12",
          accent: "#c07a2a",
          crepe: "#c98a2a",
          glace: "#e6a36b",
          ok: "#6a8f4a",
          warn: "#c07a2a",
          danger: "#b84a3a",
          chip: "#d8e3b8",
          chipInk: "#4a5a2a",
          peach: "#f5d8b8",
          sage: "#c9d7b0",
          rose: "#f2c7b8"
        }
      },
      boxShadow: {
        card: "0 1px 2px rgba(31,42,58,0.04), 0 8px 24px rgba(31,42,58,0.06)"
      },
      keyframes: {
        pulseRing: {
          "0%": { boxShadow: "0 0 0 0 rgba(192,69,69,0.55)" },
          "70%": { boxShadow: "0 0 0 12px rgba(192,69,69,0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(192,69,69,0)" }
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
