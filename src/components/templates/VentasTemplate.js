/**
 * @fileoverview Template para la página de ventas
 */
import React, { useState } from 'react';
import { Card, Modal, Form, message, Row, Col } from 'antd';
import { useVentas } from '../../context/VentasContext';
import PropTypes from 'prop-types';
import VentasMetricas from '../organisms/VentasMetricas';
import VentasFilters from '../molecules/VentasFilters';
import VentaDetail from '../organisms/VentaDetail';
import VentasDataTable from '../organisms/VentasDataTable';
import '../../styles/components/templates/VentasTemplate.css';

/**
 * Componente template para la página de ventas
 * @param {Object} props - Propiedades del componente
 * @returns {JSX.Element} Template de la página de ventas
 */
const VentasTemplate = ({ 
  isMobile = false, 
  FormularioVenta 
}) => {
  const { agregarVenta, actualizarVenta } = useVentas();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingVenta, setEditingVenta] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedVenta, setSelectedVenta] = useState(null);

  // Función para mostrar el modal de nueva venta (eliminada por no ser utilizada)

  // Función para mostrar el modal de editar venta
  const showEditModal = (venta) => {
    setEditingVenta(venta);
    form.setFieldsValue({
      ...venta,
      fechaHora: venta.fechaHora ? new Date(venta.fechaHora) : null
    });
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

      // Preparar los datos de la venta
      const ventaData = {
        ...values,
        fechaHora: values.fechaHora ? values.fechaHora.toDate() : new Date()
      };

      // Agregar o actualizar la venta según corresponda
      if (editingVenta) {
        await actualizarVenta(editingVenta.id, ventaData);
        message.success('Venta actualizada correctamente');
      } else {
        await agregarVenta(ventaData);
        message.success('Venta agregada correctamente');
      }

      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Error al procesar la venta:', error);
      message.error('Error al procesar la venta. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Botón para agregar nueva venta (eliminado por solicitud del usuario)

  // Estado para almacenar el vendedor seleccionado
  const [vendedorSeleccionado, setVendedorSeleccionado] = useState(null);

  // Manejar cambio de filtro por vendedor
  const handleFilterChange = (vendedor) => {
    // Guardar el vendedor seleccionado en el estado
    setVendedorSeleccionado(vendedor);
    
    // Actualizar la vista de detalles si hay una venta seleccionada
    // que no pertenece al vendedor seleccionado
    if (vendedor && selectedVenta && selectedVenta.vendedor !== vendedor) {
      setSelectedVenta(null);
    }
  };

  // Manejar selección de venta
  const handleVentaSelect = (venta) => {
    setSelectedVenta(venta);
  };

  return (
    <div className="ventas-template">      
      {/* Métricas de ventas */}
      <VentasMetricas />
      
      <Row gutter={[16, 16]} className="ventas-content">
        <Col xs={24} lg={16}>
          <Card>
            <VentasDataTable 
              searchExtra={
                <div className="search-actions-container">
                  <VentasFilters onFilterChange={handleFilterChange} />
                </div>
              }
              vendedorFiltro={vendedorSeleccionado}
              onRowClick={handleVentaSelect}
              onEdit={showEditModal}
            />
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          <VentaDetail venta={selectedVenta} onEdit={showEditModal} />
        </Col>
      </Row>
      
      {/* Modal para agregar/editar venta */}
      {FormularioVenta && (
        <Modal
          title={editingVenta ? 'Editar Venta' : 'Nueva Venta'}
          open={isModalVisible}
          onOk={handleSubmit}
          onCancel={handleCancel}
          confirmLoading={isSubmitting}
          destroyOnClose
          maskClosable={false}
          width="600px"
        >
          <FormularioVenta 
            form={form} 
            editingVenta={editingVenta} 
            loading={isSubmitting}
          />
        </Modal>
      )}
    </div>
  );
};

VentasTemplate.propTypes = {
  isMobile: PropTypes.bool,
  FormularioVenta: PropTypes.elementType
};

export default VentasTemplate;
