/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'swiggy-orange': '#FC8019',
        'swiggy-red': '#E53E3E',
        'swiggy-dark': '#1A202C',
        'swiggy-light': '#F7FAFC',
        'swiggy-gray': '#4A5568',
        'swiggy-success': '#38A169',
        'swiggy-warning': '#D69E2E',
        'swiggy-error': '#E53E3E',
        'swiggy-primary': '#FC8019',
        'swiggy-secondary': '#2D3748',
      }
    },
  },
  plugins: [],
} 