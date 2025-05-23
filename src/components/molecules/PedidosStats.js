/**
 * @fileoverview Componente para mostrar estadísticas de pedidos
 */
import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { ShoppingOutlined, CheckCircleOutlined, ClockCircleOutlined, DollarOutlined } from '@ant-design/icons';
import { usePedidos } from '../../context/PedidosContext';

/**
 * Componente para mostrar estadísticas de pedidos
 * @returns {JSX.Element} Tarjetas con estadísticas de pedidos
 */
const PedidosStats = () => {
  const { estadisticas } = usePedidos();
  
  // Formateador de moneda
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Total de Pedidos"
            value={estadisticas.totalPedidos}
            prefix={<ShoppingOutlined />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Card>
      </Col>
      
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Pedidos Pagados"
            value={estadisticas.pedidosPagados}
            prefix={<CheckCircleOutlined />}
            valueStyle={{ color: '#52c41a' }}
            suffix={estadisticas.totalPedidos > 0 ? 
              `(${Math.round(estadisticas.pedidosPagados / estadisticas.totalPedidos * 100)}%)` : ''}
          />
        </Card>
      </Col>
      
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Pedidos por Pagar"
            value={estadisticas.pedidosPorPagar}
            prefix={<ClockCircleOutlined />}
            valueStyle={{ color: '#faad14' }}
            suffix={estadisticas.totalPedidos > 0 ? 
              `(${Math.round(estadisticas.pedidosPorPagar / estadisticas.totalPedidos * 100)}%)` : ''}
          />
        </Card>
      </Col>
      
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Monto Total"
            value={formatCurrency(estadisticas.montoTotal)}
            prefix={<DollarOutlined />}
            valueStyle={{ color: '#722ed1' }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default PedidosStats;
