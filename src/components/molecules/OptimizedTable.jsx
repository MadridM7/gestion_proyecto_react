/**
 * @fileoverview Componente de tabla optimizada con virtualización
 * Mejora el rendimiento al renderizar solo las filas visibles en la pantalla
 */
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Table, ConfigProvider } from 'antd';
import PropTypes from 'prop-types';
import { VIRTUALIZATION } from '../../config/performance';
import { useMemoized } from '../../hooks/useMemoized';
import '../../styles/components/molecules/OptimizedTable.css';

/**
 * Componente de tabla optimizada con virtualización para mejorar el rendimiento
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.dataSource - Datos para la tabla
 * @param {Array} props.columns - Columnas de la tabla
 * @param {Object} props.pagination - Configuración de paginación
 * @param {Function} props.onChange - Función para manejar cambios en la tabla
 * @param {boolean} props.loading - Indica si la tabla está cargando datos
 * @param {Object} props.scroll - Configuración de scroll
 * @param {string} props.rowKey - Clave única para cada fila
 * @param {Function} props.onRow - Función para configurar propiedades de fila
 * @param {string} props.className - Clase CSS adicional
 * @returns {JSX.Element} Tabla optimizada
 */
const OptimizedTable = ({
  dataSource = [],
  columns = [],
  pagination = { pageSize: 10 },
  onChange,
  loading = false,
  scroll = { y: 400 },
  rowKey = 'id',
  onRow,
  className = '',
  ...restProps
}) => {
  // Referencias
  const tableRef = useRef(null);
  
  // Estado
  const [tableHeight, setTableHeight] = useState(scroll.y || 400);
  
  // Calcular la altura de la tabla basada en el contenedor
  useEffect(() => {
    if (tableRef.current) {
      const updateHeight = () => {
        const container = tableRef.current.querySelector('.ant-table-container');
        if (container) {
          const containerRect = container.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          const maxHeight = windowHeight * 0.7; // 70% de la altura de la ventana
          setTableHeight(Math.min(containerRect.height, maxHeight));
        }
      };
      
      // Actualizar altura inicial
      updateHeight();
      
      // Actualizar altura al cambiar el tamaño de la ventana
      window.addEventListener('resize', updateHeight);
      
      return () => {
        window.removeEventListener('resize', updateHeight);
      };
    }
  }, []);
  
  // Memoizar la configuración de virtualización
  const virtualConfig = useMemoized({
    // Habilitar virtualización solo si hay suficientes elementos
    enabled: dataSource.length > VIRTUALIZATION.THRESHOLD,
    itemSize: VIRTUALIZATION.ROW_HEIGHT, // Altura de cada fila
    overscan: VIRTUALIZATION.OVERSCAN_COUNT, // Filas adicionales a renderizar
  }, [dataSource.length]);
  
  // Memoizar la configuración de scroll
  const scrollConfig = useMemo(() => ({
    ...scroll,
    y: tableHeight,
  }), [scroll, tableHeight]);
  
  // Memoizar la configuración de paginación
  const paginationConfig = useMemo(() => {
    // Si hay pocos elementos, no mostrar paginación
    if (dataSource.length <= pagination.pageSize) {
      return false;
    }
    
    return {
      ...pagination,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total) => `Total: ${total} elementos`,
    };
  }, [dataSource.length, pagination]);
  
  return (
    <div ref={tableRef} className={`optimized-table-container ${className}`}>
      <ConfigProvider
        virtual={virtualConfig}
      >
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={paginationConfig}
          onChange={onChange}
          loading={loading}
          scroll={scrollConfig}
          rowKey={rowKey}
          onRow={onRow}
          className="optimized-table"
          {...restProps}
        />
      </ConfigProvider>
    </div>
  );
};

OptimizedTable.propTypes = {
  dataSource: PropTypes.array,
  columns: PropTypes.array,
  pagination: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  onChange: PropTypes.func,
  loading: PropTypes.bool,
  scroll: PropTypes.object,
  rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  onRow: PropTypes.func,
  className: PropTypes.string,
};

export default OptimizedTable;
