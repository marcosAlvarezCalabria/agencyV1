// sitemap.xml.js - Generador dinámico de sitemap
import toursEs from '../data/tours.es.json';
import toursEn from '../data/tours.en.json';

const SITE_URL = 'https://www.peruinkastravel.com'; // Cambia esto a tu dominio real

// Páginas estáticas
const staticPages = [
  { url: '/', changefreq: 'weekly', priority: 1.0, lang: 'es' },
  { url: '/en', changefreq: 'weekly', priority: 1.0, lang: 'en' },
  { url: '/es/tours', changefreq: 'daily', priority: 0.9, lang: 'es' },
  { url: '/tours', changefreq: 'daily', priority: 0.9, lang: 'en' },
];

// Generar páginas dinámicas de tours
const tourPagesEs = toursEs.map(tour => ({
  url: `/es/tours/${tour.slug}`,
  changefreq: 'weekly',
  priority: 0.8,
  lang: 'es',
  lastmod: new Date().toISOString()
}));

const tourPagesEn = toursEn.map(tour => ({
  url: `/tours/${tour.slug}`,
  changefreq: 'weekly',
  priority: 0.8,
  lang: 'en',
  lastmod: new Date().toISOString()
}));

const allPages = [...staticPages, ...tourPagesEs, ...tourPagesEn];

export async function GET(context) {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${allPages.map(page => `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : `<lastmod>${new Date().toISOString()}</lastmod>`}
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
