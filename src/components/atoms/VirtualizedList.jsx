/**
 * @fileoverview Componente para renderizar listas virtualizadas
 * Mejora el rendimiento al renderizar solo los elementos visibles en la pantalla
 */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { VIRTUALIZATION } from '../../config/performance';
import { useMemoized } from '../../hooks/useMemoized';
import '../../styles/components/atoms/VirtualizedList.css';

/**
 * Componente para renderizar listas virtualizadas
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.items - Elementos a renderizar
 * @param {Function} props.renderItem - Función para renderizar cada elemento
 * @param {number} props.height - Altura del contenedor
 * @param {number} props.rowHeight - Altura de cada fila
 * @param {number} props.overscanCount - Número de elementos a renderizar fuera de la vista
 * @param {string} props.className - Clase CSS adicional
 * @returns {JSX.Element} Lista virtualizada
 */
const VirtualizedList = ({
  items = [],
  renderItem,
  height = 400,
  rowHeight = VIRTUALIZATION.ROW_HEIGHT,
  overscanCount = VIRTUALIZATION.OVERSCAN_COUNT,
  className = '',
}) => {
  // Referencias
  const containerRef = useRef(null);
  
  // Estado
  const [scrollTop, setScrollTop] = useState(0);
  const [visibleItems, setVisibleItems] = useState([]);
  
  // Calcular índices visibles
  const totalHeight = items.length * rowHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - overscanCount);
  const endIndex = Math.min(
    items.length - 1,
    Math.floor((scrollTop + height) / rowHeight) + overscanCount
  );
  
  // Memoizar los elementos visibles
  const memoizedVisibleItems = useMemoized(
    items.slice(startIndex, endIndex + 1).map((item, index) => ({
      item,
      index: startIndex + index,
      style: {
        position: 'absolute',
        top: (startIndex + index) * rowHeight,
        height: rowHeight,
        left: 0,
        right: 0,
      },
    })),
    [items, startIndex, endIndex, rowHeight]
  );
  
  // Actualizar elementos visibles cuando cambia el scroll
  useEffect(() => {
    setVisibleItems(memoizedVisibleItems);
  }, [memoizedVisibleItems]);
  
  // Manejar evento de scroll
  const handleScroll = (e) => {
    setScrollTop(e.target.scrollTop);
  };
  
  return (
    <div
      ref={containerRef}
      className={`virtualized-list-container ${className}`}
      style={{ height, overflow: 'auto' }}
      onScroll={handleScroll}
    >
      <div
        className="virtualized-list-content"
        style={{ height: totalHeight, position: 'relative' }}
      >
        {visibleItems.map(({ item, index, style }) => (
          <div key={index} style={style} className="virtualized-list-item">
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  );
};

VirtualizedList.propTypes = {
  items: PropTypes.array.isRequired,
  renderItem: PropTypes.func.isRequired,
  height: PropTypes.number,
  rowHeight: PropTypes.number,
  overscanCount: PropTypes.number,
  className: PropTypes.string,
};

export default VirtualizedList;
