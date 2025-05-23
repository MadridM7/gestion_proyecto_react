/**
 * @fileoverview Componente organismo para la sección de estadísticas
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Typography, Divider } from 'antd';
import KeyStatsCards from '../molecules/KeyStatsCards';
import PaymentStatsCard from '../molecules/PaymentStatsCard';
import TopSellersCard from '../molecules/TopSellersCard';

const { Title } = Typography;

/**
 * Componente organismo que muestra la sección de estadísticas
 * @param {Object} props - Propiedades del componente
 * @returns {JSX.Element} Sección de estadísticas
 */
const StatsSection = ({ 
  keyStats,
  paymentStats,
  topSellers,
  loading
}) => {
  return (
    <div className="report-section">
      <Title level={4} className="report-section-title">Estadísticas Relevantes</Title>
      <Divider />
      
      <KeyStatsCards stats={keyStats} loading={loading} />
      
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} md={12}>
          <PaymentStatsCard paymentStats={paymentStats} loading={loading} />
        </Col>
        
        <Col xs={24} md={12}>
          <TopSellersCard topSellers={topSellers} loading={loading} />
        </Col>
      </Row>
    </div>
  );
};

StatsSection.propTypes = {
  keyStats: PropTypes.shape({
    totalVentas: PropTypes.number.isRequired,
    ingresosTotales: PropTypes.number.isRequired,
    gananciaNeta: PropTypes.number.isRequired,
    vendedoresActivos: PropTypes.number.isRequired
  }).isRequired,
  paymentStats: PropTypes.arrayOf(
    PropTypes.shape({
      method: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      count: PropTypes.number.isRequired
    })
  ).isRequired,
  topSellers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      sales: PropTypes.number.isRequired,
      count: PropTypes.number.isRequired
    })
  ).isRequired,
  loading: PropTypes.bool
};

StatsSection.defaultProps = {
  loading: false
};

export default StatsSection;
