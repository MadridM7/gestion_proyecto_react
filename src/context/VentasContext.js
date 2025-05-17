/**
 * @fileoverview Contexto para la gestión de ventas en la aplicación
 * Proporciona funcionalidades para agregar, editar, eliminar y filtrar ventas,
 * así como calcular estadísticas relacionadas con las ventas.
 */
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

// Importar datos de ventas desde el archivo JSON
import ventasData from '../data/ventas.json';

// Importar servicios API
import { 
  guardarVentas as guardarVentasAPI,
  agregarVenta as agregarVentaAPI,
  actualizarVenta as actualizarVentaAPI,
  eliminarVenta as eliminarVentaAPI 
} from '../services/api';

/**
 * Procesa los datos de ventas del archivo JSON para convertir las fechas en objetos Date
 * @returns {Array} Array de ventas con fechas convertidas a objetos Date
 */
const procesarDatosVentas = () => {
  return ventasData.map(venta => ({
    ...venta,
    fechaHora: new Date(venta.fechaHora)
  }));
};

// Datos iniciales de ventas procesados desde el archivo JSON
const ventasIniciales = procesarDatosVentas();

// Clave para guardar las ventas en localStorage
const VENTAS_STORAGE_KEY = 'dashboard-ventas';

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

// Función auxiliar para convertir fechas de string a objeto Date
const convertirFechasVentas = (ventas) => {
  return ventas.map(venta => ({
    ...venta,
    fechaHora: venta.fechaHora instanceof Date ? venta.fechaHora : new Date(venta.fechaHora)
  }));
};

/**
 * Función para guardar las ventas en el archivo JSON a través de la API
 * @param {Array} ventas - Array de ventas a guardar
 */
const guardarVentas = async (ventas) => {
  try {
    // Convertir las fechas a strings antes de guardar para evitar problemas de serialización
    const ventasParaGuardar = ventas.map(venta => ({
      ...venta,
      fechaHora: venta.fechaHora instanceof Date ? venta.fechaHora.toISOString() : venta.fechaHora
    }));
    
    // Guardar en localStorage como respaldo
    localStorage.setItem(VENTAS_STORAGE_KEY, JSON.stringify(ventasParaGuardar));
    
    // Guardar en el archivo JSON a través de la API
    await guardarVentasAPI(ventasParaGuardar);
    
    console.log('Ventas guardadas en el archivo JSON:', ventasParaGuardar);
  } catch (error) {
    console.error('Error al guardar ventas:', error);
    // En caso de error, al menos intentar guardar en localStorage
    try {
      const ventasParaGuardar = ventas.map(venta => ({
        ...venta,
        fechaHora: venta.fechaHora instanceof Date ? venta.fechaHora.toISOString() : venta.fechaHora
      }));
      localStorage.setItem(VENTAS_STORAGE_KEY, JSON.stringify(ventasParaGuardar));
      console.log('Ventas guardadas solo en localStorage como respaldo');
    } catch (localError) {
      console.error('Error al guardar ventas en localStorage:', localError);
    }
  }
};

/**
 * Proveedor del contexto de ventas que maneja el estado global de ventas
 * y proporciona funciones para manipular este estado en toda la aplicación.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Componentes hijos que tendrán acceso al contexto
 * @returns {JSX.Element} Proveedor de contexto que envuelve la aplicación o componentes
 */
