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
        'instamart-green': '#10B981',
        'instamart-red': '#EF4444',
        'instamart-blue': '#3B82F6',
        'instamart-gray': '#6B7280',
      }
    },
  },
  plugins: [],
} 