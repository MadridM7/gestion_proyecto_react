/**
 * @fileoverview Funciones auxiliares generales para la aplicación
 * Incluye utilidades para manipulación de datos, generación de IDs, etc.
 */

/**
 * Genera un ID único para una entidad
 * @param {string} prefix - Prefijo para el ID (ej: 'V' para ventas)
 * @returns {string} ID único generado
 */
export const generateId = (prefix = '') => {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}${timestamp}${random}`;
};

/**
 * Filtra un array de objetos por un término de búsqueda en múltiples campos
 * @param {Array} items - Array de objetos a filtrar
 * @param {string} searchTerm - Término de búsqueda
 * @param {Array} fields - Campos en los que buscar
 * @returns {Array} Array filtrado
 */
export const filterItems = (items, searchTerm, fields) => {
  if (!items || !Array.isArray(items) || items.length === 0) return [];
  if (!searchTerm || searchTerm.trim() === '') return items;
  if (!fields || !Array.isArray(fields) || fields.length === 0) return items;
  
  const term = searchTerm.toLowerCase().trim();
  
  return items.filter(item => {
    return fields.some(field => {
      const value = item[field];
      
      // Si el valor es null o undefined, no hay coincidencia
      if (value === null || value === undefined) return false;
      
      // Si es un número, convertirlo a string
      if (typeof value === 'number') {
        return value.toString().toLowerCase().includes(term);
      }
      
      // Si es un string, buscar directamente
      if (typeof value === 'string') {
        return value.toLowerCase().includes(term);
      }
      
      // Si es una fecha, convertirla a string
      if (value instanceof Date) {
        return value.toLocaleDateString('es-CL').includes(term);
      }
      
      // Para otros tipos, convertir a string
      return String(value).toLowerCase().includes(term);
    });
  });
};

/**
 * Ordena un array de objetos por un campo específico
 * @param {Array} items - Array de objetos a ordenar
 * @param {string} field - Campo por el que ordenar
 * @param {string} order - Orden ('asc' o 'desc')
 * @returns {Array} Array ordenado
 */
export const sortItems = (items, field, order = 'asc') => {
  if (!items || !Array.isArray(items) || items.length === 0) return [];
  if (!field) return items;
  
  const sortOrder = order === 'desc' ? -1 : 1;
  
  return [...items].sort((a, b) => {
    const valueA = a[field];
    const valueB = b[field];
    
    // Si ambos valores son null o undefined, son iguales
    if ((valueA === null || valueA === undefined) && 
        (valueB === null || valueB === undefined)) {
      return 0;
    }
    
    // Si solo valueA es null o undefined, va al final
    if (valueA === null || valueA === undefined) return 1 * sortOrder;
    
    // Si solo valueB es null o undefined, va al final
    if (valueB === null || valueB === undefined) return -1 * sortOrder;
    
    // Si ambos son fechas
    if (valueA instanceof Date && valueB instanceof Date) {
      return (valueA.getTime() - valueB.getTime()) * sortOrder;
    }
    
    // Si ambos son números
    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return (valueA - valueB) * sortOrder;
    }
    
    // Si ambos son strings
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return valueA.localeCompare(valueB, 'es-CL') * sortOrder;
    }
    
    // Para otros tipos, convertir a string
    return String(valueA).localeCompare(String(valueB), 'es-CL') * sortOrder;
  });
};

/**
 * Agrupa un array de objetos por un campo específico
 * @param {Array} items - Array de objetos a agrupar
 * @param {string} field - Campo por el que agrupar
 * @returns {Object} Objeto con los grupos
 */
export const groupBy = (items, field) => {
  if (!items || !Array.isArray(items) || items.length === 0) return {};
  if (!field) return { default: items };
  
  return items.reduce((groups, item) => {
    const value = item[field];
    const key = value !== null && value !== undefined ? value : 'otros';
    
    if (!groups[key]) {
      groups[key] = [];
    }
    
    groups[key].push(item);
    return groups;
  }, {});
};

/**
 * Calcula estadísticas básicas para un array de números
 * @param {Array} numbers - Array de números
 * @returns {Object} Objeto con estadísticas (suma, promedio, mínimo, máximo)
 */
export const calculateStats = (numbers) => {
  if (!numbers || !Array.isArray(numbers) || numbers.length === 0) {
    return {
      sum: 0,
      avg: 0,
      min: 0,
      max: 0,
      count: 0
    };
  }
  
  // Filtrar solo números válidos
  const validNumbers = numbers.filter(n => typeof n === 'number' && !isNaN(n));
  
  if (validNumbers.length === 0) {
    return {
      sum: 0,
      avg: 0,
      min: 0,
      max: 0,
      count: 0
    };
  }
  
  const sum = validNumbers.reduce((total, num) => total + num, 0);
  const avg = sum / validNumbers.length;
  const min = Math.min(...validNumbers);
  const max = Math.max(...validNumbers);
  
  return {
    sum,
    avg,
    min,
    max,
    count: validNumbers.length
  };
};

/**
 * Convierte un objeto a parámetros de URL
 * @param {Object} params - Objeto con parámetros
 * @returns {string} String de parámetros URL
 */
export const objectToQueryString = (params) => {
  if (!params || typeof params !== 'object') return '';
  
  return Object.keys(params)
    .filter(key => params[key] !== null && params[key] !== undefined && params[key] !== '')
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
};

/**
 * Convierte parámetros de URL a un objeto
 * @param {string} queryString - String de parámetros URL
 * @returns {Object} Objeto con parámetros
 */
export const queryStringToObject = (queryString) => {
  if (!queryString) return {};
  
  // Eliminar el signo de interrogación inicial si existe
  const query = queryString.startsWith('?') ? queryString.substring(1) : queryString;
  
  // Si no hay parámetros, retornar objeto vacío
  if (!query) return {};
  
  // Convertir a objeto
  return query.split('&').reduce((params, param) => {
    const [key, value] = param.split('=');
    params[decodeURIComponent(key)] = decodeURIComponent(value || '');
    return params;
  }, {});
};

/**
 * Compara dos objetos para determinar si son iguales
 * @param {Object} obj1 - Primer objeto
 * @param {Object} obj2 - Segundo objeto
 * @returns {boolean} True si los objetos son iguales
 */
export const areObjectsEqual = (obj1, obj2) => {
  // Si ambos son null o undefined, son iguales
  if (obj1 === obj2) return true;
  
  // Si solo uno es null o undefined, son diferentes
  if (obj1 === null || obj1 === undefined || obj2 === null || obj2 === undefined) return false;
  
  // Si no son objetos, comparar directamente
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object') return obj1 === obj2;
  
  // Obtener las claves de ambos objetos
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  // Si tienen diferente número de claves, son diferentes
  if (keys1.length !== keys2.length) return false;
  
  // Comparar cada clave y valor
  return keys1.every(key => {
    // Si la clave no existe en el segundo objeto, son diferentes
    if (!Object.prototype.hasOwnProperty.call(obj2, key)) return false;
    
    // Si los valores son objetos, llamar recursivamente
    if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
      return areObjectsEqual(obj1[key], obj2[key]);
    }
    
    // Comparar valores directamente
    return obj1[key] === obj2[key];
  });
};
