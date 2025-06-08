/**
 * @fileoverview Componente molecular para mostrar un panel de bienvenida con información contextual
 * Forma parte del patrón Atomic Design como un componente molecular
 */
import React from 'react';
import { Card, Typography, Space, Button, Divider, Row, Col } from 'antd';
import { ClockCircleOutlined, BulbOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { useTimeRange } from '../../context/TimeRangeContext';

// Importar estilos
import '../../styles/components/molecules/WelcomePanel.css';

const { Title, Text, Paragraph } = Typography;

/**
 * Componente que muestra un panel de bienvenida con información contextual y accesos rápidos
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.usuario - Información del usuario actual
 * @param {Array} props.shortcuts - Lista de accesos rápidos para mostrar
 * @param {Function} props.onActionClick - Función a ejecutar cuando se hace clic en un acceso rápido
 * @returns {JSX.Element} Panel de bienvenida
 */
const WelcomePanel = ({ usuario = {}, shortcuts = [], onActionClick }) => {
  // Obtenemos el rango de tiempo seleccionado del contexto
  const { timeRange } = useTimeRange();
  
  // Configuración de idioma español para fechas
  dayjs.locale('es');
  
  // Determinamos el saludo según la hora del día
  const obtenerSaludo = () => {
    const hora = dayjs().hour();
    
    if (hora >= 5 && hora < 12) return 'Buenos días';
    if (hora >= 12 && hora < 20) return 'Buenas tardes';
    return 'Buenas noches';
  };
  
  // Determinamos el mensaje según el rango de tiempo seleccionado
  const obtenerMensajeContextual = () => {
    if (!timeRange) return '';
    
    const { type, startDate, endDate } = timeRange;
    
    switch (type) {
      case 'today':
        return 'Estás visualizando los datos de hoy.';
      case 'yesterday':
        return 'Estás visualizando los datos de ayer.';
      case 'week':
        return 'Estás visualizando los datos de la semana actual.';
      case 'month':
        return 'Estás visualizando los datos del mes actual.';
      case 'year':
        return 'Estás visualizando los datos del año actual.';
      case 'custom':
        return `Estás visualizando datos desde ${dayjs(startDate).format('D MMM')} hasta ${dayjs(endDate).format('D MMM YYYY')}.`;
      default:
        return '';
    }
  };
  
  // Fecha actual formateada
  const fechaActual = dayjs().format('dddd, D [de] MMMM [de] YYYY');
  
  return (
    <Card className="welcome-panel">
      <Row gutter={[24, 16]} align="middle">
        <Col xs={24} md={14} lg={16}>
          <div className="welcome-content">
            <Title level={4} className="welcome-greeting">
              {obtenerSaludo()}, {usuario.nombre || 'Usuario'}
            </Title>
            <Paragraph className="welcome-date">
              <ClockCircleOutlined /> {fechaActual}
            </Paragraph>
            <Text type="secondary" className="welcome-context">
              <BulbOutlined /> {obtenerMensajeContextual()}
            </Text>
          </div>
        </Col>
        
        <Col xs={24} md={10} lg={8}>
          <div className="welcome-shortcuts">
            <Text strong>Accesos Rápidos</Text>
            <Divider className="shortcuts-divider" />
            <Space direction="vertical" style={{ width: '100%' }}>
              {shortcuts.map((shortcut, index) => (
                <Button 
                  key={index}
                  icon={shortcut.icon}
                  type={shortcut.primary ? 'primary' : 'default'}
                  block
                  onClick={() => onActionClick && onActionClick(shortcut)}
                >
                  {shortcut.label}
                </Button>
              ))}
              {shortcuts.length === 0 && (
                <Text type="secondary" italic>No hay accesos rápidos disponibles</Text>
              )}
            </Space>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default WelcomePanel;
