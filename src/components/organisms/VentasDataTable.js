/**
 * @fileoverview Tabla de datos para la gestión de ventas
 */
import React from 'react';
import { UserOutlined } from '@ant-design/icons';
import { useVentas } from '../../context/VentasContext';
import moment from 'moment';
import PropTypes from 'prop-types';
import DataTable from './DataTable';
import '../../styles/components/organisms/VentasDataTable.css';

/**
 * Componente organismo para la tabla de ventas
 * @param {Object} props - Propiedades del componente
 * @param {Node} props.searchExtra - Elementos adicionales para mostrar junto al buscador
 * @param {Function} props.onRowClick - Función para manejar el clic en una fila
 * @param {string} props.vendedorFiltro - Vendedor para filtrar las ventas
 * @returns {JSX.Element} Tabla de ventas con funcionalidades de búsqueda y filtrado
 */
const VentasDataTable = ({ 
  searchExtra, 
  onRowClick, 
  vendedorFiltro
}) => {
  const { ventas } = useVentas();
  
  // Aplicar filtro por vendedor si existe
  const ventasFiltradas = vendedorFiltro
    ? ventas.filter(v => v.vendedor === vendedorFiltro)
    : ventas;
  
  // Definición de columnas de la tabla (simplificada a solo vendedor, monto y fecha)
  const columns = [
    {
      title: 'Vendedor',
      dataIndex: 'vendedor',
      key: 'vendedor',
      render: (vendedor) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <UserOutlined style={{ marginRight: 8, color: '#1890ff' }} />
          {vendedor}
        </div>
      ),
      sorter: (a, b) => a.vendedor.localeCompare(b.vendedor)
    },
    {
      title: 'Monto',
      dataIndex: 'monto',
      key: 'monto',
      render: (monto) => `$${Number(monto).toLocaleString('es-CL')}`,
      sorter: (a, b) => a.monto - b.monto
    },
    {
      title: 'Fecha',
      dataIndex: 'fechaHora',
      key: 'fechaHora',
      render: (fechaHora) => moment(fechaHora).format('DD/MM/YYYY HH:mm'),
      sorter: (a, b) => new Date(a.fechaHora) - new Date(b.fechaHora),
      defaultSortOrder: 'descend'
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
      dataSource={ventasFiltradas} 
      loading={false}
      rowKey="id"
      searchPlaceholder="Buscar por vendedor o monto..."
      searchFields={['vendedor', 'monto']}
      pagination={{ 
        pageSize: 10, 
        showSizeChanger: true, 
        showTotal: (total) => `Total: ${total} ventas` 
      }}
      scroll={{ x: 'max-content' }}
      size="middle"
      searchExtra={searchExtra}
      onRow={onRow}
      className="ventas-data-table"
    />
  );
};

VentasDataTable.propTypes = {
  searchExtra: PropTypes.node,
  onRowClick: PropTypes.func,
  showTitle: PropTypes.bool,
  vendedorFiltro: PropTypes.string
};

export default VentasDataTable;
