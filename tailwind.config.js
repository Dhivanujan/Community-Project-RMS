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
        primary: '#2563EB',
        primaryHover: '#1D4ED8',
        background: '#F9FAFB',
        surface: '#FFFFFF',
        textDark: '#111827',
        textMuted: '#6B7280',
        border: '#E5E7EB'
      }
    }
  },
  plugins: [],
}