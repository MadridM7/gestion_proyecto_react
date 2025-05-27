/**
 * @fileoverview Constantes utilizadas en toda la aplicación
 * Centraliza valores constantes para facilitar su mantenimiento y reutilización
 */

// Tipos de pago
export const TIPOS_PAGO = {
  EFECTIVO: 'efectivo',
  DEBITO: 'debito',
  CREDITO: 'credito'
};

// Opciones de tipos de pago para selects
export const OPCIONES_TIPOS_PAGO = [
  { value: TIPOS_PAGO.EFECTIVO, label: 'Efectivo' },
  { value: TIPOS_PAGO.DEBITO, label: 'Débito' },
  { value: TIPOS_PAGO.CREDITO, label: 'Crédito' }
];

// Estados de pedidos
export const ESTADOS_PEDIDO = {
  PENDIENTE: 'pendiente',
  EN_PROCESO: 'en_proceso',
  COMPLETADO: 'completado',
  CANCELADO: 'cancelado'
};

// Opciones de estados de pedido para selects
export const OPCIONES_ESTADOS_PEDIDO = [
  { value: ESTADOS_PEDIDO.PENDIENTE, label: 'Pendiente' },
  { value: ESTADOS_PEDIDO.EN_PROCESO, label: 'En Proceso' },
  { value: ESTADOS_PEDIDO.COMPLETADO, label: 'Completado' },
  { value: ESTADOS_PEDIDO.CANCELADO, label: 'Cancelado' }
];

// Roles de usuario
export const ROLES_USUARIO = {
  ADMIN: 'admin',
  VENDEDOR: 'vendedor',
  CLIENTE: 'cliente'
};

// Opciones de roles de usuario para selects
export const OPCIONES_ROLES_USUARIO = [
  { value: ROLES_USUARIO.ADMIN, label: 'Administrador' },
  { value: ROLES_USUARIO.VENDEDOR, label: 'Vendedor' },
  { value: ROLES_USUARIO.CLIENTE, label: 'Cliente' }
];

// Categorías de productos
export const CATEGORIAS_PRODUCTO = {
  ELECTRONICA: 'electronica',
  ROPA: 'ropa',
  HOGAR: 'hogar',
  ALIMENTOS: 'alimentos',
  OTROS: 'otros'
};

// Opciones de categorías de producto para selects
export const OPCIONES_CATEGORIAS_PRODUCTO = [
  { value: CATEGORIAS_PRODUCTO.ELECTRONICA, label: 'Electrónica' },
  { value: CATEGORIAS_PRODUCTO.ROPA, label: 'Ropa' },
  { value: CATEGORIAS_PRODUCTO.HOGAR, label: 'Hogar' },
  { value: CATEGORIAS_PRODUCTO.ALIMENTOS, label: 'Alimentos' },
  { value: CATEGORIAS_PRODUCTO.OTROS, label: 'Otros' }
];

// Configuración de paginación
export const PAGINACION = {
  TAMANO_PAGINA_DEFECTO: 10,
  OPCIONES_TAMANO_PAGINA: ['10', '20', '50', '100']
};

// Endpoints de la API
export const API = {
  BASE_URL: 'http://localhost:3001/api',
  VENTAS: '/ventas',
  PRODUCTOS: '/productos',
  USUARIOS: '/usuarios',
  PEDIDOS: '/pedidos',
  DASHBOARD: '/dashboard'
};

// Formatos de fecha
export const FORMATOS_FECHA = {
  FECHA: 'dd/MM/yyyy',
  FECHA_HORA: 'dd/MM/yyyy HH:mm',
  MES_ANO: 'MMMM yyyy',
  ANO: 'yyyy'
};

// Colores para gráficos
export const COLORES_GRAFICOS = {
  PRIMARIO: '#1890ff',
  SECUNDARIO: '#52c41a',
  TERCIARIO: '#faad14',
  CUATERNARIO: '#f5222d',
  GRIS: '#8c8c8c'
};

// Colores para estados
export const COLORES_ESTADOS = {
  EXITO: '#52c41a',
  ADVERTENCIA: '#faad14',
  ERROR: '#f5222d',
  INFO: '#1890ff',
  DESACTIVADO: '#d9d9d9'
};

// Breakpoints para diseño responsive
export const BREAKPOINTS = {
  XS: 480,
  SM: 576,
  MD: 768,
  LG: 992,
  XL: 1200,
  XXL: 1600
};

// Mensajes de error comunes
export const MENSAJES_ERROR = {
  CAMPO_REQUERIDO: 'Este campo es requerido',
  EMAIL_INVALIDO: 'Por favor ingresa un email válido',
  NUMERO_INVALIDO: 'Por favor ingresa un número válido',
  FECHA_INVALIDA: 'Por favor ingresa una fecha válida',
  ERROR_SERVIDOR: 'Error en el servidor. Inténtalo de nuevo más tarde.',
  ERROR_CONEXION: 'Error de conexión. Verifica tu conexión a internet.'
};
