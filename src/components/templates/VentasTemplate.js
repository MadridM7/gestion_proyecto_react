/**
 * @fileoverview Template para la página de ventas
 */
import React, { useState } from 'react';
import { Card, Modal, Form, message, Tabs } from 'antd';
import { DashboardOutlined, TableOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useVentas } from '../../context/VentasContext';
import PropTypes from 'prop-types';

const { TabPane } = Tabs;

/**
 * Componente template para la página de ventas
 * @param {Object} props - Propiedades del componente
 * @returns {JSX.Element} Template de la página de ventas
 */
const VentasTemplate = ({ 
  isMobile = false, 
  FormularioVenta, 
  VentasDashboard 
}) => {
  const { agregarVenta, actualizarVenta } = useVentas();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingVenta, setEditingVenta] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Función para mostrar el modal de agregar venta
  const showAddModal = () => {
    setEditingVenta(null);
    form.resetFields();
    setIsModalVisible(true);
  };

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

  // Botón flotante para agregar ventas
  const renderFloatingButton = () => (
    <div style={{ position: 'fixed', right: 24, bottom: 24, zIndex: 1000 }}>
      <button 
        onClick={showAddModal}
        style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: '#1890ff',
          color: 'white',
          border: 'none',
          boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '22px'
        }}
      >
        <ShoppingCartOutlined />
      </button>
    </div>
  );

  return (
    <div className="ventas-template">      
      
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        className="ventas-tabs"
      >
        <TabPane
          tab={
            <span>
              <DashboardOutlined />
              Dashboard
            </span>
          }
          key="dashboard"
        >
          {VentasDashboard && (
            <VentasDashboard onEdit={showEditModal} />
          )}
        </TabPane>
        
        <TabPane
          tab={
            <span>
              <TableOutlined />
              Listado de Ventas
            </span>
          }
          key="table"
        >
          <Card 
            title="Ventas"
            className="ventas-card"
            extra={isMobile ? null : (
              <button 
                onClick={showAddModal}
                style={{
                  padding: '0 15px',
                  height: 32,
                  borderRadius: 4,
                  backgroundColor: '#1890ff',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5
                }}
              >
                <ShoppingCartOutlined />
                <span>Nueva Venta</span>
              </button>
            )}
          >
            {VentasDashboard && (
              <VentasDashboard 
                onEdit={showEditModal} 
                showResumen={false}
                showCharts={false}
              />
            )}
          </Card>
        </TabPane>
      </Tabs>
      
      {/* Botón flotante para agregar ventas (solo en móvil) */}
      {isMobile && renderFloatingButton()}
      
      {/* Modal para agregar/editar venta */}
      {FormularioVenta && (
        <Modal
          title={editingVenta ? 'Editar Venta' : 'Agregar Venta'}
          open={isModalVisible}
          onOk={handleSubmit}
          onCancel={handleCancel}
          confirmLoading={isSubmitting}
          destroyOnClose
          maskClosable={false}
          width={isMobile ? '95%' : '600px'}
        >
          <FormularioVenta 
            form={form} 
            editingVenta={editingVenta} 
          />
        </Modal>
      )}
    </div>
  );
};

VentasTemplate.propTypes = {
  isMobile: PropTypes.bool,
  FormularioVenta: PropTypes.elementType,
  VentasDashboard: PropTypes.elementType
};

export default VentasTemplate;
