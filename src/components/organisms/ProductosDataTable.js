/**
 * @fileoverview Tabla de datos para la gestión de productos
 */
import React from 'react';
import { ShoppingOutlined } from '@ant-design/icons';
import { useProductos } from '../../context/ProductosContext';
import PropTypes from 'prop-types';
import DataTable from './DataTable';

/**
 * Componente organismo para la tabla de productos
 * @param {Object} props - Propiedades del componente
 * @param {Node} props.searchExtra - Elementos adicionales para mostrar junto al buscador
 * @param {Function} props.onRowClick - Función para manejar el clic en una fila
 * @param {string} props.categoriaFiltro - Categoría para filtrar los productos
 * @param {boolean} props.isMobile - Indica si el componente se muestra en versión móvil
 * @returns {JSX.Element} Tabla de productos con funcionalidades de búsqueda y filtrado
 */
const ProductosDataTable = ({ searchExtra, onRowClick, categoriaFiltro, isMobile = false }) => {
  const { productos } = useProductos();
  
  // Aplicar filtro por categoría si existe
  const productosFiltrados = categoriaFiltro
    ? productos.filter(p => p.categoria === categoriaFiltro)
    : productos;
  
  // Columnas para la tabla
  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
      render: (nombre) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ShoppingOutlined style={{ marginRight: 8, color: '#1890ff' }} />
          {nombre}
        </div>
      ),
      sorter: (a, b) => a.nombre.localeCompare(b.nombre)
    },
    {
      title: 'Categoría',
      dataIndex: 'categoria',
      key: 'categoria',
      render: (categoria) => categoria || 'Sin categoría',
      sorter: (a, b) => (a.categoria || '').localeCompare(b.categoria || '')
    },
    {
      title: 'Precio',
      dataIndex: 'precioVenta',
      key: 'precioVenta',
      render: (valor) => `$${Number(valor).toLocaleString('es-CL')}`,
      sorter: (a, b) => a.precioVenta - b.precioVenta
    }
  ];
  
  // Configuración para manejar el clic en una fila
  const onRow = (record) => ({
    onClick: () => {
      if (onRowClick) {
        onRowClick(record);
      }
    },
    style: { cursor: 'pointer' }
  });

  return (
    <DataTable 
      columns={columns} 
      dataSource={productosFiltrados} 
      loading={false}
      rowKey="id"
      searchPlaceholder="Buscar por nombre o categoría..."
      searchFields={['nombre', 'categoria']}
      pagination={{ 
        pageSize: 10, 
        showSizeChanger: true, 
        showTotal: (total) => `Total: ${total} productos` 
      }}
      scroll={{ x: 'max-content' }}
      size="middle"
      searchExtra={searchExtra}
      onRow={onRow}
      className="productos-data-table"
      isMobile={isMobile}
    />
  );
};

ProductosDataTable.propTypes = {
  searchExtra: PropTypes.node,
  onRowClick: PropTypes.func,
  categoriaFiltro: PropTypes.string,
  isMobile: PropTypes.bool
};

export default ProductosDataTable;
