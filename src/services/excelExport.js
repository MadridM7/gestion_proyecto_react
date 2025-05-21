/**
 * @fileoverview Servicio para exportar datos a Excel
 * Proporciona funcionalidades para generar y descargar archivos Excel
 * con diferentes tipos de reportes
 */
import * as XLSX from 'xlsx';
import moment from 'moment';

// Importar datos necesarios para reportes completos
import productosData from '../data/productos.json';
import usuariosData from '../data/usuarios.json';

/**
 * Formatea los datos de ventas para su exportación
 * @param {Array} ventas - Array de ventas a formatear
 * @param {boolean} includeDetalles - Si se deben incluir detalles adicionales
 * @returns {Array} Array de ventas formateado para exportación
 */
const formatearVentasParaExportar = (ventas, includeDetalles = false) => {
  if (!Array.isArray(ventas) || ventas.length === 0) return [];
  
  return ventas.map(venta => {
    // Asegurarse de que todos los campos existan para evitar errores
    const monto = typeof venta.monto === 'number' ? venta.monto : 0;
    const tipoPago = venta.tipoPago || '';
    const fechaHora = venta.fechaHora ? new Date(venta.fechaHora) : new Date();
    
    // Obtener información adicional del producto
    const producto = productosData.find(p => p.nombre === venta.producto);
    const precioCompra = producto ? producto.precioCompra : 0;
    const margenGanancia = producto ? producto.margenGanancia : 0;
    const categoria = producto ? producto.categoria : 'No especificada';
    
    // Datos básicos que siempre se incluyen
    const datosBasicos = {
      'ID': venta.id || '',
      'Producto': venta.producto || '',
      'Monto': monto.toLocaleString('es-ES'),
      'Tipo de Pago': tipoPago.charAt(0).toUpperCase() + tipoPago.slice(1),
      'Vendedor': venta.vendedor || '',
      'Fecha': moment(fechaHora).format('DD/MM/YYYY'),
      'Hora': moment(fechaHora).format('HH:mm')
    };
    
    // Si se solicitan detalles adicionales, incluirlos
    if (includeDetalles) {
      return {
        ...datosBasicos,
        'Categoría': categoria,
        'Precio de Compra': precioCompra.toLocaleString('es-ES'),
        'Margen (%)': margenGanancia,
        'Ganancia': (monto - precioCompra).toLocaleString('es-ES')
      };
    }
    
    return datosBasicos;
  });
};

/**
 * Formatea los datos de usuarios para su exportación
 * @param {Array} usuarios - Array de usuarios a formatear
 * @returns {Array} Array de usuarios formateado para exportación
 */
const formatearUsuariosParaExportar = (usuarios) => {
  if (!Array.isArray(usuarios) || usuarios.length === 0) return [];
  
  return usuarios.map(usuario => {
    const fechaRegistro = usuario.fechaRegistro ? new Date(usuario.fechaRegistro) : new Date();
    
    return {
      'ID': usuario.id || '',
      'Nombre': usuario.nombre || '',
      'Email': usuario.email || '',
      'Rol': usuario.rol ? usuario.rol.charAt(0).toUpperCase() + usuario.rol.slice(1) : '',
      'Fecha de Registro': moment(fechaRegistro).format('DD/MM/YYYY'),
      'Estado': usuario.activo ? 'Activo' : 'Inactivo'
    };
  });
};

/**
 * Formatea los datos de productos para su exportación
 * @param {Array} productos - Array de productos a formatear
 * @returns {Array} Array de productos formateado para exportación
 */
const formatearProductosParaExportar = (productos) => {
  if (!Array.isArray(productos) || productos.length === 0) return [];
  
  return productos.map(producto => {
    return {
      'ID': producto.id || '',
      'Nombre': producto.nombre || '',
      'Precio de Compra': producto.precioCompra ? producto.precioCompra.toLocaleString('es-ES') : '0',
      'Margen (%)': producto.margenGanancia || 0,
      'Precio de Venta': producto.precioVenta ? producto.precioVenta.toLocaleString('es-ES') : '0',
      'Categoría': producto.categoria || 'No especificada',
      'Ventas Totales': producto.ventasTotales || 0
    };
  });
};

