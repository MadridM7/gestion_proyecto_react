/**
 * Configuración global de la aplicación
 * Proporciona variables y funciones de configuración para toda la aplicación
 */

/**
 * Detecta automáticamente la URL base del servidor API
 * Funciona tanto en desarrollo local como en red (dispositivos móviles)
 * @returns {string} URL base del servidor API
 */
export const getApiBaseUrl = () => {
  // Obtener el hostname actual (funciona tanto en localhost como en red)
  const hostname = window.location.hostname;
  
  // Si estamos en desarrollo local, usar localhost
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:3001';
  }
  
  // Si estamos accediendo desde otro dispositivo, usar la IP del servidor
  return `http://${hostname}:3001`;
};

/**
 * URL base del servidor API
 */
export const API_BASE_URL = getApiBaseUrl();

/**
 * URL de la API para operaciones CRUD
 */
export const API_URL = `${API_BASE_URL}/api`;

/**
 * Configuración de la aplicación
 */
export const CONFIG = {
  APP_NAME: 'VentaSoft Analytics Pro',
  VERSION: '1.0.0',
  CURRENCY: 'CLP',
  DATE_FORMAT: 'DD/MM/YYYY',
  TIME_FORMAT: 'HH:mm',
  DATETIME_FORMAT: 'DD/MM/YYYY HH:mm',
  DEFAULT_LOCALE: 'es-CL',
};

const config = {
  API_URL,
  API_BASE_URL,
  CONFIG,
};

export default config;
