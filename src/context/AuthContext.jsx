/**
 * @fileoverview Contexto para la gestión de autenticación en la aplicación
 * Proporciona funcionalidades para iniciar sesión, cerrar sesión y verificar el estado de autenticación
 */
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useUsuarios } from './UsuariosContext';
import { API_URL } from '../config';

// Crear el contexto de autenticación
const AuthContext = createContext();

/**
 * Hook personalizado para acceder al contexto de autenticación
 * @returns {Object} Contexto de autenticación
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

/**
 * Proveedor del contexto de autenticación
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Componentes hijos
 * @returns {JSX.Element} Proveedor de contexto
 */
export const AuthProvider = ({ children }) => {
  // Estado para el usuario autenticado
  const [usuario, setUsuario] = useState(null);
  // Estado para verificar si la autenticación está cargando
  const [loading, setLoading] = useState(true);
  // Acceder al contexto de usuarios
  const { actualizarUsuario: actualizarUsuarioEnContexto } = useUsuarios();

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        setUsuario(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error al parsear usuario almacenado:', error);
        localStorage.removeItem('currentUser');
      }
    }
    setLoading(false);
  }, []);

  /**
   * Inicia sesión con un usuario
   * @param {Object} user - Datos del usuario autenticado
   */
  const login = (user) => {
    setUsuario(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  /**
   * Cierra la sesión del usuario actual
   */
  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('currentUser');
  };

  /**
   * Actualiza la información del usuario actual
   * @param {Object} usuarioActualizado - Datos actualizados del usuario
   * @returns {Promise<boolean>} Promesa que se resuelve con true si la actualización fue exitosa
   */
  const actualizarUsuario = async (usuarioActualizado) => {
    try {
      // Actualizar el usuario en el archivo JSON a través de la API
      const respuesta = await fetch(`${API_URL}/usuarios/${usuarioActualizado.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuarioActualizado),
      });
      
      if (!respuesta.ok) {
        throw new Error('Error al actualizar el usuario');
      }
      
      const data = await respuesta.json();
      
      if (data && data.success) {
        // Actualizar el usuario en el contexto de usuarios si existe la función
        if (actualizarUsuarioEnContexto) {
          await actualizarUsuarioEnContexto(usuarioActualizado.id, usuarioActualizado);
        }
        
        // Actualizar el estado local y localStorage
        setUsuario(usuarioActualizado);
        localStorage.setItem('currentUser', JSON.stringify(usuarioActualizado));
        return true;
      } else {
        throw new Error(data.message || 'Error en la respuesta de la API');
      }
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      return false;
    }
  };

  /**
   * Verifica si el usuario está autenticado
   * @returns {boolean} true si el usuario está autenticado, false en caso contrario
   */
  const isAuthenticated = () => {
    return !!usuario;
  };

  // Valor del contexto
  const value = {
    usuario,
    loading,
    login,
    logout,
    actualizarUsuario,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
