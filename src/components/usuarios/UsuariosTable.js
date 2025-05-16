import React, { useState } from 'react';
import { Table, Button, Tag, Space, Popconfirm, Switch, Badge, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { useUsuarios } from '../../context/UsuariosContext';
import moment from 'moment';

/**
 * Componente para mostrar la tabla de usuarios
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.onEdit - Función para editar un usuario
 * @returns {JSX.Element} Tabla de usuarios
 */
const UsuariosTable = ({ onEdit }) => {
  const { usuarios, eliminarUsuario, actualizarUsuario } = useUsuarios();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  
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
      sorter: (a, b) => a.nombre.localeCompare(b.nombre),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: 'Rol',
      dataIndex: 'rol',
      key: 'rol',
      render: (rol) => {
        let color;
        switch (rol) {
          case 'Administrador':
            color = 'red';
            break;
          case 'Supervisor':
            color = 'blue';
            break;
          default:
            color = 'green';
        }
        return <Tag color={color}>{rol}</Tag>;
      },
      filters: [
        { text: 'Administrador', value: 'Administrador' },
        { text: 'Supervisor', value: 'Supervisor' },
        { text: 'Vendedor', value: 'Vendedor' },
      ],
      onFilter: (value, record) => record.rol === value,
    },
    {
      title: 'Estado',
      dataIndex: 'activo',
      key: 'activo',
      render: (activo, record) => (
        <Space>
          <Switch 
            checked={activo} 
            onChange={(checked) => handleActivoChange(checked, record)} 
            size="small"
          />
          <Badge 
            status={activo ? 'success' : 'error'} 
            text={activo ? 'Activo' : 'Inactivo'} 
          />
        </Space>
      ),
      filters: [
        { text: 'Activo', value: true },
        { text: 'Inactivo', value: false },
      ],
      onFilter: (value, record) => record.activo === value,
    },
    {
      title: 'Fecha Registro',
      dataIndex: 'fechaRegistro',
      key: 'fechaRegistro',
      render: (fechaRegistro) => moment(fechaRegistro).format('DD/MM/YYYY'),
      sorter: (a, b) => new Date(a.fechaRegistro) - new Date(b.fechaRegistro),
    },
    {
      title: 'Acciones',
      key: 'acciones',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Editar">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => onEdit(record)} 
              size="small"
            />
          </Tooltip>
          <Popconfirm
            title="¿Estás seguro de eliminar este usuario?"
            onConfirm={() => eliminarUsuario(record.id)}
            okText="Sí"
            cancelText="No"
          >
            <Tooltip title="Eliminar">
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />} 
                size="small"
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  
  // Opciones para selección de filas
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
  };
  
  return (
    <Table
      rowSelection={rowSelection}
      columns={columns}
      dataSource={usuarios.map(usuario => ({ ...usuario, key: usuario.id }))}
      pagination={{ pageSize: 10 }}
      size="middle"
      scroll={{ x: 800 }}
    />
  );
};

export default UsuariosTable;
