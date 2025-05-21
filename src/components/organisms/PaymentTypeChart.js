/**
 * @fileoverview Componente de gráfico de distribución por tipo de pago mejorado con visualización moderna
 */
import React, { useState } from 'react';
import { Card, Radio, Space } from 'antd';
import { Cell, LabelList } from 'recharts';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useVentas } from '../../context/VentasContext';
import '../../styles/components/dashboard/Chart.css';

/**
 * Componente de gráfico de barras para mostrar la distribución de ventas por tipo de pago
 * @returns {JSX.Element} Gráfico de tipos de pago
 */
const PaymentTypeChart = () => {
  const { ventas } = useVentas();
  const [periodo, setPeriodo] = useState('dia'); // 'dia', 'semana', 'mes'

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

  /**
   * Agrupa las ventas por tipo de pago y calcula los totales
   * @returns {Array} Datos procesados para el gráfico
   */
  const procesarDatosTipoPago = () => {
    // Verificar que tenemos datos de ventas del contexto
    if (!ventas || !Array.isArray(ventas)) {
      console.warn('No hay datos de ventas disponibles en el contexto');
      return [];
    }

    // Filtrar ventas según el periodo seleccionado
    let ventasFiltradas = [];
    const hoy = new Date();
    
    switch (periodo) {
      case 'dia':
        // Ventas del día actual
        ventasFiltradas = ventas.filter(venta => {
          if (!venta.fechaHora) return false;
          const fechaVenta = new Date(venta.fechaHora);
          return fechaVenta.toDateString() === hoy.toDateString();
        });
        break;
        
      case 'semana':
        // Ventas de la semana actual (lunes a domingo)
        const inicioSemana = new Date(hoy);
        // Calcular el lunes de la semana actual (día 1 = lunes, 0 = domingo)
        const diaSemana = inicioSemana.getDay();
        const diasHastaLunes = diaSemana === 0 ? 6 : diaSemana - 1; // Si es domingo, restar 6 días, sino restar (día - 1)
        inicioSemana.setDate(inicioSemana.getDate() - diasHastaLunes);
        inicioSemana.setHours(0, 0, 0, 0);
        
        // Calcular el domingo (fin de la semana)
        const finSemana = new Date(inicioSemana);
        finSemana.setDate(inicioSemana.getDate() + 6);
        finSemana.setHours(23, 59, 59, 999);
        
        ventasFiltradas = ventas.filter(venta => {
          if (!venta.fechaHora) return false;
          const fechaVenta = new Date(venta.fechaHora);
          return fechaVenta >= inicioSemana && fechaVenta <= finSemana;
        });
        break;
        
      case 'mes':
        // Ventas del último mes
        const inicioMes = new Date(hoy);
        inicioMes.setDate(hoy.getDate() - 29);
        ventasFiltradas = ventas.filter(venta => {
          if (!venta.fechaHora) return false;
          const fechaVenta = new Date(venta.fechaHora);
          return fechaVenta >= inicioMes && fechaVenta <= hoy;
        });
        break;
        
      default:
        ventasFiltradas = ventas;
    }
    
    // Calcular totales por tipo de pago para las ventas filtradas
    let totalEfectivo = 0;
    let totalDebito = 0;
    let totalCredito = 0;
    
    ventasFiltradas.forEach(venta => {
      // Verificar que la venta tiene tipo de pago y monto válidos
      if (!venta.tipoPago || typeof venta.monto !== 'number') {
        return; // Saltar esta venta si no tiene datos válidos
      }
      
      const tipoPago = venta.tipoPago.toLowerCase();
      if (tipoPago === 'efectivo') {
        totalEfectivo += venta.monto;
      } else if (tipoPago === 'debito') {
        totalDebito += venta.monto;
      } else if (tipoPago === 'credito') {
        totalCredito += venta.monto;
      }
    });
    
    // Crear el array de datos con colores específicos para cada tipo de pago
    return [
      { name: 'Efectivo', monto: totalEfectivo, fill: '#52c41a' }, // Verde
      { name: 'Débito', monto: totalDebito, fill: '#1890ff' },    // Azul
      { name: 'Crédito', monto: totalCredito, fill: '#fa8c16' }   // Naranja
    ];
  };

  /**
   * Componente personalizado para el tooltip del gráfico
   */
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const color = payload[0].payload.fill;
      return (
        <div className="custom-tooltip payment-tooltip">
          <p className="tooltip-title">{`${label}`}</p>
          <div className="tooltip-content">
            <div className="tooltip-item">
              <div className="tooltip-indicator" style={{ backgroundColor: color }}></div>
              <span className="tooltip-name">Total:</span>
              <span className="tooltip-amount">{formatCLP(payload[0].value)}</span>
            </div>
            <div className="tooltip-percentage">
              {Math.round((payload[0].value / totalVentas) * 100)}% del total
            </div>
          </div>
        </div>
      );
    }
    return null;
  };
  
  // Calcular el total de ventas para los porcentajes
  const datos = procesarDatosTipoPago();
  const totalVentas = datos.reduce((sum, item) => sum + item.monto, 0);

  // Función para formatear etiquetas de porcentaje
  const renderCustomizedLabel = (props) => {
    const { x, y, width, height, value } = props;
    const percentage = Math.round((value / totalVentas) * 100);
    
    // Solo mostrar etiqueta si el porcentaje es significativo
    if (percentage < 3) return null;
    
    return (
      <g>
        <text 
          x={x + width / 2} 
          y={y + height / 2} 
          fill="#FFFFFF" 
          textAnchor="middle" 
          dominantBaseline="middle" 
          fontWeight="bold"
          fontSize="14"
        >
          {`${percentage}%`}
        </text>
        <text 
          x={x + width / 2} 
          y={y + height / 2 + 20} 
          fill="#FFFFFF" 
          textAnchor="middle" 
          dominantBaseline="middle" 
          fontSize="12"
          opacity="0.9"
        >
          {formatCLP(value)}
        </text>
      </g>
    );
  };

  return (
    <Card
      title="Distribución por Tipo de Pago"
      className="chart-card payment-chart-card"
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
        <BarChart
          data={datos}
          margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
          barSize={80}
          barGap={4}
        >
          <defs>
            {datos.map((entry, index) => (
              <linearGradient key={`gradient-${index}`} id={`colorGradient${index}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={entry.fill} stopOpacity={0.8}/>
                <stop offset="100%" stopColor={entry.fill} stopOpacity={1}/>
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
          <XAxis
            dataKey="name"
            axisLine={{ stroke: '#E0E0E0' }}
            tickLine={false}
            tick={{ fill: '#666666', fontSize: 12, fontWeight: 'bold' }}
          />
          <YAxis
            tickFormatter={formatCLP}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#666666', fontSize: 12 }}
          />
          <Tooltip 
            content={<CustomTooltip />} 
            cursor={{ fill: 'rgba(240, 240, 240, 0.3)' }}
          />
          <Bar
            dataKey="monto"
            name="Monto por tipo de pago"
            radius={[6, 6, 0, 0]}
          >
            <LabelList 
              dataKey="monto" 
              position="center" 
              content={renderCustomizedLabel}
            />
            {datos.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={`url(#colorGradient${index})`}
                className={`payment-type-cell-${index}`}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default PaymentTypeChart;
