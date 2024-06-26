import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      xl: { max: '1279px' },
      lg: { max: '1023px' },
      md: { max: '767px' },
      sm: { max: '639px' },
    },

    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        check: "url('/images/check.svg')",
      },
      colors: {
        primary: '#685bff',
        'primary-white': '#FFFFFF',
        'primary-black': '#000000',
        'modal-black': '#3d3d3d',
        'dim-black': '#474747',
        gray: '#d9d9d9',
        'player-btn': '#292929',
      },
      fontFamily: {
        custom: ['var(--urbanist)'],
      },

      borderRadius: { rounded: '0.25rem', xl: '0.75rem', '2xl': '1rem' },
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
  mode: 'jit',
}
export default config
