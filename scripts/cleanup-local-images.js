import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Leer el archivo cloudinary-urls.json
const cloudinaryUrlsPath = path.join(process.cwd(), 'cloudinary-urls.json');
const cloudinaryData = JSON.parse(fs.readFileSync(cloudinaryUrlsPath, 'utf-8'));

console.log('🗑️  Iniciando limpieza de imágenes locales subidas a Cloudinary...\n');

let deletedCount = 0;
let errorCount = 0;
let skippedCount = 0;

// Eliminar imágenes
console.log('📸 Eliminando imágenes...');
for (const image of cloudinaryData.images.success) {
  try {
    if (fs.existsSync(image.localPath)) {
      fs.unlinkSync(image.localPath);
      console.log(`✅ Eliminado: ${image.fileName} (${image.tourFolder})`);
      deletedCount++;
    } else {
      console.log(`⏭️  Ya no existe: ${image.fileName}`);
      skippedCount++;
    }
  } catch (error) {
    console.error(`❌ Error al eliminar ${image.fileName}:`, error.message);
    errorCount++;
  }
}

// Eliminar videos
console.log('\n🎥 Eliminando videos...');
for (const video of cloudinaryData.videos.success) {
  try {
    if (fs.existsSync(video.localPath)) {
      fs.unlinkSync(video.localPath);
      console.log(`✅ Eliminado: ${video.fileName}`);
      deletedCount++;
    } else {
      console.log(`⏭️  Ya no existe: ${video.fileName}`);
      skippedCount++;
    }
  } catch (error) {
    console.error(`❌ Error al eliminar ${video.fileName}:`, error.message);
    errorCount++;
  }
}

// Resumen
console.log('\n' + '='.repeat(50));
console.log('📊 RESUMEN DE LIMPIEZA');
console.log('='.repeat(50));
console.log(`✅ Archivos eliminados: ${deletedCount}`);
console.log(`⏭️  Archivos ya eliminados: ${skippedCount}`);
console.log(`❌ Errores: ${errorCount}`);
console.log('='.repeat(50));

console.log('\n📁 ARCHIVOS CONSERVADOS:');
console.log('  ✓ Todos los archivos gallery.json');
console.log('  ✓ Estructura de carpetas de tours');
console.log('  ✓ Otras imágenes no subidas a Cloudinary (logos, etc.)');

console.log('\n✨ Limpieza completada!');
