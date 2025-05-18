/**
 * @fileoverview Componente de gráfico de distribución por tipo de pago
 */
import React, { useState } from 'react';
import { Card, Radio, Space } from 'antd';
import { Cell } from 'recharts';
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
    
    console.log(`Procesando ${ventas.length} ventas para el periodo ${periodo} en gráfico de tipos de pago`);
    
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
    
    console.log(`Ventas filtradas para el periodo ${periodo}: ${ventasFiltradas.length}`);
    
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

  return (
    <Card
      title="Distribución por Tipo de Pago"
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
          <Bar
            dataKey="monto"
            name="Monto"
            radius={[4, 4, 0, 0]}
            fillOpacity={0.9}
            fill="#52c41a" // Color por defecto (no debería verse)
          >
            {procesarDatosTipoPago().map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.fill} 
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
