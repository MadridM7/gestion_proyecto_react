/**
 * @fileoverview Componente de entrada de búsqueda reutilizable
 */
import React from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

/**
 * Componente atómico para entrada de búsqueda
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.isMobile - Indica si el componente se muestra en versión móvil
 * @returns {JSX.Element} Componente de entrada de búsqueda
 */
const SearchInput = ({ 
  placeholder = 'Buscar...', 
  value, 
  onChange, 
  allowClear = true,
  style = {},
  isMobile = false,
  className = ''
}) => {
  return (
    <Input
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      prefix={<SearchOutlined />}
      allowClear={allowClear}
      style={{ width: '100%', ...style }}
      className={`search-input ${isMobile ? 'mobile-search-input' : ''} ${className}`}
    />
  );
};

SearchInput.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  allowClear: PropTypes.bool,
  style: PropTypes.object,
  isMobile: PropTypes.bool,
  className: PropTypes.string
};

export default SearchInput;
