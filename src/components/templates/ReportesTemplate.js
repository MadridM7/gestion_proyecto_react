/**
 * @fileoverview Template para la página de reportes
 */
import React from 'react';
import PropTypes from 'prop-types';
import ReportGrid from '../organisms/ReportGrid';

/**
 * Componente template que estructura la página de reportes
 * @param {Object} props - Propiedades del componente
 * @returns {JSX.Element} Template de la página de reportes
 */
const ReportesTemplate = ({
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
  return (
    <div className="reportes-container">      
      
      {/* Grilla de reportes */}
      <ReportGrid
        reportes={reportes}
        activeReport={activeReport}
        hayDatos={hayDatos}
        onSelectReport={onSelectReport}
        onDownloadReport={onDownloadReport}
        form={form}
        availableDates={availableDates}
        availableMonths={availableMonths}
        usuarios={usuarios}
        onDateChange={onDateChange}
        onMonthChange={onUserChange}
        onUserChange={onUserChange}
      />
    </div>
  );
};

ReportesTemplate.propTypes = {
  reportes: PropTypes.array.isRequired,
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

export default ReportesTemplate;
