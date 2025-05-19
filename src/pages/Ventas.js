/**
 * @fileoverview Página de gestión de ventas con estructura Atomic Design
 */
import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import VentasTemplate from '../components/templates/VentasTemplate';
import VentaFormulario from '../components/molecules/VentaFormulario';

// Importar estilos CSS
import '../styles/pages/Ventas.css';

/**
 * Página de gestión de ventas
 * @returns {JSX.Element} Página de Ventas
 */
const Ventas = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  // Detectar si es un dispositivo móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Verificar al cargar
    checkMobile();
    
    // Agregar listener para cambios de tamaño
    window.addEventListener('resize', checkMobile);
    
    // Limpiar listener al desmontar
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return (
    <MainLayout currentPage="Ventas">
      <div className="ventas-container">
        <VentasTemplate 
          isMobile={isMobile}
          FormularioVenta={VentaFormulario}
        />
      </div>
    </MainLayout>
  );
};

export default Ventas;
