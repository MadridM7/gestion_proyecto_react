/**
 * @fileoverview Contexto para la gestión del rendimiento de la aplicación
 * Proporciona funcionalidades para monitorear y optimizar el rendimiento
 */
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { MEMOIZATION, CACHE_CONFIG, POLLING_CONFIG, VIRTUALIZATION } from '../config/performance';

// Crear el contexto de rendimiento
const PerformanceContext = createContext();

/**
 * Hook personalizado para acceder al contexto de rendimiento
 * @returns {Object} Contexto de rendimiento
 */
export const usePerformance = () => {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error('usePerformance debe ser usado dentro de un PerformanceProvider');
  }
  return context;
};

/**
 * Proveedor del contexto de rendimiento
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Componentes hijos
 * @returns {JSX.Element} Proveedor de contexto
 */
export const PerformanceProvider = ({ children }) => {
  // Estado para las métricas de rendimiento
  const [metrics, setMetrics] = useState({
    fps: 0,
    memory: {
      usedJSHeapSize: 0,
      totalJSHeapSize: 0,
      jsHeapSizeLimit: 0
    },
    loadTime: 0,
    renderCount: 0,
    networkRequests: 0,
    cacheHits: 0,
    cacheMisses: 0
  });
  
  // Estado para la configuración de rendimiento
  const [config, setConfig] = useState({
    memoization: MEMOIZATION.ENABLED,
    cache: {
      enabled: Object.values(CACHE_CONFIG.ENABLED).some(Boolean),
      ttl: CACHE_CONFIG.TTL
    },
    polling: {
      enabled: Object.values(POLLING_CONFIG.ENABLED).some(Boolean),
      interval: POLLING_CONFIG.DEFAULT_INTERVAL
    },
    virtualization: {
      enabled: true,
      threshold: VIRTUALIZATION.THRESHOLD
    }
  });
  
  /**
   * Actualiza las métricas de rendimiento
   * @param {Object} newMetrics - Nuevas métricas a actualizar
   */
  const updateMetrics = useCallback((newMetrics) => {
    setMetrics(prevMetrics => ({
      ...prevMetrics,
      ...newMetrics
    }));
  }, []);
  
  /**
   * Actualiza la configuración de rendimiento
   * @param {Object} newConfig - Nueva configuración a actualizar
   */
  const updateConfig = useCallback((newConfig) => {
    setConfig(prevConfig => ({
      ...prevConfig,
      ...newConfig
    }));
    
    // Actualizar la configuración global
    if (newConfig.memoization !== undefined) {
      MEMOIZATION.ENABLED = newConfig.memoization;
    }
    
    if (newConfig.cache?.enabled !== undefined) {
      Object.keys(CACHE_CONFIG.ENABLED).forEach(key => {
        CACHE_CONFIG.ENABLED[key] = newConfig.cache.enabled;
      });
    }
    
    if (newConfig.cache?.ttl !== undefined) {
      CACHE_CONFIG.TTL = newConfig.cache.ttl;
    }
    
    if (newConfig.polling?.enabled !== undefined) {
      Object.keys(POLLING_CONFIG.ENABLED).forEach(key => {
        POLLING_CONFIG.ENABLED[key] = newConfig.polling.enabled;
      });
    }
    
    if (newConfig.polling?.interval !== undefined) {
      POLLING_CONFIG.DEFAULT_INTERVAL = newConfig.polling.interval;
    }
    
    if (newConfig.virtualization?.threshold !== undefined) {
      VIRTUALIZATION.THRESHOLD = newConfig.virtualization.threshold;
    }
  }, []);
  
  /**
   * Registra una solicitud de red
   * @param {boolean} cacheHit - Indica si la solicitud fue servida desde caché
   */
  const registerNetworkRequest = useCallback((cacheHit = false) => {
    setMetrics(prevMetrics => ({
      ...prevMetrics,
      networkRequests: prevMetrics.networkRequests + 1,
      cacheHits: cacheHit ? prevMetrics.cacheHits + 1 : prevMetrics.cacheHits,
      cacheMisses: !cacheHit ? prevMetrics.cacheMisses + 1 : prevMetrics.cacheMisses
    }));
  }, []);
  
  /**
   * Registra un renderizado de componente
   */
  const registerRender = useCallback(() => {
    setMetrics(prevMetrics => ({
      ...prevMetrics,
      renderCount: prevMetrics.renderCount + 1
    }));
  }, []);
  
  /**
   * Mide el tiempo de carga de la página
   */
  useEffect(() => {
    // Medir tiempo de carga
    if (window.performance) {
      const loadTime = window.performance.timing.domContentLoadedEventEnd - 
                       window.performance.timing.navigationStart;
      
      updateMetrics({ loadTime });
    }
    
    // Medir FPS
    let frameCount = 0;
    let lastTime = performance.now();
    
    const measureFPS = () => {
      const now = performance.now();
      frameCount++;
      
      if (now - lastTime >= 1000) {
        const fps = Math.round(frameCount * 1000 / (now - lastTime));
        updateMetrics({ fps });
        
        frameCount = 0;
        lastTime = now;
      }
      
      requestAnimationFrame(measureFPS);
    };
    
    const fpsId = requestAnimationFrame(measureFPS);
    
    // Medir uso de memoria
    const measureMemory = () => {
      if (window.performance && window.performance.memory) {
        updateMetrics({
          memory: {
            usedJSHeapSize: window.performance.memory.usedJSHeapSize,
            totalJSHeapSize: window.performance.memory.totalJSHeapSize,
            jsHeapSizeLimit: window.performance.memory.jsHeapSizeLimit
          }
        });
      }
    };
    
    const memoryInterval = setInterval(measureMemory, 2000);
    
    return () => {
      cancelAnimationFrame(fpsId);
      clearInterval(memoryInterval);
    };
  }, [updateMetrics]);
  
  // Valores del contexto
  const contextValue = {
    metrics,
    config,
    updateMetrics,
    updateConfig,
    registerNetworkRequest,
    registerRender
  };
  
  return (
    <PerformanceContext.Provider value={contextValue}>
      {children}
    </PerformanceContext.Provider>
  );
};

export default PerformanceContext;
