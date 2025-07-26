/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Simplified dark theme colors
        'dark': {
          'bg': '#0f0f23', // Deep dark blue background
          'card': '#1a1a2e', // Slightly lighter for cards
          'border': '#2d2d44', // Subtle borders
          'hover': '#252545', // Hover states
        },
        'success': {
          500: '#10b981', // Green for positive metrics
          600: '#059669',
        },
        'error': {
          500: '#ef4444', // Red for negative metrics
          600: '#dc2626',
        },
        'accent': {
          500: '#3b82f6', // Blue for links and highlights
          600: '#2563eb',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.3)',
        'medium': '0 4px 16px rgba(0, 0, 0, 0.4)',
        'large': '0 8px 32px rgba(0, 0, 0, 0.5)',
      },
      borderRadius: {
        'xl': '1rem', '2xl': '1.5rem', '3xl': '2rem',
      }
    },
  },
  plugins: [],
} 