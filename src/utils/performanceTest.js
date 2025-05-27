/**
 * @fileoverview Utilidad para realizar pruebas de rendimiento en la aplicación
 * Proporciona funciones para medir el tiempo de carga, uso de memoria y FPS
 */

/**
 * Mide el tiempo de carga de la página
 * @returns {number} Tiempo de carga en milisegundos
 */
export const measurePageLoadTime = () => {
  if (!window.performance) {
    console.warn('Performance API no disponible');
    return 0;
  }
  
  const timing = window.performance.timing;
  return timing.domContentLoadedEventEnd - timing.navigationStart;
};

/**
 * Mide el uso de memoria de la aplicación
 * @returns {Object} Información sobre el uso de memoria
 */
export const measureMemoryUsage = () => {
  if (!window.performance || !window.performance.memory) {
    console.warn('Memory API no disponible');
    return {
      usedJSHeapSize: 0,
      totalJSHeapSize: 0,
      jsHeapSizeLimit: 0,
      usagePercentage: 0
    };
  }
  
  const memory = window.performance.memory;
  const usagePercentage = Math.round((memory.usedJSHeapSize / memory.totalJSHeapSize) * 100);
  
  return {
    usedJSHeapSize: memory.usedJSHeapSize,
    totalJSHeapSize: memory.totalJSHeapSize,
    jsHeapSizeLimit: memory.jsHeapSizeLimit,
    usagePercentage
  };
};

/**
 * Mide los FPS (frames por segundo) de la aplicación
 * @param {number} duration - Duración de la medición en milisegundos
 * @returns {Promise<number>} Promesa que resuelve con los FPS promedio
 */
export const measureFPS = (duration = 1000) => {
  return new Promise((resolve) => {
    let frameCount = 0;
    let lastTime = performance.now();
    
    const countFrame = (timestamp) => {
      frameCount++;
      const elapsed = timestamp - lastTime;
      
      if (elapsed >= duration) {
        const fps = Math.round(frameCount * 1000 / elapsed);
        resolve(fps);
      } else {
        requestAnimationFrame(countFrame);
      }
    };
    
    requestAnimationFrame(countFrame);
  });
};

/**
 * Ejecuta una prueba de rendimiento completa
 * @param {Function} callback - Función a ejecutar durante la prueba
 * @param {number} iterations - Número de iteraciones a realizar
 * @returns {Promise<Object>} Resultados de la prueba
 */
export const runPerformanceTest = async (callback, iterations = 5) => {
  console.log(`Iniciando prueba de rendimiento (${iterations} iteraciones)...`);
  
  const results = {
    executionTimes: [],
    memoryUsage: [],
    fps: []
  };
  
  for (let i = 0; i < iterations; i++) {
    console.log(`Iteración ${i + 1}/${iterations}`);
    
    // Medir tiempo de ejecución
    const startTime = performance.now();
    await callback();
    const endTime = performance.now();
    const executionTime = endTime - startTime;
    results.executionTimes.push(executionTime);
    
    // Medir uso de memoria
    results.memoryUsage.push(measureMemoryUsage());
    
    // Medir FPS
    const fps = await measureFPS();
    results.fps.push(fps);
    
    // Esperar un poco entre iteraciones
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Calcular promedios
  const avgExecutionTime = results.executionTimes.reduce((sum, time) => sum + time, 0) / iterations;
  const avgMemoryUsage = results.memoryUsage.reduce((sum, mem) => sum + mem.usagePercentage, 0) / iterations;
  const avgFPS = results.fps.reduce((sum, fps) => sum + fps, 0) / iterations;
  
  console.log('Resultados de la prueba de rendimiento:');
  console.log(`Tiempo de ejecución promedio: ${avgExecutionTime.toFixed(2)} ms`);
  console.log(`Uso de memoria promedio: ${avgMemoryUsage.toFixed(2)}%`);
  console.log(`FPS promedio: ${avgFPS.toFixed(2)}`);
  
  return {
    avgExecutionTime,
    avgMemoryUsage,
    avgFPS,
    details: results
  };
};

/**
 * Compara el rendimiento de dos funciones
 * @param {Object} options - Opciones de la comparación
 * @param {Function} options.funcA - Primera función a comparar
 * @param {Function} options.funcB - Segunda función a comparar
 * @param {string} options.nameA - Nombre de la primera función
 * @param {string} options.nameB - Nombre de la segunda función
 * @param {number} options.iterations - Número de iteraciones
 * @returns {Promise<Object>} Resultados de la comparación
 */
export const comparePerformance = async ({ funcA, funcB, nameA = 'Función A', nameB = 'Función B', iterations = 5 }) => {
  console.log(`Comparando rendimiento de ${nameA} vs ${nameB}...`);
  
  console.log(`Ejecutando ${nameA}...`);
  const resultsA = await runPerformanceTest(funcA, iterations);
  
  console.log(`Ejecutando ${nameB}...`);
  const resultsB = await runPerformanceTest(funcB, iterations);
  
  // Calcular diferencias
  const executionTimeDiff = ((resultsB.avgExecutionTime - resultsA.avgExecutionTime) / resultsA.avgExecutionTime) * 100;
  const memoryUsageDiff = ((resultsB.avgMemoryUsage - resultsA.avgMemoryUsage) / resultsA.avgMemoryUsage) * 100;
  const fpsDiff = ((resultsB.avgFPS - resultsA.avgFPS) / resultsA.avgFPS) * 100;
  
  console.log('Resultados de la comparación:');
  console.log(`Tiempo de ejecución: ${nameA} es ${Math.abs(executionTimeDiff).toFixed(2)}% ${executionTimeDiff < 0 ? 'más rápido' : 'más lento'} que ${nameB}`);
  console.log(`Uso de memoria: ${nameA} usa ${Math.abs(memoryUsageDiff).toFixed(2)}% ${memoryUsageDiff < 0 ? 'menos' : 'más'} memoria que ${nameB}`);
  console.log(`FPS: ${nameA} tiene ${Math.abs(fpsDiff).toFixed(2)}% ${fpsDiff < 0 ? 'menos' : 'más'} FPS que ${nameB}`);
  
  return {
    [nameA]: resultsA,
    [nameB]: resultsB,
    comparison: {
      executionTimeDiff,
      memoryUsageDiff,
      fpsDiff
    }
  };
};

// Crear un objeto con todas las funciones exportadas
const performanceUtils = {
  measurePageLoadTime,
  measureMemoryUsage,
  measureFPS,
  runPerformanceTest,
  comparePerformance
};

export default performanceUtils;
