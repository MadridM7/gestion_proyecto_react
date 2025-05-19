/**
 * @fileoverview Componente para filtros de ventas
 */
import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useVentas } from '../../context/VentasContext';
import '../../styles/components/molecules/VentasFilters.css';

/**
 * Componente para filtros de ventas
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.onFilterChange - Función a ejecutar cuando cambia el filtro
 * @returns {JSX.Element} Componente de filtros
 */
const VentasFilters = ({ onFilterChange }) => {
  const { ventas } = useVentas();
  const [vendedores, setVendedores] = useState([]);
  const [filtroActivo, setFiltroActivo] = useState('todos');
  
  // Extraer vendedores únicos de las ventas
  useEffect(() => {
    if (ventas && ventas.length > 0) {
      const uniqueVendedores = [...new Set(ventas.map(v => v.vendedor).filter(Boolean))];
      setVendedores(uniqueVendedores);
    }
  }, [ventas]);
  
  // Manejar cambio en el select
  const handleChange = (value) => {
    setFiltroActivo(value);
    onFilterChange(value === 'todos' ? null : value);
  };
  
  // Preparar opciones para el select
  const options = [
    { value: 'todos', label: 'Todos los vendedores' },
    ...vendedores.map(vendedor => ({ value: vendedor, label: vendedor }))
  ];
  
  return (
    <div className="ventas-filters">
      <Select
        placeholder="Filtrar por vendedor"
        value={filtroActivo}
        onChange={handleChange}
        options={options}
        style={{ width: 180 }}
        suffixIcon={<UserOutlined />}
      />
    </div>
  );
};

export default VentasFilters;
