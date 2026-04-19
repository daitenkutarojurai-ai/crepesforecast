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
          card: "#ffffff",
          ink: "#1f2a3a",
          muted: "#6b7a90",
          border: "#ead9b9",
          header: "#cfe4f0",
          headerInk: "#1a3a52",
          accent: "#3d8ab3",
          crepe: "#d98e46",
          glace: "#7ec1de",
          ok: "#4a8f5a",
          warn: "#c98a2a",
          danger: "#c04545",
          chip: "#bfe0c8",
          chipInk: "#2f5d3a",
          peach: "#f5d8b8"
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
