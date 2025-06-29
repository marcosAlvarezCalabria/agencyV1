import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      // Aquí le decimos a Tailwind que use Figtree como fuente por defecto
      fontFamily: {
        sans: ['Figtree', ...defaultTheme.fontFamily.sans],
      },
      // Aquí mapeamos tus variables CSS a clases de Tailwind
      colors: {
        'negro': 'var(--negro)',
        'verde': {
          50: 'var(--verde-50)',
          800: 'var(--verde-800)',
          900: 'var(--green-900)',
        },
        'bg': {
          DEFAULT: 'var(--bg)',
          25: 'var(--bg-25)',
          darker: 'var(--bg-darker)',
        },
        'naranjado': {
          25: 'var(--naranjado-25)',
          50: 'var(--naranjado-50)',
        },
        'cta': 'var(--new)',
        'rosa': 'var(--rosa)',
        'dark-nature': 'var(--dark-nature)',
      },
    },
  },
  plugins: [],
}