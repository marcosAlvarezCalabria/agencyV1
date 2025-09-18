// Skeleton Manager - Sistema de carga con skeletons automáticos
class SkeletonManager {
  constructor() {
    this.observers = new Map();
    this.skeletonConfigs = new Map();
    this.isInitialized = false;
  }

  init() {
    if (this.isInitialized) return;
    
    this.setupAutoSkeletons();
    this.setupIntersectionObserver();
    this.isInitialized = true;
    
    console.log('🎯 SkeletonManager initialized');
  }

  // Configurar skeletons automáticos basados en data attributes
  setupAutoSkeletons() {
    const autoSkeletonElements = document.querySelectorAll('[data-skeleton-auto]');
    
    autoSkeletonElements.forEach(element => {
      const config = {
        type: element.dataset.skeletonAuto || 'search-results',
        count: parseInt(element.dataset.skeletonCount) || 4,
        autoHide: element.dataset.skeletonAutoHide !== 'false',
        animation: element.dataset.skeletonAnimation || 'pulse',
        delay: parseInt(element.dataset.skeletonDelay) || 0
      };

      this.skeletonConfigs.set(element.id, config);
      
      // Mostrar skeleton inmediatamente si está configurado
      if (config.autoHide) {
        setTimeout(() => {
          this.show(element.id, config);
        }, config.delay);
      }
    });
  }

