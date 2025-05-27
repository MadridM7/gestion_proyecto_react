/**
 * @fileoverview Botón atómico para la descarga de reportes en diferentes formatos
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Tooltip } from 'antd';
import { 
  FileExcelOutlined, 
  FilePdfOutlined, 
  FileTextOutlined 
} from '@ant-design/icons';

/**
 * Componente atómico que representa un botón de descarga para reportes
 * @param {Object} props - Propiedades del componente
 * @returns {JSX.Element} Botón de descarga con icono según formato
 */
const DownloadButton = ({ format, onClick, disabled }) => {
  // Configuración para cada formato de descarga
  const formatConfig = {
    excel: {
      icon: <FileExcelOutlined />,
      text: 'Excel',
      color: '#217346',
      tooltip: 'Descargar en formato Excel'
    },
    pdf: {
      icon: <FilePdfOutlined />,
      text: 'PDF',
      color: '#f40f02',
      tooltip: 'Descargar en formato PDF'
    },
    csv: {
      icon: <FileTextOutlined />,
      text: 'CSV',
      color: '#1890ff',
      tooltip: 'Descargar en formato CSV'
    }
  };

  // Obtener configuración para el formato actual
  const config = formatConfig[format.toLowerCase()] || formatConfig.excel;

  return (
    <Tooltip title={config.tooltip}>
      <Button
        type="primary"
        icon={config.icon}
        onClick={onClick}
        disabled={disabled}
        style={{ backgroundColor: config.color, borderColor: config.color }}
        className="download-button"
      >
        {config.text}
      </Button>
    </Tooltip>
  );
};

DownloadButton.propTypes = {
  format: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

DownloadButton.defaultProps = {
  disabled: false
};

export default DownloadButton;
