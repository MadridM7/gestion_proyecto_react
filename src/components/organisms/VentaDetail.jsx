/**
 * @fileoverview Componente para mostrar detalles de una venta o editarla
 */
import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Tag, Divider, Empty, Timeline, Button, Popconfirm, message, Form, Input, Select, InputNumber, Table } from 'antd';
import { 
  ShoppingCartOutlined, 
  UserOutlined, 
  CreditCardOutlined, 
  CalendarOutlined,
  NumberOutlined,
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  MinusCircleOutlined
} from '@ant-design/icons';
import { useVentas } from '../../context/VentasContext';
import { useUsuarios } from '../../context/UsuariosContext';
import { useProductos } from '../../context/ProductosContext';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
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
  const { usuarios } = useUsuarios();
  const { productos } = useProductos();
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [ventaProductos, setVentaProductos] = useState([]);
  
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

  // Inicializar productos de la venta cuando se edita
  useEffect(() => {
    if (venta && venta.productos) {
      setVentaProductos(venta.productos);
    }
  }, [venta]);

  // Manejar edición de venta
  const handleEdit = () => {
    setIsEditing(true);
    setVentaProductos(venta.productos || []);
    form.setFieldsValue({
      ...venta,
      monto: venta.monto ? Number(venta.monto) : 0,
      tipoPago: venta.tipoPago || 'Efectivo',
      vendedor: venta.vendedor || ''
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
      
      // Calcular el monto total basado en los productos
      const montoCalculado = ventaProductos.reduce((total, producto) => {
        return total + (producto.precio * producto.cantidad);
      }, 0);
      
      // Preparar los datos actualizados
      const datosActualizados = {
        ...values,
        monto: montoCalculado > 0 ? montoCalculado : montoNumerico,
        productos: ventaProductos,
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
  if (!venta) {
    return (
      <Card className="venta-detail-card">
        <Empty description="Selecciona una venta para ver sus detalles" />
      </Card>
    );
  }

  // Formatear monto utilizando la utilidad formatCurrency
  const formatMonto = (valor) => {
    return formatCurrency(valor);
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

  // Formatear fecha y hora utilizando la utilidad formatDateTime
  const formatFechaHora = (fecha) => {
    if (!fecha) return 'No disponible';
    return formatDateTime(fecha);
  };

  // Tipos de pago disponibles
  const tiposPago = [
    { value: 'Efectivo', label: 'Efectivo' },
    { value: 'Débito', label: 'Débito' },
    { value: 'Crédito', label: 'Crédito' },
    { value: 'Transferencia', label: 'Transferencia' }
  ];

  // Usuarios disponibles (vendedores) desde el contexto y opciones de productos
  const usuariosOptions = usuarios.map(usuario => ({
    value: usuario.nombre,
    label: usuario.nombre
  }));
  
  const productosOptions = productos.map(producto => ({
    value: producto.id,
    label: producto.nombre,
    precio: producto.precioVenta || producto.precio || 0
  }));
  
  // Manejar la adición de un producto a la venta
  const handleAddProduct = (productoId) => {
    const productoSeleccionado = productos.find(p => p.id === productoId);
    
    if (productoSeleccionado) {
      // Verificar si el producto ya está en la lista
      const productoExistente = ventaProductos.find(p => p.id === productoId);
      
      if (productoExistente) {
        // Si ya existe, incrementar la cantidad
        const nuevosProductos = ventaProductos.map(p => {
          if (p.id === productoId) {
            return { ...p, cantidad: p.cantidad + 1 };
          }
          return p;
        });
        setVentaProductos(nuevosProductos);
      } else {
        // Si no existe, agregarlo con cantidad 1
        const nuevoProducto = {
          id: productoSeleccionado.id,
          nombre: productoSeleccionado.nombre,
          precio: productoSeleccionado.precioVenta || productoSeleccionado.precio || 0,
          cantidad: 1
        };
        setVentaProductos([...ventaProductos, nuevoProducto]);
      }
    }
  };
  
  // Manejar la eliminación de un producto de la venta
  const handleRemoveProduct = (productoId) => {
    const nuevosProductos = ventaProductos.filter(p => p.id !== productoId);
    setVentaProductos(nuevosProductos);
  };
  
  // Manejar el cambio de cantidad de un producto
  const handleQuantityChange = (productoId, cantidad) => {
    if (cantidad <= 0) {
      handleRemoveProduct(productoId);
      return;
    }
    
    const nuevosProductos = ventaProductos.map(p => {
      if (p.id === productoId) {
        return { ...p, cantidad };
      }
      return p;
    });
    
    setVentaProductos(nuevosProductos);
  };

  return (
    <Card 
      title={!inMobileModal ? <div className="venta-detail-title"><ShoppingCartOutlined /> {isEditing ? 'Editar Venta' : 'Detalles de la Venta'}</div> : null}
      className="venta-detail-card ventas-card"
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
            autoComplete="off"
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
              help="Persona que realizó la venta"
            >
              <Select 
                placeholder="Selecciona el vendedor"
                suffixIcon={<UserOutlined />}
                showSearch
                optionFilterProp="children"
                options={usuariosOptions}
              />
            </Form.Item>
            
            <Form.Item
              name="monto"
              label="Monto"
              rules={[
                { required: true, message: 'Por favor ingresa el monto' },
                { type: 'number', min: 0, message: 'El monto debe ser mayor o igual a 0' }
              ]}
              help="Monto de la venta (valor numérico positivo)"
            >
              <InputNumber
                style={{ width: '100%' }}
                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                parser={value => value.replace(/\$\s?|(\.*)/g, '')}
                placeholder="Ingresa el monto"
                onChange={handleMontoChange}
                min={0}
                precision={0}
                prefix={<DollarOutlined />}
                suffix="CLP"
              />
            </Form.Item>
            
            <Form.Item
              name="tipoPago"
              label="Tipo de Pago"
              rules={[{ required: true, message: 'Por favor selecciona el tipo de pago' }]}
              help="Método de pago utilizado"
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
            
            {/* Edición de productos */}
            <Divider orientation="left">Productos</Divider>
            
            {/* Selector para agregar productos */}
            <Form.Item
              label="Agregar producto"
              help="Seleccione un producto para agregarlo a la venta"
            >
              <Select 
                placeholder="Seleccionar producto"
                style={{ width: '100%' }}
                showSearch
                optionFilterProp="label"
                onChange={handleAddProduct}
                options={productosOptions}
              />
            </Form.Item>
            
            {/* Tabla de productos en la venta */}
            {ventaProductos.length > 0 ? (
              <div className="venta-productos-edit-list">
                <Table 
                  dataSource={ventaProductos} 
                  rowKey="id"
                  pagination={false}
                  size="small"
                  columns={[
                    {
                      title: 'Producto',
                      dataIndex: 'nombre',
                      key: 'nombre',
                    },
                    {
                      title: 'Precio',
                      dataIndex: 'precio',
                      key: 'precio',
                      render: (precio) => formatMonto(precio)
                    },
                    {
                      title: 'Cantidad',
                      dataIndex: 'cantidad',
                      key: 'cantidad',
                      width: 120,
                      render: (cantidad, record) => (
                        <InputNumber
                          min={1}
                          value={cantidad}
                          onChange={(value) => handleQuantityChange(record.id, value)}
                          style={{ width: '100%' }}
                        />
                      )
                    },
                    {
                      title: 'Subtotal',
                      key: 'subtotal',
                      render: (_, record) => formatMonto(record.precio * record.cantidad)
                    },
                    {
                      title: 'Acciones',
                      key: 'action',
                      width: 80,
                      render: (_, record) => (
                        <Button 
                          type="text" 
                          danger 
                          icon={<MinusCircleOutlined />}
                          onClick={() => handleRemoveProduct(record.id)}
                        />
                      )
                    }
                  ]}
                  summary={(pageData) => {
                    const total = pageData.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
                    return (
                      <Table.Summary.Row>
                        <Table.Summary.Cell index={0} colSpan={3} align="right">
                          <strong>Total:</strong>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={1} colSpan={2}>
                          <strong>{formatMonto(total)}</strong>
                        </Table.Summary.Cell>
                      </Table.Summary.Row>
                    );
                  }}
                />
              </div>
            ) : (
              <Empty description="No hay productos en esta venta" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
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
              <Descriptions.Item label="Fecha y Hora">
                <CalendarOutlined /> {formatFechaHora(venta.fechaHora)}
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
