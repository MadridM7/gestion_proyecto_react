/**
 * @fileoverview Servicio para cargar datos JSON directamente desde el servidor
 * Evita recompilaciones de la aplicación cuando se modifican los archivos JSON
 */

/**
 * Carga un archivo JSON desde la carpeta data
 * @param {string} fileName - Nombre del archivo JSON sin la extensión
 * @returns {Promise<any>} Datos del archivo JSON
 */
export const loadJsonData = async (fileName) => {
  try {
    // Construir la URL del archivo JSON
    const timestamp = Date.now(); // Añadir timestamp para evitar caché del navegador
    const url = `/data/${fileName}.json?t=${timestamp}`;
    
    // Realizar la solicitud con fetch
    const response = await fetch(url, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error al cargar el archivo ${fileName}.json`);
    }
    
    // Parsear la respuesta como JSON
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error en loadJsonData para ${fileName}:`, error);
    // Devolver un array o objeto vacío dependiendo del tipo de datos esperado
    return fileName.includes('ventas') || fileName.includes('productos') || 
           fileName.includes('usuarios') || fileName.includes('pedidos') ? [] : {};
  }
};

/**
 * Carga múltiples archivos JSON desde la carpeta data
 * @param {string[]} fileNames - Array con los nombres de los archivos JSON sin la extensión
 * @returns {Promise<Object>} Objeto con los datos de los archivos JSON
 */
export const loadMultipleJsonData = async (fileNames) => {
  try {
    // Crear un array de promesas para cargar todos los archivos en paralelo
    const promises = fileNames.map(fileName => loadJsonData(fileName));
    
    // Esperar a que todas las promesas se resuelvan
    const results = await Promise.all(promises);
    
    // Crear un objeto con los resultados
    const data = {};
    fileNames.forEach((fileName, index) => {
      data[fileName] = results[index];
    });
    
    return data;
  } catch (error) {
    console.error('Error en loadMultipleJsonData:', error);
    return {};
  }
};

/**
 * Carga datos de ventas
 * @returns {Promise<Array>} Datos de ventas
 */
export const loadVentas = () => loadJsonData('ventas');

/**
 * Carga datos de productos
 * @returns {Promise<Array>} Datos de productos
 */
export const loadProductos = () => loadJsonData('productos');

/**
 * Carga datos de usuarios
 * @returns {Promise<Array>} Datos de usuarios
 */
export const loadUsuarios = () => loadJsonData('usuarios');

/**
 * Carga datos de pedidos
 * @returns {Promise<Array>} Datos de pedidos
 */
export const loadPedidos = () => loadJsonData('pedidos');

// Crear un objeto con todas las funciones exportadas
const dataService = {
  loadJsonData,
  loadMultipleJsonData,
  loadVentas,
  loadProductos,
  loadUsuarios,
  loadPedidos
};

export default dataService;
