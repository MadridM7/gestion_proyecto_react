import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

// Importar servicios API
import { 
  obtenerUsuarios, 
  guardarUsuarios as guardarUsuariosAPI,
  agregarUsuario as agregarUsuarioAPI,
  actualizarUsuario as actualizarUsuarioAPI,
  eliminarUsuario as eliminarUsuarioAPI 
} from '../services/api';

// Importar datos iniciales del archivo JSON
import usuariosData from '../data/usuarios.json';

// Función para convertir fechas de string a objetos Date
const procesarUsuarios = (usuarios) => {
  return usuarios.map(usuario => ({
    ...usuario,
    fechaRegistro: usuario.fechaRegistro ? new Date(usuario.fechaRegistro) : new Date(),
    fechaCreacion: usuario.fechaCreacion ? new Date(usuario.fechaCreacion) : new Date(),
    ultimoAcceso: usuario.ultimoAcceso ? new Date(usuario.ultimoAcceso) : new Date()
  }));
};

// Cargar datos iniciales desde el archivo JSON
const usuariosIniciales = procesarUsuarios(usuariosData);

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
  
  // Cargar usuarios desde el archivo JSON al iniciar
  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        // Intentar cargar los usuarios desde la API
        const usuariosDesdeAPI = await obtenerUsuarios();
        
        if (usuariosDesdeAPI && usuariosDesdeAPI.length > 0) {
          // Procesar las fechas
          const usuariosProcesados = procesarUsuarios(usuariosDesdeAPI);
          setUsuarios(usuariosProcesados);
          console.log('Usuarios cargados desde el archivo JSON:', usuariosProcesados);
        } else {
          // Si no hay usuarios en la API, usar los datos iniciales
          setUsuarios(usuariosIniciales);
          // Guardar los datos iniciales en el archivo JSON
          await guardarUsuariosAPI(usuariosIniciales);
          console.log('Usuarios iniciales guardados en el archivo JSON');
        }
      } catch (error) {
        console.error('Error al cargar usuarios:', error);
        // En caso de error, usar los datos iniciales
        setUsuarios(usuariosIniciales);
      }
    };
    
    cargarUsuarios();
  }, []);
  
  // Estado para las estadísticas
  const [estadisticas, setEstadisticas] = useState({
    totalUsuarios: 0,
    usuariosActivos: 0,
    porRol: {
      Administrador: 0,
      Vendedor: 0,
      Supervisor: 0
    }
  });
  
  // Actualizar estadísticas cuando cambien los usuarios
  useEffect(() => {
    // Valores por defecto si no hay usuarios
    if (!usuarios || usuarios.length === 0) {
      setEstadisticas({
        totalUsuarios: 0,
        usuariosActivos: 0,
        porRol: {
          Administrador: 0,
          Vendedor: 0,
          Supervisor: 0
        }
      });
      return;
    }
    
    try {
      // Calcular total de usuarios
      const total = usuarios.length;
      
      // Calcular usuarios activos
      const activos = usuarios.filter(usuario => usuario.activo).length;
      
      // Calcular usuarios por rol
      const porRol = {
        Administrador: usuarios.filter(u => u.rol === 'Administrador').length,
        Vendedor: usuarios.filter(u => u.rol === 'Vendedor').length,
        Supervisor: usuarios.filter(u => u.rol === 'Supervisor').length
      };
      
      // Actualizar el estado de estadísticas
      setEstadisticas({
        totalUsuarios: total,
        usuariosActivos: activos,
        porRol
      });
    } catch (error) {
      console.error('Error al calcular estadísticas de usuarios:', error);
      // En caso de error, establecer valores por defecto
      setEstadisticas({
        totalUsuarios: 0,
        usuariosActivos: 0,
        porRol: {
          Administrador: 0,
          Vendedor: 0,
          Supervisor: 0
        }
      });
    }
  }, [usuarios]);
  
  // Función para agregar un nuevo usuario y guardarlo en el archivo JSON a través de la API
  const agregarUsuario = useCallback(async (nuevoUsuario) => {
    try {
      // Asegurar que la fecha sea un objeto Date
      const usuarioConFechaCorrecta = {
        ...nuevoUsuario,
        fechaRegistro: nuevoUsuario.fechaRegistro instanceof Date ? 
          nuevoUsuario.fechaRegistro : new Date(),
        // Asegurar que el ID sea único
        id: nuevoUsuario.id || `U${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`
      };
      
      // Guardar el nuevo usuario en el archivo JSON a través de la API
      const respuesta = await agregarUsuarioAPI(usuarioConFechaCorrecta);
      
      if (respuesta.success) {
        // Agregar el nuevo usuario al estado
        setUsuarios(usuariosActuales => {
          // Verificar si ya existe un usuario con el mismo ID
          const existeID = usuariosActuales.some(u => u.id === usuarioConFechaCorrecta.id);
          if (existeID) {
            usuarioConFechaCorrecta.id = `U${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`;
          }
          return [...usuariosActuales, usuarioConFechaCorrecta];
        });
        
        console.log('Nuevo usuario agregado y guardado en el archivo JSON:', usuarioConFechaCorrecta);
        return usuarioConFechaCorrecta;
      } else {
        console.error('Error al guardar el usuario en el archivo JSON');
        return null;
      }
    } catch (error) {
      console.error('Error al agregar usuario:', error);
      return null;
    }
  }, []);
  
  // Función para eliminar un usuario y actualizar el archivo JSON a través de la API
  const eliminarUsuario = useCallback(async (id) => {
    try {
      // Eliminar el usuario a través de la API
      const respuesta = await eliminarUsuarioAPI(id);
      
      if (respuesta.success) {
        // Actualizar el estado local
        setUsuarios(usuariosActuales => {
          // Filtrar el usuario a eliminar
          const usuariosActualizados = usuariosActuales.filter(usuario => usuario.id !== id);
          console.log(`Usuario con ID ${id} eliminado y actualizado en el archivo JSON`);
          return usuariosActualizados;
        });
        return true;
      } else {
        console.error(`Error al eliminar el usuario con ID ${id} del archivo JSON`);
        return false;
      }
    } catch (error) {
      console.error(`Error al eliminar usuario con ID ${id}:`, error);
      return false;
    }
  }, []);
  
  // Función para actualizar un usuario y guardarlo en el archivo JSON a través de la API
  const actualizarUsuario = useCallback(async (id, datosActualizados) => {
    try {
      // Buscar el usuario actual
      const usuarioActual = usuarios.find(u => u.id === id);
      
      if (!usuarioActual) {
        console.error(`No se encontró el usuario con ID ${id}`);
        return null;
      }
      
      // Crear el usuario actualizado
      const usuarioActualizado = {
        ...usuarioActual,
        ...datosActualizados,
        // Asegurarse de que la fecha sea válida
        fechaRegistro: datosActualizados.fechaRegistro instanceof Date ? 
          datosActualizados.fechaRegistro : 
          (usuarioActual.fechaRegistro instanceof Date ? usuarioActual.fechaRegistro : new Date())
      };
      
      // Actualizar el usuario en el archivo JSON a través de la API
      const respuesta = await actualizarUsuarioAPI(id, usuarioActualizado);
      
      if (respuesta.success) {
        // Actualizar el estado local
        setUsuarios(usuariosActuales => {
          return usuariosActuales.map(usuario => {
            if (usuario.id === id) {
              return usuarioActualizado;
            }
            return usuario;
          });
        });
        
        console.log(`Usuario con ID ${id} actualizado y guardado en el archivo JSON:`, usuarioActualizado);
        return usuarioActualizado;
      } else {
        console.error(`Error al guardar la actualización del usuario ${id} en el archivo JSON`);
        return null;
      }
    } catch (error) {
      console.error(`Error al actualizar usuario ${id}:`, error);
      return null;
    }
  }, [usuarios]);
  
  // Valor del contexto
  const value = {
    usuarios,
    estadisticas,
    agregarUsuario,
    eliminarUsuario,
    actualizarUsuario
  };
  
  return (
    <UsuariosContext.Provider value={value}>
      {children}
    </UsuariosContext.Provider>
  );
};

export default UsuariosContext;
