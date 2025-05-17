/**
 * @fileoverview Componente principal de layout que proporciona la estructura base para todas las páginas
 * Incluye un sidebar con navegación, un header con título de página y un área de contenido principal
 */
import React, { useState } from 'react';
import { Layout, Menu, Button, theme, Divider, Modal } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  ShoppingCartOutlined,
  BarChartOutlined,
  UserOutlined,
  PlusOutlined,
  ShoppingOutlined
} from '@ant-design/icons';
import VentaForm from '../dashboard/VentaForm';

// Importar estilos CSS
import '../../styles/components/layout/MainLayout.css';

// Extraemos los componentes necesarios de Layout
const { Header, Sider, Content } = Layout;

/**
 * Componente principal de layout que envuelve todas las páginas de la aplicación
 * @param {ReactNode} children - Contenido a renderizar dentro del layout
 * @param {string} currentPage - Nombre de la página actual para resaltarla en el menú
 * @returns {JSX.Element} Layout completo con sidebar, header y contenido
 */
const MainLayout = ({ children, currentPage }) => {
  // Estado para controlar si el sidebar está colapsado
  const [collapsed, setCollapsed] = useState(false);
  // Estado para controlar la visibilidad del modal de nueva venta
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Obtenemos el tema actual de Ant Design
  const { token } = theme.useToken();

  /**
   * Determina la clave seleccionada en el menú basada en la página actual
   * @returns {string[]} Array con la clave del menú que debe estar seleccionada
   */
  const getSelectedKey = () => {
    switch (currentPage) {
      case 'Dashboard':
        return ['1'];
      case 'Ventas':
        return ['2'];
      case 'Reportes':
        return ['3'];
      case 'Usuarios':
        return ['4'];
      case 'Productos':
        return ['5'];
      default:
        return ['1'];
    }
  };

  /**
   * Maneja la navegación entre páginas al hacer clic en los ítems del menú
   * @param {string} key - Clave del ítem del menú seleccionado
   */
  const handleNavigation = (key) => {
    switch (key) {
      case '1':
        window.location.href = '/';
        break;
      case '2':
        window.location.href = '/ventas';
        break;
      case '3':
        window.location.href = '/reportes';
        break;
      case '4':
        window.location.href = '/usuarios';
        break;
      case '5':
        window.location.href = '/productos';
        break;
      case 'nueva-venta':
        showModal();
        break;
      default:
        window.location.href = '/';
    }
  };
  
  /**
   * Muestra el modal para agregar una nueva venta
   */
  const showModal = () => {
    setIsModalOpen(true);
  };
  
  /**
   * Cierra el modal de nueva venta
   */
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <Layout className="main-layout">
      {/* Sidebar con navegación principal y bordes redondeados */}
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        breakpoint="lg" // Punto de quiebre para dispositivos móviles
        collapsedWidth="0" // En móviles, el sidebar se oculta completamente
        onBreakpoint={(broken) => {
          // Colapsar automáticamente en pantallas pequeñas
          if (broken) {
            setCollapsed(true);
          }
        }}
        className="main-sidebar"
      >
        {/* Logo de la aplicación */}
        <div className="app-logo">
          <span className="logo-icon">📊</span>
          <span className="logo-text">
            <span className="logo-text-main">VentaSoft</span>
            <span className="logo-text-sub">Analytics Pro</span>
          </span>
        </div>
        
        {/* Botón de Nueva Venta - siempre visible para acceso rápido */}
        <div className="new-sale-button-container">
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => handleNavigation('nueva-venta')}
            style={{ width: '100%' }}
            size="middle"
          >
            {/* Texto condicional según el estado del sidebar */}
            {!collapsed && 'Nueva Venta'}
          </Button>
        </div>
        
        {/* Separador visual entre el botón de acción y el menú de navegación */}
        <Divider className="menu-divider" />
        
        {/* Menú principal de navegación */}
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={getSelectedKey()}
          items={[
            {
              key: '1',
              icon: <DashboardOutlined />,
              label: 'Dashboard',
              onClick: () => handleNavigation('1')
            },
            {
              key: '2',
              icon: <ShoppingCartOutlined />,
              label: 'Ventas',
              onClick: () => handleNavigation('2')
            },
            {
              key: '5',
              icon: <ShoppingOutlined />,
              label: 'Productos',
              onClick: () => handleNavigation('5')
            },
            {
              key: '3',
              icon: <BarChartOutlined />,
              label: 'Reportes',
              onClick: () => handleNavigation('3')
            },
            {
              key: '4',
              icon: <UserOutlined />,
              label: 'Usuarios',
              onClick: () => handleNavigation('4')
            },
          ]}
        />
      </Sider>
      {/* Contenido principal que se ajusta al estado del sidebar */}
      <Layout 
        className="main-content-wrapper"
        style={{ marginLeft: collapsed ? 0 : 200 }}
      >
        {/* Header fijo con botón para colapsar/expandir el sidebar */}
        <Header className="main-header">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="collapse-button"
            aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
          />
          <div className="header-divider"></div>
          <h2 className="page-title">{currentPage}</h2>
        </Header>
        
        {/* Área de contenido principal donde se renderiza el contenido específico de cada página */}
        <Content
          className="main-content-area"
          style={{
            background: token.colorBgContainer,
            borderRadius: token.borderRadiusLG,
            borderTopLeftRadius: collapsed ? token.borderRadiusLG : '24px'
          }}
        >
          {children}
        </Content>
      </Layout>
      
      {/* Modal para agregar nueva venta - se muestra al hacer clic en el botón de Nueva Venta */}
      <Modal
        title="Agregar Nueva Venta"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null} // Sin botones de pie de página, se manejan en el formulario
        destroyOnClose // Destruye el contenido al cerrarse para resetear el formulario
        className="new-sale-modal"
      >
        <VentaForm onCancel={handleCancel} />
      </Modal>
    </Layout>
  );
};

export default MainLayout;
