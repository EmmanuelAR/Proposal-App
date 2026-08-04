/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        script: ['"Dancing Script"', 'cursive'],
        sans: ['"Quicksand"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        blush: {
          50: '#fff1f4',
          100: '#ffe2e9',
          200: '#ffc7d6',
          300: '#ff9fb6',
          400: '#ff6690',
          500: '#f7386b',
          600: '#e31a54',
          700: '#bf1046',
          800: '#9f1140',
          900: '#87113c',
          950: '#4b041c',
        },
      },
      animation: {
        'pulse-heart': 'pulse-heart 1.4s ease-in-out infinite',
        'float-slow': 'float-slow 6s ease-in-out infinite',
      },
      keyframes: {
        'pulse-heart': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.15)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
    },
  },
  plugins: [],
}
