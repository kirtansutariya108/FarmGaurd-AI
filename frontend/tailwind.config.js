/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        agri: {
          forest: '#134e2c',
          leaf: '#1e7f45',
          lime: '#4ade80',
          earth: '#786951',
          sand: '#f7f5f0',
          warmgray: '#f9f9f7',
          darkbg: '#0f1712',
          darkcard: '#16221b',
          darkborder: '#23362a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'soft': '0 4px 20px -2px rgba(19, 78, 44, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.03)',
        'soft-lg': '0 10px 25px -3px rgba(19, 78, 44, 0.08), 0 4px 10px -2px rgba(0, 0, 0, 0.03)',
        'glow-green': '0 0 25px rgba(34, 197, 94, 0.25)',
      }
    },
  },
  plugins: [],
}
