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
    throw new Error('useVentas debe utilizarse dentro de un VentasProvider');
  }
  return context;
};

/**
 * Procesa los datos de ventas para convertir las fechas en objetos Date
 * @param {Array} ventas - Array de ventas a procesar
 * @returns {Array} Array de ventas con fechas convertidas a objetos Date
 */
const procesarVentas = (ventas) => {
  return ventas.map(venta => ({
    ...venta,
    // Convertir la fecha de string a objeto Date si es necesario
    fechaHora: venta.fechaHora instanceof Date ? 
      venta.fechaHora : new Date(venta.fechaHora)
  }));
};

/**
 * Proveedor del contexto de ventas
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Componentes hijos
 * @returns {JSX.Element} Proveedor de contexto
 */
export const VentasProvider = ({ children }) => {
  // Estado para almacenar las ventas
  const [ventas, setVentas] = useState(() => procesarVentas(ventasData));
  
  // Estado para almacenar las estadísticas de ventas
  const [estadisticas, setEstadisticas] = useState({
    totalVentas: 0,
    promedioVentas: 0,
    ventasPorTipo: {
      efectivo: 0,
      debito: 0,
      credito: 0
    }
  });
  
  // Estado para almacenar los filtros de búsqueda
  const [filtros, setFiltros] = useState({
    texto: '',
    fechaInicio: null,
    fechaFin: null,
    vendedor: '',
    tipoPago: ''
  });
  
  /**
   * Calcula estadísticas basadas en las ventas actuales
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
    
    // Calcular el total de ventas
    const total = ventasActuales.reduce((acc, venta) => acc + venta.monto, 0);
    
    // Calcular el promedio de ventas
    const promedio = total / ventasActuales.length;
    
    // Calcular ventas por tipo de pago
    const ventasPorTipo = ventasActuales.reduce((acc, venta) => {
      const tipo = venta.tipoPago.toLowerCase();
      if (!acc[tipo]) {
        acc[tipo] = 0;
      }
      acc[tipo] += venta.monto;
      return acc;
    }, {});
    
    // Actualizar el estado con las nuevas estadísticas
    setEstadisticas({
      totalVentas: total,
      promedioVentas: promedio,
      ventasPorTipo
    });
  }, []);
  
  // Calcular estadísticas iniciales al cargar el componente
  useEffect(() => {
    calcularEstadisticas(ventas);
    
    // Iniciar el polling para actualizar los datos sin recompilar
    dataPoller.startPolling('ventas', (nuevasVentas) => {
      const ventasProcesadas = procesarVentas(nuevasVentas);
      setVentas(ventasProcesadas);
      calcularEstadisticas(ventasProcesadas);
    });
    
    // Detener el polling cuando el componente se desmonte
    return () => {
      dataPoller.stopPolling('ventas');
    };
  }, [calcularEstadisticas, ventas]);
  
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
        // Generar un ID secuencial para ventas
        id: `V${ventas.length > 0 ? 
          // Extraer el número del último ID y sumarle 1
          (parseInt(ventas[ventas.length - 1].id.replace('V', '')) + 1).toString().padStart(4, '0') : 
          // Si no hay ventas, empezar con V0001
          '0001'}`,
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
  }, [calcularEstadisticas, ventas]);
  
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
        monto: Number(datosActualizados.monto)
      };
      
      // Actualizar el estado local primero para evitar recargas
      setVentas(ventasActuales => {
        const ventasActualizadas = ventasActuales.map(v => 
          v.id === id ? ventaActualizada : v
        );
        calcularEstadisticas(ventasActualizadas);
        return ventasActualizadas;
      });
      
      // Guardar la venta actualizada en el archivo JSON a través de la API
      // Usar Promise para no bloquear la interfaz
      const promesaGuardado = actualizarVentaAPI(id, ventaActualizada);
      
      // Manejar la respuesta de forma asíncrona
      promesaGuardado.then(respuesta => {
        if (!respuesta.success) {
          console.error('Error al actualizar la venta en el servidor');
          // Si falla, revertir el cambio local
          setVentas(ventasActuales => {
            const ventasActualizadas = ventasActuales.map(v => 
              v.id === id ? ventaActual : v
            );
            calcularEstadisticas(ventasActualizadas);
            return ventasActualizadas;
          });
        }
      }).catch(error => {
        console.error('Error en la solicitud:', error);
        // Si hay un error, revertir el cambio local
        setVentas(ventasActuales => {
          const ventasActualizadas = ventasActuales.map(v => 
            v.id === id ? ventaActual : v
          );
          calcularEstadisticas(ventasActualizadas);
          return ventasActualizadas;
        });
      });
      
      // Devolver la venta actualizada inmediatamente
      return ventaActualizada;
    } catch (error) {
      console.error('Error al actualizar la venta:', error);
      return null;
    }
  }, [calcularEstadisticas, ventas]);
  
  /**
   * Elimina una venta existente y actualiza el archivo JSON a través de la API
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
        const ventasActualizadas = ventasActuales.filter(v => v.id !== id);
        calcularEstadisticas(ventasActualizadas);
        return ventasActualizadas;
      });
      
      // Eliminar la venta del archivo JSON a través de la API
      // Usar Promise para no bloquear la interfaz
      const promesaEliminacion = eliminarVentaAPI(id);
      
      // Manejar la respuesta de forma asíncrona
      promesaEliminacion.then(respuesta => {
        if (!respuesta.success) {
          console.error('Error al eliminar la venta en el servidor');
          // Si falla, revertir el cambio local
          setVentas(ventasActuales => {
            const ventasActualizadas = [...ventasActuales, ventaAEliminar];
            calcularEstadisticas(ventasActualizadas);
            return ventasActualizadas;
          });
          return false;
        }
      }).catch(error => {
        console.error('Error en la solicitud:', error);
        // Si hay un error, revertir el cambio local
        setVentas(ventasActuales => {
          const ventasActualizadas = [...ventasActuales, ventaAEliminar];
          calcularEstadisticas(ventasActualizadas);
          return ventasActualizadas;
        });
        return false;
      });
      
      // Devolver true para indicar que la eliminación fue exitosa
      return true;
    } catch (error) {
      console.error('Error al eliminar la venta:', error);
      return false;
    }
  }, [calcularEstadisticas, ventas]);
  
  /**
   * Filtra las ventas según los criterios especificados
   * @param {Object} criterios - Criterios de filtrado
   */
  const filtrarVentas = useCallback((criterios) => {
    setFiltros(criterios);
  }, []);
  
  /**
   * Obtiene las ventas filtradas según los criterios actuales
   * @returns {Array} Ventas filtradas
   */
  const obtenerVentasFiltradas = useCallback(() => {
    return ventas.filter(venta => {
      // Filtrar por texto (ID, vendedor)
      if (filtros.texto && !venta.id.toLowerCase().includes(filtros.texto.toLowerCase()) && 
          !venta.vendedor.toLowerCase().includes(filtros.texto.toLowerCase())) {
        return false;
      }
      
      // Filtrar por fecha de inicio
      if (filtros.fechaInicio && venta.fechaHora < filtros.fechaInicio) {
        return false;
      }
      
      // Filtrar por fecha de fin
      if (filtros.fechaFin) {
        const fechaFinConHora = new Date(filtros.fechaFin);
        fechaFinConHora.setHours(23, 59, 59, 999);
        if (venta.fechaHora > fechaFinConHora) {
          return false;
        }
      }
      
      // Filtrar por vendedor
      if (filtros.vendedor && venta.vendedor !== filtros.vendedor) {
        return false;
      }
      
      // Filtrar por tipo de pago
      if (filtros.tipoPago && venta.tipoPago !== filtros.tipoPago) {
        return false;
      }
      
      return true;
    });
  }, [ventas, filtros]);
  
  // Valor del contexto que se proporcionará a los componentes
  const value = {
    ventas,
    estadisticas,
    filtros,
    agregarVenta,
    actualizarVenta,
    eliminarVenta,
    filtrarVentas,
    obtenerVentasFiltradas
  };
  
  return (
    <VentasContext.Provider value={value}>
      {children}
    </VentasContext.Provider>
  );
};

export default VentasContext;
