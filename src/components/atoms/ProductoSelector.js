/**
 * @fileoverview Componente atómico para seleccionar productos
 */
import React, { useState, useEffect } from 'react';
import { Select, Spin, Tag } from 'antd';
import { ShoppingOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

const { Option } = Select;

/**
 * Componente atómico para seleccionar productos
 * @param {Object} props - Propiedades del componente
 * @returns {JSX.Element} Selector de productos
 */
const ProductoSelector = ({
  value,
  onChange,
  placeholder = 'Seleccionar producto',
  style = {},
  disabled = false,
  allowClear = true,
  showSearch = true,
  size = 'middle',
  productos = [],
  loading = false,
  onSearch,
  fetchProductos,
  mode = 'single'
}) => {
  const [data, setData] = useState(productos);
  const [fetching, setFetching] = useState(loading);
  
  // Cargar productos al montar el componente si se proporciona la función fetchProductos
  useEffect(() => {
    if (fetchProductos && productos.length === 0) {
      setFetching(true);
      fetchProductos().then(newProductos => {
        setData(newProductos);
        setFetching(false);
      }).catch(() => {
        setFetching(false);
      });
    }
  }, [fetchProductos, productos]);
  
  // Actualizar datos cuando cambian los productos
  useEffect(() => {
    setData(productos);
  }, [productos]);
  
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
  
  // Renderizar etiqueta para modo múltiple
  const tagRender = (props) => {
    const { label, value, closable, onClose } = props;
    const producto = data.find(p => p.id === value);
    
    return (
      <Tag
        color={producto?.categoria === 'Servicio' ? 'blue' : 'green'}
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3 }}
      >
        {label}
      </Tag>
    );
  };
  
  return (
    <Select
      mode={mode}
      showSearch={showSearch}
      value={value}
      placeholder={placeholder}
      style={{ width: '100%', ...style }}
      defaultActiveFirstOption={false}
      showArrow
      filterOption={!onSearch ? (input, option) => 
        option.children.props.children[1].props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      : false}
      onSearch={onSearch ? handleSearch : undefined}
      onChange={onChange}
      notFoundContent={fetching ? <Spin size="small" /> : 'No hay resultados'}
      disabled={disabled}
      allowClear={allowClear}
      size={size}
      tagRender={mode === 'multiple' ? tagRender : undefined}
      optionLabelProp="label"
    >
      {data.map(producto => (
        <Option 
          key={producto.id} 
          value={producto.id}
          label={producto.nombre}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ShoppingOutlined style={{ marginRight: 8, color: producto.categoria === 'Servicio' ? '#1890ff' : '#52c41a' }} />
            <span>{producto.nombre}</span>
            <span style={{ color: '#8c8c8c', marginLeft: 8 }}>
              (${producto.precio.toFixed(2)})
            </span>
          </div>
        </Option>
      ))}
    </Select>
  );
};

ProductoSelector.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array
  ]),
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  style: PropTypes.object,
  disabled: PropTypes.bool,
  allowClear: PropTypes.bool,
  showSearch: PropTypes.bool,
  size: PropTypes.string,
  productos: PropTypes.array,
  loading: PropTypes.bool,
  onSearch: PropTypes.func,
  fetchProductos: PropTypes.func,
  mode: PropTypes.oneOf(['single', 'multiple', 'tags'])
};

export default ProductoSelector;
