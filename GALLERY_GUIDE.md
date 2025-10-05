# Guía de Galerías de Tours

## 📁 Estructura de Archivos

Cada tour debe tener su carpeta de imágenes en:
```
public/assets/images/tours/[tour-slug]/
```

Ejemplo:
```
public/assets/images/tours/city-tour-cusco/
├── gallery.json                          ← Metadata de fotógrafos
├── adrian-dascal-NDVI15vYJKI-unsplash.webp
├── alexander-schimmeck-MraFXV3v7Ts-unsplash.webp
└── ...
```

## 🎯 Cómo Agregar Imágenes a un Tour

### Opción 1: Manualmente (Recomendado para control total)

1. **Agrega las imágenes** a la carpeta del tour:
   ```
   public/assets/images/tours/city-tour-cusco/
   ```

2. **Crea el archivo `gallery.json`** en la misma carpeta:
   ```json
   [
     {
       "filename": "adrian-dascal-NDVI15vYJKI-unsplash.webp",
       "photographer": "Adrian Dascal",
       "photographerUrl": "https://unsplash.com/@dascal",
       "alt": "City Tour Cusco - Vista de Sacsayhuamán"
     }
   ]
   ```

3. **La galería aparecerá automáticamente** en la página de detalle del tour.

### Opción 2: Automáticamente con el script

1. **Agrega las imágenes** con nombres descriptivos (preferiblemente de Unsplash):
   ```
   nombre-fotografo-CODE-unsplash.webp
   ```

2. **Ejecuta el script** para generar `gallery.json`:
   ```bash
   # Para un tour específico
   npm run gallery:generate city-tour-cusco

   # Para todos los tours
   npm run gallery:all
   ```

3. **Revisa y edita** el archivo `gallery.json` generado para ajustar descripciones.

## 🖼️ Formato del archivo gallery.json

```json
[
  {
    "filename": "imagen.webp",           // Requerido: nombre del archivo
    "photographer": "Nombre Fotógrafo",  // Opcional: nombre del fotógrafo
    "photographerUrl": "https://...",    // Opcional: URL del perfil
    "alt": "Descripción de la imagen"    // Opcional: texto alternativo
  }
]
```

## 📝 Comandos Disponibles

```bash
# Generar gallery.json para un tour específico
npm run gallery:generate <tour-slug>

# Ejemplos:
npm run gallery:generate city-tour-cusco
npm run gallery:generate valle-sagrado-vip

# Generar gallery.json para TODOS los tours
npm run gallery:all
```

## 🎨 Recomendaciones

### Nombres de Archivo
- Usa formato WebP para mejor calidad/tamaño
- Nombra archivos descriptivamente
- Para imágenes de Unsplash: `fotografo-CODE-unsplash.webp`

### Tamaño de Imágenes
- Ancho recomendado: 1200-1920px
- Calidad WebP: 80-85%
- Usa herramientas como Squoosh.app para optimizar

### Créditos de Fotógrafos
- **Unsplash**: El script extrae automáticamente el nombre y genera la URL
- **Otras fuentes**: Edita `gallery.json` manualmente
- **Propias**: Deja los campos de fotógrafo vacíos o agrega tu información

## 🔄 Flujo de Trabajo Típico

1. Descargar imágenes de Unsplash (o tu fuente)
2. Convertir a WebP y optimizar
3. Nombrar archivos correctamente
4. Copiar a `public/assets/images/tours/[tour-slug]/`
5. Ejecutar `npm run gallery:generate [tour-slug]`
6. Revisar y ajustar `gallery.json` si es necesario
7. ¡Listo! La galería aparece automáticamente

## 🚫 Archivos Excluidos

El script automáticamente excluye:
- `card_*.jpg/webp` - Imágenes de tarjeta del tour
- `gallery.json` - El archivo de metadata

## ❓ Troubleshooting

**La galería no aparece:**
- Verifica que existe `gallery.json` en la carpeta del tour
- Revisa que los nombres de archivo en `gallery.json` coincidan con los archivos reales
- Verifica que el `slug` del tour sea correcto

**Los créditos no aparecen:**
- Asegúrate de incluir los campos `photographer` y `photographerUrl` en `gallery.json`

**Imágenes de baja calidad:**
- Optimiza las imágenes antes de subirlas
- Usa formato WebP con calidad 80-85%
- Considera el tamaño de ancho máximo de 1920px
