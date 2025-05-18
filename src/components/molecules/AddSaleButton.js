/**
 * @fileoverview Botón flotante para agregar ventas, especialmente optimizado para móviles
 */
import React from 'react';
import { PlusOutlined } from '@ant-design/icons';
import FloatingActionButton from '../atoms/FloatingActionButton';
import PropTypes from 'prop-types';

/**
 * Componente molecular para agregar ventas con un botón flotante
 * @param {Object} props - Propiedades del componente
 * @returns {JSX.Element} Botón flotante para agregar ventas
 */
const AddSaleButton = ({ onClick, isMobile = true }) => {
  // Estilos específicos según el dispositivo
  const buttonStyle = isMobile 
    ? { 
        bottom: '24px', 
        right: '24px',
        zIndex: 1050 // Mayor que el sidebar para evitar problemas de superposición
      } 
    : { 
        bottom: '24px', 
        right: '24px',
        zIndex: 1000
      };

  return (
    <FloatingActionButton
      icon={<PlusOutlined />}
      onClick={onClick}
      tooltip="Agregar Venta"
      type="primary"
      style={buttonStyle}
      className="add-sale-button"
    />
  );
};

AddSaleButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  isMobile: PropTypes.bool
};

export default AddSaleButton;
