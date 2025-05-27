/**
 * @fileoverview Componente para monitorear el rendimiento de la aplicación en tiempo real
 * Muestra métricas como FPS, uso de memoria y tiempo de carga
 */
import React, { useEffect } from 'react';
import { Card, Statistic, Row, Col, Progress, Typography } from 'antd';
import { 
  ThunderboltOutlined, 
  LineChartOutlined, 
  DatabaseOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { usePerformance } from '../../context/PerformanceContext';
import { useMemoized } from '../../hooks/useMemoized';
import '../../styles/components/molecules/PerformanceMonitor.css';

const { Text } = Typography;

/**
 * Componente para monitorear el rendimiento de la aplicación en tiempo real
 * @returns {JSX.Element} Monitor de rendimiento
 */
const PerformanceMonitor = () => {
  const { metrics, registerRender } = usePerformance();
  
  // Registrar renderizado del componente
  useEffect(() => {
    registerRender();
  }, [registerRender]);
  
  /**
   * Determina el color del indicador de FPS
   * @returns {string} Color del indicador
   */
  const getFPSStatusColor = () => {
    if (metrics.fps >= 50) return '#52c41a'; // Verde
    if (metrics.fps >= 30) return '#faad14'; // Amarillo
    return '#f5222d'; // Rojo
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
  
  // Memoizar los valores para evitar re-renderizados innecesarios
  const memoizedMetrics = useMemoized({
    fps: metrics.fps,
    loadTime: metrics.loadTime,
    memoryUsage: getMemoryUsagePercentage(),
    cacheHitRatio: getCacheHitRatio(),
    renderCount: metrics.renderCount,
    networkRequests: metrics.networkRequests
  }, [
    metrics.fps, 
    metrics.loadTime, 
    metrics.memory.usedJSHeapSize, 
    metrics.memory.totalJSHeapSize,
    metrics.cacheHits,
    metrics.cacheMisses,
    metrics.renderCount,
    metrics.networkRequests
  ]);
  
  return (
    <Card className="performance-monitor" title="Monitor de Rendimiento en Tiempo Real">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Statistic
            title="FPS"
            value={memoizedMetrics.fps}
            suffix="fps"
            precision={0}
            valueStyle={{ color: getFPSStatusColor() }}
            prefix={<LineChartOutlined />}
          />
          <Progress 
            percent={Math.min(100, memoizedMetrics.fps * 1.67)} // 60fps = 100%
            strokeColor={getFPSStatusColor()}
            showInfo={false}
            size="small"
          />
        </Col>
        
        <Col xs={24} sm={12} md={8}>
          <Statistic
            title="Tiempo de Carga"
            value={memoizedMetrics.loadTime}
            suffix="ms"
            precision={0}
            valueStyle={{ color: '#1890ff' }}
            prefix={<ClockCircleOutlined />}
          />
        </Col>
        
        <Col xs={24} sm={12} md={8}>
          <Statistic
            title="Uso de Memoria"
            value={memoizedMetrics.memoryUsage}
            suffix="%"
            precision={0}
            valueStyle={{ color: memoizedMetrics.memoryUsage > 80 ? '#f5222d' : '#52c41a' }}
            prefix={<DatabaseOutlined />}
          />
          <Progress 
            percent={memoizedMetrics.memoryUsage}
            strokeColor={{
              '0%': '#108ee9',
              '100%': memoizedMetrics.memoryUsage > 80 ? '#f5222d' : '#52c41a'
            }}
            showInfo={false}
            size="small"
          />
        </Col>
        
        <Col xs={24} sm={12} md={8}>
          <Statistic
            title="Ratio de Caché"
            value={memoizedMetrics.cacheHitRatio}
            suffix="%"
            precision={0}
            valueStyle={{ color: '#722ed1' }}
            prefix={<ThunderboltOutlined />}
          />
          <Progress 
            percent={memoizedMetrics.cacheHitRatio}
            strokeColor={{
              '0%': '#722ed1',
              '100%': '#52c41a'
            }}
            showInfo={false}
            size="small"
          />
        </Col>
        
        <Col xs={24} sm={12} md={8}>
          <Statistic
            title="Renderizados"
            value={memoizedMetrics.renderCount}
            valueStyle={{ color: '#fa8c16' }}
          />
          <Text type="secondary" className="metric-subtitle">
            Total de renderizados de componentes
          </Text>
        </Col>
        
        <Col xs={24} sm={12} md={8}>
          <Statistic
            title="Solicitudes de Red"
            value={memoizedMetrics.networkRequests}
            valueStyle={{ color: '#eb2f96' }}
          />
          <Text type="secondary" className="metric-subtitle">
            Aciertos: {metrics.cacheHits} | Fallos: {metrics.cacheMisses}
          </Text>
        </Col>
      </Row>
    </Card>
  );
};

export default PerformanceMonitor;
