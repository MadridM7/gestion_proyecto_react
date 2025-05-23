/**
 * @fileoverview Componente atómico para selección de fechas usando react-datepicker
 */
import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import { Form } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import es from 'date-fns/locale/es';
import 'react-datepicker/dist/react-datepicker.css';

// Componente personalizado para el icono del calendario
const CustomInput = forwardRef(({ value, onClick, placeholder }, ref) => (
  <div className="custom-datepicker-input" onClick={onClick} ref={ref}>
    <input 
      value={value} 
      className="ant-input" 
      placeholder={placeholder} 
      readOnly 
    />
    <CalendarOutlined className="calendar-icon" />
  </div>
));

CustomInput.displayName = 'CustomInput';

/**
 * Componente atómico para selección de fechas usando react-datepicker
 * @param {Object} props - Propiedades del componente
 * @returns {JSX.Element} Componente de selección de fechas
 */
const ReactDatePickerWrapper = ({
  label,
  name,
  value,
  onChange,
  placeholder = 'Seleccionar fecha',
  showWeekNumbers = false,
  showMonthYearPicker = false,
  showYearPicker = false,
  minDate,
  maxDate,
  filterDate,
  disabled = false,
  className = "",
  rules = []
}) => {

  // Determinar el formato de fecha basado en el tipo de selector
  const getDateFormat = () => {
    if (showYearPicker) return "yyyy";
    if (showMonthYearPicker) return "MMMM yyyy";
    if (showWeekNumbers) return "'Semana' ww, yyyy";
    return "dd/MM/yyyy";
  };

  return (
    <Form.Item
      label={label}
      name={name}
      rules={rules}
      className={`react-datepicker-form-item ${className}`}
    >
      <DatePicker
        selected={value}
        onChange={onChange}
        customInput={<CustomInput placeholder={placeholder} />}
        dateFormat={getDateFormat()}
        showWeekNumbers={showWeekNumbers}
        showMonthYearPicker={showMonthYearPicker}
        showYearPicker={showYearPicker}
        minDate={minDate}
        maxDate={maxDate}
        filterDate={filterDate}
        disabled={disabled}
        locale={es}
        popperClassName="datepicker-popper"
        calendarClassName="datepicker-calendar"
        withPortal
        portalId="datepicker-portal"
        shouldCloseOnSelect
        className="react-datepicker-wrapper"
      />
    </Form.Item>
  );
};

ReactDatePickerWrapper.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.instanceOf(Date),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  dateFormat: PropTypes.string,
  showWeekNumbers: PropTypes.bool,
  showMonthYearPicker: PropTypes.bool,
  showYearPicker: PropTypes.bool,
  minDate: PropTypes.instanceOf(Date),
  maxDate: PropTypes.instanceOf(Date),
  filterDate: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  rules: PropTypes.array
};

export default ReactDatePickerWrapper;
