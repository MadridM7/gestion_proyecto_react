/**
 * @fileoverview Componente para gestionar el título de la página
 * Actualiza el título de la pestaña del navegador según la ruta actual
 */
import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * Componente atómico para gestionar el título de la página
 * @param {Object} props - Propiedades del componente
 * @param {string} props.defaultTitle - Título por defecto de la aplicación
 * @returns {null} No renderiza ningún elemento en el DOM
 */
const PageTitle = ({ defaultTitle = 'Sistema de Gestión' }) => {
  const location = useLocation();

  // Mapeo de rutas a títulos usando useMemo para evitar recreaciones innecesarias
  const routeTitles = useMemo(() => ({
    '/': 'Dashboard | Sistema de Gestión',
    '/ventas': 'Ventas | Sistema de Gestión',
    '/reportes': 'Reportes | Sistema de Gestión',
    '/usuarios': 'Usuarios | Sistema de Gestión',
    '/productos': 'Productos | Sistema de Gestión',
    '/pedidos': 'Pedidos | Sistema de Gestión',
    '/perfil': 'Perfil | Sistema de Gestión',
    '/rendimiento': 'Rendimiento | Sistema de Gestión',
    '/login': 'Iniciar Sesión | Sistema de Gestión'
  }), []);

  useEffect(() => {
    // Obtener el título correspondiente a la ruta actual o usar el título por defecto
    const pageTitle = routeTitles[location.pathname] || defaultTitle;
    
    // Actualizar el título de la página
    document.title = pageTitle;
  }, [location, defaultTitle, routeTitles]);

  // Este componente no renderiza nada en el DOM
  return null;
};

PageTitle.propTypes = {
  defaultTitle: PropTypes.string
};

export default PageTitle;
