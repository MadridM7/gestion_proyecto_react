/**
 * @fileoverview Página de gestión de usuarios con estructura Atomic Design
 */
import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import UsuariosTemplate from '../components/templates/UsuariosTemplate';
import UsuariosDataTable from '../components/organisms/UsuariosDataTable';
import UsuarioFormulario from '../components/molecules/UsuarioFormulario';
import UsuariosStats from '../components/organisms/UsuariosStats';
import PerfilUsuario from '../components/molecules/PerfilUsuario';

/**
 * Página de gestión de usuarios
 * @returns {JSX.Element} Página de Usuarios
 */
const Usuarios = () => {
  return (
    <MainLayout currentPage="Usuarios">
      <UsuariosTemplate 
        UsuariosDataTable={UsuariosDataTable}
        UsuarioFormulario={UsuarioFormulario}
        UsuariosStats={UsuariosStats}
        PerfilUsuario={PerfilUsuario}
      />
    </MainLayout>
  );
};

export default Usuarios;
