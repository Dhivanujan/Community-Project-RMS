/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        // Deep Navy (Primary)
        primary: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#243b53',
          900: '#1e3a5f', // Core Navy
          950: '#102a43',
        },
        // Gold/Amber (Secondary)
        secondary: {
          50: '#fdf8ec',
          100: '#faefd0',
          200: '#f5dfa2',
          300: '#eecb6d',
          400: '#e7b53e',
          500: '#d4af37', // Core Gold
          600: '#c27e12',
          700: '#9b5a12',
          800: '#7e4616',
          900: '#663a15',
          950: '#3b1e07',
        },
        // Standard semantic colors
        background: '#F8FAFC',
        surface: '#FFFFFF',
        textDark: '#0F172A',
        textMuted: '#64748B',
        border: '#E2E8F0',
        // Legacy colors to maintain compatibility during refactor
        primaryHover: '#102a43',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        fadeInUp: 'fadeInUp 0.6s ease-out forwards',
        fadeIn: 'fadeIn 0.8s ease-out forwards',
        float: 'float 4s ease-in-out infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    }
  },
  plugins: [],
}