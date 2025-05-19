/**
 * @fileoverview Formulario para agregar o editar productos
 */
import React, { useEffect } from 'react';
import { Form, Input, InputNumber } from 'antd';
import { DollarOutlined, ShoppingOutlined, PercentageOutlined, TagOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

/**
 * Componente molecular para formulario de productos
 * @param {Object} props - Propiedades del componente
 * @returns {JSX.Element} Formulario para agregar o editar productos
 */
const ProductoFormulario = ({ 
  form, 
  producto = null,
  loading = false
}) => {
  // Inicializar el formulario cuando cambia el producto
  useEffect(() => {
    if (producto) {
      form.setFieldsValue({
        ...producto
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        margenGanancia: 30,
      });
    }
  }, [producto, form]);
  
  // Calcular precio de venta automáticamente cuando cambia el precio de compra
  const handlePrecioCompraChange = (value) => {
    if (value) {
      const margenGanancia = form.getFieldValue('margenGanancia') || 30;
      calcularPrecioVenta(value, margenGanancia);
    }
  };
  
  // Calcular precio de venta cuando cambia el margen
  const handleMargenChange = (value) => {
    if (value) {
      const precioCompra = form.getFieldValue('precioCompra');
      if (precioCompra) {
        calcularPrecioVenta(precioCompra, value);
      }
    }
  };
  
  // Función para calcular el precio de venta
  const calcularPrecioVenta = (precioCompra, margenGanancia) => {
    const precioSinIva = precioCompra * (1 + margenGanancia / 100);
    form.setFieldsValue({ precioVenta: Math.round(precioSinIva) });
  };
  
  return (
    <Form
      form={form}
      layout="vertical"
      disabled={loading}
    >
      {/* ID (oculto para nuevos productos) */}
      {producto && (
        <Form.Item
          name="id"
          hidden
        >
          <Input />
        </Form.Item>
      )}
      
      {/* Nombre del producto */}
      <Form.Item
        name="nombre"
        label="Nombre del producto"
        rules={[
          { required: true, message: 'Por favor ingresa el nombre del producto' },
          { min: 3, message: 'El nombre debe tener al menos 3 caracteres' }
        ]}
      >
        <Input 
          prefix={<ShoppingOutlined />} 
          placeholder="Nombre del producto" 
          maxLength={100}
        />
      </Form.Item>
      
      {/* Categoría del producto */}
      <Form.Item
        name="categoria"
        label="Categoría"
      >
        <Input 
          prefix={<TagOutlined />} 
          placeholder="Categoría del producto" 
          maxLength={50}
        />
      </Form.Item>
      
      {/* Precio de compra */}
      <Form.Item
        name="precioCompra"
        label="Precio de compra"
        rules={[
          { required: true, message: 'Por favor ingresa el precio de compra' },
          { type: 'number', min: 0, message: 'El precio debe ser mayor o igual a 0' }
        ]}
      >
        <InputNumber
          style={{ width: '100%' }}
          formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.replace(/\$\s?|(,*)/g, '')}
          placeholder="Precio de compra"
          onChange={handlePrecioCompraChange}
          prefix={<DollarOutlined />}
        />
      </Form.Item>
      
      {/* Margen de ganancia */}
      <Form.Item
        name="margenGanancia"
        label="Margen de ganancia"
        rules={[
          { required: true, message: 'Por favor ingresa el margen de ganancia' },
          { type: 'number', min: 0, max: 100, message: 'El margen debe estar entre 0 y 100%' }
        ]}
      >
        <InputNumber
          style={{ width: '100%' }}
          min={0}
          max={100}
          formatter={value => `${value}%`}
          parser={value => value.replace('%', '')}
          placeholder="Margen de ganancia"
          onChange={handleMargenChange}
          prefix={<PercentageOutlined />}
        />
      </Form.Item>
      
      {/* Precio de venta */}
      <Form.Item
        name="precioVenta"
        label="Precio de venta"
        rules={[
          { required: true, message: 'Por favor ingresa el precio de venta' },
          { type: 'number', min: 0, message: 'El precio debe ser mayor o igual a 0' }
        ]}
      >
        <InputNumber
          style={{ width: '100%' }}
          formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.replace(/\$\s?|(,*)/g, '')}
          placeholder="Precio de venta"
          prefix={<DollarOutlined />}
        />
      </Form.Item>
    </Form>
  );
};

ProductoFormulario.propTypes = {
  form: PropTypes.object.isRequired,
  producto: PropTypes.object,
  loading: PropTypes.bool,
  calcularPrecioVenta: PropTypes.func
};

export default ProductoFormulario;
