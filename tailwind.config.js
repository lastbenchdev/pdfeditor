/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{html,ts,tsx,js,jsx}',
    './src/app/**/*.{html,ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
        },
        accent: 'var(--color-accent)',
        'brand-primary': 'var(--color-brand-primary)',
        'brand-accent': 'var(--color-brand-accent)',
        'brand-glow': 'var(--color-brand-glow)',
        main: 'var(--bg-main)',
        surface: 'var(--bg-surface)',
        card: 'var(--bg-card)',
      },
      backgroundColor: {
        'main': 'var(--bg-main)',
        'surface': 'var(--bg-surface)',
        'card': 'var(--bg-card)',
      },
      textColor: {
        'main': 'var(--text-main)',
        'muted': 'var(--text-muted)',
      },
      borderColor: {
        'main': 'var(--border-main)',
      },
      boxShadow: {
        'card': 'var(--shadow-card)',
        'glass': '0 8px 32px rgba(31, 38, 135, 0.37)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'slide-down': 'slideDown 0.3s ease-out',
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        slideDown: {
          '0%': {
            opacity: '0',
            transform: 'translateY(-10px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        pulseGlow: {
          '0%, 100%': {
            opacity: '1',
          },
          '50%': {
            opacity: '0.8',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}
