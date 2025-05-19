/**
 * @fileoverview Estadísticas de usuarios para el dashboard
 */
import React from 'react';
import { Row, Col, Card, Statistic, Progress } from 'antd';
import { UserOutlined, TeamOutlined, IdcardOutlined, SafetyOutlined } from '@ant-design/icons';
import { useUsuarios } from '../../context/UsuariosContext';
import '../../styles/components/organisms/UsuariosStats.css';

/**
 * Componente organismo para mostrar estadísticas de usuarios
 * @returns {JSX.Element} Estadísticas de usuarios en tarjetas
 */
const UsuariosStats = () => {
  const { usuarios, estadisticas } = useUsuarios();
  
  // Calcular porcentaje de usuarios activos
  const porcentajeActivos = usuarios.length > 0 
    ? Math.round((estadisticas.usuariosActivos / estadisticas.totalUsuarios) * 100) 
    : 0;
  
  // Calcular distribución de roles
  const porRol = estadisticas.porRol || {};
  const totalRoles = Object.values(porRol).reduce((sum, count) => sum + count, 0);
  
  // Función para calcular el porcentaje de un rol
  const calcularPorcentajeRol = (rol) => {
    if (!porRol[rol] || totalRoles === 0) return 0;
    return Math.round((porRol[rol] / totalRoles) * 100);
  };
  
  return (
    <div>
      {/* Primera fila: Total y Activos */}
      <Row gutter={[16, 16]} className="usuarios-stats-row">
        <Col xs={24} md={12}>
          <Card hoverable>
            <Statistic
              title="Total de Usuarios"
              value={estadisticas.totalUsuarios}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <div className="usuarios-stats-section">
              <Progress 
                percent={100} 
                status="active" 
                strokeColor="#1890ff"
                showInfo={false}
              />
            </div>
          </Card>
        </Col>
        
        <Col xs={24} md={12}>
          <Card hoverable>
            <Statistic
              title="Usuarios Activos"
              value={estadisticas.usuariosActivos}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#52c41a' }}
              suffix={`/ ${estadisticas.totalUsuarios}`}
            />
            <div className="usuarios-stats-section">
              <Progress 
                percent={porcentajeActivos} 
                status="active" 
                strokeColor="#52c41a"
              />
            </div>
          </Card>
        </Col>
      </Row>
      
      {/* Segunda fila: Tipos de usuarios */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card hoverable>
            <Statistic
              title="Administradores"
              value={porRol.Administrador || 0}
              prefix={<SafetyOutlined />}
              valueStyle={{ color: '#f5222d' }}
              suffix={`(${calcularPorcentajeRol('Administrador')}%)`}
            />
            <div className="usuarios-stats-section">
              <Progress 
                percent={calcularPorcentajeRol('Administrador')} 
                status="active" 
                strokeColor="#f5222d"
              />
            </div>
          </Card>
        </Col>
        
        <Col xs={24} md={8}>
          <Card hoverable>
            <Statistic
              title="Vendedores"
              value={porRol.Vendedor || 0}
              prefix={<IdcardOutlined />}
              valueStyle={{ color: '#722ed1' }}
              suffix={`(${calcularPorcentajeRol('Vendedor')}%)`}
            />
            <div className="usuarios-stats-section">
              <Progress 
                percent={calcularPorcentajeRol('Vendedor')} 
                status="active" 
                strokeColor="#722ed1"
              />
            </div>
          </Card>
        </Col>
        
        <Col xs={24} md={8}>
          <Card hoverable>
            <Statistic
              title="Supervisores"
              value={porRol.Supervisor || 0}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#faad14' }}
              suffix={`(${calcularPorcentajeRol('Supervisor')}%)`}
            />
            <div className="usuarios-stats-section">
              <Progress 
                percent={calcularPorcentajeRol('Supervisor')} 
                status="active" 
                strokeColor="#faad14"
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UsuariosStats;
