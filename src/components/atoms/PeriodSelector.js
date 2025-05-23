/**
 * @fileoverview Selector de período atómico para filtrar reportes
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Radio, Form } from 'antd';

/**
 * Componente atómico que representa un selector de período para reportes
 * @param {Object} props - Propiedades del componente
 * @returns {JSX.Element} Selector de período (día, semana, mes, año)
 */
const PeriodSelector = ({ 
  label, 
  onChange, 
  value,
  options,
  name
}) => {
  return (
    <Form.Item 
      label={label}
      name={name}
      className="period-selector-form-item"
    >
      <Radio.Group 
        onChange={(e) => onChange(e.target.value)} 
        value={value}
        optionType="button"
        buttonStyle="solid"
        className="period-selector"
      >
        {options.map(option => (
          <Radio.Button 
            key={option.value} 
            value={option.value}
          >
            {option.label}
          </Radio.Button>
        ))}
      </Radio.Group>
    </Form.Item>
  );
};

PeriodSelector.propTypes = {
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })
  ),
  name: PropTypes.string
};

PeriodSelector.defaultProps = {
  label: 'Período',
  value: 'day',
  options: [
    { label: 'Día', value: 'day' },
    { label: 'Semana', value: 'week' },
    { label: 'Mes', value: 'month' },
    { label: 'Año', value: 'year' }
  ],
  name: 'period'
};

export default PeriodSelector;
