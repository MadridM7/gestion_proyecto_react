/**
 * @fileoverview Utilidades para validación de formularios
 * Incluye funciones para validar diferentes tipos de datos como emails, números, etc.
 */

/**
 * Valida si un valor es requerido (no es null, undefined, o string vacío)
 * @param {any} value - Valor a validar
 * @returns {boolean} True si el valor no está vacío
 */
export const isRequired = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
};

/**
 * Valida si un valor es un email válido
 * @param {string} email - Email a validar
 * @returns {boolean} True si el email es válido
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  
  // Expresión regular para validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida si un valor es un número
 * @param {any} value - Valor a validar
 * @returns {boolean} True si el valor es un número
 */
export const isNumber = (value) => {
  if (value === null || value === undefined) return false;
  
  // Si es un número, retornar true
  if (typeof value === 'number') return !isNaN(value);
  
  // Si es un string, intentar convertirlo a número
  if (typeof value === 'string') {
    const num = parseFloat(value);
    return !isNaN(num);
  }
  
  return false;
};

/**
 * Valida si un valor es un número positivo
 * @param {any} value - Valor a validar
 * @returns {boolean} True si el valor es un número positivo
 */
export const isPositiveNumber = (value) => {
  if (!isNumber(value)) return false;
  
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return num > 0;
};

/**
 * Valida si un valor es un número entero
 * @param {any} value - Valor a validar
 * @returns {boolean} True si el valor es un número entero
 */
export const isInteger = (value) => {
  if (!isNumber(value)) return false;
  
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return Number.isInteger(num);
};

/**
 * Valida si un valor está dentro de un rango
 * @param {number} value - Valor a validar
 * @param {number} min - Valor mínimo
 * @param {number} max - Valor máximo
 * @returns {boolean} True si el valor está dentro del rango
 */
export const isInRange = (value, min, max) => {
  if (!isNumber(value)) return false;
  
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return num >= min && num <= max;
};

/**
 * Valida si una fecha es válida
 * @param {Date|string} date - Fecha a validar
 * @returns {boolean} True si la fecha es válida
 */
export const isValidDate = (date) => {
  if (!date) return false;
  
  // Si es un string, intentar convertirlo a Date
  const dateObj = date instanceof Date ? date : new Date(date);
  
  // Verificar si la fecha es válida
  return !isNaN(dateObj.getTime());
};

/**
 * Valida si una fecha está en el pasado
 * @param {Date|string} date - Fecha a validar
 * @returns {boolean} True si la fecha está en el pasado
 */
export const isPastDate = (date) => {
  if (!isValidDate(date)) return false;
  
  const dateObj = date instanceof Date ? date : new Date(date);
  const now = new Date();
  
  return dateObj < now;
};

/**
 * Valida si una fecha está en el futuro
 * @param {Date|string} date - Fecha a validar
 * @returns {boolean} True si la fecha está en el futuro
 */
export const isFutureDate = (date) => {
  if (!isValidDate(date)) return false;
  
  const dateObj = date instanceof Date ? date : new Date(date);
  const now = new Date();
  
  return dateObj > now;
};

/**
 * Valida si un string tiene una longitud mínima
 * @param {string} value - String a validar
 * @param {number} minLength - Longitud mínima requerida
 * @returns {boolean} True si el string tiene al menos la longitud mínima
 */
export const hasMinLength = (value, minLength) => {
  if (!value || typeof value !== 'string') return false;
  
  return value.length >= minLength;
};

/**
 * Valida si un string tiene una longitud máxima
 * @param {string} value - String a validar
 * @param {number} maxLength - Longitud máxima permitida
 * @returns {boolean} True si el string no excede la longitud máxima
 */
export const hasMaxLength = (value, maxLength) => {
  if (!value || typeof value !== 'string') return false;
  
  return value.length <= maxLength;
};
