/**
 * Servicio para interactuar con la API del servidor
 * Proporciona funciones para obtener y guardar datos en los archivos JSON
 * Implementa un sistema de caché para mejorar el rendimiento
 */

// Importar la configuración centralizada
import { API_URL } from '../config';
import { CACHE_CONFIG } from '../config/performance';
import { cacheService } from './cacheService';

// Importamos los datos directamente para simular la API
import usuariosData from '../data/usuarios.json';

// URL de la API configurada en config.js

/**
 * Realiza una solicitud a la API con soporte de caché
 * @param {string} url - URL de la solicitud
 * @param {Object} options - Opciones de fetch
 * @param {boolean} useCache - Indica si se debe usar caché
 * @param {string} cacheKey - Clave personalizada para el caché
 * @returns {Promise<any>} Respuesta de la API
 */
async function fetchWithCache(url, options = {}, useCache = true, cacheKey = null) {
  // Determinar si el caché está habilitado para este tipo de datos
  const endpoint = url.split('/')[1]; // Extraer el tipo de datos (ventas, productos, etc.)
  const isCacheEnabled = useCache && CACHE_CONFIG.ENABLED[endpoint];
  
  // Generar clave de caché
  const key = cacheKey || cacheService.generateKey(url, options);
  
  // Si el caché está habilitado y es una solicitud GET, intentar obtener del caché
  if (isCacheEnabled && (!options.method || options.method === 'GET')) {
    const cachedData = cacheService.get(key);
    if (cachedData) {
      // Devolver inmediatamente los datos en caché pero programar una actualización en segundo plano
      // para mantener los datos frescos sin bloquear la UI
      setTimeout(() => {
        refreshCachedData(url, options, key, endpoint);
      }, 0);
      return cachedData;
    }
  }
  
  // Si no hay datos en caché o el caché está deshabilitado, hacer la solicitud
  try {
    // Prevenir recargas completas de la página usando fetch con keepalive
    const fetchOptions = {
      ...options,
      keepalive: true, // Mantener la conexión viva incluso si la página cambia
      headers: {
        ...options.headers,
        'X-Requested-With': 'XMLHttpRequest', // Indicar que es una solicitud AJAX
        'Cache-Control': 'no-cache, no-store, must-revalidate', // Prevenir caché del navegador
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    };
    
    const response = await fetch(`${API_URL}${url}`, fetchOptions);
    
    if (!response.ok) {
      throw new Error(`Error en la solicitud a ${url}`);
    }
    
    const data = await response.json();
    
    // Guardar en caché si es una solicitud GET y el caché está habilitado
    if (isCacheEnabled && (!options.method || options.method === 'GET')) {
      cacheService.set(key, data);
    } else if (options.method && options.method !== 'GET') {
      // Si es una solicitud de modificación, invalidar el caché relacionado
      // pero no eliminar completamente, solo marcar como expirado
      cacheService.invalidate(`/${endpoint}`, true); // Invalidar todas las entradas relacionadas
      
      // Actualizar los datos en caché sin recargar la página
      const normalizedUrl = `/${endpoint}`;
      setTimeout(() => {
        refreshCachedData(normalizedUrl, { method: 'GET' }, cacheService.generateKey(normalizedUrl, {}), endpoint);
      }, 100); // Pequeño retraso para dar tiempo a que se complete la operación en el servidor
    }
    
    return data;
  } catch (error) {
    console.error(`Error en fetchWithCache: ${error.message}`);
    throw error;
  }
}

/**
 * Actualiza los datos en caché en segundo plano sin bloquear la UI
 * @param {string} url - URL de la solicitud
 * @param {Object} options - Opciones de fetch
 * @param {string} cacheKey - Clave de caché
 * @param {string} endpoint - Tipo de datos (ventas, productos, etc.)
 */
async function refreshCachedData(url, options, cacheKey, endpoint) {
  try {
    const fetchOptions = {
      ...options,
      keepalive: true,
      headers: {
        ...options.headers,
        'X-Requested-With': 'XMLHttpRequest',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    };
    
    const response = await fetch(`${API_URL}${url}`, fetchOptions);
    
    if (!response.ok) return;
    
    const data = await response.json();
    
    // Actualizar el caché sin notificar a los componentes
    cacheService.set(cacheKey, data);
    
    // Notificar al dataPoller que hay datos nuevos disponibles
    // usando un evento personalizado para evitar recargas
    const event = new CustomEvent('dataPoller:update', { 
      detail: { type: endpoint, data } 
    });
    window.dispatchEvent(event);
  } catch (error) {
    // Ignorar errores en actualización en segundo plano
    console.warn(`Error en actualización en segundo plano: ${error.message}`);
  }
}

/**
 * Obtiene las ventas desde el servidor
 * @returns {Promise<Array>} Array de ventas
 */
export const obtenerVentas = async () => {
  try {
    return await fetchWithCache('/ventas');
  } catch (error) {
    console.error('Error al obtener las ventas:', error);
    throw error;
  }
};

/**
 * Guarda las ventas en el servidor
 * @param {Array} ventas - Array de ventas a guardar
 * @returns {Promise<Object>} Respuesta del servidor
 */
export const guardarVentas = async (ventas) => {
  try {
    return await fetchWithCache('/ventas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ventas),
    }, false); // No usar caché para operaciones de escritura
  } catch (error) {
    console.error('Error al guardar las ventas:', error);
    throw error;
  }
};

/**
 * Agrega una nueva venta al servidor
 * @param {Object} venta - Datos de la nueva venta
 * @returns {Promise<Object>} Respuesta del servidor
 */
export const agregarVenta = async (venta) => {
  try {
    return await fetchWithCache('/ventas/agregar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(venta),
    }, false); // No usar caché para operaciones de escritura
  } catch (error) {
    console.error('Error al agregar la venta:', error);
    throw error;
  }
};

