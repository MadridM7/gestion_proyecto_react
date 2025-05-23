/**
 * @fileoverview Formulario para agregar o editar ventas
 */
import React, { useCallback, useEffect, useMemo } from 'react';
import { Form, Input, Select, InputNumber } from 'antd';
import { DollarOutlined, UserOutlined, CreditCardOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import { useUsuarios } from '../../context/UsuariosContext';

const { Option } = Select;

/**
 * Componente molecular para formulario de ventas
 * @param {Object} props - Propiedades del componente
 * @returns {JSX.Element} Formulario para agregar o editar ventas
 */
const VentaFormulario = ({ 
  form, 
  editingVenta = null,
  loading = false
}) => {
  // Obtener usuarios del contexto
  const { usuarios } = useUsuarios();
  // Función para generar un ID único
  const generateId = useCallback(() => {
    return `V${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
  }, []);
  
  // Función para validar y formatear el monto en CLP
  const handleMontoChange = (value) => {
    if (value !== null && value !== undefined) {
      // Asegurarse de que el valor sea positivo
      const montoPositivo = Math.max(0, value);
      // Redondear al entero más cercano
      const montoRedondeado = Math.round(montoPositivo);
      form.setFieldsValue({ monto: montoRedondeado });
    }
  };
  
  // Tipos de pago disponibles
  const tiposPago = [
    { value: 'efectivo', label: 'Efectivo' },
    { value: 'debito', label: 'Débito' },
    { value: 'credito', label: 'Crédito' }
  ];
  
  // Preparar lista de vendedores desde el contexto de usuarios con useMemo
  const vendedores = useMemo(() => {
    return usuarios
      ? usuarios
          .filter(usuario => usuario.activo) // Solo usuarios activos
          .map(usuario => ({
            value: usuario.nombre,
            label: usuario.nombre
          }))
      : [];
  }, [usuarios]);
  
  // Inicializar el formulario cuando cambia la venta
  useEffect(() => {
    if (editingVenta) {
      form.setFieldsValue({
        ...editingVenta,
        monto: Number(editingVenta.monto)
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        id: generateId(),
        tipoPago: 'efectivo',
        vendedor: vendedores.length > 0 ? vendedores[0].value : '',
        monto: 0
      });
    }
  }, [editingVenta, form, generateId, vendedores]);

  return (
    <Form
      form={form}
      layout="vertical"
      disabled={loading}
    >
      {/* Campo oculto para el ID */}
      <Form.Item
        name="id"
        hidden
      >
        <Input />
      </Form.Item>
      
      {/* Monto */}
      <Form.Item
        name="monto"
        label="Monto"
        rules={[
          { required: true, message: 'Por favor ingresa el monto' },
          { type: 'number', min: 0, message: 'El monto debe ser mayor o igual a 0' }
        ]}
      >
        <InputNumber
          style={{ width: '100%' }}
          formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
          parser={value => value.replace(/\$\s?|(\.*)|(,*)/g, '')}
          placeholder="Ingresa el monto"
          onChange={handleMontoChange}
          min={0}
          precision={0}
          prefix={<DollarOutlined />}
          suffix="CLP"
        />
      </Form.Item>
      
      {/* Tipo de pago */}
      <Form.Item
        name="tipoPago"
        label="Tipo de pago"
        rules={[{ required: true, message: 'Por favor selecciona el tipo de pago' }]}
      >
        <Select 
          placeholder="Selecciona el tipo de pago"
          suffixIcon={<CreditCardOutlined />}
          showSearch
          optionFilterProp="children"
        >
          {tiposPago.map(tipo => (
            <Option key={tipo.value} value={tipo.value}>{tipo.label}</Option>
          ))}
        </Select>
      </Form.Item>
      
      {/* Nombre del usuario (vendedor) */}
      <Form.Item
        name="vendedor"
        label="Nombre del usuario"
        rules={[{ required: true, message: 'Por favor selecciona el usuario' }]}
      >
        <Select 
          placeholder="Selecciona el usuario"
          suffixIcon={<UserOutlined />}
          showSearch
          optionFilterProp="children"
        >
          {vendedores.map(vendedor => (
            <Option key={vendedor.value} value={vendedor.value}>{vendedor.label}</Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  );
};

VentaFormulario.propTypes = {
  form: PropTypes.object.isRequired,
  editingVenta: PropTypes.object
};

export default VentaFormulario;
