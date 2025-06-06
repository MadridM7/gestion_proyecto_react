/**
 * @fileoverview Tabla de datos para la gestión de ventas
 */
import React from 'react';
import { UserOutlined, PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useVentas } from '../../context/VentasContext';
import PropTypes from 'prop-types';
import DataTable from './DataTable';
import { formatDateTime, formatCurrency } from '../../utils/formatters';
import '../../styles/components/organisms/VentasDataTable.css';

/**
 * Componente organismo para la tabla de ventas
 * @param {Object} props - Propiedades del componente
 * @param {Node} props.searchExtra - Elementos adicionales para mostrar junto al buscador
 * @param {Function} props.onRowClick - Función para manejar el clic en una fila
 * @param {string} props.vendedorFiltro - Vendedor para filtrar las ventas
 * @param {boolean} props.isMobile - Indica si el componente se muestra en versión móvil
 * @returns {JSX.Element} Tabla de ventas con funcionalidades de búsqueda y filtrado
 */
const VentasDataTable = ({ 
  searchExtra, 
  onRowClick, 
  vendedorFiltro,
  isMobile = false,
  onEdit,
  onAddNew
}) => {
  const { ventas } = useVentas();
  
  // Componente para el botón de nueva venta
  const AddButton = () => (
    <Button 
      type="primary" 
      icon={<PlusOutlined />}
      onClick={onAddNew}
      className="add-button"
    >
      Nueva Venta
    </Button>
  );
  
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
      render: (monto) => formatCurrency(monto),
      sorter: (a, b) => a.monto - b.monto
    },
    {
      title: 'Fecha',
      dataIndex: 'fechaHora',
      key: 'fechaHora',
      render: (fechaHora) => {
        // Formatear fecha y hora utilizando la utilidad formatDateTime
        return formatDateTime(fechaHora) || 'No disponible';
      },
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

  // Si tenemos searchExtra y estamos en móvil, combinamos el filtro con el botón
  const combinedSearchExtra = searchExtra && isMobile ? (
    <div className="ventas-mobile-actions">
      {searchExtra}
      <AddButton />
    </div>
  ) : (searchExtra || <AddButton />);

  return (
    <DataTable 
      columns={columns} 
      dataSource={ventasFiltradas} 
      loading={false}
      rowKey="id"
      searchPlaceholder="Buscar por vendedor o monto..."
      searchFields={['vendedor', 'monto']}
      onRow={onRow}
      searchExtra={combinedSearchExtra}
      className="ventas-data-table"
      isMobile={isMobile}
      pagination={{ 
        showTotal: (total) => `Total: ${total} ventas`,
        pageSize: 10, 
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50']
      }}
      scroll={{ x: 800 }}
      size="middle"
    />
  );
};

VentasDataTable.propTypes = {
  searchExtra: PropTypes.node,
  onRowClick: PropTypes.func,
  showTitle: PropTypes.bool,
  vendedorFiltro: PropTypes.string,
  isMobile: PropTypes.bool,
  onEdit: PropTypes.func,
  onAddNew: PropTypes.func
};

export default VentasDataTable;
