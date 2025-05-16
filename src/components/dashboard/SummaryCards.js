/**
 * @fileoverview Componente que muestra tarjetas de resumen con estadísticas de ventas
 * Organizado en dos filas: totales generales y desglose por método de pago
 */
import React from 'react';
import { Row, Col, Card, Statistic, Divider } from 'antd';
import { 
  DollarOutlined, // Icono para montos totales
  ShoppingOutlined, // Icono para promedio de ventas
  CreditCardOutlined, // Icono para pagos con tarjeta de crédito
  BankOutlined, // Icono para pagos con tarjeta de débito
  WalletOutlined, // Icono para pagos en efectivo
  NumberOutlined // Icono para cantidad de ventas
} from '@ant-design/icons';
import { useVentas } from '../../context/VentasContext';

/**
 * Componente de tarjetas de resumen para mostrar estadísticas de ventas
 * Diseñado para ser responsivo en dispositivos móviles, tablets y desktops
 * @returns {JSX.Element} Tarjetas de resumen organizadas en filas y columnas
 */
const SummaryCards = () => {
  // Obtenemos los datos de ventas y estadísticas del contexto
  const { estadisticas, ventas } = useVentas();
  
  /**
   * Formatea valores numéricos como moneda chilena (CLP)
   * @param {number} value - Valor a formatear
   * @returns {string} Valor formateado como moneda
   */
  const formatCLP = (value) => {
    return `$${value.toLocaleString('es-CL')}`;
  };
  
  return (
    <>
      {/* Primera fila: Total ventas (dinero), total ventas (cantidad) y promedio por ventas */}
      <Row gutter={[16, 16]}>
        {/* Card de Total de Ventas (monto) */}
        <Col xs={24} sm={12} lg={8}>
          <Card 
            hoverable 
            style={{ height: '100%' }} // Asegura altura uniforme en todas las cards
            className="summary-card"
          >
            <Statistic
              title="Total Ventas"
              value={estadisticas?.totalVentas || 0}
              precision={0}
              formatter={(value) => formatCLP(value)}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#1890ff', fontSize: '28px' }}
            />
          </Card>
        </Col>
        
        {/* Card de Cantidad de Ventas */}
        <Col xs={24} sm={12} lg={8}>
          <Card 
            hoverable 
            style={{ height: '100%' }}
            className="summary-card"
          >
            <Statistic
              title="Cantidad de Ventas"
              value={ventas?.length || 0}
              prefix={<NumberOutlined />}
              valueStyle={{ color: '#52c41a', fontSize: '28px' }}
            />
          </Card>
        </Col>
        
        {/* Card de Promedio por Venta */}
        <Col xs={24} sm={12} lg={8}>
          <Card 
            hoverable 
            style={{ height: '100%' }}
            className="summary-card"
          >
            <Statistic
              title="Promedio por Venta"
              value={estadisticas?.promedioVentas || 0}
              precision={0}
              formatter={(value) => formatCLP(value)}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#722ed1', fontSize: '28px' }}
            />
          </Card>
        </Col>
      </Row>
      
      {/* Divisor visual entre las dos secciones de cards */}
      <Divider style={{ margin: '24px 0 16px' }} />
      
      {/* Segunda fila: Ventas por débito, crédito y efectivo */}
      <Row gutter={[16, 16]}>
        {/* Card de Ventas con Débito */}
        <Col xs={24} sm={12} lg={8}>
          <Card 
            hoverable 
            style={{ height: '100%' }}
            className="summary-card"
          >
            <Statistic
              title="Ventas Débito"
              value={estadisticas?.ventasPorTipo?.debito || 0}
              precision={0}
              formatter={(value) => formatCLP(value)}
              prefix={<BankOutlined />}
              valueStyle={{ color: '#1890ff', fontSize: '24px' }}
            />
          </Card>
        </Col>
        
        {/* Card de Ventas con Crédito */}
        <Col xs={24} sm={12} lg={8}>
          <Card 
            hoverable 
            style={{ height: '100%' }}
            className="summary-card"
          >
            <Statistic
              title="Ventas Crédito"
              value={estadisticas?.ventasPorTipo?.credito || 0}
              precision={0}
              formatter={(value) => formatCLP(value)}
              prefix={<CreditCardOutlined />}
              valueStyle={{ color: '#f5222d', fontSize: '24px' }}
            />
          </Card>
        </Col>
        
        {/* Card de Ventas en Efectivo */}
        <Col xs={24} sm={12} lg={8}>
          <Card 
            hoverable 
            style={{ height: '100%' }}
            className="summary-card"
          >
            <Statistic
              title="Ventas Efectivo"
              value={estadisticas?.ventasPorTipo?.efectivo || 0}
              precision={0}
              formatter={(value) => formatCLP(value)}
              prefix={<WalletOutlined />}
              valueStyle={{ color: '#faad14', fontSize: '24px' }}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default SummaryCards;
