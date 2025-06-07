/**
 * @fileoverview Formulario para agregar o editar ventas
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Form, 
  Input, 
  InputNumber, 
  Select,
  Table,
  Button,
} from 'antd';
import {
  ShoppingOutlined,
  PlusOutlined,
  DeleteOutlined,
  DollarOutlined,
  CreditCardOutlined,
  UserOutlined
} from '@ant-design/icons';
import PropTypes from 'prop-types';
import { useUsuarios } from '../../context/UsuariosContext';
import { useProductos } from '../../context/ProductosContext';
import '../../styles/components/molecules/VentaFormulario.css';

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
  // Estados para manejar la selección de productos
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productQuantity, setProductQuantity] = useState(1);
  const [selectedProductId, setSelectedProductId] = useState(null);
  
  // Obtener usuarios y productos del contexto
  const { usuarios } = useUsuarios();
  const { productos } = useProductos();
  
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
  
  // Preparar lista de productos para el selector
  const productOptions = useMemo(() => {
    return productos
      ? productos.map(producto => ({
          value: producto.id,
          label: producto.nombre,
          precio: producto.precio
        }))
      : [];
  }, [productos]);
  
  // Función para calcular el total de la venta basado en los productos seleccionados
  const calcularTotalProductos = useCallback((productos) => {
    const total = productos.reduce((total, producto) => {
      return total + (producto.precio * producto.cantidad);
    }, 0);
    // Asegurarse de que el total nunca sea menor a 1
    return Math.max(1, total);
  }, []);

  // Función para actualizar el monto total en el formulario
  const actualizarMontoTotal = useCallback((productos) => {
    const total = calcularTotalProductos(productos);
    form.setFieldsValue({ monto: total });
  }, [calcularTotalProductos, form]);
  
  // Función para agregar un producto a la lista de seleccionados
  const handleAddProduct = () => {
    if (!selectedProductId || productQuantity <= 0) return;
    
    const producto = productos.find(p => p.id === selectedProductId);
    
    if (producto) {
      let updatedProducts = [];
      // Verificar si el producto ya está en la lista
      const existingProduct = selectedProducts.find(p => p.id === selectedProductId);
      
      if (existingProduct) {
        // Actualizar la cantidad si ya existe
        updatedProducts = selectedProducts.map(p => 
          p.id === selectedProductId 
            ? { ...p, cantidad: p.cantidad + productQuantity }
            : p
        );
      } else {
        // Agregar nuevo producto
        const newProduct = {
          id: producto.id,
          nombre: producto.nombre,
          // Asegurarse que el precio sea un número válido
          precio: typeof producto.precioVenta === 'number' ? producto.precioVenta : 
                 (typeof producto.precio === 'number' ? producto.precio : 0),
          cantidad: productQuantity
        };
        updatedProducts = [...selectedProducts, newProduct];
      }
      
      // Actualizar la lista de productos
      setSelectedProducts(updatedProducts);
      
      // Actualizar el monto total
      actualizarMontoTotal(updatedProducts);
      
      // Resetear valores
      setSelectedProductId(null);
      setProductQuantity(1);
    }
  };
  
  // Función para eliminar un producto de la lista
  const handleRemoveProduct = (productId) => {
    // Eliminar el producto de la lista
    const updatedProducts = selectedProducts.filter(p => p.id !== productId);
    setSelectedProducts(updatedProducts);
    
    // Actualizar el monto total
    actualizarMontoTotal(updatedProducts);
  };
  
  // Inicializar el formulario cuando cambia la venta
  useEffect(() => {
    if (editingVenta) {
      // Si hay productos en la venta a editar, cargarlos
      if (editingVenta.productos && Array.isArray(editingVenta.productos)) {
        setSelectedProducts(editingVenta.productos);
        
        // Calcular el monto basado en los productos
        const montoCalculado = calcularTotalProductos(editingVenta.productos);
        
        form.setFieldsValue({
          ...editingVenta,
          // Usar el monto calculado si hay productos, o el monto guardado si no
          monto: montoCalculado > 0 ? montoCalculado : Number(editingVenta.monto || 0),
          productos: editingVenta.productos
        });
      } else {
        setSelectedProducts([]);
        form.setFieldsValue({
          ...editingVenta,
          monto: Number(editingVenta.monto || 0),
          productos: []
        });
      }
    } else {
      // Inicializar un nuevo formulario
      form.resetFields();
      form.setFieldsValue({
        id: generateId(),
        tipoPago: 'efectivo',
        vendedor: vendedores.length > 0 ? vendedores[0].value : '',
        monto: 0,
        productos: []
      });
      setSelectedProducts([]);
    }
  }, [editingVenta, form, generateId, vendedores, calcularTotalProductos]);
  
  // Columnas para la tabla de productos seleccionados (versión simplificada)
  const productColumns = [
    {
      title: 'Producto',
      dataIndex: 'nombre',
      key: 'nombre',
    },
    {
      title: 'Precio',
      dataIndex: 'precio',
      key: 'precio',
      render: (precio) => `$${precio && typeof precio === 'number' ? precio.toLocaleString('es-CL') : 0}`
    },
    {
      title: 'Cantidad',
      dataIndex: 'cantidad',
      key: 'cantidad',
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_, record) => (
        <Button 
          type="text" 
          danger 
          icon={<DeleteOutlined />} 
          onClick={() => handleRemoveProduct(record.id)}
          disabled={loading}
        />
      )
    }
  ];

  // Campo oculto para guardar los productos seleccionados en el formulario
  useEffect(() => {
    form.setFieldsValue({
      productos: selectedProducts
    });
  }, [selectedProducts, form]);

  return (
    <Form
      form={form}
      layout="vertical"
      disabled={loading}
      autoComplete="off"
    >
      {/* Campo oculto para el ID */}
      <Form.Item
        name="id"
        hidden
      >
        <Input />
      </Form.Item>
      
      {/* Campo oculto para los productos */}
      <Form.Item
        name="productos"
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
          { type: 'number', min: 1, message: 'El monto debe ser mayor a 0' }
        ]}
      >
        <InputNumber
          style={{ width: '100%' }}
          formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
          parser={value => value.replace(/\$\s?|(\.*)|(,*)/g, '')}
          placeholder="Ingresa el monto"
          onChange={handleMontoChange}
          min={1}
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
      
      {/* Sección de selección de productos */}
      <div className="productos-section">
        <h3>
          <ShoppingOutlined /> Productos (Opcional)
        </h3>
        
        <div className="productos-selector">
          <Select
            placeholder="Selecciona un producto"
            showSearch
            optionFilterProp="children"
            value={selectedProductId}
            onChange={setSelectedProductId}
            options={productOptions}
            disabled={loading}
          />
          <InputNumber
            min={1}
            value={productQuantity}
            onChange={setProductQuantity}
            placeholder="Cantidad"
            disabled={!selectedProductId || loading}
          />
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleAddProduct}
            disabled={!selectedProductId || loading}
          >
            Agregar
          </Button>
        </div>
        
        {/* Tabla de productos seleccionados */}
        {selectedProducts.length > 0 && (
          <div className="productos-table-container">
            <Table 
              dataSource={selectedProducts} 
              columns={productColumns}
              pagination={false}
              size="small"
              rowKey="id"
              bordered
              summary={(pageData) => {
                const total = calcularTotalProductos(pageData);
                return (
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={2} align="right">
                      <strong>Total:</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1} colSpan={2}>
                      <strong>${total.toLocaleString('es-CL')}</strong>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                );
              }}
            />
          </div>
        )}
      </div>
    </Form>
  );
};

VentaFormulario.propTypes = {
  form: PropTypes.object.isRequired,
  editingVenta: PropTypes.object
};

export default VentaFormulario;
