/**
 * @fileoverview Template para la página de pedidos
 */
import React, { useState } from 'react';
import { Card, Modal, Form, message, Row, Col } from 'antd';
import { GiftOutlined } from '@ant-design/icons';
import { usePedidos } from '../../context/PedidosContext';
import PropTypes from 'prop-types';
import PedidosStats from '../molecules/PedidosStats';
import PedidoDetail from '../molecules/PedidoDetail';
import PedidosDataTable from '../organisms/PedidosDataTable';
import '../../styles/components/templates/PedidosTemplate.css';

/**
 * Componente template para la página de pedidos
 * @param {Object} props - Propiedades del componente
 * @returns {JSX.Element} Template de la página de pedidos
 */
const PedidosTemplate = ({ 
  isMobile = false, 
  FormularioPedido 
}) => {
  const { agregarPedido, actualizarPedido, eliminarPedido } = usePedidos();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPedido, setEditingPedido] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isEditingInPanel, setIsEditingInPanel] = useState(false);

  // Función para mostrar el modal de agregar pedido
  const showAddModal = () => {
    setEditingPedido(null);
    form.resetFields();
    
    // Valores por defecto para un nuevo pedido
    form.setFieldsValue({
      estado: 'por pagar',
      fechaPedido: new Date()
    });
    
    setIsModalVisible(true);
  };

  // Función para mostrar el modal de editar pedido
  const showEditModal = (pedido) => {
    // Si estamos en móvil, usar el modal
    if (isMobile) {
      setEditingPedido(pedido);
      form.setFieldsValue({
        ...pedido,
        fechaPedido: pedido.fechaPedido ? new Date(pedido.fechaPedido) : new Date()
      });
      setIsModalVisible(true);
      setIsDetailModalVisible(false);
    } else {
      // En desktop, editar en el panel lateral
      setEditingPedido(pedido);
      form.setFieldsValue({
        ...pedido,
        fechaPedido: pedido.fechaPedido ? new Date(pedido.fechaPedido) : new Date()
      });
      setIsEditingInPanel(true);
    }
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

      // Preparar los datos del pedido
      const pedidoData = {
        ...values
      };

      // Agregar o actualizar el pedido según corresponda
      if (editingPedido) {
        await actualizarPedido(editingPedido.id, pedidoData);
        message.success('Pedido actualizado correctamente');
        
        // Si estábamos editando en el panel, volver a la vista de detalles
        if (isEditingInPanel) {
          setIsEditingInPanel(false);
          // Actualizar el pedido seleccionado con los nuevos datos
          setSelectedPedido({
            ...editingPedido,
            ...pedidoData
          });
        }
      } else {
        const nuevoPedido = await agregarPedido(pedidoData);
        message.success('Pedido agregado correctamente');
        
        // Seleccionar el nuevo pedido
        if (nuevoPedido) {
          setSelectedPedido(nuevoPedido);
        }
      }

      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Error al procesar el pedido:', error);
      message.error('Error al procesar el pedido. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para cancelar la edición en el panel
  const handleCancelEdit = () => {
    setIsEditingInPanel(false);
  };

  // Manejar selección de pedido
  const handlePedidoSelect = (pedido) => {
    setSelectedPedido(pedido);
    
    // Si estamos en móvil, mostrar el modal con los detalles
    if (isMobile && pedido) {
      setIsDetailModalVisible(true);
    }
  };
  
  // Cerrar el modal de detalles
  const handleDetailModalClose = () => {
    setIsDetailModalVisible(false);
  };
  
  // Función para eliminar un pedido
  const handleEliminarPedido = async (id) => {
    try {
      const resultado = await eliminarPedido(id);
      
      if (resultado) {
        message.success('Pedido eliminado correctamente');
        
        // Si el pedido eliminado es el seleccionado, deseleccionarlo
        if (selectedPedido && selectedPedido.id === id) {
          setSelectedPedido(null);
          
          // Si estamos en móvil, cerrar el modal de detalles
          if (isMobile) {
            setIsDetailModalVisible(false);
          }
        }
      } else {
        message.error('Error al eliminar el pedido');
      }
    } catch (error) {
      console.error('Error al eliminar pedido:', error);
      message.error('Error al eliminar el pedido');
    }
  };

  return (
    <div className="pedidos-template">      
      {/* Estadísticas de pedidos */}
      <PedidosStats />
      
      <Row gutter={[16, 16]} className="pedidos-content">
        <Col xs={24} lg={16}>
          <Card>
            <PedidosDataTable 
              isMobile={isMobile}
              onRowClick={handlePedidoSelect}
              onEdit={showEditModal}
              onAddNew={showAddModal}
            />
          </Card>
        </Col>
        
        {/* En versión desktop mostramos los detalles en la columna lateral */}
        {!isMobile && (
          <Col xs={24} lg={8}>
            {isEditingInPanel ? (
              <Card 
                title="Editar Pedido"
                className="pedido-detail-card"
                extra={
                  <button 
                    className="close-button" 
                    onClick={handleCancelEdit}
                  >
                    Cancelar
                  </button>
                }
              >
                {FormularioPedido && (
                  <FormularioPedido 
                    form={form} 
                    initialValues={editingPedido}
                  />
                )}
                <div className="form-actions">
                  <button 
                    className="cancel-button" 
                    onClick={handleCancelEdit}
                  >
                    Cancelar
                  </button>
                  <button 
                    className="submit-button" 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    Guardar
                  </button>
                </div>
              </Card>
            ) : (
              <PedidoDetail 
                pedido={selectedPedido} 
                onEdit={showEditModal} 
                onDelete={handleEliminarPedido}
              />
            )}
          </Col>
        )}
      </Row>
      
      {/* Modal para agregar/editar pedido */}
      {FormularioPedido && (
        <Modal
          title={editingPedido ? 'Editar Pedido' : 'Nuevo Pedido'}
          open={isModalVisible}
          onOk={handleSubmit}
          onCancel={handleCancel}
          confirmLoading={isSubmitting}
          destroyOnClose
          maskClosable={false}
          width="600px"
        >
          <FormularioPedido 
            form={form} 
            initialValues={editingPedido} 
          />
        </Modal>
      )}

      {/* Modal para mostrar detalles en versión móvil */}
      {isMobile && (
        <Modal
          title={<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><GiftOutlined /> Detalles del Pedido</div>}
          open={isDetailModalVisible}
          onCancel={handleDetailModalClose}
          footer={null}
          width="95%"
          style={{ top: 0 }}
          bodyStyle={{ padding: '16px', maxHeight: '80vh', overflowY: 'auto' }}
        >
          <PedidoDetail 
            pedido={selectedPedido} 
            onEdit={showEditModal} 
            onDelete={handleEliminarPedido} 
            inMobileModal={true} 
          />
        </Modal>
      )}
    </div>
  );
};

PedidosTemplate.propTypes = {
  isMobile: PropTypes.bool,
  FormularioPedido: PropTypes.elementType
};

export default PedidosTemplate;
