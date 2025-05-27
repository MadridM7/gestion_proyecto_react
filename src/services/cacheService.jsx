/**
 * @fileoverview Servicio de caché para mejorar el rendimiento de las solicitudes
 * Implementa un sistema de caché en memoria con tiempo de vida (TTL)
 */
import { CACHE_CONFIG } from '../config/performance';

/**
 * Clase para gestionar el caché de datos
 */
class CacheService {
  constructor() {
    this.cache = {};
    this.timestamps = {};
    this.size = 0;
  }

  /**
   * Obtiene un elemento del caché
   * @param {string} key - Clave del elemento
   * @returns {any|null} Elemento o null si no existe o ha expirado
   */
  get(key) {
    // Verificar si el elemento existe en caché
    if (!this.cache[key]) {
      return null;
    }

    // Verificar si el elemento ha expirado
    const timestamp = this.timestamps[key];
    const now = Date.now();
    if (now - timestamp > CACHE_CONFIG.TTL) {
      // Eliminar elemento expirado
      this.delete(key);
      return null;
    }

    // Actualizar timestamp (renovar tiempo de vida)
    this.timestamps[key] = now;
    
    // Devolver copia del elemento para evitar mutaciones
    return JSON.parse(JSON.stringify(this.cache[key]));
  }

  /**
   * Guarda un elemento en el caché
   * @param {string} key - Clave del elemento
   * @param {any} value - Valor a guardar
   */
  set(key, value) {
    // Si el caché está lleno, eliminar el elemento más antiguo
    if (this.size >= CACHE_CONFIG.MAX_SIZE && !this.cache[key]) {
      this.removeOldest();
    }

    // Guardar elemento y timestamp
    this.cache[key] = JSON.parse(JSON.stringify(value));
    this.timestamps[key] = Date.now();
    
    // Incrementar tamaño si es un elemento nuevo
    if (!this.cache[key]) {
      this.size++;
    }
  }

  /**
   * Elimina un elemento del caché
   * @param {string} key - Clave del elemento
   */
  delete(key) {
    if (this.cache[key]) {
      delete this.cache[key];
      delete this.timestamps[key];
      this.size--;
    }
  }
  
  /**
   * Invalida un elemento del caché sin eliminarlo completamente
   * Esto permite que las operaciones CRUD no recarguen la página
   * @param {string} key - Clave del elemento a invalidar
   * @param {boolean} includePattern - Si es true, invalida todas las claves que contienen la clave dada
   */
  invalidate(key, includePattern = false) {
    if (includePattern) {
      // Invalidar todas las claves que contienen la clave dada
      Object.keys(this.cache).forEach(cacheKey => {
        if (cacheKey.includes(key)) {
          // Establecer el timestamp a un valor que hará que expire en la próxima solicitud
          this.timestamps[cacheKey] = Date.now() - CACHE_CONFIG.TTL + 100; // Expirará en 100ms
        }
      });
    } else if (this.cache[key]) {
      // Invalidar solo la clave exacta
      this.timestamps[key] = Date.now() - CACHE_CONFIG.TTL + 100; // Expirará en 100ms
    }
  }

  /**
   * Limpia todo el caché
   */
  clear() {
    this.cache = {};
    this.timestamps = {};
    this.size = 0;
  }

  /**
   * Elimina el elemento más antiguo del caché
   * @private
   */
  removeOldest() {
    let oldestKey = null;
    let oldestTimestamp = Infinity;

    // Encontrar el elemento más antiguo
    Object.keys(this.timestamps).forEach(key => {
      if (this.timestamps[key] < oldestTimestamp) {
        oldestTimestamp = this.timestamps[key];
        oldestKey = key;
      }
    });

    // Eliminar el elemento más antiguo
    if (oldestKey) {
      this.delete(oldestKey);
    }
  }

  /**
   * Genera una clave de caché basada en la URL y los parámetros
   * @param {string} url - URL de la solicitud
   * @param {Object} params - Parámetros de la solicitud
   * @returns {string} Clave de caché
   */
  generateKey(url, params = {}) {
    return `${url}:${JSON.stringify(params)}`;
  }
}

// Exportar una única instancia para toda la aplicación
export const cacheService = new CacheService();

export default cacheService;
