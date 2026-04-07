/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        // Cassette Futurism Palette
        command: {
          primary: '#00ffff',      // Cyan/teal - classic retro-future
          secondary: '#ff6b35',    // Warm orange - cassette aesthetic  
          accent: '#ffaa00',       // Amber - instrument panel glow
          background: '#0a0a0f',   // Deep blue-black space
          surface: '#1a1a2e',      // Dark blue-gray panels
          text: '#e0e6ed',         // Cool white
          muted: '#6b7280',        // Neutral gray
          border: '#374151',       // Panel borders
          panel: '#0f172a',        // Panel backgrounds
          glow: '#00ffff33',       // Cyan glow
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'monospace'],
        ultra: ['JetBrains Mono', 'SF Mono', 'monospace'],
      },
      fontWeight: {
        'ultra-thin': '100',
        'extra-thin': '200',
        'thin': '300',
      },
      letterSpacing: {
        'ultra-wide': '0.2em',
        'mega-wide': '0.3em',
        'super-wide': '0.4em',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-cyan': 'glowCyan 2s ease-in-out infinite alternate',
        'glow-orange': 'glowOrange 2s ease-in-out infinite alternate',
        'fade-in': 'fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        'scan': 'scan 3s linear infinite',
        'float': 'float 4s ease-in-out infinite',
        'rotate': 'rotate 10s linear infinite',
        'pulse-ring': 'pulseRing 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        glowCyan: {
          '0%': { 
            boxShadow: '0 0 5px rgba(0, 255, 255, 0.4)' 
          },
          '100%': { 
            boxShadow: '0 0 15px rgba(0, 255, 255, 0.6), 0 0 25px rgba(0, 255, 255, 0.3)' 
          }
        },
        glowOrange: {
          '0%': { 
            boxShadow: '0 0 2px rgba(249, 115, 22, 0.3)' 
          },
          '100%': { 
            boxShadow: '0 0 8px rgba(249, 115, 22, 0.5)' 
          }
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        scan: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' }
        },
        rotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        pulseRing: {
          '0%': { 
            transform: 'scale(1)',
            opacity: '1'
          },
          '50%': { 
            transform: 'scale(1.05)',
            opacity: '0.8'
          },
          '100%': { 
            transform: 'scale(1)',
            opacity: '1'
          }
        }
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      }
    },
  },
  plugins: [],
}