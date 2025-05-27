/**
 * @fileoverview Punto de entrada principal de la aplicación
 * Integra los proveedores de contexto y optimizaciones de rendimiento
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './styles/common.css';
import App from './App.jsx';

// Importar proveedores de contexto para optimizaciones
import { PerformanceProvider } from './context/PerformanceContext';

// Función para medir el tiempo de carga inicial
const measureInitialLoad = () => {
  // Registrar el tiempo de carga en la consola
  if (window.performance) {
    window.addEventListener('load', () => {
      const timing = window.performance.timing;
      const loadTime = timing.domContentLoadedEventEnd - timing.navigationStart;
      console.log(`Tiempo de carga inicial: ${loadTime}ms`);
    });
  }

  // Registrar errores no capturados
  window.addEventListener('error', (event) => {
    console.error('Error no capturado:', event.error);
  });

  // Registrar rechazos de promesas no capturados
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Promesa rechazada no capturada:', event.reason);
  });
};

// Iniciar medición de rendimiento
measureInitialLoad();

// Crear la raíz de React
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderizar la aplicación con los proveedores de contexto
root.render(
  <React.StrictMode>
    <PerformanceProvider>
      <App />
    </PerformanceProvider>
  </React.StrictMode>
);
