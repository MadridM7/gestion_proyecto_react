/**
 * @fileoverview Componente principal de la aplicación
 * Integra todos los proveedores de contexto y define las rutas
 */
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, Spin } from 'antd';
import esES from 'antd/lib/locale/es_ES';

// Importar estilos
import 'antd/dist/reset.css';
import 'react-datepicker/dist/react-datepicker.css';
import './styles/components/atoms/ReactDatePickerWrapper.css';
import './styles/global/datepicker-fixes.css';
import './styles/components/atoms/LoadingSpinner.css';

// Proveedores de contexto
import { VentasProvider } from './context/VentasContext.jsx';
import { UsuariosProvider } from './context/UsuariosContext.jsx';
import { ProductosProvider } from './context/ProductosContext.jsx';
import { PedidosProvider } from './context/PedidosContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

// Importar páginas críticas (carga inmediata)
import Login from './pages/Login.jsx';

// Importar componente para gestionar el título de la página
import PageTitle from './components/atoms/PageTitle.jsx';

// Importar páginas con carga diferida (lazy loading)
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const Ventas = lazy(() => import('./pages/Ventas.jsx'));
const Reportes = lazy(() => import('./pages/Reportes.jsx'));
const Usuarios = lazy(() => import('./pages/Usuarios.jsx'));
const Productos = lazy(() => import('./pages/Productos.jsx'));
const Pedidos = lazy(() => import('./pages/Pedidos.jsx'));
const Perfil = lazy(() => import('./pages/Perfil.jsx'));
const Rendimiento = lazy(() => import('./pages/Rendimiento.jsx'));



/**
 * Componente de ruta protegida que verifica la autenticación y los permisos de rol
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Componentes hijos
 * @param {string[]} [props.allowedRoles] - Roles permitidos para acceder a esta ruta
 * @returns {JSX.Element} Ruta protegida
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  // Verificar si el usuario está autenticado
  const userString = localStorage.getItem('currentUser');
  
  if (!userString) {
    // Si no está autenticado, redirigir a login
    return <Navigate to="/login" />;
  }
  
  // Si hay roles permitidos especificados, verificar si el usuario tiene permiso
  if (allowedRoles.length > 0) {
    try {
      const user = JSON.parse(userString);
      const userRole = user.rol;
      
      // Si el rol del usuario no está en la lista de roles permitidos, redirigir a su página principal según su rol
      if (!allowedRoles.includes(userRole)) {
        // Si es administrador, redirigir al dashboard, si es vendedor, a ventas
        if (userRole === 'admin') {
          return <Navigate to="/" />;
        } else {
          return <Navigate to="/ventas" />;
        }
      }
    } catch (error) {
      console.error('Error al parsear usuario:', error);
      localStorage.removeItem('currentUser');
      return <Navigate to="/login" />;
    }
  }
  
  // Envolver el componente en Suspense para manejar la carga diferida
  return (
    <Suspense fallback={
      <div className="loading-container">
        <Spin size="large" />
        <div style={{ marginTop: '10px' }}>Cargando...</div>
      </div>
    }>
      {children}
    </Suspense>
  );
};

function App() {
  return (
    <ConfigProvider locale={esES}>
      <Router>
        {/* Componente para actualizar el título de la página según la ruta */}
        <PageTitle defaultTitle="Sistema de Gestión" />
        <VentasProvider>
          <UsuariosProvider>
            <ProductosProvider>
              <PedidosProvider>
                <AuthProvider>
                  <Routes>
                  {/* Ruta de login pública */}
                  <Route path="/login" element={<Login />} />
                  
                  {/* Rutas protegidas que requieren autenticación */}
                  <Route path="/" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/ventas" element={
                    <ProtectedRoute>
                      <Ventas />
                    </ProtectedRoute>
                  } />
                  <Route path="/reportes" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <Reportes />
                    </ProtectedRoute>
                  } />
                  <Route path="/usuarios" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <Usuarios />
                    </ProtectedRoute>
                  } />
                  <Route path="/productos" element={
                    <ProtectedRoute>
                      <Productos />
                    </ProtectedRoute>
                  } />
                  <Route path="/pedidos" element={
                    <ProtectedRoute>
                      <Pedidos />
                    </ProtectedRoute>
                  } />
                  <Route path="/perfil" element={
                    <ProtectedRoute>
                      <Perfil />
                    </ProtectedRoute>
                  } />
                  <Route path="/rendimiento" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <Rendimiento />
                    </ProtectedRoute>
                  } />
                  
                  {/* Redirigir rutas desconocidas según el rol del usuario */}
                  <Route path="*" element={
                    (() => {
                      const userString = localStorage.getItem('currentUser');
                      if (!userString) {
                        return <Navigate to="/login" />;
                      }
                      
                      try {
                        const user = JSON.parse(userString);
                        // Si es administrador, redirigir al dashboard, si es vendedor, a ventas
                        if (user.rol === 'admin') {
                          return <Navigate to="/" />;
                        } else {
                          return <Navigate to="/ventas" />;
                        }
                      } catch (error) {
                        console.error('Error al parsear usuario:', error);
                        localStorage.removeItem('currentUser');
                        return <Navigate to="/login" />;
                      }
                    })()
                  } />
                </Routes>
                </AuthProvider>
              </PedidosProvider>
            </ProductosProvider>
          </UsuariosProvider>
        </VentasProvider>
      </Router>
    </ConfigProvider>
  );
}

export default App;
