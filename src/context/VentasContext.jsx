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
      
      // Actualizar el estado local primero para evitar recargas
      setVentas(ventasActuales => {
        const nuevasVentas = [...ventasActuales, ventaNormalizada];
        calcularEstadisticas(nuevasVentas);
        return nuevasVentas;
      });
      
      // Guardar la nueva venta en el archivo JSON a través de la API
      // Usar Promise para no bloquear la interfaz
      const promesaGuardado = agregarVentaAPI(ventaNormalizada);
      
      // Manejar la respuesta de forma asíncrona
      promesaGuardado.then(respuesta => {
        if (!respuesta.success) {
          console.error('Error al guardar la venta en el servidor');
          // Si falla, revertir el cambio local
          setVentas(ventasActuales => {
            const ventasActualizadas = ventasActuales.filter(v => v.id !== ventaNormalizada.id);
            calcularEstadisticas(ventasActualizadas);
            return ventasActualizadas;
          });
        }
      }).catch(error => {
        console.error('Error en la solicitud:', error);
        // Si hay un error, revertir el cambio local
        setVentas(ventasActuales => {
          const ventasActualizadas = ventasActuales.filter(v => v.id !== ventaNormalizada.id);
          calcularEstadisticas(ventasActualizadas);
          return ventasActualizadas;
        });
      });
      
      // Devolver la venta normalizada inmediatamente
      return ventaNormalizada;
    } catch (error) {
      console.error('Error al procesar la venta:', error);
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
      
      // Guardar la venta original para posible reversión
      const ventaOriginal = { ...ventaActual };
      
      // Actualizar el estado local primero para evitar recargas
      setVentas(ventasActuales => {
        const ventasActualizadas = ventasActuales.map(venta => 
          venta.id === id ? ventaActualizada : venta
        );
        calcularEstadisticas(ventasActualizadas);
        return ventasActualizadas;
      });
      
      // Actualizar la venta en el archivo JSON a través de la API de forma asíncrona
      const promesaActualizacion = actualizarVentaAPI(id, ventaActualizada);
      
      // Manejar la respuesta de forma asíncrona
      promesaActualizacion.then(respuesta => {
        if (!respuesta.success) {
          console.error('Error al actualizar la venta en el servidor');
          // Si falla, revertir el cambio local
          setVentas(ventasActuales => {
            const ventasRestauradas = ventasActuales.map(venta => 
              venta.id === id ? ventaOriginal : venta
            );
            calcularEstadisticas(ventasRestauradas);
            return ventasRestauradas;
          });
        }
      }).catch(error => {
        console.error('Error en la solicitud de actualización:', error);
        // Si hay un error, revertir el cambio local
        setVentas(ventasActuales => {
          const ventasRestauradas = ventasActuales.map(venta => 
            venta.id === id ? ventaOriginal : venta
          );
          calcularEstadisticas(ventasRestauradas);
          return ventasRestauradas;
        });
      });
      
      // Devolver la venta actualizada inmediatamente
      return ventaActualizada;
    } catch (error) {
      console.error('Error al procesar la actualización de la venta:', error);
      return null;
    }
  }, [ventas, calcularEstadisticas]);

  /**
   * Elimina una venta y actualiza el archivo JSON a través de la API
   * @param {string} id - ID de la venta a eliminar
   */
  const eliminarVenta = useCallback(async (id) => {
    try {
      // Encontrar la venta a eliminar para posible restauración
      const ventaAEliminar = ventas.find(v => v.id === id);
      
      if (!ventaAEliminar) {
        console.error(`No se encontró la venta con ID ${id} para eliminar`);
        return false;
      }
      
      // Actualizar el estado local primero para evitar recargas
      setVentas(ventasActuales => {
        const ventasActualizadas = ventasActuales.filter(venta => venta.id !== id);
        calcularEstadisticas(ventasActualizadas);
        return ventasActualizadas;
      });
      
      // Eliminar la venta a través de la API de forma asíncrona
      const promesaEliminacion = eliminarVentaAPI(id);
      
      // Manejar la respuesta de forma asíncrona
      promesaEliminacion.then(respuesta => {
        if (!respuesta.success) {
          console.error('Error al eliminar la venta en el servidor');
          // Si falla, restaurar la venta eliminada
          setVentas(ventasActuales => {
            const ventasRestauradas = [...ventasActuales, ventaAEliminar];
            // Ordenar por ID para mantener el orden original
            ventasRestauradas.sort((a, b) => a.id.localeCompare(b.id));
            calcularEstadisticas(ventasRestauradas);
            return ventasRestauradas;
          });
        }
      }).catch(error => {
        console.error('Error en la solicitud de eliminación:', error);
        // Si hay un error, restaurar la venta eliminada
        setVentas(ventasActuales => {
          const ventasRestauradas = [...ventasActuales, ventaAEliminar];
          // Ordenar por ID para mantener el orden original
          ventasRestauradas.sort((a, b) => a.id.localeCompare(b.id));
          calcularEstadisticas(ventasRestauradas);
          return ventasRestauradas;
        });
      });
      
      // Devolver true inmediatamente para mejorar la experiencia del usuario
      return true;
    } catch (error) {
      console.error('Error al procesar la eliminación de la venta:', error);
      return false;
    }
  }, [ventas, calcularEstadisticas]);

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
