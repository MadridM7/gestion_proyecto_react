/**
 * @fileoverview Componente para mostrar estadísticas de productos
 */
import React, { useMemo } from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { ShoppingOutlined, DollarOutlined } from '@ant-design/icons';
import { useProductos } from '../../context/ProductosContext';
import '../../styles/components/organisms/ProductosStats.css';

/**
 * Componente para mostrar estadísticas de productos
 * @returns {JSX.Element} Componente de estadísticas de productos
 */
const ProductosStats = () => {
  const { productos } = useProductos();
  
  // Calcular estadísticas
  const estadisticas = useMemo(() => {
    const totalProductos = productos.length;
    
    // Calcular el valor total del inventario
    const valorInventario = productos.reduce((total, producto) => {
      // Usar precioVenta en lugar de precio
      const precioVenta = producto.precioVenta || 0;
      // Asumir stock 1 si no está definido
      const stock = producto.stock || 1;
      return total + (stock * precioVenta);
    }, 0);
    
    return {
      totalProductos,
      valorInventario
    };
  }, [productos]);
  
  return (
    <div className="productos-stats">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <Card hoverable className="stat-card">
            <Statistic 
              title="Total de Productos" 
              value={estadisticas.totalProductos} 
              prefix={<ShoppingOutlined />} 
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card hoverable className="stat-card">
            <Statistic 
              title="Valor del Inventario" 
              value={estadisticas.valorInventario}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#52c41a' }}
              formatter={(value) => `$${value.toLocaleString('es-CL')}`}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProductosStats;
