/**
 * @fileoverview Contenedor de KPIs principales para el dashboard
 */
import React, { useState, useEffect } from 'react';
import { Row, Col, Skeleton } from 'antd';
import { 
  DollarCircleOutlined, 
  ShoppingCartOutlined, 
  FileDoneOutlined,
  ClockCircleOutlined,
  FireOutlined
} from '@ant-design/icons';
import KPICard from '../molecules/KPICard';
import { useVentas } from '../../context/VentasContext';
import { formatCurrency } from '../../utils/formatters';
import '../../styles/components/organisms/KPIContainer.css';

/**
 * Componente que muestra las métricas KPI principales en tarjetas
 * @param {Object} props - Propiedades del componente
 * @returns {JSX.Element} Contenedor con tarjetas KPI
 */
const KPIContainer = ({ timeRange }) => {
  const { ventas } = useVentas();
  const [kpis, setKpis] = useState({
    ventasTotales: 0,
    cantidadVentas: 0,
    ticketPromedio: 0,
    pedidosPendientes: 0,
    productoDestacado: { nombre: '', cantidad: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ventas || ventas.length === 0) {
      setLoading(false);
      return;
    }

    // Filtrar ventas por el rango de tiempo seleccionado
    const ventasEnRango = ventas.filter(venta => {
      if (!venta.fechaHora) return false;
      const fechaVenta = new Date(venta.fechaHora);
      return fechaVenta >= timeRange.startDate && fechaVenta <= timeRange.endDate;
    });

    // Calcular período anterior para comparar tendencias
    const duracion = timeRange.endDate - timeRange.startDate; // en milisegundos
    const inicioRangoAnterior = new Date(timeRange.startDate.getTime() - duracion);
    const finRangoAnterior = new Date(timeRange.startDate.getTime() - 1); // 1 ms antes del inicio del rango actual

    const ventasRangoAnterior = ventas.filter(venta => {
      if (!venta.fechaHora) return false;
      const fechaVenta = new Date(venta.fechaHora);
      return fechaVenta >= inicioRangoAnterior && fechaVenta <= finRangoAnterior;
    });

    // 1. Calcular ventas totales
    const totalVentas = ventasEnRango.reduce((sum, venta) => sum + (venta.monto || 0), 0);
    const totalVentasAnterior = ventasRangoAnterior.reduce((sum, venta) => sum + (venta.monto || 0), 0);
    const tendenciaVentas = totalVentasAnterior === 0 
      ? 100 // Si no había ventas antes, es 100% de incremento
      : Math.round(((totalVentas - totalVentasAnterior) / totalVentasAnterior) * 100);
    
    // 2. Calcular cantidad de ventas
    const cantidadVentas = ventasEnRango.length;
    const cantidadVentasAnterior = ventasRangoAnterior.length;
    const tendenciaCantidad = cantidadVentasAnterior === 0
      ? 100
      : Math.round(((cantidadVentas - cantidadVentasAnterior) / cantidadVentasAnterior) * 100);
    
    // 3. Calcular ticket promedio
    const ticketPromedio = cantidadVentas === 0 ? 0 : totalVentas / cantidadVentas;
    const ticketPromedioAnterior = cantidadVentasAnterior === 0 ? 0 : totalVentasAnterior / cantidadVentasAnterior;
    const tendenciaTicket = ticketPromedioAnterior === 0
      ? 100
      : Math.round(((ticketPromedio - ticketPromedioAnterior) / ticketPromedioAnterior) * 100);
    
    // 4. Calcular pedidos pendientes
    const pedidosPendientes = ventasEnRango.filter(venta => 
      venta.estado && venta.estado.toLowerCase() === 'pendiente'
    ).length;
    const pedidosPendientesAnterior = ventasRangoAnterior.filter(venta => 
      venta.estado && venta.estado.toLowerCase() === 'pendiente'
    ).length;
    const tendenciaPendientes = pedidosPendientesAnterior === 0
      ? pedidosPendientes > 0 ? 100 : 0
      : Math.round(((pedidosPendientes - pedidosPendientesAnterior) / pedidosPendientesAnterior) * 100);
    
    
    
    // 6. Calcular producto más vendido
    const productosCount = {};
    
    ventasEnRango.forEach(venta => {
      if (!venta.productos) return;
      
      venta.productos.forEach(item => {
        if (!item.producto || !item.cantidad) return;
        
        const productoId = item.producto.id || item.producto._id || JSON.stringify(item.producto);
        const nombreProducto = item.producto.nombre || 'Producto sin nombre';
        
        if (!productosCount[productoId]) {
          productosCount[productoId] = { 
            nombre: nombreProducto, 
            cantidad: 0 
          };
        }
        
        productosCount[productoId].cantidad += item.cantidad;
      });
    });
    
    // Encontrar el producto más vendido
    let productoDestacado = { nombre: 'Sin datos', cantidad: 0 };
    
    Object.keys(productosCount).forEach(id => {
      if (productosCount[id].cantidad > productoDestacado.cantidad) {
        productoDestacado = productosCount[id];
      }
    });
    
    // Buscar el mismo producto en el período anterior
    const productoDestacadoAnterior = { nombre: productoDestacado.nombre, cantidad: 0 };
    
    ventasRangoAnterior.forEach(venta => {
      if (!venta.productos) return;
      
      venta.productos.forEach(item => {
        if (!item.producto || !item.cantidad) return;
        
        const nombreProducto = item.producto.nombre || 'Producto sin nombre';
        
        if (nombreProducto === productoDestacado.nombre) {
          productoDestacadoAnterior.cantidad += item.cantidad;
        }
      });
    });
    
    const tendenciaProducto = productoDestacadoAnterior.cantidad === 0
      ? 100
      : Math.round(((productoDestacado.cantidad - productoDestacadoAnterior.cantidad) / productoDestacadoAnterior.cantidad) * 100);

    // Actualizar KPIs
    setKpis({
      ventasTotales: {
        valor: totalVentas,
        tendencia: {
          valor: tendenciaVentas,
          periodo: getPeriodoComparacion(timeRange.type)
        }
      },
      cantidadVentas: {
        valor: cantidadVentas,
        tendencia: {
          valor: tendenciaCantidad,
          periodo: getPeriodoComparacion(timeRange.type)
        }
      },
      ticketPromedio: {
        valor: ticketPromedio,
        tendencia: {
          valor: tendenciaTicket,
          periodo: getPeriodoComparacion(timeRange.type)
        }
      },
      pedidosPendientes: {
        valor: pedidosPendientes,
        tendencia: {
          valor: tendenciaPendientes,
          periodo: getPeriodoComparacion(timeRange.type)
        }
      },
      productoDestacado: {
        ...productoDestacado,
        tendencia: {
          valor: tendenciaProducto,
          periodo: getPeriodoComparacion(timeRange.type)
        }
      }
    });
    
    setLoading(false);
  }, [ventas, timeRange]);

  /**
   * Obtiene la descripción del período de comparación
   * @param {string} tipoRango - Tipo de rango de tiempo
   * @returns {string} Descripción del período anterior
   */
  const getPeriodoComparacion = (tipoRango) => {
    switch (tipoRango) {
      case 'today': return 'ayer';
      case 'week': return 'semana pasada';
      case 'month': return 'mes pasado';
      case 'year': return 'año pasado';
      case 'custom': return 'período anterior';
      default: return 'período anterior';
    }
  };

  return (
    <div className="kpi-container">
      <Row gutter={[16, 16]}>
        {/* KPI 1: Ventas Totales */}
        <Col xs={24} sm={12} md={12} lg={6} xl={4} xxl={4}>
          {loading ? (
            <Skeleton active paragraph={{ rows: 2 }} />
          ) : (
            <KPICard
              title="Ventas Totales"
              value={formatCurrency(kpis.ventasTotales.valor)}
              icon={<DollarCircleOutlined />}
              color="blue"
              tendencia={kpis.ventasTotales.tendencia}
              metaInfo="Total de ventas en el período seleccionado"
            />
          )}
        </Col>

        {/* KPI 2: Cantidad de Ventas */}
        <Col xs={24} sm={12} md={12} lg={6} xl={5} xxl={5}>
          {loading ? (
            <Skeleton active paragraph={{ rows: 2 }} />
          ) : (
            <KPICard
              title="Cantidad Ventas"
              value={kpis.cantidadVentas.valor}
              icon={<ShoppingCartOutlined />}
              color="green"
              tendencia={kpis.cantidadVentas.tendencia}
              metaInfo="Número de transacciones completadas"
            />
          )}
        </Col>

        {/* KPI 3: Ticket Promedio */}
        <Col xs={24} sm={12} md={12} lg={6} xl={5} xxl={5}>
          {loading ? (
            <Skeleton active paragraph={{ rows: 2 }} />
          ) : (
            <KPICard
              title="Ticket Promedio"
              value={formatCurrency(kpis.ticketPromedio.valor)}
              icon={<FileDoneOutlined />}
              color="purple"
              tendencia={kpis.ticketPromedio.tendencia}
              metaInfo="Valor promedio por venta"
            />
          )}
        </Col>

        {/* KPI 4: Pedidos Pendientes */}
        <Col xs={24} sm={12} md={12} lg={6} xl={5} xxl={5}>
          {loading ? (
            <Skeleton active paragraph={{ rows: 2 }} />
          ) : (
            <KPICard
              title="Pedidos Pendientes"
              value={kpis.pedidosPendientes.valor}
              icon={<ClockCircleOutlined />}
              color="orange"
              tendencia={kpis.pedidosPendientes.tendencia}
              metaInfo="Pedidos que aún no han sido completados"
            />
          )}
        </Col>

        {/* KPI 5: Producto Destacado */}
        <Col xs={24} sm={12} md={12} lg={6} xl={5} xxl={5}>
          {loading ? (
            <Skeleton active paragraph={{ rows: 2 }} />
          ) : (
            <KPICard
              title="Producto Destacado"
              value={kpis.productoDestacado.cantidad}
              suffix={` uds`}
              icon={<FireOutlined />}
              color="red"
              tendencia={kpis.productoDestacado.tendencia}
              metaInfo={`${kpis.productoDestacado.nombre}`}
            />
          )}
        </Col>
      </Row>
    </div>
  );
};

export default KPIContainer;
