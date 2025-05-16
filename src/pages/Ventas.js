import React from 'react';
import { Card } from 'antd';
import MainLayout from '../components/layout/MainLayout';
import VentasTable from '../components/dashboard/VentasTable';
import BotonFlotanteVenta from '../components/dashboard/BotonFlotanteVenta';

/**
 * Página de gestión de ventas
 * @returns {JSX.Element} Página de Ventas
 */
const Ventas = () => {
  return (
    <MainLayout currentPage="Ventas">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0 }}>Gestión de Ventas</h1>
      </div>
      
      <Card title="Todas las Ventas">
        <VentasTable />
      </Card>
      
      <BotonFlotanteVenta />
    </MainLayout>
  );
};

export default Ventas;
