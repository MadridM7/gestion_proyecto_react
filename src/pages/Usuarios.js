/**
 * @fileoverview Página de gestión de usuarios con estructura Atomic Design
 */
import React, { useEffect, useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import UsuariosTemplate from '../components/templates/UsuariosTemplate';
import UsuariosDataTable from '../components/organisms/UsuariosDataTable';
import UsuarioFormulario from '../components/molecules/UsuarioFormulario';
import UsuariosStats from '../components/organisms/UsuariosStats';
import PerfilUsuario from '../components/molecules/PerfilUsuario';
import UsuarioDetail from '../components/organisms/UsuarioDetail';

/**
 * Página de gestión de usuarios
 * @returns {JSX.Element} Página de Usuarios
 */
const Usuarios = () => {
  // Estado para detectar si es dispositivo móvil
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si es dispositivo móvil al cargar y al cambiar el tamaño de la ventana
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Comprobar al cargar
    checkIfMobile();
    
    // Comprobar al cambiar el tamaño de la ventana
    window.addEventListener('resize', checkIfMobile);
    
    // Limpiar el event listener al desmontar
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  return (
    <MainLayout currentPage="Usuarios">
      <UsuariosTemplate 
        UsuariosDataTable={UsuariosDataTable}
        UsuarioFormulario={UsuarioFormulario}
        UsuariosStats={UsuariosStats}
        PerfilUsuario={PerfilUsuario}
        UsuarioDetail={UsuarioDetail}
        isMobile={isMobile}
      />
    </MainLayout>
  );
};

export default Usuarios;
