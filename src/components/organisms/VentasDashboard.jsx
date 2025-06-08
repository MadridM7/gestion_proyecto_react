/**
 * @fileoverview Dashboard de ventas mejorado que integra múltiples componentes con métricas avanzadas
 * Optimizado para dispositivos móviles y desktop con diseño responsivo
 */
import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Empty } from 'antd';
import PropTypes from 'prop-types';
import { useVentas } from '../../context/VentasContext';
import { useTimeRange } from '../../context/TimeRangeContext';

// Importar componentes
import KPIContainer from './KPIContainer';
import SalesChart from './SalesChart';
import PaymentTypeChart from './PaymentTypeChart';
import TopProductsChart from './TopProductsChart';
import RecentSalesTable from './RecentSalesTable';
import TimeRangeFilter from '../molecules/TimeRangeFilter';

// Importar estilos
import '../../styles/components/organisms/VentasDashboard.css';

/**
 * Componente de Dashboard de Ventas que muestra un panel de bienvenida, KPIs, gráficos y tabla de ventas recientes
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.showWelcomePanel - Indica si se muestra el panel de bienvenida
 * @param {boolean} props.showKPIs - Indica si se muestran las tarjetas de KPI
 * @param {boolean} props.showCharts - Indica si se muestran los gráficos
 * @param {boolean} props.showTable - Indica si se muestra la tabla de ventas
 * @param {Function} props.onRowClick - Función para manejar el clic en una fila de la tabla
 * @param {Function} props.onNewSale - Función para crear una nueva venta
 * @returns {JSX.Element} Dashboard de ventas
 */
const VentasDashboard = ({
  showWelcomePanel = true,
  showKPIs = true,
  showCharts = true,
  showTable = true,
  onRowClick,
  onNewSale,
  onEdit,
  dataSource
}) => {
  const { ventas, loading } = useVentas();
  const { timeRange } = useTimeRange();
  const [isMobile, setIsMobile] = useState(false);
  
  // Efecto para detectar si es un dispositivo móvil
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Verificar al cargar la página
    checkIfMobile();
    
    // Agregar listener para cambios de tamaño de pantalla
    window.addEventListener('resize', checkIfMobile);
    
    // Limpiar el listener cuando se desmonta el componente
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);
  
  // Función para redireccionar a la pestaña de ventas
  const handleViewAllSales = () => {
    // Redirigir a la página de ventas utilizando la navegación
    window.location.href = '/ventas';
    console.log('Redireccionando a la página de ventas');
  };

  return (
    <div className={`ventas-dashboard ${isMobile ? 'mobile-view' : ''}`}>
      {/* Header con filtro de tiempo */}
      <Card className="dashboard-header mobile-friendly-card">
        <TimeRangeFilter />
      </Card>

      {/* KPIs */}
      {showKPIs && (
        <div className="ventas-dashboard-row">
          <KPIContainer ventas={ventas} timeRange={timeRange} loading={loading} isMobile={isMobile} />
        </div>
      )}

      {/* Gráficos principales */}
      {showCharts && (
        <>
          <Row gutter={[16, isMobile ? 12 : 16]} className="ventas-dashboard-row">
            <Col xs={24} sm={24} lg={16}>
              <SalesChart ventas={ventas} loading={loading} timeRange={timeRange} isMobile={isMobile} className="chart-card" />
            </Col>
            <Col xs={24} sm={24} lg={8}>
              <PaymentTypeChart ventas={ventas} loading={loading} timeRange={timeRange} isMobile={isMobile} className="chart-card" />
            </Col>
          </Row>

          {/* Tabla de ventas recientes y gráfico de productos más vendidos */}
          <Row gutter={[16, isMobile ? 12 : 16]} className="ventas-dashboard-row">
            {showTable && (
              <Col xs={24} sm={24} lg={16}>
                {ventas && ventas.length > 0 ? (
                  <RecentSalesTable 
                    ventas={ventas} 
                    loading={loading} 
                    onViewDetail={handleViewAllSales} 
                    timeRange={timeRange}
                    isMobile={isMobile}
                    className="table-card"
                  />
                ) : (
                  <Card className="mobile-friendly-card">
                    <Empty description="No hay ventas para mostrar" />
                  </Card>
                )}
              </Col>
            )}
            
            <Col xs={24} sm={24} lg={8}>
              <TopProductsChart 
                ventas={ventas} 
                loading={loading}
                timeRange={timeRange} 
                limit={isMobile ? 3 : 5} 
                isMobile={isMobile}
                className="chart-card"
              />
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

VentasDashboard.propTypes = {
  onEdit: PropTypes.func,
  showTable: PropTypes.bool,
  showKPIs: PropTypes.bool,
  showCharts: PropTypes.bool,
  dataSource: PropTypes.array,
  onRowClick: PropTypes.func
};

export default VentasDashboard;
