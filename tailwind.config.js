/** @type {import('tailwindcss').Config} */
module.exports = { 
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: { 
    extend: { 
      colors: { 
        primary: { 
          50: "#ECFEFF",
          100: "#CFFAFE",
          200: "#A5F3FC",
          300: "#67E8F9",
          400: "#22D3EE",
          500: "#0891B2", 
          600: "#0E7490", 
          700: "#0E6469", 
          800: "#155E75", 
          900: "#164E63", 
          950: "#083344",
        }, 
        secondary: { 
          50: "#FFF7ED",
          100: "#FFEDD5",
          200: "#FED7AA",
          300: "#FDBA74",
          400: "#FB923C", 
          500: "#F97316", 
          600: "#EA580C",
          700: "#C2410C",
          800: "#9A3412",
          900: "#7C2D12",
          950: "#431407",
        },
        // Cores complementares
        teal: {
          50: "#F0FDFA",
          100: "#CCFBF1",
          200: "#99F6E4",
          300: "#5EEAD4",
          400: "#2DD4BF",
          500: "#14B8A6",
          600: "#0D9488",
          700: "#0F766E",
          800: "#115E59",
          900: "#134E4A",
          950: "#042F2E",
        },
        amber: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
          800: "#92400E",
          900: "#78350F",
          950: "#451A03",
        },
        rose: {
          50: "#FFF1F2",
          100: "#FFE4E6",
          200: "#FECDD3",
          300: "#FDA4AF",
          400: "#FB7185",
          500: "#F43F5E",
          600: "#E11D48",
          700: "#BE123C",
          800: "#9F1239",
          900: "#881337",
          950: "#4C0519",
        },
        slate: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
          950: "#020617",
        },
        beach: {
          sand: "#F2D7A9",
          water: "#00A8E8",
          coral: "#FF8C66",
          sunset: "#FF4365",
        },
      },
      fontFamily: {
        sans: [
          'Inter var', 
          'Inter', 
          'ui-sans-serif', 
          'system-ui', 
          '-apple-system', 
          'sans-serif'
        ],
        display: [
          'Montserrat', 
          'Inter var',
          'sans-serif'
        ],
      },
      backgroundImage: {
        'wave-pattern': "url('/images/wave-pattern.svg')",
        'beach-gradient': "linear-gradient(to bottom, rgba(8, 145, 178, 0.9), rgba(14, 165, 233, 0.7))",
        'sunset-gradient': "linear-gradient(135deg, #F97316 0%, #FB923C 35%, #FBBF24 100%)",
        'ocean-gradient': "linear-gradient(to bottom, #0891B2 0%, #0EA5E9 50%, #22D3EE 100%)",
        'dot-pattern': "radial-gradient(#94A3B8 1px, transparent 1px)",
      },
      animation: {
        'wave': 'wave 15s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-light': 'pulse-light 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        wave: {
          '0%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(-25%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-light': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 },
        },
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      backdropBlur: {
        xs: '2px',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: '#334155',
            h2: {
              fontWeight: '700',
              letterSpacing: '-0.025em',
            },
            h3: {
              fontWeight: '600',
            },
            a: {
              color: '#0891B2',
              '&:hover': {
                color: '#0E7490',
              },
            },
          },
        },
      }
    }, 
  }, 
  plugins: [
    require('@tailwindcss/typography'),
  ], 
};
