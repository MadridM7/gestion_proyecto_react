/**
 * @fileoverview Tabla de datos para la gestión de productos
 */
import React from 'react';
import { ShoppingOutlined } from '@ant-design/icons';
import { useProductos } from '../../context/ProductosContext';
import PropTypes from 'prop-types';
import DataTable from './DataTable';
import ActionButtons from '../molecules/ActionButtons';

/**
 * Componente organismo para la tabla de productos
 * @param {Object} props - Propiedades del componente
 * @returns {JSX.Element} Tabla de productos con funcionalidades de búsqueda y filtrado
 */
const ProductosDataTable = ({ onEdit, searchExtra }) => {
  const { productos, eliminarProducto } = useProductos();
  
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
      title: 'Precio Compra',
      dataIndex: 'precioCompra',
      key: 'precioCompra',
      render: (valor) => `$${valor.toLocaleString('es-CL')}`,
      sorter: (a, b) => a.precioCompra - b.precioCompra
    },
    {
      title: 'Margen',
      dataIndex: 'margenGanancia',
      key: 'margenGanancia',
      render: (valor) => `${valor}%`,
      sorter: (a, b) => a.margenGanancia - b.margenGanancia
    },
    {
      title: 'Precio Venta',
      dataIndex: 'precioVenta',
      key: 'precioVenta',
      render: (valor) => `$${valor.toLocaleString('es-CL')}`,
      sorter: (a, b) => a.precioVenta - b.precioVenta
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_, record) => (
        <ActionButtons 
          onEdit={onEdit} 
          onDelete={eliminarProducto} 
          record={record} 
          deleteConfirmTitle="¿Estás seguro de eliminar este producto?"
          deleteConfirmDescription="Esta acción no se puede deshacer y eliminará todos los datos asociados a este producto."
        />
      )
    }
  ];
  
  return (
    <DataTable 
      columns={columns} 
      dataSource={productos} 
      loading={false}
      rowKey="id"
      searchPlaceholder="Buscar por nombre, categoría o etiquetas..."
      searchFields={['nombre', 'categoria', 'etiquetas']}
      pagination={{ 
        pageSize: 10, 
        showSizeChanger: true, 
        showTotal: (total) => `Total: ${total} productos` 
      }}
      scroll={{ x: 'max-content' }}
      size="middle"
      searchExtra={searchExtra}
    />
  );
};

ProductosDataTable.propTypes = {
  onEdit: PropTypes.func,
  searchExtra: PropTypes.node
};

export default ProductosDataTable;
