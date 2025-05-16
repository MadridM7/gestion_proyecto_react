import React, { useState } from 'react';
import { Card, Avatar, Typography, Descriptions, Button, Divider, Tag, Modal, Form, Input, Select, message } from 'antd';
import { UserOutlined, EditOutlined, KeyOutlined, MailOutlined } from '@ant-design/icons';
import { useUsuarios } from '../../context/UsuariosContext';

const { Title, Text } = Typography;
const { Option } = Select;

/**
 * Componente para mostrar y editar el perfil del usuario actual
 * @returns {JSX.Element} Perfil de usuario
 */
const PerfilUsuario = () => {
  const { usuarios, actualizarUsuario } = useUsuarios();
  const [modalVisible, setModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  
  // Simulamos que el usuario actual es el primer usuario administrador
  const usuarioActual = usuarios.find(u => u.rol === 'Administrador') || usuarios[0];
  
  // Función para abrir el modal de edición
  const showEditModal = () => {
    form.setFieldsValue({
      nombre: usuarioActual.nombre,
      email: usuarioActual.email,
      rol: usuarioActual.rol,
      estado: usuarioActual.estado
    });
    setModalVisible(true);
  };
  
  // Función para abrir el modal de cambio de contraseña
  const showPasswordModal = () => {
    passwordForm.resetFields();
    setPasswordModalVisible(true);
  };
  
  // Función para manejar la actualización del perfil
  const handleUpdateProfile = (values) => {
    const usuarioActualizado = {
      ...usuarioActual,
      ...values
    };
    
    actualizarUsuario(usuarioActualizado);
    setModalVisible(false);
    message.success('Perfil actualizado correctamente');
  };
  
  // Función para manejar el cambio de contraseña
  const handlePasswordChange = (values) => {
    // Aquí iría la lógica para cambiar la contraseña
    // Por ahora solo mostramos un mensaje de éxito
    setPasswordModalVisible(false);
    message.success('Contraseña actualizada correctamente');
  };
  
  // Obtener el color del estado
  const getEstadoColor = (estado) => {
    return estado === 'Activo' ? 'green' : 'volcano';
  };
  
  // Obtener el color del rol
  const getRolColor = (rol) => {
    switch(rol) {
      case 'Administrador': return 'red';
      case 'Supervisor': return 'blue';
      case 'Vendedor': return 'green';
      default: return 'default';
    }
  };
  
  return (
    <>
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
          <Avatar 
            size={80} 
            icon={<UserOutlined />} 
            style={{ backgroundColor: '#1890ff' }}
          />
          <div style={{ marginLeft: 24 }}>
            <Title level={3} style={{ margin: 0 }}>{usuarioActual.nombre}</Title>
            <Text type="secondary">{usuarioActual.email}</Text>
            <div style={{ marginTop: 8 }}>
              <Tag color={getRolColor(usuarioActual.rol)}>{usuarioActual.rol}</Tag>
              <Tag color={getEstadoColor(usuarioActual.estado)}>{usuarioActual.estado}</Tag>
            </div>
          </div>
        </div>
        
        <Divider />
        
        <Descriptions title="Información del Usuario" bordered>
          <Descriptions.Item label="ID" span={3}>{usuarioActual.id}</Descriptions.Item>
          <Descriptions.Item label="Nombre" span={3}>{usuarioActual.nombre}</Descriptions.Item>
          <Descriptions.Item label="Email" span={3}>{usuarioActual.email}</Descriptions.Item>
          <Descriptions.Item label="Rol" span={3}>{usuarioActual.rol}</Descriptions.Item>
          <Descriptions.Item label="Estado" span={3}>{usuarioActual.estado}</Descriptions.Item>
          <Descriptions.Item label="Fecha de Registro" span={3}>
            {usuarioActual.fechaRegistro ? usuarioActual.fechaRegistro.toLocaleDateString() : 'No disponible'}
          </Descriptions.Item>
        </Descriptions>
        
        <div style={{ marginTop: 24, display: 'flex', gap: 16 }}>
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={showEditModal}
          >
            Editar Perfil
          </Button>
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
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdateProfile}
          initialValues={{
            nombre: usuarioActual.nombre,
            email: usuarioActual.email,
            rol: usuarioActual.rol,
            estado: usuarioActual.estado
          }}
        >
          <Form.Item
            name="nombre"
            label="Nombre"
            rules={[{ required: true, message: 'Por favor ingrese su nombre' }]}
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>
          
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Por favor ingrese su email' },
              { type: 'email', message: 'Por favor ingrese un email válido' }
            ]}
          >
            <Input prefix={<MailOutlined />} />
          </Form.Item>
          
          <Form.Item
            name="rol"
            label="Rol"
          >
            <Select disabled>
              <Option value="Administrador">Administrador</Option>
              <Option value="Supervisor">Supervisor</Option>
              <Option value="Vendedor">Vendedor</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="estado"
            label="Estado"
          >
            <Select disabled>
              <Option value="Activo">Activo</Option>
              <Option value="Inactivo">Inactivo</Option>
            </Select>
          </Form.Item>
          
          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <Button onClick={() => setModalVisible(false)}>
                Cancelar
              </Button>
              <Button type="primary" htmlType="submit">
                Guardar Cambios
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
      
      {/* Modal para cambiar contraseña */}
      <Modal
        title="Cambiar Contraseña"
        open={passwordModalVisible}
        onCancel={() => setPasswordModalVisible(false)}
        footer={null}
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handlePasswordChange}
        >
          <Form.Item
            name="currentPassword"
            label="Contraseña Actual"
            rules={[{ required: true, message: 'Por favor ingrese su contraseña actual' }]}
          >
            <Input.Password prefix={<KeyOutlined />} />
          </Form.Item>
          
          <Form.Item
            name="newPassword"
            label="Nueva Contraseña"
            rules={[
              { required: true, message: 'Por favor ingrese su nueva contraseña' },
              { min: 6, message: 'La contraseña debe tener al menos 6 caracteres' }
            ]}
          >
            <Input.Password prefix={<KeyOutlined />} />
          </Form.Item>
          
          <Form.Item
            name="confirmPassword"
            label="Confirmar Contraseña"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Por favor confirme su nueva contraseña' },
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
            <Input.Password prefix={<KeyOutlined />} />
          </Form.Item>
          
          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <Button onClick={() => setPasswordModalVisible(false)}>
                Cancelar
              </Button>
              <Button type="primary" htmlType="submit">
                Cambiar Contraseña
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default PerfilUsuario;
