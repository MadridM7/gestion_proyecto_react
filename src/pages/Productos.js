import React, { useState } from 'react';
import { 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  InputNumber, 
  message, 
  Space, 
  Card,
  Popconfirm 
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined 
} from '@ant-design/icons';
import { useProductos } from '../context/ProductosContext';
import MainLayout from '../components/layout/MainLayout';
import '../styles/pages/Productos.css';

/**
 * Componente para la página de gestión de productos
 * Muestra una tabla con los productos y permite agregar, editar y eliminar productos
 */
const Productos = () => {
  const { productos, agregarProducto, eliminarProducto, actualizarProducto, calcularPrecioVenta } = useProductos();
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [editandoProducto, setEditandoProducto] = useState(null);
  const [searchText, setSearchText] = useState('');

  // Filtrar productos por nombre
  const productosFiltrados = productos.filter(producto => 
    producto.nombre.toLowerCase().includes(searchText.toLowerCase())
  );

  // Columnas para la tabla de productos
  const columnas = [
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
      sorter: (a, b) => a.nombre.localeCompare(b.nombre),
    },
    {
      title: 'Precio Compra',
      dataIndex: 'precioCompra',
      key: 'precioCompra',
      render: (valor) => `$${valor.toLocaleString('es-CL')}`,
      sorter: (a, b) => a.precioCompra - b.precioCompra,
    },
    {
      title: 'Margen (%)',
      dataIndex: 'margenGanancia',
      key: 'margenGanancia',
      render: (valor) => `${valor}%`,
      sorter: (a, b) => a.margenGanancia - b.margenGanancia,
    },
    {
      title: 'Precio Venta',
      dataIndex: 'precioVenta',
      key: 'precioVenta',
      render: (valor) => `$${valor.toLocaleString('es-CL')}`,
      sorter: (a, b) => a.precioVenta - b.precioVenta,
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => abrirModalEdicion(record)}
            size="small"
          />
          <Popconfirm
            title="¿Estás seguro de eliminar este producto?"
            onConfirm={() => handleEliminarProducto(record.id)}
            okText="Sí"
            cancelText="No"
          >
            <Button 
              type="primary" 
              danger 
              icon={<DeleteOutlined />} 
              size="small"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Abrir modal para agregar un nuevo producto
  const abrirModalAgregar = () => {
    setEditandoProducto(null);
    form.resetFields();
    setModalVisible(true);
  };

  // Abrir modal para editar un producto existente
  const abrirModalEdicion = (producto) => {
    setEditandoProducto(producto);
    form.setFieldsValue({
      nombre: producto.nombre,
      precioCompra: producto.precioCompra,
      margenGanancia: producto.margenGanancia,
      precioVenta: producto.precioVenta,
    });
    setModalVisible(true);
  };

  // Manejar el cierre del modal
  const cerrarModal = () => {
    setModalVisible(false);
    form.resetFields();
  };

  // Manejar la eliminación de un producto
  const handleEliminarProducto = (id) => {
    eliminarProducto(id);
    message.success('Producto eliminado correctamente');
  };

  // Calcular el precio de venta cuando cambia el precio de compra o el margen
  const calcularPrecioVentaForm = () => {
    const precioCompra = form.getFieldValue('precioCompra');
    const margenGanancia = form.getFieldValue('margenGanancia');
    
    if (precioCompra && margenGanancia) {
      // Convertir a números y asegurarse de que son valores válidos
      const precioCompraNum = Number(precioCompra);
      const margenGananciaNum = Number(margenGanancia);
      
      if (!isNaN(precioCompraNum) && !isNaN(margenGananciaNum)) {
        // Calcular el precio de venta usando la función del contexto
        const precioVenta = calcularPrecioVenta(precioCompraNum, margenGananciaNum);
        
        // Redondear al entero más cercano para evitar decimales
        const precioVentaRedondeado = Math.round(precioVenta);
        
        // Actualizar el campo en el formulario
        form.setFieldsValue({ precioVenta: precioVentaRedondeado });
        
        console.log(`Precio calculado: ${precioVentaRedondeado} (Compra: ${precioCompraNum}, Margen: ${margenGananciaNum}%)`);
      }
    }
  };

  // Manejar el guardado del formulario
  const handleGuardarProducto = (valores) => {
    if (editandoProducto) {
      // Actualizar producto existente
      actualizarProducto(editandoProducto.id, valores);
      message.success('Producto actualizado correctamente');
    } else {
      // Agregar nuevo producto
      agregarProducto(valores);
      message.success('Producto agregado correctamente');
    }
    cerrarModal();
  };

  return (
    <MainLayout currentPage="Productos">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0 }}>Gestión de Productos</h1>
      </div>
      
      <Card title="Todos los Productos" extra={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Input.Search
            placeholder="Buscar producto..."
            allowClear
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250, marginRight: 16 }}
          />
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={abrirModalAgregar}
          >
            Agregar Producto
          </Button>
        </div>
      }>
        <Table 
          columns={columnas} 
          dataSource={productosFiltrados}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Modal para agregar/editar producto */}
      <Modal
        title={editandoProducto ? "Editar Producto" : "Agregar Nuevo Producto"}
        open={modalVisible}
        onCancel={cerrarModal}
        footer={null}
        className="producto-modal"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleGuardarProducto}
        >
          <Form.Item
            name="nombre"
            label="Nombre del Producto"
            rules={[{ required: true, message: 'Por favor ingresa el nombre del producto' }]}
          >
            <Input placeholder="Ej: Smartphone Samsung Galaxy" />
          </Form.Item>
          
          <Form.Item
            name="precioCompra"
            label="Precio de Compra (CLP)"
            rules={[{ required: true, message: 'Por favor ingresa el precio de compra' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={1}
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
              parser={value => value.replace(/\$\s?|\.+/g, '')}
              onChange={calcularPrecioVentaForm}
            />
          </Form.Item>
          
          <Form.Item
            name="margenGanancia"
            label="Margen de Ganancia (%)"
            rules={[{ required: true, message: 'Por favor ingresa el margen de ganancia' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={1}
              max={100}
              formatter={value => `${value}%`}
              parser={value => value.replace('%', '')}
              onChange={calcularPrecioVentaForm}
            />
          </Form.Item>
          
          <Form.Item
            name="precioVenta"
            label="Precio de Venta (CLP)"
            rules={[{ required: true, message: 'Por favor ingresa el precio de venta' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={1}
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
              parser={value => value.replace(/\$\s?|\.+/g, '')}
            />
          </Form.Item>
          
          <div className="form-buttons">
            <Button type="primary" htmlType="submit">
              {editandoProducto ? "Actualizar" : "Guardar"}
            </Button>
            <Button onClick={cerrarModal} style={{ marginLeft: 8 }}>
              Cancelar
            </Button>
          </div>
        </Form>
      </Modal>
    </MainLayout>
  );
};

export default Productos;