/**
 * Genera y descarga un archivo Excel con los datos proporcionados
 * @param {Array} datos - Datos a exportar
 * @param {string} nombreArchivo - Nombre del archivo a generar
 * @param {string} nombreHoja - Nombre de la hoja de Excel (opcional)
 */
const exportarAExcel = (datos, nombreArchivo, nombreHoja = 'Datos') => {
  try {
    // Verificar si hay datos para exportar
    if (!datos || datos.length === 0) {
      console.error('No hay datos para exportar');
      return;
    }
    
    // Crear una nueva hoja de trabajo
    const worksheet = XLSX.utils.json_to_sheet(datos);
    
    // Ajustar ancho de columnas automáticamente
    const columnas = Object.keys(datos[0]);
    const anchoColumnas = {};
    
    // Calcular ancho máximo para cada columna
    datos.forEach(fila => {
      columnas.forEach(col => {
        const valor = String(fila[col] || '');
        const longitud = valor.length;
        anchoColumnas[col] = Math.max(anchoColumnas[col] || 0, longitud);
      });
    });
    
    // Establecer ancho de columnas
    worksheet['!cols'] = columnas.map(col => ({
      wch: Math.min(Math.max(anchoColumnas[col], col.length) + 2, 50) // Limitar a 50 caracteres
    }));
    
    // Crear un nuevo libro de trabajo y añadir la hoja de trabajo
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, nombreHoja);
    
    // Generar el archivo Excel y descargarlo
    XLSX.writeFile(workbook, `${nombreArchivo}.xlsx`);
    
    console.log(`Archivo Excel '${nombreArchivo}.xlsx' generado correctamente`);
    return true;
  } catch (error) {
    console.error('Error al exportar a Excel:', error);
    return false;
  }
};

/**
 * Genera y descarga un archivo Excel con múltiples hojas
 * @param {Object} hojas - Objeto con nombres de hojas y sus datos
 * @param {string} nombreArchivo - Nombre del archivo a generar
 */
const exportarMultiplesHojas = (hojas, nombreArchivo) => {
  try {
    // Verificar si hay datos para exportar
    if (!hojas || Object.keys(hojas).length === 0) {
      console.error('No hay datos para exportar');
      return;
    }
    
    // Crear un nuevo libro de trabajo
    const workbook = XLSX.utils.book_new();
    
    // Añadir cada hoja al libro
    Object.entries(hojas).forEach(([nombreHoja, datos]) => {
      if (datos && datos.length > 0) {
        const worksheet = XLSX.utils.json_to_sheet(datos);
        
        // Ajustar ancho de columnas automáticamente
        const columnas = Object.keys(datos[0]);
        const anchoColumnas = {};
        
        // Calcular ancho máximo para cada columna
        datos.forEach(fila => {
          columnas.forEach(col => {
            const valor = String(fila[col] || '');
            const longitud = valor.length;
            anchoColumnas[col] = Math.max(anchoColumnas[col] || 0, longitud);
          });
        });
        
        // Establecer ancho de columnas
        worksheet['!cols'] = columnas.map(col => ({
          wch: Math.min(Math.max(anchoColumnas[col], col.length) + 2, 50) // Limitar a 50 caracteres
        }));
        
        XLSX.utils.book_append_sheet(workbook, worksheet, nombreHoja);
      }
    });
    
    // Generar el archivo Excel y descargarlo
    XLSX.writeFile(workbook, `${nombreArchivo}.xlsx`);
    
    console.log(`Archivo Excel '${nombreArchivo}.xlsx' con múltiples hojas generado correctamente`);
    return true;
  } catch (error) {
    console.error('Error al exportar a Excel:', error);
    return false;
  }
};

/**
 * Exporta un reporte de ventas diarias para una fecha específica
 * @param {Array} ventas - Array de todas las ventas
 * @param {string} fecha - Fecha en formato YYYY-MM-DD
 */
