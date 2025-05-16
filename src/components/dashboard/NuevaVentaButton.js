import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import VentaForm from './VentaForm';

/**
 * Componente de botón para agregar nuevas ventas
 * @param {Object} props - Propiedades del componente
 * @param {string} props.type - Tipo de botón (primary, default, etc.)
 * @param {string} props.size - Tamaño del botón (small, middle, large)
 * @param {Object} props.style - Estilos adicionales para el botón
 * @returns {JSX.Element} Botón para agregar nuevas ventas
 */
const NuevaVentaButton = ({ type = 'primary', size = 'middle', style = {} }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Función para abrir el modal
  const showModal = () => {
    setIsModalOpen(true);
  };
  
  // Función para cerrar el modal
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  
  return (
    <>
      <Button 
        type={type} 
        size={size} 
        icon={<PlusOutlined />} 
        onClick={showModal}
        style={style}
      >
        Nueva Venta
      </Button>
      
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

export default NuevaVentaButton;
