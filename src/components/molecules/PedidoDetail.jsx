/**
 * @fileoverview Componente para mostrar los detalles de un pedido o editarlo
 */
import React, { useState } from 'react';
import { Card, Form, Input, Button, InputNumber, Select, Empty, message, Descriptions, Tag, Divider, Popconfirm, Tooltip } from 'antd';
import { 
  CloseCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
  ShoppingOutlined,
  DollarOutlined,
  NumberOutlined,
  UserOutlined,
  HomeOutlined,
  CheckCircleOutlined,
  WhatsAppOutlined,
} from '@ant-design/icons';
import { usePedidos } from '../../context/PedidosContext';
import PropTypes from 'prop-types';
import '../../styles/components/molecules/PedidoDetail.css';

const { Option } = Select;

/**
 * Componente para mostrar los detalles de un pedido o editarlo directamente en el panel
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.pedido - Datos del pedido a mostrar
 * @param {Function} props.onEdit - Función para editar el pedido
 * @param {Function} props.onDelete - Función para eliminar el pedido
 * @param {boolean} props.inMobileModal - Indica si el componente se muestra en un modal móvil
 * @returns {JSX.Element} Componente de detalles del pedido
 */
const PedidoDetail = ({ pedido, onEdit, onDelete, inMobileModal = false }) => {
  const { actualizarPedido, notificarPedido } = usePedidos();
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  
  /**
   * Maneja la notificación vía WhatsApp de un pedido específico
   */
  const handleNotificar = () => {
    try {
      const resultado = notificarPedido(pedido.id);
      
      if (resultado) {
        message.success('Notificación del pedido enviada correctamente');
      } else {
        message.error('Error al enviar la notificación del pedido');
      }
    } catch (error) {
      console.error('Error al notificar pedido:', error);
      message.error('Error al enviar la notificación del pedido');
    }
  };

  // Manejar eliminación de pedido
  const handleDelete = async () => {
    try {
      // En lugar de llamar directamente a eliminarPedido, usamos la función onDelete
      // que viene del componente padre, para evitar la doble eliminación
      if (onDelete) {
        onDelete(pedido.id);
      }
    } catch (error) {
      console.error('Error al eliminar pedido:', error);
      message.error('Error al eliminar el pedido');
    }
  };

  // Manejar edición de pedido
  const handleEdit = () => {
    setIsEditing(true);
    form.setFieldsValue({
      ...pedido,
      monto: pedido.monto ? Number(pedido.monto) : 0
    });
  };
  
  // Cancelar edición
  const handleCancelEdit = () => {
    setIsEditing(false);
    form.resetFields();
  };
  
  // Guardar cambios
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      // El monto ya viene como número desde el InputNumber
      const montoNumerico = values.monto || 0;
      
      // Preparar los datos actualizados
      const datosActualizados = {
        ...values,
        monto: montoNumerico,
        id: pedido.id // Asegurarse de mantener el ID original
      };
      
      // Llamar a actualizarPedido con el ID y los datos actualizados
      await actualizarPedido(pedido.id, datosActualizados);
      message.success('Pedido actualizado correctamente');
      setIsEditing(false);
      
      // Si existe onEdit, llamarlo para actualizar el estado del componente padre
      if (onEdit) {
        onEdit(null); // Resetear el estado de edición en el componente padre
      }
    } catch (error) {
      console.error('Error al actualizar pedido:', error);
      message.error('Error al actualizar el pedido');
    }
  };
  
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
  
  // Si no hay pedido seleccionado, mostrar mensaje
  if (!pedido) {
    return (
      <Card className="pedido-detail-card">
        <div className="pedido-empty-state">
          <Empty description="Selecciona un pedido para ver sus detalles" />
        </div>
      </Card>
    );
  }

  // Formatear monto con separador de miles y formato CLP
  const formatMonto = (valor) => {
    return `$${Number(valor).toLocaleString('es-CL')}`;
  };

  // Obtener color para el estado del pedido
  const getEstadoColor = (estado) => {
    const estados = {
      'pagado': 'green',
      'pendiente': 'orange'
    };
    return estados[estado] || 'default';
  };

  // Tipos de estado disponibles
  const tiposEstado = [
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'pagado', label: 'Pagado' }
  ];

  return (
    <Card 
      title={!inMobileModal ? <div className="pedido-detail-title"><ShoppingOutlined /> {isEditing ? 'Editar Pedido' : 'Detalles del Pedido'}</div> : null}
      className="pedido-detail-card"
      extra={
        pedido && (
          <div className={`pedido-detail-actions ${inMobileModal ? 'mobile-centered' : ''}`}>
            {isEditing ? (
              <div className="pedido-action-buttons">
                <Button 
                  icon={<SaveOutlined />} 
                  type="primary"
                  onClick={handleSave}
                >
                  Guardar
                </Button>
                <Button 
                  icon={<CloseCircleOutlined />} 
                  onClick={handleCancelEdit}
                >
                  Cancelar
                </Button>
              </div>
            ) : (
              <div className="pedido-action-buttons">
                <Button 
                  icon={<EditOutlined />} 
                  type="primary"
                  onClick={inMobileModal ? () => onEdit(pedido) : handleEdit}
                >
                  Editar
                </Button>
                <Tooltip title="Notificar este pedido vía WhatsApp">
                  <Button 
                    icon={<WhatsAppOutlined />} 
                    style={{ backgroundColor: '#25D366', borderColor: '#25D366', color: '#fff' }}
                    onClick={handleNotificar}
                  >
                    Notificar
                  </Button>
                </Tooltip>
                <Popconfirm
                  title="¿Estás seguro de eliminar este pedido?"
                  description="Esta acción no se puede deshacer y eliminará todos los datos asociados a este pedido."
                  onConfirm={inMobileModal ? () => onDelete(pedido.id) : handleDelete}
                  okText="Sí"
                  cancelText="No"
                >
                  <Button 
                    icon={<DeleteOutlined />} 
                    danger
                  >
                    Eliminar
                  </Button>
                </Popconfirm>
              </div>
            )}
          </div>
        )
      }
    >
      <div className="pedido-detail-content">
        {isEditing ? (
          <Form
            form={form}
            layout="vertical"
            className="pedido-edit-form"
          >
            <Form.Item
              name="id"
              label="ID de Pedido"
              rules={[{ required: true, message: 'El ID es obligatorio' }]}
            >
              <Input prefix={<NumberOutlined />} disabled />
            </Form.Item>
            
            <Form.Item
              name="nombreCliente"
              label="Nombre del Cliente"
              rules={[{ required: true, message: 'El nombre del cliente es obligatorio' }]}
              help="Persona que realizó el pedido"
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="Nombre del cliente" 
              />
            </Form.Item>
            
            <Form.Item
              name="direccion"
              label="Dirección"
              rules={[{ required: true, message: 'La dirección es obligatoria' }]}
              help="Dirección de entrega del pedido"
            >
              <Input 
                prefix={<HomeOutlined />}
                placeholder="Dirección de entrega" 
              />
            </Form.Item>
            
            <Form.Item
              name="estado"
              label="Estado"
              rules={[{ required: true, message: 'El estado es obligatorio' }]}
              help="Estado actual del pedido"
            >
              <Select 
                placeholder="Selecciona el estado"
                suffixIcon={<CheckCircleOutlined />}
                showSearch
                optionFilterProp="children"
              >
                {tiposEstado.map(tipo => (
                  <Option key={tipo.value} value={tipo.value}>{tipo.label}</Option>
                ))}
              </Select>
            </Form.Item>
            
            <Form.Item
              name="monto"
              label="Monto"
              rules={[
                { required: true, message: 'El monto es obligatorio' },
                { type: 'number', min: 0, message: 'El monto debe ser mayor o igual a 0' }
              ]}
              help="Monto del pedido (valor numérico positivo)"
            >
              <InputNumber
                style={{ width: '100%' }}
                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                parser={value => value.replace(/\$\s?|[.]/g, '')}
                placeholder="Ingresa el monto"
                onChange={handleMontoChange}
                min={0}
                precision={0}
                prefix={<DollarOutlined />}
                suffix="CLP"
              />
            </Form.Item>
            
            <Form.Item
              name="detallePedido"
              label="Detalle del Pedido"
              help="Descripción detallada de los productos solicitados"
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
          </Form>
        ) : (
          <>
            <Descriptions bordered column={1} className="pedido-descriptions">
              <Descriptions.Item label="ID de Pedido">
                <NumberOutlined /> {pedido.id}
              </Descriptions.Item>
              <Descriptions.Item label="Cliente">
                <UserOutlined /> {pedido.nombreCliente || 'No especificado'}
              </Descriptions.Item>
              <Descriptions.Item label="Dirección">
                <HomeOutlined /> {pedido.direccion || 'No especificada'}
              </Descriptions.Item>
              <Descriptions.Item label="Estado">
                <Tag color={getEstadoColor(pedido.estado)}>
                  {pedido.estado === 'pagado' ? 'Pagado' : 'Pendiente'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Monto">
                <DollarOutlined /> {formatMonto(pedido.monto || 0)}
              </Descriptions.Item>
            </Descriptions>
            
            <Divider orientation="left">Detalle del Pedido</Divider>
            
            {pedido.detallePedido ? (
              <div className="pedido-detalle-texto">
                {pedido.detallePedido}
              </div>
            ) : (
              <Empty description="No hay detalles del pedido disponibles" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </>
        )}
      </div>
    </Card>
  );
};

PedidoDetail.propTypes = {
  pedido: PropTypes.shape({
    id: PropTypes.string,
    nombreCliente: PropTypes.string,
    direccion: PropTypes.string,
    estado: PropTypes.string,
    monto: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    detallePedido: PropTypes.string
  }),
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  inMobileModal: PropTypes.bool
};

export default PedidoDetail;
