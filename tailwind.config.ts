import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.5rem",
        md: "2rem",
        xl: "2.5rem",
      },
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        background: "#0B0F19",
        foreground: "#E5E7EB",
        primary: {
          DEFAULT: "#4F46E5",
          soft: "#6366F1",
        },
        accent: {
          DEFAULT: "#A855F7",
          soft: "#C084FC",
        },
        muted: "#9CA3AF",
        border: "rgba(229, 231, 235, 0.12)",
        surface: {
          DEFAULT: "#121826",
          elevated: "#161E31",
        },
      },
      boxShadow: {
        glow: "0 24px 80px -28px rgba(79, 70, 229, 0.45)",
        accent: "0 24px 80px -32px rgba(168, 85, 247, 0.42)",
        soft: "0 18px 60px -24px rgba(11, 15, 25, 0.65)",
      },
      fontFamily: {
        body: ["var(--font-inter)"],
        display: ["var(--font-space-grotesk)"],
      },
      fontSize: {
        "display-2xl": [
          "5.5rem",
          {
            lineHeight: "0.92",
            letterSpacing: "-0.05em",
            fontWeight: "700",
          },
        ],
        "display-xl": [
          "4.25rem",
          {
            lineHeight: "0.96",
            letterSpacing: "-0.045em",
            fontWeight: "700",
          },
        ],
        "display-lg": [
          "3.25rem",
          {
            lineHeight: "1",
            letterSpacing: "-0.04em",
            fontWeight: "700",
          },
        ],
        "body-lg": [
          "1.125rem",
          {
            lineHeight: "1.8",
            letterSpacing: "-0.01em",
          },
        ],
        "body-base": [
          "1rem",
          {
            lineHeight: "1.75",
            letterSpacing: "-0.01em",
          },
        ],
        "body-sm": [
          "0.9375rem",
          {
            lineHeight: "1.6",
            letterSpacing: "-0.01em",
          },
        ],
      },
      letterSpacing: {
        display: "-0.05em",
      },
      spacing: {
        section: "8rem",
        "section-sm": "5rem",
        gutter: "1.5rem",
        18: "4.5rem",
        22: "5.5rem",
        30: "7.5rem",
      },
      maxWidth: {
        content: "72rem",
        prose: "46rem",
        wide: "90rem",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #4F46E5 0%, #A855F7 100%)",
        "hero-glow":
          "radial-gradient(circle at top, rgba(79, 70, 229, 0.28), transparent 38%), radial-gradient(circle at 85% 15%, rgba(168, 85, 247, 0.16), transparent 24%)",
        grid:
          "linear-gradient(rgba(229, 231, 235, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(229, 231, 235, 0.04) 1px, transparent 1px)",
        "surface-gradient":
          "linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%)",
      },
      backgroundSize: {
        grid: "36px 36px",
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
