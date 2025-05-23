/**
 * @fileoverview Servicio para exportar datos a Excel
 * Proporciona funcionalidades para generar y descargar archivos Excel
 * con diferentes tipos de reportes
 */
import * as XLSX from 'xlsx';
import moment from 'moment';
import 'moment/locale/es';

// Configurar moment para usar español
moment.locale('es');

/**
 * Formatea los datos de ventas para su exportación
 * @param {Array} ventas - Array de ventas a formatear
 * @param {Array} productos - Array de productos para obtener información adicional
 * @param {Array} usuarios - Array de usuarios para obtener información del vendedor
 * @param {boolean} includeDetalles - Si se deben incluir detalles adicionales
 * @returns {Array} Array de ventas formateado para exportación
 */
const formatearVentasParaExportar = (ventas, productos, usuarios, includeDetalles = false) => {
  if (!Array.isArray(ventas) || ventas.length === 0) return [];
  
  return ventas.map(venta => {
    // Asegurarse de que todos los campos existan para evitar errores
    const monto = typeof venta.monto === 'number' ? venta.monto : 0;
    const tipoPago = venta.tipoPago || '';
    const fechaHora = venta.fechaHora ? new Date(venta.fechaHora) : new Date();
    
    // Obtener información adicional del producto
    const producto = productos.find(p => p.nombre === venta.producto);
    const precioCompra = producto ? producto.precioCompra : 0;
    const margenGanancia = producto ? producto.margenGanancia : 0;
    const categoria = producto ? producto.categoria : 'No especificada';
    
    // Obtener información del vendedor
    const vendedor = usuarios.find(u => u.id === venta.vendedorId);
    const nombreVendedor = vendedor ? vendedor.nombre : venta.vendedor || 'Desconocido';
    
    // Datos básicos que siempre se incluyen
    const datosBasicos = {
      'ID': venta.id || '',
      'Producto': venta.producto || '',
      'Monto': monto.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0, maximumFractionDigits: 0 }),
      'Tipo de Pago': tipoPago.charAt(0).toUpperCase() + tipoPago.slice(1),
      'Vendedor': nombreVendedor,
      'Fecha': moment(fechaHora).format('DD/MM/YYYY'),
      'Hora': moment(fechaHora).format('HH:mm')
    };
    
    // Si se solicitan detalles adicionales, incluirlos
    if (includeDetalles) {
      return {
        ...datosBasicos,
        'Categoría': categoria,
        'Precio de Compra': precioCompra.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0, maximumFractionDigits: 0 }),
        'Margen (%)': margenGanancia,
        'Ganancia': (monto - precioCompra).toLocaleString('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0, maximumFractionDigits: 0 })
      };
    }
    
    return datosBasicos;
  });
};

/**
 * Genera y descarga un archivo Excel con los datos proporcionados
 * @param {Array} datos - Datos a exportar
 * @param {string} nombreArchivo - Nombre del archivo a generar
 * @param {string} nombreHoja - Nombre de la hoja de Excel (opcional)
 * @returns {boolean} - Indica si la exportación fue exitosa
 */
