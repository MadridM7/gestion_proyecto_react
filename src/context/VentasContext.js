/**
 * @fileoverview Contexto para la gestión de ventas en la aplicación
 * Proporciona funcionalidades para agregar, editar, eliminar y filtrar ventas,
 * así como calcular estadísticas relacionadas con las ventas.
 */
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

// Importar datos de ventas desde el archivo JSON
import ventasData from '../data/ventas.json';

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

// Clave para guardar las ventas en localStorage (comentada ya que no se usa en esta versión de demostración)
// const VENTAS_STORAGE_KEY = 'dashboard-ventas';

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
 * Función para cargar las ventas desde localStorage
 * @returns {Array} Array de ventas
 */
const cargarVentasGuardadas = () => {
  try {
    // Siempre usar los datos iniciales para este proyecto de demostración
    // Esto asegura que siempre tengamos datos de ejemplo para mostrar
    return ventasIniciales;
    
    // El código comentado a continuación sería para una aplicación real
    // que carga datos desde localStorage
    /*
    const ventasGuardadas = localStorage.getItem(VENTAS_STORAGE_KEY);
    if (!ventasGuardadas) {
      console.log('No hay ventas guardadas, usando datos iniciales');
      return ventasIniciales;
    }
    
    // Convertir fechas de string a objeto Date
    const ventasParsed = JSON.parse(ventasGuardadas);
    
    // Verificar que ventasParsed sea un array
    if (!Array.isArray(ventasParsed)) {
      console.error('Error: datos guardados no son un array válido');
      return ventasIniciales;
    }
    
    // Mapear y convertir fechas con manejo de errores
    return ventasParsed.map(venta => {
      try {
        return {
          ...venta,
          // Asegurarse de que la fecha sea válida
          fechaHora: venta.fechaHora ? new Date(venta.fechaHora) : new Date(),
          // Asegurarse de que el monto sea un número
          monto: typeof venta.monto === 'number' ? venta.monto : 0
        };
      } catch (e) {
        console.error('Error al procesar venta:', e);
        // Retornar una venta con valores por defecto
        return {
          id: venta.id || `V${Math.floor(Math.random() * 10000)}`,
          fechaHora: new Date(),
          vendedor: venta.vendedor || 'Desconocido',
          monto: 0,
          tipoPago: venta.tipoPago || 'efectivo'
        };
      }
    });
    */
  } catch (error) {
    console.error('Error al cargar ventas:', error);
    return ventasIniciales;
  }
};

/**
 * Función para guardar las ventas en localStorage
 * @param {Array} ventas - Array de ventas a guardar
 */
