/**
 * Servicio para actualizar datos periódicamente sin recompilar la aplicación
 * Utiliza polling para obtener datos actualizados del servidor
 * Implementa optimizaciones para reducir el consumo de recursos
 */

import { API_URL } from '../config';
import { POLLING_CONFIG } from '../config/performance';
import { cacheService } from './cacheService';

// Intervalo de polling en milisegundos (configurado en performance.jsx)
const DEFAULT_POLLING_INTERVAL = POLLING_CONFIG.DEFAULT_INTERVAL;

/**
 * Clase para gestionar el polling de datos
 */
class DataPoller {
  constructor() {
    this.pollingIntervals = {};
    this.callbacks = {};
    this.lastData = {};
  }

  /**
   * Inicia el polling para un tipo de datos específico
   * @param {string} dataType - Tipo de datos (ventas, productos, usuarios)
   * @param {Function} callback - Función a llamar cuando hay datos nuevos
   * @param {number} interval - Intervalo de polling en milisegundos
   */
  startPolling(dataType, callback, interval = null) {
    // Verificar si el polling está habilitado para este tipo de datos
    if (!POLLING_CONFIG.ENABLED[dataType]) {
      console.log(`Polling deshabilitado para ${dataType}`);
      return;
    }
    
    // Determinar el intervalo a utilizar (personalizado, específico por tipo o por defecto)
    const pollingInterval = interval || 
      POLLING_CONFIG.INTERVALS[dataType] || 
      DEFAULT_POLLING_INTERVAL;
    
    // Guardar el callback
    this.callbacks[dataType] = callback;
    
    // Configurar listener para eventos personalizados de actualización de datos
    // para evitar recargas durante operaciones CRUD
    this.setupEventListener(dataType);
    
    // Iniciar el polling si no está ya iniciado
    if (!this.pollingIntervals[dataType]) {
      console.log(`Iniciando polling para ${dataType} cada ${pollingInterval}ms`);
      
      // Hacer una primera carga inmediata
      this.fetchData(dataType);
      
      // Configurar el intervalo de polling con requestAnimationFrame para mejor rendimiento
      let lastTime = 0;
      const checkTime = (timestamp) => {
        if (!this.pollingIntervals[dataType]) return; // Detener si ya no existe
        
        const elapsed = timestamp - lastTime;
        
        if (elapsed >= pollingInterval) {
          lastTime = timestamp;
          this.fetchData(dataType);
        }
        
        // Programar siguiente verificación
        this.pollingIntervals[dataType] = requestAnimationFrame(checkTime);
      };
      
      // Iniciar ciclo de polling
      this.pollingIntervals[dataType] = requestAnimationFrame(checkTime);
    }
  }
  
  /**
   * Configura un listener para eventos personalizados de actualización de datos
   * Esta función ayuda a evitar recargas durante operaciones CRUD
   * @param {string} dataType - Tipo de datos (ventas, productos, usuarios)
   */
  setupEventListener(dataType) {
    // Verificar si ya existe un listener para este tipo de datos
    if (this[`eventListener_${dataType}`]) {
      return;
    }
    
    // Crear función de listener
    const handleUpdateEvent = (event) => {
      const { type, data } = event.detail;
      
      // Verificar si el evento es para este tipo de datos
      if (type === dataType && data) {
        // Actualizar los últimos datos conocidos
        this.lastData[dataType] = JSON.parse(JSON.stringify(data));
        
        // Llamar al callback si existe
        if (this.callbacks[dataType]) {
          // Envolver en setTimeout para evitar bloquear el hilo principal
          setTimeout(() => {
            this.callbacks[dataType](data);
          }, 0);
        }
      }
    };
    
    // Guardar referencia al listener para poder eliminarlo después
    this[`eventListener_${dataType}`] = handleUpdateEvent;
    
    // Añadir listener al evento personalizado
    window.addEventListener('dataPoller:update', handleUpdateEvent);
  }

  /**
   * Detiene el polling para un tipo de datos específico
   * @param {string} dataType - Tipo de datos (ventas, productos, usuarios)
   */
  stopPolling(dataType) {
    if (this.pollingIntervals[dataType]) {
      console.log(`Deteniendo polling para ${dataType}`);
      
      // Cancelar el requestAnimationFrame en lugar de clearInterval
      cancelAnimationFrame(this.pollingIntervals[dataType]);
      delete this.pollingIntervals[dataType];
      delete this.callbacks[dataType];
      
      // Eliminar el event listener si existe
      if (this[`eventListener_${dataType}`]) {
        window.removeEventListener('dataPoller:update', this[`eventListener_${dataType}`]);
        delete this[`eventListener_${dataType}`];
      }
    }
  }

