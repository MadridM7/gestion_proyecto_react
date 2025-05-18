const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const HOST = '0.0.0.0'; // Permite conexiones desde cualquier IP

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Rutas para manejar los archivos JSON
app.get('/api/ventas', (req, res) => {
  try {
    const ventasPath = path.join(__dirname, 'src', 'data', 'ventas.json');
    const ventas = fs.readJsonSync(ventasPath);
    res.json(ventas);
  } catch (error) {
    console.error('Error al leer ventas:', error);
    res.status(500).json({ error: 'Error al leer el archivo de ventas' });
  }
});

app.post('/api/ventas', (req, res) => {
  try {
    const ventasPath = path.join(__dirname, 'src', 'data', 'ventas.json');
    // Leer el archivo actual solo para verificar que existe
    fs.readJsonSync(ventasPath);
    const nuevasVentas = req.body;
    
    fs.writeJsonSync(ventasPath, nuevasVentas, { spaces: 2 });
    
    res.json({ success: true, message: 'Ventas guardadas correctamente' });
  } catch (error) {
    console.error('Error al guardar ventas:', error);
    res.status(500).json({ error: 'Error al guardar en el archivo de ventas' });
  }
});

// Ruta para agregar una nueva venta
app.post('/api/ventas/agregar', (req, res) => {
  try {
    const ventasPath = path.join(__dirname, 'src', 'data', 'ventas.json');
    // Leer las ventas actuales
    const ventas = fs.readJsonSync(ventasPath);
    // Obtener la nueva venta del cuerpo de la petición
    const nuevaVenta = req.body;
    
    // Agregar la nueva venta al array
    ventas.push(nuevaVenta);
    
    // Guardar el array actualizado
    fs.writeJsonSync(ventasPath, ventas, { spaces: 2 });
    
    // Responder con éxito
    res.json({ success: true, message: 'Venta agregada correctamente', venta: nuevaVenta });
    console.log('Nueva venta agregada:', nuevaVenta);
  } catch (error) {
    console.error('Error al agregar venta:', error);
    res.status(500).json({ error: 'Error al agregar la venta' });
  }
});

app.get('/api/productos', (req, res) => {
  try {
    const productosPath = path.join(__dirname, 'src', 'data', 'productos.json');
    const productos = fs.readJsonSync(productosPath);
    res.json(productos);
  } catch (error) {
    console.error('Error al leer productos:', error);
    res.status(500).json({ error: 'Error al leer el archivo de productos' });
  }
});

app.post('/api/productos', (req, res) => {
  try {
    const productosPath = path.join(__dirname, 'src', 'data', 'productos.json');
    const nuevosProductos = req.body;
    
    fs.writeJsonSync(productosPath, nuevosProductos, { spaces: 2 });
    
    res.json({ success: true, message: 'Productos guardados correctamente' });
  } catch (error) {
    console.error('Error al guardar productos:', error);
    res.status(500).json({ error: 'Error al guardar en el archivo de productos' });
  }
});

// Ruta para agregar un nuevo producto
app.post('/api/productos/agregar', (req, res) => {
  try {
    const productosPath = path.join(__dirname, 'src', 'data', 'productos.json');
    const nuevoProducto = req.body;
    
    // Asegurarse de que el producto tenga un ID
    if (!nuevoProducto.id) {
      nuevoProducto.id = `P${Math.floor(Math.random() * 10000)}`;
    }
    
    // Leer los productos actuales
    const productos = fs.readJsonSync(productosPath);
    
    // Verificar si ya existe un producto con el mismo ID
    const existeID = productos.some(p => p.id === nuevoProducto.id);
    if (existeID) {
      nuevoProducto.id = `P${Math.floor(Math.random() * 10000)}`;
    }
    
    // Agregar el nuevo producto
    productos.push(nuevoProducto);
    
    // Guardar los productos actualizados
    fs.writeJsonSync(productosPath, productos, { spaces: 2 });
    
    res.json({ success: true, message: 'Producto agregado correctamente', producto: nuevoProducto });
  } catch (error) {
    console.error('Error al agregar producto:', error);
    res.status(500).json({ error: 'Error al agregar el producto' });
  }
});