const guardarVentas = (ventas) => {
  try {
    // Para este proyecto de demostración, no guardamos en localStorage
    // para asegurar que siempre se usen los datos de ejemplo
    console.log('Datos de ejemplo en uso, no se guardan cambios en localStorage');
    return;
    
    // El código comentado a continuación sería para una aplicación real
    /*
    // Verificar que ventas sea un array válido
    if (!Array.isArray(ventas)) {
      console.error('Error: ventas no es un array válido');
      return;
    }
    
    // Convertir fechas a string antes de guardar
    const ventasParaGuardar = ventas.map((venta) => {
      // Verificar que venta.fechaHora sea un objeto Date válido
      const fechaHora = venta.fechaHora instanceof Date ? 
        venta.fechaHora.toISOString() : 
        (typeof venta.fechaHora === 'string' ? venta.fechaHora : new Date().toISOString());
      
      return {
        ...venta,
        fechaHora
      };
    });
    
    localStorage.setItem(VENTAS_STORAGE_KEY, JSON.stringify(ventasParaGuardar));
    */
  } catch (error) {
    console.error('Error al guardar ventas en localStorage:', error);
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
  
  // Cargar ventas al iniciar
  useEffect(() => {
    const ventasGuardadas = cargarVentasGuardadas();
    if (Array.isArray(ventasGuardadas)) {
      setVentas(ventasGuardadas);
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
   * 
   * @param {Object} nuevaVenta - Objeto con los datos de la nueva venta
   * @param {string} [nuevaVenta.id] - Identificador único (opcional, se genera automáticamente si no se proporciona)
   * @param {Date|string} [nuevaVenta.fechaHora] - Fecha y hora de la venta (se usa la fecha actual si no es válida)
   * @param {string} nuevaVenta.vendedor - Nombre del vendedor que realizó la venta
   * @param {number} nuevaVenta.monto - Monto de la venta en pesos
   * @param {string} nuevaVenta.tipoPago - Tipo de pago ('efectivo', 'debito' o 'credito')
   */
  const agregarVenta = useCallback((nuevaVenta) => {
    // Normalizar los datos de entrada para asegurar consistencia
    const ventaConFechaCorrecta = {
      ...nuevaVenta,
      // Validar que la fecha sea un objeto Date válido, o crear una nueva
      fechaHora: nuevaVenta.fechaHora instanceof Date ? 
        nuevaVenta.fechaHora : new Date(),
      // Generar un ID único si no se proporciona o asegurar que sea único
      id: nuevaVenta.id || `V${Math.floor(Math.random() * 10000)}`
    };
    
    // Actualizar el estado de ventas de forma segura usando el callback de setState
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
    
    // Registro para depuración y seguimiento
    console.log('Nueva venta agregada:', ventaConFechaCorrecta);
  }, []); // No hay dependencias ya que no usa variables externas
  
  /**
   * Elimina una venta del sistema basado en su ID
   * 
   * @param {string} id - Identificador único de la venta a eliminar
   */
  const eliminarVenta = useCallback((id) => {
    setVentas(ventasActuales => {
      // Crear un nuevo array excluyendo la venta con el ID especificado
      const ventasActualizadas = ventasActuales.filter(venta => venta.id !== id);
      // Registro para depuración y seguimiento
      console.log(`Venta con ID ${id} eliminada`);
      return ventasActualizadas;
    });
  }, []); // No hay dependencias ya que no usa variables externas
  
  /**
   * Actualiza los datos de una venta existente
   * Valida y normaliza los datos actualizados para mantener la consistencia
   * 
   * @param {string} id - Identificador único de la venta a actualizar
   * @param {Object} datosActualizados - Objeto con los nuevos datos de la venta
   * @param {Date|string} [datosActualizados.fechaHora] - Nueva fecha y hora (opcional)
   * @param {string} [datosActualizados.vendedor] - Nuevo vendedor (opcional)
   * @param {number} [datosActualizados.monto] - Nuevo monto (opcional)
   * @param {string} [datosActualizados.tipoPago] - Nuevo tipo de pago (opcional)
   */
  const actualizarVenta = useCallback((id, datosActualizados) => {
    setVentas(ventasActuales => {
      // Mapear todas las ventas, actualizando solo la que coincide con el ID
      const ventasActualizadas = ventasActuales.map(venta => {
        if (venta.id === id) {
          // Crear un nuevo objeto combinando los datos originales con los actualizados
          const ventaActualizada = {
            ...venta,
            ...datosActualizados,
            // Validar que la fecha sea un objeto Date válido
            // Si la nueva fecha no es válida, mantener la fecha original o usar la fecha actual
            fechaHora: datosActualizados.fechaHora instanceof Date ? 
              datosActualizados.fechaHora : 
              (venta.fechaHora instanceof Date ? venta.fechaHora : new Date())
          };
          // Registro para depuración y seguimiento
          console.log(`Venta con ID ${id} actualizada:`, ventaActualizada);
          return ventaActualizada;
        }
        // Mantener sin cambios las ventas que no coinciden con el ID
        return venta;
      });
      return ventasActualizadas;
    });
  }, []); // No hay dependencias ya que no usa variables externas
  
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
