import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  "#f0f4f9",
          100: "#dbe5f2",
          200: "#90b0d9",
          500: "#3b6bb8",
          600: "#1E3A8A",
          700: "#172d6b",
          800: "#0f1d47",
          900: "#0b132e",
        },
        dark: {
          900: "#080e21",
          800: "#0e1837",
          700: "#13214a",
        },
        accent: {
          glow: "rgba(30, 58, 138, 0.15)",
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        premium: "0 10px 40px -10px rgba(30, 58, 138, 0.12)",
        glow: "0 0 20px rgba(16, 185, 129, 0.2)",
      }
    },
  },
  plugins: [],
};

export default config;
