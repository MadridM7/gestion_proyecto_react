/**
 * @fileoverview Servicio para enviar notificaciones vía WhatsApp
 * Proporciona funcionalidades para enviar mensajes de notificación de pedidos
 */

/**
 * Obtiene el número de WhatsApp configurado en las variables de entorno
 * @returns {string} Número de WhatsApp formateado
 */
const getWhatsAppNumber = () => {
  // Obtener el número desde las variables de entorno
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '+56912345678';
  
  // Eliminar cualquier espacio y asegurarse de que comienza con '+'
  return whatsappNumber.trim().replace(/^\+?/, '+');
};

/**
 * Formatea un pedido para ser mostrado en un mensaje de WhatsApp
 * @param {Object} pedido - Objeto con los datos del pedido
 * @returns {string} Texto formateado del pedido
 */
const formatearPedido = (pedido) => {
  // Verificar que el pedido tenga la estructura esperada
  if (!pedido || !pedido.id) {
    return 'Pedido con formato incorrecto';
  }
  
  // Formatear el monto con separador de miles
  const montoFormateado = pedido.monto ? Number(pedido.monto).toLocaleString('es-CL') : '0';
  
  // Formatear la fecha si existe
  const fechaFormateada = pedido.fechaPedido 
    ? new Date(pedido.fechaPedido).toLocaleDateString('es-CL') 
    : new Date().toLocaleDateString('es-CL');
  
  // Obtener los detalles del pedido si existen
  let detallesFormateados = '';
  if (pedido.detallePedido) {
    detallesFormateados = `\n📋 *Detalles:*\n${pedido.detallePedido}`;
  }
  
  // Formatear el pedido completo con los campos disponibles
  return `📦 *Pedido:* ${pedido.id}
👤 *Cliente:* ${pedido.nombreCliente || 'No especificado'}
📍 *Dirección:* ${pedido.direccion || 'No especificada'}
💰 *Monto a pagar:* $${montoFormateado}
📊 *Estado:* ${pedido.estado || 'Pendiente'}
🕒 *Fecha:* ${fechaFormateada}${detallesFormateados}`;
};

/**
 * Envía una notificación de WhatsApp con los detalles de los pedidos
 * @param {Array} pedidos - Lista de pedidos para notificar
 * @returns {boolean} Verdadero si se abrió WhatsApp correctamente
 */
const enviarNotificacionPedidos = (pedidos) => {
  try {
    // Verificar que haya pedidos para notificar
    if (!Array.isArray(pedidos) || pedidos.length === 0) {
      console.error('No hay pedidos para notificar');
      return false;
    }
    
    // Obtener el número de WhatsApp
    const whatsappNumber = getWhatsAppNumber();
    
    // Crear el mensaje de introducción
    const introduccion = `🔔 *NOTIFICACIÓN DE PEDIDOS* 🔔\n\n`;
    
    // Formatear cada pedido
    const pedidosFormateados = pedidos.map(formatearPedido).join('\n\n-------------------\n\n');
    
    // Mensaje completo
    const mensaje = `${introduccion}${pedidosFormateados}`;
    
    // Codificar el mensaje para URL
    const mensajeCodificado = encodeURIComponent(mensaje);
    
    // Crear la URL de WhatsApp
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${mensajeCodificado}`;
    
    // Abrir WhatsApp en una nueva ventana
    window.open(whatsappUrl, '_blank');
    
    return true;
  } catch (error) {
    console.error('Error al enviar notificación de WhatsApp:', error);
    return false;
  }
};

/**
 * Envía una notificación de WhatsApp con los detalles de un solo pedido
 * @param {Object} pedido - Pedido para notificar
 * @returns {boolean} Verdadero si se abrió WhatsApp correctamente
 */
const enviarNotificacionPedido = (pedido) => {
  // Utilizar la función de múltiples pedidos con un array de un solo elemento
  return enviarNotificacionPedidos([pedido]);
};

// Exportar las funciones del servicio
const whatsappService = {
  enviarNotificacionPedidos,
  enviarNotificacionPedido,
  getWhatsAppNumber
};

export default whatsappService;
