import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, extname, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PUBLIC_DIR = join(__dirname, '../public/assets/images');

// Configuración de optimización
const QUALITY = {
  webp: 85,
  jpeg: 85,
  png: 90
};

const MAX_WIDTH = {
  card: 800,      // Imágenes de tarjetas de tours
  hero: 1920,     // Imágenes hero
  logo: 400,      // Logos
  error: 1200     // Imágenes de error
};

async function getImageSize(filePath) {
  try {
    const stats = await stat(filePath);
    return (stats.size / 1024 / 1024).toFixed(2); // MB
  } catch {
    return 0;
  }
}

async function optimizeImage(filePath, type = 'card') {
  const ext = extname(filePath).toLowerCase();
  const baseName = basename(filePath, ext);
  const dir = dirname(filePath);

  // Skip si ya es webp optimizado y no es muy grande
  const currentSize = await getImageSize(filePath);
  if (ext === '.webp' && currentSize < 0.5) {
    console.log(`✓ Skipping ${basename(filePath)} (already optimized: ${currentSize}MB)`);
    return null;
  }

  const maxWidth = MAX_WIDTH[type] || MAX_WIDTH.card;

  try {
    const originalSize = await getImageSize(filePath);

    // Procesar imagen
    const image = sharp(filePath);
    const metadata = await image.metadata();

    // Redimensionar solo si es más grande que el máximo
    if (metadata.width > maxWidth) {
      image.resize(maxWidth, null, {
        withoutEnlargement: true,
        fit: 'inside'
      });
    }

    // Convertir a WebP optimizado
    const outputPath = ext === '.webp'
      ? join(dir, `${baseName}_optimized.webp`)
      : join(dir, `${baseName}.webp`);

    await image
      .webp({ quality: QUALITY.webp, effort: 6 })
      .toFile(outputPath);

    const newSize = await getImageSize(outputPath);
    const saved = (originalSize - newSize).toFixed(2);
    const percent = ((saved / originalSize) * 100).toFixed(1);

    console.log(`✓ ${basename(filePath)}: ${originalSize}MB → ${newSize}MB (saved ${saved}MB, ${percent}%)`);

    return {
      original: filePath,
      optimized: outputPath,
      originalSize,
      newSize,
      saved
    };
  } catch (error) {
    console.error(`✗ Error processing ${basename(filePath)}:`, error.message);
    return null;
  }
}

async function processDirectory(dirPath, type = 'card') {
  const entries = await readdir(dirPath, { withFileTypes: true });
  const results = [];

  for (const entry of entries) {
    const fullPath = join(dirPath, entry.name);

    if (entry.isDirectory()) {
      const subResults = await processDirectory(fullPath, type);
      results.push(...subResults);
    } else {
      const ext = extname(entry.name).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
        const result = await optimizeImage(fullPath, type);
        if (result) results.push(result);
      }
    }
  }

  return results;
}

async function main() {
  console.log('🚀 Starting image optimization...\n');

  const tasks = [
    { dir: join(PUBLIC_DIR, 'errors'), type: 'error', name: 'Error images' },
    { dir: join(PUBLIC_DIR, 'logos'), type: 'logo', name: 'Logos' },
    { dir: join(PUBLIC_DIR, 'tours'), type: 'card', name: 'Tour images' }
  ];

  let totalSaved = 0;
  let totalOriginalSize = 0;

  for (const task of tasks) {
    console.log(`\n📁 Processing ${task.name}...`);
    try {
      const results = await processDirectory(task.dir, task.type);
      const taskSaved = results.reduce((sum, r) => sum + parseFloat(r.saved), 0);
      const taskOriginal = results.reduce((sum, r) => sum + parseFloat(r.originalSize), 0);

      totalSaved += taskSaved;
      totalOriginalSize += taskOriginal;

      console.log(`✓ ${task.name} complete: saved ${taskSaved.toFixed(2)}MB`);
    } catch (error) {
      console.error(`✗ Error processing ${task.name}:`, error.message);
    }
  }

  console.log(`\n✅ Optimization complete!`);
  console.log(`   Total saved: ${totalSaved.toFixed(2)}MB (${((totalSaved / totalOriginalSize) * 100).toFixed(1)}%)`);
}

main().catch(console.error);