/**
 * Actualiza una venta existente en el servidor
 * @param {string} id - ID de la venta a actualizar
 * @param {Object} venta - Datos actualizados de la venta
 * @returns {Promise<Object>} Respuesta del servidor
 */
export const actualizarVenta = async (id, venta) => {
  try {
    return await fetchWithCache(`/ventas/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(venta),
    }, false); // No usar caché para operaciones de escritura
  } catch (error) {
    console.error('Error al actualizar la venta:', error);
    throw error;
  }
};

/**
 * Elimina una venta del servidor
 * @param {string} id - ID de la venta a eliminar
 * @returns {Promise<Object>} Respuesta del servidor
 */
export const eliminarVenta = async (id) => {
  try {
    const response = await fetch(`${API_URL}/ventas/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Error al eliminar la venta');
    }
    
    return await response.json();
  } catch (error) {
    // Capturar error silenciosamente
    throw error;
  }
};

/**
 * Obtiene los productos desde el servidor
 * @returns {Promise<Array>} Array de productos
 */
export const obtenerProductos = async () => {
  try {
    const response = await fetch(`${API_URL}/productos`);
    if (!response.ok) {
      throw new Error('Error al obtener los productos');
    }
    return await response.json();
  } catch (error) {
    // Capturar error silenciosamente
    throw error;
  }
};

/**
 * Guarda los productos en el servidor
 * @param {Array} productos - Array de productos a guardar
 * @returns {Promise<Object>} Respuesta del servidor
 */
export const guardarProductos = async (productos) => {
  try {
    const response = await fetch(`${API_URL}/productos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productos),
    });
    
    if (!response.ok) {
      throw new Error('Error al guardar los productos');
    }
    
    return await response.json();
  } catch (error) {
    // Capturar error silenciosamente
    throw error;
  }
};

/**
 * Agrega un nuevo producto al servidor
 * @param {Object} producto - Datos del nuevo producto
 * @returns {Promise<Object>} Respuesta del servidor
 */
export const agregarProducto = async (producto) => {
  try {
    const response = await fetch(`${API_URL}/productos/agregar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(producto),
    });
    
    if (!response.ok) {
      throw new Error('Error al agregar el producto');
    }
    
    return await response.json();
  } catch (error) {
    // Capturar error silenciosamente
    throw error;
  }
};

