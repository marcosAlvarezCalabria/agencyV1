#!/usr/bin/env node

/**
 * Script para generar automáticamente gallery.json
 *
 * Uso:
 *   node scripts/generate-gallery.js <tour-slug>
 *   node scripts/generate-gallery.js city-tour-cusco
 *
 * O para todos los tours:
 *   node scripts/generate-gallery.js --all
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TOURS_IMAGE_DIR = path.join(__dirname, '../public/assets/images/tours');

/**
 * Extrae el nombre del fotógrafo desde el nombre del archivo de Unsplash
 * Formato esperado: "nombre-apellido-CODE-unsplash.webp"
 */
function extractPhotographerFromFilename(filename) {
  // Eliminar extensión
  const nameWithoutExt = filename.replace(/\.(webp|jpg|jpeg|png)$/i, '');

  // Si es de Unsplash (contiene -unsplash al final)
  if (nameWithoutExt.includes('-unsplash')) {
    // Extraer todo antes de -unsplash
    const beforeUnsplash = nameWithoutExt.split('-unsplash')[0];
    const parts = beforeUnsplash.split('-');

    // El código de Unsplash es el último elemento (ej: "NDVI15vYJKI", "MraFXV3v7Ts")
    // Típicamente contiene mayúsculas, minúsculas y números mezclados
    const photographerParts = [];

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];

      // Si la parte empieza con guión bajo o contiene mayúsculas y minúsculas mezcladas
      // de forma no natural (ej: "MmqS", "TsdB", "YQSXw2YVqyU"), es código
      if (part.startsWith('_') ||
          (part.length > 3 && /[A-Z]{2,}/.test(part) && /[a-z]/.test(part)) ||
          (part.length > 6 && /[A-Z].*[A-Z].*[a-z].*[0-9]/.test(part))) {
        break;
      }

      photographerParts.push(part);
    }

    // Capitalizar cada palabra
    const name = photographerParts
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // Username es todo en minúsculas sin guiones
    const username = photographerParts.join('').toLowerCase();

    return {
      photographer: name,
      photographerUrl: `https://unsplash.com/@${username}`,
    };
  }

  // Si no es de Unsplash, retornar null
  return null;
}

/**
 * Genera el archivo gallery.json para un tour específico
 */
function generateGalleryForTour(tourSlug) {
  const tourDir = path.join(TOURS_IMAGE_DIR, tourSlug);

  // Verificar si existe el directorio
  if (!fs.existsSync(tourDir)) {
    console.error(`❌ No existe el directorio: ${tourDir}`);
    return false;
  }

  // Leer todos los archivos de imagen
  const files = fs.readdirSync(tourDir);
  const imageFiles = files.filter(file =>
    /\.(webp|jpg|jpeg|png)$/i.test(file) &&
    !file.includes('card_') && // Excluir imagen de card
    file !== 'gallery.json'
  );

  if (imageFiles.length === 0) {
    console.warn(`⚠️  No se encontraron imágenes en: ${tourDir}`);
    return false;
  }

  // Generar metadata para cada imagen
  const galleryData = imageFiles.map((filename, index) => {
    const credits = extractPhotographerFromFilename(filename);

    return {
      filename,
      ...(credits && {
        photographer: credits.photographer,
        photographerUrl: credits.photographerUrl,
      }),
      alt: `${tourSlug.replace(/-/g, ' ')} - Image ${index + 1}`,
    };
  });

  // Guardar el archivo gallery.json
  const galleryJsonPath = path.join(tourDir, 'gallery.json');
  fs.writeFileSync(galleryJsonPath, JSON.stringify(galleryData, null, 2), 'utf-8');

  console.log(`✅ Generado: ${galleryJsonPath}`);
  console.log(`   ${imageFiles.length} imágenes procesadas`);

  return true;
}

/**
 * Genera gallery.json para todos los tours
 */
function generateGalleryForAllTours() {
  if (!fs.existsSync(TOURS_IMAGE_DIR)) {
    console.error(`❌ No existe el directorio de tours: ${TOURS_IMAGE_DIR}`);
    return;
  }

  const tourDirs = fs.readdirSync(TOURS_IMAGE_DIR).filter(item => {
    const fullPath = path.join(TOURS_IMAGE_DIR, item);
    return fs.statSync(fullPath).isDirectory();
  });

  console.log(`🔍 Encontrados ${tourDirs.length} directorios de tours\n`);

  let successCount = 0;
  tourDirs.forEach(tourSlug => {
    if (generateGalleryForTour(tourSlug)) {
      successCount++;
    }
  });

  console.log(`\n✨ Completado: ${successCount}/${tourDirs.length} tours procesados`);
}

// Script principal
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log(`
📸 Generador de gallery.json

Uso:
  node scripts/generate-gallery.js <tour-slug>
  node scripts/generate-gallery.js city-tour-cusco

O para todos los tours:
  node scripts/generate-gallery.js --all
  `);
  process.exit(0);
}

if (args[0] === '--all') {
  generateGalleryForAllTours();
} else {
  const tourSlug = args[0];
  generateGalleryForTour(tourSlug);
}
