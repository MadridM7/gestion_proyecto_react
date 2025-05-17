const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const FileManager = require('./fileManager');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Crear una instancia del gestor de archivos
const dataDir = path.join(__dirname, '..', 'src', 'data');
const fileManager = new FileManager(dataDir);

// Rutas para ventas
app.get('/api/ventas', (req, res) => {
  try {
    const ventas = fileManager.readJsonFile('ventas');
    res.json(ventas);
  } catch (error) {
    console.error('Error al obtener ventas:', error);
    res.status(500).json({ error: 'Error al obtener ventas' });
  }
});

app.post('/api/ventas', (req, res) => {
  try {
    const nuevasVentas = req.body;
    fileManager.replaceFile('ventas', nuevasVentas);
    res.json({ success: true, message: 'Ventas actualizadas correctamente' });
  } catch (error) {
    console.error('Error al actualizar ventas:', error);
    res.status(500).json({ error: 'Error al actualizar ventas' });
  }
});

app.post('/api/ventas/agregar', (req, res) => {
  try {
    const nuevaVenta = req.body;
    const ventas = fileManager.addItem('ventas', nuevaVenta);
    res.json({ success: true, message: 'Venta agregada correctamente', ventas });
  } catch (error) {
    console.error('Error al agregar venta:', error);
    res.status(500).json({ error: 'Error al agregar venta' });
  }
});

app.put('/api/ventas/:id', (req, res) => {
  try {
    const { id } = req.params;
    const ventaActualizada = req.body;
    const ventas = fileManager.updateItem('ventas', id, ventaActualizada);
    res.json({ success: true, message: 'Venta actualizada correctamente', ventas });
  } catch (error) {
    console.error('Error al actualizar venta:', error);
    res.status(500).json({ error: 'Error al actualizar venta' });
  }
});

app.delete('/api/ventas/:id', (req, res) => {
  try {
    const { id } = req.params;
    const ventas = fileManager.deleteItem('ventas', id);
    res.json({ success: true, message: 'Venta eliminada correctamente', ventas });
  } catch (error) {
    console.error('Error al eliminar venta:', error);
    res.status(500).json({ error: 'Error al eliminar venta' });
  }
});

// Rutas para productos
app.get('/api/productos', (req, res) => {
  try {
    const productos = fileManager.readJsonFile('productos');
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

app.post('/api/productos', (req, res) => {
  try {
    const nuevosProductos = req.body;
    fileManager.replaceFile('productos', nuevosProductos);
    res.json({ success: true, message: 'Productos actualizados correctamente' });
  } catch (error) {
    console.error('Error al actualizar productos:', error);
    res.status(500).json({ error: 'Error al actualizar productos' });
  }
});

app.post('/api/productos/agregar', (req, res) => {
  try {
    const nuevoProducto = req.body;
    const productos = fileManager.addItem('productos', nuevoProducto);
    res.json({ success: true, message: 'Producto agregado correctamente', productos });
  } catch (error) {
    console.error('Error al agregar producto:', error);
    res.status(500).json({ error: 'Error al agregar producto' });
  }
});

app.put('/api/productos/:id', (req, res) => {
  try {
    const { id } = req.params;
    const productoActualizado = req.body;
    const productos = fileManager.updateItem('productos', id, productoActualizado);
    res.json({ success: true, message: 'Producto actualizado correctamente', productos });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});

app.delete('/api/productos/:id', (req, res) => {
  try {
    const { id } = req.params;
    const productos = fileManager.deleteItem('productos', id);
    res.json({ success: true, message: 'Producto eliminado correctamente', productos });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

// Rutas para usuarios
app.get('/api/usuarios', (req, res) => {
  try {
    // Verificar si el archivo existe
    try {
      const usuarios = fileManager.readJsonFile('usuarios');
      res.json(usuarios);
    } catch (error) {
      // Si el archivo no existe, crear uno vacío
      fileManager.writeJsonFile('usuarios', []);
      res.json([]);
    }
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

app.post('/api/usuarios', (req, res) => {
  try {
    const nuevosUsuarios = req.body;
    fileManager.replaceFile('usuarios', nuevosUsuarios);
    res.json({ success: true, message: 'Usuarios actualizados correctamente' });
  } catch (error) {
    console.error('Error al actualizar usuarios:', error);
    res.status(500).json({ error: 'Error al actualizar usuarios' });
  }
});

app.post('/api/usuarios/agregar', (req, res) => {
  try {
    const nuevoUsuario = req.body;
    
    // Verificar si el archivo existe
    try {
      const usuarios = fileManager.addItem('usuarios', nuevoUsuario);
      res.json({ success: true, message: 'Usuario agregado correctamente', usuarios });
    } catch (error) {
      // Si el archivo no existe, crear uno con el nuevo usuario
      fileManager.writeJsonFile('usuarios', [nuevoUsuario]);
      res.json({ success: true, message: 'Usuario agregado correctamente', usuarios: [nuevoUsuario] });
    }
  } catch (error) {
    console.error('Error al agregar usuario:', error);
    res.status(500).json({ error: 'Error al agregar usuario' });
  }
});

app.put('/api/usuarios/:id', (req, res) => {
  try {
    const { id } = req.params;
    const usuarioActualizado = req.body;
    const usuarios = fileManager.updateItem('usuarios', id, usuarioActualizado);
    res.json({ success: true, message: 'Usuario actualizado correctamente', usuarios });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

app.delete('/api/usuarios/:id', (req, res) => {
  try {
    const { id } = req.params;
    const usuarios = fileManager.deleteItem('usuarios', id);
    res.json({ success: true, message: 'Usuario eliminado correctamente', usuarios });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
  console.log(`Directorio de datos: ${dataDir}`);
});
