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
  
  // Función para formatear el monto en pesos chilenos
  const formatearMontoCLP = (monto) => {
    return `$${monto.toLocaleString('es-CL')}`;
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
    },
    {
      title: 'Vendedor',
      dataIndex: 'vendedor',
      key: 'vendedor',
      sorter: (a, b) => a.vendedor.localeCompare(b.vendedor),
      render: (text) => (
        <span style={{ fontWeight: 500 }}>{text}</span>
      )
    },
    {
      title: 'Monto',
      dataIndex: 'monto',
      key: 'monto',
      render: (text) => (
        <span style={{ fontWeight: 600, color: '#52c41a' }}>
          {formatearMontoCLP(text)}
        </span>
      ),
      sorter: (a, b) => a.monto - b.monto,
    },
    {
      title: 'Tipo de Pago',
      dataIndex: 'tipoPago',
      key: 'tipoPago',
      sorter: (a, b) => a.tipoPago.localeCompare(b.tipoPago),
      render: (text) => {
        let color = 'blue';
        if (text === 'efectivo') color = 'green';
        if (text === 'credito') color = 'volcano';
        if (text === 'debito') color = 'geekblue';
        
        return (
          <Tag color={color} style={{ padding: '2px 10px', borderRadius: '4px' }}>
            {text === 'efectivo' ? 'Efectivo' : 
             text === 'credito' ? 'Tarjeta de Crédito' : 
             text === 'debito' ? 'Tarjeta de Débito' : text}
          </Tag>
        );
      },
    },
    {
      title: 'Acciones',
      key: 'acciones',
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EditOutlined style={{ fontSize: '16px' }} />} 
            onClick={() => console.log('Editar venta', record.id)}
            style={{ background: '#f0f5ff', borderRadius: '4px' }}
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
              icon={<DeleteOutlined style={{ fontSize: '16px' }} />} 
              style={{ background: '#fff1f0', borderRadius: '4px' }}
            />
          </Popconfirm>
        </Space>
      ),
    },
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
