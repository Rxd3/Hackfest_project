/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        shell: "rgb(var(--color-shell) / <alpha-value>)",
        app: "rgb(var(--color-app) / <alpha-value>)",
        navy: "rgb(var(--color-navy) / <alpha-value>)",
        navy2: "rgb(var(--color-navy-2) / <alpha-value>)",
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        divider: "rgb(var(--color-divider) / <alpha-value>)",
        lavender: "rgb(var(--color-lavender) / <alpha-value>)",
        peach: "rgb(var(--color-peach) / <alpha-value>)",
        lime: "rgb(var(--color-lime) / <alpha-value>)",
        danger: "rgb(var(--color-danger) / <alpha-value>)",
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
