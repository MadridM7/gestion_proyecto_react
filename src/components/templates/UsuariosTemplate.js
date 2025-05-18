/**
 * @fileoverview Template para la página de usuarios
 */
import React, { useState } from 'react';
import { Card, Button, Divider, Modal, Tabs, Form, message } from 'antd';
import { UserAddOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import { useUsuarios } from '../../context/UsuariosContext';

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
  PerfilUsuario 
}) => {
  const { agregarUsuario, actualizarUsuario } = useUsuarios();
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [usuarioEditar, setUsuarioEditar] = useState(null);
  const [activeTab, setActiveTab] = useState('1');
  const [loading, setLoading] = useState(false);

  // Función para abrir el modal de nuevo usuario
  const showModal = () => {
    setUsuarioEditar(null);
    form.resetFields();
    setModalVisible(true);
  };

  // Función para cerrar el modal
  const handleCancel = () => {
    setModalVisible(false);
    form.resetFields();
  };

  // Función para manejar la edición de un usuario
  const handleEdit = (usuario) => {
    setUsuarioEditar(usuario);
    setModalVisible(true);
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // Preparar los datos del usuario
      const usuarioData = {
        ...values,
        fechaRegistro: values.fechaRegistro ? values.fechaRegistro.toDate() : new Date()
      };

      // Si no hay contraseña y es una edición, eliminar el campo para no sobrescribir
      if (usuarioEditar && !values.password) {
        delete usuarioData.password;
      }

      // Agregar o actualizar el usuario según corresponda
      if (usuarioEditar) {
        await actualizarUsuario(usuarioEditar.id, usuarioData);
        message.success('Usuario actualizado correctamente');
      } else {
        await agregarUsuario(usuarioData);
        message.success('Usuario agregado correctamente');
      }

      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Error al procesar el usuario:', error);
      message.error('Error al procesar el usuario. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Cambiar de tab
  const handleTabChange = (key) => {
    setActiveTab(key);
  };

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
          <Card>
            {UsuariosDataTable && (
              <UsuariosDataTable 
                onEdit={handleEdit} 
                searchExtra={
                  <Button 
                    type="primary" 
                    icon={<UserAddOutlined />} 
                    onClick={showModal}
                  >
                    Nuevo Usuario
                  </Button>
                }
              />
            )}
          </Card>
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
      <Modal
        title={usuarioEditar ? 'Editar Usuario' : 'Nuevo Usuario'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        confirmLoading={loading}
        maskClosable={false}
        destroyOnClose
      >
        {UsuarioFormulario && (
          <UsuarioFormulario 
            form={form} 
            usuario={usuarioEditar} 
            loading={loading} 
          />
        )}
      </Modal>
    </div>
  );
};

UsuariosTemplate.propTypes = {
  UsuariosDataTable: PropTypes.elementType,
  UsuarioFormulario: PropTypes.elementType,
  UsuariosStats: PropTypes.elementType,
  PerfilUsuario: PropTypes.elementType
};

export default UsuariosTemplate;
