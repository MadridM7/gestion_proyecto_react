/**
 * @fileoverview Página de perfil de usuario
 * Permite al usuario ver y editar su información personal
 */
import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Avatar, Row, Col, Divider, message, Typography, Select } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, SaveOutlined, EditOutlined } from '@ant-design/icons';
import MainLayout from '../components/layout/MainLayout';
import { useAuth } from '../context/AuthContext';
import ReactDatePickerWrapper from '../components/atoms/ReactDatePickerWrapper';
import '../styles/pages/Perfil.css';

const { Title, Text } = Typography;
const { Option } = Select;

/**
 * Página de perfil de usuario
 * @returns {JSX.Element} Página de perfil
 */
const Perfil = () => {
  const { usuario, actualizarUsuario } = useAuth();
  const [form] = Form.useForm();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  // Inicializar el formulario con los datos del usuario
  useEffect(() => {
    if (usuario) {
      form.setFieldsValue({
        ...usuario,
        fechaRegistro: usuario.fechaRegistro ? new Date(usuario.fechaRegistro) : null
      });
    }
  }, [usuario, form]);

  /**
   * Maneja el envío del formulario de edición de perfil
   * @param {Object} values - Valores del formulario
   */
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Preparar los datos actualizados
      const usuarioActualizado = {
        ...usuario,
        ...values,
        fechaRegistro: values.fechaRegistro ? new Date(values.fechaRegistro) : usuario.fechaRegistro
      };
      
      // Actualizar el usuario en el contexto de autenticación
      // Esto también actualizará el archivo JSON a través de la API
      const resultado = await actualizarUsuario(usuarioActualizado);
      
      if (resultado) {
        message.success('Perfil actualizado correctamente');
        setEditMode(false);
      } else {
        throw new Error('No se pudo actualizar el perfil');
      }
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      message.error('Error al actualizar el perfil: ' + (error.message || 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  // Determinar el color según el rol del usuario
  const getRolColor = () => {
    if (!usuario) return '#1890ff';
    
    switch (usuario.rol) {
      case 'admin':
        return '#f5222d';
      case 'supervisor':
        return '#722ed1';
      case 'vendedor':
        return '#52c41a';
      default:
        return '#1890ff';
    }
  };

  // Obtener el nombre del rol para mostrar
  const getRolName = () => {
    if (!usuario) return 'Usuario';
    
    switch (usuario.rol) {
      case 'admin':
        return 'Administrador';
      case 'supervisor':
        return 'Supervisor';
      case 'vendedor':
        return 'Vendedor';
      default:
        return usuario.rol;
    }
  };

  // Detectar si estamos en un dispositivo móvil
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Efecto para detectar cambios en el tamaño de la pantalla
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <MainLayout currentPage="Mi Perfil">
      <div className="perfil-container">
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <Card className="perfil-card user-info-card">
              <div className="user-avatar-container">
                <Avatar 
                  size={isMobile ? 80 : 120} 
                  icon={<UserOutlined />} 
                  style={{ backgroundColor: getRolColor() }}
                />
                <Title level={isMobile ? 4 : 3} className="user-name">
                  {usuario?.nombre || 'Usuario'}
                </Title>
                <Text className="user-role" style={{ color: getRolColor() }}>
                  {getRolName()}
                </Text>
              </div>
              
              <Divider />
              
              <div className="user-details">
                <div className="user-detail-item">
                  <Text type="secondary">ID de Usuario</Text>
                  <Text strong>{usuario?.id || 'N/A'}</Text>
                </div>
                <div className="user-detail-item">
                  <Text type="secondary">Correo Electrónico</Text>
                  <Text strong>{usuario?.email || 'N/A'}</Text>
                </div>
                <div className="user-detail-item">
                  <Text type="secondary">Fecha de Registro</Text>
                  <Text strong>
                    {usuario?.fechaRegistro ? new Date(usuario.fechaRegistro).toLocaleDateString('es-CL') : 'N/A'}
                  </Text>
                </div>
                <div className="user-detail-item">
                  <Text type="secondary">Estado</Text>
                  <Text 
                    strong 
                    style={{ 
                      color: usuario?.activo ? '#52c41a' : '#ff4d4f'
                    }}
                  >
                    {usuario?.activo ? 'Activo' : 'Inactivo'}
                  </Text>
                </div>
              </div>
              
              <Divider />
              
              <Button 
                type="primary" 
                icon={<EditOutlined />} 
                onClick={() => setEditMode(true)}
                block
                disabled={editMode}
                size={isMobile ? "large" : "middle"}
              >
                Editar Perfil
              </Button>
            </Card>
          </Col>
          
          <Col xs={24} md={16}>
            <Card 
              className="perfil-card edit-form-card"
              title={
                <Title level={isMobile ? 5 : 4}>
                  {editMode ? 'Editar Información de Perfil' : 'Información de Perfil'}
                </Title>
              }
            >
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                disabled={!editMode || loading}
              >
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="nombre"
                      label="Nombre Completo"
                      rules={[
                        { required: true, message: 'Por favor ingresa tu nombre' },
                        { min: 3, message: 'El nombre debe tener al menos 3 caracteres' }
                      ]}
                    >
                      <Input 
                        prefix={<UserOutlined />} 
                        placeholder="Nombre completo" 
                      />
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="email"
                      label="Correo Electrónico"
                      rules={[
                        { required: true, message: 'Por favor ingresa tu correo electrónico' },
                        { type: 'email', message: 'Ingresa un correo electrónico válido' }
                      ]}
                    >
                      <Input 
                        prefix={<MailOutlined />} 
                        placeholder="Correo electrónico" 
                      />
                    </Form.Item>
                  </Col>
                </Row>
                
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="password"
                      label="Contraseña"
                      rules={[
                        { required: true, message: 'Por favor ingresa tu contraseña' },
                        { min: 6, message: 'La contraseña debe tener al menos 6 caracteres' }
                      ]}
                    >
                      <Input.Password 
                        prefix={<LockOutlined />} 
                        placeholder="Contraseña" 
                      />
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="rol"
                      label="Rol"
                      tooltip="El rol determina tus permisos en el sistema"
                    >
                      <Select disabled>
                        <Option value="admin">Administrador</Option>
                        <Option value="supervisor">Supervisor</Option>
                        <Option value="vendedor">Vendedor</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <ReactDatePickerWrapper
                      name="fechaRegistro"
                      label="Fecha de Registro"
                      value={form.getFieldValue('fechaRegistro') ? new Date(form.getFieldValue('fechaRegistro')) : null}
                      onChange={(date) => form.setFieldsValue({ fechaRegistro: date })}
                      disabled
                    />
                  </Col>
                </Row>
                
                {editMode && (
                  <div className="form-actions">
                    <Button 
                      type="default" 
                      onClick={() => {
                        setEditMode(false);
                        form.resetFields();
                      }}
                      disabled={loading}
                      size={isMobile ? "large" : "middle"}
                      block={isMobile}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      icon={<SaveOutlined />}
                      loading={loading}
                      size={isMobile ? "large" : "middle"}
                      block={isMobile}
                    >
                      Guardar Cambios
                    </Button>
                  </div>
                )}
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    </MainLayout>
  );
};

export default Perfil;
