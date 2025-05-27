/**
 * @fileoverview Componente para mostrar detalles de un producto o editarlo
 */
import React, { useState } from 'react';
import { Card, Descriptions, Divider, Empty, Button, Popconfirm, message, Form, Input, InputNumber, Select } from 'antd';
import { 
  ShoppingOutlined, 
  TagOutlined, 
  DollarOutlined, 
  CalendarOutlined,
  NumberOutlined,
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
  CloseCircleOutlined,
  PercentageOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { useProductos } from '../../context/ProductosContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import '../../styles/components/organisms/ProductoDetail.css';

const { Option } = Select;

/**
 * Componente para mostrar detalles de un producto o editarlo directamente en el panel
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.producto - Datos del producto a mostrar
 * @param {Function} props.onEdit - Función para editar el producto
 * @param {boolean} props.inMobileModal - Indica si el componente se muestra en un modal móvil
 * @returns {JSX.Element} Componente de detalles del producto
 */
const ProductoDetail = ({ producto, onEdit, inMobileModal = false }) => {
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
      precioCompra: producto.precioCompra || 0,
      precioVenta: producto.precioVenta || 0,
      margenGanancia: producto.margenGanancia || 30
    });
  };
  
  const handleSave = () => {
    form.validateFields().then(values => {
      // Los valores ya vienen como números desde los InputNumber
      const precioCompra = values.precioCompra || 0;
      const precioVenta = values.precioVenta || 0;
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
  
  // Manejar cambios en el precio de compra
  const handlePrecioCompraChange = (value) => {
    if (value !== null && value !== undefined) {
      // Asegurarse de que el valor sea positivo
      const precioPositivo = Math.max(0, value);
      form.setFieldsValue({ precioCompra: precioPositivo });
      
      const margenGanancia = form.getFieldValue('margenGanancia') || 30;
      calcularPrecioVenta(precioPositivo, margenGanancia);
    }
  };
  
  // Manejar cambios en el precio de venta
  const handlePrecioVentaChange = (value) => {
    if (value !== null && value !== undefined) {
      // Asegurarse de que el valor sea positivo
      const precioPositivo = Math.max(0, value);
      form.setFieldsValue({ precioVenta: Math.round(precioPositivo) });
    }
  };
  
  // Manejar cambios en el margen de ganancia
  const handleMargenChange = (value) => {
    if (value !== null && value !== undefined) {
      // Asegurarse de que el valor esté en el rango correcto
      const margenAjustado = Math.max(0, Math.min(100, value));
      form.setFieldsValue({ margenGanancia: margenAjustado });
      
      const precioCompra = form.getFieldValue('precioCompra');
      if (precioCompra) {
        calcularPrecioVenta(precioCompra, margenAjustado);
      }
    }
  };
  
  // Función para calcular el precio de venta basado en el precio de compra y el margen
  const calcularPrecioVenta = (precioCompra, margen) => {
    if (precioCompra && margen) {
      const precioVenta = Math.round(precioCompra * (1 + margen / 100));
      form.setFieldsValue({
        precioVenta: precioVenta
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

  // Formatear precio utilizando la utilidad formatCurrency
  const formatPrecio = (valor) => {
    return formatCurrency(valor);
  };
  
  // Formatear fecha utilizando la utilidad formatDate
  const formatFecha = (fecha) => {
    if (!fecha) return 'No disponible';
    return formatDate(fecha);
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
      title={!inMobileModal ? <div className="producto-detail-title"><ShoppingOutlined /> {isEditing ? 'Editar Producto' : 'Detalles del Producto'}</div> : null}
      className="producto-detail-card productos-card"
      extra={
        producto && (
          <div className={`producto-detail-actions ${inMobileModal ? 'mobile-centered' : ''}`}>
            {isEditing ? (
              <div className="producto-action-buttons">
                <Button 
                  type="primary" 
                  icon={<SaveOutlined />} 
                  onClick={handleSave}
                >
                  Guardar
                </Button>
                <Button 
                  icon={<CloseCircleOutlined />} 
                  onClick={handleCancel}
                >
                  Cancelar
                </Button>
              </div>
            ) : (
              <div className="producto-action-buttons">
                <Button 
                  type="primary" 
                  icon={<EditOutlined />} 
                  onClick={handleEdit}
                >
                  Editar
                </Button>
                <Popconfirm
                  title="¿Estás seguro de eliminar este producto?"
                  onConfirm={handleDelete}
                  okText="Sí"
                  cancelText="No"
                >
                  <Button 
                    danger 
                    icon={<DeleteOutlined />}
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
      <div className="producto-detail-content">
        {isEditing ? (
          <Form
            form={form}
            layout="vertical"
            className="producto-edit-form"
            autoComplete="off"
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
              rules={[
                { required: true, message: 'Por favor ingresa el nombre del producto' },
                { min: 3, message: 'El nombre debe tener al menos 3 caracteres' },
                { max: 100, message: 'El nombre no puede exceder los 100 caracteres' },
                { pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s.,\-_()]+$/, message: 'El nombre contiene caracteres no permitidos' }
              ]}
              help="Nombre descriptivo del producto (3-100 caracteres)"
            >
              <Input 
                placeholder="Nombre del producto" 
                prefix={<ShoppingOutlined />}
                maxLength={100}
                showCount
              />
            </Form.Item>
            
            <Form.Item
              name="categoria"
              label="Categoría"
              rules={[{ required: true, message: 'Por favor selecciona la categoría' }]}
              help="Categoría a la que pertenece el producto"
            >
              <Select 
                placeholder="Selecciona la categoría"
                showSearch
                optionFilterProp="children"
                suffixIcon={<TagOutlined />}
              >
                {categorias.map(categoria => (
                  <Option key={categoria.value} value={categoria.value}>{categoria.label}</Option>
                ))}
              </Select>
            </Form.Item>
            
            <Form.Item
              name="precioCompra"
              label="Precio de Compra"
              rules={[
                { required: true, message: 'Por favor ingresa el precio de compra' },
                { type: 'number', min: 0, message: 'El precio debe ser mayor o igual a 0' }
              ]}
              help="Precio al que se adquiere el producto (valor numérico positivo)"
            >
              <InputNumber
                style={{ width: '100%' }}
                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                parser={value => value.replace(/\$\s?|(\.*)/g, '')}
                placeholder="Precio de compra"
                onChange={handlePrecioCompraChange}
                min={0}
                precision={0}
                prefix={<DollarOutlined />}
                suffix="CLP"
              />
            </Form.Item>
            
            <Form.Item
              name="margenGanancia"
              label="Margen de Ganancia (%)"
              rules={[
                { required: true, message: 'Por favor ingresa el margen de ganancia' },
                { type: 'number', min: 0, max: 100, message: 'El margen debe estar entre 0 y 100%' }
              ]}
              help="Porcentaje de ganancia sobre el precio de compra (0-100%)"
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                max={100}
                formatter={value => `${value}%`}
                parser={value => value.replace('%', '')}
                placeholder="Margen de ganancia"
                onChange={handleMargenChange}
                precision={1}
                prefix={<PercentageOutlined />}
              />
            </Form.Item>
            
            <Form.Item
              name="precioVenta"
              label="Precio de Venta"
              rules={[
                { required: true, message: 'Por favor ingresa el precio de venta' },
                { type: 'number', min: 0, message: 'El precio debe ser mayor o igual a 0' }
              ]}
              help="Precio final de venta al público (calculado automáticamente, pero puede modificarse)"
            >
              <InputNumber
                style={{ width: '100%' }}
                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                parser={value => value.replace(/\$\s?|(\.*)/g, '')}
                placeholder="Precio de venta"
                onChange={handlePrecioVentaChange}
                min={0}
                precision={0}
                prefix={<DollarOutlined />}
                suffix="CLP"
              />
            </Form.Item>
            
            {/* No se incluyen campos de stock ya que no están en el JSON */}
          </Form>
        ) : (
          <>
            {/* No se muestra imagen ya que no se maneja en el formulario */}
            
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
