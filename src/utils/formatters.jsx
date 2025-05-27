/**
 * @fileoverview Utilidades para formatear diferentes tipos de datos
 * Incluye funciones para formatear fechas, moneda, números, etc.
 */

/**
 * Formatea una fecha en formato DD/MM/YYYY
 * @param {Date} date - Objeto Date a formatear
 * @returns {string} Fecha formateada
 */
export const formatDate = (date) => {
  if (!date) return '';
  
  // Asegurarse de que sea un objeto Date
  const dateObj = date instanceof Date ? date : new Date(date);
  
  // Verificar si la fecha es válida
  if (isNaN(dateObj.getTime())) return 'Fecha inválida';
  
  // Formatear como DD/MM/YYYY
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getFullYear();
  
  return `${day}/${month}/${year}`;
};

/**
 * Formatea una fecha y hora en formato DD/MM/YYYY HH:MM
 * @param {Date} date - Objeto Date a formatear
 * @returns {string} Fecha y hora formateada
 */
export const formatDateTime = (date) => {
  if (!date) return '';
  
  // Asegurarse de que sea un objeto Date
  const dateObj = date instanceof Date ? date : new Date(date);
  
  // Verificar si la fecha es válida
  if (isNaN(dateObj.getTime())) return 'Fecha inválida';
  
  // Formatear como DD/MM/YYYY HH:MM
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getFullYear();
  const hours = dateObj.getHours().toString().padStart(2, '0');
  const minutes = dateObj.getMinutes().toString().padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

/**
 * Formatea un número como moneda CLP
 * @param {number} amount - Monto a formatear
 * @returns {string} Monto formateado como moneda CLP
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '$0';
  
  // Convertir a número si es string
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Verificar si es un número válido
  if (isNaN(numAmount)) return '$0';
  
  // Formatear como moneda CLP con separador de miles
  return `$${numAmount.toLocaleString('es-CL')}`;
};

/**
 * Formatea un número con separadores de miles
 * @param {number} number - Número a formatear
 * @returns {string} Número formateado con separadores de miles
 */
export const formatNumber = (number) => {
  if (number === null || number === undefined) return '0';
  
  // Convertir a número si es string
  const num = typeof number === 'string' ? parseFloat(number) : number;
  
  // Verificar si es un número válido
  if (isNaN(num)) return '0';
  
  // Formatear con separadores de miles
  return num.toLocaleString('es-CL');
};

/**
 * Trunca un texto si excede la longitud máxima
 * @param {string} text - Texto a truncar
 * @param {number} maxLength - Longitud máxima permitida
 * @returns {string} Texto truncado con "..." si excede la longitud máxima
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  
  if (text.length <= maxLength) return text;
  
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Formatea un porcentaje
 * @param {number} value - Valor a formatear como porcentaje
 * @param {number} decimals - Número de decimales a mostrar
 * @returns {string} Porcentaje formateado
 */
export const formatPercentage = (value, decimals = 2) => {
  if (value === null || value === undefined) return '0%';
  
  // Convertir a número si es string
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  // Verificar si es un número válido
  if (isNaN(numValue)) return '0%';
  
  // Formatear como porcentaje con el número de decimales especificado
  return `${numValue.toFixed(decimals)}%`;
};
