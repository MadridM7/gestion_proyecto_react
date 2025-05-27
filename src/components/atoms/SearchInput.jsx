/**
 * @fileoverview Componente de entrada de búsqueda reutilizable
 */
import React, { useEffect, useState } from 'react';
import { Input, Tooltip } from 'antd';
import { SearchOutlined, InfoCircleOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

/**
 * Componente atómico para entrada de búsqueda
 * @param {Object} props - Propiedades del componente
 * @param {string} props.placeholder - Texto de placeholder
 * @param {string} props.value - Valor del input
 * @param {Function} props.onChange - Función a ejecutar cuando cambia el valor
 * @param {boolean} props.allowClear - Indica si se muestra el botón para limpiar
 * @param {Object} props.style - Estilos adicionales
 * @param {boolean} props.isMobile - Indica si el componente se muestra en versión móvil
 * @param {string} props.className - Clases adicionales
 * @param {number} props.maxLength - Longitud máxima permitida (por defecto 50)
 * @returns {JSX.Element} Componente de entrada de búsqueda
 */
const SearchInput = ({ 
  placeholder = 'Buscar...', 
  value, 
  onChange, 
  allowClear = true,
  style = {},
  isMobile = false,
  className = '',
  maxLength = 50
}) => {
  const [inputValue, setInputValue] = useState(value || '');
  
  // Sincronizar el valor interno con el valor de prop
  useEffect(() => {
    setInputValue(value || '');
  }, [value]);
  
  // Manejar cambios en el input con validación
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    // Filtrar caracteres no deseados (opcional, depende de los requisitos)
    const filteredValue = newValue.replace(/[<>\\]/g, '');
    setInputValue(filteredValue);
    onChange(filteredValue);
  };
  return (
    <Tooltip title="Ingrese términos de búsqueda (máximo 50 caracteres)" placement="topLeft">
      <Input
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        prefix={<SearchOutlined />}
        suffix={
          <Tooltip title={`${inputValue.length}/${maxLength} caracteres`}>
            <InfoCircleOutlined style={{ color: inputValue.length >= maxLength * 0.8 ? '#ff4d4f' : 'rgba(0,0,0,.45)' }} />
          </Tooltip>
        }
        allowClear={allowClear}
        maxLength={maxLength}
        showCount
        style={{ width: '100%', ...style }}
        className={`search-input ${isMobile ? 'mobile-search-input' : ''} ${className}`}
      />
    </Tooltip>
  );
};

SearchInput.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  allowClear: PropTypes.bool,
  style: PropTypes.object,
  isMobile: PropTypes.bool,
  className: PropTypes.string,
  maxLength: PropTypes.number
};

export default SearchInput;