/**
 * Actualiza un producto existente en el servidor
 * @param {string} id - ID del producto a actualizar
 * @param {Object} producto - Datos actualizados del producto
 * @returns {Promise<Object>} Respuesta del servidor
 */
export const actualizarProducto = async (id, producto) => {
  try {
    const response = await fetch(`${API_URL}/productos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(producto),
    });
    
    if (!response.ok) {
      throw new Error('Error al actualizar el producto');
    }
    
    return await response.json();
  } catch (error) {
    // Capturar error silenciosamente
    throw error;
  }
};

/**
 * Elimina un producto del servidor
 * @param {string} id - ID del producto a eliminar
 * @returns {Promise<Object>} Respuesta del servidor
 */
export const eliminarProducto = async (id) => {
  try {
    const response = await fetch(`${API_URL}/productos/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Error al eliminar el producto');
    }
    
    return await response.json();
  } catch (error) {
    // Capturar error silenciosamente
    throw error;
  }
};

/**
 * Obtiene los usuarios desde el servidor
 * @returns {Promise<Array>} Array de usuarios
 */
export const obtenerUsuarios = async () => {
  try {
    const response = await fetch(`${API_URL}/usuarios`);
    if (!response.ok) {
      throw new Error('Error al obtener los usuarios');
    }
    return await response.json();
  } catch (error) {
    // Capturar error silenciosamente
    throw error;
  }
};

/**
 * Guarda los usuarios en el servidor
 * @param {Array} usuarios - Array de usuarios a guardar
 * @returns {Promise<Object>} Respuesta del servidor
 */
export const guardarUsuarios = async (usuarios) => {
  try {
    const response = await fetch(`${API_URL}/usuarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(usuarios),
    });
    
    if (!response.ok) {
      throw new Error('Error al guardar los usuarios');
    }
    
    return await response.json();
  } catch (error) {
    // Capturar error silenciosamente
    throw error;
  }
};

/**
 * Agrega un nuevo usuario al servidor
 * @param {Object} usuario - Datos del nuevo usuario
 * @returns {Promise<Object>} Respuesta del servidor
 */
export const agregarUsuario = async (usuario) => {
  try {
    const response = await fetch(`${API_URL}/usuarios/agregar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(usuario),
    });
    
    if (!response.ok) {
      throw new Error('Error al agregar el usuario');
    }
    
    return await response.json();
  } catch (error) {
    // Capturar error silenciosamente
    throw error;
  }
};

/**
 * Actualiza un usuario existente en el servidor
 * @param {string} id - ID del usuario a actualizar
 * @param {Object} usuario - Datos actualizados del usuario
 * @returns {Promise<Object>} Respuesta del servidor
 */
export const actualizarUsuario = async (id, usuario) => {
  try {
    // Simulamos la llamada a la API actualizando directamente el archivo JSON
    // En una aplicación real, esto sería una llamada a una API real
    
    // Encontramos el índice del usuario en el array
    const index = usuariosData.findIndex(u => u.id === id);
    
    if (index === -1) {
      throw new Error(`Usuario con ID ${id} no encontrado`);
    }
    
    // Actualizamos el usuario en el array
    usuariosData[index] = usuario;
    
    // En una aplicación real, aquí se guardaría el archivo JSON en el servidor
    // Como estamos en un entorno de navegador, no podemos escribir directamente en el sistema de archivos
    // Pero simulamos una respuesta exitosa
    
    // Simulamos un pequeño retraso para que parezca una llamada a API real
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      success: true,
      message: 'Usuario actualizado correctamente',
      data: usuario
    };
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    return {
      success: false,
      message: error.message || 'Error al actualizar el usuario',
      error: error.toString()
    };
  }
};

/**
 * Elimina un usuario del servidor
 * @param {string} id - ID del usuario a eliminar
 * @returns {Promise<Object>} Respuesta del servidor
 */
export const eliminarUsuario = async (id) => {
  try {
    const response = await fetch(`${API_URL}/usuarios/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Error al eliminar el usuario');
    }
    
    return await response.json();
  } catch (error) {
    // Capturar error silenciosamente
    throw error;
  }
};
