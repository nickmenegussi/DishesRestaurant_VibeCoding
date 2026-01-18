export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#10B981', // Emerald 500 (Green)
          dark: '#059669',
          light: '#6EE7B7',
          hover: '#059669'
        },
        secondary: {
          DEFAULT: '#1F2937', // Gray 800
          light: '#4B5563'
        },
        accent: {
          DEFAULT: '#F59E0B', // Amber 500
          hover: '#D97706'
        },
        surface: {
          background: '#F9FAFB',
          muted: '#F3F4F6',
        },
        text: {
          main: '#111827',
          muted: '#6B7280',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      animation: {
        'fadeIn': 'fadeIn 0.5s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}