export const VentasProvider = ({ children }) => {
  /**
   * Estado principal que almacena todas las ventas de la aplicación
   * @type {Array} Array de objetos de venta con propiedades id, fechaHora, vendedor, monto, tipoPago
   */
  const [ventas, setVentas] = useState([]);
  
  /**
   * Estado que almacena las estadísticas calculadas a partir de las ventas
   * Se actualiza automáticamente cuando cambia el estado de ventas
   * @type {Object} Objeto con propiedades totalVentas, promedioVentas y ventasPorTipo
   */
  const [estadisticas, setEstadisticas] = useState({
    totalVentas: 0,        // Suma total de los montos de todas las ventas
    promedioVentas: 0,     // Promedio de los montos de todas las ventas
    ventasPorTipo: {       // Montos totales agrupados por tipo de pago
      efectivo: 0,         // Total de ventas en efectivo
      debito: 0,           // Total de ventas con tarjeta de débito
      credito: 0           // Total de ventas con tarjeta de crédito
    }
  });
  
  // Cargar ventas al iniciar - directamente desde el archivo JSON importado
  useEffect(() => {
    try {
      // Usar directamente los datos del archivo JSON importado
      const ventasConFechas = convertirFechasVentas(ventasIniciales);
      setVentas(ventasConFechas);
      console.log('Ventas cargadas directamente desde archivo JSON:', ventasConFechas.length);
      
      // Limpiar localStorage para asegurar que no se usen datos antiguos
      localStorage.removeItem(VENTAS_STORAGE_KEY);
    } catch (error) {
      console.error('Error al cargar ventas:', error);
      // En caso de error, intentar usar los datos iniciales directamente
      setVentas(ventasIniciales);
    }
  }, []);
  
  // Actualizar estadísticas y guardar ventas cuando cambien
  useEffect(() => {
    // Guardar ventas en localStorage
    if (Array.isArray(ventas)) {
      guardarVentas(ventas);
    }
    
    // Valores por defecto si no hay ventas
    if (!ventas || ventas.length === 0) {
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
      const total = ventas.reduce((sum, venta) => {
        const monto = typeof venta.monto === 'number' ? venta.monto : 0;
        return sum + monto;
      }, 0);
      
      // Calcular promedio por venta
      const promedio = ventas.length > 0 ? total / ventas.length : 0;
      
      // Calcular ventas por tipo de pago con validación
      const porTipo = {
        efectivo: ventas.filter(v => v.tipoPago === 'efectivo').reduce((sum, v) => sum + (typeof v.monto === 'number' ? v.monto : 0), 0),
        debito: ventas.filter(v => v.tipoPago === 'debito').reduce((sum, v) => sum + (typeof v.monto === 'number' ? v.monto : 0), 0),
        credito: ventas.filter(v => v.tipoPago === 'credito').reduce((sum, v) => sum + (typeof v.monto === 'number' ? v.monto : 0), 0)
      };
      
      // Actualizar el estado de estadísticas
      setEstadisticas({
        totalVentas: total,
        promedioVentas: promedio,
        ventasPorTipo: porTipo
      });
    } catch (error) {
      console.error('Error al calcular estadísticas:', error);
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
  }, [ventas]);
  
  /**
   * Agrega una nueva venta al sistema y actualiza el estado
   * Valida y normaliza los datos de entrada para asegurar consistencia
   * Guarda la venta en el archivo JSON a través de la API
   * 
   * @param {Object} nuevaVenta - Objeto con los datos de la nueva venta
   * @param {string} [nuevaVenta.id] - Identificador único (opcional, se genera automáticamente si no se proporciona)
   * @param {Date|string} [nuevaVenta.fechaHora] - Fecha y hora de la venta (se usa la fecha actual si no es válida)
   * @param {string} nuevaVenta.vendedor - Nombre del vendedor que realizó la venta
   * @param {number} nuevaVenta.monto - Monto de la venta en pesos
   * @param {string} nuevaVenta.tipoPago - Tipo de pago ('efectivo', 'debito' o 'credito')
   */
  const agregarVenta = useCallback(async (nuevaVenta) => {
    try {
      // Normalizar los datos de entrada para asegurar consistencia
      const ventaConFechaCorrecta = {
        ...nuevaVenta,
        // Validar que la fecha sea un objeto Date válido, o crear una nueva
        fechaHora: nuevaVenta.fechaHora instanceof Date ? 
          nuevaVenta.fechaHora : new Date(),
        // Generar un ID único si no se proporciona o asegurar que sea único
        id: nuevaVenta.id || `V${Math.floor(Math.random() * 10000)}`
      };
      
      // Convertir la fecha a string para enviarla a la API
      const ventaParaAPI = {
        ...ventaConFechaCorrecta,
        fechaHora: ventaConFechaCorrecta.fechaHora instanceof Date ? 
          ventaConFechaCorrecta.fechaHora.toISOString() : ventaConFechaCorrecta.fechaHora
      };
      
      // Guardar la venta en el archivo JSON a través de la API
      const respuesta = await agregarVentaAPI(ventaParaAPI);
      
      if (respuesta.success) {
        // Actualizar el estado local con la nueva venta
        setVentas(ventasActuales => {
          // Verificar si ya existe una venta con el mismo ID para evitar duplicados
          const existeID = ventasActuales.some(v => v.id === ventaConFechaCorrecta.id);
          if (existeID) {
            // Si el ID ya existe, generar uno nuevo para evitar conflictos
            ventaConFechaCorrecta.id = `V${Math.floor(Math.random() * 10000)}`;
          }
          // Retornar un nuevo array con todas las ventas actuales más la nueva
          return [...ventasActuales, ventaConFechaCorrecta];
        });
        
        console.log('Nueva venta agregada y guardada en el archivo JSON:', ventaConFechaCorrecta);
      } else {
        console.error('Error al guardar la venta en el archivo JSON');
      }
    } catch (error) {
      console.error('Error al agregar venta:', error);
    }
  }, []); // No hay dependencias ya que no usa variables externas
  
  /**
   * Actualiza los datos de una venta existente
   * Valida y normaliza los datos actualizados para mantener la consistencia
   * Guarda los cambios en el archivo JSON a través de la API
   * 
   * @param {string} id - Identificador único de la venta a actualizar
   * @param {Object} datosActualizados - Objeto con los nuevos datos de la venta
   * @param {Date|string} [datosActualizados.fechaHora] - Nueva fecha y hora (opcional)
   * @param {string} [datosActualizados.vendedor] - Nuevo vendedor (opcional)
   * @param {number} [datosActualizados.monto] - Nuevo monto (opcional)
   * @param {string} [datosActualizados.tipoPago] - Nuevo tipo de pago (opcional)
   */
  const actualizarVenta = useCallback(async (id, datosActualizados) => {
    try {
      // Asegurarse de que la fecha sea un objeto Date para el estado local
      const fechaHora = datosActualizados.fechaHora instanceof Date ?
        datosActualizados.fechaHora : new Date(datosActualizados.fechaHora);
      
      // Preparar los datos para la API (con fecha en formato string)
      const datosParaAPI = {
        ...datosActualizados,
        fechaHora: fechaHora instanceof Date ? fechaHora.toISOString() : fechaHora
      };
      
      // Actualizar la venta en el archivo JSON a través de la API
      const respuesta = await actualizarVentaAPI(id, datosParaAPI);
      
      if (respuesta.success) {
        // Actualizar el estado local
        setVentas(ventasActuales => {
          return ventasActuales.map(venta => {
            if (venta.id === id) {
              return { ...venta, ...datosActualizados, fechaHora };
            }
            return venta;
          });
        });
        
        console.log(`Venta ${id} actualizada y guardada en el archivo JSON:`, datosActualizados);
      } else {
        console.error(`Error al guardar la actualización de la venta ${id} en el archivo JSON`);
      }
    } catch (error) {
      console.error(`Error al actualizar venta ${id}:`, error);
    }
  }, []);
  
  /**
   * Elimina una venta del sistema
   * Elimina la venta del archivo JSON a través de la API
   * @param {string} id - ID de la venta a eliminar
   */
  const eliminarVenta = useCallback(async (id) => {
    try {
      // Eliminar la venta del archivo JSON a través de la API
      const respuesta = await eliminarVentaAPI(id);
      
      if (respuesta.success) {
        // Actualizar el estado local
        setVentas(ventasActuales => ventasActuales.filter(venta => venta.id !== id));
        console.log(`Venta ${id} eliminada y actualizada en el archivo JSON`);
      } else {
        console.error(`Error al eliminar la venta ${id} del archivo JSON`);
      }
    } catch (error) {
      console.error(`Error al eliminar venta ${id}:`, error);
    }
  }, []);
  
  /**
   * Objeto con todos los valores y funciones que se expondrán a través del contexto
   * Incluye el estado actual de ventas, estadísticas calculadas y funciones para manipular ventas
   */
  const value = {
    ventas,                // Array con todas las ventas
    estadisticas,          // Objeto con estadísticas calculadas
    agregarVenta,          // Función para agregar una nueva venta
    eliminarVenta,         // Función para eliminar una venta existente
    actualizarVenta        // Función para actualizar una venta existente
  };
  
  // Retornar el proveedor de contexto con el valor configurado
  return (
    <VentasContext.Provider value={value}>
      {children}
    </VentasContext.Provider>
  );
};

export default VentasContext;
