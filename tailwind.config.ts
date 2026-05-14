import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0A1628",
          soft: "#162035",
        },
        teal: {
          DEFAULT: "#0B7A75",
          hover: "#096560",
          light: "#E6F4F3",
        },
        gold: {
          DEFAULT: "#C9A54E",
          light: "#FBF4E3",
        },
        cream: "#FAF8F5",
        ink: {
          DEFAULT: "#1A2332",
          secondary: "#4B5563",
          muted: "#9CA3AF",
        },
        line: {
          DEFAULT: "#E8E4DD",
          strong: "#D1CCC4",
        },
        surface: "#F3F1ED",
        success: { DEFAULT: "#059669", bg: "#ECFDF5" },
        danger: { DEFAULT: "#DC2626", bg: "#FEF2F2" },
        warn: { DEFAULT: "#D97706", bg: "#FFFBEB" },
        info: { DEFAULT: "#2563EB", bg: "#EFF6FF" },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      fontSize: {
        display: ["clamp(2.5rem, 5vw, 3.5rem)", { lineHeight: "1.05", letterSpacing: "-0.02em", fontWeight: "700" }],
        h1: ["2.25rem", { lineHeight: "1.15", letterSpacing: "-0.015em", fontWeight: "700" }],
        h2: ["1.625rem", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "700" }],
        h3: ["1.125rem", { lineHeight: "1.35", fontWeight: "600" }],
        h4: ["0.9375rem", { lineHeight: "1.4", fontWeight: "600" }],
        "body-lg": ["1rem", { lineHeight: "1.7" }],
        body: ["0.875rem", { lineHeight: "1.7" }],
        caption: ["0.75rem", { lineHeight: "1.5" }],
        label: ["0.6875rem", { lineHeight: "1.4", letterSpacing: "0.08em", fontWeight: "600" }],
        price: ["1.375rem", { lineHeight: "1.2", fontWeight: "700" }],
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "14px",
        xl: "20px",
        pill: "9999px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
        hover: "0 4px 20px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)",
        modal: "0 20px 60px rgba(0,0,0,0.18)",
        nav: "0 1px 0 rgba(0,0,0,0.08)",
      },
      spacing: {
        section: "96px",
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.22, 0.61, 0.36, 1)",
      },
      animation: {
        "fade-up": "fade-up 600ms cubic-bezier(0.22, 0.61, 0.36, 1) both",
        "fade-in": "fade-in 400ms ease both",
        "marquee": "marquee 40s linear infinite",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "marquee": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
