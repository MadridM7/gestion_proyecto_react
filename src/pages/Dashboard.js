/**
 * @fileoverview Página principal del dashboard que muestra estadísticas y gráficos
 */
import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import VentasDashboard from '../components/organisms/VentasDashboard';
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
