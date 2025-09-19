
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: { gsbg: "#3E4636", gspaper: "#FFF0DD" },
      borderRadius: { "2xl": "1rem" },
      boxShadow: { soft: "0 8px 30px rgba(0,0,0,0.08)" }
    },
  },
  plugins: [],
}
