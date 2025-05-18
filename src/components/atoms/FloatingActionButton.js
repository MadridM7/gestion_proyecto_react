/**
 * @fileoverview Botón flotante de acción para interfaces móviles
 */
import React from 'react';
import { Button, Tooltip } from 'antd';
import PropTypes from 'prop-types';

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
  className = ''
}) => {
  const defaultStyle = {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    zIndex: 1000,
    boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    ...style
  };

  const button = (
    <Button
      type={type}
      shape={shape}
      icon={icon}
      onClick={onClick}
      size={size}
      style={defaultStyle}
      className={`floating-action-button ${className}`}
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
  className: PropTypes.string
};

export default FloatingActionButton;
