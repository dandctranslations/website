/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#3B5CE6",
          blueDark: "#2B47C4",
          dark: "#0F1729",
          darker: "#0A0F1C",
          tint: "#EEF2FE",
        },
      },
      fontFamily: {
        heading: ['"Barlow Semi Condensed"', "sans-serif"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
      },
      maxWidth: {
        container: "80rem",
      },
    },
  },
  plugins: [],
};
