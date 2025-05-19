/**
 * @fileoverview Template para la página de productos
 */
import React, { useState } from 'react';
import { Card, Modal, Form, message, Button, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useProductos } from '../../context/ProductosContext';
import PropTypes from 'prop-types';
import ProductosStats from '../organisms/ProductosStats';
import ProductosFilters from '../molecules/ProductosFilters';
import ProductoDetail from '../organisms/ProductoDetail';
import '../../styles/components/templates/ProductosTemplate.css';

/**
 * Componente template para la página de productos
 * @param {Object} props - Propiedades del componente
 * @returns {JSX.Element} Template de la página de productos
 */
const ProductosTemplate = ({ 
  ProductosDataTable, 
  ProductoFormulario 
}) => {
  const { agregarProducto, actualizarProducto } = useProductos();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProducto, setEditingProducto] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState(null);

  // Función para mostrar el modal de nuevo producto
  const showModal = () => {
    setEditingProducto(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Función para mostrar el modal de editar producto
  const showEditModal = (producto) => {
    setEditingProducto(producto);
    form.setFieldsValue(producto);
    setIsModalVisible(true);
  };

  // Función para cerrar el modal
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setIsSubmitting(true);

      // Agregar o actualizar el producto según corresponda
      if (editingProducto) {
        await actualizarProducto(editingProducto.id, values);
        message.success('Producto actualizado correctamente');
      } else {
        await agregarProducto(values);
        message.success('Producto agregado correctamente');
      }

      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Error al procesar el producto:', error);
      message.error('Error al procesar el producto. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Botón para agregar nuevo producto
  const addButton = (
    <Button 
      type="primary" 
      icon={<PlusOutlined />} 
      onClick={showModal}
    >
      Nuevo Producto
    </Button>
  );

  // Estado para almacenar la categoría seleccionada
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  // Manejar cambio de filtro por categoría
  const handleFilterChange = (categoria) => {
    // Guardar la categoría seleccionada en el estado
    setCategoriaSeleccionada(categoria);
    
    // Actualizar la vista de detalles si hay un producto seleccionado
    // que no pertenece a la categoría seleccionada
    if (categoria && selectedProducto && selectedProducto.categoria !== categoria) {
      setSelectedProducto(null);
    }
  };

  // Manejar selección de producto
  const handleProductoSelect = (producto) => {
    setSelectedProducto(producto);
  };

  return (
    <div className="productos-template">
      {/* Estadísticas de productos */}
      <ProductosStats />
      
      <Row gutter={[16, 16]} className="productos-content">
        <Col xs={24} lg={16}>
          <Card>
            {ProductosDataTable && (
              <ProductosDataTable 
                searchExtra={
                  <div className="search-actions-container">
                    <ProductosFilters onFilterChange={handleFilterChange} />
                    {addButton}
                  </div>
                }
                categoriaFiltro={categoriaSeleccionada}
                onRowClick={handleProductoSelect}
              />
            )}
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          <ProductoDetail producto={selectedProducto} onEdit={showEditModal} />
        </Col>
      </Row>
      
      {/* Modal para agregar/editar producto */}
      {ProductoFormulario && (
        <Modal
          title={editingProducto ? 'Editar Producto' : 'Nuevo Producto'}
          open={isModalVisible}
          onOk={handleSubmit}
          onCancel={handleCancel}
          confirmLoading={isSubmitting}
          destroyOnClose
          maskClosable={false}
          width="600px"
        >
          <ProductoFormulario 
            form={form} 
            producto={editingProducto} 
            loading={isSubmitting}
          />
        </Modal>
      )}
    </div>
  );
};

ProductosTemplate.propTypes = {
  ProductosDataTable: PropTypes.elementType,
  ProductoFormulario: PropTypes.elementType
};

export default ProductosTemplate;
