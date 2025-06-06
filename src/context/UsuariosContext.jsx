/**
 * @fileoverview Contexto para la gestión de usuarios en la aplicación
 * Proporciona funcionalidades para agregar, editar, eliminar usuarios.
 * Implementa un sistema de polling para actualizar los datos sin recompilar la aplicación.
 */
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

// Importar datos de usuarios desde el archivo JSON para la carga inicial
import usuariosData from '../data/usuarios.json';

// Importar servicios API
import { API_URL } from '../config';

// Importar el sistema de polling para actualización de datos sin recompilar
import { dataPoller } from '../services/dataPoller';

// Contexto para la gestión de usuarios

// Crear el contexto de usuarios
const UsuariosContext = createContext();

/**
 * Hook personalizado para acceder al contexto de usuarios
 * @returns {Object} Contexto de usuarios
 */
export const useUsuarios = () => {
  const context = useContext(UsuariosContext);
  if (!context) {
    throw new Error('useUsuarios debe ser usado dentro de un UsuariosProvider');
  }
  return context;
};

/**
 * Proveedor del contexto de usuarios
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Componentes hijos
 * @returns {JSX.Element} Proveedor de contexto
 */
export const UsuariosProvider = ({ children }) => {
  // Estado para los usuarios
  const [usuarios, setUsuarios] = useState([]);
  
  // Estado para las estadísticas de usuarios
  const [estadisticas, setEstadisticas] = useState({
    totalUsuarios: 0,
    usuariosActivos: 0,
    porRol: {
      Administrador: 0,
      Supervisor: 0,
      Vendedor: 0
    }
  });
  
  /**
   * Calcula las estadísticas basadas en los usuarios actuales
   * @param {Array} usuariosActuales - Lista de usuarios para calcular estadísticas
   */
  const calcularEstadisticas = useCallback((usuariosActuales) => {
    if (!Array.isArray(usuariosActuales) || usuariosActuales.length === 0) {
      setEstadisticas({
        totalUsuarios: 0,
        usuariosActivos: 0,
        porRol: {
          Administrador: 0,
          Supervisor: 0,
          Vendedor: 0
        }
      });
      return;
    }
    
    // Calcular total de usuarios
    const totalUsuarios = usuariosActuales.length;
    
    // Calcular usuarios activos
    const usuariosActivos = usuariosActuales.filter(u => u.activo).length;
    
    // Calcular usuarios por rol (normalizando los roles)
    const porRol = {
      Administrador: 0,
      Supervisor: 0,
      Vendedor: 0
    };
    
    usuariosActuales.forEach(usuario => {
      // Normalizar el rol para que coincida con las categorías
      let rolNormalizado = 'Vendedor'; // Por defecto
      
      if (usuario.rol && typeof usuario.rol === 'string') {
        const rolLower = usuario.rol.toLowerCase();
        if (rolLower.includes('admin')) {
          rolNormalizado = 'Administrador';
        } else if (rolLower.includes('super')) {
          rolNormalizado = 'Supervisor';
        } else if (rolLower.includes('vend')) {
          rolNormalizado = 'Vendedor';
        } else if (rolLower.includes('invent')) {
          rolNormalizado = 'Vendedor'; // Asignamos inventario a vendedor para simplificar
        }
      }
      
      // Incrementar contador del rol correspondiente
      if (porRol[rolNormalizado] !== undefined) {
        porRol[rolNormalizado]++;
      }
    });
    
    // Actualizar el estado de estadísticas
    setEstadisticas({
      totalUsuarios,
      usuariosActivos,
      porRol
    });
  }, []);

  // Cargar usuarios al iniciar y configurar el polling
  useEffect(() => {
    // Cargar datos iniciales desde el archivo JSON
    setUsuarios(usuariosData);
    // Usuarios cargados inicialmente
    
    // Calcular estadísticas iniciales
    calcularEstadisticas(usuariosData);
    
    // Configurar el polling para actualizar los datos sin recompilar
    const handleUsuariosUpdate = (nuevosUsuarios) => {
      setUsuarios(nuevosUsuarios);
      calcularEstadisticas(nuevosUsuarios);
      // Datos actualizados silenciosamente
    };
    
    // Iniciar el polling cada 5 segundos
    dataPoller.startPolling('usuarios', handleUsuariosUpdate, 5000);
    
    // Detener el polling cuando el componente se desmonte
    return () => {
      dataPoller.stopPolling('usuarios');
    };
  }, [calcularEstadisticas]);

  /**
   * Agrega un nuevo usuario al sistema y lo guarda en el archivo JSON a través de la API
   * Implementa un patrón optimista para evitar recargas completas de la página
   * @param {Object} nuevoUsuario - Datos del nuevo usuario
   */
  const agregarUsuario = useCallback(async (nuevoUsuario) => {
    try {
      // Normalizar los datos del usuario
      const usuarioNormalizado = {
        ...nuevoUsuario,
        // Generar un ID secuencial para usuarios
        id: `U${usuarios.length > 0 ? 
          // Extraer el número del último ID y sumarle 1
          (parseInt(usuarios[usuarios.length - 1].id.replace('U', '')) + 1).toString().padStart(4, '0') : 
          // Si no hay usuarios, empezar con U0001
          '0001'}`
      };
      
      // Actualizar el estado local primero para evitar recargas
      setUsuarios(usuariosActuales => {
        const nuevosUsuarios = [...usuariosActuales, usuarioNormalizado];
        // Actualizar estadísticas con los nuevos datos
        calcularEstadisticas(nuevosUsuarios);
        return nuevosUsuarios;
      });
      
      // Guardar el nuevo usuario en el archivo JSON a través de la API de forma asíncrona
      const promesaGuardado = fetch(`${API_URL}/usuarios/agregar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest' // Indicar que es una solicitud AJAX
        },
        body: JSON.stringify(usuarioNormalizado),
        keepalive: true // Mantener la conexión viva incluso si la página cambia
      });
      
      // Manejar la respuesta de forma asíncrona
      promesaGuardado.then(async (response) => {
        if (!response.ok) {
          throw new Error('Error al agregar el usuario');
        }
        
        const respuesta = await response.json();
        
        if (!respuesta.success) {
          console.error('Error al guardar el usuario en el servidor');
          // Si falla, revertir el cambio local
          setUsuarios(usuariosActuales => {
            const usuariosActualizados = usuariosActuales.filter(u => u.id !== usuarioNormalizado.id);
            calcularEstadisticas(usuariosActualizados);
            return usuariosActualizados;
          });
        }
      }).catch(error => {
        console.error('Error en la solicitud:', error);
        // Si hay un error, revertir el cambio local
        setUsuarios(usuariosActuales => {
          const usuariosActualizados = usuariosActuales.filter(u => u.id !== usuarioNormalizado.id);
          calcularEstadisticas(usuariosActualizados);
          return usuariosActualizados;
        });
      });
      
      // Devolver el usuario normalizado inmediatamente
      return usuarioNormalizado;
    } catch (error) {
      console.error('Error al procesar el usuario:', error);
      return null;
    }
  }, [calcularEstadisticas, usuarios]);

  /**
   * Elimina un usuario del sistema basado en su ID
   * Implementa un patrón optimista para evitar recargas completas de la página
   * @param {string} id - Identificador único del usuario a eliminar
   */
  const eliminarUsuario = useCallback(async (id) => {
    try {
      // Encontrar el usuario a eliminar para posible restauración
      const usuarioAEliminar = usuarios.find(u => u.id === id);
      
      if (!usuarioAEliminar) {
        console.error(`No se encontró el usuario con ID ${id} para eliminar`);
        return false;
      }
      
      // Actualizar el estado local primero para evitar recargas
      setUsuarios(usuariosActuales => {
        const usuariosActualizados = usuariosActuales.filter(usuario => usuario.id !== id);
        // Actualizar estadísticas con los datos actualizados
        calcularEstadisticas(usuariosActualizados);
        return usuariosActualizados;
      });
      
      // Eliminar el usuario a través de la API de forma asíncrona
      const promesaEliminacion = fetch(`${API_URL}/usuarios/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest' // Indicar que es una solicitud AJAX
        },
        keepalive: true // Mantener la conexión viva incluso si la página cambia
      });
      
      // Manejar la respuesta de forma asíncrona
      promesaEliminacion.then(async (response) => {
        if (!response.ok) {
          throw new Error('Error al eliminar el usuario');
        }
        
        const respuesta = await response.json();
        
        if (!respuesta.success) {
          console.error('Error al eliminar el usuario en el servidor');
          // Si falla, restaurar el usuario eliminado
          setUsuarios(usuariosActuales => {
            const usuariosRestaurados = [...usuariosActuales, usuarioAEliminar];
            // Ordenar por ID para mantener el orden original
            usuariosRestaurados.sort((a, b) => a.id.localeCompare(b.id));
            calcularEstadisticas(usuariosRestaurados);
            return usuariosRestaurados;
          });
        }
      }).catch(error => {
        console.error('Error en la solicitud de eliminación:', error);
        // Si hay un error, restaurar el usuario eliminado
        setUsuarios(usuariosActuales => {
          const usuariosRestaurados = [...usuariosActuales, usuarioAEliminar];
          // Ordenar por ID para mantener el orden original
          usuariosRestaurados.sort((a, b) => a.id.localeCompare(b.id));
          calcularEstadisticas(usuariosRestaurados);
          return usuariosRestaurados;
        });
      });
      
      // Devolver true inmediatamente para mejorar la experiencia del usuario
      return true;
    } catch (error) {
      console.error('Error al procesar la eliminación del usuario:', error);
      return false;
    }
  }, [usuarios, calcularEstadisticas]);

  /**
   * Actualiza los datos de un usuario existente y los guarda en el archivo JSON a través de la API
   * Implementa un patrón optimista para evitar recargas completas de la página
   * @param {string} id - Identificador único del usuario a actualizar
   * @param {Object} datosActualizados - Objeto con los nuevos datos del usuario
   */
  const actualizarUsuario = useCallback(async (id, datosActualizados) => {
    try {
      // Buscar el usuario actual para combinar con los datos actualizados
      const usuarioActual = usuarios.find(u => u.id === id);
      
      if (!usuarioActual) {
        console.error(`No se encontró el usuario con ID ${id} para actualizar`);
        return null;
      }
      
      // Guardar el usuario original para posible reversión
      const usuarioOriginal = { ...usuarioActual };
      
      // Normalizar los datos actualizados
      const usuarioActualizado = {
        ...usuarioActual,
        ...datosActualizados
      };
      
      // Actualizar el estado local primero para evitar recargas
      setUsuarios(usuariosActuales => {
        const usuariosActualizados = usuariosActuales.map(usuario => {
          if (usuario.id === id) {
            return usuarioActualizado;
          }
          return usuario;
        });
        
        // Actualizar estadísticas con los datos actualizados
        calcularEstadisticas(usuariosActualizados);
        
        return usuariosActualizados;
      });
      
      // Actualizar el usuario en el archivo JSON a través de la API de forma asíncrona
      const promesaActualizacion = fetch(`${API_URL}/usuarios/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest' // Indicar que es una solicitud AJAX
        },
        body: JSON.stringify(usuarioActualizado),
        keepalive: true // Mantener la conexión viva incluso si la página cambia
      });
      
      // Manejar la respuesta de forma asíncrona
      promesaActualizacion.then(async (response) => {
        if (!response.ok) {
          throw new Error('Error al actualizar el usuario');
        }
        
        const respuesta = await response.json();
        
        if (!respuesta.success) {
          console.error('Error al actualizar el usuario en el servidor');
          // Si falla, revertir el cambio local
          setUsuarios(usuariosActuales => {
            const usuariosRestaurados = usuariosActuales.map(usuario => {
              if (usuario.id === id) {
                return usuarioOriginal;
              }
              return usuario;
            });
            calcularEstadisticas(usuariosRestaurados);
            return usuariosRestaurados;
          });
        }
      }).catch(error => {
        console.error('Error en la solicitud de actualización:', error);
        // Si hay un error, revertir el cambio local
        setUsuarios(usuariosActuales => {
          const usuariosRestaurados = usuariosActuales.map(usuario => {
            if (usuario.id === id) {
              return usuarioOriginal;
            }
            return usuario;
          });
          calcularEstadisticas(usuariosRestaurados);
          return usuariosRestaurados;
        });
      });
      
      // Devolver el usuario actualizado inmediatamente
      return usuarioActualizado;
    } catch (error) {
      console.error('Error al procesar la actualización del usuario:', error);
      return null;
    }
  }, [usuarios, calcularEstadisticas]);

  // Valor del contexto
  const value = {
    usuarios,
    estadisticas,
    agregarUsuario,
    actualizarUsuario,
    eliminarUsuario
  };

  return (
    <UsuariosContext.Provider value={value}>
      {children}
    </UsuariosContext.Provider>
  );
};

export default UsuariosContext;
