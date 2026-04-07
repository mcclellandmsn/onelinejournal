/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Fraunces"', "Georgia", "serif"],
        sans: ['"Source Sans 3"', "system-ui", "sans-serif"],
      },
      colors: {
        paper: {
          DEFAULT: "#faf6ef",
          dark: "#f0e8d8",
        },
        ink: {
          DEFAULT: "#2c2825",
          muted: "#6b6560",
        },
        accent: {
          DEFAULT: "#6b5344",
          light: "#8a7263",
        },
      },
    },
  },
  plugins: [],
};
