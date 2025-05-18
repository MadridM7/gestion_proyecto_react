/**
 * @fileoverview Grilla de tarjetas de reportes
 */
import React from 'react';
import { Row, Col, Alert } from 'antd';
import PropTypes from 'prop-types';
import ReportCard from '../molecules/ReportCard';

/**
 * Componente organismo que muestra una grilla de tarjetas de reportes
 * @param {Object} props - Propiedades del componente
 * @returns {JSX.Element} Grilla de tarjetas de reportes
 */
const ReportGrid = ({ 
  reportes, 
  activeReport, 
  hayDatos,
  onSelectReport, 
  onDownloadReport,
  form,
  availableDates,
  availableMonths,
  usuarios,
  onDateChange,
  onMonthChange,
  onUserChange
}) => {
  // Si no hay datos, mostrar alerta
  if (!hayDatos) {
    return (
      <Alert
        message="No hay datos suficientes"
        description="No hay suficientes datos para generar reportes. Agrega algunas ventas primero."
        type="warning"
        showIcon
        className="data-alert"
      />
    );
  }

  return (
    <Row gutter={[16, 16]} className="reports-row">
      {reportes.map(reporte => (
        <Col xs={24} md={12} lg={8} key={reporte.id}>
          <ReportCard
            reporte={reporte}
            isActive={activeReport === reporte.id.toLowerCase()}
            onSelect={onSelectReport}
            onDownload={onDownloadReport}
            form={form}
            availableDates={availableDates}
            availableMonths={availableMonths}
            usuarios={usuarios}
            onDateChange={onDateChange}
            onMonthChange={onMonthChange}
            onUserChange={onUserChange}
          />
        </Col>
      ))}
    </Row>
  );
};

ReportGrid.propTypes = {
  reportes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      titulo: PropTypes.string.isRequired,
      descripcion: PropTypes.string.isRequired,
      icono: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
      formatos: PropTypes.arrayOf(PropTypes.string).isRequired
    })
  ).isRequired,
  activeReport: PropTypes.string,
  hayDatos: PropTypes.bool.isRequired,
  onSelectReport: PropTypes.func.isRequired,
  onDownloadReport: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  availableDates: PropTypes.arrayOf(PropTypes.string),
  availableMonths: PropTypes.arrayOf(PropTypes.string),
  usuarios: PropTypes.arrayOf(PropTypes.object),
  onDateChange: PropTypes.func,
  onMonthChange: PropTypes.func,
  onUserChange: PropTypes.func
};

export default ReportGrid;