export const exportarVentasDiarias = (ventas, fecha) => {
  // Filtrar ventas por la fecha seleccionada
  const ventasFiltradas = ventas.filter(venta => {
    const fechaVenta = moment(venta.fechaHora).format('YYYY-MM-DD');
    return fechaVenta === fecha;
  });
  
  // Formatear los datos para la exportación con detalles adicionales
  const datosFormateados = formatearVentasParaExportar(ventasFiltradas, true);
  
  // Nombre del archivo con la fecha
  const nombreArchivo = `Ventas_${moment(fecha).format('DD-MM-YYYY')}`;
  const nombreHoja = `Ventas ${moment(fecha).format('DD-MM-YYYY')}`;
  
  // Exportar a Excel
  return exportarAExcel(datosFormateados, nombreArchivo, nombreHoja);
};

/**
 * Exporta un reporte de ventas mensuales para un mes específico
 * @param {Array} ventas - Array de todas las ventas
 * @param {string} mes - Mes en formato YYYY-MM
 */
export const exportarVentasMensuales = (ventas, mes) => {
  // Filtrar ventas por el mes seleccionado
  const ventasFiltradas = ventas.filter(venta => {
    const mesVenta = moment(venta.fechaHora).format('YYYY-MM');
    return mesVenta === mes;
  });
  
  // Agrupar ventas por día para análisis
  const ventasPorDia = {};
  ventasFiltradas.forEach(venta => {
    const fechaVenta = moment(venta.fechaHora).format('YYYY-MM-DD');
    if (!ventasPorDia[fechaVenta]) {
      ventasPorDia[fechaVenta] = [];
    }
    ventasPorDia[fechaVenta].push(venta);
  });
  
  // Crear resumen diario
  const resumenDiario = Object.entries(ventasPorDia).map(([fecha, ventas]) => {
    const totalVentas = ventas.length;
    const montoTotal = ventas.reduce((sum, venta) => sum + (venta.monto || 0), 0);
    
    return {
      'Fecha': moment(fecha).format('DD/MM/YYYY'),
      'Total Ventas': totalVentas,
      'Monto Total': montoTotal.toLocaleString('es-ES'),
      'Promedio por Venta': (montoTotal / totalVentas).toLocaleString('es-ES')
    };
  });
  
  // Formatear los datos detallados para la exportación
  const datosDetallados = formatearVentasParaExportar(ventasFiltradas, true);
  
  // Nombre del archivo con el mes
  const nombreArchivo = `Ventas_${moment(mes).format('MM-YYYY')}`;
  
  // Exportar a Excel con múltiples hojas
  return exportarMultiplesHojas({
    [`Resumen ${moment(mes).format('MMMM-YYYY')}`]: resumenDiario,
    [`Detalle ${moment(mes).format('MMMM-YYYY')}`]: datosDetallados
  }, nombreArchivo);
};

/**
 * Exporta un reporte de ventas por usuario
 * @param {Array} ventas - Array de todas las ventas
 * @param {string} usuarioId - ID del usuario
 * @param {Array} usuarios - Array de todos los usuarios
 */
export const exportarVentasPorUsuario = (ventas, usuarioId, usuarios) => {
  // Encontrar el nombre del usuario
  const usuario = usuarios.find(u => u.id === usuarioId);
  if (!usuario) return false;
  
  // Filtrar ventas por el vendedor
  const ventasFiltradas = ventas.filter(venta => {
    return venta.vendedor === usuario.nombre;
  });
  
  // Agrupar ventas por mes para análisis
  const ventasPorMes = {};
  ventasFiltradas.forEach(venta => {
    const mesVenta = moment(venta.fechaHora).format('YYYY-MM');
    if (!ventasPorMes[mesVenta]) {
      ventasPorMes[mesVenta] = [];
    }
    ventasPorMes[mesVenta].push(venta);
  });
  
  // Crear resumen mensual
  const resumenMensual = Object.entries(ventasPorMes).map(([mes, ventas]) => {
    const totalVentas = ventas.length;
    const montoTotal = ventas.reduce((sum, venta) => sum + (venta.monto || 0), 0);
    
    return {
      'Mes': moment(mes).format('MMMM-YYYY'),
      'Total Ventas': totalVentas,
      'Monto Total': montoTotal.toLocaleString('es-ES'),
      'Promedio por Venta': (montoTotal / totalVentas).toLocaleString('es-ES')
    };
  });
  
  // Formatear los datos detallados para la exportación
  const datosDetallados = formatearVentasParaExportar(ventasFiltradas, true);
  
  // Obtener datos del usuario
  const datosUsuario = formatearUsuariosParaExportar([usuario]);
  
  // Nombre del archivo con el nombre del usuario
  const nombreArchivo = `Ventas_${usuario.nombre.replace(/\s+/g, '_')}`;
  
  // Exportar a Excel con múltiples hojas
  return exportarMultiplesHojas({
    [`Datos_${usuario.nombre.replace(/\s+/g, '_')}`]: datosUsuario,
    [`Resumen_Mensual`]: resumenMensual,
    [`Detalle_Ventas`]: datosDetallados
  }, nombreArchivo);
};

