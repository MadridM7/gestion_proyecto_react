/**
 * @fileoverview Componente atómico para tarjetas de estadísticas
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Card, Statistic } from 'antd';

/**
 * Componente atómico que representa una tarjeta de estadísticas
 * @param {Object} props - Propiedades del componente
 * @returns {JSX.Element} Tarjeta de estadísticas
 */
const StatsCard = ({ 
  title, 
  value, 
  prefix,
  suffix,
  precision,
  valueStyle,
  className,
  loading,
  ...restProps 
}) => {
  return (
    <Card
      className={`stats-card ${className || ''}`}
      variant="outlined"
      {...restProps}
    >
      <Statistic
        title={title}
        value={value}
        precision={precision}
        valueStyle={valueStyle}
        prefix={prefix}
        suffix={suffix}
        loading={loading}
      />
    </Card>
  );
};

StatsCard.propTypes = {
  title: PropTypes.node.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  prefix: PropTypes.node,
  suffix: PropTypes.node,
  precision: PropTypes.number,
  valueStyle: PropTypes.object,
  className: PropTypes.string,
  loading: PropTypes.bool
};

StatsCard.defaultProps = {
  precision: 0,
  valueStyle: { fontSize: '24px', fontWeight: 'bold' },
  loading: false
};

export default StatsCard;
