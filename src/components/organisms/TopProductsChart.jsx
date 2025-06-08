/**
 * @fileoverview Componente de gráfico circular para mostrar los productos más vendidos
 * Implementado siguiendo el patrón Atomic Design como un organismo
 * Optimizado para visualización en dispositivos móviles
 */
import React, { useState, useEffect } from 'react';
import { Card, Empty, Spin, Tooltip, List } from 'antd';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { ShoppingOutlined } from '@ant-design/icons';
// El componente recibe las ventas directamente como prop
import { formatCurrency } from '../../utils/formatters';
import '../../styles/components/dashboard/Chart.css';
import '../../styles/components/organisms/TopProductsChart.css';

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
 * Componente que muestra los productos más vendidos en un gráfico circular
 * Optimizado para visualización móvil con detección automática si no se proporciona la prop isMobile
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.ventas - Lista de ventas para procesar
 * @param {Object} props.timeRange - Rango de tiempo seleccionado
 * @param {number} props.limit - Límite de productos a mostrar (por defecto 5)
 * @param {boolean} props.loading - Indica si está cargando los datos
 * @param {boolean} props.isMobile - Opcional, indica si es dispositivo móvil (si no se proporciona, se detecta automáticamente)
 * @returns {JSX.Element} Gráfico circular de productos más vendidos adaptado al dispositivo
 */
const TopProductsChart = ({ ventas = [], timeRange, limit = 5, loading = false, isMobile: propIsMobile }) => {
  // Estado para almacenar los datos procesados del gráfico
  const [chartData, setChartData] = useState([]);
  // Estado para controlar la carga del componente
  const [isLoading, setIsLoading] = useState(true);
  // Estado para controlar el sector activo en el gráfico
  const [activeIndex, setActiveIndex] = useState(0);
  // Estado para detectar si es dispositivo móvil (solo se usa si no se proporciona la prop)
  const [localIsMobile, setLocalIsMobile] = useState(false);
  
  // Usar la prop isMobile si se proporciona, de lo contrario usar el estado local
  const isMobile = propIsMobile !== undefined ? propIsMobile : localIsMobile;
  
  // Detectar si es dispositivo móvil al cargar y al cambiar el tamaño de la ventana (solo si no hay prop)
  useEffect(() => {
    // Si ya tenemos la prop, no necesitamos detectar el tamaño de la ventana
    if (propIsMobile !== undefined) return;
    
    const checkIfMobile = () => {
      setLocalIsMobile(window.innerWidth <= 768);
    };
    
    // Verificar al cargar el componente
    checkIfMobile();
    
    // Verificar al cambiar el tamaño de la ventana
    window.addEventListener('resize', checkIfMobile);
    
    // Limpiar el event listener al desmontar el componente
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, [propIsMobile]);

  /**
   * Procesa los datos de ventas según el rango de tiempo seleccionado
   */
  useEffect(() => {
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

    // Mapa para agrupar productos por nombre y sumar cantidades
    const productosMap = new Map();

    // Procesar cada venta y sus productos
    ventasFiltradas.forEach(venta => {
      // Cada venta puede tener múltiples productos
      if (venta.productos && Array.isArray(venta.productos)) {
        venta.productos.forEach(producto => {
          const {
            id: productoId = 'desconocido',
            nombre: nombreProducto = 'Producto desconocido',
            cantidad = 1,
            precioUnitario = 0
          } = producto;
          
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
          const productoActual = productosMap.get(productoId);
          productoActual.cantidad += cantidad;
          productoActual.monto += cantidad * precioUnitario;
          productoActual.valor = productoActual.cantidad; // Necesario para el gráfico circular
        });
      }
    });
    
    // Convertir a array, ordenar por cantidad (de mayor a menor) y limitar a los top productos
    const topProductos = Array.from(productosMap.values())
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, limit)
      .map(producto => ({
        ...producto,
        // Añadir porcentaje para visualización
        percentText: `${Math.round((producto.cantidad / Array.from(productosMap.values()).reduce((acc, curr) => acc + curr.cantidad, 0)) * 100)}%`
      }));
    
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
    const RADIAN = Math.PI / 180;
    const { 
      cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
      fill, payload, percent, valor
    } = props;
    
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g>
        <Tooltip />
        <text x={cx} y={cy} dy={-20} textAnchor="middle" fill={fill} fontSize="16px" fontWeight="bold">
          {payload.name}
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

  // Renderiza la vista de gráfico o lista según el dispositivo
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="chart-loading">
          <Spin size="large" />
        </div>
      );
    }
    
    if (chartData.length === 0) {
      return (
        <Empty
          description="No hay datos disponibles" 
          image={Empty.PRESENTED_IMAGE_SIMPLE} 
          className="chart-empty"
        />
      );
    }
    
    // Vista de dispositivos móviles: mostrar una lista en lugar del gráfico
    if (isMobile) {
      return (
        <div className="mobile-products-list">
          <List
            dataSource={chartData}
            renderItem={(item, index) => (
              <List.Item className="mobile-product-item">
                <div className="product-color-indicator" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <div className="product-details">
                  <div className="product-name">{item.name}</div>
                  <div className="product-stats">
                    <span className="product-quantity">{item.cantidad} unidades</span>
                    <span className="product-amount">{formatCurrency(item.monto)}</span>
                    <span className="product-percent">{item.percentText}</span>
                  </div>
                </div>
              </List.Item>
            )}
          />
        </div>
      );
    }
    
    // Vista de escritorio: mostrar el gráfico circular
    return (
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
                stroke="none"
              />
            ))}
          </Pie>
          <Tooltip content={customTooltip} />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  return (
    <Card 
      title="Top Productos Vendidos" 
      className={`dashboard-card top-products-chart-card ${isMobile ? 'mobile-card' : ''}`}
      extra={<ShoppingOutlined />}
      loading={loading}
      style={{ height: isMobile ? "auto" : "430px" }}
      bodyStyle={{ padding: isMobile ? '12px' : '24px' }}
    >
      {renderContent()}
    </Card>
  );
};

export default TopProductsChart;
