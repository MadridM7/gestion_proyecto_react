/**
 * @fileoverview Componente de gráfico de ventas mejorado que usa el filtro de tiempo global
 */
import React, { useEffect, useState } from 'react';
import { Card, Empty } from 'antd';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { formatCurrency } from '../../utils/formatters';
import dayjs from 'dayjs';
import '../../styles/components/dashboard/Chart.css';

/**
 * Componente que muestra un gráfico de área con la evolución de ventas
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.ventas - Arreglo de ventas a mostrar
 * @param {Object} props.timeRange - Rango de tiempo seleccionado globalmente
 * @param {boolean} props.loading - Indica si está cargando los datos
 * @returns {JSX.Element} Gráfico de ventas
 */
const SalesChart = ({ ventas = [], timeRange, loading = false }) => {
  const [chartData, setChartData] = useState([]);
  
  /**
   * Formatea valores numéricos como moneda chilena (CLP)
   * @param {number} value - Valor a formatear
   * @returns {string} Valor formateado como moneda
   */
  const formatCLP = (value) => {
    return formatCurrency(value);
  };

  /**
   * Procesa los datos de ventas según el rango de tiempo seleccionado
   * @returns {Array} Datos procesados para el gráfico
   */
  useEffect(() => {
    if (!ventas || !Array.isArray(ventas) || !timeRange) {
      setChartData([]);
      return;
    }

    console.log('SalesChart - ventas recibidas:', ventas?.length);
    console.log('SalesChart - timeRange:', timeRange);
    
    // Filtrar ventas según el rango de tiempo seleccionado
    const filteredVentas = ventas.filter(venta => {
      if (!venta.fechaHora) {
        console.log('Venta sin fecha:', venta);
        return false;
      }
      
      // Validar que timeRange y sus propiedades existan
      if (!timeRange || !timeRange.startDate || !timeRange.endDate) {
        console.log('timeRange incompleto, incluyendo todas las ventas');
        return true;
      }
      
      const ventaDate = new Date(venta.fechaHora);
      const startDate = new Date(timeRange.startDate);
      const endDate = new Date(timeRange.endDate);
      
      // Comprobamos que la fecha de la venta esté dentro del rango
      return ventaDate >= startDate && ventaDate <= endDate;
    });
    
    console.log('SalesChart - ventas filtradas:', filteredVentas.length);

    // Determinar si mostrar por horas o por días según el rango de tiempo
    const mostrarPorHoras = timeRange && 
      (new Date(timeRange.endDate) - new Date(timeRange.startDate)) <= 86400000; // 24 horas en ms
    
    console.log('SalesChart - Mostrar por horas:', mostrarPorHoras);
    
    let result = [];
    
    if (mostrarPorHoras) {
      // Agrupar ventas por hora y calcular totales
      const ventasPorHora = {};
      filteredVentas.forEach(venta => {
        // Para el modo por horas, usamos la hora completa
        const fechaHora = dayjs(venta.fechaHora);
        const hora = fechaHora.format('HH:00'); // Redondeamos a la hora
        const fechaCompleta = fechaHora.format('YYYY-MM-DD HH:00');
        
        if (!ventasPorHora[fechaCompleta]) {
          ventasPorHora[fechaCompleta] = {
            fecha: fechaCompleta,
            hora,
            etiqueta: hora,  // Para mostrar solo la hora en el eje X
            total: 0,
            count: 0
          };
        }
        ventasPorHora[fechaCompleta].total += parseFloat(venta.monto || 0);
        ventasPorHora[fechaCompleta].count += 1;
      });
      
      // Convertir a array y ordenar por fecha/hora
      result = Object.values(ventasPorHora).sort((a, b) => 
        dayjs(a.fecha).diff(dayjs(b.fecha))
      );
      
    } else {
      // Agrupar ventas por día y calcular totales diarios
      const ventasPorDia = {};
      filteredVentas.forEach(venta => {
        const fecha = dayjs(venta.fechaHora).format('YYYY-MM-DD');
        if (!ventasPorDia[fecha]) {
          ventasPorDia[fecha] = {
            fecha,
            etiqueta: dayjs(fecha).format('DD/MM'),  // Formato más corto para el eje X
            total: 0,
            count: 0
          };
        }
        ventasPorDia[fecha].total += parseFloat(venta.monto || 0);
        ventasPorDia[fecha].count += 1;
      });
      
      // Convertir a array y ordenar por fecha
      result = Object.values(ventasPorDia).sort((a, b) => 
        dayjs(a.fecha).diff(dayjs(b.fecha))
      );
    }
    
    setChartData(result);
  }, [ventas, timeRange]);

  /**
   * Personalizar el tooltip del gráfico
   * @param {Object} props - Propiedades del tooltip
   * @returns {JSX.Element} Tooltip personalizado
   */
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const esPorHoras = payload[0].payload.hora !== undefined;
      const fechaFormateada = esPorHoras 
        ? `${dayjs(payload[0].payload.fecha).format('DD/MM/YYYY')} a las ${payload[0].payload.hora}` 
        : dayjs(payload[0].payload.fecha).format('DD/MM/YYYY');
      
      return (
        <div className="custom-tooltip">
          <p className="tooltip-date">{fechaFormateada}</p>
          <p className="tooltip-total">
            Total: {formatCLP(payload[0].value)}
          </p>
          <p className="tooltip-count">
            {payload[0].payload.count} venta(s)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card 
      title="Evolución de Ventas" 
      className="dashboard-card sales-chart-card"
      style={{ height: "370px" }}
      loading={loading}
    >
      {chartData && chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={290}>
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0.2}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="fecha"
              tickFormatter={(value) => {
                const item = chartData.find(item => item.fecha === value);
                return item && item.etiqueta ? item.etiqueta : dayjs(value).format('DD/MM');
              }}
            />
            <YAxis 
              tickFormatter={(value) => `$${(value/1000)}k`}
            />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="total" 
              stroke="#8884d8" 
              fillOpacity={1} 
              fill="url(#colorTotal)" 
              activeDot={{ r: 8 }}
              name="Ventas"
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="chart-empty-container">
          <Empty 
            image={Empty.PRESENTED_IMAGE_SIMPLE} 
            description={<span>No hay datos disponibles para el período seleccionado</span>}
          />
        </div>
      )}
    </Card>
  );
};

export default SalesChart;
