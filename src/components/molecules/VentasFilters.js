/**
 * @fileoverview Componente para filtros de ventas
 */
import React, { useState, useEffect } from 'react';
import { Select, Tooltip } from 'antd';
import { UserOutlined, FilterOutlined } from '@ant-design/icons';
import { useVentas } from '../../context/VentasContext';
import '../../styles/components/molecules/VentasFilters.css';

/**
 * Componente para filtros de ventas
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.onFilterChange - Función a ejecutar cuando cambia el filtro
 * @param {boolean} props.isMobile - Indica si el componente se muestra en versión móvil
 * @returns {JSX.Element} Componente de filtros
 */
const VentasFilters = ({ onFilterChange, isMobile = false }) => {
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
      <Tooltip title="Filtrar ventas por vendedor" placement="topLeft">
        <Select
          placeholder={isMobile ? "Vendedor" : "Filtrar por vendedor"}
          value={filtroActivo}
          onChange={handleChange}
          options={options}
          style={{ width: isMobile ? 120 : 180 }}
          suffixIcon={<UserOutlined />}
          className={isMobile ? 'mobile-filter-select' : ''}
          showSearch
          optionFilterProp="label"
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          dropdownRender={(menu) => (
            <>
              <div style={{ padding: '4px 8px', display: 'flex', alignItems: 'center' }}>
                <FilterOutlined style={{ marginRight: 8 }} />
                <span>Seleccione un vendedor</span>
              </div>
              {menu}
            </>
          )}
        />
      </Tooltip>
    </div>
  );
};

export default VentasFilters;
