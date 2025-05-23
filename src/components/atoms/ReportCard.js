/**
 * @fileoverview Componente atómico para tarjetas de reporte con diseño mejorado
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Card, Typography } from 'antd';

const { Title } = Typography;

/**
 * Componente atómico que representa una tarjeta de reporte con diseño mejorado
 * @param {Object} props - Propiedades del componente
 * @returns {JSX.Element} Tarjeta de reporte
 */
const ReportCard = ({ 
  title, 
  children, 
  icon,
  color = '#1890ff',
  className = '',
  hoverable = true,
  ...restProps 
}) => {
  return (
    <Card
      className={`report-card ${className}`}
      hoverable={hoverable}
      style={{ 
        borderTop: `3px solid ${color}`,
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
      bodyStyle={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
      }}
      {...restProps}
    >
      <div className="report-card-header" style={{ marginBottom: 16 }}>
        {icon && (
          <div className="report-card-icon" style={{ 
            color: color,
            fontSize: 24,
            marginBottom: 12
          }}>
            {icon}
          </div>
        )}
        <Title level={4} style={{ margin: 0 }}>{title}</Title>
      </div>
      <div className="report-card-content" style={{ flex: 1 }}>
        {children}
      </div>
    </Card>
  );
};

ReportCard.propTypes = {
  title: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
  icon: PropTypes.node,
  color: PropTypes.string,
  className: PropTypes.string,
  hoverable: PropTypes.bool
};

export default ReportCard;
