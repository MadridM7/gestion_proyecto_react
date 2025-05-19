/**
 * @fileoverview Tabla de datos estandarizada para toda la aplicación
 */
import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import PropTypes from 'prop-types';
import SearchInput from '../atoms/SearchInput';
import '../../styles/components/organisms/DataTable.css';

/**
 * Componente organismo para tablas de datos estandarizadas
 * @param {Object} props - Propiedades del componente
 * @returns {JSX.Element} Tabla de datos estandarizada
 */
const DataTable = ({ 
  columns, 
  dataSource, 
  loading = false,
  rowKey = 'id',
  searchPlaceholder = 'Buscar...',
  searchFields = [],
  pagination = true,
  scroll = { x: 'max-content' },
  size = 'middle',
  onChange,
  onRow,
  showSearch = true,
  className = '',
  title,
  footer,
  searchExtra // Elemento adicional para mostrar junto al buscador
}) => {
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState('');
  
  // Actualizar los datos filtrados cuando cambien los datos de origen
  useEffect(() => {
    if (Array.isArray(dataSource)) {
      setFilteredData(dataSource);
    } else {
      setFilteredData([]);
    }
  }, [dataSource]);
  
  // Función para manejar la búsqueda global
  const handleSearch = (value) => {
    setSearchText(value);
    
    if (!value || searchFields.length === 0) {
      setFilteredData(dataSource);
      return;
    }
    
    const searchLower = value.toLowerCase();
    const filtered = dataSource.filter(item => {
      return searchFields.some(field => {
        const fieldValue = field.split('.').reduce((obj, key) => obj && obj[key], item);
        if (fieldValue === undefined || fieldValue === null) return false;
        return String(fieldValue).toLowerCase().includes(searchLower);
      });
    });
    
    setFilteredData(filtered);
  };
  
  // Configuración de paginación
  const paginationConfig = pagination === true 
    ? { 
        pageSize: 10, 
        showSizeChanger: true, 
        showTotal: (total) => `Total: ${total} registros` 
      } 
    : pagination === false 
      ? false 
      : { ...pagination };
  
  return (
    <div className={`data-table-container ${className}`}>
      {/* Barra de búsqueda con elementos adicionales */}
      {showSearch && searchFields.length > 0 && (
        <div className="data-table-header">
          <SearchInput 
            placeholder={searchPlaceholder} 
            value={searchText} 
            onChange={handleSearch} 
            className={`data-table-search ${searchExtra ? 'with-extra' : ''}`}
          />
          {searchExtra && (
            <div className="search-extra-container">
              {searchExtra}
            </div>
          )}
        </div>
      )}
      
      {/* Tabla de datos */}
      <Table 
        columns={columns} 
        dataSource={filteredData} 
        rowKey={rowKey} 
        loading={loading}
        pagination={paginationConfig}
        scroll={scroll}
        size={size}
        onChange={onChange}
        onRow={onRow}
        title={title}
        footer={footer}
      />
    </div>
  );
};

DataTable.propTypes = {
  columns: PropTypes.array.isRequired,
  dataSource: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  searchPlaceholder: PropTypes.string,
  searchFields: PropTypes.arrayOf(PropTypes.string),
  pagination: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  scroll: PropTypes.object,
  size: PropTypes.string,
  onChange: PropTypes.func,
  onRow: PropTypes.func,
  showSearch: PropTypes.bool,
  className: PropTypes.string,
  title: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  footer: PropTypes.oneOfType([PropTypes.func, PropTypes.node])
};

export default DataTable;