const exportarAExcel = (datos, nombreArchivo, nombreHoja = 'Datos') => {
  try {
    // Verificar si hay datos para exportar
    if (!datos || datos.length === 0) {
      console.error('No hay datos para exportar');
      return false;
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
    
    // Crear un nuevo libro de trabajo
    const workbook = XLSX.utils.book_new();
    
    // Sanitizar el nombre de la hoja para evitar caracteres especiales no permitidos
    // y truncar a 31 caracteres (límite de Excel)
    let nombreHojaSanitizado = nombreHoja.replace(/[:/?*[\]]/g, '_');
    nombreHojaSanitizado = nombreHojaSanitizado.substring(0, 31);
    
    // Añadir la hoja al libro
    XLSX.utils.book_append_sheet(workbook, worksheet, nombreHojaSanitizado);
    
    // Sanitizar el nombre del archivo
    const nombreArchivoSanitizado = nombreArchivo.replace(/[:/?*[\]]/g, '_');
    
    // Generar y descargar el archivo
    XLSX.writeFile(workbook, `${nombreArchivoSanitizado}.xlsx`);
    
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
 * @returns {boolean} - Indica si la exportación fue exitosa
 */
const exportarMultiplesHojas = (hojas, nombreArchivo) => {
  try {
    // Verificar si hay datos para exportar
    if (!hojas || Object.keys(hojas).length === 0) {
      console.error('No hay datos para exportar');
      return false;
    }
    
    // Crear un nuevo libro de trabajo
    const workbook = XLSX.utils.book_new();
    
    // Añadir cada hoja al libro
    Object.entries(hojas).forEach(([nombreHoja, datos]) => {
      if (datos && datos.length > 0) {
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
        
        // Añadir la hoja al libro
        XLSX.utils.book_append_sheet(workbook, worksheet, nombreHoja);
      }
    });
    
    // Sanitizar el nombre del archivo
    const nombreArchivoSanitizado = nombreArchivo.replace(/[:/?*[\]]/g, '_');
    
    // Generar y descargar el archivo
    XLSX.writeFile(workbook, `${nombreArchivoSanitizado}.xlsx`);
    
    return true;
  } catch (error) {
    console.error('Error al exportar a Excel:', error);
    return false;
  }
};

/**
 * Exporta un reporte de ventas diarias para una fecha específica
 * @param {Array} ventas - Array de todas las ventas
 * @param {Array} productos - Array de todos los productos
 * @param {Array} usuarios - Array de todos los usuarios
 * @param {Object} fecha - Objeto moment con la fecha seleccionada
 * @returns {boolean} - Indica si la exportación fue exitosa
 */
const exportarVentasDiarias = (ventas, productos, usuarios, fecha) => {
  try {
    // Verificar si fecha es un objeto Date válido
    if (!(fecha instanceof Date) || isNaN(fecha)) {
      console.error('Fecha no válida para exportar ventas diarias');
      return false;
    }

    // Formatear la fecha para el filtro y el nombre del archivo
    const fechaFormateada = moment(fecha).format('YYYY-MM-DD');
    const fechaVisible = moment(fecha).format('DD/MM/YYYY');
    
    // Filtrar ventas por la fecha seleccionada
    const ventasFiltradas = ventas.filter(venta => {
      const fechaVenta = moment(venta.fechaHora).format('YYYY-MM-DD');
      return fechaVenta === fechaFormateada;
    });
    
    // Verificar si hay ventas para exportar
    if (ventasFiltradas.length === 0) {
      console.error('No hay ventas para la fecha seleccionada');
      return false;
    }
    
    // Formatear datos para exportar
    const datosExportar = formatearVentasParaExportar(ventasFiltradas, productos, usuarios, true);
    
    // Exportar a Excel
    return exportarAExcel(
      datosExportar,
      `Reporte_Diario_${fechaFormateada}`,
      `Ventas del ${fechaVisible}`
    );
  } catch (error) {
    console.error('Error al exportar ventas diarias:', error);
    return false;
  }
};

/**
 * Exporta un reporte de ventas semanales para una semana específica
 * @param {Array} ventas - Array de todas las ventas
 * @param {Array} productos - Array de todos los productos
 * @param {Array} usuarios - Array de todos los usuarios
 * @param {Object} fecha - Objeto moment con la semana seleccionada
 * @returns {boolean} - Indica si la exportación fue exitosa
 */
const exportarVentasSemanales = (ventas, productos, usuarios, fecha) => {
  try {
    // Verificar si fecha es un objeto Date válido
    if (!(fecha instanceof Date) || isNaN(fecha)) {
      console.error('Fecha no válida para exportar ventas semanales');
      return false;
    }

    // Convertir la fecha a moment para manipulación
    const fechaMoment = moment(fecha);
    
    // Obtener el inicio y fin de la semana
    const inicioSemana = fechaMoment.clone().startOf('week');
    const finSemana = fechaMoment.clone().endOf('week');
    
    // Formatear fechas para el nombre del archivo
    const inicioFormateado = inicioSemana.format('YYYY-MM-DD');
    const finFormateado = finSemana.format('YYYY-MM-DD');
    const semanaVisible = `${inicioSemana.format('DD/MM/YYYY')} al ${finSemana.format('DD/MM/YYYY')}`;
    
    // Filtrar ventas por el rango de fechas
    const ventasFiltradas = ventas.filter(venta => {
      const fechaVenta = moment(venta.fechaHora);
      return fechaVenta.isBetween(inicioSemana, finSemana, null, '[]');
    });
    
    // Verificar si hay ventas para exportar
    if (ventasFiltradas.length === 0) {
      console.error('No hay ventas para la semana seleccionada');
      return false;
    }
    
    // Formatear datos para exportar
    const datosExportar = formatearVentasParaExportar(ventasFiltradas, productos, usuarios, true);
    
    // Exportar a Excel
    return exportarAExcel(
      datosExportar,
      `Reporte_Semanal_${inicioFormateado}_${finFormateado}`,
      `Ventas del ${semanaVisible}`
    );
  } catch (error) {
    console.error('Error al exportar ventas semanales:', error);
    return false;
  }
};

/**
 * Exporta un reporte de ventas mensuales para un mes específico
 * @param {Array} ventas - Array de todas las ventas
 * @param {Array} productos - Array de todos los productos
 * @param {Array} usuarios - Array de todos los usuarios
 * @param {Object} fecha - Objeto moment con el mes seleccionado
 * @returns {boolean} - Indica si la exportación fue exitosa
 */
const exportarVentasMensuales = (ventas, productos, usuarios, fecha) => {
  try {
    // Verificar si fecha es un objeto Date válido
    if (!(fecha instanceof Date) || isNaN(fecha)) {
      console.error('Fecha no válida para exportar ventas mensuales');
      return false;
    }

    // Convertir la fecha a moment para manipulación
    const fechaMoment = moment(fecha);
    
    // Obtener el inicio y fin del mes
    const inicioMes = fechaMoment.clone().startOf('month');
    const finMes = fechaMoment.clone().endOf('month');
    
    // Formatear fechas para el nombre del archivo
    const mesFormateado = fechaMoment.format('YYYY-MM');
    const mesVisible = fechaMoment.format('MMMM YYYY');
    
    // Filtrar ventas por el rango de fechas
    const ventasFiltradas = ventas.filter(venta => {
      const fechaVenta = moment(venta.fechaHora);
      return fechaVenta.isBetween(inicioMes, finMes, null, '[]');
    });
    
    // Verificar si hay ventas para exportar
    if (ventasFiltradas.length === 0) {
      console.error('No hay ventas para el mes seleccionado');
      return false;
    }
    
    // Agrupar ventas por día para la hoja de resumen
    const ventasPorDia = {};
    ventasFiltradas.forEach(venta => {
      const fechaVenta = moment(venta.fechaHora).format('YYYY-MM-DD');
      if (!ventasPorDia[fechaVenta]) {
        ventasPorDia[fechaVenta] = {
          fecha: moment(fechaVenta).format('DD/MM/YYYY'),
          totalVentas: 0,
          montoTotal: 0
        };
      }
      ventasPorDia[fechaVenta].totalVentas += 1;
      ventasPorDia[fechaVenta].montoTotal += venta.monto || 0;
    });
    
    // Convertir a array y formatear montos
    const resumenDiario = Object.values(ventasPorDia)
      .map(dia => ({
        'Fecha': dia.fecha,
        'Total Ventas': dia.totalVentas,
        'Monto Total': dia.montoTotal.toLocaleString('es-CL', {
          style: 'currency',
          currency: 'CLP',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        })
      }))
      .sort((a, b) => moment(a.Fecha, 'DD/MM/YYYY').diff(moment(b.Fecha, 'DD/MM/YYYY')));
    
    // Formatear datos detallados para exportar
    const datosDetallados = formatearVentasParaExportar(ventasFiltradas, productos, usuarios, true);
    
    // Crear múltiples hojas
    const hojas = {
      [`Resumen ${mesVisible}`]: resumenDiario,
      [`Detalle ${mesVisible}`]: datosDetallados
    };
    
    // Exportar a Excel con múltiples hojas
    return exportarMultiplesHojas(
      hojas,
      `Reporte_Mensual_${mesFormateado}`
    );
  } catch (error) {
    console.error('Error al exportar ventas mensuales:', error);
    return false;
  }
};

/**
 * Exporta un reporte completo con todas las ventas
 * @param {Array} ventas - Array de todas las ventas
 * @param {Array} productos - Array de todos los productos
 * @param {Array} usuarios - Array de todos los usuarios
 * @returns {boolean} - Indica si la exportación fue exitosa
 */
const exportarReporteCompleto = (ventas, productos, usuarios) => {
  try {
    // Verificar si hay ventas para exportar
    if (!ventas || ventas.length === 0) {
      console.error('No hay ventas para exportar');
      return false;
    }
    
    // Formatear datos detallados para exportar
    const datosDetallados = formatearVentasParaExportar(ventas, productos, usuarios, true);
    
    // Agrupar ventas por mes
    const ventasPorMes = {};
    ventas.forEach(venta => {
      const fechaVenta = moment(venta.fechaHora);
      const mesClave = fechaVenta.format('YYYY-MM');
      const mesVisible = fechaVenta.format('MMMM YYYY');
      
      if (!ventasPorMes[mesClave]) {
        ventasPorMes[mesClave] = {
          mes: mesVisible,
          totalVentas: 0,
          montoTotal: 0
        };
      }
      ventasPorMes[mesClave].totalVentas += 1;
      ventasPorMes[mesClave].montoTotal += venta.monto || 0;
    });
    
    // Convertir a array y formatear montos
    const resumenMensual = Object.values(ventasPorMes)
      .map(mes => ({
        'Mes': mes.mes,
        'Total Ventas': mes.totalVentas,
        'Monto Total': mes.montoTotal.toLocaleString('es-CL', {
          style: 'currency',
          currency: 'CLP',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        })
      }))
      .sort((a, b) => moment(a.Mes, 'MMMM YYYY').diff(moment(b.Mes, 'MMMM YYYY')));
    
    // Crear múltiples hojas
    const hojas = {
      'Resumen Mensual': resumenMensual,
      'Detalle Completo': datosDetallados
    };
    
    // Fecha actual para el nombre del archivo
    const fechaActual = moment().format('YYYY-MM-DD');
    
    // Exportar a Excel con múltiples hojas
    return exportarMultiplesHojas(
      hojas,
      `Reporte_Completo_${fechaActual}`
    );
  } catch (error) {
    console.error('Error al exportar reporte completo:', error);
    return false;
  }
};

/**
 * Exporta un reporte de productos
 * @param {Array} productos - Array de todos los productos
 * @returns {boolean} - Indica si la exportación fue exitosa
 */
const exportarReporteProductos = (productos) => {
  try {
    // Verificar si hay productos para exportar
    if (!productos || productos.length === 0) {
      console.error('No hay productos para exportar');
      return false;
    }
    
    // Formatear datos de productos para exportar
    const datosProductos = productos.map(producto => ({
      'ID': producto.id || '',
      'Nombre': producto.nombre || '',
      'Categoría': producto.categoria || 'No especificada',
      'Precio de Venta': (producto.precioVenta || 0).toLocaleString('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }),
      'Precio de Compra': (producto.precioCompra || 0).toLocaleString('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }),
      'Margen (%)': producto.margenGanancia || 0,
      'Stock': producto.stock || 0,
      'Estado': producto.activo ? 'Activo' : 'Inactivo'
    }));
    
    // Fecha actual para el nombre del archivo
    const fechaActual = moment().format('YYYY-MM-DD');
    
    // Exportar a Excel
    return exportarAExcel(
      datosProductos,
      `Reporte_Productos_${fechaActual}`,
      'Productos'
    );
  } catch (error) {
    console.error('Error al exportar reporte de productos:', error);
    return false;
  }
};

/**
 * Exporta un reporte de ventas por usuario
 * @param {Array} ventas - Array de todas las ventas
 * @param {Array} productos - Array de todos los productos
 * @param {Array} usuarios - Array de todos los usuarios
 * @param {string} usuarioId - ID del usuario seleccionado
 * @returns {boolean} - Indica si la exportación fue exitosa
 */
const exportarVentasPorUsuario = (ventas, productos, usuarios, usuarioId) => {
  try {
    // Verificar si hay un usuario seleccionado
    if (!usuarioId) {
      console.error('No se ha seleccionado un usuario');
      return false;
    }
    
    // Obtener información del usuario
    const usuario = usuarios.find(u => u.id === usuarioId);
    if (!usuario) {
      console.error('Usuario no encontrado');
      return false;
    }
    
    // Obtener el nombre del usuario para filtrar
    const nombreUsuario = usuario.nombre;
    
    // Filtrar ventas por usuario (usando el nombre del vendedor)
    const ventasUsuario = ventas.filter(venta => venta.vendedor === nombreUsuario);
    
    // Verificar si hay ventas para exportar
    if (ventasUsuario.length === 0) {
      console.error('No hay ventas para el usuario seleccionado');
      return false;
    }
    
    // Formatear datos para exportar
    const datosDetallados = formatearVentasParaExportar(ventasUsuario, productos, usuarios, true);
    
    // Agrupar ventas por producto
    const ventasPorProducto = {};
    ventasUsuario.forEach(venta => {
      const productoNombre = venta.producto || 'Desconocido';
      
      if (!ventasPorProducto[productoNombre]) {
        ventasPorProducto[productoNombre] = {
          producto: productoNombre,
          totalVentas: 0,
          montoTotal: 0
        };
      }
      ventasPorProducto[productoNombre].totalVentas += 1;
      ventasPorProducto[productoNombre].montoTotal += venta.monto || 0;
    });
    
    // Convertir a array y formatear montos
    const resumenProductos = Object.values(ventasPorProducto)
      .map(prod => ({
        'Producto': prod.producto,
        'Total Ventas': prod.totalVentas,
        'Monto Total': prod.montoTotal.toLocaleString('es-CL', {
          style: 'currency',
          currency: 'CLP',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        })
      }))
      .sort((a, b) => b['Total Ventas'] - a['Total Ventas']);
    
    // Crear múltiples hojas
    const hojas = {
      'Resumen por Producto': resumenProductos,
      'Detalle de Ventas': datosDetallados
    };
    
    // Fecha actual para el nombre del archivo
    const fechaActual = moment().format('YYYY-MM-DD');
    
    // Exportar a Excel con múltiples hojas
    return exportarMultiplesHojas(
      hojas,
      `Reporte_Ventas_${usuario.nombre.replace(/\s+/g, '_')}_${fechaActual}`
    );
  } catch (error) {
    console.error('Error al exportar ventas por usuario:', error);
    return false;
  }
};

export {
  exportarVentasDiarias,
  exportarVentasSemanales,
  exportarVentasMensuales,
  exportarReporteCompleto,
  exportarReporteProductos,
  exportarVentasPorUsuario
};
