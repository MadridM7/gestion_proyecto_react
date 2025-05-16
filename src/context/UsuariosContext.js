import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

// Datos de ejemplo para la tabla de usuarios
const usuariosIniciales = [
  {
    id: "U001",
    nombre: "Juan Pérez",
    email: "juan.perez@ejemplo.com",
    rol: "Administrador",
    activo: true,
    fechaRegistro: new Date("2025-01-15")
  },
  {
    id: "U002",
    nombre: "María González",
    email: "maria.gonzalez@ejemplo.com",
    rol: "Vendedor",
    activo: true,
    fechaRegistro: new Date("2025-02-10")
  },
  {
    id: "U003",
    nombre: "Carlos Rodríguez",
    email: "carlos.rodriguez@ejemplo.com",
    rol: "Vendedor",
    activo: true,
    fechaRegistro: new Date("2025-02-25")
  },
  {
    id: "U004",
    nombre: "Ana Martínez",
    email: "ana.martinez@ejemplo.com",
    rol: "Vendedor",
    activo: true,
    fechaRegistro: new Date("2025-03-05")
  },
  {
    id: "U005",
    nombre: "Pedro Sánchez",
    email: "pedro.sanchez@ejemplo.com",
    rol: "Supervisor",
    activo: true,
    fechaRegistro: new Date("2025-03-15")
  },
  {
    id: "U006",
    nombre: "Laura Torres",
    email: "laura.torres@ejemplo.com",
    rol: "Vendedor",
    activo: false,
    fechaRegistro: new Date("2025-04-01")
  }
];

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
  const [usuarios, setUsuarios] = useState(usuariosIniciales);
  
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
  
  // Función para agregar un nuevo usuario
  const agregarUsuario = useCallback((nuevoUsuario) => {
    // Asegurar que la fecha sea un objeto Date
    const usuarioConFechaCorrecta = {
      ...nuevoUsuario,
      fechaRegistro: nuevoUsuario.fechaRegistro instanceof Date ? 
        nuevoUsuario.fechaRegistro : new Date(),
      // Asegurar que el ID sea único
      id: nuevoUsuario.id || `U${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`
    };
    
    // Agregar el nuevo usuario al estado
    setUsuarios(usuariosActuales => {
      // Verificar si ya existe un usuario con el mismo ID
      const existeID = usuariosActuales.some(u => u.id === usuarioConFechaCorrecta.id);
      if (existeID) {
        usuarioConFechaCorrecta.id = `U${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`;
      }
      return [...usuariosActuales, usuarioConFechaCorrecta];
    });
    
    // Mostrar mensaje de confirmación en la consola
    console.log('Nuevo usuario agregado:', usuarioConFechaCorrecta);
  }, []);
  
  // Función para eliminar un usuario
  const eliminarUsuario = useCallback((id) => {
    setUsuarios(usuariosActuales => {
      // Filtrar el usuario a eliminar
      const usuariosActualizados = usuariosActuales.filter(usuario => usuario.id !== id);
      console.log(`Usuario con ID ${id} eliminado`);
      return usuariosActualizados;
    });
  }, []);
  
  // Función para actualizar un usuario
  const actualizarUsuario = useCallback((id, datosActualizados) => {
    setUsuarios(usuariosActuales => {
      // Buscar y actualizar el usuario
      const usuariosActualizados = usuariosActuales.map(usuario => {
        if (usuario.id === id) {
          const usuarioActualizado = {
            ...usuario,
            ...datosActualizados,
            // Asegurarse de que la fecha sea válida
            fechaRegistro: datosActualizados.fechaRegistro instanceof Date ? 
              datosActualizados.fechaRegistro : 
              (usuario.fechaRegistro instanceof Date ? usuario.fechaRegistro : new Date())
          };
          console.log(`Usuario con ID ${id} actualizado:`, usuarioActualizado);
          return usuarioActualizado;
        }
        return usuario;
      });
      return usuariosActualizados;
    });
  }, []);
  
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
