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
          ink: "#2a2218",
          muted: "#7a6a58",
          border: "#ecd9b3",
          header: "#cfe4f0",
          headerInk: "#1a3a52",
          accent: "#3d8ab3",
          crepe: "#c98a2a",
          glace: "#e6a36b",
          ok: "#6a8f4a",
          warn: "#c07a2a",
          danger: "#b84a3a",
          chip: "#d8e3b8",
          chipInk: "#4a5a2a",
          peach: "#f5d8b8",
          peachInk: "#7a4b10",
          sage: "#cfe0b8",
          sageInk: "#3c5a2a",
          rose: "#f4cfc0",
          roseInk: "#7a2a2a",
          cream: "#fdeecf",
          creamInk: "#6a4a1a"
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
