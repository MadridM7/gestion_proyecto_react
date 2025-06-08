/**
 * @fileoverview Componente de filtros de tiempo para el dashboard
 */
import React from 'react';
import { Radio, Space, DatePicker, Tooltip } from 'antd';
import { 
  CalendarOutlined, 
  ClockCircleOutlined,
  HistoryOutlined,
} from '@ant-design/icons';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { useTimeRange } from '../../context/TimeRangeContext';
import '../../styles/components/molecules/TimeRangeFilter.css';

const { RangePicker } = DatePicker;

/**
 * Componente que proporciona filtros de tiempo para los gráficos y métricas del dashboard
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.showCustomRange - Indica si se muestra el selector de rango personalizado
 * @param {string} props.size - Tamaño de los componentes (small, middle, large)
 * @returns {JSX.Element} Filtros de tiempo
 */
const TimeRangeFilter = ({ 
  showCustomRange = true,
  size = "middle"
}) => {
  // Acceder al contexto de rango de tiempo
  const { timeRange, updateTimeRange } = useTimeRange();
  // Opciones de rango de tiempo predefinidas
  const rangeOptions = [
    { label: 'Hoy', value: 'today', icon: <ClockCircleOutlined /> },
    { label: 'Esta semana', value: 'week', icon: <CalendarOutlined /> },
    { label: 'Este mes', value: 'month', icon: <CalendarOutlined /> },
    { label: 'Este año', value: 'year', icon: <HistoryOutlined /> }
  ];

  /**
   * Maneja el evento de cambio de rango personalizado
   * @param {Array} dates - Array con fecha inicio y fecha fin
   */
  const handleCustomRangeChange = (dates) => {
    if (dates && dates.length === 2) {
      updateTimeRange({
        type: 'custom',
        startDate: dates[0].startOf('day').toDate(),
        endDate: dates[1].endOf('day').toDate()
      });
    }
  };

  /**
   * Manejador para los rangos predefinidos
   * @param {Object} e - Evento del cambio de radio button
   */
  const handleRangeOptionChange = (e) => {
    const range = e.target.value;
    let startDate, endDate;
    const now = dayjs();

    switch (range) {
      case 'today':
        startDate = now.startOf('day').toDate();
        endDate = now.endOf('day').toDate();
        break;
      case 'week':
        // Considera que la semana empieza el lunes
        startDate = now.startOf('week').add(1, 'day').toDate();
        endDate = now.endOf('week').add(1, 'day').toDate();
        break;
      case 'month':
        startDate = now.startOf('month').toDate();
        endDate = now.endOf('month').toDate();
        break;
      case 'year':
        startDate = now.startOf('year').toDate();
        endDate = now.endOf('year').toDate();
        break;
      default:
        return;
    }

    updateTimeRange({
      type: range,
      startDate,
      endDate
    });
  };

  return (
    <div className="time-range-filter">
      <Radio.Group 
        value={timeRange.type} 
        onChange={handleRangeOptionChange}
        optionType="button"
        size={size}
        buttonStyle="solid"
        className="range-radio-group"
      >
        <Space>
          {rangeOptions.map(option => (
            <Tooltip key={option.value} title={option.label}>
              <Radio.Button value={option.value}>
                {size === "small" ? option.icon : (
                  <>
                    {option.icon} {option.label}
                  </>
                )}
              </Radio.Button>
            </Tooltip>
          ))}
        </Space>
      </Radio.Group>
      
      {showCustomRange && (
        <div className="custom-range-picker">
          <RangePicker
            size={size}
            onChange={handleCustomRangeChange}
            allowClear={false}
            placeholder={['Inicio', 'Fin']}
          />
        </div>
      )}
    </div>
  );
};

TimeRangeFilter.propTypes = {
  currentRange: PropTypes.shape({
    type: PropTypes.string.isRequired,
    startDate: PropTypes.instanceOf(Date),
    endDate: PropTypes.instanceOf(Date)
  }).isRequired,
  onRangeChange: PropTypes.func.isRequired,
  showCustomRange: PropTypes.bool,
  size: PropTypes.string
};

export default TimeRangeFilter;
