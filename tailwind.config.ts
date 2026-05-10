import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        'bg-deep': '#070B14',
        'bg-card': '#0D1628',
        'bg-glass': 'rgba(255,255,255,0.04)',
        'accent-coral': '#FF6B6B',
        'accent-teal': '#00E5CC',
        'accent-gold': '#FFB830',
        'accent-purple': '#7C5CFC',
        'text-primary': '#F0F4FF',
        'text-muted': '#6B7A9F',
      },
      fontFamily: {
        display: ['var(--font-syne)', 'sans-serif'],
        body: ['var(--font-dm-sans)', 'sans-serif'],
        mono: ['var(--font-space-mono)', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'card-gradient': 'linear-gradient(135deg, rgba(13,22,40,0.9) 0%, rgba(7,11,20,0.95) 100%)',
      },
      boxShadow: {
        'glow-coral': '0 0 40px rgba(255,107,107,0.3)',
        'glow-teal': '0 0 40px rgba(0,229,204,0.3)',
        'glow-gold': '0 0 40px rgba(255,184,48,0.3)',
        'card': '0 4px 24px rgba(0,0,0,0.4)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'count-up': 'countUp 1s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        countUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
export default config
