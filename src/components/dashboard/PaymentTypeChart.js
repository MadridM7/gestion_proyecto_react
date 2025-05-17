/**
 * @fileoverview Componente de gráfico de distribución por tipo de pago
 */
import React from 'react';
import { Card } from 'antd';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useVentas } from '../../context/VentasContext';

/**
 * Componente que muestra un gráfico de barras con la distribución de ventas por tipo de pago
 * @returns {JSX.Element} Gráfico de tipos de pago
 */
const PaymentTypeChart = () => {
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
   * Agrupa las ventas por tipo de pago y calcula los totales
   * @returns {Array} Datos procesados para el gráfico
   */
  const procesarDatosTipoPago = () => {
    // Si no hay ventas, retornar datos de ejemplo
    if (!ventas || ventas.length === 0) {
      return [
        { name: 'Efectivo', monto: 0, fill: '#52c41a' },
        { name: 'Débito', monto: 0, fill: '#2f54eb' },
        { name: 'Crédito', monto: 0, fill: '#eb2f96' }
      ];
    }

    // Agrupar ventas por tipo de pago
    const ventasPorTipo = ventas.reduce((acc, venta) => {
      const tipo = venta.tipoPago;
      if (!acc[tipo]) {
        acc[tipo] = 0;
      }
      acc[tipo] += venta.monto;
      return acc;
    }, {});

    // Convertir a formato para el gráfico
    return Object.keys(ventasPorTipo).map(tipo => {
      let nombre = tipo;
      let color = '#722ed1'; // Color por defecto
      
      // Formatear nombres para mejor visualización y asignar colores
      if (tipo === 'efectivo') {
        nombre = 'Efectivo';
        color = '#52c41a';
      } else if (tipo === 'debito') {
        nombre = 'Débito';
        color = '#2f54eb';
      } else if (tipo === 'credito') {
        nombre = 'Crédito';
        color = '#eb2f96';
      }
      
      return {
        name: nombre,
        monto: ventasPorTipo[tipo],
        fill: color
      };
    });
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
            <span className="tooltip-name">Total:</span> 
            <span className="tooltip-amount">{formatCLP(payload[0].value)}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Colores para los diferentes tipos de pago ya definidos en los datos

  return (
    <Card 
      title="Distribución por Tipo de Pago" 
      className="chart-card"
      extra={<span className="chart-period">Todas las ventas</span>}
    >
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={procesarDatosTipoPago()}
          margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
          barSize={80}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            label={{ 
              value: 'Tipo de Pago', 
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
          <Bar 
            dataKey="monto" 
            name="Monto"
            radius={[4, 4, 0, 0]}
            fillOpacity={0.9}
          >
            {procesarDatosTipoPago().map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default PaymentTypeChart;
