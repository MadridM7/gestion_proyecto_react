import React, { useState, useEffect } from 'react';
import { Card, Empty, Spin, Radio } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { useVentas } from '../../context/VentasContext';

/**
 * Componente de gráfico de barras para visualizar las ventas por tipo de pago
 * @returns {JSX.Element} Gráfico de ventas por tipo de pago
 */
const PaymentTypeChart = () => {
  const { estadisticas, ventas } = useVentas();
  const [viewType, setViewType] = useState('monto'); // 'monto' o 'cantidad'
  const [loading, setLoading] = useState(false);
  
  // Preparar datos para el gráfico
  const prepareChartData = () => {
    if (viewType === 'monto') {
      return [
        {
          name: 'Efectivo',
          value: estadisticas?.ventasPorTipo?.efectivo || 0,
          color: '#52c41a'
        },
        {
          name: 'Débito',
          value: estadisticas?.ventasPorTipo?.debito || 0,
          color: '#1890ff'
        },
        {
          name: 'Crédito',
          value: estadisticas?.ventasPorTipo?.credito || 0,
          color: '#fa8c16'
        }
      ];
    } else {
      // Contar la cantidad de ventas por tipo de pago
      const efectivo = ventas?.filter(v => v.tipoPago === 'efectivo').length || 0;
      const debito = ventas?.filter(v => v.tipoPago === 'debito').length || 0;
      const credito = ventas?.filter(v => v.tipoPago === 'credito').length || 0;
      
      return [
        {
          name: 'Efectivo',
          value: efectivo,
          color: '#52c41a'
        },
        {
          name: 'Débito',
          value: debito,
          color: '#1890ff'
        },
        {
          name: 'Crédito',
          value: credito,
          color: '#fa8c16'
        }
      ];
    }
  };
  
  const chartData = prepareChartData();
  
  // Efecto para simular carga de datos
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [viewType]);
  
  // Manejar cambio de tipo de vista
  const handleViewTypeChange = (e) => {
    setViewType(e.target.value);
  };
  
  // Verificar si hay datos para mostrar
  const hasData = chartData.some(item => item.value > 0);
  
  // Formatear valores para el tooltip
  const formatValue = (value) => {
    if (viewType === 'monto') {
      return `$${value.toLocaleString('es-CL')}`;
    }
    return `${value} ventas`;
  };
  
  return (
    <Card 
      title="Ventas por Tipo de Pago"
      extra={
        <Radio.Group 
          value={viewType} 
          onChange={handleViewTypeChange} 
          size="small"
        >
          <Radio.Button value="monto">Monto</Radio.Button>
          <Radio.Button value="cantidad">Cantidad</Radio.Button>
        </Radio.Group>
      }
    >
      {loading ? (
        <div style={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Spin tip="Cargando datos..." />
        </div>
      ) : hasData ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(value) => viewType === 'monto' ? `$${value.toLocaleString('es-CL')}` : value} />
            <Tooltip 
              formatter={(value) => [formatValue(value), 'Total']}
              labelFormatter={(label) => `Tipo: ${label}`}
            />
            <Legend />
            <Bar 
              dataKey="value" 
              name="Total" 
              radius={[4, 4, 0, 0]}
              barSize={60}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <Empty 
          image={Empty.PRESENTED_IMAGE_SIMPLE} 
          description="No hay datos de ventas para mostrar" 
          style={{ height: 300, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
        />
      )}
    </Card>
  );
};

export default PaymentTypeChart;
