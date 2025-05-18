/**
 * @fileoverview Componente para mostrar y editar el perfil del usuario actual
 */
import React, { useState } from 'react';
import { Card, Avatar, Typography, Descriptions, Button, Divider, Tag, Modal, Form, Input, message } from 'antd';
import { UserOutlined, EditOutlined, KeyOutlined, MailOutlined } from '@ant-design/icons';
import { useUsuarios } from '../../context/UsuariosContext';

const { Title, Text } = Typography;

/**
 * Componente molecular para mostrar y editar el perfil del usuario
 * @returns {JSX.Element} Perfil de usuario con opciones de edición
 */
const PerfilUsuario = () => {
  const { usuarios, actualizarUsuario } = useUsuarios();
  const [modalVisible, setModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  
  // Simulamos que el usuario actual es el primer usuario administrador
  const usuarioActual = usuarios.find(u => u.rol === 'admin') || usuarios[0];
  
  if (!usuarioActual) {
    return (
      <Card>
        <Text type="secondary">No hay información de usuario disponible</Text>
      </Card>
    );
  }
  
  // Función para abrir el modal de edición
  const showEditModal = () => {
    form.setFieldsValue({
      nombre: usuarioActual.nombre,
      email: usuarioActual.email
    });
    setModalVisible(true);
  };
  
  // Función para abrir el modal de cambio de contraseña
  const showPasswordModal = () => {
    passwordForm.resetFields();
    setPasswordModalVisible(true);
  };
  
  // Función para manejar la actualización del perfil
  const handleUpdateProfile = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      // Simulamos una actualización
      setTimeout(() => {
        actualizarUsuario(usuarioActual.id, values);
        setModalVisible(false);
        setLoading(false);
        message.success('Perfil actualizado correctamente');
      }, 500);
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
    }
  };
  
  // Función para manejar el cambio de contraseña
  const handleChangePassword = async () => {
    try {
      const values = await passwordForm.validateFields();
      setLoading(true);
      
      // Verificar que la contraseña actual sea correcta (simulado)
      if (values.currentPassword !== 'password123') {
        message.error('La contraseña actual es incorrecta');
        setLoading(false);
        return;
      }
      
      // Verificar que las nuevas contraseñas coincidan
      if (values.newPassword !== values.confirmPassword) {
        message.error('Las nuevas contraseñas no coinciden');
        setLoading(false);
        return;
      }
      
      // Simulamos una actualización
      setTimeout(() => {
        setPasswordModalVisible(false);
        setLoading(false);
        message.success('Contraseña actualizada correctamente');
      }, 500);
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
    }
  };
  
  // Obtener el color del rol
  const getRolColor = (rol) => {
    const rolColors = {
      'admin': 'red',
      'vendedor': 'green',
      'supervisor': 'blue'
    };
    return rolColors[rol] || 'default';
  };
  
  // Obtener el texto del rol
  const getRolText = (rol) => {
    const rolTexts = {
      'admin': 'Administrador',
      'vendedor': 'Vendedor',
      'supervisor': 'Supervisor'
    };
    return rolTexts[rol] || rol;
  };
  
  return (
    <div className="perfil-usuario">
      <Card>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Avatar 
            size={100} 
            icon={<UserOutlined />} 
            style={{ backgroundColor: '#1890ff' }} 
          />
          <Title level={3} style={{ marginTop: 16, marginBottom: 4 }}>
            {usuarioActual.nombre}
          </Title>
          <Tag color={getRolColor(usuarioActual.rol)}>
            {getRolText(usuarioActual.rol)}
          </Tag>
        </div>
        
        <Divider />
        
        <Descriptions 
          title="Información Personal" 
          bordered 
          column={{ xs: 1, sm: 2 }}
          extra={
            <Button 
              type="primary" 
              icon={<EditOutlined />} 
              onClick={showEditModal}
            >
              Editar Perfil
            </Button>
          }
        >
          <Descriptions.Item label="Nombre">{usuarioActual.nombre}</Descriptions.Item>
          <Descriptions.Item label="Email">{usuarioActual.email}</Descriptions.Item>
          <Descriptions.Item label="Rol">
            <Tag color={getRolColor(usuarioActual.rol)}>
              {getRolText(usuarioActual.rol)}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Estado">
            <Tag color={usuarioActual.activo ? 'green' : 'red'}>
              {usuarioActual.activo ? 'Activo' : 'Inactivo'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Fecha Registro" span={2}>
            {usuarioActual.fechaRegistro ? new Date(usuarioActual.fechaRegistro).toLocaleDateString() : 'N/A'}
          </Descriptions.Item>
        </Descriptions>
        
        <Divider />
        
        <div style={{ textAlign: 'center' }}>
          <Button 
            icon={<KeyOutlined />} 
            onClick={showPasswordModal}
          >
            Cambiar Contraseña
          </Button>
        </div>
      </Card>
      
      {/* Modal para editar perfil */}
      <Modal
        title="Editar Perfil"
        open={modalVisible}
        onOk={handleUpdateProfile}
        onCancel={() => setModalVisible(false)}
        confirmLoading={loading}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="nombre"
            label="Nombre"
            rules={[{ required: true, message: 'Por favor ingresa tu nombre' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Nombre completo" />
          </Form.Item>
          
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Por favor ingresa tu email' },
              { type: 'email', message: 'Por favor ingresa un email válido' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>
        </Form>
      </Modal>
      
      {/* Modal para cambiar contraseña */}
      <Modal
        title="Cambiar Contraseña"
        open={passwordModalVisible}
        onOk={handleChangePassword}
        onCancel={() => setPasswordModalVisible(false)}
        confirmLoading={loading}
      >
        <Form
          form={passwordForm}
          layout="vertical"
        >
          <Form.Item
            name="currentPassword"
            label="Contraseña Actual"
            rules={[{ required: true, message: 'Por favor ingresa tu contraseña actual' }]}
          >
            <Input.Password prefix={<KeyOutlined />} placeholder="Contraseña actual" />
          </Form.Item>
          
          <Form.Item
            name="newPassword"
            label="Nueva Contraseña"
            rules={[
              { required: true, message: 'Por favor ingresa tu nueva contraseña' },
              { min: 6, message: 'La contraseña debe tener al menos 6 caracteres' }
            ]}
          >
            <Input.Password prefix={<KeyOutlined />} placeholder="Nueva contraseña" />
          </Form.Item>
          
          <Form.Item
            name="confirmPassword"
            label="Confirmar Contraseña"
            rules={[
              { required: true, message: 'Por favor confirma tu nueva contraseña' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Las contraseñas no coinciden'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<KeyOutlined />} placeholder="Confirmar contraseña" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PerfilUsuario;
