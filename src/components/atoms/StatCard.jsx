/**
 * @fileoverview Tarjeta de estadística atómica para mostrar métricas en reportes
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Card, Statistic } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

/**
 * Componente atómico que representa una tarjeta de estadística
 * @param {Object} props - Propiedades del componente
 * @returns {JSX.Element} Tarjeta con estadística y comparación
 */
const StatCard = ({ 
  title, 
  value, 
  prefix, 
  suffix, 
  precision, 
  valueStyle,
  icon,
  comparison,
  comparisonValue,
  comparisonText,
  loading
}) => {
  // Determinar si la comparación es positiva o negativa
  const isPositive = comparisonValue > 0;
  
  // Estilo por defecto para el valor de comparación
  const defaultComparisonStyle = {
    color: isPositive ? '#3f8600' : '#cf1322',
    fontSize: '14px'
  };
  
  // Icono para la comparación
  const comparisonIcon = isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />;
  
  return (
    <Card className="stat-card">
      <Statistic
        title={title}
        value={value}
        precision={precision}
        valueStyle={valueStyle}
        prefix={prefix}
        suffix={suffix}
        loading={loading}
      />
      {comparison && comparisonValue !== 0 && (
        <div className="comparison-container" style={defaultComparisonStyle}>
          {comparisonIcon} {Math.abs(comparisonValue)}% {comparisonText}
        </div>
      )}
    </Card>
  );
};

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  prefix: PropTypes.node,
  suffix: PropTypes.node,
  precision: PropTypes.number,
  valueStyle: PropTypes.object,
  icon: PropTypes.node,
  comparison: PropTypes.bool,
  comparisonValue: PropTypes.number,
  comparisonText: PropTypes.string,
  loading: PropTypes.bool
};

StatCard.defaultProps = {
  precision: 0,
  valueStyle: { fontSize: '24px' },
  comparison: false,
  comparisonValue: 0,
  comparisonText: 'que el período anterior',
  loading: false
};

export default StatCard;
