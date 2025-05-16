import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Switch, DatePicker, Button, Space } from 'antd';
import { UserOutlined, MailOutlined, IdcardOutlined } from '@ant-design/icons';
import { useUsuarios } from '../../context/UsuariosContext';
import moment from 'moment';

const { Option } = Select;

/**
 * Componente para el formulario de usuario
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.usuario - Usuario a editar (null para nuevo usuario)
 * @param {Function} props.onCancel - Función para cancelar
 * @param {Function} props.onSuccess - Función a ejecutar después de guardar
 * @returns {JSX.Element} Formulario de usuario
 */
const UsuarioForm = ({ usuario, onCancel, onSuccess }) => {
  const { agregarUsuario, actualizarUsuario } = useUsuarios();
  const [form] = Form.useForm();
  const [enviando, setEnviando] = useState(false);
  
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
        rol: 'Vendedor',
        fechaRegistro: moment()
      });
    }
  }, [usuario, form]);
  
  // Manejar envío del formulario
  const handleSubmit = async (values) => {
    try {
      setEnviando(true);
      
      // Convertir la fecha a objeto Date
      const fechaRegistro = values.fechaRegistro ? values.fechaRegistro.toDate() : new Date();
      
      const usuarioData = {
        ...values,
        fechaRegistro
      };
      
      if (usuario) {
        // Actualizar usuario existente
        await actualizarUsuario(usuario.id, usuarioData);
      } else {
        // Agregar nuevo usuario
        await agregarUsuario(usuarioData);
      }
      
      // Limpiar formulario y notificar éxito
      form.resetFields();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error al guardar usuario:', error);
    } finally {
      setEnviando(false);
    }
  };
  
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        activo: true,
        rol: 'Vendedor',
        fechaRegistro: moment()
      }}
    >
      <Form.Item
        name="nombre"
        label="Nombre"
        rules={[{ required: true, message: 'Por favor ingresa el nombre' }]}
      >
        <Input prefix={<UserOutlined />} placeholder="Nombre completo" />
      </Form.Item>
      
      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Por favor ingresa el email' },
          { type: 'email', message: 'Por favor ingresa un email válido' }
        ]}
      >
        <Input prefix={<MailOutlined />} placeholder="correo@ejemplo.com" />
      </Form.Item>
      
      <Form.Item
        name="rol"
        label="Rol"
        rules={[{ required: true, message: 'Por favor selecciona un rol' }]}
      >
        <Select prefix={<IdcardOutlined />}>
          <Option value="Administrador">Administrador</Option>
          <Option value="Supervisor">Supervisor</Option>
          <Option value="Vendedor">Vendedor</Option>
        </Select>
      </Form.Item>
      
      <Form.Item
        name="fechaRegistro"
        label="Fecha de Registro"
        rules={[{ required: true, message: 'Por favor selecciona una fecha' }]}
      >
        <DatePicker 
          style={{ width: '100%' }} 
          format="DD/MM/YYYY"
          placeholder="Selecciona una fecha"
        />
      </Form.Item>
      
      <Form.Item name="activo" label="Estado" valuePropName="checked">
        <Switch checkedChildren="Activo" unCheckedChildren="Inactivo" />
      </Form.Item>
      
      <Form.Item>
        <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="primary" htmlType="submit" loading={enviando}>
            {usuario ? 'Actualizar' : 'Guardar'}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default UsuarioForm;
