/**
 * @fileoverview Formulario para agregar o editar pedidos
 */
import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Select, Row, Col } from 'antd';
import { UserOutlined, EnvironmentOutlined, DollarOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import ReactDatePickerWrapper from '../atoms/ReactDatePickerWrapper';

const { Option } = Select;

/**
 * Componente para el formulario de pedidos
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.form - Instancia del formulario
 * @param {Object} props.initialValues - Valores iniciales del formulario
 * @returns {JSX.Element} Formulario para pedidos
 */
const PedidoFormulario = ({ form, initialValues }) => {
  // Efecto para inicializar el formulario con los valores iniciales
  useEffect(() => {
    if (initialValues) {
      // Convertir la fecha de string a objeto Date
      const fechaPedido = initialValues.fechaPedido ? new Date(initialValues.fechaPedido) : new Date();
      
      form.setFieldsValue({
        ...initialValues,
        fechaPedido
      });
    } else {
      // Valores por defecto para un nuevo pedido
      form.setFieldsValue({
        estado: 'pendiente',
        fechaPedido: new Date()
      });
    }
  }, [form, initialValues]);
  
  return (
    <Form
      form={form}
      layout="vertical"
      requiredMark={false}
    >
      <Row gutter={16}>
        <Col xs={24}>
          <Form.Item
            name="nombreCliente"
            label="Nombre del Cliente"
            rules={[
              { required: true, message: 'Por favor ingresa el nombre del cliente' },
              { min: 3, message: 'El nombre debe tener al menos 3 caracteres' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Nombre del cliente" 
            />
          </Form.Item>
        </Col>
      </Row>
      
      <Row gutter={16}>
        <Col xs={24}>
          <Form.Item
            name="direccion"
            label="Dirección de Entrega"
            rules={[
              { required: true, message: 'Por favor ingresa la dirección de entrega' },
              { min: 5, message: 'La dirección debe tener al menos 5 caracteres' }
            ]}
          >
            <Input 
              prefix={<EnvironmentOutlined />} 
              placeholder="Dirección de entrega" 
            />
          </Form.Item>
        </Col>
      </Row>
      
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            name="monto"
            label="Monto a Pagar"
            rules={[
              { required: true, message: 'Por favor ingresa el monto' },
              { type: 'number', min: 1, message: 'El monto debe ser mayor a 0' }
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              prefix={<DollarOutlined />}
              placeholder="Monto a pagar"
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
              parser={value => value.replace(/\$\s?|[.]/g, '')}
              precision={0}
              min={0}
              suffix="CLP"
            />
          </Form.Item>
        </Col>
        
        <Col xs={24} md={12}>
          <Form.Item
            name="estado"
            label="Estado del Pedido"
            rules={[
              { required: true, message: 'Por favor selecciona el estado' }
            ]}
          >
            <Select placeholder="Selecciona el estado">
              <Option value="pagado">Pagado</Option>
              <Option value="pendiente">Pendiente</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      
      <Row gutter={16}>
        <Col xs={24}>
          <ReactDatePickerWrapper
            name="fechaPedido"
            label="Fecha del Pedido"
            value={form.getFieldValue('fechaPedido')}
            onChange={(date) => form.setFieldsValue({ fechaPedido: date })}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="dd/MM/yyyy HH:mm"
            placeholderText="Selecciona fecha y hora"
          />
        </Col>
      </Row>
      
      <Row gutter={16}>
        <Col xs={24}>
          <Form.Item
            name="detallePedido"
            label="Detalle del Pedido"
            rules={[
              { required: true, message: 'Por favor ingresa el detalle del pedido' },
              { max: 500, message: 'El detalle no puede exceder los 500 caracteres' }
            ]}
          >
            <Input.TextArea 
              rows={4} 
              placeholder="Detalle de los productos solicitados" 
              maxLength={500}
              showCount
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

PedidoFormulario.propTypes = {
  form: PropTypes.object.isRequired,
  initialValues: PropTypes.object
};

export default PedidoFormulario;
