/**
 * @fileoverview Template para la página de usuarios
 */
import React, { useState } from 'react';
import { Card, Button, Divider, Modal, Form, message, Row, Col } from 'antd';
import { UserAddOutlined, UserOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import { useUsuarios } from '../../context/UsuariosContext';
import '../../styles/components/templates/UsuariosTemplate.css';

/**
 * Componente template para la página de usuarios
 * @param {Object} props - Propiedades del componente
 * @returns {JSX.Element} Template de la página de usuarios
 */
const UsuariosTemplate = ({ 
  UsuariosDataTable, 
  UsuarioFormulario, 
  UsuariosStats, 
  PerfilUsuario,
  UsuarioDetail,
  isMobile = false
}) => {
  const { agregarUsuario, actualizarUsuario } = useUsuarios();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState(null);
  // Estado para controlar la visualización del modal de detalles en móvil
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  // Función para abrir el modal de nuevo usuario
  const showModal = () => {
    setEditingUsuario(null);
    form.resetFields();
    form.setFieldsValue({
      activo: true,
      rol: 'vendedor',
      fechaRegistro: new Date()
    });
    setIsModalVisible(true);
  };

  // Función para mostrar el modal de editar usuario
  const showEditModal = (usuario) => {
    if (!usuario) return;
    
    setEditingUsuario(usuario);
    form.setFieldsValue({
      ...usuario,
      fechaRegistro: usuario.fechaRegistro ? new Date(usuario.fechaRegistro) : null
    });
    setIsModalVisible(true);
  };

  // Función para cerrar el modal
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setIsSubmitting(true);

      // Preparar los datos del usuario
      const usuarioData = {
        ...values,
        fechaRegistro: values.fechaRegistro instanceof Date ? values.fechaRegistro : new Date()
      };

      // Si no hay contraseña y es una edición, eliminar el campo para no sobrescribir
      if (editingUsuario && !values.password) {
        delete usuarioData.password;
      }

      // Agregar o actualizar el usuario según corresponda
      if (editingUsuario) {
        await actualizarUsuario(editingUsuario.id, usuarioData);
        message.success('Usuario actualizado correctamente');
        
        // Actualizar el usuario seleccionado si es el que se está editando
        if (selectedUsuario && selectedUsuario.id === editingUsuario.id) {
          setSelectedUsuario({
            ...editingUsuario,
            ...usuarioData
          });
        }
      } else {
        await agregarUsuario(usuarioData);
        message.success('Usuario agregado correctamente');
      }

      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      // Capturar error silenciosamente
      message.error('Error al procesar el usuario. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Manejar selección de usuario
  const handleUsuarioSelect = (usuario) => {
    setSelectedUsuario(usuario);
    
    // Si estamos en móvil, mostrar el modal con los detalles
    if (isMobile && usuario) {
      setIsDetailModalVisible(true);
    }
  };
  
  // Cerrar el modal de detalles
  const handleDetailModalClose = () => {
    setIsDetailModalVisible(false);
  };

  // Botón para agregar nuevo usuario
  const addButton = (
    <Button 
      type="primary" 
      icon={<UserAddOutlined />} 
      onClick={showModal}
      className={isMobile ? 'mobile-icon-only-button' : ''}
    >
      {!isMobile && 'Nuevo Usuario'}
    </Button>
  );

  return (
    <div className="usuarios-template">      
      <Row gutter={[16, 16]} className="usuarios-content">
        {/* Tabla de usuarios */}
        <Col xs={24} lg={16}>
          <Card className="usuarios-table-card">
            {UsuariosDataTable && (
              <UsuariosDataTable 
                onRowClick={handleUsuarioSelect}
                isMobile={isMobile}
                searchExtra={
                  <div className={`search-actions-container ${isMobile ? 'mobile-search-container' : ''}`}>
                    {addButton}
                  </div>
                }
              />
            )}
          </Card>
        </Col>
        
        {/* Panel lateral con detalles del usuario */}
        {!isMobile && (
          <Col xs={24} lg={8}>
            <UsuarioDetail usuario={selectedUsuario} onEdit={showEditModal} />
          </Col>
        )}
        
        {/* Estadísticas de usuarios (ancho completo) */}
        <Col span={24} style={{ marginTop: '16px' }}>
          {UsuariosStats && (
            <div className="usuarios-stats-container">
              <Divider orientation="left">Estadísticas de Usuarios</Divider>
              <UsuariosStats />
            </div>
          )}
        </Col>
      </Row>
      
      {/* Modal para agregar/editar usuario */}
      {UsuarioFormulario && (
        <Modal
          title={editingUsuario ? 'Editar Usuario' : 'Nuevo Usuario'}
          open={isModalVisible}
          onOk={handleSubmit}
          onCancel={handleCancel}
          confirmLoading={isSubmitting}
          maskClosable={false}
          destroyOnClose
          width="600px"
        >
          <UsuarioFormulario 
            form={form} 
            usuario={editingUsuario} 
            loading={isSubmitting} 
          />
        </Modal>
      )}
      
      {/* Modal para mostrar detalles en versión móvil */}
      {isMobile && (
        <Modal
          title={<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><UserOutlined /> Detalles del Usuario</div>}
          open={isDetailModalVisible}
          onCancel={handleDetailModalClose}
          footer={null}
          width="95%"
          style={{ top: 0 }}
          bodyStyle={{ padding: '16px', maxHeight: '80vh', overflowY: 'auto' }}
        >
          <UsuarioDetail usuario={selectedUsuario} onEdit={showEditModal} inMobileModal={true} />
        </Modal>
      )}
    </div>
  );
};

UsuariosTemplate.propTypes = {
  UsuariosDataTable: PropTypes.elementType,
  UsuarioFormulario: PropTypes.elementType,
  UsuariosStats: PropTypes.elementType,
  PerfilUsuario: PropTypes.elementType,
  UsuarioDetail: PropTypes.elementType,
  isMobile: PropTypes.bool
};

export default UsuariosTemplate;
