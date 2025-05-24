/**
 * @fileoverview Tabla de datos para la gestión de productos
 */
import React from 'react';
import { ShoppingOutlined, PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useProductos } from '../../context/ProductosContext';
import PropTypes from 'prop-types';
import DataTable from './DataTable';
import '../../styles/components/organisms/ProductosDataTable.css';

/**
 * Componente organismo para la tabla de productos
 * @param {Object} props - Propiedades del componente
 * @param {Node} props.searchExtra - Elementos adicionales para mostrar junto al buscador
 * @param {Function} props.onRowClick - Función para manejar el clic en una fila
 * @param {string} props.categoriaFiltro - Categoría para filtrar los productos
 * @param {boolean} props.isMobile - Indica si el componente se muestra en versión móvil
 * @returns {JSX.Element} Tabla de productos con funcionalidades de búsqueda y filtrado
 */
const ProductosDataTable = ({ searchExtra, onRowClick, categoriaFiltro, isMobile = false, onEdit, onAddNew }) => {
  const { productos } = useProductos();
  
  // Componente para el botón de nuevo producto
  const AddButton = () => (
    <Button 
      type="primary" 
      icon={<PlusOutlined />}
      onClick={onAddNew}
      className="add-button"
      style={{ marginLeft: '10px', marginBottom: isMobile ? '10px' : '0' }}
    >
      Nuevo Producto
    </Button>
  );
  
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

  // Si tenemos searchExtra y estamos en móvil, combinamos el filtro con el botón
  const combinedSearchExtra = isMobile ? (
    <div className="productos-mobile-actions">
      {searchExtra}
      <AddButton />
    </div>
  ) : (
    <div className="productos-desktop-actions">
      {searchExtra}
      <AddButton />
    </div>
  );

  return (
    <DataTable 
      columns={columns} 
      dataSource={productosFiltrados} 
      loading={false}
      rowKey="id"
      searchPlaceholder="Buscar por nombre o categoría..."
      searchFields={['nombre', 'categoria']}
      onRow={onRow}
      searchExtra={combinedSearchExtra}
      className="productos-data-table"
      isMobile={isMobile}
      pagination={{ 
        showTotal: (total) => `Total: ${total} productos`,
        pageSize: 10, 
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50']
      }}
      scroll={{ x: 800 }}
      size="middle"
    />
  );
};

ProductosDataTable.propTypes = {
  searchExtra: PropTypes.node,
  onRowClick: PropTypes.func,
  categoriaFiltro: PropTypes.string,
  isMobile: PropTypes.bool,
  onEdit: PropTypes.func,
  onAddNew: PropTypes.func
};

export default ProductosDataTable;
