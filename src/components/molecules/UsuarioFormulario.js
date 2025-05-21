/**
 * @fileoverview Formulario para agregar o editar usuarios
 */
import React, { useEffect } from 'react';
import { Form, Input, Select, Switch, DatePicker } from 'antd';
import { UserOutlined, CalendarOutlined, TeamOutlined, InfoCircleOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import moment from 'moment';

const { Option } = Select;

/**
 * Componente molecular para formulario de usuarios
 * @param {Object} props - Propiedades del componente
 * @returns {JSX.Element} Formulario para agregar o editar usuarios
 */
const UsuarioFormulario = ({ 
  form, 
  usuario = null,
  loading = false
}) => {
  // Inicializar el formulario cuando cambia el usuario
  useEffect(() => {
    if (usuario) {
      form.setFieldsValue({
        ...usuario,
        fechaRegistro: usuario.fechaRegistro ? moment(usuario.fechaRegistro) : null
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        activo: true,
        rol: 'vendedor',
        fechaRegistro: moment()
      });
    }
  }, [usuario, form]);
  
  // Roles disponibles
  const roles = [
    { value: 'admin', label: 'Administrador' },
    { value: 'vendedor', label: 'Vendedor' },
    { value: 'supervisor', label: 'Supervisor' }
  ];
  
  return (
    <Form
      form={form}
      layout="vertical"
      disabled={loading}
    >
      {/* ID (oculto para nuevos usuarios) */}
      {usuario && (
        <Form.Item
          name="id"
          hidden
        >
          <Input />
        </Form.Item>
      )}
      
      {/* Nombre del usuario */}
      <Form.Item
        name="nombre"
        label="Nombre completo"
        rules={[
          { required: true, message: 'Por favor ingresa el nombre del usuario' },
          { min: 3, message: 'El nombre debe tener al menos 3 caracteres' },
          { max: 100, message: 'El nombre no puede exceder los 100 caracteres' },
          { pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s.]+$/, message: 'El nombre solo debe contener letras, espacios y puntos' }
        ]}
        tooltip={{ title: 'Nombre completo del usuario (3-100 caracteres)', icon: <InfoCircleOutlined /> }}
      >
        <Input 
          prefix={<UserOutlined />} 
          placeholder="Nombre completo" 
          maxLength={100}
          showCount
        />
      </Form.Item>
      
      {/* Rol */}
      <Form.Item
        name="rol"
        label="Rol"
        rules={[{ required: true, message: 'Por favor selecciona un rol' }]}
        tooltip={{ title: 'Nivel de acceso y permisos del usuario en el sistema', icon: <InfoCircleOutlined /> }}
      >
        <Select 
          placeholder="Selecciona un rol"
          suffixIcon={<TeamOutlined />}
          showSearch
          optionFilterProp="children"
        >
          {roles.map(rol => (
            <Option key={rol.value} value={rol.value}>{rol.label}</Option>
          ))}
        </Select>
      </Form.Item>
      
      {/* Fecha de registro */}
      <Form.Item
        name="fechaRegistro"
        label="Fecha de registro"
        rules={[{ required: true, message: 'Por favor selecciona la fecha de registro' }]}
        tooltip={{ title: 'Fecha en que el usuario fue registrado en el sistema', icon: <InfoCircleOutlined /> }}
      >
        <DatePicker 
          style={{ width: '100%' }} 
          format="DD/MM/YYYY"
          placeholder="Selecciona una fecha"
          suffixIcon={<CalendarOutlined />}
          disabledDate={(current) => current && current > moment().endOf('day')}
        />
      </Form.Item>
      
      {/* Estado activo/inactivo */}
      <Form.Item
        name="activo"
        label="Estado"
        valuePropName="checked"
        tooltip={{ title: 'Determina si el usuario puede acceder al sistema', icon: <InfoCircleOutlined /> }}
      >
        <Switch 
          checkedChildren="Activo" 
          unCheckedChildren="Inactivo" 
        />
      </Form.Item>
    </Form>
  );
};

UsuarioFormulario.propTypes = {
  form: PropTypes.object.isRequired,
  usuario: PropTypes.object,
  loading: PropTypes.bool
};

export default UsuarioFormulario;
