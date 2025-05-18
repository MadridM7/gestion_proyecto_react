/**
 * @fileoverview Componente de gráfico de ventas
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
    return `$${value.toLocaleString('es-CL')}`;
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
    let fechaInicio, fechas, formato;

    // Configurar parámetros según el periodo
    switch (periodo) {
      case 'dia':
        // Para el día actual, mostrar las últimas 24 horas por hora
        fechaInicio = new Date(hoy);
        fechaInicio.setHours(0, 0, 0, 0);
        fechas = [];
        for (let i = 0; i < 24; i++) {
          const fecha = new Date(fechaInicio);
          fecha.setHours(i);
          fechas.push(fecha.toISOString());
        }
        formato = (fecha) => new Date(fecha).getHours() + ':00';
        break;

      case 'semana':
        // Para la semana actual, mostrar desde lunes hasta domingo
        fechaInicio = new Date(hoy);
        // Calcular el lunes de la semana actual (día 1 = lunes, 0 = domingo)
        const diaSemana = fechaInicio.getDay();
        const diasHastaLunes = diaSemana === 0 ? 6 : diaSemana - 1; // Si es domingo, restar 6 días, sino restar (día - 1)
        fechaInicio.setDate(fechaInicio.getDate() - diasHastaLunes);
        fechaInicio.setHours(0, 0, 0, 0);
        
        fechas = [];
        for (let i = 0; i < 7; i++) {
          const fecha = new Date(fechaInicio);
          fecha.setDate(fechaInicio.getDate() + i);
          fechas.push(fecha.toISOString().split('T')[0]);
        }
        formato = (fecha) => {
          const fechaObj = new Date(fecha);
          return fechaObj.toLocaleDateString('es-CL', { weekday: 'short', day: '2-digit' });
        };
        break;

      case 'mes':
        // Para el mes actual, mostrar los últimos 30 días agrupados por semana
        fechaInicio = new Date(hoy);
        fechaInicio.setDate(hoy.getDate() - 29);
        fechas = [];
        
        // Agrupar por semanas (aproximadamente 4 semanas en un mes)
        for (let i = 0; i < 4; i++) {
          const inicioSemana = new Date(fechaInicio);
          inicioSemana.setDate(fechaInicio.getDate() + (i * 7));
          fechas.push(inicioSemana.toISOString().split('T')[0]);
        }
        formato = (fecha) => {
          // Determinar a qué semana pertenece la fecha
          const fechaObj = new Date(fecha);
          const diffDias = Math.floor((fechaObj - fechaInicio) / (1000 * 60 * 60 * 24));
          const numSemana = Math.floor(diffDias / 7) + 1;
          return `Semana ${numSemana}`;
        };
        break;

      default:
        console.warn('Periodo no reconocido:', periodo);
        return [];
    }

    // Inicializar datos con valores en cero
    const datosProcesados = fechas.map(fecha => ({
      fecha,
      ventas: 0
    }));

    // Procesar los datos de ventas del archivo JSON
    console.log(`Procesando ${ventas.length} ventas para el periodo ${periodo}`);
    
    ventas.forEach(venta => {
      // Verificar que la venta tiene fecha y monto válidos
      if (!venta.fechaHora || typeof venta.monto !== 'number') {
        return; // Saltar esta venta si no tiene datos válidos
      }
      
      const fechaVenta = new Date(venta.fechaHora);
      let indice = -1;

      switch (periodo) {
        case 'dia':
          // Encontrar la hora correspondiente
          indice = fechas.findIndex(f => {
            const hora = new Date(f).getHours();
            return fechaVenta.getHours() === hora && 
                   fechaVenta.getDate() === new Date(f).getDate() &&
                   fechaVenta.getMonth() === new Date(f).getMonth();
          });
          break;

        case 'semana':
          // Encontrar el día correspondiente
          const fechaKey = fechaVenta.toISOString().split('T')[0];
          indice = fechas.indexOf(fechaKey);
          break;

        case 'mes':
          // Encontrar la semana correspondiente
          for (let i = 0; i < fechas.length; i++) {
            const inicioSemana = new Date(fechas[i]);
            const finSemana = new Date(inicioSemana);
            finSemana.setDate(inicioSemana.getDate() + 6);
            
            if (fechaVenta >= inicioSemana && fechaVenta <= finSemana) {
              indice = i;
              break;
            }
          }
          break;
          
        default:
          // Por defecto, no hacer nada
          break;
      }

      // Actualizar los datos si encontramos una coincidencia
      if (indice !== -1) {
        datosProcesados[indice].ventas += venta.monto;
      }
    });
    
    return datosProcesados.map(item => ({
      ...item,
      fechaFormateada: formato(item.fecha)
    }));
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
        <div className="custom-tooltip">
          <p className="tooltip-date">{titulo}</p>
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
      title="Evolución de Ventas"
      className="chart-card"
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
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="fechaFormateada"
            label={{
              value: 'Periodo',
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
          <Area
            type="monotone"
            dataKey="ventas"
            name="Ventas"
            stroke="#1890ff"
            fill="#1890ff"
            fillOpacity={0.3}
            activeDot={{ r: 8 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default SalesChart;
