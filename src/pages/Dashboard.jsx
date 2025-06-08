/**
 * @fileoverview Página principal del dashboard que muestra estadísticas y gráficos avanzados
 * Implementado siguiendo el patrón de diseño Atomic Design
 */
import React from 'react';
import MainLayout from '../components/layout/MainLayout.jsx';
import VentasDashboard from '../components/organisms/VentasDashboard.jsx';
import { TimeRangeProvider } from '../context/TimeRangeContext.jsx';

// Importar estilos CSS
import '../styles/pages/Dashboard.css';

/**
 * Página principal del Dashboard que muestra un resumen de las métricas clave de ventas
 * Diseñado para ser completamente responsivo en dispositivos móviles, tablets y desktops
 * @returns {JSX.Element} Página de Dashboard con KPIs, gráficos avanzados y tablas dinámicas
 */
const Dashboard = () => {
 

  // Función para visualizar detalles de una venta
  const handleViewSaleDetails = (sale) => {
    if (!sale) return;
    console.log('Detalles de la venta:', sale);
    // Aquí se podría implementar la navegación a los detalles de la venta
    // o mostrar un modal con los detalles
  };

  return (
    <MainLayout currentPage="Dashboard">
      {/* Proveedor de contexto para el rango de tiempo */}
      <TimeRangeProvider>
        <div className="dashboard-page">
          <div className="dashboard-container">
            <VentasDashboard 
              showWelcomePanel={true}
              showKPIs={true}
              showCharts={true}
              showTable={true}
              onRowClick={handleViewSaleDetails}
            />
          </div>
        </div>
      </TimeRangeProvider>
    </MainLayout>
  );
};

export default Dashboard;
