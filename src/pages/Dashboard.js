/**
 * @fileoverview Página principal del dashboard que muestra estadísticas y gráficos
 */
import React from 'react';
import { Row, Col, Divider, Typography } from 'antd';
import MainLayout from '../components/layout/MainLayout';
import SummaryCards from '../components/dashboard/SummaryCards';
import SalesChart from '../components/dashboard/SalesChart';
import PaymentTypeChart from '../components/dashboard/PaymentTypeChart';
import VentasTable from '../components/dashboard/VentasTable';
import BotonFlotanteVenta from '../components/dashboard/BotonFlotanteVenta';

// Importar estilos CSS
import '../styles/pages/Dashboard.css';
import '../styles/components/dashboard/ChartPlaceholder.css';

const { Title } = Typography;

/**
 * Página principal del Dashboard que muestra un resumen de las métricas clave de ventas
 * Diseñado para ser completamente responsivo en dispositivos móviles, tablets y desktops
 * @returns {JSX.Element} Página de Dashboard con tarjetas de resumen, gráficos y tabla de ventas
 */
const Dashboard = () => {
  return (
    <MainLayout currentPage="Dashboard">
      {/* Encabezado de la página */}
      <div className="dashboard-header">
        <Title level={2} className="dashboard-title">Dashboard</Title>
      </div>
      
      {/* Tarjetas de resumen con métricas clave */}
      <SummaryCards />
      
      <Divider className="cards-divider" />
      
      {/* Gráficos de ventas y tipos de pago */}
      <Row gutter={[24, 24]} className="dashboard-charts">
        {/* Gráfico de ventas por día */}
        <Col xs={24} lg={12}>
          <SalesChart />
        </Col>
        {/* Gráfico de distribución por tipo de pago */}
        <Col xs={24} lg={12}>
          <PaymentTypeChart />
        </Col>
      </Row>
      
      <Divider className="cards-divider" />
      
      {/* Tabla de ventas recientes */}
      <div className="recent-sales-section">
        <Title level={4} className="recent-sales-title">Ventas Recientes</Title>
        <VentasTable />
      </div>
      
      {/* Botón flotante para agregar nuevas ventas rápidamente */}
      <BotonFlotanteVenta className="floating-button" />
    </MainLayout>
  );
};

export default Dashboard;
