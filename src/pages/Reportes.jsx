/**
 * @fileoverview Página de reportes que muestra estadísticas y permite generar informes
 * Implementada siguiendo la metodología Atomic Design
 */
import React, { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import MainLayout from '../components/layout/MainLayout';
import ReportesTemplate from '../components/templates/ReportesTemplate';
import { useVentas } from '../context/VentasContext';
import { useUsuarios } from '../context/UsuariosContext';
import { useProductos } from '../context/ProductosContext';

// Importar servicios de exportación
import { 
  exportarVentasDiarias,
  exportarVentasSemanales,
  exportarVentasMensuales,
  exportarReporteCompleto,
  exportarReporteProductos,
  exportarVentasPorUsuario
} from '../services/reportExport';

// Importar estilos CSS
import '../styles/pages/Reportes.css';

// Función auxiliar para formatear fechas
const formatDate = (date) => {
  if (!date) return '';
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
};

/**
 * Página de reportes y estadísticas que permite visualizar y descargar informes
 * @returns {JSX.Element} Página de Reportes con estadísticas y opciones de descarga
 */
const Reportes = () => {
  // Obtener datos de los contextos
  const { ventas, loading: loadingVentas } = useVentas();
  const { usuarios } = useUsuarios();
  const { productos } = useProductos();
  
  // Estados para los filtros y fechas por tipo de reporte
  const [dailyDate, setDailyDate] = useState(new Date());
  const [weeklyDate, setWeeklyDate] = useState(new Date());
  const [monthlyDate, setMonthlyDate] = useState(new Date());
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Estados para las estadísticas
  const [keyStats, setKeyStats] = useState({
    totalVentas: 0,
    ingresosTotales: 0,
    gananciaNeta: 0,
    vendedoresActivos: 0
  });
  const [paymentStats, setPaymentStats] = useState([]);
  const [topSellers, setTopSellers] = useState([]);
  
  /**
   * Genera estadísticas clave basadas en las ventas
   */
  const generateKeyStats = useCallback(() => {
    if (!ventas || ventas.length === 0) return;
    
    // Calcular estadísticas básicas
    const totalVentas = ventas.length;
    const ingresosTotales = ventas.reduce((sum, venta) => sum + (venta.monto || 0), 0);
    
    // Calcular ganancia neta (estimada como 30% de los ingresos si no hay datos de productos)
    let gananciaNeta = 0;
    if (productos && productos.length > 0) {
      ventas.forEach(venta => {
        const producto = productos.find(p => p.nombre === venta.producto);
        const precioCompra = producto ? producto.precioCompra : (venta.monto * 0.7); // Estimado
        gananciaNeta += (venta.monto || 0) - precioCompra;
      });
    } else {
      // Si no hay datos de productos, estimar ganancia como 30% de ingresos
      gananciaNeta = ingresosTotales * 0.3;
    }
    
    // Calcular vendedores activos (únicos) usando el nombre del vendedor
    const vendedoresUnicos = new Set();
    ventas.forEach(venta => {
      if (venta.vendedor) {
        vendedoresUnicos.add(venta.vendedor);
      }
    });
    
    console.log('Vendedores únicos:', [...vendedoresUnicos]);
    console.log('Total de vendedores activos:', vendedoresUnicos.size);
    
    setKeyStats({
      totalVentas,
      ingresosTotales,
      gananciaNeta,
      vendedoresActivos: vendedoresUnicos.size
    });
  }, [ventas, productos]);
  
  /**
   * Genera estadísticas de pagos basadas en las ventas
   */
  const generatePaymentStats = useCallback(() => {
    if (!ventas || ventas.length === 0) return;
    
    const paymentMethods = {};
    
    ventas.forEach(venta => {
      // Normalizar el tipo de pago (convertir a minúsculas y capitalizar primera letra)
      let tipoPago = (venta.tipoPago || 'efectivo').toLowerCase();
      tipoPago = tipoPago.charAt(0).toUpperCase() + tipoPago.slice(1);
      
      if (!paymentMethods[tipoPago]) {
        paymentMethods[tipoPago] = {
          method: tipoPago,
          amount: 0,
          count: 0
        };
      }
      paymentMethods[tipoPago].amount += venta.monto || 0;
      paymentMethods[tipoPago].count += 1;
    });
    
    // Convertir a array y ordenar por monto
    const paymentStatsArray = Object.values(paymentMethods)
      .sort((a, b) => b.amount - a.amount);
    
    console.log('Payment stats:', paymentStatsArray);
    setPaymentStats(paymentStatsArray);
  }, [ventas]);
  
  /**
   * Genera estadísticas de mejores vendedores basadas en las ventas
   */
  const generateTopSellers = useCallback(() => {
    if (!ventas || ventas.length === 0) return;
    
    const sellers = {};
    
    ventas.forEach(venta => {
      // Usar el nombre del vendedor como identificador
      const nombreVendedor = venta.vendedor || 'Desconocido';
      const vendedorKey = nombreVendedor.toLowerCase().replace(/\s+/g, '_');
      
      if (!sellers[vendedorKey]) {
        sellers[vendedorKey] = {
          id: vendedorKey,
          name: nombreVendedor,
          sales: 0,
          count: 0
        };
      }
      sellers[vendedorKey].sales += venta.monto || 0;
      sellers[vendedorKey].count += 1;
    });
    
    // Convertir a array, ordenar por ventas y limitar a los 5 mejores
    const topSellersList = Object.values(sellers)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5)
      .map(seller => ({
        ...seller,
        // Mantenemos el valor numérico para ordenar pero añadimos el formato para mostrar
        salesFormatted: new Intl.NumberFormat('es-CL', {
          style: 'currency',
          currency: 'CLP',
          minimumFractionDigits: 0
        }).format(seller.sales)
      }));
      
    console.log('Top sellers:', topSellersList);
    setTopSellers(topSellersList);
  }, [ventas]);
  
  /**
   * Inicializa el ID de usuario seleccionado cuando los usuarios están disponibles
   */
  useEffect(() => {
    if (usuarios && usuarios.length > 0 && !selectedUserId) {
      setSelectedUserId(usuarios[0].id);
    }
  }, [usuarios, selectedUserId]);
  
  /**
   * Genera todas las estadísticas cuando cambian los datos
   */
  useEffect(() => {
    setLoading(loadingVentas);
    
    if (!loadingVentas && ventas && ventas.length > 0) {
      generateKeyStats();
      generatePaymentStats();
      generateTopSellers();
    }
  }, [loadingVentas, ventas, generateKeyStats, generatePaymentStats, generateTopSellers]);
  
  /**
   * Manejadores para cambios de fecha
   */
  const handleDailyDateChange = (date) => {
    setDailyDate(date);
    console.log('Nueva fecha diaria:', formatDate(date));
  };
  
  const handleWeeklyDateChange = (date) => {
    setWeeklyDate(date);
    console.log('Nueva fecha semanal:', formatDate(date));
  };
  
  const handleMonthlyDateChange = (date) => {
    setMonthlyDate(date);
    console.log('Nueva fecha mensual:', formatDate(date));
  };
  
  const handleUserChange = (userId) => {
    setSelectedUserId(userId);
  };
  
  /**
   * Manejadores para generar reportes
   */
  const handleGenerateDaily = () => {
    setLoading(true);
    message.loading({ content: 'Generando reporte diario...', key: 'report' });
    
    try {
      const formattedDate = formatDate(dailyDate);
      const startOfDay = new Date(dailyDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(dailyDate);
      endOfDay.setHours(23, 59, 59, 999);
      
      // Filtrar ventas por fecha
      const filteredVentas = ventas.filter(venta => {
        const ventaDate = new Date(venta.fechaHora);
        return ventaDate >= startOfDay && ventaDate <= endOfDay;
      });
      
      // Exportar reporte
      exportarVentasDiarias(filteredVentas, productos, usuarios, dailyDate);
      message.success({ content: `Reporte diario para ${formattedDate} generado con éxito`, key: 'report' });
    } catch (error) {
      console.error('Error al generar reporte diario:', error);
      message.error({ content: 'Error al generar el reporte diario', key: 'report' });
    } finally {
      setLoading(false);
    }
  };
  
  const handleGenerateWeekly = () => {
    setLoading(true);
    message.loading({ content: 'Generando reporte semanal...', key: 'report' });
    
    try {
      const date = new Date(weeklyDate);
      // Obtener el primer día de la semana (domingo)
      const startOfWeek = new Date(date);
      startOfWeek.setDate(date.getDate() - date.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      
      // Obtener el último día de la semana (sábado)
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);
      
      // Formatear la fecha para mostrar el número de semana
      const weekNumber = Math.ceil((((date - new Date(date.getFullYear(), 0, 1)) / 86400000) + 1) / 7);
      const formattedDate = `Semana ${weekNumber} de ${date.getFullYear()}`;
      
      // Filtrar ventas por semana
      const filteredVentas = ventas.filter(venta => {
        const ventaDate = new Date(venta.fechaHora);
        return ventaDate >= startOfWeek && ventaDate <= endOfWeek;
      });
      
      // Exportar reporte
      exportarVentasSemanales(filteredVentas, productos, usuarios, weeklyDate);
      message.success({ content: `Reporte semanal para ${formattedDate} generado con éxito`, key: 'report' });
    } catch (error) {
      console.error('Error al generar reporte semanal:', error);
      message.error({ content: 'Error al generar el reporte semanal', key: 'report' });
    } finally {
      setLoading(false);
    }
  };
  
  const handleGenerateMonthly = () => {
    setLoading(true);
    message.loading({ content: 'Generando reporte mensual...', key: 'report' });
    
    try {
      const date = new Date(monthlyDate);
      // Obtener el primer día del mes
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      // Obtener el último día del mes
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      endOfMonth.setHours(23, 59, 59, 999);
      
      // Formatear la fecha para mostrar el mes y año
      const formattedDate = new Intl.DateTimeFormat('es-ES', {
        month: 'long',
        year: 'numeric'
      }).format(date);
      
      // Filtrar ventas por mes
      const filteredVentas = ventas.filter(venta => {
        const ventaDate = new Date(venta.fechaHora);
        return ventaDate >= startOfMonth && ventaDate <= endOfMonth;
      });
      
      // Exportar reporte
      exportarVentasMensuales(filteredVentas, productos, usuarios, monthlyDate);
      message.success({ content: `Reporte mensual para ${formattedDate} generado con éxito`, key: 'report' });
    } catch (error) {
      console.error('Error al generar reporte mensual:', error);
      message.error({ content: 'Error al generar el reporte mensual', key: 'report' });
    } finally {
      setLoading(false);
    }
  };
  
  const handleGenerateProducts = () => {
    setLoading(true);
    try {
      const success = exportarReporteProductos(productos);
      if (success) {
        message.success('Reporte de productos generado correctamente');
      } else {
        message.error('No hay datos para generar el reporte de productos');
      }
    } catch (error) {
      console.error('Error al generar reporte de productos:', error);
      message.error('Error al generar el reporte de productos');
    } finally {
      setLoading(false);
    }
  };
  
  const handleGenerateUserSales = () => {
    setLoading(true);
    try {
      const success = exportarVentasPorUsuario(ventas, productos, usuarios, selectedUserId);
      if (success) {
        message.success('Reporte de ventas por usuario generado correctamente');
      } else {
        message.error('No hay datos para generar el reporte de ventas por usuario');
      }
    } catch (error) {
      console.error('Error al generar reporte de ventas por usuario:', error);
      message.error('Error al generar el reporte de ventas por usuario');
    } finally {
      setLoading(false);
    }
  };
  
  const handleGenerateComplete = () => {
    setLoading(true);
    try {
      const success = exportarReporteCompleto(ventas, productos, usuarios);
      if (success) {
        message.success('Reporte completo generado correctamente');
      } else {
        message.error('No hay datos para generar el reporte completo');
      }
    } catch (error) {
      console.error('Error al generar reporte completo:', error);
      message.error('Error al generar el reporte completo');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <MainLayout currentPage="Reportes">
      <ReportesTemplate
        loading={loading}
        keyStats={keyStats}
        paymentStats={paymentStats}
        topSellers={topSellers}
        usuarios={usuarios}
        selectedUserId={selectedUserId}
        onUserChange={handleUserChange}
        dailyDate={dailyDate}
        weeklyDate={weeklyDate}
        monthlyDate={monthlyDate}
        onDailyDateChange={handleDailyDateChange}
        onWeeklyDateChange={handleWeeklyDateChange}
        onMonthlyDateChange={handleMonthlyDateChange}
        onGenerateDaily={handleGenerateDaily}
        onGenerateWeekly={handleGenerateWeekly}
        onGenerateMonthly={handleGenerateMonthly}
        onGenerateProducts={handleGenerateProducts}
        onGenerateUserSales={handleGenerateUserSales}
        onGenerateComplete={handleGenerateComplete}
      />
    </MainLayout>
  );
};

export default Reportes;
