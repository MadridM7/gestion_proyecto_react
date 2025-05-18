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
      // Obtener fechas únicas usando Set para eliminar duplicados
      const uniqueDates = [...new Set(ventas.map(venta => {
        const date = new Date(venta.fechaHora);
        return moment(date).format('YYYY-MM-DD');
      }))];
      setAvailableDates(uniqueDates);
      
      // Obtener meses únicos usando Set para eliminar duplicados
      const uniqueMonths = [...new Set(ventas.map(venta => {
        const date = new Date(venta.fechaHora);
        return moment(date).format('YYYY-MM');
      }))];
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
    // Validar que se haya seleccionado una opción si es necesario
    if (reportType === 'ventasdiarias' && !selectedDate) {
      message.warning('Por favor selecciona una fecha específica');
      return;
    }
    
    if (reportType === 'ventasmensual' && !selectedMonth) {
      message.warning('Por favor selecciona un mes específico');
      return;
    }
    
    if (reportType === 'ventasporusuario' && !selectedUser) {
      message.warning('Por favor selecciona un usuario');
      return;
    }
    
    // Construir mensaje de confirmación usando template literals
    let confirmMessage = `Generando reporte de ${reportType}`;
    
    if (selectedDate && reportType === 'ventasdiarias') {
      confirmMessage += ` para el día ${moment(selectedDate).format('DD/MM/YYYY')}`;
    }
    
    if (selectedMonth && reportType === 'ventasmensual') {
      confirmMessage += ` para el mes de ${moment(selectedMonth).format('MMMM YYYY')}`;
    }
    
    if (selectedUser && reportType === 'ventasporusuario') {
      // Usar find con arrow function para buscar el usuario por ID
      const usuario = usuarios.find(u => u.id === selectedUser);
      if (usuario) {
        confirmMessage += ` para ${usuario.nombre}`;
      }
    }
    
    // Usar Promise chaining para mostrar mensajes
    message.loading(`${confirmMessage}...`, 1)
      .then(() => {
        message.success(`${confirmMessage} descargado en formato ${format.toUpperCase()}`)
      });
    
    console.log(`Descargando reporte ${reportType} en formato ${format}`);
    // Aquí iría la lógica real para generar y descargar el reporte
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
