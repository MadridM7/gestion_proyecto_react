/**
 * @fileoverview Componente para mostrar detalles de una venta o editarla
 */
import React, { useState } from 'react';
import { Card, Descriptions, Tag, Divider, Empty, Timeline, Button, Popconfirm, message, Form, Input, Select } from 'antd';
import { 
  ShoppingCartOutlined, 
  UserOutlined, 
  CreditCardOutlined, 
  CalendarOutlined,
  ClockCircleOutlined,
  NumberOutlined,
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
  CloseCircleOutlined,
  DollarOutlined
} from '@ant-design/icons';
import { useVentas } from '../../context/VentasContext';
import '../../styles/components/organisms/VentaDetail.css';

const { Option } = Select;

/**
 * Componente para mostrar detalles de una venta o editarla directamente en el panel
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.venta - Datos de la venta a mostrar
 * @param {Function} props.onEdit - Función para editar la venta
 * @param {boolean} props.inMobileModal - Indica si el componente se muestra en un modal móvil
 * @returns {JSX.Element} Componente de detalles de la venta
 */
const VentaDetail = ({ venta, onEdit, inMobileModal = false }) => {
  const { eliminarVenta, actualizarVenta } = useVentas();
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  
  // Manejar eliminación de venta
  const handleDelete = async () => {
    try {
      await eliminarVenta(venta.id);
      message.success('Venta eliminada correctamente');
    } catch (error) {
      console.error('Error al eliminar venta:', error);
      message.error('Error al eliminar la venta');
    }
  };

  // Manejar edición de venta
  const handleEdit = () => {
    setIsEditing(true);
    form.setFieldsValue({
      ...venta,
      monto: venta.monto ? venta.monto.toString() : '0'
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
      // Convertir el monto de formato CLP a número
      const montoNumerico = values.monto ? Number(values.monto.replace(/\D/g, '')) : 0;
      
      // Preparar los datos actualizados
      const datosActualizados = {
        ...values,
        monto: montoNumerico,
        // Mantener los productos y otros campos que no se editan en el formulario
        productos: venta.productos || [],
        fechaHora: venta.fechaHora
      };
      
      // Llamar a actualizarVenta con el ID y los datos actualizados
      await actualizarVenta(venta.id, datosActualizados);
      message.success('Venta actualizada correctamente');
      setIsEditing(false);
      
      // Si existe onEdit, llamarlo para actualizar el estado del componente padre
      if (onEdit) {
        onEdit(null); // Resetear el estado de edición en el componente padre
      }
    } catch (error) {
      console.error('Error al actualizar venta:', error);
      message.error('Error al actualizar la venta');
    }
  };
  
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
  if (!venta) {
    return (
      <Card className="venta-detail-card">
        <Empty description="Selecciona una venta para ver sus detalles" />
      </Card>
    );
  }

  // Formatear monto con separador de miles y formato CLP
  const formatMonto = (valor) => {
    return `$${Number(valor).toLocaleString('es-CL')}`;
  };

  // Obtener color para el tipo de pago
  const getTipoPagoColor = (tipo) => {
    const tipos = {
      'Efectivo': 'green',
      'Débito': 'blue',
      'Crédito': 'orange',
      'Transferencia': 'purple'
    };
    return tipos[tipo] || 'default';
  };

  // Formatear fecha y hora
  const formatFecha = (fecha) => {
    if (!fecha) return 'No disponible';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-CL', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
  };

  const formatHora = (fecha) => {
    if (!fecha) return 'No disponible';
    const date = new Date(fecha);
    return date.toLocaleTimeString('es-CL', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Tipos de pago disponibles
  const tiposPago = [
    { value: 'Efectivo', label: 'Efectivo' },
    { value: 'Débito', label: 'Débito' },
    { value: 'Crédito', label: 'Crédito' },
    { value: 'Transferencia', label: 'Transferencia' }
  ];

  // Usuarios disponibles (vendedores)
  const usuarios = [
    { value: 'Laura Fernández', label: 'Laura Fernández' },
    { value: 'Carlos Mendoza', label: 'Carlos Mendoza' },
    { value: 'Ana Martínez', label: 'Ana Martínez' }
  ];

  return (
    <Card 
      title={!inMobileModal ? <div className="venta-detail-title"><ShoppingCartOutlined /> {isEditing ? 'Editar Venta' : 'Detalles de la Venta'}</div> : null}
      className="venta-detail-card"
      extra={
        venta && (
          <div className={`venta-detail-actions ${inMobileModal ? 'mobile-centered' : ''}`}>
            {isEditing ? (
              <div className="venta-action-buttons">
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
              <div className="venta-action-buttons">
                <Button 
                  icon={<EditOutlined />} 
                  type="primary"
                  onClick={handleEdit}
                >
                  Editar
                </Button>
                <Popconfirm
                  title="¿Estás seguro de eliminar esta venta?"
                  description="Esta acción no se puede deshacer y eliminará todos los datos asociados a esta venta."
                  onConfirm={handleDelete}
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
      <div className="venta-detail-content">
        {isEditing ? (
          <Form
            form={form}
            layout="vertical"
            className="venta-edit-form"
          >
            <Form.Item
              name="id"
              label="ID de Venta"
              rules={[{ required: true, message: 'El ID es obligatorio' }]}
            >
              <Input prefix={<NumberOutlined />} disabled />
            </Form.Item>
            
            <Form.Item
              name="vendedor"
              label="Vendedor"
              rules={[{ required: true, message: 'Por favor selecciona el vendedor' }]}
            >
              <Select placeholder="Selecciona el vendedor">
                {usuarios.map(usuario => (
                  <Option key={usuario.value} value={usuario.value}>{usuario.label}</Option>
                ))}
              </Select>
            </Form.Item>
            
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
            
            <Form.Item
              name="tipoPago"
              label="Tipo de Pago"
              rules={[{ required: true, message: 'Por favor selecciona el tipo de pago' }]}
            >
              <Select placeholder="Selecciona el tipo de pago">
                {tiposPago.map(tipo => (
                  <Option key={tipo.value} value={tipo.value}>{tipo.label}</Option>
                ))}
              </Select>
            </Form.Item>
            
            <Form.Item
              name="notas"
              label="Notas"
            >
              <Input.TextArea rows={4} placeholder="Notas adicionales sobre la venta" />
            </Form.Item>
          </Form>
        ) : (
          <>
            <Descriptions bordered column={1} className="venta-descriptions">
              <Descriptions.Item label="ID de Venta">
                <NumberOutlined /> {venta.id}
              </Descriptions.Item>
              <Descriptions.Item label="Vendedor">
                <UserOutlined /> {venta.vendedor || 'No especificado'}
              </Descriptions.Item>
              <Descriptions.Item label="Monto">
                {formatMonto(venta.monto || 0)}
              </Descriptions.Item>
              <Descriptions.Item label="Tipo de Pago">
                <CreditCardOutlined /> {' '}
                <Tag color={getTipoPagoColor(venta.tipoPago)}>
                  {venta.tipoPago || 'No especificado'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Fecha">
                <CalendarOutlined /> {formatFecha(venta.fechaHora)}
              </Descriptions.Item>
              <Descriptions.Item label="Hora">
                <ClockCircleOutlined /> {formatHora(venta.fechaHora)}
              </Descriptions.Item>
            </Descriptions>
            
            <Divider orientation="left">Productos</Divider>
            {venta.productos && venta.productos.length > 0 ? (
              <div className="venta-productos-list">
                <Timeline>
                  {venta.productos.map((producto, index) => (
                    <Timeline.Item key={index} color="blue">
                      <div className="venta-producto-item">
                        <div className="venta-producto-nombre">{producto.nombre}</div>
                        <div className="venta-producto-cantidad">Cantidad: {producto.cantidad}</div>
                        <div className="venta-producto-precio">Precio: {formatMonto(producto.precio)}</div>
                        <div className="venta-producto-subtotal">
                          Subtotal: {formatMonto(producto.cantidad * producto.precio)}
                        </div>
                      </div>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </div>
            ) : (
              <Empty description="No hay detalles de productos disponibles" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
            
            {venta.notas && (
              <>
                <Divider orientation="left">Notas</Divider>
                <div className="venta-notas">{venta.notas}</div>
              </>
            )}
          </>
        )}
      </div>
    </Card>
  );
};

export default VentaDetail;
