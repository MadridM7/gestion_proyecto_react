import React, { useState, useEffect } from 'react';
import { Typography, Radio, Card } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useVentas } from '../../context/VentasContext';
import moment from 'moment';

const { Title, Text } = Typography;

/**
 * Componente para mostrar el reporte de tendencias
 * @returns {JSX.Element} Reporte de tendencias
 */
const TendenciasReport = () => {
  const { ventas } = useVentas();
  const [datosTendencia, setDatosTendencia] = useState([]);
  const [periodo, setPeriodo] = useState('semana');
  
  // Preparar datos para el gráfico cuando cambien las ventas o el período
  useEffect(() => {
    if (!ventas || ventas.length === 0) return;
    
    // Función para agrupar ventas por período
    const agruparVentasPorPeriodo = () => {
      let periodoFormato;
      let numPeriodos;
      let periodoLabel;
      
      switch (periodo) {
        case 'dia':
          periodoFormato = 'DD/MM/YYYY';
          numPeriodos = 7; // últimos 7 días
          periodoLabel = 'día';
          break;
        case 'semana':
          periodoFormato = 'WW-YYYY';
          numPeriodos = 12; // últimas 12 semanas
          periodoLabel = 'semana';
          break;
        case 'mes':
          periodoFormato = 'MM/YYYY';
          numPeriodos = 12; // últimos 12 meses
          periodoLabel = 'mes';
          break;
        default:
          periodoFormato = 'DD/MM/YYYY';
          numPeriodos = 7;
          periodoLabel = 'día';
      }
      
      // Crear períodos de referencia
      const periodos = [];
      for (let i = numPeriodos - 1; i >= 0; i--) {
        let fecha;
        if (periodo === 'dia') {
          fecha = moment().subtract(i, 'days');
        } else if (periodo === 'semana') {
          fecha = moment().subtract(i, 'weeks');
        } else {
          fecha = moment().subtract(i, 'months');
        }
        
        let label;
        if (periodo === 'semana') {
          label = `Sem ${fecha.week()}`;
        } else if (periodo === 'mes') {
          label = fecha.format('MMM YYYY');
        } else {
          label = fecha.format('DD/MM');
        }
        
        periodos.push({
          periodo: fecha.format(periodoFormato),
          label,
          ventas: 0,
          monto: 0
        });
      }
      
      // Agrupar ventas por período
      ventas.forEach(venta => {
        if (!(venta.fechaHora instanceof Date)) return;
        
        const fechaVenta = moment(venta.fechaHora);
        const periodoVenta = fechaVenta.format(periodoFormato);
        
        const periodoIndex = periodos.findIndex(p => p.periodo === periodoVenta);
        if (periodoIndex !== -1) {
          periodos[periodoIndex].ventas += 1;
          periodos[periodoIndex].monto += venta.monto;
        }
      });
      
      return periodos;
    };
    
    const datos = agruparVentasPorPeriodo();
    setDatosTendencia(datos);
  }, [ventas, periodo]);
  
  // Manejar cambio de período
  const handlePeriodoChange = (e) => {
    setPeriodo(e.target.value);
  };
  
  // Formatear valores monetarios para el tooltip
  const formatCLP = (value) => {
    return `$${value.toLocaleString('es-CL')}`;
  };
  
  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={5} style={{ margin: 0 }}>Tendencia de Ventas</Title>
        <Radio.Group value={periodo} onChange={handlePeriodoChange} buttonStyle="solid" size="small">
          <Radio.Button value="dia">Diario</Radio.Button>
          <Radio.Button value="semana">Semanal</Radio.Button>
          <Radio.Button value="mes">Mensual</Radio.Button>
        </Radio.Group>
      </div>
      
      <Card>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={datosTendencia}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis yAxisId="left" tickFormatter={formatCLP} />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip 
              formatter={(value, name) => {
                if (name === 'Monto') return formatCLP(value);
                return value;
              }}
            />
            <Legend />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="monto" 
              name="Monto" 
              stroke="#8884d8" 
              activeDot={{ r: 8 }} 
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="ventas" 
              name="Cantidad" 
              stroke="#82ca9d" 
            />
          </LineChart>
        </ResponsiveContainer>
        
        <div style={{ marginTop: 16 }}>
          <Text type="secondary">
            Este gráfico muestra la tendencia de ventas tanto en monto total como en cantidad de transacciones.
            Puedes cambiar el período para ver diferentes perspectivas de la evolución de tus ventas.
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default TendenciasReport;
