/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: "#EA5A1F",
          orangeDark: "#C9490F",
          dark: "#141414",
          darker: "#0d0d0d",
          cream: "#F5F0EA",
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
