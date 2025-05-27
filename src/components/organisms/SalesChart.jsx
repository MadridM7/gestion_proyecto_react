/**
 * @fileoverview Componente de gráfico de ventas mejorado con visualización moderna
 */
import React, { useState } from 'react';
import { Card, Radio, Space } from 'antd';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useVentas } from '../../context/VentasContext';
import { formatCurrency } from '../../utils/formatters';
import '../../styles/components/dashboard/Chart.css';

/**
 * Componente que muestra un gráfico de área con la evolución de ventas
 * @returns {JSX.Element} Gráfico de ventas
 */
const SalesChart = () => {
  const { ventas } = useVentas();
  const [periodo, setPeriodo] = useState('semana'); // 'dia', 'semana', 'mes'

  /**
   * Formatea valores numéricos como moneda chilena (CLP)
   * @param {number} value - Valor a formatear
   * @returns {string} Valor formateado como moneda
   */
  const formatCLP = (value) => {
    return formatCurrency(value);
  };

  /**
   * Maneja el cambio de periodo seleccionado
   */
  const handlePeriodoChange = (e) => {
    setPeriodo(e.target.value);
  };

  // No necesitamos esta función ya que mostramos los botones directamente

  /**
   * Procesa los datos de ventas según el periodo seleccionado
   * @returns {Array} Datos procesados para el gráfico
   */
  const procesarDatosVentas = () => {
    // Verificar que tenemos datos de ventas del contexto
    if (!ventas || !Array.isArray(ventas)) {
      console.warn('No hay datos de ventas disponibles en el contexto');
      return [];
    }

    const hoy = new Date();
    const datosProcesados = [];

    // Configurar parámetros según el periodo
    switch (periodo) {
      case 'dia': {
        // Para el día actual, mostrar cada hora
        const fechaInicio = new Date(hoy);
        fechaInicio.setHours(0, 0, 0, 0);
        
        // Crear datos para cada hora
        for (let hora = 0; hora < 24; hora++) {
          const fechaHora = new Date(fechaInicio);
          fechaHora.setHours(hora);
          
          // Formatear la hora para mostrar
          let horaFormateada = '';
          if (hora === 0) horaFormateada = '12 AM';
          else if (hora === 12) horaFormateada = '12 PM';
          else if (hora < 12) horaFormateada = `${hora} AM`;
          else horaFormateada = `${hora - 12} PM`;
          
          // Sumar ventas para esta hora
          let totalVentas = 0;
          ventas.forEach(venta => {
            if (!venta.fechaHora || typeof venta.monto !== 'number') return;
            
            const fechaVenta = new Date(venta.fechaHora);
            if (fechaVenta.getDate() === hoy.getDate() && 
                fechaVenta.getMonth() === hoy.getMonth() && 
                fechaVenta.getFullYear() === hoy.getFullYear() && 
                fechaVenta.getHours() === hora) {
              totalVentas += venta.monto;
            }
          });
          
          datosProcesados.push({
            fecha: fechaHora.toISOString(),
            ventas: totalVentas,
            fechaFormateada: horaFormateada,
            hora: hora // Guardar la hora para filtrar en el eje X
          });
        }
        break;
      }
      
      case 'semana': {
        // Nombres de los días de la semana en orden correcto (lunes a domingo)
        const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
        
        // Encontrar el lunes de la semana actual
        const fechaInicio = new Date(hoy);
        const diaSemana = fechaInicio.getDay(); // 0=domingo, 1=lunes, ..., 6=sábado
        const diasHastaLunes = diaSemana === 0 ? 6 : diaSemana - 1; // Si es domingo, restar 6 días
        fechaInicio.setDate(fechaInicio.getDate() - diasHastaLunes);
        fechaInicio.setHours(0, 0, 0, 0);
        
        // Crear datos para cada día de la semana
        for (let i = 0; i < 7; i++) {
          const fecha = new Date(fechaInicio);
          fecha.setDate(fechaInicio.getDate() + i);
          
          // Formatear la fecha para mostrar
          const numeroDia = fecha.getDate().toString().padStart(2, '0');
          const nombreDia = diasSemana[i]; // Usar el índice directamente (0=lunes, etc.)
          
          // Sumar ventas para este día
          let totalVentas = 0;
          ventas.forEach(venta => {
            if (!venta.fechaHora || typeof venta.monto !== 'number') return;
            
            const fechaVenta = new Date(venta.fechaHora);
            if (fechaVenta.getDate() === fecha.getDate() && 
                fechaVenta.getMonth() === fecha.getMonth() && 
                fechaVenta.getFullYear() === fecha.getFullYear()) {
              totalVentas += venta.monto;
            }
          });
          
          datosProcesados.push({
            fecha: fecha.toISOString().split('T')[0],
            ventas: totalVentas,
            fechaFormateada: `${nombreDia} ${numeroDia}`,
            diaSemana: i // Para mantener el orden correcto
          });
        }
        break;
      }
      
      case 'mes': {
        // Primer día del mes actual
        const fechaInicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        const diasEnMes = hoy.getDate(); // Número de días hasta hoy
        
        // Crear datos para cada día del mes hasta hoy
        for (let i = 0; i < diasEnMes; i++) {
          const fecha = new Date(fechaInicio);
          fecha.setDate(fechaInicio.getDate() + i);
          
          // Calcular la semana a la que pertenece el día
          const diffDias = Math.floor((fecha - fechaInicio) / (1000 * 60 * 60 * 24));
          const numSemana = Math.floor(diffDias / 7) + 1;
          const esPrimerDiaSemana = diffDias % 7 === 0;
          
          // Formatear la fecha para mostrar
          const dia = fecha.getDate();
          const mes = fecha.getMonth() + 1;
          let etiqueta = `${dia}/${mes}`;
          if (esPrimerDiaSemana) {
            etiqueta = `Sem ${numSemana}\n${dia}/${mes}`;
          }
          
          // Sumar ventas para este día
          let totalVentas = 0;
          ventas.forEach(venta => {
            if (!venta.fechaHora || typeof venta.monto !== 'number') return;
            
            const fechaVenta = new Date(venta.fechaHora);
            if (fechaVenta.getDate() === fecha.getDate() && 
                fechaVenta.getMonth() === fecha.getMonth() && 
                fechaVenta.getFullYear() === fecha.getFullYear()) {
              totalVentas += venta.monto;
            }
          });
          
          datosProcesados.push({
            fecha: fecha.toISOString().split('T')[0],
            ventas: totalVentas,
            fechaFormateada: etiqueta,
            semana: numSemana,
            esSemana: esPrimerDiaSemana
          });
        }
        break;
      }
      
      default:
        console.warn('Periodo no reconocido:', periodo);
        return [];
    }
    
    return datosProcesados;
  };

  /**
   * Componente personalizado para el tooltip del gráfico
   */
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      let titulo = '';
      
      switch (periodo) {
        case 'dia':
          titulo = `Hora: ${label}`;
          break;
        case 'semana':
          titulo = label;
          break;
        case 'mes':
          titulo = label;
          break;
        default:
          titulo = label;
          break;
      }
      
      return (
        <div className="custom-tooltip sales-tooltip">
          <p className="tooltip-title">{titulo}</p>
          <div className="tooltip-content">
            <div className="tooltip-item">
              <div className="tooltip-indicator" style={{ backgroundColor: '#1890ff' }}></div>
              <span className="tooltip-name">Ventas:</span>
              <span className="tooltip-amount">{formatCLP(payload[0].value)}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card
      title="Ventas"
      className="chart-card sales-chart-card"
      extra={
        <Space>
          <Radio.Group value={periodo} onChange={handlePeriodoChange} buttonStyle="solid" size="small">
            <Radio.Button value="dia">Día</Radio.Button>
            <Radio.Button value="semana">Semana</Radio.Button>
            <Radio.Button value="mes">Mes</Radio.Button>
          </Radio.Group>
        </Space>
      }
    >
      <ResponsiveContainer width="100%" height={350}>
        <AreaChart
          data={procesarDatosVentas()}
          margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
        >
          <defs>
            <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1890ff" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#1890ff" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="fechaFormateada"
            axisLine={{ stroke: '#E0E0E0' }}
            tickLine={false}
            tick={{ fill: '#666666', fontSize: 12 }}
            interval={periodo === 'dia' ? 1 : (periodo === 'mes' ? 6 : 0)} // En vista diaria cada 2 horas, en mensual cada semana
            angle={periodo === 'mes' ? -45 : 0} // Rotar etiquetas en vista mensual para mejor legibilidad
            textAnchor={periodo === 'mes' ? 'end' : 'middle'}
            height={60} // Dar más espacio para las etiquetas
          />
          <YAxis 
            tickFormatter={formatCLP}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#666666', fontSize: 12 }}
            interval={0}
          />
          <Tooltip 
            content={<CustomTooltip />} 
            cursor={{ stroke: '#f0f0f0', strokeWidth: 2 }}
          />
          <Area
            type="monotone"
            dataKey="ventas"
            name="Ventas"
            stroke="#1890ff"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorVentas)"
            activeDot={{ r: 8, stroke: '#FFFFFF', strokeWidth: 2, fill: '#1890ff' }}
            // Destacar visualmente las semanas en vista mensual
            dot={periodo === 'mes' ? (props) => {
              const { cx, cy, payload } = props;
              // Destacar el primer día de cada semana
              if (payload.esSemana) {
                return (
                  <circle 
                    cx={cx} 
                    cy={cy} 
                    r={4} 
                    stroke="#1890ff" 
                    strokeWidth={2} 
                    fill="#fff" 
                  />
                );
              }
              return null;
            } : null}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default SalesChart;
