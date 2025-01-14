/** @type {import('tailwindcss').Config} */
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        custom_yellow: "#ffde21",
        custom_yellow_dark: "#bfa719",
        custom_yellow_fade: "#fffce9",
        dark: "#1a1a1a",
        custom_blue: "#18a0fb",
        custom_green: "#007f6d",
        ash_light: "#f7f7f7",
        ash_dark: "#fffce94d",
        danger: "#a92200",
        success: "#00a991",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        bounce: "bounce 1.5s ease-in-out infinite",
      },
      keyframes: {
        bounce: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-0.75rem)" },
        },
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