/**
 * Exporta un reporte completo con todas las ventas, productos y usuarios
 * @param {Array} ventas - Array de todas las ventas
 */
export const exportarReporteCompleto = (ventas) => {
  // Formatear los datos para la exportación
  const datosVentas = formatearVentasParaExportar(ventas, true);
  const datosUsuarios = formatearUsuariosParaExportar(usuariosData);
  const datosProductos = formatearProductosParaExportar(productosData);
  
  // Crear resumen general
  const montoTotal = ventas.reduce((sum, venta) => sum + (venta.monto || 0), 0);
  
  // Agrupar ventas por mes
  const ventasPorMes = {};
  ventas.forEach(venta => {
    const mesVenta = moment(venta.fechaHora).format('YYYY-MM');
    if (!ventasPorMes[mesVenta]) {
      ventasPorMes[mesVenta] = [];
    }
    ventasPorMes[mesVenta].push(venta);
  });
  
  // Crear resumen mensual
  const resumenMensual = Object.entries(ventasPorMes).map(([mes, ventasMes]) => {
    const totalVentasMes = ventasMes.length;
    const montoTotalMes = ventasMes.reduce((sum, venta) => sum + (venta.monto || 0), 0);
    
    return {
      'Mes': moment(mes).format('MMMM-YYYY'),
      'Total Ventas': totalVentasMes,
      'Monto Total': montoTotalMes.toLocaleString('es-ES'),
      'Porcentaje del Total': `${((montoTotalMes / montoTotal) * 100).toFixed(2)}%`
    };
  });
  
  // Agrupar ventas por vendedor
  const ventasPorVendedor = {};
  ventas.forEach(venta => {
    const vendedor = venta.vendedor;
    if (!ventasPorVendedor[vendedor]) {
      ventasPorVendedor[vendedor] = [];
    }
    ventasPorVendedor[vendedor].push(venta);
  });
  
  // Crear resumen por vendedor
  const resumenVendedores = Object.entries(ventasPorVendedor).map(([vendedor, ventasVendedor]) => {
    const totalVentasVendedor = ventasVendedor.length;
    const montoTotalVendedor = ventasVendedor.reduce((sum, venta) => sum + (venta.monto || 0), 0);
    
    return {
      'Vendedor': vendedor,
      'Total Ventas': totalVentasVendedor,
      'Monto Total': montoTotalVendedor.toLocaleString('es-ES'),
      'Promedio por Venta': (montoTotalVendedor / totalVentasVendedor).toLocaleString('es-ES'),
      'Porcentaje del Total': `${((montoTotalVendedor / montoTotal) * 100).toFixed(2)}%`
    };
  });
  
  // Nombre del archivo con la fecha actual
  const nombreArchivo = `Reporte_Completo_${moment().format('DD-MM-YYYY')}`;
  
  // Exportar a Excel con múltiples hojas
  return exportarMultiplesHojas({
    'Resumen_Mensual': resumenMensual,
    'Resumen_Vendedores': resumenVendedores,
    'Ventas': datosVentas,
    'Productos': datosProductos,
    'Usuarios': datosUsuarios
  }, nombreArchivo);
};
