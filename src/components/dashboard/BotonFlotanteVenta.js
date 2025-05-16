import React, { useState, useEffect } from 'react';
import { Modal, FloatButton, Badge } from 'antd';
import { PlusOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import VentaForm from './VentaForm';
import { useVentas } from '../../context/VentasContext';

/**
 * Componente de botón flotante para agregar ventas en dispositivos móviles
 * @returns {JSX.Element} Botón flotante para agregar ventas
 */
const BotonFlotanteVenta = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { ventas } = useVentas();
  
  // Detectar si es un dispositivo móvil al cargar y cuando cambie el tamaño de la ventana
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
  
  // Si no es un dispositivo móvil, no renderizar nada
  if (!isMobile) return null;
  
  // Función para abrir el modal
  const showModal = () => {
    setIsModalOpen(true);
  };
  
  // Función para cerrar el modal
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  
  // Obtener el número de ventas del día actual
  const getVentasHoy = () => {
    if (!ventas || ventas.length === 0) return 0;
    
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    return ventas.filter(venta => {
      if (!(venta.fechaHora instanceof Date)) return false;
      const fechaVenta = new Date(venta.fechaHora);
      fechaVenta.setHours(0, 0, 0, 0);
      return fechaVenta.getTime() === hoy.getTime();
    }).length;
  };
  
  const ventasHoy = getVentasHoy();
  
  return (
    <>
      <FloatButton.Group
        trigger="hover"
        style={{ right: 24, bottom: 24 }}
        icon={<ShoppingCartOutlined />}
      >
        <Badge count={ventasHoy} offset={[-5, 5]} size="small">
          <FloatButton
            type="primary"
            icon={<PlusOutlined />}
            onClick={showModal}
            tooltip="Nueva Venta"
          />
        </Badge>
      </FloatButton.Group>
      
      <Modal
        title="Agregar Nueva Venta"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
      >
        <VentaForm onCancel={handleCancel} />
      </Modal>
    </>
  );
};

export default BotonFlotanteVenta;
