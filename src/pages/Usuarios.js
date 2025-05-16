import React, { useState } from 'react';
import { Card, Button, Divider, Modal, Tabs } from 'antd';
import { UserAddOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons';
import MainLayout from '../components/layout/MainLayout';
import UsuariosTable from '../components/usuarios/UsuariosTable';
import UsuarioForm from '../components/usuarios/UsuarioForm';
import UsuariosStats from '../components/usuarios/UsuariosStats';
import PerfilUsuario from '../components/usuarios/PerfilUsuario';

const { TabPane } = Tabs;

/**
 * Página de gestión de usuarios
 * @returns {JSX.Element} Página de Usuarios
 */
const Usuarios = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [usuarioEditar, setUsuarioEditar] = useState(null);
  const [activeTab, setActiveTab] = useState('1');

  // Función para abrir el modal de nuevo usuario
  const showModal = () => {
    setUsuarioEditar(null);
    setModalVisible(true);
  };

  // Función para cerrar el modal
  const handleCancel = () => {
    setModalVisible(false);
  };

  // Función para manejar la edición de un usuario
  const handleEdit = (usuario) => {
    setUsuarioEditar(usuario);
    setModalVisible(true);
  };

  // Función para manejar el éxito al guardar un usuario
  const handleSuccess = () => {
    setModalVisible(false);
    setUsuarioEditar(null);
  };

  // Cambiar de tab
  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  return (
    <MainLayout currentPage="Usuarios">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0 }}>Gestión de Usuarios</h1>
        <p style={{ color: 'rgba(0, 0, 0, 0.45)' }}>
          Administración de usuarios del sistema
        </p>
      </div>

      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        <TabPane
          tab={
            <span>
              <TeamOutlined />
              Listado de Usuarios
            </span>
          }
          key="1"
        >
          <UsuariosStats />
          
          <Divider />
          
          <Card 
            title="Usuarios" 
            extra={
              <Button 
                type="primary" 
                icon={<UserAddOutlined />} 
                onClick={showModal}
              >
                Nuevo Usuario
              </Button>
            }
          >
            <UsuariosTable onEdit={handleEdit} />
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
          <PerfilUsuario />
        </TabPane>
      </Tabs>

      <Modal
        title={usuarioEditar ? 'Editar Usuario' : 'Nuevo Usuario'}
        open={modalVisible}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
      >
        <UsuarioForm 
          usuario={usuarioEditar} 
          onCancel={handleCancel} 
          onSuccess={handleSuccess} 
        />
      </Modal>
    </MainLayout>
  );
};

export default Usuarios;
