/**
 * @fileoverview Página de gestión de pedidos con estructura Atomic Design
 */
import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import PedidosTemplate from '../components/templates/PedidosTemplate';
import PedidoFormulario from '../components/molecules/PedidoFormulario';
import useIsMobile from '../hooks/useIsMobile';

// Importar estilos CSS
import '../styles/pages/Pedidos.css';

/**
 * Página para la gestión de pedidos
 * @returns {JSX.Element} Página de pedidos
 */
const Pedidos = () => {
  const isMobile = useIsMobile();
  
  return (
    <MainLayout currentPage="Pedidos">
      <div className="pedidos-container">
        <PedidosTemplate 
          isMobile={isMobile}
          FormularioPedido={PedidoFormulario}
        />
      </div>
    </MainLayout>
  );
};

export default Pedidos;
