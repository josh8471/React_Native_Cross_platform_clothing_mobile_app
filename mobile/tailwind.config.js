/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        "primary": "#ac7e0c",
        "background-light": "#f8f7f6",
        "background-dark": "#221d10",
      },
      fontFamily: {
        "display": ["Manrope", "sans-serif"]
      },
    },
  },
  plugins: [],
}
