/**
 * @fileoverview Página de gestión de ventas con estructura Atomic Design
 */
import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import VentasTemplate from '../components/templates/VentasTemplate';
import VentaFormulario from '../components/molecules/VentaFormulario';
import useIsMobile from '../hooks/useIsMobile';

// Importar estilos CSS
import '../styles/pages/Ventas.css';

/**
 * Página de gestión de ventas
 * @returns {JSX.Element} Página de Ventas
 */
const Ventas = () => {
  const isMobile = useIsMobile();

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
