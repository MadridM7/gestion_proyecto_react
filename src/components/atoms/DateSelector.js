/**
 * @fileoverview Selector de fecha para reportes
 */
import React from 'react';
import { DatePicker, Form } from 'antd';
import PropTypes from 'prop-types';

/**
 * Componente atómico para selección de fechas
 * @param {Object} props - Propiedades del componente
 * @returns {JSX.Element} Selector de fecha
 */
const DateSelector = ({ 
  label, 
  onChange, 
  availableDates, 
  placeholder = "Selecciona una fecha", 
  format = "DD/MM/YYYY",
  picker = "date"
}) => {
  // Función para determinar si una fecha debe estar deshabilitada
  const disabledDate = (current) => {
    if (!availableDates || availableDates.length === 0) return false;
    
    const formattedDate = current.format(picker === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM');
    return !availableDates.includes(formattedDate);
  };

  return (
    <Form.Item label={label} name={picker === 'date' ? 'date' : 'month'}>
      <DatePicker 
        style={{ width: '100%' }}
        format={format}
        placeholder={placeholder}
        onChange={onChange}
        disabledDate={disabledDate}
        picker={picker}
      />
    </Form.Item>
  );
};

DateSelector.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  availableDates: PropTypes.arrayOf(PropTypes.string),
  placeholder: PropTypes.string,
  format: PropTypes.string,
  picker: PropTypes.oneOf(['date', 'month', 'year'])
};

export default DateSelector;
