/**
 * @fileoverview Componente de gráfico de ventas para el dashboard
 */
import React from 'react';
import { Card } from 'antd';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useVentas } from '../../context/VentasContext';

/**
 * Componente que muestra un gráfico de barras con las ventas por día
 * @returns {JSX.Element} Gráfico de ventas
 */
const SalesChart = () => {
  const { ventas } = useVentas();

  /**
   * Formatea valores numéricos como moneda chilena (CLP)
   * @param {number} value - Valor a formatear
   * @returns {string} Valor formateado como moneda
   */
  const formatCLP = (value) => {
    return `$${value.toLocaleString('es-CL')}`;
  };

  /**
   * Agrupa las ventas por día y calcula los totales
   * @returns {Array} Datos procesados para el gráfico
   */
  const procesarDatosGrafico = () => {
    // Si no hay ventas, retornar datos de ejemplo
    if (!ventas || ventas.length === 0) {
      return [
        { name: 'Lun', ventas: 0 },
        { name: 'Mar', ventas: 0 },
        { name: 'Mié', ventas: 0 },
        { name: 'Jue', ventas: 0 },
        { name: 'Vie', ventas: 0 },
        { name: 'Sáb', ventas: 0 },
        { name: 'Dom', ventas: 0 }
      ];
    }

    // Crear un objeto para almacenar las ventas por día
    const ventasPorDia = {};
    
    // Nombres de los días de la semana
    const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    
    // Procesar cada venta
    ventas.forEach(venta => {
      const fecha = new Date(venta.fechaHora);
      const diaSemana = diasSemana[fecha.getDay()];
      
      // Inicializar el día si no existe
      if (!ventasPorDia[diaSemana]) {
        ventasPorDia[diaSemana] = 0;
      }
      
      // Sumar el monto de la venta
      ventasPorDia[diaSemana] += venta.monto;
    });
    
    // Convertir el objeto a un array para el gráfico
    // Ordenar los días de la semana correctamente (Lun-Dom)
    const ordenDias = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    
    return ordenDias.map(dia => ({
      name: dia,
      ventas: ventasPorDia[dia] || 0
    }));
  };

  /**
   * Componente personalizado para el tooltip del gráfico
   */
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{`${label}`}</p>
          <p className="tooltip-value">
            <span className="tooltip-name">Ventas:</span> 
            <span className="tooltip-amount">{formatCLP(payload[0].value)}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card 
      title="Ventas por Día de la Semana" 
      className="chart-card"
      extra={<span className="chart-period">Últimos 7 días</span>}
    >
      <ResponsiveContainer width="100%" height={350}>
        <AreaChart
          data={procesarDatosGrafico()}
          margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            label={{ 
              value: 'Día de la Semana', 
              position: 'insideBottomRight', 
              offset: -10 
            }} 
          />
          <YAxis 
            tickFormatter={formatCLP}
            label={{ 
              angle: -90, 
              position: 'insideLeft',
              style: { textAnchor: 'middle' }
            }} 
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="top" 
            height={36}
          />
          <defs>
            <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1890ff" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#1890ff" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <Area 
            type="monotone"
            dataKey="ventas" 
            name="Ventas" 
            stroke="#1890ff"
            fillOpacity={1}
            fill="url(#colorVentas)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default SalesChart;
