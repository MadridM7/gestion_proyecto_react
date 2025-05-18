/**
 * Servicio para actualizar datos periódicamente sin recompilar la aplicación
 * Utiliza polling para obtener datos actualizados del servidor
 */

import { API_URL } from '../config';

// Intervalo de polling en milisegundos (por defecto: 10 segundos)
const DEFAULT_POLLING_INTERVAL = 10000;

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
  startPolling(dataType, callback, interval = DEFAULT_POLLING_INTERVAL) {
    // Guardar el callback
    this.callbacks[dataType] = callback;
    
    // Iniciar el polling si no está ya iniciado
    if (!this.pollingIntervals[dataType]) {
      console.log(`Iniciando polling para ${dataType} cada ${interval}ms`);
      
      // Hacer una primera carga inmediata
      this.fetchData(dataType);
      
      // Configurar el intervalo de polling
      this.pollingIntervals[dataType] = setInterval(() => {
        this.fetchData(dataType);
      }, interval);
    }
  }

  /**
   * Detiene el polling para un tipo de datos específico
   * @param {string} dataType - Tipo de datos (ventas, productos, usuarios)
   */
  stopPolling(dataType) {
    if (this.pollingIntervals[dataType]) {
      console.log(`Deteniendo polling para ${dataType}`);
      clearInterval(this.pollingIntervals[dataType]);
      delete this.pollingIntervals[dataType];
      delete this.callbacks[dataType];
    }
  }

  /**
   * Detiene todos los pollings activos
   */
  stopAllPolling() {
    console.log('Deteniendo todos los pollings');
    Object.keys(this.pollingIntervals).forEach(dataType => {
      this.stopPolling(dataType);
    });
  }

  /**
   * Obtiene datos actualizados del servidor
   * @param {string} dataType - Tipo de datos (ventas, productos, usuarios)
   */
  async fetchData(dataType) {
    try {
      const response = await fetch(`${API_URL}/${dataType}`);
      
      if (!response.ok) {
        throw new Error(`Error al obtener ${dataType}`);
      }
      
      const data = await response.json();
      
      // Verificar si los datos han cambiado
      if (this.hasDataChanged(dataType, data)) {
        console.log(`Datos de ${dataType} actualizados`);
        this.lastData[dataType] = JSON.parse(JSON.stringify(data));
        
        // Llamar al callback si existe
        if (this.callbacks[dataType]) {
          this.callbacks[dataType](data);
        }
      }
    } catch (error) {
      console.error(`Error en el polling de ${dataType}:`, error);
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
