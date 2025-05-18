/**
 * @fileoverview Componente atómico para seleccionar clientes
 */
import React, { useState, useEffect } from 'react';
import { Select, Spin } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

const { Option } = Select;

/**
 * Componente atómico para seleccionar clientes
 * @param {Object} props - Propiedades del componente
 * @returns {JSX.Element} Selector de clientes
 */
const ClienteSelector = ({
  value,
  onChange,
  placeholder = 'Seleccionar cliente',
  style = {},
  disabled = false,
  allowClear = true,
  showSearch = true,
  size = 'middle',
  clientes = [],
  loading = false,
  onSearch,
  fetchClientes
}) => {
  const [data, setData] = useState(clientes);
  const [fetching, setFetching] = useState(loading);
  
  // Cargar clientes al montar el componente si se proporciona la función fetchClientes
  useEffect(() => {
    if (fetchClientes && clientes.length === 0) {
      setFetching(true);
      fetchClientes().then(newClientes => {
        setData(newClientes);
        setFetching(false);
      }).catch(() => {
        setFetching(false);
      });
    }
  }, [fetchClientes, clientes]);
  
  // Actualizar datos cuando cambian los clientes
  useEffect(() => {
    setData(clientes);
  }, [clientes]);
  
  // Manejar búsqueda
  const handleSearch = (value) => {
    if (onSearch) {
      setFetching(true);
      onSearch(value).then(results => {
        setData(results);
        setFetching(false);
      }).catch(() => {
        setFetching(false);
      });
    }
  };
  
  return (
    <Select
      showSearch={showSearch}
      value={value}
      placeholder={placeholder}
      style={{ width: '100%', ...style }}
      defaultActiveFirstOption={false}
      showArrow
      filterOption={!onSearch}
      onSearch={onSearch ? handleSearch : undefined}
      onChange={onChange}
      notFoundContent={fetching ? <Spin size="small" /> : 'No hay resultados'}
      disabled={disabled}
      allowClear={allowClear}
      size={size}
    >
      {data.map(cliente => (
        <Option key={cliente.id} value={cliente.id}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <UserOutlined style={{ marginRight: 8, color: '#1890ff' }} />
            <span>{cliente.nombre}</span>
            {cliente.empresa && (
              <span style={{ color: '#8c8c8c', marginLeft: 8 }}>
                ({cliente.empresa})
              </span>
            )}
          </div>
        </Option>
      ))}
    </Select>
  );
};

ClienteSelector.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  style: PropTypes.object,
  disabled: PropTypes.bool,
  allowClear: PropTypes.bool,
  showSearch: PropTypes.bool,
  size: PropTypes.string,
  clientes: PropTypes.array,
  loading: PropTypes.bool,
  onSearch: PropTypes.func,
  fetchClientes: PropTypes.func
};

export default ClienteSelector;
