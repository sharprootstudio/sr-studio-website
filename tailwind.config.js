/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        graphite: {
          DEFAULT: '#17191C',
          light: '#1D2024',
          dark: '#111215',
        },
        charcoal: {
          DEFAULT: '#24272B',
          light: '#2D3136',
          dark: '#1C1E22',
        },
        orange: {
          vibrant: '#F07835',
          DEFAULT: '#F07835',
          peach: '#FFAD76',
          dark: '#C85718',
          glow: 'rgba(240, 120, 53, 0.25)',
        },
        warm: {
          white: '#F5F1EB',
          muted: '#E6E1D8',
        },
        muted: {
          grey: '#A5A5A5',
          dark: '#737373',
          border: '#2E3238',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Plus Jakarta Sans', 'Syne', 'sans-serif'],
      },
      boxShadow: {
        'glow-orange': '0 0 30px -5px rgba(240, 120, 53, 0.3)',
        'glow-orange-lg': '0 0 60px -10px rgba(240, 120, 53, 0.4)',
        'card-dark': '0 10px 30px -10px rgba(0, 0, 0, 0.5), 0 0 1px 1px rgba(255, 255, 255, 0.05)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'orange-radial': 'radial-gradient(circle at 50% 0%, rgba(240, 120, 53, 0.15) 0%, transparent 70%)',
      },
      animation: {
        'float-slow': 'float 8s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
}

