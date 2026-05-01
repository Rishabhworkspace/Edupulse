/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        /* ── Primary Accent: Coral ─────────────────────── */
        primary: {
          DEFAULT: '#F4845F',
          hover: '#D9613E',
          light: '#FDE8DF',
          dark: '#D9613E',
        },
        /* ── Secondary Accent: Sage Green ──────────────── */
        green: {
          DEFAULT: '#8DB580',
          light: '#E4F0E0',
          dark: '#6A9460',
        },
        /* ── Color Block Palette (photo backgrounds) ───── */
        block: {
          teal: '#7EC8C8',
          yellow: '#F5D770',
          lavender: '#C4B5E8',
          coral: '#F4A98A',
          mint: '#A8D8B9',
        },
        /* ── Semantic ──────────────────────────────────── */
        success: { DEFAULT: '#10B981', light: '#D1FAE5', dark: '#34D399' },
        danger:  { DEFAULT: '#EF4444', light: '#FEE2E2', dark: '#F87171' },
        info:    { DEFAULT: '#3B82F6', light: '#DBEAFE', dark: '#60A5FA' },
        warning: { DEFAULT: '#D97706', light: '#FEF3C7' },
      },
      fontFamily: {
        display: ['Fraunces', 'Playfair Display', 'Georgia', 'serif'],
        body:    ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      borderRadius: {
        pill: '9999px',
        card: '20px',
        blob: '60% 40% 55% 45% / 50% 45% 55% 50%',
      },
      animation: {
        shimmer: 'shimmer 1.2s ease-in-out infinite',
        'fade-in': 'fadeIn 200ms ease-out',
        'slide-up': 'slideUp 200ms ease-out',
        float: 'float 4s ease-in-out infinite',
        'fade-slide-up': 'fadeSlideUp 0.6s ease forwards',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-400% 0' },
          '100%': { backgroundPosition: '400% 0' },
        },
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: {
          from: { opacity: 0, transform: 'translateY(8px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        fadeSlideUp: {
          from: { opacity: 0, transform: 'translateY(24px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        card: '0 4px 24px rgba(26, 26, 46, 0.08)',
        'card-hover': '0 8px 32px rgba(26, 26, 46, 0.14)',
        'cta-glow': '0 4px 16px rgba(244, 132, 95, 0.35)',
        raised: '0 2px 12px rgba(26, 26, 46, 0.06)',
      },
    },
  },
  plugins: [],
};
