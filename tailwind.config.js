/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    // extend tailwind's default theme
    extend: {
      colors: {
        // brand palette — tweak these freely
        brand: {
          DEFAULT: "#0d0d0d",
          light: "#1a1a1a",
          dark: "#000000",
          accent: "#0ea5e9",
          muted: "#e5e7eb",
        },
        surface: {
          light: "#ffffff",
          dark: "#f8fafc",
        },
      },

      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },

      maxWidth: {
        "7xl": "90rem",
        "8xl": "100rem",
      },

      screens: {
        "3xl": "1920px",
      },

      // rounded corners and shadow depth
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
  darkMode: "class", // we'll use this later for dark theme toggle
};
