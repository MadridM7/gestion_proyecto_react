/**
 * @fileoverview Componente molecular para mostrar los mejores vendedores
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Card, List, Avatar, Typography } from 'antd';
import { UserOutlined, TrophyOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

/**
 * Componente molecular que muestra los mejores vendedores
 * @param {Object} props - Propiedades del componente
 * @returns {JSX.Element} Tarjeta con los mejores vendedores
 */
const TopSellersCard = ({ 
  topSellers, 
  loading,
  period = 'del mes'
}) => {
  return (
    <Card 
      title={
        <span>
          <TrophyOutlined style={{ marginRight: 8, color: '#faad14' }} />
          Mejores Vendedores {period}
        </span>
      } 
      className="top-sellers-card stats-card"
      loading={loading}
      variant="outlined"
    >
      <List
        dataSource={topSellers}
        renderItem={(seller, index) => (
          <div className="top-seller-item">
            <Avatar 
              className="top-seller-avatar" 
              icon={<UserOutlined />} 
              style={{ 
                backgroundColor: index === 0 ? '#f56a00' : 
                                index === 1 ? '#7265e6' : 
                                index === 2 ? '#ffbf00' : '#87d068' 
              }}
            />
            <div className="top-seller-info">
              <Title level={5} className="top-seller-name">
                {index === 0 && '🥇 '}
                {index === 1 && '🥈 '}
                {index === 2 && '🥉 '}
                {seller.name}
              </Title>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary">{seller.count} ventas</Text>
                <Text className="top-seller-sales" strong>
                  {seller.salesFormatted || new Intl.NumberFormat('es-CL', {
                    style: 'currency',
                    currency: 'CLP',
                    minimumFractionDigits: 0
                  }).format(seller.sales)}
                </Text>
              </div>
            </div>
          </div>
        )}
      />
    </Card>
  );
};

TopSellersCard.propTypes = {
  topSellers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      sales: PropTypes.number.isRequired,
      count: PropTypes.number.isRequired
    })
  ).isRequired,
  loading: PropTypes.bool,
  period: PropTypes.string
};

TopSellersCard.defaultProps = {
  loading: false,
  period: 'del mes'
};

export default TopSellersCard;
