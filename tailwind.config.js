/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        script: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', 'system-ui', 'sans-serif'],
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
        gold: {
          200: '#f6e2b3',
          300: '#f0d08c',
          400: '#e6b25c',
          500: '#d99a3d',
          600: '#b97b28',
        },
      },
      animation: {
        'pulse-heart': 'pulse-heart 1.4s ease-in-out infinite',
        'float-slow': 'float-slow 6s ease-in-out infinite',
        'blob-1': 'blob-1 16s ease-in-out infinite',
        'blob-2': 'blob-2 20s ease-in-out infinite',
        'blob-3': 'blob-3 24s ease-in-out infinite',
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
        'blob-1': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(6%, 8%) scale(1.08)' },
          '66%': { transform: 'translate(-4%, 4%) scale(0.96)' },
        },
        'blob-2': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(-8%, 5%) scale(1.05)' },
          '66%': { transform: 'translate(5%, -6%) scale(0.94)' },
        },
        'blob-3': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(5%, -8%) scale(0.95)' },
          '66%': { transform: 'translate(-6%, 5%) scale(1.06)' },
        },
      },
    },
  },
  plugins: [],
}
