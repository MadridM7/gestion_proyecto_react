/**
 * @fileoverview Contexto para la gestión de usuarios en la aplicación
 * Proporciona funcionalidades para agregar, editar, eliminar usuarios.
 * Implementa un sistema de polling para actualizar los datos sin recompilar la aplicación.
 */
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

// Importar datos de usuarios desde el archivo JSON para la carga inicial
import usuariosData from '../data/usuarios.json';

// Importar servicios API
import { 
  agregarUsuario as agregarUsuarioAPI,
  actualizarUsuario as actualizarUsuarioAPI,
  eliminarUsuario as eliminarUsuarioAPI 
} from '../services/api';

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
    console.log('Usuarios cargados desde el archivo JSON:', usuariosData.length);
    
    // Calcular estadísticas iniciales
    calcularEstadisticas(usuariosData);
    
    // Configurar el polling para actualizar los datos sin recompilar
    const handleUsuariosUpdate = (nuevosUsuarios) => {
      setUsuarios(nuevosUsuarios);
      calcularEstadisticas(nuevosUsuarios);
      console.log('Datos de usuarios actualizados mediante polling');
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
   * 
   * @param {Object} nuevoUsuario - Datos del nuevo usuario
   */
  const agregarUsuario = useCallback(async (nuevoUsuario) => {
    try {
      // Normalizar los datos del usuario
      const usuarioNormalizado = {
        ...nuevoUsuario,
        // Generar un ID único
        id: `U${Math.floor(Math.random() * 10000)}`
      };
      
      // Guardar el nuevo usuario en el archivo JSON a través de la API
      const respuesta = await agregarUsuarioAPI(usuarioNormalizado);
      
      if (respuesta.success) {
        // Actualizar el estado local
        setUsuarios(usuariosActuales => {
          const nuevosUsuarios = [...usuariosActuales, usuarioNormalizado];
          // Actualizar estadísticas con los nuevos datos
          calcularEstadisticas(nuevosUsuarios);
          return nuevosUsuarios;
        });
        console.log('Usuario agregado y guardado en el archivo JSON:', usuarioNormalizado);
        return usuarioNormalizado;
      } else {
        console.error('Error al guardar el usuario en el archivo JSON');
        return null;
      }
    } catch (error) {
      console.error('Error al agregar usuario:', error);
      return null;
    }
  }, [calcularEstadisticas]);

  /**
   * Elimina un usuario del sistema basado en su ID
   * @param {string} id - Identificador único del usuario a eliminar
   */
  const eliminarUsuario = useCallback(async (id) => {
    try {
      // Eliminar el usuario a través de la API
      const respuesta = await eliminarUsuarioAPI(id);
      
      if (respuesta.success) {
        // Actualizar el estado local
        setUsuarios(usuariosActuales => {
          const usuariosActualizados = usuariosActuales.filter(usuario => usuario.id !== id);
          // Actualizar estadísticas con los datos actualizados
          calcularEstadisticas(usuariosActualizados);
          return usuariosActualizados;
        });
        console.log(`Usuario con ID ${id} eliminado`);
        return true;
      } else {
        console.error('Error al eliminar el usuario');
        return false;
      }
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      return false;
    }
  }, [calcularEstadisticas]);

  /**
   * Actualiza los datos de un usuario existente y los guarda en el archivo JSON a través de la API
   * 
   * @param {string} id - Identificador único del usuario a actualizar
   * @param {Object} datosActualizados - Objeto con los nuevos datos del usuario
   */
  const actualizarUsuario = useCallback(async (id, datosActualizados) => {
    try {
      // Buscar el usuario actual para combinar con los datos actualizados
      const usuarioActual = usuarios.find(u => u.id === id);
      
      if (!usuarioActual) {
        console.error(`No se encontró el usuario con ID ${id}`);
        return null;
      }
      
      // Normalizar los datos actualizados
      const usuarioActualizado = {
        ...usuarioActual,
        ...datosActualizados
      };
      
      // Actualizar el usuario en el archivo JSON a través de la API
      const respuesta = await actualizarUsuarioAPI(id, usuarioActualizado);
      
      if (respuesta.success) {
        // Actualizar el estado local
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
        
        console.log(`Usuario ${id} actualizado y guardado en el archivo JSON:`, usuarioActualizado);
        return usuarioActualizado;
      } else {
        console.error(`Error al guardar la actualización del usuario ${id} en el archivo JSON`);
        return null;
      }
    } catch (error) {
      console.error(`Error al actualizar usuario ${id}:`, error);
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
