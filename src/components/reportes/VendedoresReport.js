import React, { useState, useEffect } from 'react';
import { Table, Typography, Card, Row, Col, Progress, Avatar } from 'antd';
import { UserOutlined, TrophyOutlined, RiseOutlined, FallOutlined } from '@ant-design/icons';
import { useVentas } from '../../context/VentasContext';

const { Title, Text } = Typography;

/**
 * Componente para mostrar el reporte de vendedores
 * @returns {JSX.Element} Reporte de vendedores
 */
const VendedoresReport = () => {
  const { ventas } = useVentas();
  const [datosVendedores, setDatosVendedores] = useState([]);
  const [mejorVendedor, setMejorVendedor] = useState(null);
  const [totalVentas, setTotalVentas] = useState(0);
  
  // Preparar datos para el reporte de vendedores
  useEffect(() => {
    if (!ventas || ventas.length === 0) return;
    
    // Agrupar ventas por vendedor
    const vendedoresObj = {};
    let total = 0;
    
    ventas.forEach(venta => {
      const { vendedor, monto } = venta;
      total += monto;
      
      if (!vendedoresObj[vendedor]) {
        vendedoresObj[vendedor] = {
          nombre: vendedor,
          cantidad: 0,
          monto: 0,
          promedio: 0,
          ventas: []
        };
      }
      
      vendedoresObj[vendedor].cantidad += 1;
      vendedoresObj[vendedor].monto += monto;
      vendedoresObj[vendedor].ventas.push(venta);
    });
    
    // Calcular promedio por vendedor
    Object.keys(vendedoresObj).forEach(vendedor => {
      const { monto, cantidad } = vendedoresObj[vendedor];
      vendedoresObj[vendedor].promedio = cantidad > 0 ? monto / cantidad : 0;
    });
    
    // Convertir a array para la tabla
    const vendedoresArray = Object.values(vendedoresObj).map((vendedor, index) => ({
      ...vendedor,
      key: index,
      porcentaje: total > 0 ? (vendedor.monto / total) * 100 : 0
    }));
    
    // Ordenar por monto (mayor a menor)
    vendedoresArray.sort((a, b) => b.monto - a.monto);
    
    // Establecer el mejor vendedor
    if (vendedoresArray.length > 0) {
      setMejorVendedor(vendedoresArray[0]);
    }
    
    setDatosVendedores(vendedoresArray);
    setTotalVentas(total);
  }, [ventas]);
  
  // Columnas para la tabla
  const columns = [
    {
      title: 'Vendedor',
      dataIndex: 'nombre',
      key: 'nombre',
      render: (nombre) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar icon={<UserOutlined />} style={{ marginRight: 8 }} />
          {nombre}
        </div>
      )
    },
    {
      title: 'Ventas',
      dataIndex: 'cantidad',
      key: 'cantidad',
      sorter: (a, b) => a.cantidad - b.cantidad,
    },
    {
      title: 'Total',
      dataIndex: 'monto',
      key: 'monto',
      render: (monto) => `$${monto.toLocaleString('es-CL')}`,
      sorter: (a, b) => a.monto - b.monto,
      defaultSortOrder: 'descend',
    },
    {
      title: 'Promedio',
      dataIndex: 'promedio',
      key: 'promedio',
      render: (promedio) => `$${Math.round(promedio).toLocaleString('es-CL')}`,
      sorter: (a, b) => a.promedio - b.promedio,
    },
    {
      title: 'Participación',
      dataIndex: 'porcentaje',
      key: 'porcentaje',
      render: (porcentaje) => (
        <div style={{ width: 150 }}>
          <Progress 
            percent={Math.round(porcentaje)} 
            size="small" 
            format={(percent) => `${percent}%`}
          />
        </div>
      ),
      sorter: (a, b) => a.porcentaje - b.porcentaje,
    }
  ];
  
  return (
    <div>
      {mejorVendedor && (
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} md={8}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Avatar 
                  size={64} 
                  icon={<TrophyOutlined />} 
                  style={{ backgroundColor: '#ffd700', marginRight: 16 }} 
                />
                <div>
                  <Text type="secondary">Mejor Vendedor</Text>
                  <Title level={4} style={{ margin: '4px 0' }}>{mejorVendedor.nombre}</Title>
                  <Text strong>${mejorVendedor.monto.toLocaleString('es-CL')}</Text>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card>
              <Title level={4} style={{ margin: 0 }}>
                {mejorVendedor.cantidad}
                <Text type="secondary" style={{ fontSize: '16px', marginLeft: 8 }}>ventas</Text>
              </Title>
              <Text type="secondary">Total de transacciones</Text>
              <Progress 
                percent={Math.round((mejorVendedor.cantidad / ventas.length) * 100)} 
                status="active" 
                style={{ marginTop: 8 }}
              />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card>
              <Title level={4} style={{ margin: 0 }}>
                {Math.round(mejorVendedor.porcentaje)}%
              </Title>
              <Text type="secondary">Participación en ventas</Text>
              <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
                <RiseOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                <Text>
                  {mejorVendedor.porcentaje > 30 ? 'Excelente desempeño' : 'Buen desempeño'}
                </Text>
              </div>
            </Card>
          </Col>
        </Row>
      )}
      
      <Table 
        columns={columns} 
        dataSource={datosVendedores} 
        pagination={false}
        summary={() => (
          <Table.Summary fixed>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}><strong>Total</strong></Table.Summary.Cell>
              <Table.Summary.Cell index={1}>
                <strong>{ventas.length}</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2}>
                <strong>${totalVentas.toLocaleString('es-CL')}</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={3}>
                <strong>${Math.round(totalVentas / ventas.length).toLocaleString('es-CL')}</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={4}>
                <strong>100%</strong>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />
    </div>
  );
};

export default VendedoresReport;
