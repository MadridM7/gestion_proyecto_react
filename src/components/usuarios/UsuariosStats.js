import React from 'react';
import { Row, Col, Card, Statistic, Progress } from 'antd';
import { UserOutlined, TeamOutlined, IdcardOutlined } from '@ant-design/icons';
import { useUsuarios } from '../../context/UsuariosContext';

/**
 * Componente para mostrar estadísticas de usuarios
 * @returns {JSX.Element} Estadísticas de usuarios
 */
const UsuariosStats = () => {
  const { usuarios, estadisticas } = useUsuarios();
  
  // Calcular porcentaje de usuarios activos
  const porcentajeActivos = usuarios.length > 0 
    ? Math.round((estadisticas.usuariosActivos / estadisticas.totalUsuarios) * 100) 
    : 0;
  
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} md={8}>
        <Card>
          <Statistic
            title="Total de Usuarios"
            value={estadisticas.totalUsuarios}
            prefix={<TeamOutlined />}
            valueStyle={{ color: '#1890ff' }}
          />
          <div style={{ marginTop: 16 }}>
            <Progress 
              percent={100} 
              status="active" 
              strokeColor="#1890ff"
              showInfo={false}
            />
          </div>
        </Card>
      </Col>
      
      <Col xs={24} md={8}>
        <Card>
          <Statistic
            title="Usuarios Activos"
            value={estadisticas.usuariosActivos}
            prefix={<UserOutlined />}
            valueStyle={{ color: '#52c41a' }}
          />
          <div style={{ marginTop: 16 }}>
            <Progress 
              percent={porcentajeActivos} 
              status="active" 
              strokeColor="#52c41a"
            />
          </div>
        </Card>
      </Col>
      
      <Col xs={24} md={8}>
        <Card>
          <Statistic
            title="Roles"
            value={Object.values(estadisticas.porRol).reduce((a, b) => a + b, 0)}
            prefix={<IdcardOutlined />}
            valueStyle={{ color: '#722ed1' }}
          />
          <div style={{ marginTop: 16 }}>
            <Row gutter={[8, 8]}>
              <Col span={8}>
                <span>Admin: {estadisticas.porRol.Administrador}</span>
              </Col>
              <Col span={8}>
                <span>Super: {estadisticas.porRol.Supervisor}</span>
              </Col>
              <Col span={8}>
                <span>Vend: {estadisticas.porRol.Vendedor}</span>
              </Col>
            </Row>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default UsuariosStats;
