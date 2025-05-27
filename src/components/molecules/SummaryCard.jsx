/**
 * @fileoverview Tarjeta de resumen molecular para mostrar estadísticas agrupadas
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Card, Row, Col } from 'antd';
import StatCard from '../atoms/StatCard';

/**
 * Componente molecular que agrupa múltiples estadísticas en una tarjeta
 * @param {Object} props - Propiedades del componente
 * @returns {JSX.Element} Tarjeta con múltiples estadísticas
 */
const SummaryCard = ({ 
  title, 
  stats,
  loading
}) => {
  return (
    <Card 
      title={title} 
      className="summary-card"
      bordered={true}
    >
      <Row gutter={[16, 16]}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <StatCard
              title={stat.title}
              value={stat.value}
              prefix={stat.prefix}
              suffix={stat.suffix}
              precision={stat.precision}
              valueStyle={stat.valueStyle}
              icon={stat.icon}
              comparison={stat.comparison}
              comparisonValue={stat.comparisonValue}
              comparisonText={stat.comparisonText}
              loading={loading}
            />
          </Col>
        ))}
      </Row>
    </Card>
  );
};

SummaryCard.propTypes = {
  title: PropTypes.string.isRequired,
  stats: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      prefix: PropTypes.node,
      suffix: PropTypes.node,
      precision: PropTypes.number,
      valueStyle: PropTypes.object,
      icon: PropTypes.node,
      comparison: PropTypes.bool,
      comparisonValue: PropTypes.number,
      comparisonText: PropTypes.string
    })
  ).isRequired,
  loading: PropTypes.bool
};

SummaryCard.defaultProps = {
  loading: false
};

export default SummaryCard;
