/**
 * @fileoverview Contexto para la gestión de productos en la aplicación
 * Proporciona funcionalidades para agregar, editar, eliminar productos,
 * así como calcular precios de venta basados en costos y márgenes.
 * Implementa un sistema de polling para actualizar los datos sin recompilar la aplicación.
 */
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

// Importar datos de productos desde el archivo JSON para la carga inicial
import productosData from '../data/productos.json';

// Importar servicios API
import { 
  agregarProducto as agregarProductoAPI,
  actualizarProducto as actualizarProductoAPI,
  eliminarProducto as eliminarProductoAPI 
} from '../services/api';

// Importar el sistema de polling para actualización de datos sin recompilar
import { dataPoller } from '../services/dataPoller';

// Contexto para la gestión de productos

// Crear el contexto de productos
const ProductosContext = createContext();

/**
 * Hook personalizado para acceder al contexto de productos
 * @returns {Object} Contexto de productos
 */
export const useProductos = () => {
  const context = useContext(ProductosContext);
  if (!context) {
    throw new Error('useProductos debe ser usado dentro de un ProductosProvider');
  }
  return context;
};

/**
 * Proveedor del contexto de productos
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Componentes hijos
 * @returns {JSX.Element} Proveedor de contexto
 */
export const ProductosProvider = ({ children }) => {
  // Estado para los productos
  const [productos, setProductos] = useState([]);
  
  // Cargar productos al iniciar y configurar el polling
  useEffect(() => {
    // Cargar datos iniciales desde el archivo JSON
    setProductos(productosData);
    // Productos cargados inicialmente
    
    // Configurar el polling para actualizar los datos sin recompilar
    const handleProductosUpdate = (nuevosProductos) => {
      setProductos(nuevosProductos);
      // Datos actualizados silenciosamente
    };
    
    // Iniciar el polling cada 5 segundos
    dataPoller.startPolling('productos', handleProductosUpdate, 5000);
    
    // Detener el polling cuando el componente se desmonte
    return () => {
      dataPoller.stopPolling('productos');
    };
  }, []);

  /**
   * Agrega un nuevo producto al sistema y lo guarda en el archivo JSON a través de la API
   * Implementa un patrón optimista para evitar recargas completas de la página
   * @param {Object} nuevoProducto - Datos del nuevo producto
   */
  const agregarProducto = useCallback(async (nuevoProducto) => {
    try {
      // Normalizar los datos del producto
      const productoNormalizado = {
        ...nuevoProducto,
        // Generar un ID único
        id: `P${Math.floor(Math.random() * 10000)}`,
        // Asegurar que los valores numéricos sean números
        precioCompra: Number(nuevoProducto.precioCompra),
        margenGanancia: Number(nuevoProducto.margenGanancia),
        precioVenta: Number(nuevoProducto.precioVenta)
      };
      
      // Actualizar el estado local primero para evitar recargas
      setProductos(productosActuales => [...productosActuales, productoNormalizado]);
      
      // Guardar el nuevo producto en el archivo JSON a través de la API de forma asíncrona
      const promesaGuardado = agregarProductoAPI(productoNormalizado);
      
      // Manejar la respuesta de forma asíncrona
      promesaGuardado.then(respuesta => {
        if (!respuesta.success) {
          console.error('Error al guardar el producto en el servidor');
          // Si falla, revertir el cambio local
          setProductos(productosActuales => {
            return productosActuales.filter(p => p.id !== productoNormalizado.id);
          });
        }
      }).catch(error => {
        console.error('Error en la solicitud:', error);
        // Si hay un error, revertir el cambio local
        setProductos(productosActuales => {
          return productosActuales.filter(p => p.id !== productoNormalizado.id);
        });
      });
      
      // Devolver el producto normalizado inmediatamente
      return productoNormalizado;
    } catch (error) {
      console.error('Error al procesar el producto:', error);
      return null;
    }
  }, []);

  /**
   * Elimina un producto del sistema basado en su ID
   * Implementa un patrón optimista para evitar recargas completas de la página
   * @param {string} id - Identificador único del producto a eliminar
   */
  const eliminarProducto = useCallback(async (id) => {
    try {
      // Encontrar el producto a eliminar para posible restauración
      const productoAEliminar = productos.find(p => p.id === id);
      
      if (!productoAEliminar) {
        console.error(`No se encontró el producto con ID ${id} para eliminar`);
        return false;
      }
      
      // Actualizar el estado local primero para evitar recargas
      setProductos(productosActuales => productosActuales.filter(producto => producto.id !== id));
      
      // Eliminar el producto a través de la API de forma asíncrona
      const promesaEliminacion = eliminarProductoAPI(id);
      
      // Manejar la respuesta de forma asíncrona
      promesaEliminacion.then(respuesta => {
        if (!respuesta.success) {
          console.error('Error al eliminar el producto en el servidor');
          // Si falla, restaurar el producto eliminado
          setProductos(productosActuales => {
            const productosRestaurados = [...productosActuales, productoAEliminar];
            // Ordenar por ID para mantener el orden original
            productosRestaurados.sort((a, b) => a.id.localeCompare(b.id));
            return productosRestaurados;
          });
        }
      }).catch(error => {
        console.error('Error en la solicitud de eliminación:', error);
        // Si hay un error, restaurar el producto eliminado
        setProductos(productosActuales => {
          const productosRestaurados = [...productosActuales, productoAEliminar];
          // Ordenar por ID para mantener el orden original
          productosRestaurados.sort((a, b) => a.id.localeCompare(b.id));
          return productosRestaurados;
        });
      });
      
      // Devolver true inmediatamente para mejorar la experiencia del usuario
      return true;
    } catch (error) {
      console.error('Error al procesar la eliminación del producto:', error);
      return false;
    }
  }, [productos]);

  /**
   * Actualiza los datos de un producto existente y los guarda en el archivo JSON a través de la API
   * Implementa un patrón optimista para evitar recargas completas de la página
   * @param {string} id - Identificador único del producto a actualizar
   * @param {Object} datosActualizados - Objeto con los nuevos datos del producto
   */
  const actualizarProducto = useCallback(async (id, datosActualizados) => {
    try {
      // Buscar el producto actual para combinar con los datos actualizados
      const productoActual = productos.find(p => p.id === id);
      
      if (!productoActual) {
        console.error(`No se encontró el producto con ID ${id} para actualizar`);
        return null;
      }
      
      // Guardar el producto original para posible reversión
      const productoOriginal = { ...productoActual };
      
      // Normalizar los datos actualizados
      const productoActualizado = {
        ...productoActual,
        ...datosActualizados,
        // Asegurar que los valores numéricos sean números
        precioCompra: datosActualizados.precioCompra !== undefined ? 
          Number(datosActualizados.precioCompra) : productoActual.precioCompra,
        margenGanancia: datosActualizados.margenGanancia !== undefined ? 
          Number(datosActualizados.margenGanancia) : productoActual.margenGanancia,
        precioVenta: datosActualizados.precioVenta !== undefined ? 
          Number(datosActualizados.precioVenta) : productoActual.precioVenta
      };
      
      // Actualizar el estado local primero para evitar recargas
      setProductos(productosActuales => {
        return productosActuales.map(producto => {
          if (producto.id === id) {
            return productoActualizado;
          }
          return producto;
        });
      });
      
      // Actualizar el producto en el archivo JSON a través de la API de forma asíncrona
      const promesaActualizacion = actualizarProductoAPI(id, productoActualizado);
      
      // Manejar la respuesta de forma asíncrona
      promesaActualizacion.then(respuesta => {
        if (!respuesta.success) {
          console.error('Error al actualizar el producto en el servidor');
          // Si falla, revertir el cambio local
          setProductos(productosActuales => {
            return productosActuales.map(producto => {
              if (producto.id === id) {
                return productoOriginal;
              }
              return producto;
            });
          });
        }
      }).catch(error => {
        console.error('Error en la solicitud de actualización:', error);
        // Si hay un error, revertir el cambio local
        setProductos(productosActuales => {
          return productosActuales.map(producto => {
            if (producto.id === id) {
              return productoOriginal;
            }
            return producto;
          });
        });
      });
      
      // Devolver el producto actualizado inmediatamente
      return productoActualizado;
    } catch (error) {
      console.error('Error al procesar la actualización del producto:', error);
      return null;
    }
  }, [productos]);

  /**
   * Calcula el precio de venta basado en el precio de compra y el margen de ganancia
   * 
   * @param {number} precioCompra - Precio de compra del producto
   * @param {number} margenGanancia - Margen de ganancia en porcentaje
   * @returns {number} Precio de venta calculado
   */
  const calcularPrecioVenta = useCallback((precioCompra, margenGanancia) => {
    const precioCompraNum = Number(precioCompra);
    const margenGananciaNum = Number(margenGanancia);
    
    if (isNaN(precioCompraNum) || isNaN(margenGananciaNum)) {
      return 0;
    }
    
    return precioCompraNum * (1 + margenGananciaNum / 100);
  }, []);

  // Valor del contexto
  const value = {
    productos,
    agregarProducto,
    actualizarProducto,
    eliminarProducto,
    calcularPrecioVenta
  };

  return (
    <ProductosContext.Provider value={value}>
      {children}
    </ProductosContext.Provider>
  );
};

export default ProductosContext;
