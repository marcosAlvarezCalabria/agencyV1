import { readdir, rename, unlink } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PUBLIC_DIR = join(__dirname, '../public/assets/images');

async function replaceOptimizedImages(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  let count = 0;

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      count += await replaceOptimizedImages(fullPath);
    } else if (entry.name.endsWith('_optimized.webp')) {
      // Obtener el nombre original
      const originalName = entry.name.replace('_optimized.webp', '.webp');
      const originalPath = join(dir, originalName);

      try {
        // Eliminar el original si existe
        try {
          await unlink(originalPath);
          console.log(`✓ Deleted old: ${originalName}`);
        } catch (e) {
          // Si no existe, no hay problema
        }

        // Renombrar el optimizado
        await rename(fullPath, originalPath);
        console.log(`✓ Replaced: ${originalName}`);
        count++;
      } catch (error) {
        console.error(`✗ Error replacing ${entry.name}:`, error.message);
      }
    }
  }

  return count;
}

async function main() {
  console.log('🔄 Replacing optimized images...\n');

  const count = await replaceOptimizedImages(PUBLIC_DIR);

  console.log(`\n✅ Replaced ${count} images`);
}

main().catch(console.error);
