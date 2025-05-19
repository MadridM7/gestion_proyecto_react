/**
 * @fileoverview Componente para mostrar métricas de ventas
 */
import React, { useMemo } from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { 
  CalendarOutlined, 
  RiseOutlined,
  DollarOutlined
} from '@ant-design/icons';
import { useVentas } from '../../context/VentasContext';
import '../../styles/components/organisms/VentasMetricas.css';

/**
 * Componente para mostrar métricas de ventas (día, semana, mes)
 * @returns {JSX.Element} Componente de métricas de ventas
 */
const VentasMetricas = () => {
  const { ventas } = useVentas();
  
  // Calcular métricas
  const metricas = useMemo(() => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    const inicioSemana = new Date(hoy);
    inicioSemana.setDate(hoy.getDate() - hoy.getDay()); // Domingo como inicio de semana
    
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    
    // Filtrar ventas por período
    const ventasHoy = ventas.filter(venta => {
      const fechaVenta = new Date(venta.fechaHora);
      return fechaVenta >= hoy;
    });
    
    const ventasSemana = ventas.filter(venta => {
      const fechaVenta = new Date(venta.fechaHora);
      return fechaVenta >= inicioSemana;
    });
    
    const ventasMes = ventas.filter(venta => {
      const fechaVenta = new Date(venta.fechaHora);
      return fechaVenta >= inicioMes;
    });
    
    // Calcular montos totales
    const montoHoy = ventasHoy.reduce((total, venta) => total + (venta.monto || 0), 0);
    const montoSemana = ventasSemana.reduce((total, venta) => total + (venta.monto || 0), 0);
    const montoMes = ventasMes.reduce((total, venta) => total + (venta.monto || 0), 0);
    
    return {
      ventasHoy: ventasHoy.length,
      ventasSemana: ventasSemana.length,
      ventasMes: ventasMes.length,
      montoHoy,
      montoSemana,
      montoMes
    };
  }, [ventas]);
  
  // Formatear monto con separador de miles y formato CLP
  const formatMonto = (monto) => {
    return `$${monto.toLocaleString('es-CL')}`;
  };
  
  return (
    <div className="ventas-metricas">
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card hoverable className="metrica-card">
            <Statistic 
              title={<div className="metrica-title"><CalendarOutlined /> Ventas del Día</div>}
              value={metricas.ventasHoy}
              suffix={`/ ${formatMonto(metricas.montoHoy)}`}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card hoverable className="metrica-card">
            <Statistic 
              title={<div className="metrica-title"><RiseOutlined /> Ventas de la Semana</div>}
              value={metricas.ventasSemana}
              suffix={`/ ${formatMonto(metricas.montoSemana)}`}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card hoverable className="metrica-card">
            <Statistic 
              title={<div className="metrica-title"><DollarOutlined /> Ventas del Mes</div>}
              value={metricas.ventasMes}
              suffix={`/ ${formatMonto(metricas.montoMes)}`}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default VentasMetricas;
