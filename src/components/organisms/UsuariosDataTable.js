/**
 * @fileoverview Tabla de datos para la gestión de usuarios
 */
import React from 'react';
import { Tag, Switch, Tooltip } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useUsuarios } from '../../context/UsuariosContext';
import PropTypes from 'prop-types';
import DataTable from './DataTable';
import ActionButtons from '../molecules/ActionButtons';
import moment from 'moment';

/**
 * Componente organismo para la tabla de usuarios
 * @param {Object} props - Propiedades del componente
 * @returns {JSX.Element} Tabla de usuarios con funcionalidades de búsqueda y filtrado
 */
const UsuariosDataTable = ({ onEdit, searchExtra }) => {
  const { usuarios, eliminarUsuario, actualizarUsuario } = useUsuarios();
  
  // Manejar cambio de estado activo/inactivo
  const handleActivoChange = (checked, record) => {
    actualizarUsuario(record.id, { activo: checked });
  };
  
  // Columnas para la tabla
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      sorter: (a, b) => a.id.localeCompare(b.id),
      responsive: ['md']
    },
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
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email)
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
      onFilter: (value, record) => record.rol === value,
      responsive: ['md']
    },
    {
      title: 'Fecha Registro',
      dataIndex: 'fechaRegistro',
      key: 'fechaRegistro',
      render: (fechaRegistro) => moment(fechaRegistro).format('DD/MM/YYYY'),
      sorter: (a, b) => new Date(a.fechaRegistro) - new Date(b.fechaRegistro),
      responsive: ['lg']
    },
    {
      title: 'Activo',
      dataIndex: 'activo',
      key: 'activo',
      render: (activo, record) => (
        <Tooltip title={activo ? 'Desactivar usuario' : 'Activar usuario'}>
          <Switch
            checked={activo}
            onChange={(checked) => handleActivoChange(checked, record)}
            checkedChildren="Activo"
            unCheckedChildren="Inactivo"
          />
        </Tooltip>
      ),
      filters: [
        { text: 'Activo', value: true },
        { text: 'Inactivo', value: false }
      ],
      onFilter: (value, record) => record.activo === value
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_, record) => (
        <ActionButtons 
          onEdit={onEdit} 
          onDelete={eliminarUsuario} 
          record={record} 
          deleteConfirmTitle="¿Estás seguro de eliminar este usuario?"
          deleteConfirmDescription="Esta acción no se puede deshacer y eliminará todos los datos asociados a este usuario."
        />
      )
    }
  ];
  
  return (
    <DataTable 
      columns={columns} 
      dataSource={usuarios} 
      loading={false}
      rowKey="id"
      searchPlaceholder="Buscar por ID, nombre, email o rol..."
      searchFields={['id', 'nombre', 'email', 'rol']}
      pagination={{ 
        pageSize: 10, 
        showSizeChanger: true, 
        showTotal: (total) => `Total: ${total} usuarios` 
      }}
      scroll={{ x: 'max-content' }}
      size="middle"
      searchExtra={searchExtra}
    />
  );
};

UsuariosDataTable.propTypes = {
  onEdit: PropTypes.func,
  searchExtra: PropTypes.node
};

export default UsuariosDataTable;
