import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Editorial palette — Early Founders Collective
        ivory: "#F7F2EA",
        bone: "#EFE7DA",
        white: "#FFFFFF",
        ink: "#111111",
        forest: "#23352D",
        taupe: "#A89B8C",
        brass: "#9B7A4A",

        // Semantic helpers
        paper: "#F7F2EA",
        cream: "#EFE7DA",
        line: "#E5DDCC",
        mute: "#5C544A",
        subtle: "#857B6D",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "ui-serif", "Georgia", "serif"],
        display: ["var(--font-serif)", "ui-serif", "Georgia", "serif"],
        hand: ["var(--font-hand)", "cursive"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      fontSize: {
        // Editorial display scale — generous, optically tuned
        "display-2xl": [
          "clamp(3.25rem, 8.2vw, 7rem)",
          { lineHeight: "0.98", letterSpacing: "-0.025em" },
        ],
        "display-xl": [
          "clamp(2.5rem, 6vw, 5rem)",
          { lineHeight: "1.04", letterSpacing: "-0.022em" },
        ],
        "display-lg": [
          "clamp(2rem, 4.6vw, 3.75rem)",
          { lineHeight: "1.08", letterSpacing: "-0.02em" },
        ],
        "display-md": [
          "clamp(1.625rem, 3.2vw, 2.5rem)",
          { lineHeight: "1.14", letterSpacing: "-0.015em" },
        ],
        "display-sm": [
          "clamp(1.25rem, 2.2vw, 1.75rem)",
          { lineHeight: "1.2", letterSpacing: "-0.012em" },
        ],
      },
      maxWidth: {
        editorial: "1240px",
        narrow: "880px",
        prose: "62ch",
      },
      borderRadius: {
        card: "20px",
        soft: "14px",
        pill: "9999px",
      },
      boxShadow: {
        card: "0 1px 0 rgba(17,17,17,0.04), 0 6px 24px -12px rgba(17,17,17,0.10)",
        cardHover:
          "0 1px 0 rgba(17,17,17,0.06), 0 14px 36px -14px rgba(17,17,17,0.16)",
        video:
          "0 30px 80px -30px rgba(17,17,17,0.35), 0 8px 24px -10px rgba(17,17,17,0.18)",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fade: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        rise: "rise 0.9s cubic-bezier(0.22, 1, 0.36, 1) both",
        fade: "fade 1.1s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
