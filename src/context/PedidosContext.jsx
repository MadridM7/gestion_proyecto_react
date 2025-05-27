/**
 * @fileoverview Contexto para la gestión de pedidos en la aplicación
 * Proporciona funcionalidades para agregar, editar, eliminar pedidos.
 * Implementa un sistema de polling para actualizar los datos sin recompilar la aplicación.
 */
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

// Importar datos de pedidos desde el archivo JSON para la carga inicial
import pedidosData from '../data/pedidos.json';

// Importar servicios API
import { API_URL } from '../config';

// Importar el sistema de polling para actualización de datos sin recompilar
import { dataPoller } from '../services/dataPoller';

// Crear el contexto de pedidos
const PedidosContext = createContext();

/**
 * Hook personalizado para acceder al contexto de pedidos
 * @returns {Object} Contexto de pedidos
 */
export const usePedidos = () => {
  const context = useContext(PedidosContext);
  if (!context) {
    throw new Error('usePedidos debe ser usado dentro de un PedidosProvider');
  }
  return context;
};

/**
 * Proveedor del contexto de pedidos
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Componentes hijos
 * @returns {JSX.Element} Proveedor de contexto
 */
export const PedidosProvider = ({ children }) => {
  // Estado para los pedidos
  const [pedidos, setPedidos] = useState([]);
  
  // Estado para las estadísticas de pedidos
  const [estadisticas, setEstadisticas] = useState({
    totalPedidos: 0,
    pedidosPagados: 0,
    pedidosPorPagar: 0,
    montoTotal: 0,
    montoPagado: 0,
    montoPorPagar: 0
  });
  
  /**
   * Calcula las estadísticas basadas en los pedidos actuales
   * @param {Array} pedidosActuales - Lista de pedidos para calcular estadísticas
   */
  const calcularEstadisticas = useCallback((pedidosActuales) => {
    if (!Array.isArray(pedidosActuales) || pedidosActuales.length === 0) {
      setEstadisticas({
        totalPedidos: 0,
        pedidosPagados: 0,
        pedidosPorPagar: 0,
        montoTotal: 0,
        montoPagado: 0,
        montoPorPagar: 0
      });
      return;
    }
    
    // Calcular total de pedidos
    const totalPedidos = pedidosActuales.length;
    
    // Calcular pedidos pagados y por pagar
    const pedidosPagados = pedidosActuales.filter(p => p.estado === 'pagado').length;
    const pedidosPorPagar = pedidosActuales.filter(p => p.estado === 'por pagar').length;
    
    // Calcular montos
    const montoTotal = pedidosActuales.reduce((total, pedido) => total + pedido.monto, 0);
    const montoPagado = pedidosActuales
      .filter(p => p.estado === 'pagado')
      .reduce((total, pedido) => total + pedido.monto, 0);
    const montoPorPagar = pedidosActuales
      .filter(p => p.estado === 'por pagar')
      .reduce((total, pedido) => total + pedido.monto, 0);
    
    // Actualizar el estado de estadísticas
    setEstadisticas({
      totalPedidos,
      pedidosPagados,
      pedidosPorPagar,
      montoTotal,
      montoPagado,
      montoPorPagar
    });
  }, []);

  // Cargar pedidos al iniciar y configurar el polling
  useEffect(() => {
    // Cargar datos iniciales desde el archivo JSON
    setPedidos(pedidosData);
    
    // Calcular estadísticas iniciales
    calcularEstadisticas(pedidosData);
    
    // Configurar el polling para actualizar los datos sin recompilar
    const handlePedidosUpdate = (nuevosPedidos) => {
      setPedidos(nuevosPedidos);
      calcularEstadisticas(nuevosPedidos);
    };
    
    // Iniciar el polling cada 5 segundos
    dataPoller.startPolling('pedidos', handlePedidosUpdate, 5000);
    
    // Detener el polling cuando el componente se desmonte
    return () => {
      dataPoller.stopPolling('pedidos');
    };
  }, [calcularEstadisticas]);

  /**
   * Agrega un nuevo pedido al sistema y lo guarda en el archivo JSON a través de la API
   * 
   * @param {Object} nuevoPedido - Datos del nuevo pedido
   */
  const agregarPedido = useCallback(async (nuevoPedido) => {
    try {
      // Normalizar los datos del pedido
      const pedidoNormalizado = {
        ...nuevoPedido,
        // Generar un ID único
        id: `P${Math.floor(Math.random() * 10000)}`
      };
      
      // Guardar el nuevo pedido en el archivo JSON a través de la API
      const response = await fetch(`${API_URL}/pedidos/agregar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pedidoNormalizado),
      });
      
      if (!response.ok) {
        throw new Error('Error al agregar el pedido');
      }
      
      const respuesta = await response.json();
      
      if (respuesta.success) {
        // Actualizar el estado local
        setPedidos(pedidosActuales => {
          const nuevosPedidos = [...pedidosActuales, pedidoNormalizado];
          // Actualizar estadísticas con los nuevos datos
          calcularEstadisticas(nuevosPedidos);
          return nuevosPedidos;
        });
        // Pedido agregado exitosamente
        return pedidoNormalizado;
      } else {
        // Error al guardar el pedido
        return null;
      }
    } catch (error) {
      console.error('Error al agregar pedido:', error);
      return null;
    }
  }, [calcularEstadisticas]);

  /**
   * Elimina un pedido del sistema basado en su ID
   * @param {string} id - Identificador único del pedido a eliminar
   */
  const eliminarPedido = useCallback(async (id) => {
    try {
      // Eliminar el pedido a través de la API
      const response = await fetch(`${API_URL}/pedidos/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al eliminar el pedido');
      }
      
      const respuesta = await response.json();
      
      if (respuesta.success) {
        // Actualizar el estado local
        setPedidos(pedidosActuales => {
          const pedidosActualizados = pedidosActuales.filter(pedido => pedido.id !== id);
          // Actualizar estadísticas con los datos actualizados
          calcularEstadisticas(pedidosActualizados);
          return pedidosActualizados;
        });
        // Pedido eliminado exitosamente
        return true;
      } else {
        // Error al eliminar el pedido
        return false;
      }
    } catch (error) {
      console.error('Error al eliminar pedido:', error);
      return false;
    }
  }, [calcularEstadisticas]);

  /**
   * Actualiza los datos de un pedido existente y los guarda en el archivo JSON a través de la API
   * 
   * @param {string} id - Identificador único del pedido a actualizar
   * @param {Object} datosActualizados - Objeto con los nuevos datos del pedido
   */
  const actualizarPedido = useCallback(async (id, datosActualizados) => {
    try {
      // Buscar el pedido actual para combinar con los datos actualizados
      const pedidoActual = pedidos.find(p => p.id === id);
      
      if (!pedidoActual) {
        // Pedido no encontrado
        return null;
      }
      
      // Normalizar los datos actualizados
      const pedidoActualizado = {
        ...pedidoActual,
        ...datosActualizados
      };
      
      // Actualizar el pedido en el archivo JSON a través de la API
      const response = await fetch(`${API_URL}/pedidos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pedidoActualizado),
      });
      
      if (!response.ok) {
        throw new Error('Error al actualizar el pedido');
      }
      
      const respuesta = await response.json();
      
      if (respuesta.success) {
        // Actualizar el estado local
        setPedidos(pedidosActuales => {
          const pedidosActualizados = pedidosActuales.map(pedido => {
            if (pedido.id === id) {
              return pedidoActualizado;
            }
            return pedido;
          });
          
          // Actualizar estadísticas con los datos actualizados
          calcularEstadisticas(pedidosActualizados);
          
          return pedidosActualizados;
        });
        
        // Pedido actualizado exitosamente
        return pedidoActualizado;
      } else {
        // Error al guardar la actualización
        return null;
      }
    } catch (error) {
      console.error('Error al actualizar pedido:', error);
      return null;
    }
  }, [pedidos, calcularEstadisticas]);

  // Valor del contexto
  const value = {
    pedidos,
    estadisticas,
    agregarPedido,
    actualizarPedido,
    eliminarPedido
  };

  return (
    <PedidosContext.Provider value={value}>
      {children}
    </PedidosContext.Provider>
  );
};

export default PedidosContext;
