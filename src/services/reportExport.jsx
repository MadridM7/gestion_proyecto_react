/**
 * @fileoverview Servicio para exportar datos a Excel
 * Proporciona funcionalidades para generar y descargar archivos Excel
 * con diferentes tipos de reportes
 */
import * as XLSX from 'xlsx';

/**
 * Formatea una fecha en formato DD/MM/YYYY
 * @param {Date} date - Fecha a formatear
 * @returns {string} Fecha formateada
 */
const formatDate = (date) => {
  if (!(date instanceof Date) || isNaN(date)) return '';
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Formatea una hora en formato HH:MM
 * @param {Date} date - Fecha de la que extraer la hora
 * @returns {string} Hora formateada
 */
const formatTime = (date) => {
  if (!(date instanceof Date) || isNaN(date)) return '';
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

/**
 * Obtiene el nombre del mes en español
 * @param {number} month - Número del mes (0-11)
 * @returns {string} Nombre del mes en español
 */
const getMonthName = (month) => {
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return monthNames[month];
};

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
  
  const ventasFormatted = [];
  
  ventas.forEach(venta => {
    // Asegurarse de que todos los campos existan para evitar errores
    const monto = typeof venta.monto === 'number' ? venta.monto : 0;
    const tipoPago = venta.tipoPago || '';
    const fechaHora = venta.fechaHora ? new Date(venta.fechaHora) : new Date();
    
    // Obtener información del vendedor
    const vendedor = usuarios.find(u => u.id === venta.vendedorId);
    const nombreVendedor = vendedor ? vendedor.nombre : venta.vendedor || 'Desconocido';
    
    // Verificar si la venta tiene productos
    if (Array.isArray(venta.productos) && venta.productos.length > 0) {
      // Si hay productos en la venta, crear una entrada para cada producto
      venta.productos.forEach(productoVenta => {
        // Obtener información adicional del producto desde el catálogo completo
        const productoCompleto = productos.find(p => p.id === productoVenta.id) || {};
        
        // Datos básicos para cada producto de la venta
        const datoProducto = {
          'ID Venta': venta.id || '',
          'Producto': productoVenta.nombre || '',
          'Precio Unitario': productoVenta.precio?.toLocaleString('es-CL', 
                              { style: 'currency', currency: 'CLP', minimumFractionDigits: 0, maximumFractionDigits: 0 }) || '',
          'Cantidad': productoVenta.cantidad || 0,
          'Monto Total Venta': monto.toLocaleString('es-CL', 
                              { style: 'currency', currency: 'CLP', minimumFractionDigits: 0, maximumFractionDigits: 0 }),
          'Tipo de Pago': tipoPago.charAt(0).toUpperCase() + tipoPago.slice(1),
          'Vendedor': nombreVendedor,
          'Fecha': formatDate(fechaHora),
          'Hora': formatTime(fechaHora)
        };
        
        // Si se solicitan detalles adicionales, incluirlos
        if (includeDetalles) {
          datoProducto['Categoría'] = productoCompleto.categoria || 'No especificada';
          
          // Datos adicionales si están disponibles
          if (productoCompleto.precioCompra) {
            datoProducto['Precio de Compra'] = productoCompleto.precioCompra.toLocaleString('es-CL', 
                              { style: 'currency', currency: 'CLP', minimumFractionDigits: 0, maximumFractionDigits: 0 });
            
            // Si tenemos precio de compra, podemos calcular ganancia
            const gananciaTotal = (productoVenta.precio - productoCompleto.precioCompra) * productoVenta.cantidad;
            datoProducto['Ganancia Estimada'] = gananciaTotal.toLocaleString('es-CL', 
                              { style: 'currency', currency: 'CLP', minimumFractionDigits: 0, maximumFractionDigits: 0 });
          }
          
          if (productoCompleto.margenGanancia) {
            datoProducto['Margen (%)'] = productoCompleto.margenGanancia;
          }
        }
        
        ventasFormatted.push(datoProducto);
      });
    } else {
      // Si no hay productos en la venta, crear una entrada sencilla
      const datosBasicos = {
        'ID': venta.id || '',
        'Monto': monto.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0, maximumFractionDigits: 0 }),
        'Tipo de Pago': tipoPago.charAt(0).toUpperCase() + tipoPago.slice(1),
        'Vendedor': nombreVendedor,
        'Fecha': formatDate(fechaHora),
        'Hora': formatTime(fechaHora),
        'Productos': 'No especificados'
      };
      
      ventasFormatted.push(datosBasicos);
    }
  });
  
  return ventasFormatted;
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

    // Obtener la fecha formateada para el nombre del archivo
    const fechaFormateada = formatDate(fecha).replace(/\//g, '-');
    const nombreArchivo = `Ventas_Diarias_${fechaFormateada}.xlsx`;
    
    // Filtrar ventas por la fecha seleccionada
    const ventasFiltradas = ventas.filter(venta => {
      const fechaVenta = new Date(venta.fechaHora);
      return (
        fechaVenta.getDate() === fecha.getDate() &&
        fechaVenta.getMonth() === fecha.getMonth() &&
        fechaVenta.getFullYear() === fecha.getFullYear()
      );
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
      nombreArchivo,
      `Ventas del ${formatDate(fecha)}`
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
 * @param {Date} fecha - Fecha seleccionada
 * @returns {boolean} - Indica si la exportación fue exitosa
 */
const exportarVentasSemanales = (ventas, productos, usuarios, fecha) => {
  try {
    // Verificar si fecha es un objeto Date válido
    if (!(fecha instanceof Date) || isNaN(fecha)) {
      console.error('Fecha no válida para exportar ventas semanales');
      return false;
    }

    // Obtener el inicio y fin de la semana
    const inicioSemana = new Date(fecha);
    inicioSemana.setDate(fecha.getDate() - fecha.getDay()); // Domingo
    
    const finSemana = new Date(fecha);
    finSemana.setDate(fecha.getDate() + (6 - fecha.getDay())); // Sábado
    finSemana.setHours(23, 59, 59, 999);
    
    // Formatear fechas para el nombre del archivo
    const inicioFormateado = formatDate(inicioSemana).replace(/\//g, '-');
    const finFormateado = formatDate(finSemana).replace(/\//g, '-');
    const semanaVisible = `${formatDate(inicioSemana)} al ${formatDate(finSemana)}`;
    
    // Filtrar ventas por la semana seleccionada
    const ventasFiltradas = ventas.filter(venta => {
      const fechaVenta = new Date(venta.fechaHora);
      return fechaVenta >= inicioSemana && fechaVenta <= finSemana;
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
      `Ventas_Semanales_${inicioFormateado}_${finFormateado}.xlsx`,
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
 * @param {Date} fecha - Fecha seleccionada
 * @returns {boolean} - Indica si la exportación fue exitosa
 */
const exportarVentasMensuales = (ventas, productos, usuarios, fecha) => {
  try {
    // Verificar si fecha es un objeto Date válido
    if (!(fecha instanceof Date) || isNaN(fecha)) {
      console.error('Fecha no válida para exportar ventas mensuales');
      return false;
    }

    // Obtener el mes y año para el nombre del archivo
    const mesFormateado = `${getMonthName(fecha.getMonth())}-${fecha.getFullYear()}`;
    const nombreArchivo = `Ventas_Mensuales_${mesFormateado}.xlsx`;
    
    // Filtrar ventas por la fecha seleccionada
    const ventasFiltradas = ventas.filter(venta => {
      const fechaVenta = new Date(venta.fechaHora);
      return (
        fechaVenta.getMonth() === fecha.getMonth() &&
        fechaVenta.getFullYear() === fecha.getFullYear()
      );
    });
    
    // Verificar si hay ventas para exportar
    if (ventasFiltradas.length === 0) {
      console.error('No hay ventas para el mes seleccionado');
      return false;
    }
    
    // Agrupar ventas por día para la hoja de resumen
    const ventasPorDia = {};
    ventasFiltradas.forEach(venta => {
      const fechaVenta = new Date(venta.fechaHora);
      const nombreDia = formatDate(fechaVenta);
      if (!ventasPorDia[nombreDia]) {
        ventasPorDia[nombreDia] = {
          fecha: nombreDia,
          totalVentas: 0,
          montoTotal: 0
        };
      }
      ventasPorDia[nombreDia].totalVentas += 1;
      ventasPorDia[nombreDia].montoTotal += venta.monto || 0;
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
      .sort((a, b) => new Date(a.Fecha) - new Date(b.Fecha));
    
    // Formatear datos detallados para exportar
    const datosDetallados = formatearVentasParaExportar(ventasFiltradas, productos, usuarios, true);
    
    // Crear múltiples hojas
    const hojas = {};
    hojas[`Resumen ${getMonthName(fecha.getMonth())} ${fecha.getFullYear()}`] = resumenDiario;
    hojas[`Detalle ${getMonthName(fecha.getMonth())} ${fecha.getFullYear()}`] = datosDetallados;
    
    // Exportar a Excel con múltiples hojas
    return exportarMultiplesHojas(
      hojas,
      nombreArchivo
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
      const fechaVenta = new Date(venta.fechaHora);
      const mesClave = `${fechaVenta.getFullYear()}-${fechaVenta.getMonth()}`;
      const mesVisible = `${getMonthName(fechaVenta.getMonth())} ${fechaVenta.getFullYear()}`;
      
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
      .sort((a, b) => {
        // Extraer año y mes de las cadenas
        const [mesA, yearA] = a.Mes.split(' ');
        const [mesB, yearB] = b.Mes.split(' ');
        
        // Comparar primero por año
        if (yearA !== yearB) return parseInt(yearA) - parseInt(yearB);
        
        // Si los años son iguales, comparar por índice del mes
        const mesesIndice = {
          'Enero': 0, 'Febrero': 1, 'Marzo': 2, 'Abril': 3, 'Mayo': 4, 'Junio': 5,
          'Julio': 6, 'Agosto': 7, 'Septiembre': 8, 'Octubre': 9, 'Noviembre': 10, 'Diciembre': 11
        };
        
        return mesesIndice[mesA] - mesesIndice[mesB];
      });
    
    // Crear múltiples hojas
    const hojas = {
      'Resumen Mensual': resumenMensual,
      'Detalle Completo': datosDetallados
    };
    
    // Fecha actual para el nombre del archivo
    const fechaActual = new Date();
    const fechaFormateada = formatDate(fechaActual).replace(/\//g, '-');
    
    // Exportar a Excel con múltiples hojas
    return exportarMultiplesHojas(
      hojas,
      `Reporte_Completo_${fechaFormateada}`
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
    const datosProductos = productos.map(producto => {
      // Calcular ganancia por unidad
      const precioVenta = producto.precio || 0;
      const precioCompra = producto.precioCompra || 0;
      const gananciaUnidad = precioVenta - precioCompra;

      // Calcular valor total de inventario
      const valorInventario = precioVenta * (producto.stock || 0);

      return {
        'ID': producto.id || '',
        'Nombre': producto.nombre || '',
        'Categoría': producto.categoria || 'No especificada',
        'Precio de Venta': precioVenta.toLocaleString('es-CL', {
          style: 'currency',
          currency: 'CLP',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }),
        'Precio de Compra': precioCompra.toLocaleString('es-CL', {
          style: 'currency',
          currency: 'CLP',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }),
        'Ganancia por Unidad': gananciaUnidad.toLocaleString('es-CL', {
          style: 'currency',
          currency: 'CLP',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }),
        'Margen (%)': producto.margenGanancia || 0,
        'Stock Actual': producto.stock || 0,
        'Valor de Inventario': valorInventario.toLocaleString('es-CL', {
          style: 'currency',
          currency: 'CLP',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        })
      };
    });
    
    // Fecha actual para el nombre del archivo
    const fechaActual = new Date();
    const fechaFormateada = formatDate(fechaActual).replace(/\//g, '-');
    
    // Exportar a Excel
    return exportarAExcel(
      datosProductos,
      `Reporte_Productos_${fechaFormateada}`,
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
    const fechaActual = new Date();
    const fechaFormateada = formatDate(fechaActual).replace(/\//g, '-');
    
    // Exportar a Excel con múltiples hojas
    return exportarMultiplesHojas(
      hojas,
      `Reporte_Usuario_${nombreUsuario}_${fechaFormateada}`
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
