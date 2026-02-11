/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
      colors: {
        primary: "#111111",
        secondary: "#f3f4f6",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        premium: {
          primary: "#111111",
          secondary: "#f3f4f6",
          accent: "#6366f1",
          neutral: "#1f2933",
          "base-100": "#ffffff",
        },
      },
    ],
  },
};
