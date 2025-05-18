/**
 * @fileoverview Página principal del dashboard que muestra estadísticas y gráficos
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
import '../styles/pages/Dashboard.css';


/**
 * Página principal del Dashboard que muestra un resumen de las métricas clave de ventas
 * Diseñado para ser completamente responsivo en dispositivos móviles, tablets y desktops
 * @returns {JSX.Element} Página de Dashboard con tarjetas de resumen, gráficos y tabla de ventas
 */
const Dashboard = () => {
  const { agregarVenta } = useVentas();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
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
    form.resetFields();
    setIsModalVisible(true);
  };

  // Función para cerrar el modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      await agregarVenta(values);
      message.success('Venta agregada correctamente');
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Error al agregar venta:', error);
      message.error('Error al agregar la venta');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout currentPage="Dashboard">
      <div className="dashboard-container">
        
        
        <VentasDashboard 
          showResumen={true}
          showCharts={true}
          showTable={false}
        />
        
        {isMobile && (
          <FloatingActionButton 
            icon={<ShoppingCartOutlined />} 
            onClick={showAddModal} 
          />
        )}
      </div>
      
      <Modal
        title="Nueva Venta"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
      >
        <VentaFormulario 
          form={form} 
          onFinish={handleSubmit} 
          onCancel={handleCancel} 
          loading={isSubmitting} 
        />
      </Modal>
    </MainLayout>
  );
};

export default Dashboard;
