# CodeViz Research Context

> **Note**: This file contains research context from CodeViz. Most recent contexts are at the bottom.

---

## Research Query

quiero un esquema de mi projecto agency v1

*Session: b587f4f59bbc3716e58ea4f860a6f101 | Generated: 5/7/2025, 20:00:30*

### Analysis Summary

# Esquema del Proyecto Agency v1

## Arquitectura General

El proyecto **Agency v1** es un sitio web desarrollado con **Astro**, diseñado para una agencia de viajes. Su arquitectura se centra en la generación de sitios estáticos con componentes reutilizables y soporte para internacionalización. La estructura del proyecto está organizada para separar las páginas, los componentes de la interfaz de usuario, los datos y los activos estáticos, facilitando el desarrollo y mantenimiento.

Los componentes principales se organizan en las siguientes áreas:

*   **Páginas y Rutas**: Definidas en [src/pages/](src/pages/).
*   **Componentes Reutilizables**: Ubicados en [src/components/](src/components/).
*   **Plantillas de Diseño**: Gestionadas en [src/layouts/](src/layouts/).
*   **Datos de la Aplicación**: Almacenados en [src/data/](src/data/).
*   **Internacionalización (i18n)**: Configurada en [src/i18n/](src/i18n/).
*   **Activos Estáticos**: Servidos desde [public/](public/).
*   **Archivos de Configuración**: Archivos raíz como [astro.config.mjs](astro.config.mjs) y [tailwind.config.mjs](tailwind.config.mjs).

## Componentes Principales

### `src/pages/` - Páginas y Rutas

Este directorio define las rutas de la aplicación y el contenido principal de cada página. Astro utiliza la estructura de archivos para crear las rutas.

*   **Propósito**: Gestionar las rutas de la aplicación y renderizar el contenido de las páginas.
*   **Partes Internas**:
    *   [index.astro](src/pages/index.astro): La página de inicio principal.
    *   [tours.astro](src/pages/tours.astro): Página que lista los tours disponibles.
    *   [tours/[slug].astro](src/pages/tours/[slug].astro): Una ruta dinámica para mostrar detalles de un tour específico, donde `[slug]` es un identificador único para cada tour.
    *   [404.astro](src/pages/404.astro): La página de error personalizada para rutas no encontradas.
    *   **Subdirectorios de Idioma**:
        *   [en/](src/pages/en/): Contiene las páginas para la versión en inglés del sitio, como [en/index.astro](src/pages/en/index.astro) y [en/tours.astro](src/pages/en/tours.astro).
        *   [es/](src/pages/es/): Contiene las páginas para la versión en español del sitio, como [es/index.astro](src/pages/es/index.astro) y [es/tours.astro](src/pages/es/tours.astro).
*   **Relaciones Externas**: Las páginas utilizan componentes de [src/components/](src/components/) para construir su interfaz de usuario y aplican plantillas de [src/layouts/](src/layouts/) para una estructura consistente. También acceden a datos de [src/data/](src/data/) y traducciones de [src/i18n/](src/i18n/).

### `src/components/` - Componentes Reutilizables

Este directorio alberga todos los componentes de la interfaz de usuario que se pueden reutilizar en diferentes páginas.

*   **Propósito**: Proporcionar bloques de construcción modulares y reutilizables para la interfaz de usuario.
*   **Partes Internas**:
    *   [Hero.astro](src/components/Hero.astro): Componente para la sección principal de la página de inicio.
    *   [Navbar.astro](src/components/Navbar.astro): Barra de navegación del sitio.
    *   [Footer.astro](src/components/Footer.astro): Pie de página del sitio.
    *   [TourCard.astro](src/components/TourCard.astro): Componente para mostrar la información de un tour individual.
    *   [TourSearch.astro](src/components/TourSearch.astro): Componente para la funcionalidad de búsqueda de tours.
    *   [LangSwitcher.astro](src/components/LangSwitcher.astro): Componente para cambiar el idioma del sitio.
    *   Otros componentes como [AboutCard.astro](src/components/AboutCard.astro), [Tours.astro](src/components/Tours.astro), [TourCardCarousel.astro](src/components/TourCardCarousel.astro), [ToursCarousel.astro](src/components/ToursCarousel.astro), y [TripAdvisorReviews.astro](src/components/TripAdvisorReviews.astro).
