import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import esES from 'antd/lib/locale/es_ES';
import { VentasProvider } from './context/VentasContext';
import { UsuariosProvider } from './context/UsuariosContext';
import { ProductosProvider } from './context/ProductosContext';

// Importar páginas
import Dashboard from './pages/Dashboard';
import Ventas from './pages/Ventas';
import Reportes from './pages/Reportes';
import Usuarios from './pages/Usuarios';
import Productos from './pages/Productos';

// Importar estilos
import 'antd/dist/reset.css';
import 'react-datepicker/dist/react-datepicker.css';
import './styles/components/atoms/ReactDatePickerWrapper.css';
import './styles/global/datepicker-fixes.css';

function App() {
  return (
    <ConfigProvider locale={esES}>
      <VentasProvider>
        <UsuariosProvider>
          <ProductosProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/ventas" element={<Ventas />} />
                <Route path="/reportes" element={<Reportes />} />
                <Route path="/usuarios" element={<Usuarios />} />
                <Route path="/productos" element={<Productos />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Router>
          </ProductosProvider>
        </UsuariosProvider>
      </VentasProvider>
    </ConfigProvider>
  );
}

export default App;
