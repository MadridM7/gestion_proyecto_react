/**
 * @fileoverview Página principal del Dashboard que muestra un resumen de las ventas
 * Incluye tarjetas de resumen, gráficos y una tabla de ventas recientes
 */
import React from 'react';
import { Row, Col, Divider, Typography } from 'antd';
import MainLayout from '../components/layout/MainLayout';
import SummaryCards from '../components/dashboard/SummaryCards';
import SalesChart from '../components/charts/SalesChart';
import PaymentTypeChart from '../components/charts/PaymentTypeChart';
import VentasTable from '../components/dashboard/VentasTable';
import BotonFlotanteVenta from '../components/dashboard/BotonFlotanteVenta';

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
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>Dashboard</Title>
        <Typography.Paragraph type="secondary">
          Resumen de ventas y estadísticas clave del negocio
        </Typography.Paragraph>
      </div>
      
      {/* Tarjetas de resumen con métricas clave */}
      <SummaryCards />
      
      <Divider style={{ margin: '24px 0' }} />
      
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
      
      <Divider style={{ margin: '24px 0' }} />
      
      {/* Tabla de ventas recientes */}
      <div style={{ marginTop: 24 }}>
        <Title level={4} style={{ marginBottom: 16 }}>Ventas Recientes</Title>
        <VentasTable />
      </div>
      
      {/* Botón flotante para agregar nuevas ventas rápidamente */}
      <BotonFlotanteVenta />
    </MainLayout>
  );
};

export default Dashboard;
