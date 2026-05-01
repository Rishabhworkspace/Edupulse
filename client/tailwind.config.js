/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#5C5FEF',
          hover: '#4A4DD4',
          light: '#EEF0FF',
          dark: '#7C7FFF',
        },
        secondary: {
          DEFAULT: '#F59E0B',
          light: '#FEF3C7',
        },
        success: { DEFAULT: '#10B981', light: '#D1FAE5', dark: '#34D399' },
        danger: { DEFAULT: '#EF4444', light: '#FEE2E2', dark: '#F87171' },
        info: { DEFAULT: '#3B82F6', light: '#DBEAFE', dark: '#60A5FA' },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        shimmer: 'shimmer 1.2s ease-in-out infinite',
        'fade-in': 'fadeIn 200ms ease-out',
        'slide-up': 'slideUp 200ms ease-out',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      },
      boxShadow: {
        card: '0 2px 8px rgba(17,24,39,0.06), 0 0 0 1px rgba(17,24,39,0.04)',
        'card-hover': '0 8px 24px rgba(17,24,39,0.12), 0 0 0 1px rgba(17,24,39,0.04)',
        'card-dark': '0 2px 8px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.04)',
      },
    },
  },
  plugins: [],
};
