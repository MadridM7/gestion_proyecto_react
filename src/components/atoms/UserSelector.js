/**
 * @fileoverview Selector de usuario para reportes
 */
import React from 'react';
import { Select, Form, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

/**
 * Componente atómico para selección de usuarios
 * @param {Object} props - Propiedades del componente
 * @returns {JSX.Element} Selector de usuario
 */
const UserSelector = ({ 
  label, 
  onChange, 
  usuarios, 
  placeholder = "Selecciona un usuario" 
}) => {
  return (
    <Form.Item label={label} name="user">
      <Select
        style={{ width: '100%' }}
        placeholder={placeholder}
        onChange={onChange}
        optionFilterProp="children"
      >
        {usuarios.map(usuario => (
          <Select.Option key={usuario.id} value={usuario.id}>
            <Space>
              <UserOutlined />
              {usuario.nombre}
            </Space>
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
};

UserSelector.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  usuarios: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      nombre: PropTypes.string.isRequired
    })
  ).isRequired,
  placeholder: PropTypes.string
};

export default UserSelector;
