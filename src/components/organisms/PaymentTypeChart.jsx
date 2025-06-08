/**
 * @fileoverview Componente de gráfico de distribución por tipo de pago que usa el filtro de tiempo global
 */
import React, { useEffect, useState } from 'react';
import { Card, Empty } from 'antd';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  LabelList
} from 'recharts';
import { formatCurrency } from '../../utils/formatters';
import '../../styles/components/dashboard/Chart.css';

// Colores para los diferentes tipos de pago
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

/**
 * Componente de gráfico de barras para mostrar la distribución de ventas por tipo de pago
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.ventas - Arreglo de ventas a mostrar
 * @param {Object} props.timeRange - Rango de tiempo seleccionado globalmente
 * @param {boolean} props.loading - Indica si está cargando los datos
 * @returns {JSX.Element} Gráfico de tipos de pago
 */
const PaymentTypeChart = ({ ventas = [], timeRange, loading = false }) => {
  // Estado para almacenar los datos procesados del gráfico
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
   * Procesa los datos de ventas para el gráfico cuando cambian las ventas o el timeRange
   */
  useEffect(() => {
    if (!ventas || !Array.isArray(ventas)) {
      setChartData([]);
      return;
    }

    // Filtrar ventas por rango de tiempo seleccionado
    const ventasFiltradas = ventas.filter(venta => {
      if (!venta.fechaHora) return false;
      
      if (!timeRange || !timeRange.startDate || !timeRange.endDate) return true;
      
      const fechaVenta = new Date(venta.fechaHora);
      const startDate = new Date(timeRange.startDate);
      const endDate = new Date(timeRange.endDate);
      
      // Incluir ventas dentro del rango de fechas (incluyendo los límites)
      return fechaVenta >= startDate && fechaVenta <= endDate;
    });
    
    console.log('PaymentTypeChart - Ventas filtradas:', ventasFiltradas.length);

    // Agrupa las ventas por tipo de pago y calcula los totales
    const tiposPago = {};
    
    ventasFiltradas.forEach(venta => {
      const metodoPago = venta.tipoPago || 'No especificado';
      
      if (!tiposPago[metodoPago]) {
        tiposPago[metodoPago] = {
          tipo: metodoPago,
          total: 0,
          cantidad: 0
        };
      }
      
      tiposPago[metodoPago].total += parseFloat(venta.monto || 0);
      tiposPago[metodoPago].cantidad += 1;
    });
    
    // Convertir a array para el gráfico
    const result = Object.values(tiposPago)
      .sort((a, b) => b.total - a.total)
      .map(item => ({
        ...item,
        tipo: item.tipo.charAt(0).toUpperCase() + item.tipo.slice(1).toLowerCase()
      }));
    
    setChartData(result);
  }, [ventas, timeRange]);

  /**
   * Renderizador personalizado para las etiquetas de las barras
   */
  const renderCustomizedLabel = (props) => {
    const { x, y, width, value, payload } = props;
    const radius = 10;
    
    // Validación de seguridad para evitar errores
    if (!payload) return null;
    
    // Acceso seguro a la cantidad con valor por defecto
    const cantidad = payload.cantidad || 0;
    
    return (
      <g>
        {/* Etiqueta de monto */}
        <text 
          x={x + width / 2} 
          y={y - radius} 
          fill="#666"
          textAnchor="middle" 
          dominantBaseline="middle"
          fontSize="12"
        >
          {formatCLP(value)}
        </text>
        
        {/* Número de ventas dentro de la barra */}
        <text 
          x={x + width - 20} 
          y={y + 10} 
          fill="#fff"
          textAnchor="end" 
          dominantBaseline="middle"
          fontSize="10"
          fontWeight="bold"
        >
          {cantidad}
        </text>
      </g>
    );
  };

  /**
   * Personalizar el tooltip del gráfico
   */
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{payload[0].payload.tipo}</p>
          <p className="tooltip-total">
            Total: {formatCLP(payload[0].value)}
          </p>
          <p className="tooltip-count">
            {payload[0].payload.cantidad} venta(s)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card 
      title="Ventas por Tipo de Pago" 
      className="dashboard-card payment-type-chart-card"
      loading={loading}
      style={{ height: "370px" }}
    >
      {chartData && chartData.length > 0 ? (
        <ResponsiveContainer width="95%" height={290}>
          <BarChart 
            data={chartData}
            layout="vertical"
            barSize={30}
            margin={{
              top: 20,
              right: 20,
              left: 5,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tickFormatter={formatCLP} />
            <YAxis dataKey="tipo" type="category" width={100} />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="total" 
              fill="#8884d8" 
              background={{ fill: '#eee' }}
            >
              <LabelList dataKey="total" content={renderCustomizedLabel} />
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                />
              ))}
            </Bar>
          </BarChart>
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

export default PaymentTypeChart;
