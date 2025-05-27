/**
 * @fileoverview Configuración de rendimiento para la aplicación
 * Contiene constantes y configuraciones para optimizar el rendimiento
 */

// Configuración para el sistema de polling
export const POLLING_CONFIG = {
  // Intervalo de actualización en milisegundos (30 segundos por defecto)
  DEFAULT_INTERVAL: 30000,
  
  // Habilitar/deshabilitar polling para diferentes tipos de datos
  ENABLED: {
    ventas: true,
    productos: true,
    usuarios: true,
    pedidos: true
  },
  
  // Intervalos personalizados por tipo de datos (en milisegundos)
  INTERVALS: {
    ventas: 20000,      // 20 segundos
    productos: 60000,   // 1 minuto
    usuarios: 120000,   // 2 minutos
    pedidos: 30000      // 30 segundos
  }
};

// Configuración para la carga diferida (lazy loading)
export const LAZY_LOADING = {
  // Tiempo de espera antes de cargar componentes no críticos (en milisegundos)
  DELAY: 300,
  
  // Tamaño de página para paginación
  PAGE_SIZE: 10,
  
  // Número máximo de elementos a cargar inicialmente
  INITIAL_LOAD_LIMIT: 20
};

// Configuración para caché
export const CACHE_CONFIG = {
  // Tiempo de vida de la caché en milisegundos (5 minutos)
  TTL: 300000,
  
  // Tamaño máximo de caché (número de elementos)
  MAX_SIZE: 100,
  
  // Habilitar/deshabilitar caché para diferentes tipos de datos
  ENABLED: {
    ventas: true,
    productos: true,
    usuarios: true,
    pedidos: true
  }
};

// Configuración para memoización
export const MEMOIZATION = {
  // Habilitar/deshabilitar memoización global
  ENABLED: true,
  
  // Dependencias a ignorar en comparaciones de memoización
  IGNORE_DEPS: ['onUpdate', 'onChange', 'onSelect']
};

// Configuración para virtualización de listas
export const VIRTUALIZATION = {
  // Altura de fila para listas virtualizadas (en píxeles)
  ROW_HEIGHT: 50,
  
  // Número de filas a renderizar fuera de la vista
  OVERSCAN_COUNT: 5,
  
  // Umbral para activar virtualización (número de elementos)
  THRESHOLD: 50
};
