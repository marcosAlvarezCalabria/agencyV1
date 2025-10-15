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
          passes: 2, // Dos pasadas de compresión
          unsafe: true, // Optimizaciones agresivas
        },
        mangle: true, // Ofuscar nombres de variables
      },
      // Optimizar chunks
      rollupOptions: {
        output: {
          manualChunks: {
            'swiper': ['swiper'],
          },
          // Reducir overhead de chunks
          chunkFileNames: '_astro/[name].[hash].js',
          assetFileNames: '_astro/[name].[hash][extname]',
        },
      },
      // Reducir límite de chunk warnings
      chunkSizeWarningLimit: 500,
      cssCodeSplit: true,
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