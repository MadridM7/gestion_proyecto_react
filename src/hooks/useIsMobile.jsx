import { useState, useEffect } from 'react';

/**
 * Hook personalizado para detectar si la pantalla es de tamaño móvil
 * @param {number} breakpoint - Punto de quiebre para considerar pantalla móvil (por defecto 768px)
 * @returns {boolean} - True si la pantalla es de tamaño móvil, false en caso contrario
 */
const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Verificar al montar el componente
    checkIsMobile();

    // Agregar listener para cambios de tamaño de ventana
    window.addEventListener('resize', checkIsMobile);

    // Limpiar listener al desmontar
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, [breakpoint]);

  return isMobile;
};

export default useIsMobile;
