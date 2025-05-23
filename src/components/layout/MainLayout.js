/**
 * @fileoverview Componente principal de layout que proporciona la estructura base para todas las páginas
 * Incluye un sidebar con navegación, un header con título de página y un área de contenido principal
 */
import React, { useState, useEffect, useRef } from 'react';
import { Layout, Menu, Button, theme, Divider, Modal, Form, message, Dropdown } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  ShoppingCartOutlined,
  BarChartOutlined,
  UserOutlined,
  PlusOutlined,
  ShoppingOutlined,
  LogoutOutlined,
  DownOutlined,
  GiftOutlined
} from '@ant-design/icons';
import VentaFormulario from '../molecules/VentaFormulario';
import AddSaleButton from '../molecules/AddSaleButton';
import { useVentas } from '../../context/VentasContext';
import { useAuth } from '../../context/AuthContext';

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
  // Estado para forzar la estabilidad del sidebar
  const [sidebarLocked, setSidebarLocked] = useState(false);
  // Estado para detectar si estamos en móvil
  const [isMobile, setIsMobile] = useState(false);
  // Referencia para rastrear si estamos en una operación de datos
  const isDataOperationRef = useRef(false);
  // Obtener funciones de autenticación
  const { usuario, logout } = useAuth();
  
  // Inicializamos el tema de Ant Design (ya no necesitamos el token directamente)
  theme.useToken();
  
  // Efecto para detectar el tamaño de la pantalla
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Comprobar inicialmente
    checkMobile();
    
    // Escuchar cambios de tamaño
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  // Efecto para prevenir el parpadeo del sidebar
  useEffect(() => {
    // Bloquear el sidebar durante las operaciones de datos
    const lockSidebar = () => {
      setSidebarLocked(true);
      setTimeout(() => {
        setSidebarLocked(false);
      }, 1500); // Mantener bloqueado por 1.5 segundos
    };
    
    // Interceptar envíos de formularios
    const handleSubmit = () => {
      isDataOperationRef.current = true;
      lockSidebar();
      setTimeout(() => {
        isDataOperationRef.current = false;
      }, 1000);
    };
    
    document.addEventListener('submit', handleSubmit);
    
    // Interceptar peticiones fetch (para operaciones API)
    const originalFetch = window.fetch;
    window.fetch = function() {
      handleSubmit();
      return originalFetch.apply(this, arguments);
    };
    
    return () => {
      document.removeEventListener('submit', handleSubmit);
      window.fetch = originalFetch;
    };
  }, []);

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
      case 'Pedidos':
        return ['6'];
      default:
        return ['1'];
    }
  };

  /**
   * Maneja la navegación a diferentes páginas
   * @param {string} key - Clave del menú seleccionado
   */
  const handleNavigation = (key) => {
    // Cerrar el sidebar en versión móvil al navegar
    if (isMobile && !collapsed) {
      setCollapsed(true);
    }
    
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
      case '6':
        window.location.href = '/pedidos';
        break;
      case 'nueva-venta':
        showModal();
        break;
      case 'profile':
        window.location.href = '/perfil';
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
  
  // Crear una instancia de Form para el modal de nueva venta
  const [form] = Form.useForm();
  
  // Obtener el contexto de ventas
  const { agregarVenta } = useVentas();
  
  /**
   * Cierra el modal de nueva venta
   */
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };
  
  /**
   * Maneja el envío del formulario de nueva venta
   */
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // Convertir el monto de formato CLP a número
      let montoNumerico = 0;
      if (typeof values.monto === 'string') {
        // Si es string (formato con separadores), quitar caracteres no numéricos
        montoNumerico = parseInt(values.monto.replace(/\D/g, '') || 0);
      } else if (typeof values.monto === 'number') {
        // Si ya es un número, usarlo directamente
        montoNumerico = values.monto;
      }
      
      // Crear la nueva venta con los datos del formulario
      const nuevaVenta = {
        ...values,
        monto: montoNumerico,
        fechaHora: new Date().toISOString(),
        id: `V${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
      };
      
      // Agregar la nueva venta
      await agregarVenta(nuevaVenta);
      
      // Cerrar el modal y mostrar mensaje de éxito
      setIsModalOpen(false);
      form.resetFields();
      message.success('Venta agregada correctamente');
    } catch (error) {
      console.error('Error al agregar venta:', error);
      message.error('Error al agregar la venta');
    }
  };

  return (
    <Layout className="main-layout">
      {/* Sidebar con navegación principal y bordes redondeados */}
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        breakpoint="lg" // Punto de quiebre para dispositivos móviles
        collapsedWidth={0} // El sidebar se oculta completamente cuando está colapsado
        width={isMobile ? 280 : 200} // Ancho del sidebar expandido
        onBreakpoint={(broken) => {
          // Colapsar automáticamente en pantallas pequeñas, pero solo si no estamos en una operación de datos
          if (broken && !isDataOperationRef.current && !sidebarLocked) {
            setCollapsed(true);
            setIsMobile(true);
          }
        }}
        // Prevenir re-renders innecesarios que causan el parpadeo
        className="main-sidebar"
        style={{ 
          // Asegurarse de que el sidebar esté por encima del contenido en móviles
          zIndex: isMobile ? 1001 : 1000,
          // Asegurarse de que el sidebar se vea completo sin scroll
          height: '100vh',
          overflow: 'hidden'
        }}
      >
        {/* Logo de la aplicación */}
        <div className="app-logo">
          <span className="logo-icon">📊</span>
          <span className="logo-text">
            <span className="logo-text-main">VenTrack</span>
          </span>
        </div>
        
        {/* Botón de Nueva Venta - siempre visible para acceso rápido */}
        <div className="new-sale-button-container">
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => handleNavigation('nueva-venta')}
            className="sidebar-new-sale-button"
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
              key: '6',
              icon: <GiftOutlined />,
              label: 'Pedidos',
              onClick: () => handleNavigation('6')
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
        
        {/* Perfil de usuario en la parte inferior del sidebar */}
        <div className="sidebar-footer">
          <Dropdown
            menu={{
              items: [
                {
                  key: 'profile',
                  icon: <UserOutlined />,
                  label: 'Mi Perfil',
                  onClick: () => handleNavigation('profile')
                },
                {
                  key: 'logout',
                  icon: <LogoutOutlined />,
                  label: 'Cerrar Sesión',
                  danger: true,
                  onClick: () => {
                    logout();
                    window.location.href = '/login';
                    message.success('Sesión cerrada correctamente');
                  }
                }
              ]
            }}
            trigger={['click']}
            placement="topRight"
            overlayClassName="sidebar-user-dropdown"
          >
            <div className="sidebar-user-profile">
              <div className="sidebar-user-avatar">
                <UserOutlined />
              </div>
              <div className="sidebar-user-info">
                <div className="sidebar-user-name">
                  {usuario?.nombre ? usuario.nombre.split(' ')[0] : 'Usuario'}
                </div>
                <div className="sidebar-user-role">
                  {usuario?.rol ? (
                    usuario.rol === 'admin' ? 'Administrador' :
                    usuario.rol === 'vendedor' ? 'Vendedor' :
                    usuario.rol === 'supervisor' ? 'Supervisor' : 
                    usuario.rol
                  ) : ''}
                </div>
              </div>
              <div className="sidebar-user-dropdown-icon">
                <DownOutlined />
              </div>
            </div>
          </Dropdown>
        </div>
      </Sider>
      {/* Contenido principal que se ajusta al estado del sidebar */}
      <Layout 
        className={`main-content-wrapper ${collapsed ? 'collapsed' : 'expanded'}`}
        onClick={(e) => {
          // Cerrar el sidebar al hacer clic en el overlay (solo en versión móvil)
          if (isMobile && !collapsed && e.target.classList.contains('main-content-wrapper')) {
            setCollapsed(true);
          }
        }}
      >
        {/* Header fijo con botón para colapsar/expandir el sidebar */}
        <Header className="main-header">
          <div className="header-left">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => {
                // Marcar como operación de datos para prevenir parpadeos
                isDataOperationRef.current = true;
                setCollapsed(!collapsed);
                // Restablecer después de un breve periodo
                setTimeout(() => {
                  isDataOperationRef.current = false;
                }, 500);
              }}
              className="collapse-button"
              aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
            />
            <div className="header-divider"></div>
            <h2 className="page-title">{currentPage}</h2>
          </div>
        </Header>
        
        {/* Área de contenido principal donde se renderiza el contenido específico de cada página */}
        <Content
          className={`main-content-area ${collapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}
        >
          {children}
          {/* Botón flotante para agregar ventas en dispositivos móviles */}
          {isMobile && (
            <AddSaleButton
              onClick={() => handleNavigation('nueva-venta')}
              isMobile={true}
            />
          )}
        </Content>
      </Layout>
      
      {/* Modal para agregar nueva venta - se muestra al hacer clic en el botón de Nueva Venta */}
      <Modal
        title="Agregar Nueva Venta"
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={handleCancel}
        okText="Aceptar"
        cancelText="Cancelar"
        destroyOnClose // Destruye el contenido al cerrarse para resetear el formulario
        maskClosable={false}
        width="600px"
      >
        <VentaFormulario form={form} editingVenta={null} loading={false} />
      </Modal>
    </Layout>
  );
};

export default MainLayout;
