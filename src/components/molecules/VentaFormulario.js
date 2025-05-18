/**
 * @fileoverview Formulario para agregar o editar ventas
 */
import React, { useCallback, useEffect } from 'react';
import { Form, Input, Select } from 'antd';
import { DollarOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

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
  // Función para generar un ID único
  const generateId = useCallback(() => {
    return `V${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
  }, []);
  
  // Función para formatear el monto en CLP
  const formatearMontoCLP = (e) => {
    const value = e.target.value;
    // Eliminar todos los puntos y caracteres no numéricos
    const numero = value.replace(/\D/g, '');
    // Formatear con puntos como separadores de miles
    if (numero) {
      const formateado = Number(numero).toLocaleString('es-CL');
      form.setFieldsValue({ monto: formateado });
    }
  };
  
  // Tipos de pago disponibles
  const tiposPago = [
    { value: 'efectivo', label: 'Efectivo' },
    { value: 'debito', label: 'Débito' },
    { value: 'credito', label: 'Crédito' }
  ];

  // Usuarios disponibles (vendedores)
  const usuarios = [
    { value: 'Laura Fernández', label: 'Laura Fernández' },
    { value: 'Carlos Mendoza', label: 'Carlos Mendoza' },
    { value: 'Ana Martínez', label: 'Ana Martínez' }
  ];
  
  // Inicializar el formulario cuando cambia la venta
  useEffect(() => {
    if (editingVenta) {
      form.setFieldsValue({
        ...editingVenta,
        monto: Number(editingVenta.monto).toLocaleString('es-CL')
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        id: generateId(),
        tipoPago: 'efectivo',
        vendedor: 'Laura Fernández'
      });
    }
  }, [editingVenta, form, generateId]);

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
        rules={[{ required: true, message: 'Por favor ingresa el monto' }]}
      >
        <Input
          prefix={<DollarOutlined />}
          placeholder="Ingresa el monto"
          onChange={formatearMontoCLP}
          suffix="CLP"
        />
      </Form.Item>
      
      {/* Tipo de pago */}
      <Form.Item
        name="tipoPago"
        label="Tipo de pago"
        rules={[{ required: true, message: 'Por favor selecciona el tipo de pago' }]}
      >
        <Select placeholder="Selecciona el tipo de pago">
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
        <Select placeholder="Selecciona el usuario">
          {usuarios.map(usuario => (
            <Option key={usuario.value} value={usuario.value}>{usuario.label}</Option>
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
