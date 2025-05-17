/**
 * @fileoverview Componente que muestra tarjetas de resumen con estadísticas clave de ventas
 */
import React from 'react';
import { Row, Col, Card, Statistic, Divider } from 'antd';
import { 
  DollarOutlined, // Icono para montos totales
  ShoppingOutlined, // Icono para promedio de ventas
  CreditCardOutlined, // Icono para pagos con tarjeta de crédito
  BankOutlined, // Icono para pagos con tarjeta de débito
  WalletOutlined, // Icono para pagos en efectivo
  NumberOutlined, // Icono para cantidad de ventas
  DollarCircleOutlined,
  ShoppingCartOutlined,
  CalculatorOutlined
} from '@ant-design/icons';
import { useVentas } from '../../context/VentasContext';

// Importar datos del dashboard desde el archivo JSON
import dashboardData from '../../data/dashboard.json';

import '../../styles/components/dashboard/SummaryCards.css';

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

  /**
   * Obtiene el icono correspondiente según el nombre del icono en el JSON
   * @param {string} iconName - Nombre del icono
   * @returns {JSX.Element} Componente de icono
   */
  const getIconComponent = (iconName) => {
    const iconMap = {
      'DollarCircleOutlined': <DollarCircleOutlined />,
      'ShoppingCartOutlined': <ShoppingCartOutlined />,
      'CalculatorOutlined': <CalculatorOutlined />,
      'WalletOutlined': <WalletOutlined />,
      'CreditCardOutlined': <CreditCardOutlined />,
      'BankOutlined': <BankOutlined />,
      'DollarOutlined': <DollarOutlined />,
      'NumberOutlined': <NumberOutlined />,
      'ShoppingOutlined': <ShoppingOutlined />
    };
    return iconMap[iconName] || <DollarOutlined />;
  };

  /**
   * Renderiza una tarjeta de resumen con los datos proporcionados
   * @param {Object} cardData - Datos de la tarjeta
   * @returns {JSX.Element} Componente Card con los datos
   */
  const renderSummaryCard = (cardData) => {
    // Usar datos reales de estadísticas si están disponibles, de lo contrario usar datos del JSON
    let value;
    
    // Primero intentamos obtener los valores reales de las ventas
    switch(cardData.id) {
      case 'total-ventas-dinero':
        value = estadisticas?.totalVentas || 0;
        break;
      case 'total-ventas-cantidad':
        value = ventas?.length || 0;
        break;
      case 'promedio-venta':
        value = estadisticas?.promedioVentas || 0;
        break;
      case 'ventas-efectivo':
        value = estadisticas?.ventasPorTipo?.efectivo || 0;
        break;
      case 'ventas-debito':
        value = estadisticas?.ventasPorTipo?.debito || 0;
        break;
      case 'ventas-credito':
        value = estadisticas?.ventasPorTipo?.credito || 0;
        break;
      default:
        value = 0;
    }
    
    // Siempre usamos los valores reales, incluso si son 0
    // Esto asegura que se muestre la información correcta en el dashboard

    // Determinar si se debe formatear como moneda
    const needsFormatting = cardData.id !== 'total-ventas-cantidad';
    
    return (
      <Col xs={24} sm={12} lg={8} key={cardData.id}>
        <Card 
          hoverable 
          className={`summary-card ${cardData.id}-card`}
        >
          <Statistic
            title={cardData.title}
            value={value}
            precision={0}
            formatter={(val) => {
              return needsFormatting ? formatCLP(val) : val;
            }}
            prefix={getIconComponent(cardData.icon)}
            valueStyle={{ color: cardData.color, fontSize: '28px' }}
            className={`statistic-value-${cardData.id}`}
          />
          {cardData.description && (
            <div className="card-description">{cardData.description}</div>
          )}
        </Card>
      </Col>
    );
  };
  
  return (
    <div className="summary-cards-container">
      {/* Primera fila: Total ventas (dinero), total ventas (cantidad) y promedio por ventas */}
      <Row gutter={[16, 16]}>
        {dashboardData.summaryCards.slice(0, 3).map(cardData => renderSummaryCard(cardData))}
      </Row>
      
      {/* Divisor visual entre las dos secciones de cards */}
      <Divider className="cards-divider" />
      
      {/* Segunda fila: Ventas por débito, crédito y efectivo */}
      <Row gutter={[16, 16]}>
        {dashboardData.summaryCards.slice(3).map(cardData => renderSummaryCard(cardData))}
      </Row>
    </div>
  );
};

export default SummaryCards;
