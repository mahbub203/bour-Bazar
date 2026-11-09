/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bazar: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        cream: {
          50: '#fdfbf7',
          100: '#fbf8ef',
          200: '#f7f1df',
          300: '#f1e6c7',
          400: '#ebd8a8',
          500: '#e3c683',
        },
        accent: {
          orange: '#ea580c',
          amber: '#f59e0b',
          warm: '#d97706',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Hind Siliguri"', 'system-ui', 'sans-serif'],
        bangla: ['"Hind Siliguri"', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
        'card': '0 4px 20px -2px rgba(16, 185, 129, 0.08), 0 2px 8px -2px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
