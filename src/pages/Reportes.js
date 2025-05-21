/**
 * @fileoverview Página de reportes que muestra cards con descripciones de los reportes disponibles
 * y opciones para descargarlos en diferentes formatos
 */
import React, { useState, useEffect } from 'react';
import { message, Form } from 'antd';
import MainLayout from '../components/layout/MainLayout';
import { useVentas } from '../context/VentasContext';
import { useUsuarios } from '../context/UsuariosContext';
import moment from 'moment';
import ReportesTemplate from '../components/templates/ReportesTemplate';

// Importar datos de reportes desde el archivo JSON
import reportesData from '../data/reportes.json';

// Importar servicios de exportación a Excel
import { 
  exportarVentasDiarias,
  exportarVentasMensuales,
  exportarVentasPorUsuario,
  exportarReporteCompleto 
} from '../services/excelExport';

// Importar estilos CSS
import '../styles/pages/Reportes.css';

/**
 * Página de reportes y estadísticas que permite descargar informes en diferentes formatos
 * Diseñado para ser completamente responsivo en dispositivos móviles, tablets y desktops
 * @returns {JSX.Element} Página de Reportes con cards descriptivas
 */
const Reportes = () => {
  // Obtenemos los datos de ventas y usuarios de los contextos
  const { ventas } = useVentas();
  const { usuarios } = useUsuarios();
  
  // Estados para los selectores
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form] = Form.useForm();
  
  // Estados para controlar qué selector mostrar
  const [activeReport, setActiveReport] = useState(null);
  
  /**
   * Verifica si hay datos disponibles para generar reportes
   * @type {boolean}
   */
  const hayDatos = ventas.length > 0;
  
  // Obtener fechas disponibles para los reportes
  const [availableDates, setAvailableDates] = useState([]);
  const [availableMonths, setAvailableMonths] = useState([]);
  
  // Efecto para procesar las fechas disponibles
  useEffect(() => {
    if (ventas.length > 0) {
      // Obtener fechas y meses únicos usando Set para eliminar duplicados
      const uniqueDates = [...new Set(ventas.map(venta => {
        const date = new Date(venta.fechaHora);
        return moment(date).format('YYYY-MM-DD');
      }))];
      
      const uniqueMonths = [...new Set(ventas.map(venta => {
        const date = new Date(venta.fechaHora);
        return moment(date).format('YYYY-MM');
      }))];
      
      setAvailableDates(uniqueDates);
      setAvailableMonths(uniqueMonths);
    }
  }, [ventas]);
  
  /**
   * Maneja la selección de un reporte
   * @param {string} reportId - ID del reporte seleccionado
   */
  const handleReportSelection = (reportId) => {
    setActiveReport(reportId);
    // Resetear selecciones previas
    setSelectedDate(null);
    setSelectedMonth(null);
    setSelectedUser(null);
    form.resetFields();
  };
  
  /**
   * Manejador para cambios en la selección de fecha
   * @param {moment} date - Fecha seleccionada
   */
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  /**
   * Manejador para cambios en la selección de mes
   * @param {moment} month - Mes seleccionado
   */
  const handleMonthChange = (month) => {
    setSelectedMonth(month);
  };

  /**
   * Manejador para cambios en la selección de usuario
   * @param {string} userId - ID del usuario seleccionado
   */
  const handleUserChange = (userId) => {
    setSelectedUser(userId);
  };
  
  /**
   * Maneja la descarga de reportes en diferentes formatos
   * @param {string} reportType - Tipo de reporte a descargar
   * @param {string} format - Formato del reporte (excel, pdf, csv)
   */
  const handleDownload = (reportType, format) => {
    // Validaciones según el tipo de reporte
    const validationMap = {
      'ventasdiarias': { value: selectedDate, message: 'Por favor selecciona una fecha específica' },
      'ventasmensual': { value: selectedMonth, message: 'Por favor selecciona un mes específico' },
      'ventasporusuario': { value: selectedUser, message: 'Por favor selecciona un usuario' }
    };
    
    const validation = validationMap[reportType];
    if (validation && !validation.value) {
      message.warning(validation.message);
      return;
    }
    
    // Construir mensaje de confirmación
    let confirmMessage = `Generando reporte de ${reportType}`;
    
    if (selectedDate && reportType === 'ventasdiarias') {
      confirmMessage += ` para el día ${moment(selectedDate).format('DD/MM/YYYY')}`;
    }
    
    if (selectedMonth && reportType === 'ventasmensual') {
      confirmMessage += ` para el mes de ${moment(selectedMonth).format('MMMM YYYY')}`;
    }
    
    if (selectedUser && reportType === 'ventasporusuario') {
      const usuario = usuarios.find(u => u.id === selectedUser);
      if (usuario) {
        confirmMessage += ` para ${usuario.nombre}`;
      }
    }
    
    // Mostrar mensaje de carga
    const loadingMsg = message.loading(`${confirmMessage}...`);
    
    if (format === 'excel') {
      // Exportar a Excel
      try {
        const exportFunctions = {
          'ventasdiarias': () => exportarVentasDiarias(ventas, moment(selectedDate).format('YYYY-MM-DD')),
          'ventasmensual': () => exportarVentasMensuales(ventas, moment(selectedMonth).format('YYYY-MM')),
          'ventasporusuario': () => exportarVentasPorUsuario(ventas, selectedUser, usuarios),
          'completo': () => exportarReporteCompleto(ventas)
        };
        
        const exportFunction = exportFunctions[reportType.toLowerCase()];
        if (exportFunction) {
          const result = exportFunction();
          if (result) {
            setTimeout(() => {
              loadingMsg();
              message.success(`${confirmMessage} descargado en formato ${format.toUpperCase()}`);
            }, 1000);
          } else {
            loadingMsg();
            message.error('Error al generar el reporte');
          }
        }
      } catch (error) {
        console.error('Error al exportar:', error);
        loadingMsg();
        message.error('Error al generar el reporte: ' + error.message);
      }
    } else {
      // Para PDF
      setTimeout(() => {
        loadingMsg();
        message.info(`La exportación a ${format.toUpperCase()} estará disponible próximamente`);
      }, 1000);
    }
  };

  return (
    <MainLayout currentPage="Reportes">
      <ReportesTemplate
        reportes={reportesData}
        activeReport={activeReport}
        hayDatos={hayDatos}
        onSelectReport={handleReportSelection}
        onDownloadReport={handleDownload}
        form={form}
        availableDates={availableDates}
        availableMonths={availableMonths}
        usuarios={usuarios}
        onDateChange={handleDateChange}
        onMonthChange={handleMonthChange}
        onUserChange={handleUserChange}
      />
    </MainLayout>
  );
};

export default Reportes;
