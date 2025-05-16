/**
 * @fileoverview Página de reportes que muestra cards con descripciones de los reportes disponibles
 * y opciones para descargarlos en diferentes formatos
 */
import React from 'react';
import { Row, Col, Card, Alert, Button, Space, Typography, message } from 'antd';
import { 
  DownloadOutlined, 
  FileExcelOutlined, 
  FilePdfOutlined, 
  BarChartOutlined, 
  PieChartOutlined, 
  LineChartOutlined, 
  TableOutlined, 
  CalendarOutlined 
} from '@ant-design/icons';
import MainLayout from '../components/layout/MainLayout';
import { useVentas } from '../context/VentasContext';

// Extraemos los componentes necesarios de Typography
const { Paragraph } = Typography;

/**
 * Página de reportes y estadísticas que permite descargar informes en diferentes formatos
 * Diseñado para ser completamente responsivo en dispositivos móviles, tablets y desktops
 * @returns {JSX.Element} Página de Reportes con cards descriptivas
 */
const Reportes = () => {
  // Obtenemos los datos de ventas del contexto
  const { ventas } = useVentas();
  
  /**
   * Verifica si hay datos disponibles para generar reportes
   * @type {boolean}
   */
  const hayDatos = ventas.length > 0;
  
  /**
   * Maneja la descarga de reportes en diferentes formatos
   * @param {string} reportType - Tipo de reporte a descargar
   * @param {string} format - Formato del reporte (excel, pdf, csv)
   */
  const handleDownload = (reportType, format) => {
    // Mostrar mensaje de carga
    message.loading(`Generando reporte de ${reportType}...`, 1)
      .then(() => {
        // Simular éxito de descarga
        message.success(`Reporte de ${reportType} descargado en formato ${format.toUpperCase()}`)
      });
    
    console.log(`Descargando reporte ${reportType} en formato ${format}`);
    // Aquí iría la lógica real para generar y descargar el reporte
  };
  
  return (
    <MainLayout currentPage="Reportes">
      {/* Encabezado de la página */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0 }}>Reportes y Estadísticas</h1>
        <p style={{ color: 'rgba(0, 0, 0, 0.45)' }}>
          Descarga informes detallados de las ventas y tendencias
        </p>
      </div>
      
      {/* Alerta condicional que se muestra solo cuando no hay datos suficientes */}
      {!hayDatos && (
        <Alert
          message="No hay datos suficientes"
          description="Los reportes están disponibles pero pueden no contener información completa hasta que haya más datos disponibles."
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}
      
      {/* Primera fila de cards de reportes */}
      <Row gutter={[16, 16]}>
        {/* Card de Reporte de Ventas Diarias */}
        <Col xs={24} md={12} lg={8}>
          <Card 
            hoverable
            style={{ height: '100%', marginBottom: 16 }} // Altura uniforme y margen para separación en móviles
            className="report-card" // Clase para estilos adicionales en CSS
            cover={
              <div style={{ 
                background: '#1890ff', 
                height: 120, 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                color: 'white',
                borderTopLeftRadius: '8px', // Bordes redondeados para mejor estética
                borderTopRightRadius: '8px'
              }}>
                <BarChartOutlined style={{ fontSize: 48 }} />
              </div>
            }
          >
            <Card.Meta
              title="Reporte de Ventas Diarias"
              description={
                <>
                  <Paragraph>
                    Este reporte incluye un análisis detallado de las ventas realizadas en los últimos 7 días, 
                    agrupadas por día, con totales y promedios.
                  </Paragraph>
                  {/* Botones de descarga en formato vertical para mejor UX */}
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Button 
                      icon={<FileExcelOutlined />} 
                      onClick={() => handleDownload('ventas-diarias', 'excel')}
                      disabled={!hayDatos}
                      block
                      className="download-button"
                    >
                      Descargar Excel
                    </Button>
                    <Button 
                      icon={<FilePdfOutlined />} 
                      onClick={() => handleDownload('ventas-diarias', 'pdf')}
                      disabled={!hayDatos}
                      block
                      className="download-button"
                    >
                      Descargar PDF
                    </Button>
                  </Space>
                </>
              }
            />
          </Card>
        </Col>
        
        {/* Card de Reporte de Tendencias */}
        <Col xs={24} md={12} lg={8}>
          <Card 
            hoverable
            style={{ height: '100%', marginBottom: 16 }}
            className="report-card"
            cover={
              <div style={{ 
                background: '#52c41a', 
                height: 120, 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                color: 'white',
                borderTopLeftRadius: '8px',
                borderTopRightRadius: '8px'
              }}>
                <LineChartOutlined style={{ fontSize: 48 }} />
              </div>
            }
          >
            <Card.Meta
              title="Reporte de Tendencias"
              description={
                <>
                  <Paragraph>
                    Análisis de tendencias de ventas por períodos (diario, semanal, mensual) con 
                    comparativas y proyecciones.
                  </Paragraph>
                  {/* Botones de descarga en formato vertical */}
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Button 
                      icon={<FileExcelOutlined />} 
                      onClick={() => handleDownload('tendencias', 'excel')}
                      disabled={!hayDatos}
                      block
                      className="download-button"
                    >
                      Descargar Excel
                    </Button>
                    <Button 
                      icon={<FilePdfOutlined />} 
                      onClick={() => handleDownload('tendencias', 'pdf')}
                      disabled={!hayDatos}
                      block
                      className="download-button"
                    >
                      Descargar PDF
                    </Button>
                  </Space>
                </>
              }
            />
          </Card>
        </Col>
        
        {/* Card de Reporte de Vendedores */}
        <Col xs={24} md={12} lg={8}>
          <Card 
            hoverable
            style={{ height: '100%', marginBottom: 16 }}
            className="report-card"
            cover={
              <div style={{ 
                background: '#722ed1', 
                height: 120, 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                color: 'white',
                borderTopLeftRadius: '8px',
                borderTopRightRadius: '8px'
              }}>
                <TableOutlined style={{ fontSize: 48 }} />
              </div>
            }
          >
            <Card.Meta
              title="Reporte de Vendedores"
              description={
                <>
                  <Paragraph>
                    Desempeño detallado de cada vendedor, incluyendo total de ventas, 
                    promedio, y porcentaje de participación.
                  </Paragraph>
                  {/* Botones de descarga en formato vertical */}
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Button 
                      icon={<FileExcelOutlined />} 
                      onClick={() => handleDownload('vendedores', 'excel')}
                      disabled={!hayDatos}
                      block
                      className="download-button"
                    >
                      Descargar Excel
                    </Button>
                    <Button 
                      icon={<FilePdfOutlined />} 
                      onClick={() => handleDownload('vendedores', 'pdf')}
                      disabled={!hayDatos}
                      block
                      className="download-button"
                    >
                      Descargar PDF
                    </Button>
                  </Space>
                </>
              }
            />
          </Card>
        </Col>
      </Row>
      
      {/* Segunda fila de cards de reportes */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {/* Card de Reporte de Métodos de Pago */}
        <Col xs={24} md={12} lg={8}>
          <Card 
            hoverable
            style={{ height: '100%', marginBottom: 16 }}
            className="report-card"
            cover={
              <div style={{ 
                background: '#fa8c16', 
                height: 120, 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                color: 'white',
                borderTopLeftRadius: '8px',
                borderTopRightRadius: '8px'
              }}>
                <PieChartOutlined style={{ fontSize: 48 }} />
              </div>
            }
          >
            <Card.Meta
              title="Reporte de Métodos de Pago"
              description={
                <>
                  <Paragraph>
                    Análisis de ventas por método de pago (efectivo, débito, crédito) 
                    con porcentajes y comparativas.
                  </Paragraph>
                  {/* Botones de descarga en formato vertical */}
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Button 
                      icon={<FileExcelOutlined />} 
                      onClick={() => handleDownload('metodos-pago', 'excel')}
                      disabled={!hayDatos}
                      block
                      className="download-button"
                      aria-label="Descargar reporte en Excel"
                    >
                      Descargar Excel
                    </Button>
                    <Button 
                      icon={<FilePdfOutlined />} 
                      onClick={() => handleDownload('metodos-pago', 'pdf')}
                      disabled={!hayDatos}
                      block
                      className="download-button"
                      aria-label="Descargar reporte en PDF"
                    >
                      Descargar PDF
                    </Button>
                  </Space>
                </>
              }
            />
          </Card>
        </Col>
        
        {/* Card de Reporte Mensual Consolidado */}
        <Col xs={24} md={12} lg={8}>
          <Card 
            hoverable
            style={{ height: '100%', marginBottom: 16 }}
            className="report-card"
            cover={
              <div style={{ 
                background: '#eb2f96', 
                height: 120, 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                color: 'white',
                borderTopLeftRadius: '8px',
                borderTopRightRadius: '8px'
              }}>
                <CalendarOutlined style={{ fontSize: 48 }} />
              </div>
            }
          >
            <Card.Meta
              title="Reporte Mensual Consolidado"
              description={
                <>
                  <Paragraph>
                    Informe mensual completo con todas las métricas importantes, 
                    resumen ejecutivo y proyecciones.
                  </Paragraph>
                  {/* Botones de descarga en formato vertical */}
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Button 
                      icon={<FileExcelOutlined />} 
                      onClick={() => handleDownload('mensual', 'excel')}
                      disabled={!hayDatos}
                      block
                      className="download-button"
                      aria-label="Descargar reporte mensual en Excel"
                    >
                      Descargar Excel
                    </Button>
                    <Button 
                      icon={<FilePdfOutlined />} 
                      onClick={() => handleDownload('mensual', 'pdf')}
                      disabled={!hayDatos}
                      block
                      className="download-button"
                      aria-label="Descargar reporte mensual en PDF"
                    >
                      Descargar PDF
                    </Button>
                  </Space>
                </>
              }
            />
          </Card>
        </Col>
        
        {/* Card de Exportar Datos Completos */}
        <Col xs={24} md={12} lg={8}>
          <Card 
            hoverable
            style={{ height: '100%', marginBottom: 16 }}
            className="report-card"
            cover={
              <div style={{ 
                background: '#f5222d', 
                height: 120, 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                color: 'white',
                borderTopLeftRadius: '8px',
                borderTopRightRadius: '8px'
              }}>
                <DownloadOutlined style={{ fontSize: 48 }} />
              </div>
            }
          >
            <Card.Meta
              title="Exportar Datos Completos"
              description={
                <>
                  <Paragraph>
                    Exportación completa de todos los datos de ventas en formato crudo 
                    para análisis personalizado.
                  </Paragraph>
                  {/* Botones de descarga en formato vertical */}
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Button 
                      icon={<FileExcelOutlined />} 
                      onClick={() => handleDownload('datos-completos', 'excel')}
                      disabled={!hayDatos}
                      block
                      className="download-button"
                      aria-label="Descargar datos completos en Excel"
                    >
                      Descargar Excel
                    </Button>
                    <Button 
                      icon={<FilePdfOutlined />} 
                      onClick={() => handleDownload('datos-completos', 'pdf')}
                      disabled={!hayDatos}
                      block
                      className="download-button"
                      aria-label="Descargar datos completos en PDF"
                    >
                      Descargar PDF
                    </Button>
                  </Space>
                </>
              }
            />
          </Card>
        </Col>
      </Row>
    </MainLayout>
  );
};

export default Reportes;
