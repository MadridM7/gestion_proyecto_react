/**
 * @fileoverview Página de gestión de productos con estructura Atomic Design
 */
import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import ProductosTemplate from '../components/templates/ProductosTemplate';
import ProductosDataTable from '../components/organisms/ProductosDataTable';
import ProductoFormulario from '../components/molecules/ProductoFormulario';
import useIsMobile from '../hooks/useIsMobile';
import '../styles/pages/Productos.css';

/**
 * Componente para la página de gestión de productos
 * Muestra una tabla con los productos y permite agregar, editar y eliminar productos
 * @returns {JSX.Element} Página de Productos
 */
const Productos = () => {
  const isMobile = useIsMobile();
  
  return (
    <MainLayout currentPage="Productos">
      <ProductosTemplate 
        ProductosDataTable={ProductosDataTable}
        ProductoFormulario={ProductoFormulario}
        isMobile={isMobile}
      />
    </MainLayout>
  );
};

export default Productos;
