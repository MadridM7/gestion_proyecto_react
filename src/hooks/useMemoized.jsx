/**
 * @fileoverview Hook personalizado para memoización de componentes y funciones
 * Proporciona una forma sencilla de aplicar React.memo y useMemo con opciones avanzadas
 */
import { useMemo, useCallback, useRef } from 'react';
import { MEMOIZATION } from '../config/performance';

/**
 * Compara profundamente dos objetos para determinar si son iguales
 * @param {any} a - Primer objeto a comparar
 * @param {any} b - Segundo objeto a comparar
 * @param {Array} ignoreDeps - Dependencias a ignorar en la comparación
 * @returns {boolean} true si los objetos son iguales, false en caso contrario
 */
export const deepEqual = (a, b, ignoreDeps = MEMOIZATION.IGNORE_DEPS) => {
  // Si son el mismo objeto o ambos son null/undefined
  if (a === b) return true;
  
  // Si uno es null/undefined pero el otro no
  if (a == null || b == null) return false;
  
  // Si no son objetos, comparar directamente
  if (typeof a !== 'object' || typeof b !== 'object') return a === b;
  
  // Obtener claves de ambos objetos
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  
  // Si tienen diferente número de claves
  if (keysA.length !== keysB.length) return false;
  
  // Comparar cada clave
  return keysA.every(key => {
    // Ignorar dependencias específicas (como funciones de callback)
    if (ignoreDeps.includes(key)) return true;
    
    // Comparar recursivamente
    return deepEqual(a[key], b[key], ignoreDeps);
  });
};

/**
 * Hook para memoizar un valor con comparación profunda
 * @param {any} value - Valor a memoizar
 * @param {Array} deps - Dependencias para la memoización
 * @param {Array} ignoreDeps - Dependencias a ignorar en la comparación
 * @returns {any} Valor memoizado
 */
export const useMemoized = (value, deps = [], ignoreDeps = MEMOIZATION.IGNORE_DEPS) => {
  // Referencia al valor anterior
  const prevDepsRef = useRef(deps);
  
  // Memoizar el valor solo si las dependencias han cambiado o la memoización está deshabilitada
  return useMemo(() => {
    // Si la memoización está deshabilitada, devolver el valor directamente
    if (!MEMOIZATION.ENABLED) return value;
    
    // Comparar dependencias actuales con las anteriores
    const depsChanged = !deepEqual(deps, prevDepsRef.current, ignoreDeps);
    
    // Actualizar referencia si las dependencias han cambiado
    if (depsChanged) {
      prevDepsRef.current = deps;
    }
    
    // Devolver el valor
    return value;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, deps, ignoreDeps]);
};

/**
 * Hook para memoizar una función con comparación profunda
 * @param {Function} fn - Función a memoizar
 * @param {Array} deps - Dependencias para la memoización
 * @param {Array} ignoreDeps - Dependencias a ignorar en la comparación
 * @returns {Function} Función memoizada
 */
export const useMemoizedCallback = (fn, deps = [], ignoreDeps = MEMOIZATION.IGNORE_DEPS) => {
  // Referencia a las dependencias anteriores
  const prevDepsRef = useRef(deps);
  
  // Memoizar la función solo si las dependencias han cambiado
  return useCallback((...args) => {
    // Si la memoización está deshabilitada, ejecutar la función directamente
    if (!MEMOIZATION.ENABLED) return fn(...args);
    
    // Comparar dependencias actuales con las anteriores
    const depsChanged = !deepEqual(deps, prevDepsRef.current, ignoreDeps);
    
    // Actualizar referencia si las dependencias han cambiado
    if (depsChanged) {
      prevDepsRef.current = deps;
    }
    
    // Ejecutar la función con los argumentos recibidos
    return fn(...args);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fn, deps, ignoreDeps]);
};

export default useMemoized;
