/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#f6f7f4',
          100: '#e8ebe3',
          200: '#d1d7c7',
          300: '#b4bda4',
          400: '#9CA986',
          500: '#7d8a6a',
          600: '#626d53',
          700: '#4e5744',
          800: '#414739',
          900: '#373c31',
        },
        cream: {
          50: '#fdfcfa',
          100: '#F5F1E8',
          200: '#ebe4d5',
          300: '#ddd3bd',
          400: '#cfc0a5',
          500: '#b8a485',
          600: '#a38968',
          700: '#866f56',
          800: '#6f5d49',
          900: '#5c4e3d',
        },
        forest: {
          50: '#f4f6f5',
          100: '#e3e8e5',
          200: '#c7d1cb',
          300: '#a3b3aa',
          400: '#7d9186',
          500: '#60756b',
          600: '#4c5e55',
          700: '#3f4d46',
          800: '#2C3E2E',
          900: '#2a3530',
        },
        terracotta: {
          50: '#faf6f5',
          100: '#f4ebe8',
          200: '#ead9d4',
          300: '#dbbfb6',
          400: '#C17C5B',
          500: '#b8866f',
          600: '#a66e5a',
          700: '#8a5a4b',
          800: '#734c41',
          900: '#5f4137',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
