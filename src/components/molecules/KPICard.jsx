/**
 * @fileoverview Componente de tarjeta KPI para mostrar métricas destacadas
 */
import React from 'react';
import { Card, Statistic, Tooltip, Typography } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, InfoCircleOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import '../../styles/components/molecules/KPICard.css';

const { Text } = Typography;

/**
 * Componente de tarjeta para mostrar KPIs importantes con tendencias
 * @param {Object} props - Propiedades del componente
 * @returns {JSX.Element} Tarjeta KPI con estadística y tendencia
 */
const KPICard = ({ 
  title, 
  value, 
  icon, 
  prefix,
  suffix,
  color, 
  tendencia,
  metaInfo,
  loading = false
}) => {
  // Determinar si la tendencia es positiva, negativa o neutral
  let tendenciaIcon = null;
  let tendenciaColor = '';
  
  if (tendencia) {
    const tendenciaValor = parseFloat(tendencia.valor);
    if (tendenciaValor > 0) {
      tendenciaIcon = <ArrowUpOutlined />;
      tendenciaColor = '#52c41a'; // verde para positivo
    } else if (tendenciaValor < 0) {
      tendenciaIcon = <ArrowDownOutlined />;
      tendenciaColor = '#ff4d4f'; // rojo para negativo
    } else {
      // Mantener neutro si es exactamente 0
      tendenciaColor = '#8c8c8c'; // gris para neutro
    }
  }

  return (
    <Card 
      className={`kpi-card ${color}`}
      loading={loading}
      bordered={false}
    >
      <div className="kpi-header">
        <div className="kpi-title">
          <Text strong>{title}</Text>
          {metaInfo && (
            <Tooltip title={metaInfo}>
              <InfoCircleOutlined className="info-icon" />
            </Tooltip>
          )}
        </div>
        <div className="kpi-icon">{icon}</div>
      </div>
      
      <Statistic
        value={value}
        valueStyle={{ color: color }}
        prefix={prefix}
        suffix={suffix}
      />
      
      {tendencia && (
        <div className="kpi-tendencia" style={{ color: tendenciaColor }}>
          {tendenciaIcon}
          <span>{Math.abs(tendencia.valor)}% </span>
          <span className="tendencia-periodo">vs {tendencia.periodo}</span>
        </div>
      )}
    </Card>
  );
};

KPICard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.node,
  prefix: PropTypes.node,
  suffix: PropTypes.node,
  color: PropTypes.string,
  tendencia: PropTypes.shape({
    valor: PropTypes.number.isRequired,
    periodo: PropTypes.string.isRequired
  }),
  metaInfo: PropTypes.string,
  loading: PropTypes.bool
};

export default KPICard;
