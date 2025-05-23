/**
 * @fileoverview Tabla de datos para la gestión de pedidos
 */
import React from 'react';
import { ShoppingOutlined, EnvironmentOutlined, DollarOutlined, PlusOutlined } from '@ant-design/icons';
import { Tag, Button } from 'antd';
import { usePedidos } from '../../context/PedidosContext';
import PropTypes from 'prop-types';
import DataTable from './DataTable';
import '../../styles/components/organisms/PedidosDataTable.css';

/**
 * Componente organismo para la tabla de pedidos
 * @param {Object} props - Propiedades del componente
 * @returns {JSX.Element} Tabla de pedidos con funcionalidades de búsqueda y filtrado
 */
const PedidosDataTable = ({ 
  searchExtra, 
  onRowClick, 
  isMobile = false,
  onEdit,
  onAddNew
}) => {
  const { pedidos } = usePedidos();
  
  // Componente para el botón de nuevo pedido
  const AddButton = () => (
    <Button 
      type="primary" 
      icon={<PlusOutlined />}
      onClick={onAddNew}
      className="add-button"
    >
      Nuevo Pedido
    </Button>
  );
  
  // Formateador de moneda
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  };
  
  // Columnas para la tabla
  const columns = [
    {
      title: 'Cliente',
      dataIndex: 'nombreCliente',
      key: 'nombreCliente',
      render: (nombre) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ShoppingOutlined style={{ marginRight: 8, color: '#1890ff' }} />
          {nombre}
        </div>
      ),
      sorter: (a, b) => a.nombreCliente.localeCompare(b.nombreCliente)
    },
    {
      title: 'Dirección',
      dataIndex: 'direccion',
      key: 'direccion',
      render: (direccion) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <EnvironmentOutlined style={{ marginRight: 8, color: '#722ed1' }} />
          {direccion}
        </div>
      )
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      render: (estado) => {
        const estadoConfig = {
          'pagado': { color: 'green', text: 'Pagado' },
          'por pagar': { color: 'orange', text: 'Por pagar' }
        };
        
        const { color, text } = estadoConfig[estado] || { color: 'default', text: estado };
        return <Tag color={color}>{text}</Tag>;
      },
      filters: [
        { text: 'Pagado', value: 'pagado' },
        { text: 'Por pagar', value: 'por pagar' }
      ],
      onFilter: (value, record) => record.estado === value
    },
    {
      title: 'Monto',
      dataIndex: 'monto',
      key: 'monto',
      render: (monto) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <DollarOutlined style={{ marginRight: 8, color: '#52c41a' }} />
          {formatCurrency(monto)}
        </div>
      ),
      sorter: (a, b) => a.monto - b.monto
    }
  ];
  
  return (
    <DataTable
      columns={columns}
      dataSource={pedidos}
      rowKey="id"
      searchPlaceholder="Buscar por cliente, dirección o estado..."
      searchFields={['nombreCliente', 'direccion', 'estado']}
      onRow={(record) => ({
        onClick: () => onRowClick && onRowClick(record)
      })}
      searchExtra={searchExtra || <AddButton />}
      className="pedidos-data-table"
      isMobile={isMobile}
      pagination={{
        showTotal: (total) => `Total: ${total} pedidos`,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50']
      }}
      scroll={{ x: 800 }}
      size="middle"
    />
  );
};

PedidosDataTable.propTypes = {
  searchExtra: PropTypes.node,
  onRowClick: PropTypes.func,
  isMobile: PropTypes.bool
};

export default PedidosDataTable;
