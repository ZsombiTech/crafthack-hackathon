/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      "dark-light": "#262536",
      "dark-lightest": "#323047",
      primary: "#673AB7",
      accent: "#FF4081",
      secondary: "#D1C4E9",
      background: "#F3F3F3",
      red: "#E50606",
      "red-lightest": "#F44B4B",
      "accent-lightest": "#fc72a1",
      green: "#16a34a",
      "green-lightest": "#86efac",
    },
    extend: {
      boxShadow: {
        buttonShadowHost: "0px 0px 10px #673AB7",
        buttonShadowJoin: "0px 0px 10px rgba(255, 64, 129, 0.5)",
      },
    },
  },
  plugins: [],
};
