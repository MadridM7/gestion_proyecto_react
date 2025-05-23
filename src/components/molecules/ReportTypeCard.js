/**
 * @fileoverview Componente molecular para tarjetas de tipo de reporte con diseño mejorado
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Typography, Space, Tooltip } from 'antd';
import { DownloadOutlined, InfoCircleOutlined } from '@ant-design/icons';
import ReportCard from '../atoms/ReportCard';

const { Text, Paragraph } = Typography;

/**
 * Componente molecular que representa una tarjeta de tipo de reporte con diseño mejorado
 * @param {Object} props - Propiedades del componente
 * @returns {JSX.Element} Tarjeta de tipo de reporte
 */
const ReportTypeCard = ({ 
  title, 
  description, 
  icon,
  color,
  onGenerate,
  buttonText = "Generar",
  loading = false,
  children,
  ...restProps 
}) => {
  return (
    <ReportCard
      title={title}
      icon={icon}
      color={color}
      {...restProps}
    >
      {description && (
        <Paragraph type="secondary" style={{ marginBottom: 16 }}>
          <Space>
            <Text type="secondary">{description}</Text>
            <Tooltip title={description}>
              <InfoCircleOutlined style={{ color: 'rgba(0,0,0,0.45)' }} />
            </Tooltip>
          </Space>
        </Paragraph>
      )}
      
      <div className="report-card-selector" style={{ marginBottom: 16, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '80px' }}>
        {children}
      </div>
      
      <div className="report-card-actions">
        <Button 
          type="primary" 
          icon={<DownloadOutlined />} 
          onClick={onGenerate}
          loading={loading}
          block
          style={{ 
            background: color,
            borderColor: color
          }}
        >
          {buttonText}
        </Button>
      </div>
    </ReportCard>
  );
};

ReportTypeCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  icon: PropTypes.node,
  color: PropTypes.string,
  onGenerate: PropTypes.func.isRequired,
  buttonText: PropTypes.string,
  loading: PropTypes.bool,
  children: PropTypes.node
};

export default ReportTypeCard;
