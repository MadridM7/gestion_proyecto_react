/**
 * @fileoverview Tabla de datos para la gestión de usuarios
 */
import React from 'react';
import { Tag, Button } from 'antd';
import { UserOutlined, CalendarOutlined, PlusOutlined } from '@ant-design/icons';
import { useUsuarios } from '../../context/UsuariosContext';
import PropTypes from 'prop-types';
import DataTable from './DataTable';

/**
 * Componente organismo para la tabla de usuarios
 * @param {Object} props - Propiedades del componente
 * @returns {JSX.Element} Tabla de usuarios con funcionalidades de búsqueda y filtrado
 */
const UsuariosDataTable = ({ searchExtra, onRowClick, isMobile = false, onEdit, onAddNew }) => {
  const { usuarios } = useUsuarios();
  
  // Componente para el botón de nuevo usuario
  const AddButton = () => (
    <Button 
      type="primary" 
      icon={<PlusOutlined />}
      onClick={onAddNew}
      className="add-button"
    >
      Nuevo Usuario
    </Button>
  );
  
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
      render: (fechaRegistro) => {
        // Formatear fecha en formato DD/MM/YYYY
        const formatDate = (date) => {
          if (!date) return 'No disponible';
          const dateObj = new Date(date);
          if (isNaN(dateObj.getTime())) return 'Fecha inválida';
          
          const day = dateObj.getDate().toString().padStart(2, '0');
          const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
          const year = dateObj.getFullYear();
          return `${day}/${month}/${year}`;
        };
        
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <CalendarOutlined style={{ marginRight: 8, color: '#52c41a' }} />
            {formatDate(fechaRegistro)}
          </div>
        );
      },
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
      onRow={onRow}
      searchExtra={searchExtra || <AddButton />}
      className="usuarios-data-table"
      isMobile={isMobile}
      pagination={{ 
        showTotal: (total) => `Total: ${total} usuarios`,
        pageSize: 10, 
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50']
      }}
      scroll={{ x: 800 }}
      size="middle"
    />
  );
};

UsuariosDataTable.propTypes = {
  searchExtra: PropTypes.node,
  onRowClick: PropTypes.func,
  isMobile: PropTypes.bool
};

export default UsuariosDataTable;
