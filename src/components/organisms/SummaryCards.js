/**
 * @fileoverview Componente de tarjetas de resumen para el dashboard
 */
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { 
  DollarOutlined, 
  DollarCircleOutlined,
  ShoppingCartOutlined, 
  CalculatorOutlined,
  WalletOutlined,
  CreditCardOutlined,
  BankOutlined
} from '@ant-design/icons';
import { useVentas } from '../../context/VentasContext';
import dashboardData from '../../data/dashboard.json';
import '../../styles/components/dashboard/SummaryCards.css';

/**
 * Componente que muestra tarjetas de resumen con estadísticas clave
 * @returns {JSX.Element} Componente de tarjetas de resumen
 */
const SummaryCards = () => {
  const { ventas } = useVentas();
  const [cardData, setCardData] = useState(dashboardData.summaryCards);

  // Formatear valores como moneda chilena
  const formatCLP = (value) => {
    return `$${value.toLocaleString('es-CL')}`;
  };

  // Actualizar los valores de las tarjetas con datos reales
  useEffect(() => {
    if (!ventas || ventas.length === 0) return;

    console.log(`Actualizando tarjetas de resumen con ${ventas.length} ventas`);

    // Calcular totales por tipo de pago
    const totalesPorTipoPago = ventas.reduce((acc, venta) => {
      // Verificar que la venta tiene tipo de pago y monto válidos
      if (!venta.tipoPago || typeof venta.monto !== 'number') return acc;
      
      const tipo = venta.tipoPago.toLowerCase();
      if (!acc[tipo]) acc[tipo] = 0;
      acc[tipo] += venta.monto;
      return acc;
    }, {});

    // Calcular valores para las tarjetas
    const totalVentasDinero = ventas.reduce((total, venta) => {
      return total + (typeof venta.monto === 'number' ? venta.monto : 0);
    }, 0);
    
    const totalVentasCantidad = ventas.length;
    const promedioVenta = totalVentasCantidad > 0 ? totalVentasDinero / totalVentasCantidad : 0;
    const ventasEfectivo = totalesPorTipoPago['efectivo'] || 0;
    const ventasDebito = totalesPorTipoPago['debito'] || 0;
    const ventasCredito = totalesPorTipoPago['credito'] || 0;

    // Actualizar los datos de las tarjetas basado en la plantilla de dashboard.json
    const updatedCardData = dashboardData.summaryCards.map(card => {
      let newValue = card.value;

      switch (card.id) {
        case 'total-ventas-dinero':
          newValue = formatCLP(totalVentasDinero);
          break;
        case 'total-ventas-cantidad':
          newValue = totalVentasCantidad.toString();
          break;
        case 'promedio-venta':
          newValue = formatCLP(promedioVenta);
          break;
        case 'ventas-efectivo':
          newValue = formatCLP(ventasEfectivo);
          break;
        case 'ventas-debito':
          newValue = formatCLP(ventasDebito);
          break;
        case 'ventas-credito':
          newValue = formatCLP(ventasCredito);
          break;
        default:
          break;
      }

      return { ...card, value: newValue };
    });

    setCardData(updatedCardData);
  }, [ventas]); // Solo depender de ventas para evitar renderizados innecesarios

  // Función para renderizar el icono correcto según el nombre
  const renderIcon = (iconName) => {
    const iconMap = {
      'DollarCircleOutlined': <DollarCircleOutlined />,
      'ShoppingCartOutlined': <ShoppingCartOutlined />,
      'CalculatorOutlined': <CalculatorOutlined />,
      'WalletOutlined': <WalletOutlined />,
      'CreditCardOutlined': <CreditCardOutlined />,
      'BankOutlined': <BankOutlined />
    };

    return iconMap[iconName] || <DollarOutlined />;
  };

  // Función para dividir el array en chunks de tamaño específico
  const chunkArray = (array, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  };

  // Dividir las cards en filas de 3
  const cardRows = chunkArray(cardData, 3);

  return (
    <div className="summary-cards-container">
      {/* Renderizar cada fila de cards */}
      {cardRows.map((row, rowIndex) => (
        <Row 
          key={`row-${rowIndex}`} 
          gutter={[16, 16]} 
          className="summary-cards" 
          style={{ marginTop: rowIndex > 0 ? '16px' : '0' }}
        >
          {row.map(card => (
            <Col xs={24} sm={12} md={8} key={card.id}>
              <Card className="summary-card">
                <Statistic
                  title={card.title}
                  value={card.value}
                  valueStyle={{ color: card.color }}
                  prefix={renderIcon(card.icon)}
                />
                <div className="card-description">{card.description}</div>
              </Card>
            </Col>
          ))}
        </Row>
      ))}
    </div>
  );
};

export default SummaryCards;