  // Mostrar skeleton en un contenedor
  show(containerId, config = {}) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn(`⚠️ Container ${containerId} not found`);
      return;
    }

    const defaultConfig = this.skeletonConfigs.get(containerId) || {};
    const finalConfig = { ...defaultConfig, ...config };

    // Limpiar contenido existente
    container.innerHTML = '';
    
    // Añadir clase de loading
    container.classList.add('skeleton-loading');
    
    // Generar skeletons basado en el tipo
    const skeletonHTML = this.generateSkeletonHTML(finalConfig);
    container.innerHTML = skeletonHTML;

    console.log(`🔄 Skeleton shown for ${containerId}`, finalConfig);
  }

  // Ocultar skeleton y mostrar contenido real
  hide(containerId, realContent = '') {
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn(`⚠️ Container ${containerId} not found`);
      return;
    }

    // IMPORTANTE: El uso de innerHTML puede destruir los event listeners de frameworks
    // o componentes complejos como carruseles. Si tu componente deja de funcionar
    // después de que el esqueleto se oculta, es probable que necesites reinicializar
    // su JavaScript después de llamar a este método `hide`.
    if (realContent) {
      container.innerHTML = realContent;
    }

    // Remover clase de loading para quitar los estilos del esqueleto
    container.classList.remove('skeleton-loading');

    // Animar la aparición del contenido real
    container.style.opacity = '0';
    container.style.transform = 'translateY(20px)';
    container.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out';

    // Usamos requestAnimationFrame para asegurar que los estilos iniciales se apliquen
    // antes de comenzar la transición al estado final.
    requestAnimationFrame(() => {
      container.style.opacity = '1';
      container.style.transform = 'translateY(0px)';
    });

    // Limpiar los estilos en línea una vez que la transición haya terminado
    container.addEventListener('transitionend', () => {
      container.style.removeProperty('opacity');
      container.style.removeProperty('transform');
      container.style.removeProperty('transition');
    }, { once: true });

    console.log(`✅ Skeleton hidden for ${containerId}`);
  }

  // Generar HTML del skeleton basado en configuración
  generateSkeletonHTML(config) {
    const { type, count, animation } = config;
    
    let skeletonHTML = '';
    
    for (let i = 0; i < count; i++) {
      switch (type) {
        case 'search-results':
        case 'tour-cards':
          skeletonHTML += this.generateTourCardSkeleton(animation);
          break;
        case 'list-items':
          skeletonHTML += this.generateListItemSkeleton(animation);
          break;
        case 'content-blocks':
          skeletonHTML += this.generateContentBlockSkeleton(animation);
          break;
        default:
          skeletonHTML += this.generateDefaultSkeleton(animation);
      }
    }
    
    return skeletonHTML;
  }

  // Generar skeleton para tour cards
  generateTourCardSkeleton(animation = 'pulse') {
    return `
      <div class="group relative bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg border border-white/60 ${animation === 'pulse' ? 'animate-pulse' : ''}">
        <!-- Imagen skeleton -->
        <div class="relative overflow-hidden h-48">
          <div class="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 skeleton-shimmer"></div>
          
          <!-- Badges skeleton -->
          <div class="absolute top-3 left-3 z-20 flex flex-col gap-2">
            <div class="bg-gray-300 h-6 w-20 rounded-full"></div>
          </div>
          
          <!-- Botón favorito skeleton -->
          <div class="absolute top-3 right-3 z-20 bg-gray-300 w-8 h-8 rounded-full"></div>
        </div>

        <!-- Contenido skeleton -->
        <div class="p-5">
          <!-- Header skeleton -->
          <div class="flex justify-between items-start mb-3">
            <div class="flex-1 mr-2">
              <div class="bg-gray-300 h-5 w-3/4 rounded mb-2"></div>
              <div class="bg-gray-300 h-4 w-1/2 rounded"></div>
            </div>
            <div class="flex items-center gap-1 shrink-0">
              <div class="bg-gray-300 h-4 w-16 rounded"></div>
            </div>
          </div>

          <!-- Precio skeleton -->
          <div class="mb-4 p-3 bg-gray-100 rounded-lg">
            <div class="flex items-baseline gap-2 mb-1">
              <div class="bg-gray-300 h-8 w-20 rounded"></div>
              <div class="bg-gray-300 h-4 w-8 rounded"></div>
            </div>
            <div class="flex items-center justify-between">
              <div class="bg-gray-300 h-3 w-16 rounded"></div>
              <div class="bg-gray-300 h-3 w-20 rounded"></div>
            </div>
          </div>

          <!-- Duración skeleton -->
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <div class="bg-gray-300 w-4 h-4 rounded"></div>
              <div class="bg-gray-300 h-4 w-16 rounded"></div>
            </div>
            <div class="bg-gray-300 h-4 w-24 rounded"></div>
          </div>

          <!-- Descripción skeleton -->
          <div class="mb-4 space-y-2">
            <div class="bg-gray-300 h-4 w-full rounded"></div>
            <div class="bg-gray-300 h-4 w-4/5 rounded"></div>
          </div>

          <!-- Tags skeleton -->
          <div class="flex flex-wrap gap-1 mb-4">
            <div class="bg-gray-300 h-6 w-20 rounded-full"></div>
            <div class="bg-gray-300 h-6 w-24 rounded-full"></div>
            <div class="bg-gray-300 h-6 w-16 rounded-full"></div>
          </div>

          <!-- Disponibilidad skeleton -->
          <div class="mb-4">
            <div class="flex items-center justify-between mb-1">
              <div class="bg-gray-300 h-3 w-20 rounded"></div>
              <div class="bg-gray-300 h-3 w-16 rounded"></div>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-gray-300 h-2 rounded-full w-3/4"></div>
            </div>
          </div>

          <!-- Botones skeleton -->
          <div class="space-y-2">
            <div class="bg-gray-300 h-12 w-full rounded-xl"></div>
            <div class="bg-gray-300 h-12 w-full rounded-xl"></div>
          </div>
        </div>
      </div>
    `;
  }

  // Generar skeleton para elementos de lista
  generateListItemSkeleton(animation = 'pulse') {
    return `
      <div class="flex items-center space-x-4 p-4 bg-white rounded-lg shadow ${animation === 'pulse' ? 'animate-pulse' : ''}">
        <div class="bg-gray-300 h-12 w-12 rounded-full"></div>
        <div class="flex-1 space-y-2">
          <div class="bg-gray-300 h-4 w-3/4 rounded"></div>
          <div class="bg-gray-300 h-3 w-1/2 rounded"></div>
        </div>
        <div class="bg-gray-300 h-8 w-20 rounded"></div>
      </div>
    `;
  }

  // Generar skeleton para bloques de contenido
  generateContentBlockSkeleton(animation = 'pulse') {
    return `
      <div class="bg-white p-6 rounded-lg shadow ${animation === 'pulse' ? 'animate-pulse' : ''}">
        <div class="bg-gray-300 h-6 w-1/3 rounded mb-4"></div>
        <div class="space-y-3">
          <div class="bg-gray-300 h-4 w-full rounded"></div>
          <div class="bg-gray-300 h-4 w-5/6 rounded"></div>
          <div class="bg-gray-300 h-4 w-4/5 rounded"></div>
        </div>
        <div class="mt-6 flex space-x-2">
          <div class="bg-gray-300 h-8 w-20 rounded"></div>
          <div class="bg-gray-300 h-8 w-24 rounded"></div>
        </div>
      </div>
    `;
  }

  // Generar skeleton por defecto
  generateDefaultSkeleton(animation = 'pulse') {
    return `
      <div class="bg-gray-300 h-20 w-full rounded ${animation === 'pulse' ? 'animate-pulse' : ''}"></div>
    `;
  }

  // Configurar intersection observer para lazy loading
  setupIntersectionObserver() {
    if (!window.IntersectionObserver) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const containerId = element.id;
          
          if (this.skeletonConfigs.has(containerId)) {
            // Trigger custom event for lazy loading
            element.dispatchEvent(new CustomEvent('skeletonVisible', {
              detail: { containerId }
            }));
          }
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '50px'
    });

    // Observar elementos con skeletons
    this.skeletonConfigs.forEach((config, containerId) => {
      const element = document.getElementById(containerId);
      if (element) {
        observer.observe(element);
      }
    });
  }

  // Método público para registrar callbacks de carga
  onLoad(containerId, callback) {
    const element = document.getElementById(containerId);
    if (element) {
      element.addEventListener('skeletonVisible', callback);
    }
  }

  // Método para simular carga de datos
  simulateLoading(containerId, duration = 2000, realContent = '') {
    const config = this.skeletonConfigs.get(containerId);
    if (config) {
      this.show(containerId, config);
      
      setTimeout(() => {
        this.hide(containerId, realContent);
      }, duration);
    }
  }

  // Método para limpiar recursos
  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    this.skeletonConfigs.clear();
    this.isInitialized = false;
  }

  // Método para obtener los contenedores con skeletons activos
  getActiveSkeletons() {
    // Este método es llamado por la página de test.
    return Array.from(document.querySelectorAll('.skeleton-loading'));
  }

  // Método para mostrar información de depuración en la consola
  debug() {
    // Este método es llamado por la página de test.
    console.group("🐛 SkeletonManager Debug Info");
    console.log("Is Initialized:", this.isInitialized);
    console.log("Configs:", this.skeletonConfigs);
    console.log("Active Skeletons:", this.getActiveSkeletons());
    console.groupEnd();
  }
}

// Crear instancia global
window.SkeletonManager = new SkeletonManager();

// Auto-inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.SkeletonManager.init();
  });
} else {
  window.SkeletonManager.init();
}

// Añadir estilos CSS al head
const skeletonStyles = `
<style>
.skeleton-shimmer {
  position: relative;
  overflow: hidden;
}

.skeleton-shimmer::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.6),
    transparent
  );
  animation: shimmer 2s infinite;
  z-index: 1;
}

@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}

.skeleton-loading {
  min-height: 200px;
}

/* Smooth transitions */
.skeleton-loading * {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .skeleton-shimmer::before {
    animation-duration: 1.5s;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .skeleton-shimmer::before {
    animation: none;
  }
  
  .animate-pulse {
    animation: none;
  }
}
</style>
`;

// Insertar estilos en el head
if (!document.querySelector('#skeleton-styles')) {
  const styleElement = document.createElement('style');
  styleElement.id = 'skeleton-styles';
  // Extraemos el contenido de las etiquetas <style> para inyectarlo correctamente
  styleElement.textContent = skeletonStyles.replace(/<style>|<\/style>/g, '').trim();
  document.head.appendChild(styleElement);
}

export default SkeletonManager;
