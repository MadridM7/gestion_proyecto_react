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
    console.log('Productos cargados desde el archivo JSON:', productosData.length);
    
    // Configurar el polling para actualizar los datos sin recompilar
    const handleProductosUpdate = (nuevosProductos) => {
      setProductos(nuevosProductos);
      console.log('Datos de productos actualizados mediante polling');
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
   * 
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
      
      // Guardar el nuevo producto en el archivo JSON a través de la API
      const respuesta = await agregarProductoAPI(productoNormalizado);
      
      if (respuesta.success) {
        // Actualizar el estado local
        setProductos(productosActuales => [...productosActuales, productoNormalizado]);
        console.log('Producto agregado y guardado en el archivo JSON:', productoNormalizado);
        return productoNormalizado;
      } else {
        console.error('Error al guardar el producto en el archivo JSON');
        return null;
      }
    } catch (error) {
      console.error('Error al agregar producto:', error);
      return null;
    }
  }, []);

  /**
   * Elimina un producto del sistema basado en su ID
   * @param {string} id - Identificador único del producto a eliminar
   */
  const eliminarProducto = useCallback(async (id) => {
    try {
      // Eliminar el producto a través de la API
      const respuesta = await eliminarProductoAPI(id);
      
      if (respuesta.success) {
        // Actualizar el estado local
        setProductos(productosActuales => productosActuales.filter(producto => producto.id !== id));
        console.log(`Producto con ID ${id} eliminado`);
      } else {
        console.error('Error al eliminar el producto');
      }
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  }, []);

  /**
   * Actualiza los datos de un producto existente y los guarda en el archivo JSON a través de la API
   * 
   * @param {string} id - Identificador único del producto a actualizar
   * @param {Object} datosActualizados - Objeto con los nuevos datos del producto
   */
  const actualizarProducto = useCallback(async (id, datosActualizados) => {
    try {
      // Buscar el producto actual para combinar con los datos actualizados
      const productoActual = productos.find(p => p.id === id);
      
      if (!productoActual) {
        console.error(`No se encontró el producto con ID ${id}`);
        return null;
      }
      
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
      
      // Actualizar el producto en el archivo JSON a través de la API
      const respuesta = await actualizarProductoAPI(id, productoActualizado);
      
      if (respuesta.success) {
        // Actualizar el estado local
        setProductos(productosActuales => {
          return productosActuales.map(producto => {
            if (producto.id === id) {
              return productoActualizado;
            }
            return producto;
          });
        });
        
        console.log(`Producto ${id} actualizado y guardado en el archivo JSON:`, productoActualizado);
        return productoActualizado;
      } else {
        console.error(`Error al guardar la actualización del producto ${id} en el archivo JSON`);
        return null;
      }
    } catch (error) {
      console.error(`Error al actualizar producto ${id}:`, error);
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
