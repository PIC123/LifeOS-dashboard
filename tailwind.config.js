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
        // Sci-Fi Minimalist Palette
        command: {
          primary: '#60a5fa',      // Glowing light blue
          secondary: '#fb7185',    // Glowing coral/pink
          accent: '#f97316',       // Bright orange
          background: '#1a1a1a',   // Dark gray background
          surface: '#2a2a2a',      // Slightly lighter gray for surfaces
          text: '#ffffff',         // Pure glowing white
          muted: '#888888',        // Muted gray
          border: '#3a3a3a',       // Subtle gray borders
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
        'glow-blue': 'glowBlue 2s ease-in-out infinite alternate',
        'glow-orange': 'glowOrange 2s ease-in-out infinite alternate',
        'fade-in': 'fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        'scan': 'scan 3s linear infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        glowBlue: {
          '0%': { 
            boxShadow: '0 0 2px rgba(96, 165, 250, 0.3)' 
          },
          '100%': { 
            boxShadow: '0 0 8px rgba(96, 165, 250, 0.5)' 
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
        }
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      }
    },
  },
  plugins: [],
}