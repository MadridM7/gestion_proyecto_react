/**
 * @fileoverview Componente molecular para estadísticas de pagos
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Card, List, Typography, Progress } from 'antd';
import { 
  DollarOutlined, 
  CreditCardOutlined, 
  BankOutlined, 
  WalletOutlined 
} from '@ant-design/icons';

const { Text, Title } = Typography;

/**
 * Componente molecular que muestra estadísticas de pagos
 * @param {Object} props - Propiedades del componente
 * @returns {JSX.Element} Tarjeta con estadísticas de pagos
 */
const PaymentStatsCard = ({ 
  paymentStats, 
  loading 
}) => {
  // Obtener el total para calcular porcentajes
  const total = paymentStats.reduce((sum, item) => sum + item.amount, 0);
  
  // Mapa de iconos para tipos de pago
  const getPaymentIcon = (type) => {
    const typeLC = type.toLowerCase();
    if (typeLC.includes('efectivo')) return <DollarOutlined className="payment-type-icon" />;
    if (typeLC.includes('tarjeta')) return <CreditCardOutlined className="payment-type-icon" />;
    if (typeLC.includes('transferencia')) return <BankOutlined className="payment-type-icon" />;
    return <WalletOutlined className="payment-type-icon" />;
  };

  return (
    <Card 
      title="Ventas por Tipo de Pago" 
      className="payment-stats-card stats-card"
      loading={loading}
      variant="outlined"
    >
      <div style={{ marginBottom: 16 }}>
        <Title level={5}>Total: {new Intl.NumberFormat('es-CL', {
          style: 'currency',
          currency: 'CLP',
          minimumFractionDigits: 0
        }).format(total)}</Title>
      </div>
      
      <List
        dataSource={paymentStats}
        renderItem={item => {
          const percentage = total > 0 ? Math.round((item.amount / total) * 100) : 0;
          
          return (
            <div className="payment-type-item">
              {getPaymentIcon(item.method)}
              <div className="payment-type-info">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>{item.method}</Text>
                  <Text className="payment-type-amount">
                    {new Intl.NumberFormat('es-CL', {
                      style: 'currency',
                      currency: 'CLP',
                      minimumFractionDigits: 0
                    }).format(item.amount)}
                  </Text>
                </div>
                <Progress 
                  percent={percentage} 
                  size="small" 
                  showInfo={false} 
                  status="active"
                  strokeColor={{
                    '0%': '#108ee9',
                    '100%': '#87d068',
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="secondary">{item.count} ventas</Text>
                  <Text type="secondary">{percentage}%</Text>
                </div>
              </div>
            </div>
          );
        }}
      />
    </Card>
  );
};

PaymentStatsCard.propTypes = {
  paymentStats: PropTypes.arrayOf(
    PropTypes.shape({
      method: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      count: PropTypes.number.isRequired
    })
  ).isRequired,
  loading: PropTypes.bool
};

PaymentStatsCard.defaultProps = {
  loading: false
};

export default PaymentStatsCard;
