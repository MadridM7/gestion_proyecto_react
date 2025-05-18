/**
 * @fileoverview Template para la página de productos
 */
import React, { useState } from 'react';
import { Card, Modal, Form, message, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useProductos } from '../../context/ProductosContext';
import PropTypes from 'prop-types';

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

  return (
    <div className="productos-template">
      <Card>
        {ProductosDataTable && (
          <ProductosDataTable 
            onEdit={showEditModal} 
            searchExtra={addButton}
          />
        )}
      </Card>
      
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
