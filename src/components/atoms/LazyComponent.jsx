/**
 * @fileoverview Componente para cargar otros componentes de forma diferida (lazy loading)
 * Mejora el rendimiento al cargar componentes solo cuando son necesarios
 */
import React, { Suspense, lazy, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Spin } from 'antd';
import { LAZY_LOADING } from '../../config/performance';

/**
 * Componente para cargar otros componentes de forma diferida
 * @param {Object} props - Propiedades del componente
 * @param {Function|string} props.component - Componente a cargar o ruta al componente
 * @param {Object} props.fallback - Componente a mostrar mientras se carga
 * @param {number} props.delay - Tiempo de espera antes de cargar el componente
 * @param {Object} props.componentProps - Propiedades a pasar al componente cargado
 * @returns {JSX.Element} Componente cargado de forma diferida
 */
const LazyComponent = ({
  component,
  fallback = <Spin size="large" />,
  delay = LAZY_LOADING.DELAY,
  componentProps = {},
}) => {
  // Estado para controlar si el componente debe cargarse
  const [shouldLoad, setShouldLoad] = useState(delay === 0);
  
  // Cargar el componente después del tiempo de espera
  useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => {
        setShouldLoad(true);
      }, delay);
      
      return () => {
        clearTimeout(timer);
      };
    }
  }, [delay]);
  
  // Si no se debe cargar aún, mostrar el fallback
  if (!shouldLoad) {
    return fallback;
  }
  
  // Cargar el componente de forma diferida
  const LoadedComponent = typeof component === 'string'
    ? lazy(() => import(/* webpackChunkName: "[request]" */ `../../${component}`))
    : lazy(component);
  
  return (
    <Suspense fallback={fallback}>
      <LoadedComponent {...componentProps} />
    </Suspense>
  );
};

LazyComponent.propTypes = {
  component: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  fallback: PropTypes.node,
  delay: PropTypes.number,
  componentProps: PropTypes.object,
};

export default LazyComponent;
