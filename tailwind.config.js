/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        shell: "#AEB9D1",
        app: "#F3F3F4",
        navy: "#262540",
        navy2: "#25243F",
        ink: "#111827",
        muted: "#6B7280",
        divider: "#DADDE3",
        lavender: "#B79BFF",
        peach: "#FFE2B6",
        lime: "#ECFF32",
        danger: "#FF4D4D",
      },
      fontFamily: {
        sans: ["Inter", "Manrope", "Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 18px 55px rgba(31, 35, 55, 0.12)",
        card: "0 12px 30px rgba(31, 35, 55, 0.08)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};
