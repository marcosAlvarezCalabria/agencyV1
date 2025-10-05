# 🖼️ Guía de Optimización de Imágenes

## ⚠️ Imágenes que DEBES optimizar urgentemente

### Críticas (Afectan mucho el rendimiento en iPhone)

1. **`public/assets/images/tours/full_adrenalina_2d1n/caballo_full_adrenalina.webp`**
   - **Tamaño actual:** 7.0 MB ❌
   - **Tamaño objetivo:** < 200 KB ✅
   - **Acción:** Re-comprimir WebP con calidad 75-80
   - **Nota:** Ya está en WebP pero sin comprimir adecuadamente

2. **`public/assets/videos/hero-video-portada-2mb.mp4`**
   - **Tamaño actual:** 1.9 MB ⚠️
   - **Tamaño objetivo:** < 1 MB ✅
   - **Acción:** Re-encodear con mayor compresión

### Moderadas (Optimizar cuando sea posible)

3. **`public/assets/images/tours/aventura_montanas_3d2n/waqrapukara_card.jpeg`**
   - **Tamaño actual:** ~7 KB ✅ (Ya está bien)
   - **Acción:** Convertir a .webp para consistencia

---

## 🛠️ Herramientas Recomendadas

### Opción 1: Online (Más Fácil)
- **Squoosh.app** - https://squoosh.app/
  - Arrastra y suelta las imágenes
  - Selecciona formato WebP
  - Calidad: 75-80%
  - Descarga y reemplaza

### Opción 2: Línea de Comandos (Más Rápido)

#### Instalar herramientas:
```bash
# Windows (con Chocolatey)
choco install webp imagemagick

# Mac
brew install webp imagemagick

# Linux
sudo apt-get install webp imagemagick
```

#### Re-comprimir WebP existente:
```bash
# Ir a la carpeta del proyecto
cd "C:\Users\Marcos\Desktop\Agencia Cusco v1\agency-v1"

# Re-comprimir WebP existente (7MB → ~150KB)
cwebp -q 75 "public/assets/images/tours/full_adrenalina_2d1n/caballo_full_adrenalina.webp" -o "public/assets/images/tours/full_adrenalina_2d1n/caballo_full_adrenalina_optimized.webp"

# Luego reemplazar el original:
# mv "public/assets/images/tours/full_adrenalina_2d1n/caballo_full_adrenalina_optimized.webp" "public/assets/images/tours/full_adrenalina_2d1n/caballo_full_adrenalina.webp"

# Convertir JPEG pequeño a WebP
cwebp -q 80 "public/assets/images/tours/aventura_montanas_3d2n/waqrapukara_card.jpeg" -o "public/assets/images/tours/aventura_montanas_3d2n/waqrapukara_card.webp"
```

#### Optimizar video:
```bash
# Instalar FFmpeg
choco install ffmpeg  # Windows
brew install ffmpeg   # Mac

# Comprimir video manteniendo calidad visual
ffmpeg -i "public/assets/videos/hero-video-portada-2mb.mp4" -vcodec libx264 -crf 28 -preset slow "public/assets/videos/hero-video-optimized.mp4"

# Luego reemplazar en Hero.astro línea 66:
# src="/assets/videos/hero-video-optimized.mp4"
```

---

## 📋 Checklist de Optimización

### Paso 1: Comprimir imágenes críticas
- [ ] Re-comprimir `caballo_full_adrenalina.webp` (7MB → ~150KB) ⚠️ URGENTE
- [ ] Convertir `waqrapukara_card.jpeg` a WebP (~7KB → ~5KB)
- [x] Corregir referencia de imagen en `tours.es.json` (montaña de colores) ✅

### Paso 2: Optimizar video hero
- [ ] Comprimir `hero-video-portada-2mb.mp4` (1.9MB → ~900KB)
- [ ] Actualizar referencia en `src/components/Hero.astro`

### Paso 3: Verificar otras imágenes grandes
```bash
# Encontrar imágenes > 500KB
find public/assets/images -type f -size +500k
```

---

## 🎯 Resultados Esperados

### Antes de optimización:
- ⏱️ Tiempo de carga en iPhone: ~8-10 segundos
- 📦 Peso total de página inicial: ~9MB
- 🐌 First Contentful Paint: ~4s

### Después de optimización:
- ⏱️ Tiempo de carga en iPhone: ~2-3 segundos ✅
- 📦 Peso total de página inicial: ~1.5MB ✅
- 🚀 First Contentful Paint: ~1.2s ✅

---

## 📱 Pruebas en iPhone

Después de optimizar, prueba en tu iPhone:

1. **Limpia la caché del navegador:**
   - Safari → Configuración → Borrar historial y datos

2. **Prueba con red lenta:**
   - Configuración → Desarrollo → Network Link Conditioner → 3G

3. **Verifica que las imágenes se vean bien:**
   - WebP tiene buena calidad incluso con compresión alta
   - Si se ven borrosas, aumenta la calidad a 85%

---

## ⚡ Optimizaciones Ya Aplicadas (Código)

✅ Video hero con `preload="metadata"` (carga solo metadatos)
✅ Lazy loading optimizado en galerías
✅ Preload de recursos críticos (logo, fuentes)
✅ Skeletons móviles simplificados
✅ DNS prefetch para WhatsApp

---

## 🆘 Si tienes problemas

### "No puedo instalar las herramientas"
→ Usa Squoosh.app (online, no requiere instalación)

### "El video comprimido se ve mal"
→ Aumenta el CRF a 24-26 (menor = mejor calidad, mayor tamaño)

### "Las imágenes WebP no se muestran"
→ Verifica que el navegador soporte WebP (todos los modernos sí)

### "Quiero automatizar esto"
→ Crea un script de build que comprima automáticamente
