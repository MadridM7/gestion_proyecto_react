import React, { useCallback } from 'react';
import { Form, Input, Select, DatePicker, Button, message } from 'antd';
import { DollarOutlined, UserOutlined, CalendarOutlined } from '@ant-design/icons';
import { useVentas } from '../../context/VentasContext';
import moment from 'moment';

const { Option } = Select;

/**
 * Componente de formulario para agregar nuevas ventas
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.onCancel - Función para cancelar el formulario
 * @returns {JSX.Element} Formulario de venta
 */
const VentaForm = ({ onCancel }) => {
  const [form] = Form.useForm();
  const { agregarVenta } = useVentas();
  
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
  
  // Función para manejar el envío del formulario
  const handleSubmit = (values) => {
    try {
      // Formatear el monto (eliminar puntos y convertir a número)
      const montoNumerico = parseInt(values.monto.replace(/\./g, ''), 10);
      
      if (isNaN(montoNumerico) || montoNumerico <= 0) {
        message.error('El monto debe ser un número válido mayor que cero');
        return;
      }
      
      // Crear la nueva venta
      const nuevaVenta = {
        id: generateId(),
        fechaHora: values.fechaHora.toDate(),
        vendedor: values.vendedor,
        monto: montoNumerico,
        tipoPago: values.tipoPago
      };
      
      // Agregar la venta
      agregarVenta(nuevaVenta);
      
      // Mostrar mensaje de éxito
      message.success('Venta agregada correctamente');
      
      // Resetear el formulario y cerrar el modal
      form.resetFields();
      if (onCancel) onCancel();
    } catch (error) {
      console.error('Error al agregar venta:', error);
      message.error('Error al agregar la venta');
    }
  };
  
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        fechaHora: moment(),
        vendedor: '',
        monto: '',
        tipoPago: 'efectivo'
      }}
    >
      <Form.Item
        name="vendedor"
        label="Vendedor"
        rules={[{ required: true, message: 'Por favor ingrese el nombre del vendedor' }]}
      >
        <Input prefix={<UserOutlined />} placeholder="Nombre del vendedor" />
      </Form.Item>
      
      <Form.Item
        name="monto"
        label="Monto (CLP)"
        rules={[{ required: true, message: 'Por favor ingrese el monto de la venta' }]}
      >
        <Input 
          prefix={<DollarOutlined />} 
          placeholder="Monto en pesos chilenos" 
          onChange={formatearMontoCLP}
          inputMode="numeric"
        />
      </Form.Item>
      
      <Form.Item
        name="fechaHora"
        label="Fecha y Hora"
        rules={[{ required: true, message: 'Por favor seleccione la fecha y hora' }]}
      >
        <DatePicker 
          showTime 
          format="DD/MM/YYYY HH:mm" 
          placeholder="Seleccione fecha y hora"
          style={{ width: '100%' }}
          prefix={<CalendarOutlined />}
        />
      </Form.Item>
      
      <Form.Item
        name="tipoPago"
        label="Tipo de Pago"
        rules={[{ required: true, message: 'Por favor seleccione el tipo de pago' }]}
      >
        <Select placeholder="Seleccione el tipo de pago">
          <Option value="efectivo">Efectivo</Option>
          <Option value="debito">Débito</Option>
          <Option value="credito">Crédito</Option>
        </Select>
      </Form.Item>
      
      <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
        <Button style={{ marginRight: 8 }} onClick={onCancel}>Cancelar</Button>
        <Button type="primary" htmlType="submit">Guardar</Button>
      </Form.Item>
    </Form>
  );
};

export default VentaForm;
