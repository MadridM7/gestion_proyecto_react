/**
 * @fileoverview Botón flotante de acción para interfaces móviles
 */
import React from 'react';
import { Button, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import '../../styles/components/atoms/FloatingActionButton.css';

/**
 * Componente atómico para botones flotantes de acción
 * @param {Object} props - Propiedades del componente
 * @returns {JSX.Element} Botón flotante de acción
 */
const FloatingActionButton = ({ 
  icon, 
  onClick, 
  tooltip = '', 
  type = 'primary', 
  shape = 'circle',
  size = 'large',
  style = {},
  className = '',
  isMobile = false
}) => {
  // Combinamos las clases CSS para permitir personalización
  const buttonClassName = `floating-action-button ${className} ${isMobile ? 'mobile' : ''}`;

  const button = (
    <Button
      type={type}
      shape={shape}
      icon={icon}
      onClick={onClick}
      size={size}
      style={style} // Mantenemos style para personalizaciones adicionales
      className={buttonClassName}
    />
  );

  // Si hay tooltip, envolver el botón con un componente Tooltip
  if (tooltip) {
    return (
      <Tooltip title={tooltip} placement="left">
        {button}
      </Tooltip>
    );
  }

  return button;
};

FloatingActionButton.propTypes = {
  icon: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  tooltip: PropTypes.string,
  type: PropTypes.string,
  shape: PropTypes.string,
  size: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
  isMobile: PropTypes.bool
};

export default FloatingActionButton;
