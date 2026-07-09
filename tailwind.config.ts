import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
        },
        dark: {
          900: "#090514",
          800: "#120b24",
          700: "#1a1235",
        },
        accent: {
          glow: "rgba(124, 58, 237, 0.15)",
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        premium: "0 10px 40px -10px rgba(124, 58, 237, 0.12)",
        glow: "0 0 20px rgba(16, 185, 129, 0.2)",
      }
    },
  },
  plugins: [],
};

export default config;
