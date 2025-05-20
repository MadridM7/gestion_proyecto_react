/**
 * @fileoverview Componente para filtros rápidos de productos
 */
import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import { TagOutlined } from '@ant-design/icons';
import { useProductos } from '../../context/ProductosContext';
import '../../styles/components/molecules/ProductosFilters.css';

/**
 * Componente para filtros rápidos de productos
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.onFilterChange - Función a ejecutar cuando cambia el filtro
 * @param {boolean} props.isMobile - Indica si el componente se muestra en versión móvil
 * @returns {JSX.Element} Componente de filtros rápidos
 */
const ProductosFilters = ({ onFilterChange, isMobile = false }) => {
  const { productos } = useProductos();
  const [categorias, setCategorias] = useState([]);
  const [filtroActivo, setFiltroActivo] = useState('todos');
  
  // Extraer categorías únicas de los productos
  useEffect(() => {
    if (productos && productos.length > 0) {
      const uniqueCategorias = [...new Set(productos.map(p => p.categoria).filter(Boolean))];
      setCategorias(uniqueCategorias);
    }
  }, [productos]);
  
  // Manejar cambio en el select
  const handleChange = (value) => {
    setFiltroActivo(value);
    onFilterChange(value === 'todos' ? null : value);
  };
  
  // Preparar opciones para el select
  const options = [
    { value: 'todos', label: 'Todas las categorías' },
    ...categorias.map(cat => ({ value: cat, label: cat }))
  ];
  
  return (
    <div className="productos-filters">
      <Select
        placeholder={isMobile ? "Categoría" : "Filtrar por categoría"}
        value={filtroActivo}
        onChange={handleChange}
        options={options}
        style={{ width: isMobile ? 120 : 180 }}
        suffixIcon={<TagOutlined />}
        className={isMobile ? 'mobile-filter-select' : ''}
      />
    </div>
  );
};

export default ProductosFilters;