  /**
   * Detiene todos los pollings activos
   */
  stopAllPolling() {
    // Detener todos los pollings silenciosamente
    Object.keys(this.pollingIntervals).forEach(dataType => {
      this.stopPolling(dataType);
    });
    
    // Limpiar todos los listeners restantes
    Object.keys(this).forEach(key => {
      if (key.startsWith('eventListener_')) {
        // No necesitamos almacenar dataType ya que solo usamos this[key]
        if (this[key]) {
          window.removeEventListener('dataPoller:update', this[key]);
          delete this[key];
        }
      }
    });
  }

  /**
   * Obtiene datos actualizados del servidor
   * @param {string} dataType - Tipo de datos (ventas, productos, usuarios)
   */
  async fetchData(dataType) {
    // Evitar múltiples solicitudes simultáneas para el mismo tipo de datos
    if (this[`fetching_${dataType}`]) return;
    
    try {
      this[`fetching_${dataType}`] = true;
      
      // Intentar obtener datos de la caché primero
      const cacheKey = `/${dataType}`;
      const cachedData = cacheService.get(cacheKey);
      
      // Si hay datos en caché y no han pasado más de 5 segundos, usarlos
      const now = Date.now();
      const lastFetchTime = this[`lastFetchTime_${dataType}`] || 0;
      const useCache = cachedData && (now - lastFetchTime < 5000);
      
      if (useCache) {
        // Usar datos de caché
        if (this.hasDataChanged(dataType, cachedData)) {
          this.lastData[dataType] = JSON.parse(JSON.stringify(cachedData));
          if (this.callbacks[dataType]) {
            this.callbacks[dataType](cachedData);
          }
        }
      } else {
        // Hacer solicitud al servidor usando fetch con keepalive para evitar recargas
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // Timeout de 5 segundos
        
        const response = await fetch(`${API_URL}/${dataType}`, {
          signal: controller.signal,
          keepalive: true, // Mantener la conexión viva incluso si la página cambia
          headers: {
            'X-Requested-With': 'XMLHttpRequest', // Indicar que es una solicitud AJAX
            'Cache-Control': 'no-store', // Evitar caché del navegador
            'Pragma': 'no-cache'
          }
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`Error al obtener ${dataType}`);
        }
        
        const data = await response.json();
        this[`lastFetchTime_${dataType}`] = now;
        
        // Guardar en caché con una estrategia optimizada
        if (!this.lastData[dataType] || this.hasDataChanged(dataType, data)) {
          cacheService.set(cacheKey, data);
          
          // Clonar los datos para evitar mutaciones accidentales
          const clonedData = JSON.parse(JSON.stringify(data));
          this.lastData[dataType] = clonedData;
          
          // Llamar al callback si existe, pero solo si los datos han cambiado
          if (this.callbacks[dataType]) {
            // Usar setTimeout para evitar bloquear el hilo principal
            setTimeout(() => {
              this.callbacks[dataType](clonedData);
            }, 0);
          }
        }
      }
    } catch (error) {
      // Capturar y registrar error
      if (error.name !== 'AbortError') {
        console.error(`Error en fetchData para ${dataType}:`, error.message);
      }
    } finally {
      this[`fetching_${dataType}`] = false;
    }
  }

  /**
   * Verifica si los datos han cambiado comparando con los últimos datos obtenidos
   * @param {string} dataType - Tipo de datos (ventas, productos, usuarios)
   * @param {Array|Object} newData - Nuevos datos a comparar
   * @returns {boolean} true si los datos han cambiado, false en caso contrario
   */
  hasDataChanged(dataType, newData) {
    // Si no hay datos anteriores, consideramos que han cambiado
    if (!this.lastData[dataType]) {
      return true;
    }
    
    // Comparar los datos
    const lastDataStr = JSON.stringify(this.lastData[dataType]);
    const newDataStr = JSON.stringify(newData);
    
    return lastDataStr !== newDataStr;
  }
}

// Exportar una única instancia para toda la aplicación
export const dataPoller = new DataPoller();

export default dataPoller;
