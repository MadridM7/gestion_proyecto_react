/**
 * @fileoverview Página de inicio de sesión para la aplicación
 * Implementada siguiendo la metodología Atomic Design
 */
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, message, Spin, Row, Col } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useUsuarios } from '../context/UsuariosContext';
import { useAuth } from '../context/AuthContext';
import '../styles/pages/Login.css';

const { Title, Text, Paragraph } = Typography;

/**
 * Página de inicio de sesión
 * @returns {JSX.Element} Página de Login
 */
const Login = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { usuarios } = useUsuarios();
  const { login } = useAuth();
  
  // Detectar si es dispositivo móvil
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  /**
   * Maneja el envío del formulario de inicio de sesión
   * @param {Object} values - Valores del formulario
   */
  const handleSubmit = async (values) => {
    setLoading(true);
    
    try {
      // Simular un pequeño retraso para mostrar el loading
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Buscar el usuario por nombre de usuario
      const usuario = usuarios.find(u => 
        u.nombre.toLowerCase() === values.username.toLowerCase() && 
        u.password === values.password
      );
      
      if (usuario) {
        // Usuario encontrado, iniciar sesión
        login(usuario);
        message.success(`Bienvenido, ${usuario.nombre}`);
        // Redirigir según el rol del usuario
        if (usuario.rol === 'admin') {
          // Si es administrador, redirigir al dashboard
          window.location.href = '/';
        } else {
          // Si es vendedor, redirigir a ventas
          window.location.href = '/ventas';
        }
      } else {
        // Usuario no encontrado o contraseña incorrecta
        message.error('Nombre de usuario o contraseña incorrectos');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      message.error('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="login-container">
      {isMobile && (
        <div className="mobile-background">
          <div className="stars"></div>
          <div className="moon"></div>
          <div className="mountains"></div>
          <div className="clouds"></div>
          <div className="mobile-footer">
            <Text className="mobile-footer-text">
              © {new Date().getFullYear()} Ventrack
            </Text>
          </div>
        </div>
      )}
      
      <Row className="login-row">
        {/* Lado izquierdo - Ilustración (visible solo en desktop) */}
        <Col xs={0} sm={0} md={12} lg={12} xl={12} className="login-illustration-col">
          <div className="login-illustration">
            <div className="login-illustration-content">
              <div className="stars"></div>
              <div className="moon"></div>
              <div className="mountains"></div>
              <div className="clouds"></div>

              <div className="login-illustration-text">
                <Title level={3} className="illustration-title">Inicia sesión en tu cuenta</Title>
                <Paragraph className="illustration-subtitle">para ver todas las funcionalidades</Paragraph>
              </div>

              <div className="login-illustration-footer">
                <Text className="illustration-footer-text">
                  © {new Date().getFullYear()} Ventrack 
                </Text>
              </div>
            </div>
          </div>
        </Col>
        
        {/* Formulario (adaptado según el dispositivo) */}
        <Col xs={24} sm={24} md={12} lg={12} xl={12} className="login-form-col">
          <div className="login-form-container" data-year={new Date().getFullYear()}>
            <div className="login-header">
              <Title level={2} className="login-title">Bienvenido a Ventrack</Title>
              <Text className="login-subtitle">
                Ingresa tus credenciales para acceder
              </Text>
            </div>
            
            <Spin spinning={loading} tip="Iniciando sesión...">
              <Form
                form={form}
                name="login"
                layout="vertical"
                onFinish={handleSubmit}
                className="login-form"
                autoComplete="off"
              >
                <Form.Item
                  name="username"
                  label="Nombre de Usuario"
                  rules={[
                    { required: true, message: 'Por favor ingresa tu nombre de usuario' },
                    { min: 3, message: 'El nombre de usuario debe tener al menos 3 caracteres' }
                  ]}
                >
                  <Input 
                    prefix={<UserOutlined />} 
                    placeholder="Nombre de usuario" 
                    size="large"
                    autoComplete="off"
                  />
                </Form.Item>
                
                <Form.Item
                  name="password"
                  label="Contraseña"
                  rules={[
                    { required: true, message: 'Por favor ingresa tu contraseña' },
                    { min: 4, message: 'La contraseña debe tener al menos 4 caracteres' }
                  ]}
                >
                  <Input.Password 
                    prefix={<LockOutlined />} 
                    placeholder="Contraseña" 
                    size="large"
                    autoComplete="new-password"
                  />
                </Form.Item>
                
                <Form.Item className="login-button-container">
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    size="large" 
                    block
                    loading={loading}
                    className="login-button"
                  >
                    Iniciar Sesión
                  </Button>
                </Form.Item>
              </Form>
            </Spin>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
