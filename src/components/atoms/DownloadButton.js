/**
 * @fileoverview Botón de descarga para reportes
 */
import React from 'react';
import { Button } from 'antd';
import { 
  FileExcelOutlined, 
  FilePdfOutlined 
} from '@ant-design/icons';
import PropTypes from 'prop-types';

/**
 * Componente atómico para botones de descarga de reportes
 * @param {Object} props - Propiedades del componente
 * @returns {JSX.Element} Botón de descarga con formato e icono
 */
const DownloadButton = ({ format, onClick }) => {
  // Mapeo de formatos a iconos
  const formatIcons = {
    excel: <FileExcelOutlined />,
    pdf: <FilePdfOutlined />
  };

  // Mapeo de formatos a colores
  const formatColors = {
    excel: '#217346',
    pdf: '#FF0000'
  };

  // Mapeo de formatos a textos
  const formatTexts = {
    excel: 'Excel',
    pdf: 'PDF'
  };

  return (
    <Button
      type="default"
      icon={formatIcons[format]}
      style={{ 
        color: formatColors[format],
        borderColor: formatColors[format],
        marginRight: '8px'
      }}
      onClick={onClick}
    >
      {formatTexts[format]}
    </Button>
  );
};

DownloadButton.propTypes = {
  format: PropTypes.oneOf(['excel', 'pdf']).isRequired,
  onClick: PropTypes.func.isRequired
};

export default DownloadButton;
