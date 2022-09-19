/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  safelist: [
    {
      pattern: /(text|bg)-(blue|indigo|gray|green|red|purple)-(400|500)/,
    },
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        "1/5": "1fr 5fr",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
