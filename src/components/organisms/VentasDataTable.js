/**
 * @fileoverview Tabla de datos para la gestión de ventas
 */
import React, { useState, useEffect } from 'react';
import { Table, Space } from 'antd';
import { useVentas } from '../../context/VentasContext';
import moment from 'moment';
import SearchInput from '../atoms/SearchInput';
import StatusTag from '../atoms/StatusTag';
import ActionButtons from '../molecules/ActionButtons';
import PropTypes from 'prop-types';

/**
 * Componente organismo para la tabla de ventas
 * @param {Object} props - Propiedades del componente
 * @returns {JSX.Element} Tabla de ventas con funcionalidades de búsqueda y filtrado
 */
const VentasDataTable = ({ onEdit }) => {
  const { ventas, eliminarVenta } = useVentas();
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading] = useState(false);
  
  // Actualizar los datos filtrados cuando cambien las ventas
  useEffect(() => {
    if (Array.isArray(ventas)) {
      setFilteredData(ventas);
    } else {
      setFilteredData([]);
    }
  }, [ventas]);
  
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
  
  // Definición de columnas de la tabla
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id.localeCompare(b.id),
      responsive: ['md']
    },
    {
      title: 'Fecha',
      dataIndex: 'fechaHora',
      key: 'fechaHora',
      render: (fechaHora) => moment(fechaHora).format('DD/MM/YYYY HH:mm'),
      sorter: (a, b) => new Date(a.fechaHora) - new Date(b.fechaHora),
      defaultSortOrder: 'descend'
    },
    {
      title: 'Vendedor',
      dataIndex: 'vendedor',
      key: 'vendedor',
      sorter: (a, b) => a.vendedor.localeCompare(b.vendedor)
    },
    {
      title: 'Tipo de Pago',
      dataIndex: 'tipoPago',
      key: 'tipoPago',
      render: (tipoPago) => {
        const statusMap = {
          'Efectivo': { status: 'success', text: 'Efectivo' },
          'Tarjeta': { status: 'processing', text: 'Tarjeta' },
          'Transferencia': { status: 'default', text: 'Transferencia' }
        };
        
        const { status, text } = statusMap[tipoPago] || { status: 'default', text: tipoPago };
        return <StatusTag status={status} text={text} />;
      },
      responsive: ['md']
    },
    {
      title: 'Monto',
      dataIndex: 'monto',
      key: 'monto',
      render: (monto) => `$${monto.toLocaleString('es-CL')}`,
      sorter: (a, b) => a.monto - b.monto
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_, record) => (
        <ActionButtons 
          onEdit={onEdit} 
          onDelete={eliminarVenta} 
          record={record} 
        />
      )
    }
  ];
  
  return (
    <div className="ventas-table-container">
      <Space direction="vertical" style={{ width: '100%', marginBottom: 16 }}>
        <SearchInput 
          placeholder="Buscar por ID, vendedor, tipo de pago o monto..." 
          value={searchText} 
          onChange={handleSearch} 
        />
      </Space>
      
      <Table 
        columns={columns} 
        dataSource={filteredData} 
        rowKey="id" 
        loading={loading}
        pagination={{ 
          pageSize: 10, 
          showSizeChanger: true, 
          showTotal: (total) => `Total: ${total} ventas` 
        }}
        scroll={{ x: 'max-content' }}
        size="middle"
      />
    </div>
  );
};

VentasDataTable.propTypes = {
  onEdit: PropTypes.func
};

export default VentasDataTable;
