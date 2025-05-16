import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import esES from 'antd/lib/locale/es_ES';
import { VentasProvider } from './context/VentasContext';
import { UsuariosProvider } from './context/UsuariosContext';

// Importar páginas
import Dashboard from './pages/Dashboard';
import Ventas from './pages/Ventas';
import Reportes from './pages/Reportes';
import Usuarios from './pages/Usuarios';

// Importar estilos
import './App.css';
import 'antd/dist/reset.css';

function App() {
  return (
    <ConfigProvider locale={esES}>
      <VentasProvider>
        <UsuariosProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/ventas" element={<Ventas />} />
              <Route path="/reportes" element={<Reportes />} />
              <Route path="/usuarios" element={<Usuarios />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Router>
        </UsuariosProvider>
      </VentasProvider>
    </ConfigProvider>
  );
}

export default App;
