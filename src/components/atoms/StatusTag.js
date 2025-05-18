/**
 * @fileoverview Componente de etiqueta de estado reutilizable
 */
import React from 'react';
import { Tag } from 'antd';
import PropTypes from 'prop-types';

/**
 * Componente atómico para etiquetas de estado
 * @param {Object} props - Propiedades del componente
 * @returns {JSX.Element} Etiqueta de estado con color según el tipo
 */
const StatusTag = ({ 
  status, 
  text, 
  customColor = null 
}) => {
  // Mapeo de estados a colores
  const statusColors = {
    success: 'success',
    processing: 'processing',
    error: 'error',
    warning: 'warning',
    default: 'default',
    // Estados personalizados para ventas
    completed: 'success',
    pending: 'warning',
    cancelled: 'error'
  };

  // Determinar el color de la etiqueta
  const color = customColor || statusColors[status] || 'default';

  return (
    <Tag color={color}>
      {text}
    </Tag>
  );
};

StatusTag.propTypes = {
  status: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  customColor: PropTypes.string
};

export default StatusTag;
