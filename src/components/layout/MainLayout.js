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
  PlusOutlined
} from '@ant-design/icons';
import VentaForm from '../dashboard/VentaForm';

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
    <Layout style={{ minHeight: '100vh' }}>
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
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
          // Bordes redondeados en el lado derecho del sidebar
          borderTopRightRadius: '24px',
          borderBottomRightRadius: '24px',
          boxShadow: '4px 0 10px rgba(0, 0, 0, 0.1)' // Sombra para efecto de elevación
        }}
      >
        {/* Logo de la aplicación con diseño mejorado */}
        <div className="logo" style={{ 
          height: '50px', 
          margin: '16px 16px 24px', 
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: collapsed ? '16px' : '20px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
          letterSpacing: '1px'
        }}>
          {/* Mostrar versión corta o completa según el estado del sidebar */}
          {collapsed ? 'DV' : 'DASHBOARD VENTAS'}
        </div>
        
        {/* Botón de Nueva Venta - siempre visible para acceso rápido */}
        <div style={{ padding: '0 16px', marginBottom: '16px' }}>
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
        <Divider style={{ margin: '0 0 8px 0', borderColor: 'rgba(255, 255, 255, 0.1)' }} />
        
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
      <Layout style={{ 
        marginLeft: collapsed ? 0 : 200, // Ajusta el margen según el estado del sidebar
        transition: 'all 0.2s' // Animación suave al expandir/colapsar
      }}>
        {/* Header fijo con botón para colapsar/expandir el sidebar */}
        <Header
          style={{
            padding: 0,
            background: token.colorBgContainer,
            position: 'sticky', // Mantiene el header visible al hacer scroll
            top: 0,
            zIndex: 1,
            //width: '100%',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', // Sombra sutil para separación visual
            borderRadius: '8px', // Bordes redondeados para mejor estética
            margin: '8px 8px 0 8px', // Margen para separar del borde de la ventana
            height: '64px' // Altura fija para consistencia
          }}
        >
          {/* Botón para colapsar/expandir el sidebar con icono dinámico */}
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
              borderRadius: '8px 0 0 8px' // Borde redondeado solo en el lado izquierdo
            }}
            aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
          />
          {/* Título de la página actual */}
          <h2 style={{ margin: 0, fontWeight: '500' }}>{currentPage}</h2>
        </Header>
        
        {/* Área de contenido principal donde se renderiza el contenido específico de cada página */}
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280, // Altura mínima para asegurar que siempre haya espacio suficiente
            background: token.colorBgContainer,
            borderRadius: token.borderRadiusLG, // Bordes redondeados consistentes con el tema
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)', // Sombra sutil para efecto de elevación
            overflow: 'auto', // Manejo de desbordamiento para contenido extenso
            borderTopLeftRadius: collapsed ? token.borderRadiusLG : '24px' // Borde especial cuando el sidebar está visible
          }}
          className="main-content-area" // Clase para estilos adicionales en CSS
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
      >
        <VentaForm onCancel={handleCancel} />
      </Modal>
    </Layout>
  );
};

export default MainLayout;
