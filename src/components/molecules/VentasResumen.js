/**
 * @fileoverview Componente molecular para mostrar resúmenes de ventas
 */
import React from 'react';
import { Row, Col, Card, Statistic, Progress } from 'antd';
import { 
  ShoppingCartOutlined, 
  DollarOutlined, 
  UserOutlined, 
  RiseOutlined 
} from '@ant-design/icons';
import PropTypes from 'prop-types';

/**
 * Componente molecular para mostrar resúmenes de ventas
 * @param {Object} props - Propiedades del componente
 * @returns {JSX.Element} Resumen de ventas en tarjetas
 */
const VentasResumen = ({ 
  totalVentas = 0, 
  ventasMes = 0, 
  ventasSemana = 0, 
  ventasHoy = 0,
  ingresoTotal = 0,
  ingresoMes = 0,
  clientesActivos = 0,
  crecimiento = 0,
  loading = false
}) => {
  // Calcular porcentaje de ventas del mes respecto al total
  const porcentajeMes = totalVentas > 0 
    ? Math.round((ventasMes / totalVentas) * 100) 
    : 0;
  
  // Calcular porcentaje de ventas de la semana respecto al mes
  const porcentajeSemana = ventasMes > 0 
    ? Math.round((ventasSemana / ventasMes) * 100) 
    : 0;
  
  // Calcular porcentaje de ventas de hoy respecto a la semana
  const porcentajeHoy = ventasSemana > 0 
    ? Math.round((ventasHoy / ventasSemana) * 100) 
    : 0;
  
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} lg={6}>
        <Card hoverable loading={loading}>
          <Statistic
            title="Ventas Totales"
            value={totalVentas}
            prefix={<ShoppingCartOutlined />}
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
      
      <Col xs={24} sm={12} lg={6}>
        <Card hoverable loading={loading}>
          <Statistic
            title="Ventas del Mes"
            value={ventasMes}
            prefix={<ShoppingCartOutlined />}
            valueStyle={{ color: '#52c41a' }}
            suffix={`/ ${totalVentas}`}
          />
          <div style={{ marginTop: 16 }}>
            <Progress 
              percent={porcentajeMes} 
              status="active" 
              strokeColor="#52c41a"
            />
          </div>
        </Card>
      </Col>
      
      <Col xs={24} sm={12} lg={6}>
        <Card hoverable loading={loading}>
          <Statistic
            title="Ventas de la Semana"
            value={ventasSemana}
            prefix={<ShoppingCartOutlined />}
            valueStyle={{ color: '#faad14' }}
            suffix={`/ ${ventasMes}`}
          />
          <div style={{ marginTop: 16 }}>
            <Progress 
              percent={porcentajeSemana} 
              status="active" 
              strokeColor="#faad14"
            />
          </div>
        </Card>
      </Col>
      
      <Col xs={24} sm={12} lg={6}>
        <Card hoverable loading={loading}>
          <Statistic
            title="Ventas de Hoy"
            value={ventasHoy}
            prefix={<ShoppingCartOutlined />}
            valueStyle={{ color: '#f5222d' }}
            suffix={`/ ${ventasSemana}`}
          />
          <div style={{ marginTop: 16 }}>
            <Progress 
              percent={porcentajeHoy} 
              status="active" 
              strokeColor="#f5222d"
            />
          </div>
        </Card>
      </Col>
      
      <Col xs={24} sm={12}>
        <Card hoverable loading={loading}>
          <Statistic
            title="Ingresos Totales"
            value={ingresoTotal}
            prefix={<DollarOutlined />}
            valueStyle={{ color: '#1890ff' }}
            precision={2}
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
      
      <Col xs={24} sm={12}>
        <Card hoverable loading={loading}>
          <Statistic
            title="Ingresos del Mes"
            value={ingresoMes}
            prefix={<DollarOutlined />}
            valueStyle={{ color: '#52c41a' }}
            precision={2}
          />
          <div style={{ marginTop: 16 }}>
            <Progress 
              percent={ingresoTotal > 0 ? Math.round((ingresoMes / ingresoTotal) * 100) : 0} 
              status="active" 
              strokeColor="#52c41a"
            />
          </div>
        </Card>
      </Col>
      
      <Col xs={24} sm={12}>
        <Card hoverable loading={loading}>
          <Statistic
            title="Clientes Activos"
            value={clientesActivos}
            prefix={<UserOutlined />}
            valueStyle={{ color: '#722ed1' }}
          />
          <div style={{ marginTop: 16 }}>
            <Progress 
              percent={100} 
              status="active" 
              strokeColor="#722ed1"
              showInfo={false}
            />
          </div>
        </Card>
      </Col>
      
      <Col xs={24} sm={12}>
        <Card hoverable loading={loading}>
          <Statistic
            title="Crecimiento"
            value={crecimiento}
            prefix={<RiseOutlined />}
            valueStyle={{ 
              color: crecimiento >= 0 ? '#52c41a' : '#f5222d' 
            }}
            suffix="%"
          />
          <div style={{ marginTop: 16 }}>
            <Progress 
              percent={Math.abs(crecimiento)} 
              status={crecimiento >= 0 ? "active" : "exception"} 
              strokeColor={crecimiento >= 0 ? "#52c41a" : "#f5222d"}
            />
          </div>
        </Card>
      </Col>
    </Row>
  );
};

VentasResumen.propTypes = {
  totalVentas: PropTypes.number,
  ventasMes: PropTypes.number,
  ventasSemana: PropTypes.number,
  ventasHoy: PropTypes.number,
  ingresoTotal: PropTypes.number,
  ingresoMes: PropTypes.number,
  clientesActivos: PropTypes.number,
  crecimiento: PropTypes.number,
  loading: PropTypes.bool
};

export default VentasResumen;