// Ruta para actualizar un producto existente
app.put('/api/productos/:id', (req, res) => {
  try {
    const productosPath = path.join(__dirname, 'src', 'data', 'productos.json');
    const id = req.params.id;
    const productoActualizado = req.body;
    
    // Leer los productos actuales
    const productos = fs.readJsonSync(productosPath);
    
    // Buscar el producto a actualizar
    const indice = productos.findIndex(p => p.id === id);
    
    if (indice === -1) {
      return res.status(404).json({ error: `No se encontró el producto con ID ${id}` });
    }
    
    // Actualizar el producto
    productos[indice] = { ...productoActualizado, id }; // Mantener el ID original
    
    // Guardar los productos actualizados
    fs.writeJsonSync(productosPath, productos, { spaces: 2 });
    
    res.json({ success: true, message: `Producto con ID ${id} actualizado correctamente`, producto: productos[indice] });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});

// Ruta para eliminar un producto
app.delete('/api/productos/:id', (req, res) => {
  try {
    const productosPath = path.join(__dirname, 'src', 'data', 'productos.json');
    const id = req.params.id;
    
    // Leer los productos actuales
    const productos = fs.readJsonSync(productosPath);
    
    // Filtrar el producto a eliminar
    const productosActualizados = productos.filter(p => p.id !== id);
    
    if (productos.length === productosActualizados.length) {
      return res.status(404).json({ error: `No se encontró el producto con ID ${id}` });
    }
    
    // Guardar los productos actualizados
    fs.writeJsonSync(productosPath, productosActualizados, { spaces: 2 });
    
    res.json({ success: true, message: `Producto con ID ${id} eliminado correctamente` });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

app.get('/api/usuarios', (req, res) => {
  try {
    const usuariosPath = path.join(__dirname, 'src', 'data', 'usuarios.json');
    
    // Verificar si el archivo existe, si no, crear uno con un array vacío
    if (!fs.existsSync(usuariosPath)) {
      fs.writeJsonSync(usuariosPath, [], { spaces: 2 });
      return res.json([]);
    }
    
    const usuarios = fs.readJsonSync(usuariosPath);
    res.json(usuarios);
  } catch (error) {
    console.error('Error al leer usuarios:', error);
    res.status(500).json({ error: 'Error al leer el archivo de usuarios' });
  }
});

app.post('/api/usuarios', (req, res) => {
  try {
    const usuariosPath = path.join(__dirname, 'src', 'data', 'usuarios.json');
    
    // Verificar si el archivo existe, si no, crear uno con un array vacío
    if (!fs.existsSync(usuariosPath)) {
      fs.writeJsonSync(usuariosPath, [], { spaces: 2 });
    }
    
    const nuevosUsuarios = req.body;
    
    fs.writeJsonSync(usuariosPath, nuevosUsuarios, { spaces: 2 });
    
    res.json({ success: true, message: 'Usuarios guardados correctamente' });
  } catch (error) {
    console.error('Error al guardar usuarios:', error);
    res.status(500).json({ error: 'Error al guardar en el archivo de usuarios' });
  }
});

// Ruta para agregar un nuevo usuario
app.post('/api/usuarios/agregar', (req, res) => {
  try {
    const usuariosPath = path.join(__dirname, 'src', 'data', 'usuarios.json');
    const nuevoUsuario = req.body;
    
    // Asegurarse de que el usuario tenga un ID
    if (!nuevoUsuario.id) {
      nuevoUsuario.id = `U${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`;
    }
    
    // Verificar si el archivo existe, si no, crear uno con un array vacío
    if (!fs.existsSync(usuariosPath)) {
      fs.writeJsonSync(usuariosPath, [], { spaces: 2 });
    }
    
    // Leer los usuarios actuales
    const usuarios = fs.readJsonSync(usuariosPath);
    
    // Verificar si ya existe un usuario con el mismo ID
    const existeID = usuarios.some(u => u.id === nuevoUsuario.id);
    if (existeID) {
      nuevoUsuario.id = `U${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`;
    }
    
    // Agregar el nuevo usuario
    usuarios.push(nuevoUsuario);
    
    // Guardar los usuarios actualizados
    fs.writeJsonSync(usuariosPath, usuarios, { spaces: 2 });
    
    res.json({ success: true, message: 'Usuario agregado correctamente', usuario: nuevoUsuario });
  } catch (error) {
    console.error('Error al agregar usuario:', error);
    res.status(500).json({ error: 'Error al agregar el usuario' });
  }
});

// Ruta para actualizar un usuario existente
app.put('/api/usuarios/:id', (req, res) => {
  try {
    const usuariosPath = path.join(__dirname, 'src', 'data', 'usuarios.json');
    const id = req.params.id;
    const usuarioActualizado = req.body;
    
    // Verificar si el archivo existe
    if (!fs.existsSync(usuariosPath)) {
      return res.status(404).json({ error: 'No se encontró el archivo de usuarios' });
    }
    
    // Leer los usuarios actuales
    const usuarios = fs.readJsonSync(usuariosPath);
    
    // Buscar el usuario a actualizar
    const indice = usuarios.findIndex(u => u.id === id);
    
    if (indice === -1) {
      return res.status(404).json({ error: `No se encontró el usuario con ID ${id}` });
    }
    
    // Actualizar el usuario
    usuarios[indice] = { ...usuarioActualizado, id }; // Mantener el ID original
    
    // Guardar los usuarios actualizados
    fs.writeJsonSync(usuariosPath, usuarios, { spaces: 2 });
    
    res.json({ success: true, message: `Usuario con ID ${id} actualizado correctamente`, usuario: usuarios[indice] });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
});

// Ruta para eliminar un usuario
app.delete('/api/usuarios/:id', (req, res) => {
  try {
    const usuariosPath = path.join(__dirname, 'src', 'data', 'usuarios.json');
    const id = req.params.id;
    
    // Verificar si el archivo existe
    if (!fs.existsSync(usuariosPath)) {
      return res.status(404).json({ error: 'No se encontró el archivo de usuarios' });
    }
    
    // Leer los usuarios actuales
    const usuarios = fs.readJsonSync(usuariosPath);
    
    // Filtrar el usuario a eliminar
    const usuariosActualizados = usuarios.filter(u => u.id !== id);
    
    if (usuarios.length === usuariosActualizados.length) {
      return res.status(404).json({ error: `No se encontró el usuario con ID ${id}` });
    }
    
    // Guardar los usuarios actualizados
    fs.writeJsonSync(usuariosPath, usuariosActualizados, { spaces: 2 });
    
    res.json({ success: true, message: `Usuario con ID ${id} eliminado correctamente` });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
});

// Iniciar el servidor
app.listen(PORT, HOST, () => {
  console.log(`Servidor ejecutándose en http://${HOST}:${PORT}`);
  console.log('Accede desde dispositivos móviles usando la IP de tu red local');
});
