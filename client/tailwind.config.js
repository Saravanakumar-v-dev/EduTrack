/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // 👈 Add this line to enable class-based dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3B82F6",     // blue accent for buttons & highlights
        secondary: "#1E293B",   // dark background tone
        accent: "#FACC15",      // yellow accent for highlights
        background: "#F8FAFC",  // light gray dashboard bg
        card: "#FFFFFF",        // card color
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 14px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
};
