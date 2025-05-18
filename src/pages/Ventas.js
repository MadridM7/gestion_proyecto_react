/**
 * @fileoverview Página de gestión de ventas con estructura Atomic Design
 */
import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import VentasDashboard from '../components/organisms/VentasDashboard';
import FloatingActionButton from '../components/atoms/FloatingActionButton';
import { ShoppingCartOutlined } from '@ant-design/icons';
import VentaFormulario from '../components/molecules/VentaFormulario';
import { Modal, Form, message } from 'antd';
import { useVentas } from '../context/VentasContext';

// Importar estilos CSS
import '../styles/pages/Ventas.css';

/**
 * Página de gestión de ventas
 * @returns {JSX.Element} Página de Ventas
 */
const Ventas = () => {
  const { agregarVenta, actualizarVenta } = useVentas();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [editingVenta, setEditingVenta] = useState(null);
  const [modalTitle, setModalTitle] = useState('Nueva Venta');
  
  // Detectar si es un dispositivo móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Verificar al cargar
    checkMobile();
    
    // Agregar listener para cambios de tamaño
    window.addEventListener('resize', checkMobile);
    
    // Limpiar listener al desmontar
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Función para mostrar el modal de agregar venta
  const showAddModal = () => {
    setEditingVenta(null);
    setModalTitle('Nueva Venta');
    form.resetFields();
    setIsModalVisible(true);
  };

  // Función para mostrar el modal de editar venta
  const showEditModal = (venta) => {
    setEditingVenta(venta);
    setModalTitle('Editar Venta');
    form.setFieldsValue({
      ...venta,
      fechaHora: venta.fechaHora ? new Date(venta.fechaHora) : null
    });
    setIsModalVisible(true);
  };

  // Función para cerrar el modal
  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingVenta(null);
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async () => {
    try {
      // Validar y obtener los valores del formulario
      const values = await form.validateFields();
      setIsSubmitting(true);
      
      // Convertir el monto de formato CLP a número
      const montoNumerico = parseInt(values.monto.replace(/\D/g, ''));
      
      // Datos comunes para agregar o actualizar venta
      const ventaData = {
        ...values,
        monto: montoNumerico,
        fechaHora: new Date().toISOString(), // Fecha y hora actual
        vendedor: values.vendedor || 'Laura Fernández' // Usar el vendedor seleccionado o el predeterminado
      };
      
      if (editingVenta) {
        // Si estamos editando una venta existente
        await actualizarVenta(editingVenta.id, ventaData);
        message.success('Venta actualizada correctamente');
      } else {
        // Si estamos creando una nueva venta
        await agregarVenta(ventaData);
        message.success('Venta agregada correctamente');
      }
      
      setIsModalVisible(false);
      form.resetFields();
      setEditingVenta(null);
    } catch (error) {
      console.error('Error al procesar venta:', error);
      message.error(`Error al ${editingVenta ? 'actualizar' : 'agregar'} la venta`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout currentPage="Ventas">
      <div className="ventas-container">
        
        <VentasDashboard 
          showResumen={false}
          showCharts={false}
          showTable={true}
          onEdit={showEditModal}
        />
        
        {isMobile && (
          <FloatingActionButton 
            icon={<ShoppingCartOutlined />} 
            onClick={showAddModal} 
          />
        )}
      </div>
      
      <Modal
        title={modalTitle}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        okText="Aceptar"
        cancelText="Cancelar"
        confirmLoading={isSubmitting}
        destroyOnClose
        maskClosable={false}
        width="600px"
      >
        <VentaFormulario 
          form={form} 
          editingVenta={editingVenta}
          loading={isSubmitting}
        />
      </Modal>
    </MainLayout>
  );
};

export default Ventas;
