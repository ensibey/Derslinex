import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          500: "#3b82f6",
          600: "#1A56DB",
          700: "#1d4ed8",
          800: "#1e3a8a",
          900: "#1e3a5f",
        },
        green: {
          600: "#057A55",
          700: "#046c4e",
        },
        orange: {
          600: "#C2410C",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
