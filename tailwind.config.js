/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: { bg: "#0b1220", panel: "#111827", accent: "#7c3aed" },
      boxShadow: { soft: "0 10px 25px -10px rgba(0,0,0,.4)" }
    },
  },
  plugins: [],
}
