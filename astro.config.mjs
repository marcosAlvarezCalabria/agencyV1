// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    build: {
      // Minificar CSS y JS
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true, // Remover console.logs en producción
          drop_debugger: true,
        },
      },
      // Optimizar chunks
      rollupOptions: {
        output: {
          manualChunks: {
            'swiper': ['swiper'],
          },
        },
      },
    },
  },
  build: {
    // Inlining de assets pequeños
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    }
  }
});