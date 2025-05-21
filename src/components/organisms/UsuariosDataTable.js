/**
 * @fileoverview Tabla de datos para la gestión de usuarios
 */
import React from 'react';
import { Tag } from 'antd';
import { UserOutlined, CalendarOutlined } from '@ant-design/icons';
import { useUsuarios } from '../../context/UsuariosContext';
import PropTypes from 'prop-types';
import DataTable from './DataTable';
import moment from 'moment';

/**
 * Componente organismo para la tabla de usuarios
 * @param {Object} props - Propiedades del componente
 * @returns {JSX.Element} Tabla de usuarios con funcionalidades de búsqueda y filtrado
 */
const UsuariosDataTable = ({ searchExtra, onRowClick, isMobile = false }) => {
  const { usuarios } = useUsuarios();
  
  // Columnas para la tabla (simplificadas a nombre, rol y fecha registro)
  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
      render: (nombre) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <UserOutlined style={{ marginRight: 8, color: '#1890ff' }} />
          {nombre}
        </div>
      ),
      sorter: (a, b) => a.nombre.localeCompare(b.nombre)
    },
    {
      title: 'Rol',
      dataIndex: 'rol',
      key: 'rol',
      render: (rol) => {
        const rolConfig = {
          'admin': { color: 'red', text: 'Administrador' },
          'vendedor': { color: 'green', text: 'Vendedor' },
          'supervisor': { color: 'blue', text: 'Supervisor' }
        };
        
        const { color, text } = rolConfig[rol] || { color: 'default', text: rol };
        return <Tag color={color}>{text}</Tag>;
      },
      filters: [
        { text: 'Administrador', value: 'admin' },
        { text: 'Vendedor', value: 'vendedor' },
        { text: 'Supervisor', value: 'supervisor' }
      ],
      onFilter: (value, record) => record.rol === value
    },
    {
      title: 'Fecha Registro',
      dataIndex: 'fechaRegistro',
      key: 'fechaRegistro',
      render: (fechaRegistro) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <CalendarOutlined style={{ marginRight: 8, color: '#52c41a' }} />
          {moment(fechaRegistro).format('DD/MM/YYYY')}
        </div>
      ),
      sorter: (a, b) => new Date(a.fechaRegistro) - new Date(b.fechaRegistro)
    }
  ];
  
  // Configuración para hacer las filas clickeables
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
      dataSource={usuarios} 
      loading={false}
      rowKey="id"
      searchPlaceholder="Buscar por nombre o rol..."
      searchFields={['nombre', 'rol']}
      pagination={{ 
        pageSize: 10, 
        showSizeChanger: true, 
        showTotal: (total) => `Total: ${total} usuarios` 
      }}
      scroll={{ x: 'max-content' }}
      size="middle"
      searchExtra={searchExtra}
      onRow={onRow}
      rowClassName="clickable-row"
    />
  );
};

UsuariosDataTable.propTypes = {
  searchExtra: PropTypes.node,
  onRowClick: PropTypes.func,
  isMobile: PropTypes.bool
};

export default UsuariosDataTable;
