/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Define custom colors based on your CSS (e.g., from places-style.css)
      colors: {
        'brand-light': '#f8f1ec', // Background color
        'brand-primary': '#eebe2d', // Yellow button color
        'brand-secondary': '#3e575b', // Dark button/box-shadow color
      }
    },
  },
  plugins: [],
}