/**
 * @fileoverview Componente para mostrar detalles de un producto o editarlo
 */
import React, { useState } from 'react';
import { Card, Descriptions, Divider, Empty, Image, Button, Popconfirm, message, Form, Input, InputNumber, Select } from 'antd';
import { 
  ShoppingOutlined, 
  BarChartOutlined, 
  CalendarOutlined,
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  // TagOutlined no se utiliza
  NumberOutlined
} from '@ant-design/icons';
import { useProductos } from '../../context/ProductosContext';
import '../../styles/components/organisms/ProductoDetail.css';

const { Option } = Select;

/**
 * Componente para mostrar detalles de un producto o editarlo directamente en el panel
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.producto - Datos del producto a mostrar
 * @param {Function} props.onEdit - Función para editar el producto
 * @returns {JSX.Element} Componente de detalles del producto
 */
const ProductoDetail = ({ producto, onEdit }) => {
  const { eliminarProducto, actualizarProducto } = useProductos();
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  
  // Manejar eliminación de producto
  const handleDelete = async () => {
    try {
      await eliminarProducto(producto.id);
      message.success('Producto eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      message.error('Error al eliminar el producto');
    }
  };

  // Funciones para manejar la edición
  const handleEdit = () => {
    setIsEditing(true);
    form.setFieldsValue({
      ...producto,
      precioCompra: producto.precioCompra ? new Intl.NumberFormat('es-CL').format(producto.precioCompra) : '',
      precioVenta: producto.precioVenta ? new Intl.NumberFormat('es-CL').format(producto.precioVenta) : ''
    });
  };
  
  const handleSave = () => {
    form.validateFields().then(values => {
      // Limpiar formatos de precios para guardar solo los números
      const precioCompra = values.precioCompra ? parseInt(values.precioCompra.replace(/\D/g, ''), 10) : 0;
      const precioVenta = values.precioVenta ? parseInt(values.precioVenta.replace(/\D/g, ''), 10) : 0;
      const margenGanancia = values.margenGanancia || 0;
      
      const productoActualizado = {
        ...values,
        precioCompra,
        precioVenta,
        margenGanancia,
        id: producto.id,
        // Mantener otros campos que no se editan en el formulario
        imagen: producto.imagen,
        fechaRegistro: producto.fechaRegistro,
        ventasTotales: producto.ventasTotales || 0
      };
      
      actualizarProducto(producto.id, productoActualizado);
      setIsEditing(false);
      message.success('Producto actualizado correctamente');
    }).catch(error => {
      console.error('Error al validar el formulario:', error);
      message.error('Por favor completa todos los campos requeridos');
    });
  };
  
  // Función para formatear precios en formato CLP
  const formatearPrecioCLP = (e, campo) => {
    const valor = e.target.value.replace(/[^0-9]/g, '');
    if (valor) {
      const valorFormateado = new Intl.NumberFormat('es-CL').format(valor);
      form.setFieldsValue({
        [campo]: valorFormateado
      });
      
      // Si se está editando el precio de compra y hay un margen, calcular el precio de venta
      if (campo === 'precioCompra') {
        const margen = form.getFieldValue('margenGanancia');
        if (margen) {
          calcularPrecioVenta(parseInt(valor, 10), margen);
        }
      }
    }
  };
  
  // Función para calcular el precio de venta basado en el precio de compra y el margen
  const calcularPrecioVenta = (precioCompra, margen) => {
    if (precioCompra && margen) {
      const precioVenta = Math.round(precioCompra * (1 + margen / 100));
      const precioVentaFormateado = new Intl.NumberFormat('es-CL').format(precioVenta);
      form.setFieldsValue({
        precioVenta: precioVentaFormateado
      });
    }
  };
  
  // Función para cancelar la edición
  const handleCancel = () => {
    setIsEditing(false);
    form.resetFields();
    message.info('Edición cancelada');
  };
  
  if (!producto) {
    return (
      <Card className="producto-detail-card">
        <Empty description="Selecciona un producto para ver sus detalles" />
      </Card>
    );
  }

  // Formatear precio con separador de miles y formato CLP
  const formatPrecio = (valor) => {
    return `$${Number(valor).toLocaleString('es-CL')}`;
  };
  
  // Formatear fecha
  const formatFecha = (fecha) => {
    if (!fecha) return 'No disponible';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-CL', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
  };

  // Categorías disponibles
  const categorias = [
    { value: 'Electrónica', label: 'Electrónica' },
    { value: 'Ropa', label: 'Ropa' },
    { value: 'Hogar', label: 'Hogar' },
    { value: 'Alimentos', label: 'Alimentos' },
    { value: 'Otros', label: 'Otros' }
  ];

  return (
    <Card 
      title={<div className="producto-detail-title"><ShoppingOutlined /> {isEditing ? 'Editar Producto' : 'Detalles del Producto'}</div>}
      className="producto-detail-card"
      extra={
        producto && (
          <div className="producto-detail-actions">
            {isEditing ? (
              <>
                <Button 
                  icon={<SaveOutlined />} 
                  type="primary"
                  onClick={handleSave}
                  style={{ marginRight: 8 }}
                >
                  Guardar
                </Button>
                <Button 
                  icon={<CloseCircleOutlined />} 
                  onClick={handleCancel}
                >
                  Cancelar
                </Button>
              </>
            ) : (
              <>
                <Button 
                  icon={<EditOutlined />} 
                  type="primary"
                  onClick={handleEdit}
                  style={{ marginRight: 8 }}
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
              </>
            )}
          </div>
        )
      }
    >
      <div className="producto-detail-content">
        {isEditing ? (
          <Form
            form={form}
            layout="vertical"
            className="producto-edit-form"
          >
            <Form.Item
              name="id"
              label="ID de Producto"
              rules={[{ required: true, message: 'El ID es obligatorio' }]}
            >
              <Input prefix={<NumberOutlined />} disabled />
            </Form.Item>
            
            <Form.Item
              name="nombre"
              label="Nombre"
              rules={[{ required: true, message: 'Por favor ingresa el nombre del producto' }]}
            >
              <Input placeholder="Nombre del producto" />
            </Form.Item>
            
            <Form.Item
              name="categoria"
              label="Categoría"
              rules={[{ required: true, message: 'Por favor selecciona la categoría' }]}
            >
              <Select placeholder="Selecciona la categoría">
                {categorias.map(categoria => (
                  <Option key={categoria.value} value={categoria.value}>{categoria.label}</Option>
                ))}
              </Select>
            </Form.Item>
            
            <Form.Item
              name="precioCompra"
              label="Precio de Compra"
              rules={[{ required: true, message: 'Por favor ingresa el precio de compra' }]}
            >
              <Input
                prefix={<DollarOutlined />}
                placeholder="Precio de compra"
                onChange={(e) => formatearPrecioCLP(e, 'precioCompra')}
                suffix="CLP"
              />
            </Form.Item>
            
            <Form.Item
              name="margenGanancia"
              label="Margen de Ganancia (%)"
              rules={[{ required: true, message: 'Por favor ingresa el margen de ganancia' }]}
            >
              <InputNumber
                min={0}
                max={100}
                placeholder="Margen de ganancia"
                style={{ width: '100%' }}
                suffix="%"
              />
            </Form.Item>
            
            <Form.Item
              name="precioVenta"
              label="Precio de Venta"
              rules={[{ required: true, message: 'Por favor ingresa el precio de venta' }]}
            >
              <Input
                prefix={<DollarOutlined />}
                placeholder="Precio de venta"
                onChange={(e) => formatearPrecioCLP(e, 'precioVenta')}
                suffix="CLP"
              />
            </Form.Item>
            
            {/* No se incluyen campos de stock ya que no están en el JSON */}
          </Form>
        ) : (
          <>
            {producto.imagen && (
              <div className="producto-image-container">
                <Image
                  src={producto.imagen}
                  alt={producto.nombre}
                  fallback="data:image/png;base64,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"
                />
              </div>
            )}
            
            <Descriptions bordered column={1} className="producto-descriptions">
              <Descriptions.Item label="ID">{producto.id}</Descriptions.Item>
              <Descriptions.Item label="Nombre">{producto.nombre}</Descriptions.Item>
              <Descriptions.Item label="Categoría">
                {producto.categoria || 'Sin categoría'}
              </Descriptions.Item>
              <Descriptions.Item label="Precio Compra">
                {formatPrecio(producto.precioCompra || 0)}
              </Descriptions.Item>
              <Descriptions.Item label="Margen">
                {producto.margenGanancia ? `${producto.margenGanancia}%` : 'No definido'}
              </Descriptions.Item>
              <Descriptions.Item label="Precio Venta">
                {formatPrecio(producto.precioVenta || 0)}
              </Descriptions.Item>
              {/* No se muestran campos de stock ya que no están en el JSON */}
            </Descriptions>

            <Divider />
            
            <div className="producto-detail-footer">
              <div className="producto-detail-stat">
                <CalendarOutlined /> Fecha de registro: {producto.fechaRegistro ? formatFecha(producto.fechaRegistro) : 'No disponible'}
              </div>
              <div className="producto-detail-stat">
                <BarChartOutlined /> Ventas totales: {producto.ventasTotales || 0} unidades
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

export default ProductoDetail;
