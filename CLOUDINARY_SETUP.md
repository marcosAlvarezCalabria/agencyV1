# Guía de Configuración de Cloudinary

## Paso 1: Crear cuenta en Cloudinary

1. Ve a https://cloudinary.com/users/register_free
2. Completa el formulario de registro
3. Verifica tu email

## Paso 2: Obtener credenciales

1. Inicia sesión en https://cloudinary.com/console
2. En el Dashboard verás:
   - **Cloud Name**
   - **API Key**
   - **API Secret**
3. Copia estos tres valores

## Paso 3: Configurar variables de entorno

1. Abre el archivo `.env` en la raíz del proyecto
2. Reemplaza los valores de las siguientes variables con tus credenciales:

```env
CLOUDINARY_CLOUD_NAME="tu_cloud_name_aqui"
CLOUDINARY_API_KEY="tu_api_key_aqui"
CLOUDINARY_API_SECRET="tu_api_secret_aqui"
```

## Paso 4: Subir imágenes a Cloudinary

Ejecuta el siguiente comando para subir todas las imágenes de tours:

```bash
npm run cloudinary:upload
```

Este comando:
- Subirá todas las imágenes de `public/assets/images/tours/`
- Las organizará en carpetas por tour
- Optimizará automáticamente las imágenes
- Generará un archivo `cloudinary-urls.json` con todas las URLs

## Paso 5: Verificar la subida

1. Ve a https://cloudinary.com/console/media_library
2. Busca la carpeta `agency-cusco`
3. Verifica que todas las imágenes estén subidas

## Beneficios de usar Cloudinary

✅ **CDN Global**: Imágenes servidas desde el servidor más cercano al usuario
✅ **Optimización automática**: Compresión y formato automático (WebP cuando sea posible)
✅ **Transformaciones en tiempo real**: Redimensionar, recortar, etc.
✅ **Plan gratuito generoso**:
   - 25 GB de almacenamiento
   - 25 GB de ancho de banda/mes
   - Suficiente para una agencia de viajes

## Uso en componentes

Las imágenes ahora se cargarán automáticamente desde Cloudinary cuando esté configurado.
Si Cloudinary no está configurado, se usarán las imágenes locales como fallback.

Ejemplo de uso:

```astro
---
import { getTourCardImageUrl } from '../utils/cloudinary.js';

const imageUrl = getTourCardImageUrl('laguna_humantay', 'laguna_humantay_1.jpg');
---

<img src={imageUrl} alt="Laguna Humantay" />
```

## Funciones disponibles

- `getTourImageUrl(tourSlug, imageName, options)` - URL personalizada con opciones
- `getTourCardImageUrl(tourSlug, imageName)` - Optimizada para tarjetas (400x300)
- `getTourHeroImageUrl(tourSlug, imageName)` - Optimizada para hero (1920x1080)
- `getTourGalleryImageUrl(tourSlug, imageName)` - Optimizada para galerías (800x600)
- `getImageUrl(tourSlug, imageName, options)` - Con fallback a local

## Solución de problemas

### Error: "Cloudinary credentials not found"
- Verifica que el archivo `.env` existe en la raíz del proyecto
- Verifica que las variables están correctamente configuradas
- Verifica que no hay espacios adicionales en los valores

### Las imágenes no se cargan
- Verifica que ejecutaste `npm run cloudinary:upload`
- Verifica que el `CLOUDINARY_CLOUD_NAME` en `.env` es correcto
- Abre el archivo `cloudinary-urls.json` para ver las URLs generadas

### Quiero usar imágenes locales temporalmente
- Simplemente deja las credenciales como `your_cloud_name_here`
- El sistema automáticamente usará las imágenes locales

## Despliegue en GoDaddy

Cuando despliegues tu sitio en GoDaddy:

1. Las imágenes se cargarán desde Cloudinary (no desde tu servidor)
2. Tu sitio será mucho más rápido
3. Ahorrarás ancho de banda en tu hosting
4. No necesitas subir las imágenes a GoDaddy (solo el código)

**IMPORTANTE**: Asegúrate de configurar las variables de entorno en GoDaddy también:
- Ve al panel de control de tu hosting
- Busca la sección de variables de entorno
- Agrega las mismas variables que tienes en `.env`
