/**
 * @fileoverview Formulario para agregar o editar usuarios
 */
import React, { useEffect } from 'react';
import { Form, Input, Select, Switch } from 'antd';
import { UserOutlined, TeamOutlined, InfoCircleOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import ReactDatePickerWrapper from '../atoms/ReactDatePickerWrapper';

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
    // Primero resetear el formulario para evitar problemas con valores anteriores
    form.resetFields();
    
    if (usuario) {
      // Convertir la fecha de string a objeto Date
      const fechaRegistro = usuario.fechaRegistro ? new Date(usuario.fechaRegistro) : new Date();
      
      // Establecer los valores del formulario
      setTimeout(() => {
        form.setFieldsValue({
          ...usuario,
          fechaRegistro
        });
      }, 100); // Pequeño retraso para asegurar que el componente esté listo
    } else {
      // Valores por defecto para un nuevo usuario
      setTimeout(() => {
        form.setFieldsValue({
          activo: true,
          rol: 'vendedor',
          fechaRegistro: new Date(),
          email: '',
          password: ''
        });
      }, 100); // Pequeño retraso para asegurar que el componente esté listo
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
      
      {/* Correo electrónico */}
      <Form.Item
        name="email"
        label="Correo electrónico"
        rules={[
          { required: true, message: 'Por favor ingresa el correo electrónico' },
          { type: 'email', message: 'Por favor ingresa un correo electrónico válido' },
          { max: 100, message: 'El correo no puede exceder los 100 caracteres' }
        ]}
        tooltip={{ title: 'Correo electrónico del usuario', icon: <InfoCircleOutlined /> }}
      >
        <Input 
          prefix={<MailOutlined />} 
          placeholder="correo@ejemplo.com" 
          maxLength={100}
          showCount
          autoComplete="new-email" // Evitar autocompletado
        />
      </Form.Item>
      
      {/* Contraseña */}
      <Form.Item
        name="password"
        label="Contraseña"
        rules={[
          { required: true, message: 'Por favor ingresa una contraseña' },
          { min: 6, message: 'La contraseña debe tener al menos 6 caracteres' },
          { max: 20, message: 'La contraseña no puede exceder los 20 caracteres' }
        ]}
        tooltip={{ title: 'Contraseña para acceder al sistema (6-20 caracteres)', icon: <InfoCircleOutlined /> }}
      >
        <Input.Password 
          prefix={<LockOutlined />} 
          placeholder="Contraseña" 
          maxLength={20}
          autoComplete="new-password" // Evitar autocompletado
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
      >
        <ReactDatePickerWrapper
          value={form.getFieldValue('fechaRegistro')}
          onChange={(date) => form.setFieldsValue({ fechaRegistro: date })}
          placeholder="Selecciona una fecha"
          maxDate={new Date()}
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
