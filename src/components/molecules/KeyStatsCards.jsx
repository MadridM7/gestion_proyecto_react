/**
 * @fileoverview Componente molecular para mostrar estadísticas clave
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';
import { 
  DollarOutlined, 
  ShoppingOutlined, 
  RiseOutlined, 
  TeamOutlined,
  GiftOutlined
} from '@ant-design/icons';
import StatsCard from '../atoms/StatsCard';

/**
 * Componente molecular que muestra estadísticas clave en tarjetas
 * @param {Object} props - Propiedades del componente
 * @returns {JSX.Element} Conjunto de tarjetas con estadísticas clave
 */
const KeyStatsCards = ({ 
  stats, 
  loading 
}) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} md={8} lg={4}>
        <StatsCard
          title="Total Ventas"
          value={stats.totalVentas}
          prefix={<ShoppingOutlined />}
          loading={loading}
          valueStyle={{ color: '#1890ff' }}
        />
      </Col>
      
      <Col xs={24} sm={12} md={8} lg={4}>
        <StatsCard
          title="Ingresos Totales"
          value={formatCurrency(stats.ingresosTotales)}
          prefix={<DollarOutlined />}
          loading={loading}
          valueStyle={{ color: '#52c41a' }}
        />
      </Col>
      
      <Col xs={24} sm={12} md={8} lg={4}>
        <StatsCard
          title="Ganancia Neta"
          value={formatCurrency(stats.gananciaNeta)}
          prefix={<RiseOutlined />}
          loading={loading}
          valueStyle={{ color: '#722ed1' }}
        />
      </Col>
      
      <Col xs={24} sm={12} md={8} lg={4}>
        <StatsCard
          title="Vendedores Activos"
          value={stats.vendedoresActivos}
          prefix={<TeamOutlined />}
          loading={loading}
          valueStyle={{ color: '#fa8c16' }}
        />
      </Col>

      <Col xs={24} sm={12} md={8} lg={4}>
        <StatsCard
          title="Productos Vendidos"
          value={stats.totalProductosVendidos || 0}
          prefix={<GiftOutlined />}
          loading={loading}
          valueStyle={{ color: '#eb2f96' }}
        />
      </Col>
    </Row>
  );
};

KeyStatsCards.propTypes = {
  stats: PropTypes.shape({
    totalVentas: PropTypes.number.isRequired,
    ingresosTotales: PropTypes.number.isRequired,
    gananciaNeta: PropTypes.number.isRequired,
    vendedoresActivos: PropTypes.number.isRequired,
    totalProductosVendidos: PropTypes.number
  }).isRequired,
  loading: PropTypes.bool
};

KeyStatsCards.defaultProps = {
  loading: false
};

export default KeyStatsCards;
