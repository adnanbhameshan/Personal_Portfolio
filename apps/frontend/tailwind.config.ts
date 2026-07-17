import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Space Grotesk", "Inter", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      colors: {
        void: "var(--bg-void)",
        deep: "var(--bg-deep)",
        surface: "var(--bg-surface)",
        elevated: "var(--bg-elevated)",
        "border-subtle": "var(--border-subtle)",
        "border-mid": "var(--border-mid)",
        "border-active": "var(--border-active)",
        primary: "var(--accent-primary)",
        "primary-dim": "var(--accent-primary-dim)",
        "primary-glow": "var(--accent-glow)",
        ai: "var(--ai-primary)",
        "ai-dim": "var(--ai-dim)",
        "ai-glow": "var(--ai-glow)",
        online: "var(--status-online)",
        success: "var(--status-success)",
        amber: "var(--amber)",
        "amber-dim": "var(--amber-dim)",
        rose: "var(--rose)",
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          tertiary: "var(--text-tertiary)",
          disabled: "var(--text-disabled)",
        },
      },
      boxShadow: {
        card: "var(--shadow-card)",
        elevated: "var(--shadow-elevated)",
        "glow-blue": "var(--glow-blue)",
        "glow-cyan": "var(--glow-cyan)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
      },
      transitionTimingFunction: {
        "nexus-out": "var(--ease-out)",
        "nexus-in": "var(--ease-in)",
        "nexus-spring": "var(--ease-spring)",
      },
      animation: {
        "pulse-grid": "pulse-grid 4s ease-out infinite",
        "status-pulse": "status-pulse 2.4s ease-out infinite",
      },
      keyframes: {
        "pulse-grid": {
          "0%, 100%": { opacity: "0.18" },
          "45%": { opacity: "0.34" },
        },
        "status-pulse": {
          "0%": { boxShadow: "0 0 0 0 rgba(16,185,129,0.35)" },
          "70%": { boxShadow: "0 0 0 8px rgba(16,185,129,0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(16,185,129,0)" },
        },
      },
    },
  },
  plugins: [
   typography
  ],
};

export default config;

