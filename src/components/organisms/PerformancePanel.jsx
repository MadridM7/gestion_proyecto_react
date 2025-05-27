/**
 * @fileoverview Panel de control para monitorear y ajustar el rendimiento de la aplicación
 * Permite visualizar métricas y configurar optimizaciones
 */
import React, { useState } from 'react';
import { Card, Tabs, Switch, Slider, Statistic, Row, Col, Divider, Typography, Badge, Progress } from 'antd';
import { 
  DashboardOutlined, 
  SettingOutlined, 
  ThunderboltOutlined,
  DatabaseOutlined,
  SyncOutlined,
  LineChartOutlined
} from '@ant-design/icons';
import { usePerformance } from '../../context/PerformanceContext';
import '../../styles/components/organisms/PerformancePanel.css';

const { TabPane } = Tabs;
const { Title, Text } = Typography;

/**
 * Componente organismo para el panel de rendimiento
 * @returns {JSX.Element} Panel de rendimiento con métricas y configuración
 */
const PerformancePanel = () => {
  const { metrics, config, updateConfig } = usePerformance();
  const [activeTab, setActiveTab] = useState('1');

  /**
   * Actualiza la configuración de memoización
   * @param {boolean} checked - Nuevo valor para la memoización
   */
  const handleMemoizationChange = (checked) => {
    updateConfig({ memoization: checked });
  };

  /**
   * Actualiza la configuración de caché
   * @param {boolean} checked - Nuevo valor para el caché
   */
  const handleCacheChange = (checked) => {
    updateConfig({ 
      cache: { 
        ...config.cache,
        enabled: checked 
      } 
    });
  };

  /**
   * Actualiza el tiempo de vida del caché
   * @param {number} value - Nuevo valor para el TTL en segundos
   */
  const handleCacheTTLChange = (value) => {
    updateConfig({ 
      cache: { 
        ...config.cache,
        ttl: value * 1000 // Convertir a milisegundos
      } 
    });
  };

  /**
   * Actualiza la configuración de polling
   * @param {boolean} checked - Nuevo valor para el polling
   */
  const handlePollingChange = (checked) => {
    updateConfig({ 
      polling: { 
        ...config.polling,
        enabled: checked 
      } 
    });
  };

  /**
   * Actualiza el intervalo de polling
   * @param {number} value - Nuevo valor para el intervalo en segundos
   */
  const handlePollingIntervalChange = (value) => {
    updateConfig({ 
      polling: { 
        ...config.polling,
        interval: value * 1000 // Convertir a milisegundos
      } 
    });
  };

  /**
   * Actualiza la configuración de virtualización
   * @param {boolean} checked - Nuevo valor para la virtualización
   */
  const handleVirtualizationChange = (checked) => {
    updateConfig({ 
      virtualization: { 
        ...config.virtualization,
        enabled: checked 
      } 
    });
  };

  /**
   * Actualiza el umbral de virtualización
   * @param {number} value - Nuevo valor para el umbral
   */
  const handleVirtualizationThresholdChange = (value) => {
    updateConfig({ 
      virtualization: { 
        ...config.virtualization,
        threshold: value 
      } 
    });
  };

  /**
   * Calcula el porcentaje de uso de memoria
   * @returns {number} Porcentaje de uso de memoria
   */
  const getMemoryUsagePercentage = () => {
    if (metrics.memory.totalJSHeapSize === 0) return 0;
    return Math.round((metrics.memory.usedJSHeapSize / metrics.memory.totalJSHeapSize) * 100);
  };

  /**
   * Calcula el porcentaje de aciertos de caché
   * @returns {number} Porcentaje de aciertos de caché
   */
  const getCacheHitRatio = () => {
    const total = metrics.cacheHits + metrics.cacheMisses;
    if (total === 0) return 0;
    return Math.round((metrics.cacheHits / total) * 100);
  };

  /**
   * Determina el color del indicador de FPS
   * @returns {string} Color del indicador
   */
  const getFPSStatusColor = () => {
    if (metrics.fps >= 50) return 'green';
    if (metrics.fps >= 30) return 'orange';
    return 'red';
  };

  return (
    <Card 
      className="performance-panel"
      title={
        <div className="performance-panel-title">
          <ThunderboltOutlined /> Panel de Rendimiento
        </div>
      }
    >
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane 
          tab={<span><DashboardOutlined /> Métricas</span>}
          key="1"
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Card className="metric-card">
                <Statistic
                  title={
                    <span>
                      FPS
                      <Badge 
                        status={getFPSStatusColor()} 
                        style={{ marginLeft: 8 }}
                      />
                    </span>
                  }
                  value={metrics.fps}
                  suffix="fps"
                  precision={0}
                  valueStyle={{ color: '#3f8600' }}
                  prefix={<LineChartOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Card className="metric-card">
                <Statistic
                  title="Tiempo de Carga"
                  value={metrics.loadTime}
                  suffix="ms"
                  precision={0}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Card className="metric-card">
                <Statistic
                  title="Renderizados"
                  value={metrics.renderCount}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Card className="metric-card">
                <Statistic
                  title="Solicitudes de Red"
                  value={metrics.networkRequests}
                  valueStyle={{ color: '#fa8c16' }}
                />
              </Card>
            </Col>
          </Row>

          <Divider />

          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Title level={4}>Uso de Memoria</Title>
              <Progress
                percent={getMemoryUsagePercentage()}
                status="active"
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
              />
              <Text>
                {Math.round(metrics.memory.usedJSHeapSize / (1024 * 1024))} MB / 
                {Math.round(metrics.memory.totalJSHeapSize / (1024 * 1024))} MB
              </Text>
            </Col>
            <Col xs={24} md={12}>
              <Title level={4}>Ratio de Aciertos de Caché</Title>
              <Progress
                percent={getCacheHitRatio()}
                status="active"
                strokeColor={{
                  '0%': '#faad14',
                  '100%': '#52c41a',
                }}
              />
              <Text>
                {metrics.cacheHits} aciertos / {metrics.cacheMisses} fallos
              </Text>
            </Col>
          </Row>
        </TabPane>

        <TabPane 
          tab={<span><SettingOutlined /> Configuración</span>}
          key="2"
        >
          <Row gutter={[16, 24]}>
            <Col xs={24} md={12}>
              <Card 
                title={<span><ThunderboltOutlined /> Memoización</span>}
                className="config-card"
              >
                <div className="config-item">
                  <div className="config-label">
                    <Text strong>Habilitar Memoización</Text>
                    <Text type="secondary">Reduce re-renderizados innecesarios</Text>
                  </div>
                  <Switch 
                    checked={config.memoization} 
                    onChange={handleMemoizationChange}
                  />
                </div>
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card 
                title={<span><DatabaseOutlined /> Caché</span>}
                className="config-card"
              >
                <div className="config-item">
                  <div className="config-label">
                    <Text strong>Habilitar Caché</Text>
                    <Text type="secondary">Reduce solicitudes de red</Text>
                  </div>
                  <Switch 
                    checked={config.cache.enabled} 
                    onChange={handleCacheChange}
                  />
                </div>

                <div className="config-item">
                  <div className="config-label">
                    <Text strong>Tiempo de Vida (TTL)</Text>
                    <Text type="secondary">{config.cache.ttl / 1000} segundos</Text>
                  </div>
                  <Slider
                    min={5}
                    max={600}
                    value={config.cache.ttl / 1000}
                    onChange={handleCacheTTLChange}
                    disabled={!config.cache.enabled}
                    style={{ width: 200 }}
                  />
                </div>
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card 
                title={<span><SyncOutlined /> Polling</span>}
                className="config-card"
              >
                <div className="config-item">
                  <div className="config-label">
                    <Text strong>Habilitar Polling</Text>
                    <Text type="secondary">Actualización automática de datos</Text>
                  </div>
                  <Switch 
                    checked={config.polling.enabled} 
                    onChange={handlePollingChange}
                  />
                </div>

                <div className="config-item">
                  <div className="config-label">
                    <Text strong>Intervalo</Text>
                    <Text type="secondary">{config.polling.interval / 1000} segundos</Text>
                  </div>
                  <Slider
                    min={5}
                    max={120}
                    value={config.polling.interval / 1000}
                    onChange={handlePollingIntervalChange}
                    disabled={!config.polling.enabled}
                    style={{ width: 200 }}
                  />
                </div>
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card 
                title={<span><LineChartOutlined /> Virtualización</span>}
                className="config-card"
              >
                <div className="config-item">
                  <div className="config-label">
                    <Text strong>Habilitar Virtualización</Text>
                    <Text type="secondary">Mejora rendimiento en listas grandes</Text>
                  </div>
                  <Switch 
                    checked={config.virtualization.enabled} 
                    onChange={handleVirtualizationChange}
                  />
                </div>

                <div className="config-item">
                  <div className="config-label">
                    <Text strong>Umbral de Activación</Text>
                    <Text type="secondary">{config.virtualization.threshold} elementos</Text>
                  </div>
                  <Slider
                    min={10}
                    max={200}
                    step={10}
                    value={config.virtualization.threshold}
                    onChange={handleVirtualizationThresholdChange}
                    disabled={!config.virtualization.enabled}
                    style={{ width: 200 }}
                  />
                </div>
              </Card>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default PerformancePanel;
