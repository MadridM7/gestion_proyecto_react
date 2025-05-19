/**
 * @fileoverview Botón flotante para agregar ventas, especialmente optimizado para móviles
 */
import React from 'react';
import { PlusOutlined } from '@ant-design/icons';
import FloatingActionButton from '../atoms/FloatingActionButton';
import PropTypes from 'prop-types';
import '../../styles/components/molecules/AddSaleButton.css';

/**
 * Componente molecular para agregar ventas con un botón flotante
 * @param {Object} props - Propiedades del componente
 * @returns {JSX.Element} Botón flotante para agregar ventas
 */
const AddSaleButton = ({ onClick, isMobile = true }) => {
  // Usamos clases CSS en lugar de estilos inline
  const deviceClass = isMobile ? 'mobile' : 'desktop';

  return (
    <FloatingActionButton
      icon={<PlusOutlined />}
      onClick={onClick}
      tooltip="Agregar Venta"
      type="primary"
      className={`add-sale-button ${deviceClass}`}
      isMobile={isMobile}
    />
  );
};

AddSaleButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  isMobile: PropTypes.bool
};

export default AddSaleButton;
