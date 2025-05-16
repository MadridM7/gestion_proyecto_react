import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Space, Popconfirm, message, Tag } from 'antd';
import { SearchOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useVentas } from '../../context/VentasContext';
import moment from 'moment';

/**
 * Componente de tabla para mostrar y gestionar las ventas
 * @returns {JSX.Element} Tabla de ventas
 */
const VentasTable = () => {
  const { ventas, eliminarVenta } = useVentas();
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState('');
  
  // Actualizar los datos filtrados cuando cambien las ventas
  useEffect(() => {
    if (Array.isArray(ventas)) {
      setFilteredData(ventas);
    } else {
      setFilteredData([]);
    }
  }, [ventas]);
  
  // Función para manejar la eliminación de una venta
  const handleDelete = (id) => {
    eliminarVenta(id);
    message.success('Venta eliminada correctamente');
  };
  
  // Función para manejar la búsqueda global
  const handleSearch = (value) => {
    setSearchText(value);
    
    if (!value) {
      setFilteredData(ventas);
      return;
    }
    
    const searchLower = value.toLowerCase();
    const filtered = ventas.filter(venta => {
      return (
        venta.id.toLowerCase().includes(searchLower) ||
        venta.vendedor.toLowerCase().includes(searchLower) ||
        venta.tipoPago.toLowerCase().includes(searchLower) ||
        venta.monto.toString().includes(searchLower)
      );
    });
    
    setFilteredData(filtered);
  };
  
  // Renderizar el color del tag según el tipo de pago
  const renderTipoPagoTag = (tipoPago) => {
    let color;
    let text;
    
    switch (tipoPago) {
      case 'efectivo':
        color = 'green';
        text = 'Efectivo';
        break;
      case 'debito':
        color = 'blue';
        text = 'Débito';
        break;
      case 'credito':
        color = 'orange';
        text = 'Crédito';
        break;
      default:
        color = 'default';
        text = tipoPago;
    }
    
    return <Tag color={color}>{text}</Tag>;
  };
  
  // Columnas para la tabla
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id.localeCompare(b.id),
      width: 100
    },
    {
      title: 'Fecha',
      dataIndex: 'fechaHora',
      key: 'fechaHora',
      render: (fechaHora) => {
        if (fechaHora instanceof Date && !isNaN(fechaHora)) {
          return moment(fechaHora).format('DD/MM/YYYY HH:mm');
        }
        return 'Fecha inválida';
      },
      sorter: (a, b) => {
        if (a.fechaHora instanceof Date && b.fechaHora instanceof Date) {
          return a.fechaHora.getTime() - b.fechaHora.getTime();
        }
        return 0;
      },
      width: 150
    },
    {
      title: 'Vendedor',
      dataIndex: 'vendedor',
      key: 'vendedor',
      sorter: (a, b) => a.vendedor.localeCompare(b.vendedor)
    },
    {
      title: 'Monto',
      dataIndex: 'monto',
      key: 'monto',
      render: (monto) => `$${monto.toLocaleString('es-CL')}`,
      sorter: (a, b) => a.monto - b.monto,
      width: 150
    },
    {
      title: 'Tipo de Pago',
      dataIndex: 'tipoPago',
      key: 'tipoPago',
      render: renderTipoPagoTag,
      filters: [
        { text: 'Efectivo', value: 'efectivo' },
        { text: 'Débito', value: 'debito' },
        { text: 'Crédito', value: 'credito' }
      ],
      onFilter: (value, record) => record.tipoPago === value,
      width: 120
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => message.info('Funcionalidad de edición en desarrollo')}
          />
          <Popconfirm
            title="¿Está seguro de eliminar esta venta?"
            onConfirm={() => handleDelete(record.id)}
            okText="Sí"
            cancelText="No"
          >
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
            />
          </Popconfirm>
        </Space>
      ),
      width: 100
    }
  ];
  
  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Input
          placeholder="Buscar ventas..."
          prefix={<SearchOutlined />}
          onChange={(e) => handleSearch(e.target.value)}
          value={searchText}
          style={{ width: 300 }}
          allowClear
        />
      </div>
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 800 }}
        size="middle"
      />
    </div>
  );
};

export default VentasTable;
