/**
 * @fileoverview Contexto para la gestión de ventas en la aplicación
 * Proporciona funcionalidades para agregar, editar, eliminar y filtrar ventas,
 * así como calcular estadísticas relacionadas con las ventas.
 * Implementa un sistema de polling para actualizar los datos sin recompilar la aplicación.
 */
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

// Importar datos de ventas desde el archivo JSON para la carga inicial
import ventasData from '../data/ventas.json';

// Importar servicios API
import { 
  agregarVenta as agregarVentaAPI,
  actualizarVenta as actualizarVentaAPI,
  eliminarVenta as eliminarVentaAPI 
} from '../services/api';

// Importar el sistema de polling para actualización de datos sin recompilar
import { dataPoller } from '../services/dataPoller';

// Contexto para la gestión de ventas

// Crear el contexto de ventas
const VentasContext = createContext();

/**
 * Hook personalizado para acceder al contexto de ventas
 * @returns {Object} Contexto de ventas
 */
export const useVentas = () => {
  const context = useContext(VentasContext);
  if (!context) {
    throw new Error('useVentas debe ser usado dentro de un VentasProvider');
  }
  return context;
};

/**
 * Procesa los datos de ventas para convertir las fechas en objetos Date
 * @param {Array} ventas - Array de ventas a procesar
 * @returns {Array} Array de ventas con fechas convertidas a objetos Date
 */
const procesarVentas = (ventas) => {
  if (!Array.isArray(ventas)) return [];
  
  return ventas.map(venta => ({
    ...venta,
    fechaHora: venta.fechaHora instanceof Date ? venta.fechaHora : new Date(venta.fechaHora)
  }));
};

/**
 * Proveedor del contexto de ventas
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Componentes hijos
 * @returns {JSX.Element} Proveedor de contexto
 */
