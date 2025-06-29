/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      colors: {
        primary: {
          light: '#3C82F6',
          dark: '#22D3EE',
        },
        secondary: {
          light: '#A855F7',
          dark: '#F472B6',
        },
        accent: {
          light: '#84CC16',
          dark: '#84CC16',
        },
        background: {
          light: '#F9FAFB',
          dark: '#111827',
        },
        card: {
          light: '#FFFFFF',
          dark: '#1F2937',
        },
        text: {
          light: '#1F2937',
          dark: '#E5E7EB',
        },
        error: '#F43F5E',
        success: '#10B981',
        warning: '#F59E0B',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 20px rgb(34, 211, 238, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgb(34, 211, 238, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}