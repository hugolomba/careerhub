/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f4f6fa',
          100: '#e6eaf2',
          200: '#c7d0e0',
          300: '#9fadc7',
          400: '#6b7da3',
          500: '#4a5d85',
          600: '#33435f',
          700: '#263349',
          800: '#1b2434',
          900: '#121822',
          950: '#0a0d13',
        },
      },
      fontFamily: {
        sans: ['"Inter var"', 'Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 2px 0 rgb(15 23 42 / 0.04), 0 8px 24px -8px rgb(15 23 42 / 0.10)',
        glow: '0 0 0 1px rgb(51 67 95 / 0.08), 0 12px 40px -12px rgb(51 67 95 / 0.35)',
      },
      keyframes: {
        blob: {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(20px, -30px) scale(1.08)' },
          '66%': { transform: 'translate(-15px, 15px) scale(0.95)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        blob: 'blob 9s infinite ease-in-out',
        float: 'float 5s ease-in-out infinite',
        'fade-up': 'fade-up 0.6s ease-out both',
      },
    },
  },
  plugins: [],
}
