/**
 * @fileoverview Contexto para manejar el rango de tiempo seleccionado en todo el dashboard
 */
import React, { createContext, useContext, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

// Crear el contexto
const TimeRangeContext = createContext();

/**
 * Proveedor del contexto para manejar el rango de tiempo global
 * @param {Object} props - Props del componente
 * @returns {JSX.Element} Proveedor de contexto
 */
export const TimeRangeProvider = ({ children }) => {
  // Estado para almacenar el rango de tiempo actual
  // Por defecto, muestra datos de la semana actual
  const [timeRange, setTimeRange] = useState(() => {
    const now = dayjs();
    const startOfWeek = now.startOf('week').add(1, 'day').toDate(); // Lunes
    const endOfWeek = now.endOf('week').add(1, 'day').toDate(); // Domingo
    
    return {
      type: 'week',
      startDate: startOfWeek,
      endDate: endOfWeek
    };
  });

  /**
   * Actualiza el rango de tiempo seleccionado
   * @param {Object} newRange - Nuevo rango de tiempo
   */
  const updateTimeRange = (newRange) => {
    setTimeRange(newRange);
  };

  // Memorizar el valor del contexto para evitar renderizados innecesarios
  const contextValue = useMemo(() => ({
    timeRange,
    updateTimeRange
  }), [timeRange]);

  return (
    <TimeRangeContext.Provider value={contextValue}>
      {children}
    </TimeRangeContext.Provider>
  );
};

TimeRangeProvider.propTypes = {
  children: PropTypes.node.isRequired
};

/**
 * Hook personalizado para acceder al contexto de rango de tiempo
 * @returns {Object} Objeto con el rango de tiempo y función para actualizarlo
 */
export const useTimeRange = () => {
  const context = useContext(TimeRangeContext);
  
  if (!context) {
    throw new Error('useTimeRange debe ser usado dentro de un TimeRangeProvider');
  }
  
  return context;
};

export default TimeRangeContext;
