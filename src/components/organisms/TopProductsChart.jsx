/**
 * @fileoverview Componente de gráfico circular para mostrar los 5 productos más vendidos
 * Implementado siguiendo el patrón Atomic Design como un organismo
 */
import React, { useState, useEffect } from 'react';
import { Card, Empty, Spin, Tooltip } from 'antd';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ShoppingOutlined } from '@ant-design/icons';
// El componente recibe las ventas directamente como prop
import { formatCurrency } from '../../utils/formatters';
import '../../styles/components/dashboard/Chart.css';

// Colores para las secciones del gráfico circular
const COLORS = [
  '#0088FE', // Azul
  '#00C49F', // Verde
  '#FFBB28', // Amarillo
  '#FF8042', // Naranja
  '#8884d8', // Morado
  '#82ca9d'  // Verde claro
];

/**
 * Componente que muestra los 5 productos más vendidos en un gráfico circular
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.timeRange - Rango de tiempo seleccionado
 * @param {number} props.limit - Límite de productos a mostrar (por defecto 5)
 * @param {boolean} props.loading - Indica si está cargando los datos
 * @returns {JSX.Element} Gráfico circular de productos más vendidos
 */
const TopProductsChart = ({ ventas = [], timeRange, limit = 5, loading = false }) => {
  // Estado para almacenar los datos procesados del gráfico
  const [chartData, setChartData] = useState([]);
  // Estado para controlar la carga del componente
  const [isLoading, setIsLoading] = useState(true);
  // Estado para controlar el sector activo en el gráfico
  const [activeIndex, setActiveIndex] = useState(0);

  /**
   * Procesa los datos de ventas según el rango de tiempo seleccionado
   */
  useEffect(() => {
    console.log('TopProductsChart - ventas recibidas:', ventas?.length);
    console.log('TopProductsChart - timeRange:', timeRange);
    
    if (!ventas || !Array.isArray(ventas) || !timeRange) {
      setChartData([]);
      setIsLoading(false);
      return;
    }

    // Filtrar ventas por rango de tiempo seleccionado
    const ventasFiltradas = ventas.filter(venta => {
      if (!venta.fechaHora) return false;
      
      if (!timeRange || !timeRange.startDate || !timeRange.endDate) return true;
      
      try {
        const fechaVenta = new Date(venta.fechaHora);
        const startDate = new Date(timeRange.startDate);
        const endDate = new Date(timeRange.endDate);
        
        // Incluir ventas dentro del rango
        return fechaVenta >= startDate && fechaVenta <= endDate;
      } catch (error) {
        console.error('Error al procesar fecha:', venta.fechaHora, error);
        return false;
      }
    });
    
    console.log('TopProductsChart - Ventas filtradas:', ventasFiltradas.length);
    
    console.log('TopProductsChart - ventas filtradas:', ventasFiltradas.length);

    // Mapa para agrupar productos por nombre y sumar cantidades
    const productosMap = new Map();

    // Procesar cada venta y sus productos
    ventasFiltradas.forEach(venta => {
      if (!venta.productos || !Array.isArray(venta.productos) || venta.productos.length === 0) {
        console.log('Venta sin productos o formato incorrecto:', venta.id || venta._id);
        return;
      }
      
      // Mostrar estructura de la primera venta para depuración
      if (ventasFiltradas.indexOf(venta) === 0) {
        console.log('Estructura de productos en JSON:', venta.productos);
      }
      
      venta.productos.forEach(item => {
        // Identificar estructura del producto en el JSON
        let productoId, nombreProducto, cantidad, precioUnitario;
        
        // Para datos del JSON actual:
        // {"id":"P0001","nombre":"master","precio":13000,"cantidad":1}
        if (item.id && item.nombre) {
          productoId = item.id;
          nombreProducto = item.nombre;
          cantidad = item.cantidad || 1;
          precioUnitario = item.precio || 0;
        }
        // Para estructura alternativa donde producto es una propiedad del item
        else if (item.producto) {
          if (typeof item.producto === 'object') {
            productoId = item.producto.id || item.producto._id || JSON.stringify(item.producto);
            nombreProducto = item.producto.nombre || 'Producto sin nombre';
          } else {
            productoId = String(item.producto);
            nombreProducto = 'Producto ' + productoId;
          }
          cantidad = item.cantidad || 1;
          precioUnitario = item.precioUnitario || item.precio || 0;
        }
        // Si no se puede identificar la estructura
        else {
          console.log('Estructura de producto no reconocida:', item);
          return;
        }
        
        // Si no existe el producto en el map, lo inicializamos
        if (!productosMap.has(productoId)) {
          productosMap.set(productoId, {
            id: productoId,
            name: nombreProducto, // Usamos 'name' en lugar de 'nombre' para ser consistente con la estructura esperada por PieChart
            valor: 0,
            cantidad: 0,
            monto: 0
          });
        }
        
        // Actualizar contadores para este producto
        const producto = productosMap.get(productoId);
        producto.cantidad += cantidad;
        producto.monto += cantidad * precioUnitario;
        producto.valor = producto.cantidad; // Necesario para el gráfico circular
      });
    });
    
    console.log('TopProductsChart - Procesando productos de ventas filtradas:', ventasFiltradas.length);
    console.log('TopProductsChart - Productos encontrados:', productosMap.size);
    
    // Convertir a array, ordenar por cantidad (de mayor a menor) y limitar a los top productos
    const topProductos = Array.from(productosMap.values())
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, limit)
      .map(producto => ({
        ...producto,
        // Añadir porcentaje para visualización
        percentText: `${Math.round((producto.cantidad / Array.from(productosMap.values()).reduce((acc, curr) => acc + curr.cantidad, 0)) * 100)}%`
      }));
    
    console.log('TopProductsChart - productos procesados:', topProductos);
    
    setChartData(topProductos);
    setIsLoading(false);
  }, [ventas, timeRange, limit]);

  /**
   * Maneja el evento de mouse enter en un sector del gráfico circular
   * @param {number} index - Índice del sector
   */
  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  /**
   * Renderiza un sector activo con estilo especial
   */
  const renderActiveShape = (props) => {
    const { 
      cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, name, valor 
    } = props;
    
    return (
      <g>
        <text x={cx} y={cy - 10} dy={8} textAnchor="middle" fill="#333">
          {name}
        </text>
        <text x={cx} y={cy + 10} dy={8} textAnchor="middle" fill="#999" fontSize="12px">
          {`${valor} unid.`}
        </text>
        <Pie
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          data={chartData}
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    );
  };

  /**
   * Personaliza el tooltip del gráfico
   */
  const customTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="tooltip-title">{data.name}</p>
          <p className="tooltip-value">{data.cantidad} unidades</p>
          <p className="tooltip-amount">{formatCurrency(data.monto)}</p>
          <p className="tooltip-percent">{data.percentText}</p>
        </div>
      );
    }
    return null;
  };



  return (
    <Card 
      title="Top Productos Vendidos" 
      className="dashboard-card top-products-chart-card"
      extra={<ShoppingOutlined />}
      loading={loading}
      style={{ height: "430px" }}
    >
      {isLoading ? (
        <div className="chart-loading">
          <Spin size="large" />
        </div>
      ) : chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={330}>
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={120}
              innerRadius={60}
              dataKey="valor"
              nameKey="name"
              onMouseEnter={onPieEnter}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                />
              ))}
            </Pie>
            <Tooltip content={customTooltip} />
          </PieChart>
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

export default TopProductsChart;
