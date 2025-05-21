/**
 * @fileoverview Template para la página de usuarios
 */
import React, { useState } from 'react';
import { Card, Button, Divider, Modal, Tabs, Form, message, Row, Col } from 'antd';
import { UserAddOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import { useUsuarios } from '../../context/UsuariosContext';
import moment from 'moment';
import '../../styles/components/templates/UsuariosTemplate.css';

const { TabPane } = Tabs;

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
  const [activeTab, setActiveTab] = useState('1');
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
      fechaRegistro: moment()
    });
    setIsModalVisible(true);
  };

  // Función para mostrar el modal de editar usuario
  const showEditModal = (usuario) => {
    if (!usuario) return;
    
    setEditingUsuario(usuario);
    form.setFieldsValue({
      ...usuario,
      fechaRegistro: usuario.fechaRegistro ? moment(usuario.fechaRegistro) : null
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
        fechaRegistro: values.fechaRegistro ? values.fechaRegistro.toDate() : new Date()
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

  // Cambiar de tab
  const handleTabChange = (key) => {
    setActiveTab(key);
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
      
      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        <TabPane 
          tab={
            <span>
              <TeamOutlined />
              Todos los Usuarios
            </span>
          } 
          key="1"
        >
          <Row gutter={[16, 16]} className="usuarios-content">
            <Col xs={24} lg={16}>
              <Card>
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
            
            {/* En versión desktop mostramos los detalles en la columna lateral */}
            {!isMobile && (
              <Col xs={24} lg={8}>
                <UsuarioDetail usuario={selectedUsuario} onEdit={showEditModal} />
              </Col>
            )}
          </Row>
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <UserOutlined />
              Mi Perfil
            </span>
          } 
          key="2"
        >
          <Card title="Información de Perfil">
            {PerfilUsuario && <PerfilUsuario />}
          </Card>
        </TabPane>
      </Tabs>
      
      {/* Estadísticas de usuarios */}
      {UsuariosStats && (
        <>
          <Divider orientation="left">Estadísticas de Usuarios</Divider>
          <UsuariosStats />
        </>
      )}
      
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
