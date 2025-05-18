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
 * @returns {JSX.Element} Componente de entrada de búsqueda
 */
const SearchInput = ({ 
  placeholder = 'Buscar...', 
  value, 
  onChange, 
  allowClear = true,
  style = {}
}) => {
  return (
    <Input
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      prefix={<SearchOutlined />}
      allowClear={allowClear}
      style={{ width: '100%', ...style }}
    />
  );
};

SearchInput.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  allowClear: PropTypes.bool,
  style: PropTypes.object
};

export default SearchInput;
