/**
 * @fileoverview Página de configuración y monitoreo de rendimiento
 * Permite visualizar y ajustar las optimizaciones de rendimiento de la aplicación
 */
import React, { useState, useEffect } from 'react';
import { Typography, Card, Row, Col, Divider, Button, message } from 'antd';
import { 
  ThunderboltOutlined, 
  ReloadOutlined, 
  ClearOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import MainLayout from '../components/layout/MainLayout';
import PerformancePanel from '../components/organisms/PerformancePanel';
import PerformanceMonitor from '../components/molecules/PerformanceMonitor';
import OptimizedTable from '../components/molecules/OptimizedTable';
import { usePerformance } from '../context/PerformanceContext';
import { cacheService } from '../services/cacheService';

const { Title, Text, Paragraph } = Typography;

/**
 * Página de configuración y monitoreo de rendimiento
 * @returns {JSX.Element} Página de rendimiento
 */
const Rendimiento = () => {
  const { updateConfig } = usePerformance();
  const [testData, setTestData] = useState([]);
  
  // Generar datos de prueba para la tabla optimizada
  useEffect(() => {
    generateTestData(100);
  }, []);
  
  /**
   * Genera datos de prueba para la tabla
   * @param {number} count - Número de elementos a generar
   */
  const generateTestData = (count) => {
    const data = [];
    for (let i = 0; i < count; i++) {
      data.push({
        id: i,
        nombre: `Elemento ${i}`,
        valor: Math.floor(Math.random() * 1000),
        fecha: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
        estado: ['Activo', 'Inactivo', 'Pendiente'][Math.floor(Math.random() * 3)]
      });
    }
    setTestData(data);
  };
  
  /**
   * Limpia la caché de la aplicación
   */
  const handleClearCache = () => {
    cacheService.clear();
    message.success('Caché limpiada correctamente');
  };
  
  /**
   * Reinicia las métricas de rendimiento
   */
  const handleResetMetrics = () => {
    // Recargar la página para reiniciar las métricas
    window.location.reload();
  };
  
  /**
   * Aplica la configuración de rendimiento óptima
   */
  const handleOptimizeAll = () => {
    updateConfig({
      memoization: true,
      cache: {
        enabled: true,
        ttl: 60000 // 1 minuto
      },
      polling: {
        enabled: true,
        interval: 30000 // 30 segundos
      },
      virtualization: {
        enabled: true,
        threshold: 50
      }
    });
    message.success('Configuración óptima aplicada');
  };
  
  // Columnas para la tabla de prueba
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
    },
    {
      title: 'Valor',
      dataIndex: 'valor',
      key: 'valor',
      sorter: (a, b) => a.valor - b.valor,
    },
    {
      title: 'Fecha',
      dataIndex: 'fecha',
      key: 'fecha',
      render: (fecha) => fecha.toLocaleDateString(),
      sorter: (a, b) => a.fecha - b.fecha,
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      filters: [
        { text: 'Activo', value: 'Activo' },
        { text: 'Inactivo', value: 'Inactivo' },
        { text: 'Pendiente', value: 'Pendiente' },
      ],
      onFilter: (value, record) => record.estado === value,
    },
  ];

  return (
    <MainLayout
      title="Rendimiento"
      icon={<ThunderboltOutlined />}
      breadcrumbs={[
        { path: '/', breadcrumbName: 'Inicio' },
        { path: '/rendimiento', breadcrumbName: 'Rendimiento' },
      ]}
    >
      <div className="rendimiento-page">
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card>
              <Title level={3}>
                <ThunderboltOutlined /> Configuración de Rendimiento
              </Title>
              <Paragraph>
                Esta página permite monitorear y ajustar el rendimiento de la aplicación.
                Utilice las diferentes opciones para optimizar la experiencia del usuario.
              </Paragraph>
              
              <Row gutter={16}>
                <Col xs={24} sm={8}>
                  <Button 
                    type="primary" 
                    icon={<ThunderboltOutlined />} 
                    onClick={handleOptimizeAll}
                    block
                  >
                    Optimizar Todo
                  </Button>
                </Col>
                <Col xs={24} sm={8}>
                  <Button 
                    icon={<ClearOutlined />} 
                    onClick={handleClearCache}
                    block
                  >
                    Limpiar Caché
                  </Button>
                </Col>
                <Col xs={24} sm={8}>
                  <Button 
                    icon={<ReloadOutlined />} 
                    onClick={handleResetMetrics}
                    block
                  >
                    Reiniciar Métricas
                  </Button>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        
        <Divider />
        
        <PerformanceMonitor />
        
        <Divider />
        
        <PerformancePanel />
        
        <Divider />
        
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card 
              title={
                <div>
                  <BarChartOutlined /> Prueba de Tabla Optimizada
                </div>
              }
              extra={
                <div>
                  <Button 
                    onClick={() => generateTestData(100)}
                    style={{ marginRight: 8 }}
                  >
                    100 filas
                  </Button>
                  <Button 
                    onClick={() => generateTestData(1000)}
                    style={{ marginRight: 8 }}
                  >
                    1,000 filas
                  </Button>
                  <Button 
                    onClick={() => generateTestData(10000)}
                  >
                    10,000 filas
                  </Button>
                </div>
              }
            >
              <Text type="secondary" style={{ marginBottom: 16, display: 'block' }}>
                Esta tabla utiliza virtualización para mejorar el rendimiento con grandes conjuntos de datos.
                Pruebe a generar diferentes cantidades de filas para ver cómo afecta al rendimiento.
              </Text>
              
              <OptimizedTable 
                dataSource={testData}
                columns={columns}
                rowKey="id"
                scroll={{ y: 400 }}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </MainLayout>
  );
};

export default Rendimiento;
