import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import esES from 'antd/lib/locale/es_ES';
import { VentasProvider } from './context/VentasContext';
import { UsuariosProvider } from './context/UsuariosContext';
import { ProductosProvider } from './context/ProductosContext';
import { PedidosProvider } from './context/PedidosContext';
import { AuthProvider } from './context/AuthContext';

// Importar páginas
import Dashboard from './pages/Dashboard';
import Ventas from './pages/Ventas';
import Reportes from './pages/Reportes';
import Usuarios from './pages/Usuarios';
import Productos from './pages/Productos';
import Pedidos from './pages/Pedidos';
import Login from './pages/Login';
import Perfil from './pages/Perfil';

// Importar estilos
import 'antd/dist/reset.css';
import 'react-datepicker/dist/react-datepicker.css';
import './styles/components/atoms/ReactDatePickerWrapper.css';
import './styles/global/datepicker-fixes.css';

/**
 * Componente de ruta protegida que verifica la autenticación
 * @param {Object} props - Propiedades del componente
 * @returns {JSX.Element} Ruta protegida
 */
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('currentUser');
  
  if (!isAuthenticated) {
    // Si no está autenticado, redirigir a login
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  return (
    <ConfigProvider locale={esES}>
      <VentasProvider>
        <UsuariosProvider>
          <ProductosProvider>
            <PedidosProvider>
              <AuthProvider>
              <Router>
                <Routes>
                  {/* Ruta de login pública */}
                  <Route path="/login" element={<Login />} />
                  
                  {/* Rutas protegidas que requieren autenticación */}
                  <Route path="/" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/ventas" element={
                    <ProtectedRoute>
                      <Ventas />
                    </ProtectedRoute>
                  } />
                  <Route path="/reportes" element={
                    <ProtectedRoute>
                      <Reportes />
                    </ProtectedRoute>
                  } />
                  <Route path="/usuarios" element={
                    <ProtectedRoute>
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
                  
                  {/* Redirigir rutas desconocidas a login si no está autenticado o a dashboard si lo está */}
                  <Route path="*" element={
                    localStorage.getItem('currentUser') ? 
                      <Navigate to="/" /> : 
                      <Navigate to="/login" />
                  } />
                </Routes>
              </Router>
              </AuthProvider>
            </PedidosProvider>
          </ProductosProvider>
        </UsuariosProvider>
      </VentasProvider>
    </ConfigProvider>
  );
}

export default App;
