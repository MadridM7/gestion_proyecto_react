/**
 * @fileoverview Componente atómico para selección de fechas usando react-datepicker
 */
import React, { forwardRef, useState, useEffect } from 'react';
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
  showTimeSelect = false,
  timeFormat = 'HH:mm',
  timeIntervals = 15,
  dateFormat,
  minDate,
  maxDate,
  filterDate,
  disabled = false,
  className = "",
  rules = []
}) => {
  // Estado interno para manejar la fecha seleccionada
  const [selectedDate, setSelectedDate] = useState(value);

  // Actualizar el estado interno cuando cambia el valor externo
  useEffect(() => {
    if (value !== selectedDate) {
      setSelectedDate(value);
    }
  }, [value, selectedDate]);

  // Determinar el formato de fecha basado en el tipo de selector
  const getDateFormat = () => {
    if (dateFormat) return dateFormat;
    if (showYearPicker) return "yyyy";
    if (showMonthYearPicker) return "MMMM yyyy";
    if (showWeekNumbers) return "'Semana' ww, yyyy";
    if (showTimeSelect) return "dd/MM/yyyy HH:mm";
    return "dd/MM/yyyy";
  };

  // Manejar el cambio de fecha
  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (onChange) {
      onChange(date);
    }
  };

  // Si el componente se usa dentro de un Form.Item, no necesitamos envolverlo en otro Form.Item
  const datePicker = (
    <DatePicker
      selected={selectedDate}
      onChange={handleDateChange}
      customInput={<CustomInput placeholder={placeholder} />}
      dateFormat={getDateFormat()}
      showWeekNumbers={showWeekNumbers}
      showMonthYearPicker={showMonthYearPicker}
      showYearPicker={showYearPicker}
      showTimeSelect={showTimeSelect}
      timeFormat={timeFormat}
      timeIntervals={timeIntervals}
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
      // Mejoras para la interacción
      onBlur={() => {}} // Prevenir comportamiento por defecto
      onCalendarOpen={() => {}} // Prevenir comportamiento por defecto
      onCalendarClose={() => {}} // Prevenir comportamiento por defecto
      onClickOutside={() => {}} // Prevenir comportamiento por defecto
      // Asegurar que el calendario se muestre correctamente
      popperModifiers={{
        preventOverflow: {
          enabled: true,
          escapeWithReference: false,
          boundariesElement: 'viewport'
        }
      }}
      // Asegurar que el calendario se cierre solo cuando se selecciona una fecha
      closeOnScroll={false}
    />
  );

  // Si se proporcionan label, name y rules, envolvemos en Form.Item
  if (name && label) {
    return (
      <Form.Item
        label={label}
        name={name}
        rules={rules}
        className={`react-datepicker-form-item ${className}`}
      >
        {datePicker}
      </Form.Item>
    );
  }
  
  // Si no, devolvemos solo el DatePicker
  return datePicker;
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
  showTimeSelect: PropTypes.bool,
  timeFormat: PropTypes.string,
  timeIntervals: PropTypes.number,
  minDate: PropTypes.instanceOf(Date),
  maxDate: PropTypes.instanceOf(Date),
  filterDate: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  rules: PropTypes.array
};

export default ReactDatePickerWrapper;
