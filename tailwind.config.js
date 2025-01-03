/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        custom_yellow: "var(--custom-yellow)",
        custom_yellow_dark: "var(--custom-yellow-dark)",
        custom_yellow_fade: "var(--custom-yellow-fade)",
        dark: "var(--custom-dark)",
        ash_dark: "var(--ash-dark)",
      },
    },
  },
  plugins: [],
};
