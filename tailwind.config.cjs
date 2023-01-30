/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "teko": "Teko, monospace",
        "sans": "'Fira Sans Condensed', sans-serif",
      }
    },
  },
  plugins: [],
}
