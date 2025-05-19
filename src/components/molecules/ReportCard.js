/**
 * @fileoverview Tarjeta de reporte que muestra información y opciones de descarga
 */
import React from 'react';
import { Card, Typography, Form, Space } from 'antd';
import PropTypes from 'prop-types';
import { 
  BarChartOutlined, 
  PieChartOutlined, 
  LineChartOutlined, 
  TableOutlined, 
  CalendarOutlined,
  UserOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import DownloadButton from '../atoms/DownloadButton';
import DateSelector from '../atoms/DateSelector';
import UserSelector from '../atoms/UserSelector';
import '../../styles/components/molecules/ReportCard.css';

const { Paragraph } = Typography;

/**
 * Componente molecular que representa una tarjeta de reporte
 * @param {Object} props - Propiedades del componente
 * @returns {JSX.Element} Tarjeta de reporte con opciones de descarga y selectores
 */
const ReportCard = ({ 
  reporte, 
  isActive, 
  onSelect, 
  onDownload, 
  form,
  availableDates,
  availableMonths,
  usuarios,
  onDateChange,
  onMonthChange,
  onUserChange
}) => {
  // Función para obtener el componente de icono basado en el nombre
  const getIconComponent = (iconName) => {
    
    const iconMap = {
      'BarChartOutlined': <BarChartOutlined className="report-card-icon" />,
      'PieChartOutlined': <PieChartOutlined className="report-card-icon" />,
      'LineChartOutlined': <LineChartOutlined className="report-card-icon" />,
      'TableOutlined': <TableOutlined className="report-card-icon" />,
      'CalendarOutlined': <CalendarOutlined className="report-card-icon" />,
      'UserOutlined': <UserOutlined className="report-card-icon" />,
      'DownloadOutlined': <DownloadOutlined className="report-card-icon" />
    };
    
    return iconMap[iconName] || null;
  };

  // Renderizar botones de descarga
  const renderDownloadButtons = (formats) => {
    return (
      <Space>
        {formats.map(format => (
          <DownloadButton 
            key={format} 
            format={format} 
            onClick={() => onDownload(reporte.id.toLowerCase(), format)} 
          />
        ))}
      </Space>
    );
  };

  // Renderizar selector específico según el tipo de reporte
  const renderSelector = () => {
    if (!isActive) return null;
    
    const reportId = reporte.id.toLowerCase();
    
    switch (reportId) {
      case 'ventasdiarias':
        return (
          <DateSelector 
            label="Selecciona una fecha" 
            onChange={onDateChange}
            availableDates={availableDates}
          />
        );
      case 'ventasmensual':
        return (
          <DateSelector 
            label="Selecciona un mes" 
            onChange={onMonthChange}
            availableDates={availableMonths}
            picker="month"
            format="MMMM YYYY"
          />
        );
      case 'ventasporusuario':
        return (
          <UserSelector 
            label="Selecciona un usuario" 
            onChange={onUserChange}
            usuarios={usuarios}
          />
        );
      default:
        return null;
    }
  };

  const headerClass = `report-card-header ${reporte.id.toLowerCase()}-header`;
  
  return (
    <Card 
      hoverable
      className={`report-card ${isActive ? 'active-report' : ''}`}
      cover={
        <div 
          className={`${headerClass} report-card-icon-container`} 
          style={{ background: reporte.color }}
          onClick={() => onSelect(reporte.id.toLowerCase())}
        >
          {getIconComponent(reporte.icono)}
        </div>
      }
    >
      <Card.Meta
        title={reporte.titulo}
        description={
          <>
            <Paragraph>
              {reporte.descripcion}
            </Paragraph>
            
            {/* Formulario para seleccionar opciones específicas */}
            <Form form={form} layout="vertical" className="report-card-form">
              {renderSelector()}
            </Form>
            
            {renderDownloadButtons(reporte.formatos)}
          </>
        }
      />
    </Card>
  );
};

ReportCard.propTypes = {
  reporte: PropTypes.shape({
    id: PropTypes.string.isRequired,
    titulo: PropTypes.string.isRequired,
    descripcion: PropTypes.string.isRequired,
    icono: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    formatos: PropTypes.arrayOf(PropTypes.string).isRequired
  }).isRequired,
  isActive: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  onDownload: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  availableDates: PropTypes.arrayOf(PropTypes.string),
  availableMonths: PropTypes.arrayOf(PropTypes.string),
  usuarios: PropTypes.arrayOf(PropTypes.object),
  onDateChange: PropTypes.func,
  onMonthChange: PropTypes.func,
  onUserChange: PropTypes.func
};

export default ReportCard;
