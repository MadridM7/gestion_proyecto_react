const fs = require('fs');
const path = require('path');

/**
 * Clase para manejar operaciones de archivos JSON
 */
class FileManager {
  /**
   * Constructor
   * @param {string} dataDir - Directorio donde se encuentran los archivos JSON
   */
  constructor(dataDir) {
    this.dataDir = dataDir;
  }

  /**
   * Lee un archivo JSON
   * @param {string} fileName - Nombre del archivo JSON (sin extensión)
   * @returns {Object} - Datos del archivo JSON
   */
  readJsonFile(fileName) {
    try {
      const filePath = path.join(this.dataDir, `${fileName}.json`);
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error al leer el archivo ${fileName}.json:`, error);
      throw error;
    }
  }

  /**
   * Escribe datos en un archivo JSON
   * @param {string} fileName - Nombre del archivo JSON (sin extensión)
   * @param {Object} data - Datos a escribir
   */
  writeJsonFile(fileName, data) {
    try {
      const filePath = path.join(this.dataDir, `${fileName}.json`);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      console.log(`Archivo ${fileName}.json actualizado correctamente`);
      return true;
    } catch (error) {
      console.error(`Error al escribir en el archivo ${fileName}.json:`, error);
      throw error;
    }
  }

  /**
   * Actualiza un archivo JSON agregando un nuevo elemento
   * @param {string} fileName - Nombre del archivo JSON (sin extensión)
   * @param {Object} newItem - Nuevo elemento a agregar
   * @returns {Object} - Datos actualizados
   */
  addItem(fileName, newItem) {
    try {
      const data = this.readJsonFile(fileName);
      if (Array.isArray(data)) {
        data.push(newItem);
        this.writeJsonFile(fileName, data);
        return data;
      } else {
        throw new Error(`El archivo ${fileName}.json no contiene un array`);
      }
    } catch (error) {
      console.error(`Error al agregar elemento a ${fileName}.json:`, error);
      throw error;
    }
  }

  /**
   * Actualiza un archivo JSON modificando un elemento existente
   * @param {string} fileName - Nombre del archivo JSON (sin extensión)
   * @param {string} itemId - ID del elemento a modificar
   * @param {Object} updatedItem - Datos actualizados del elemento
   * @returns {Object} - Datos actualizados
   */
  updateItem(fileName, itemId, updatedItem) {
    try {
      const data = this.readJsonFile(fileName);
      if (Array.isArray(data)) {
        const index = data.findIndex(item => item.id === itemId);
        if (index !== -1) {
          data[index] = { ...data[index], ...updatedItem };
          this.writeJsonFile(fileName, data);
          return data;
        } else {
          throw new Error(`No se encontró el elemento con ID ${itemId} en ${fileName}.json`);
        }
      } else {
        throw new Error(`El archivo ${fileName}.json no contiene un array`);
      }
    } catch (error) {
      console.error(`Error al actualizar elemento en ${fileName}.json:`, error);
      throw error;
    }
  }

  /**
   * Actualiza un archivo JSON eliminando un elemento existente
   * @param {string} fileName - Nombre del archivo JSON (sin extensión)
   * @param {string} itemId - ID del elemento a eliminar
   * @returns {Object} - Datos actualizados
   */
  deleteItem(fileName, itemId) {
    try {
      const data = this.readJsonFile(fileName);
      if (Array.isArray(data)) {
        const filteredData = data.filter(item => item.id !== itemId);
        
        // Siempre escribimos el resultado, incluso si no se encontró el elemento
        // Esto evita errores cuando el elemento ya fue eliminado
        this.writeJsonFile(fileName, filteredData);
        
        // Si no se encontró el elemento, registramos una advertencia pero no lanzamos error
        if (filteredData.length === data.length) {
          console.warn(`Advertencia: No se encontró el elemento con ID ${itemId} en ${fileName}.json, pero se continuó con la operación`);
        }
        
        return filteredData;
      } else {
        throw new Error(`El archivo ${fileName}.json no contiene un array`);
      }
    } catch (error) {
      console.error(`Error al eliminar elemento de ${fileName}.json:`, error);
      throw error;
    }
  }

  /**
   * Reemplaza completamente el contenido de un archivo JSON
   * @param {string} fileName - Nombre del archivo JSON (sin extensión)
   * @param {Object} newData - Nuevos datos para el archivo
   * @returns {Object} - Nuevos datos
   */
  replaceFile(fileName, newData) {
    try {
      this.writeJsonFile(fileName, newData);
      return newData;
    } catch (error) {
      console.error(`Error al reemplazar el archivo ${fileName}.json:`, error);
      throw error;
    }
  }
}

module.exports = FileManager;
