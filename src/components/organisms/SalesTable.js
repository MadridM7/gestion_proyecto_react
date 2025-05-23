/**
 * @fileoverview Tabla de ventas para la sección de reportes
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Table, Card, Input, Button, Space } from 'antd';
import { SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import moment from 'moment';
import 'moment/locale/es';

// Configurar moment para usar español
moment.locale('es');

/**
 * Componente organismo que muestra una tabla de ventas con filtros y opciones de descarga
 * @param {Object} props - Propiedades del componente
 * @returns {JSX.Element} Tabla de ventas con funcionalidades avanzadas
 */
const SalesTable = ({ 
  ventas, 
  usuarios, 
  productos,
  loading,
  onDownload
}) => {
  // Estado para la paginación
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '50', '100'],
    showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} ventas`
  });

  // Función para formatear el monto como moneda chilena (CLP)
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Función para obtener el nombre del vendedor
  const getVendedorNombre = (vendedorId) => {
    const vendedor = usuarios.find(u => u.id === vendedorId);
    return vendedor ? vendedor.nombre : 'Desconocido';
  };

  // Función para obtener la categoría del producto
  const getProductoCategoria = (nombreProducto) => {
    const producto = productos.find(p => p.nombre === nombreProducto);
    return producto ? producto.categoria : 'No especificada';
  };

  // Función para calcular la ganancia
  const calcularGanancia = (venta) => {
    const producto = productos.find(p => p.nombre === venta.producto);
    if (!producto) return 0;
    
    const precioCompra = producto.precioCompra || 0;
    return venta.monto - precioCompra;
  };

  // Función para manejar cambios en la paginación
  const handleTableChange = (pagination, filters, sorter) => {
    setPagination(prev => ({
      ...prev,
      current: pagination.current,
      pageSize: pagination.pageSize
    }));
  };

  // Definición de columnas
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      sorter: (a, b) => a.id.localeCompare(b.id),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Buscar ID"
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Buscar
            </Button>
            <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
              Resetear
            </Button>
          </Space>
        </div>
      ),
      filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
      onFilter: (value, record) => record.id.toLowerCase().includes(value.toLowerCase())
    },
    {
      title: 'Producto',
      dataIndex: 'producto',
      key: 'producto',
      sorter: (a, b) => a.producto.localeCompare(b.producto),
      filters: [...new Set(ventas.map(v => v.producto))].map(producto => ({
        text: producto,
        value: producto
      })),
      onFilter: (value, record) => record.producto === value
    },
    {
      title: 'Categoría',
      key: 'categoria',
      render: (_, record) => getProductoCategoria(record.producto),
      filters: [...new Set(productos.map(p => p.categoria))].map(categoria => ({
        text: categoria,
        value: categoria
      })),
      onFilter: (value, record) => getProductoCategoria(record.producto) === value
    },
    {
      title: 'Monto',
      dataIndex: 'monto',
      key: 'monto',
      render: (monto) => formatCurrency(monto),
      sorter: (a, b) => a.monto - b.monto
    },
    {
      title: 'Ganancia',
      key: 'ganancia',
      render: (_, record) => formatCurrency(calcularGanancia(record)),
      sorter: (a, b) => calcularGanancia(a) - calcularGanancia(b)
    },
    {
      title: 'Tipo de Pago',
      dataIndex: 'tipoPago',
      key: 'tipoPago',
      render: (tipoPago) => tipoPago.charAt(0).toUpperCase() + tipoPago.slice(1),
      filters: [...new Set(ventas.map(v => v.tipoPago))].map(tipo => ({
        text: tipo.charAt(0).toUpperCase() + tipo.slice(1),
        value: tipo
      })),
      onFilter: (value, record) => record.tipoPago === value
    },
    {
      title: 'Vendedor',
      key: 'vendedor',
      render: (_, record) => getVendedorNombre(record.vendedorId),
      filters: usuarios.map(u => ({
        text: u.nombre,
        value: u.id
      })),
      onFilter: (value, record) => record.vendedorId === value
    },
    {
      title: 'Fecha',
      key: 'fecha',
      render: (_, record) => moment(record.fechaHora).format('DD/MM/YYYY'),
      sorter: (a, b) => new Date(a.fechaHora) - new Date(b.fechaHora),
      defaultSortOrder: 'descend'
    },
    {
      title: 'Hora',
      key: 'hora',
      render: (_, record) => moment(record.fechaHora).format('HH:mm'),
      sorter: (a, b) => {
        const timeA = moment(a.fechaHora).format('HH:mm');
        const timeB = moment(b.fechaHora).format('HH:mm');
        return timeA.localeCompare(timeB);
      }
    }
  ];

  return (
    <Card 
      title="Detalle de Ventas" 
      className="sales-table-card"
      extra={
        <Button 
          type="primary" 
          icon={<DownloadOutlined />} 
          onClick={onDownload}
          disabled={ventas.length === 0}
        >
          Exportar
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={ventas}
        rowKey="id"
        pagination={pagination}
        onChange={handleTableChange}
        loading={loading}
        scroll={{ x: 'max-content' }}
        size="middle"
        bordered
      />
    </Card>
  );
};

SalesTable.propTypes = {
  ventas: PropTypes.arrayOf(PropTypes.object).isRequired,
  usuarios: PropTypes.arrayOf(PropTypes.object).isRequired,
  productos: PropTypes.arrayOf(PropTypes.object).isRequired,
  loading: PropTypes.bool,
  onDownload: PropTypes.func.isRequired
};

SalesTable.defaultProps = {
  loading: false
};

export default SalesTable;
