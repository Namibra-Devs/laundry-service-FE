/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        custom_yellow: "#ffde21",
        custom_yellow_dark: "#bfa719",
        custom_yellow_fade: "#fffce9",
        dark: "#1a1a1a",
        custom_blue: "#18a0fb",
        // custom_blue_fade: "",
        custom_green: "#007f6d",
        // custom_green_fade: "#d9f2ef",

        ash_light: "#f7f7f7",
        ash_dark: "#fffce94d",

        danger: "#a92200",
        success: "#00a991",
      },
    },
  },
  plugins: [],
};