export const VentasProvider = ({ children }) => {
  // Estado para las ventas
  const [ventas, setVentas] = useState([]);
  
  // Estado para las estadísticas
  const [estadisticas, setEstadisticas] = useState({
    totalVentas: 0,
    promedioVentas: 0,
    ventasPorTipo: {
      efectivo: 0,
      debito: 0,
      credito: 0
    }
  });

  /**
   * Calcula estadísticas basadas en las ventas
   * @param {Array} ventasActuales - Array de ventas para calcular estadísticas
   */
  const calcularEstadisticas = useCallback((ventasActuales) => {
    // Valores por defecto si no hay ventas
    if (!ventasActuales || ventasActuales.length === 0) {
      setEstadisticas({
        totalVentas: 0,
        promedioVentas: 0,
        ventasPorTipo: {
          efectivo: 0,
          debito: 0,
          credito: 0
        }
      });
      return;
    }
    
    try {
      // Calcular total de ventas
      const total = ventasActuales.reduce((sum, venta) => {
        const monto = typeof venta.monto === 'number' ? venta.monto : 0;
        return sum + monto;
      }, 0);
      
      // Calcular promedio por venta
      const promedio = ventasActuales.length > 0 ? total / ventasActuales.length : 0;
      
      // Calcular ventas por tipo de pago
      const porTipo = {
        efectivo: ventasActuales.filter(v => v.tipoPago === 'efectivo')
          .reduce((sum, v) => sum + (typeof v.monto === 'number' ? v.monto : 0), 0),
        debito: ventasActuales.filter(v => v.tipoPago === 'debito')
          .reduce((sum, v) => sum + (typeof v.monto === 'number' ? v.monto : 0), 0),
        credito: ventasActuales.filter(v => v.tipoPago === 'credito')
          .reduce((sum, v) => sum + (typeof v.monto === 'number' ? v.monto : 0), 0)
      };
      
      // Actualizar el estado de estadísticas
      setEstadisticas({
        totalVentas: total,
        promedioVentas: promedio,
        ventasPorTipo: porTipo
      });
    } catch (error) {
      // Capturar error silenciosamente
      // En caso de error, establecer valores por defecto
      setEstadisticas({
        totalVentas: 0,
        promedioVentas: 0,
        ventasPorTipo: {
          efectivo: 0,
          debito: 0,
          credito: 0
        }
      });
    }
  }, []);

  // Cargar ventas al iniciar y configurar el polling
  useEffect(() => {
    // Cargar datos iniciales desde el archivo JSON
    const ventasProcesadas = procesarVentas(ventasData);
    setVentas(ventasProcesadas);
    calcularEstadisticas(ventasProcesadas);
    
    // Configurar el polling para actualizar los datos sin recompilar
    const handleVentasUpdate = (nuevasVentas) => {
      const ventasActualizadas = procesarVentas(nuevasVentas);
      setVentas(ventasActualizadas);
      calcularEstadisticas(ventasActualizadas);
      // Datos actualizados silenciosamente
    };
    
    // Iniciar el polling cada 5 segundos
    dataPoller.startPolling('ventas', handleVentasUpdate, 5000);
    
    // Detener el polling cuando el componente se desmonte
    return () => {
      dataPoller.stopPolling('ventas');
    };
  }, [calcularEstadisticas]);

  /**
   * Agrega una nueva venta y la guarda en el archivo JSON a través de la API
   * @param {Object} nuevaVenta - Datos de la nueva venta
   */
  const agregarVenta = useCallback(async (nuevaVenta) => {
    try {
      // Normalizar los datos de la venta
      const ventaNormalizada = {
        ...nuevaVenta,
        // Generar un ID único
        id: `V${Math.floor(Math.random() * 10000)}`,
        // Asegurar que la fecha sea un objeto Date
        fechaHora: nuevaVenta.fechaHora instanceof Date ? 
          nuevaVenta.fechaHora : new Date(),
        // Asegurar que el monto sea un número
        monto: Number(nuevaVenta.monto)
      };
      
      // Guardar la nueva venta en el archivo JSON a través de la API
      const respuesta = await agregarVentaAPI(ventaNormalizada);
      
      if (respuesta.success) {
        // Actualizar el estado local
        setVentas(ventasActuales => {
          const nuevasVentas = [...ventasActuales, ventaNormalizada];
          calcularEstadisticas(nuevasVentas);
          return nuevasVentas;
        });
        
        // Venta agregada exitosamente
        return ventaNormalizada;
      } else {
        // Error al guardar la venta
        return null;
      }
    } catch (error) {
      // Capturar error silenciosamente
      return null;
    }
  }, [calcularEstadisticas]);

  /**
   * Actualiza una venta existente y la guarda en el archivo JSON a través de la API
   * @param {string} id - ID de la venta a actualizar
   * @param {Object} datosActualizados - Nuevos datos de la venta
   */
  const actualizarVenta = useCallback(async (id, datosActualizados) => {
    try {
      // Buscar la venta actual
      const ventaActual = ventas.find(v => v.id === id);
      
      if (!ventaActual) {
        console.error(`No se encontró la venta con ID ${id}`);
        return null;
      }
      
      // Normalizar los datos actualizados
      const ventaActualizada = {
        ...ventaActual,
        ...datosActualizados,
        // Asegurar que la fecha sea un objeto Date
        fechaHora: datosActualizados.fechaHora instanceof Date ? 
          datosActualizados.fechaHora : new Date(datosActualizados.fechaHora),
        // Asegurar que el monto sea un número
        monto: Number(datosActualizados.monto || ventaActual.monto)
      };
      
      // Actualizar la venta en el archivo JSON a través de la API
      const respuesta = await actualizarVentaAPI(id, ventaActualizada);
      
      if (respuesta.success) {
        // Actualizar el estado local
        setVentas(ventasActuales => {
          const ventasActualizadas = ventasActuales.map(venta => 
            venta.id === id ? ventaActualizada : venta
          );
          calcularEstadisticas(ventasActualizadas);
          return ventasActualizadas;
        });
        
        // Venta actualizada exitosamente
        return ventaActualizada;
      } else {
        // Error al guardar la actualización
        return null;
      }
    } catch (error) {
      // Capturar error silenciosamente
      return null;
    }
  }, [ventas, calcularEstadisticas]);

  /**
   * Elimina una venta y actualiza el archivo JSON a través de la API
   * @param {string} id - ID de la venta a eliminar
   */
  const eliminarVenta = useCallback(async (id) => {
    try {
      // Eliminar la venta a través de la API
      const respuesta = await eliminarVentaAPI(id);
      
      if (respuesta.success) {
        // Actualizar el estado local
        setVentas(ventasActuales => {
          const ventasActualizadas = ventasActuales.filter(venta => venta.id !== id);
          calcularEstadisticas(ventasActualizadas);
          return ventasActualizadas;
        });
        
        // Venta eliminada exitosamente
        return true;
      } else {
        // Error al eliminar la venta
        return false;
      }
    } catch (error) {
      // Capturar error silenciosamente
      return false;
    }
  }, [calcularEstadisticas]);

  // Valor del contexto
  const value = {
    ventas,
    estadisticas,
    agregarVenta,
    actualizarVenta,
    eliminarVenta
  };

  return (
    <VentasContext.Provider value={value}>
      {children}
    </VentasContext.Provider>
  );
};

export default VentasContext;
