/**
 * Servicio para interactuar con la API del servidor
 * Proporciona funciones para obtener y guardar datos en los archivos JSON
 */

const API_URL = 'http://localhost:3001/api';

/**
 * Obtiene las ventas desde el servidor
 * @returns {Promise<Array>} Array de ventas
 */
export const obtenerVentas = async () => {
  try {
    const response = await fetch(`${API_URL}/ventas`);
    if (!response.ok) {
      throw new Error('Error al obtener las ventas');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en obtenerVentas:', error);
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
    const response = await fetch(`${API_URL}/ventas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ventas),
    });
    
    if (!response.ok) {
      throw new Error('Error al guardar las ventas');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en guardarVentas:', error);
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
    const response = await fetch(`${API_URL}/ventas/agregar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(venta),
    });
    
    if (!response.ok) {
      throw new Error('Error al agregar la venta');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en agregarVenta:', error);
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
    const response = await fetch(`${API_URL}/ventas/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(venta),
    });
    
    if (!response.ok) {
      throw new Error('Error al actualizar la venta');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en actualizarVenta:', error);
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
    console.error('Error en eliminarVenta:', error);
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
    console.error('Error en obtenerProductos:', error);
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
    console.error('Error en guardarProductos:', error);
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
    console.error('Error en agregarProducto:', error);
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
    console.error('Error en actualizarProducto:', error);
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
    console.error('Error en eliminarProducto:', error);
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
    console.error('Error en obtenerUsuarios:', error);
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
    console.error('Error en guardarUsuarios:', error);
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
    console.error('Error en agregarUsuario:', error);
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
    const response = await fetch(`${API_URL}/usuarios/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(usuario),
    });
    
    if (!response.ok) {
      throw new Error('Error al actualizar el usuario');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en actualizarUsuario:', error);
    throw error;
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
    console.error('Error en eliminarUsuario:', error);
    throw error;
  }
};
