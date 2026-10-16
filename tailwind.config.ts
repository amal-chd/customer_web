import animate from "tailwindcss-animate";
import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Mirrors the customer app's AppColors (royal-blue system).
        primary: {
          DEFAULT: "#2563EB",
          dark: "#1D4ED8",
          light: "#3B82F6",
          soft: "#DBEAFE",
        },
        ink: "#1C1C1C",
        sub: "#7A7A85",
        line: "#ECECEF",
        canvas: "#F7F7F8",
        veg: "#267E3E",
        nonveg: "#B02B2B",
        rating: "#267E3E",
        danger: "#E23744",
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.125rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(15,23,42,0.04), 0 10px 24px rgba(15,23,42,0.04)",
        lift: "0 1px 2px rgba(15,23,42,0.05), 0 18px 42px rgba(37,99,235,0.10)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        shimmer: "shimmer 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [animate],
} satisfies Config;
