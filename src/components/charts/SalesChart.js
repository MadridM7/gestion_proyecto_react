import React, { useState, useEffect } from 'react';
import { Card, Radio, Empty, Spin } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useVentas } from '../../context/VentasContext';
import moment from 'moment';

/**
 * Componente de gráfico de líneas para visualizar las ventas por período
 * @returns {JSX.Element} Gráfico de ventas
 */
const SalesChart = () => {
  const { ventas } = useVentas();
  const [chartData, setChartData] = useState([]);
  const [period, setPeriod] = useState('day');
  const [loading, setLoading] = useState(true);
  
  // Preparar datos para el gráfico cuando cambien las ventas o el período
  useEffect(() => {
    setLoading(true);
    
    // Si no hay ventas, no hay datos para mostrar
    if (!ventas || ventas.length === 0) {
      setChartData([]);
      setLoading(false);
      return;
    }
    
    // Función para agrupar ventas por período
    const groupSalesByPeriod = () => {
      // Crear un objeto para agrupar las ventas
      const groupedSales = {};
      
      // Crear fechas de referencia basadas en el período seleccionado
      
      // Crear fechas de referencia para asegurar que se muestren períodos vacíos
      let referenceKeys = [];
      
      if (period === 'day') {
        // Mostrar los últimos 7 días
        for (let i = 6; i >= 0; i--) {
          const date = moment().subtract(i, 'days');
          referenceKeys.push(date.format('DD/MM/YYYY'));
        }
      } else if (period === 'week') {
        // Mostrar las últimas 4 semanas
        for (let i = 3; i >= 0; i--) {
          const date = moment().subtract(i, 'weeks');
          referenceKeys.push(`Semana ${date.week()} - ${date.year()}`);
        }
      } else if (period === 'month') {
        // Mostrar los últimos 6 meses
        for (let i = 5; i >= 0; i--) {
          const date = moment().subtract(i, 'months');
          referenceKeys.push(date.format('MM/YYYY'));
        }
      }
      
      // Inicializar los períodos de referencia con valores cero
      referenceKeys.forEach(key => {
        groupedSales[key] = {
          period: key,
          total: 0,
          count: 0
        };
      });
      
      // Agrupar ventas según el período seleccionado
      ventas.forEach(venta => {
        if (!(venta.fechaHora instanceof Date)) return;
        
        let key;
        
        switch (period) {
          case 'day':
            key = moment(venta.fechaHora).format('DD/MM/YYYY');
            break;
          case 'week':
            key = `Semana ${moment(venta.fechaHora).week()} - ${moment(venta.fechaHora).year()}`;
            break;
          case 'month':
            key = moment(venta.fechaHora).format('MM/YYYY');
            break;
          default:
            key = moment(venta.fechaHora).format('DD/MM/YYYY');
        }
        
        // Solo procesar ventas que estén dentro del período de referencia
        if (referenceKeys.includes(key)) {
          if (!groupedSales[key]) {
            groupedSales[key] = {
              period: key,
              total: 0,
              count: 0
            };
          }
          
          groupedSales[key].total += venta.monto;
          groupedSales[key].count += 1;
        }
      });
      
      // Convertir el objeto a un array para Recharts
      const dataArray = Object.values(groupedSales);
      
      // Ordenar por período
      dataArray.sort((a, b) => {
        if (period === 'day') {
          return moment(a.period, 'DD/MM/YYYY').valueOf() - moment(b.period, 'DD/MM/YYYY').valueOf();
        } else if (period === 'week') {
          const weekA = parseInt(a.period.split(' ')[1]);
          const weekB = parseInt(b.period.split(' ')[1]);
          return weekA - weekB;
        } else {
          return moment(a.period, 'MM/YYYY').valueOf() - moment(b.period, 'MM/YYYY').valueOf();
        }
      });
      
      return dataArray;
    };
    
    // Actualizar los datos del gráfico
    const newChartData = groupSalesByPeriod();
    setChartData(newChartData);
    
    // Simular un tiempo de carga para una mejor experiencia de usuario
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [ventas, period]);
  
  // Función para manejar el cambio de período
  const handlePeriodChange = (e) => {
    setPeriod(e.target.value);
  };
  
  // Formatear valores monetarios para el tooltip
  const formatCLP = (value) => {
    return `$${value.toLocaleString('es-CL')}`;
  };
  
  return (
    <Card 
      title="Ventas por Período" 
      extra={
        <Radio.Group value={period} onChange={handlePeriodChange} size="small">
          <Radio.Button value="day">Día</Radio.Button>
          <Radio.Button value="week">Semana</Radio.Button>
          <Radio.Button value="month">Mes</Radio.Button>
        </Radio.Group>
      }
    >
      {loading ? (
        <div style={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Spin tip="Cargando datos..." />
        </div>
      ) : chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis tickFormatter={formatCLP} />
            <Tooltip 
              formatter={(value) => [formatCLP(value), 'Total']}
              labelFormatter={(label) => `Período: ${label}`}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="total" 
              name="Total Ventas" 
              stroke="#1890ff" 
              activeDot={{ r: 8 }} 
            />
          </LineChart>
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

export default SalesChart;