*   **Relaciones Externas**: Los componentes son importados y utilizados por las páginas en [src/pages/](src/pages/). Algunos componentes, como [TourCard.astro](src/components/TourCard.astro), consumen datos de [src/data/](src/data/), y muchos utilizan las utilidades de internacionalización de [src/i18n/](src/i18n/).

### `src/layouts/` - Plantillas de Diseño

Contiene las plantillas base que definen la estructura general de las páginas, asegurando una apariencia y sensación consistentes en todo el sitio.

*   **Propósito**: Proporcionar una estructura de diseño consistente para las páginas.
*   **Partes Internas**:
    *   [Baselayout.astro](src/layouts/Baselayout.astro): La plantilla base para la mayoría de las páginas, incluyendo elementos como el encabezado y el pie de página.
    *   [ErrorLayout.astro](src/layouts/ErrorLayout.astro): Una plantilla específica para páginas de error.
*   **Relaciones Externas**: Las páginas en [src/pages/](src/pages/) importan y utilizan estas plantillas para envolver su contenido.

### `src/data/` - Datos de la Aplicación

Este directorio almacena archivos de datos estáticos que son utilizados por las páginas y componentes para mostrar información dinámica.

*   **Propósito**: Almacenar datos estructurados, principalmente información sobre tours.
*   **Partes Internas**:
    *   [tours.en.json](src/data/tours.en.json): Datos de tours en inglés.
    *   [tours.es.json](src/data/tours.es.json): Datos de tours en español.
*   **Relaciones Externas**: Las páginas como [src/pages/tours.astro](src/pages/tours.astro) y los componentes como [src/components/TourCard.astro](src/components/TourCard.astro) leen estos archivos para renderizar la información de los tours.

### `src/i18n/` - Internacionalización

Este directorio gestiona la lógica y los archivos de traducción para el soporte multilingüe del sitio.

*   **Propósito**: Proporcionar soporte para múltiples idiomas en el sitio web.
*   **Partes Internas**:
    *   [en.json](src/i18n/en.json): Archivo de traducción para el idioma inglés.
    *   [es.json](src/i18n/es.json): Archivo de traducción para el idioma español.
    *   [ui.js](src/i18n/ui.js): Lógica para cargar y acceder a las traducciones.
    *   [utils.js](src/i18n/utils.js): Utilidades relacionadas con la internacionalización.
*   **Relaciones Externas**: Las páginas y componentes utilizan las funciones y datos de este directorio para mostrar contenido en el idioma seleccionado por el usuario.

### `public/` - Activos Estáticos

Este directorio contiene todos los activos estáticos que se sirven directamente, como imágenes y videos.

*   **Propósito**: Servir archivos estáticos directamente sin procesamiento por parte de Astro.
*   **Partes Internas**:
    *   [assets/images/](public/assets/images/): Contiene imágenes como [logo.png](public/assets/images/logo.png) y [salkantay.jpg](public/assets/images/salkantay.jpg).
    *   [assets/videos/](public/assets/videos/): Contiene videos como [hero-video.mp4](public/assets/videos/hero-video.mp4).
*   **Relaciones Externas**: Las páginas y componentes referencian directamente estos activos en sus rutas HTML o CSS.

### Archivos de Configuración

Estos archivos definen la configuración global del proyecto, las dependencias y las herramientas de desarrollo.

*   **Propósito**: Configurar el entorno de desarrollo y construcción del proyecto.
*   **Partes Internas**:
    *   [astro.config.mjs](astro.config.mjs): Configuración principal de Astro, incluyendo integraciones y opciones de construcción.
    *   [tailwind.config.mjs](tailwind.config.mjs): Configuración de Tailwind CSS para el estilizado.
    *   [package.json](package.json): Define las dependencias del proyecto, scripts y metadatos.
    *   [tsconfig.json](tsconfig.json): Configuración de TypeScript para el proyecto.
*   **Relaciones Externas**: Estos archivos son leídos por las herramientas de construcción (Astro, Tailwind CSS, npm) para configurar el proyecto y sus dependencias.

