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
    let useJsonValue = false;
    
    switch(cardData.id) {
      case 'total-ventas-dinero':
        value = estadisticas?.totalVentas;
        break;
      case 'total-ventas-cantidad':
        value = ventas?.length;
        break;
      case 'promedio-venta':
        value = estadisticas?.promedioVentas;
        break;
      case 'ventas-efectivo':
        value = estadisticas?.ventasPorTipo?.efectivo;
        break;
      case 'ventas-debito':
        value = estadisticas?.ventasPorTipo?.debito;
        break;
      case 'ventas-credito':
        value = estadisticas?.ventasPorTipo?.credito;
        break;
      default:
        value = 0;
    }
    
    // Si no hay datos reales, usar el valor del JSON como fallback
    if (value === undefined || value === null) {
      useJsonValue = true;
      // Convertir el valor del JSON a número
      if (cardData.value) {
        value = parseFloat(cardData.value.replace('$', '').replace(/,/g, ''));
      } else {
        value = 0;
      }
    }

    // Determinar si se debe formatear como moneda
    const needsFormatting = cardData.id !== 'total-ventas-cantidad';
    
    // Si no hay datos reales y estamos usando el valor del JSON, mostrar directamente el valor del JSON
    const displayValue = useJsonValue && cardData.value ? 
      cardData.value : // Mostrar el valor formateado del JSON
      (value || 0);   // Mostrar el valor calculado o 0 si es nulo
    
    return (
      <Col xs={24} sm={12} lg={8} key={cardData.id}>
        <Card 
          hoverable 
          className={`summary-card ${cardData.id}-card`}
        >
          <Statistic
            title={cardData.title}
            value={useJsonValue ? displayValue : value || 0}
            precision={0}
            formatter={(val) => {
              if (useJsonValue && typeof val === 'string') {
                return val; // Ya está formateado en el JSON
              }
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
