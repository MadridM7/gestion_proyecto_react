/**
 * @fileoverview Dashboard de ventas que integra varios componentes
 */
import React from 'react';
import { Card, Row, Col } from 'antd';
import VentasDataTable from './VentasDataTable';
import SummaryCards from './SummaryCards';
import SalesChart from './SalesChart';
import PaymentTypeChart from './PaymentTypeChart';
import PropTypes from 'prop-types';
import '../../styles/pages/Dashboard.css';
import '../../styles/components/organisms/VentasDashboard.css';

/**
 * Componente organismo para el dashboard de ventas
 * @param {Object} props - Propiedades del componente
 * @returns {JSX.Element} Dashboard completo de ventas
 */
const VentasDashboard = ({ 
  onEdit,
  showTable = true,
  showResumen = true,
  showCharts = true
}) => {
  // En una implementación completa, aquí se cargarían datos adicionales si fuera necesario
  
  return (
    <div className="ventas-dashboard">
      {/* Tarjetas de resumen */}
      {showResumen && (
        <SummaryCards />
      )}
      
      {/* Gráficos */}
      {showCharts && (
        <Row gutter={[16, 16]} className="ventas-dashboard-row">
          <Col xs={24} lg={12}>
            <SalesChart />
          </Col>
          <Col xs={24} lg={12}>
            <PaymentTypeChart />
          </Col>
        </Row>
      )}
      
      {/* Tabla de ventas */}
      {showTable && (
        <Card className="dashboard-card">
          <VentasDataTable 
            onEdit={onEdit} 
            showTitle={true}
            pageSize={10}
          />
        </Card>
      )}
    </div>
  );
};

VentasDashboard.propTypes = {
  onEdit: PropTypes.func,
  showTable: PropTypes.bool,
  showResumen: PropTypes.bool,
  showCharts: PropTypes.bool
};

export default VentasDashboard;
