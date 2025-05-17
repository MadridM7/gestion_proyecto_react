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

// Importar datos de reportes desde el archivo JSON
import reportesData from '../data/reportes.json';

// Importar estilos CSS
import '../styles/pages/Reportes.css';

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
  
  /**
   * Obtiene el icono correspondiente según el nombre del icono en el JSON
   * @param {string} iconName - Nombre del icono
   * @returns {JSX.Element} Componente de icono
   */
  const getIconComponent = (iconName) => {
    const iconMap = {
      'BarChartOutlined': <BarChartOutlined className="report-icon" style={{ fontSize: '72px' }} />,
      'LineChartOutlined': <LineChartOutlined className="report-icon" style={{ fontSize: '72px' }} />,
      'TableOutlined': <TableOutlined className="report-icon" style={{ fontSize: '72px' }} />,
      'PieChartOutlined': <PieChartOutlined className="report-icon" style={{ fontSize: '72px' }} />,
      'CalendarOutlined': <CalendarOutlined className="report-icon" style={{ fontSize: '72px' }} />,
      'DownloadOutlined': <DownloadOutlined className="report-icon" style={{ fontSize: '72px' }} />
    };
    return iconMap[iconName] || <BarChartOutlined className="report-icon" style={{ fontSize: '72px' }} />;
  };

  /**
   * Renderiza los botones de descarga para un reporte
   * @param {string} reportId - ID del reporte
   * @param {Array} formatos - Formatos disponibles para descarga
   * @returns {JSX.Element} Componente con botones de descarga
   */
  const renderDownloadButtons = (reportId, formatos) => {
    return (
      <Space direction="vertical" className="download-buttons-container">
        {formatos.includes('excel') && (
          <Button 
            icon={<FileExcelOutlined />} 
            onClick={() => handleDownload(reportId, 'excel')}
            disabled={!hayDatos}
            block
            className="download-button"
            aria-label={`Descargar reporte en Excel`}
          >
            Descargar Excel
          </Button>
        )}
        {formatos.includes('pdf') && (
          <Button 
            icon={<FilePdfOutlined />} 
            onClick={() => handleDownload(reportId, 'pdf')}
            disabled={!hayDatos}
            block
            className="download-button"
            aria-label={`Descargar reporte en PDF`}
          >
            Descargar PDF
          </Button>
        )}
        {formatos.includes('csv') && (
          <Button 
            icon={<DownloadOutlined />} 
            onClick={() => handleDownload(reportId, 'csv')}
            disabled={!hayDatos}
            block
            className="download-button"
            aria-label={`Descargar datos en CSV`}
          >
            Descargar CSV
          </Button>
        )}
      </Space>
    );
  };

  /**
   * Renderiza una card de reporte
   * @param {Object} reporte - Datos del reporte
   * @returns {JSX.Element} Componente Card de reporte
   */
  const renderReportCard = (reporte) => {
    const headerClass = `report-card-header ${reporte.id.toLowerCase()}-header`;
    
    return (
      <Col xs={24} md={12} lg={8} key={reporte.id}>
        <Card 
          hoverable
          className="report-card"
          cover={
            <div className={headerClass} style={{ background: reporte.color }}>
              {getIconComponent(reporte.icono)}
            </div>
          }
        >
          <Card.Meta
            title={reporte.titulo}
            description={
              <>
                <Paragraph>
                  {reporte.descripcion}
                </Paragraph>
                {renderDownloadButtons(reporte.id.toLowerCase(), reporte.formatos)}
              </>
            }
          />
        </Card>
      </Col>
    );
  };

  return (
    <MainLayout currentPage="Reportes">
      {/* Encabezado de la página */}
      <div className="reportes-header">
        <h1 className="reportes-title">Reportes y Estadísticas</h1>
        <p className="reportes-description">
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
          className="data-alert"
        />
      )}
      
      {/* Primera fila de cards de reportes */}
      <Row gutter={[16, 16]} className="reports-row">
        {reportesData.slice(0, 3).map(reporte => renderReportCard(reporte))}
      </Row>
      
      {/* Segunda fila de cards de reportes */}
      <Row gutter={[16, 16]} className="reports-row">
        {reportesData.slice(3).map(reporte => renderReportCard(reporte))}
      </Row>
    </MainLayout>
  );
};

export default Reportes;
