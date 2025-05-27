/**
 * @fileoverview Componente para cargar imágenes de forma diferida (lazy loading)
 * Mejora el rendimiento al cargar imágenes solo cuando son visibles en la pantalla
 */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Spin } from 'antd';
import '../../styles/components/atoms/LazyImage.css';

/**
 * Componente para cargar imágenes de forma diferida
 * @param {Object} props - Propiedades del componente
 * @param {string} props.src - URL de la imagen
 * @param {string} props.alt - Texto alternativo para la imagen
 * @param {string} props.className - Clase CSS adicional
 * @param {Object} props.style - Estilos adicionales
 * @param {Function} props.onLoad - Función a ejecutar cuando la imagen se carga
 * @param {Function} props.onError - Función a ejecutar cuando hay un error al cargar la imagen
 * @returns {JSX.Element} Imagen con carga diferida
 */
const LazyImage = ({
  src,
  alt = '',
  className = '',
  style = {},
  onLoad,
  onError,
  ...props
}) => {
  // Estado para controlar si la imagen está cargada
  const [isLoaded, setIsLoaded] = useState(false);
  // Estado para controlar si la imagen está visible
  const [isVisible, setIsVisible] = useState(false);
  // Estado para controlar si hay un error al cargar la imagen
  const [hasError, setHasError] = useState(false);
  // Referencia al elemento de imagen
  const imgRef = useRef(null);
  
  // Efecto para detectar cuando la imagen es visible en la pantalla
  useEffect(() => {
    // Crear un observador de intersección para detectar cuando la imagen es visible
    const observer = new IntersectionObserver((entries) => {
      // Si la imagen es visible, cargarla
      if (entries[0].isIntersecting) {
        setIsVisible(true);
        // Dejar de observar una vez que es visible
        observer.disconnect();
      }
    }, {
      // Opciones del observador
      rootMargin: '50px', // Cargar la imagen cuando está a 50px de ser visible
      threshold: 0.1 // Cargar cuando al menos el 10% de la imagen es visible
    });
    
    // Guardar una referencia al elemento actual para usarla en la limpieza
    const currentImgRef = imgRef.current;
    
    // Empezar a observar la imagen
    if (currentImgRef) {
      observer.observe(currentImgRef);
    }
    
    // Limpiar el observador cuando el componente se desmonta
    return () => {
      // Usar la referencia guardada en lugar de imgRef.current
      if (currentImgRef) {
        observer.disconnect();
      }
    };
  }, []);
  
  /**
   * Maneja el evento de carga de la imagen
   */
  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };
  
  /**
   * Maneja el evento de error al cargar la imagen
   */
  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
    if (onError) onError();
  };
  
  return (
    <div 
      ref={imgRef}
      className={`lazy-image-container ${className}`}
      style={style}
    >
      {/* Mostrar spinner mientras la imagen se carga */}
      {!isLoaded && isVisible && (
        <div className="lazy-image-loading">
          <Spin size="small" />
        </div>
      )}
      
      {/* Mostrar mensaje de error si hay un problema al cargar la imagen */}
      {hasError && (
        <div className="lazy-image-error">
          <span>Error al cargar la imagen</span>
        </div>
      )}
      
      {/* Cargar la imagen solo cuando es visible */}
      {isVisible && (
        <img
          src={src}
          alt={alt}
          className={`lazy-image ${isLoaded ? 'loaded' : ''}`}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      )}
      
      {/* Placeholder mientras la imagen no es visible */}
      {!isVisible && (
        <div className="lazy-image-placeholder" />
      )}
    </div>
  );
};

LazyImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  onLoad: PropTypes.func,
  onError: PropTypes.func
};

export default LazyImage;
