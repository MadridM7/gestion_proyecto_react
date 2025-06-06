/**
 * Script para iniciar tanto el servidor API como la aplicación React
 * Ejecuta ambos procesos en paralelo y maneja su ciclo de vida
 * Muestra la IP de la red local para facilitar la conexión desde dispositivos móviles
 * Soporta la nueva estructura de datos para ventas con múltiples productos
 */

const { spawn } = require('child_process');
const os = require('os');
const fs = require('fs');
const path = require('path');

// Rutas a los archivos de datos
const dataDir = path.join(__dirname, 'src', 'data');
const ventasFile = path.join(dataDir, 'ventas.json');
const productosFile = path.join(dataDir, 'productos.json');
const usuariosFile = path.join(dataDir, 'usuarios.json');
const pedidosFile = path.join(dataDir, 'pedidos.json');

/**
 * Verifica si los archivos de datos existen y los crea con una estructura inicial si no
 */
function verificarArchivosData() {
  // Asegurar que el directorio de datos existe
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log(`${colors.update}Directorio de datos creado: ${dataDir}${colors.reset}`);
  }

  // Estructura inicial para ventas.json (con soporte para múltiples productos)
  const estructuraVentas = [];

  // Estructura inicial para productos.json
  const estructuraProductos = [];

  // Estructura inicial para usuarios.json
  const estructuraUsuarios = [];

  // Estructura inicial para pedidos.json
  const estructuraPedidos = [];

  // Verificar y crear cada archivo si no existe
  if (!fs.existsSync(ventasFile)) {
    fs.writeFileSync(ventasFile, JSON.stringify(estructuraVentas, null, 2), 'utf8');
    console.log(`${colors.update}Archivo de ventas creado: ${ventasFile}${colors.reset}`);
  }

  if (!fs.existsSync(productosFile)) {
    fs.writeFileSync(productosFile, JSON.stringify(estructuraProductos, null, 2), 'utf8');
    console.log(`${colors.update}Archivo de productos creado: ${productosFile}${colors.reset}`);
  }

  if (!fs.existsSync(usuariosFile)) {
    fs.writeFileSync(usuariosFile, JSON.stringify(estructuraUsuarios, null, 2), 'utf8');
    console.log(`${colors.update}Archivo de usuarios creado: ${usuariosFile}${colors.reset}`);
  }

  if (!fs.existsSync(pedidosFile)) {
    fs.writeFileSync(pedidosFile, JSON.stringify(estructuraPedidos, null, 2), 'utf8');
    console.log(`${colors.update}Archivo de pedidos creado: ${pedidosFile}${colors.reset}`);
  }
}

// Colores para la consola
const colors = {
  server: '\x1b[36m', // Cyan
  react: '\x1b[32m',  // Verde
  error: '\x1b[31m',  // Rojo
  update: '\x1b[33m', // Amarillo
  reset: '\x1b[0m',   // Reset
  bold: '\x1b[1m'     // Negrita
};

// Función para limpiar la consola
function clearConsole() {
  // Limpiar consola de forma compatible con Windows y Unix
  process.stdout.write(process.platform === 'win32' ? '\x1Bc' : '\x1B[2J\x1B[3J\x1B[H');
}

/**
 * Inicia un proceso y maneja su salida
 * @param {string} command - Comando a ejecutar
 * @param {Array} args - Argumentos del comando
 * @param {string} name - Nombre del proceso (para identificarlo en la consola)
 * @param {string} color - Color para la salida en consola
 * @returns {ChildProcess} Proceso iniciado
 */
function startProcess(command, args, name, color) {
  console.log(`${color}[${name}] Iniciando...${colors.reset}`);
  
  const process = spawn(command, args, {
    shell: true,
    stdio: 'pipe',
    cwd: __dirname
  });
  
  // Filtrar y formatear la salida para que sea más limpia
  process.stdout.on('data', (data) => {
    const output = data.toString().trim();
    
    // Detectar mensajes de actualización de archivos (HMR updates)
    if (output.includes('[vite] (client) hmr update')) {
      const filePath = output.split('[vite] (client) hmr update')[1].trim();
      console.log(`${colors.update}[${name}] Update: ${filePath}${colors.reset}`);
      return;
    }
    
    // Detectar cuando la aplicación está lista
    if (output.includes('VITE') && output.includes('ready in')) {
      clearConsole();
      console.log(`${colors.bold}${color}[${name}] Aplicación lista para usar${colors.reset}`);
      return;
    }
    
    // Detectar cuando el servidor API está listo
    if (output.includes('Servidor ejecutándose en')) {
      console.log(`${colors.bold}${color}[${name}] ${output}${colors.reset}`);
      return;
    }
    
    // Filtrar mensajes innecesarios
    if (output.includes('Community users:') || 
        output.includes('Console Ninja') || 
        output.includes('node --trace-warnings')) {
      return;
    }
    
    // Mostrar el resto de mensajes normalmente
    console.log(`${color}[${name}] ${output}${colors.reset}`);
  });
  
  process.stderr.on('data', (data) => {
    console.error(`${colors.error}[${name} ERROR] ${data.toString().trim()}${colors.reset}`);
  });
  
  process.on('close', (code) => {
    console.log(`${color}[${name}] Proceso finalizado con código: ${code}${colors.reset}`);
  });
  
  return process;
}

// Banner de inicio
clearConsole();
console.log(`${colors.bold}===========================================${colors.reset}`);
console.log(`${colors.bold}  INICIANDO DASHBOARD DE GESTIÓN DE PROYECTOS  ${colors.reset}`);
console.log(`${colors.bold}===========================================${colors.reset}\n`);

// Verificar y crear archivos de datos si es necesario
console.log(`${colors.update}Verificando archivos de datos...${colors.reset}`);
verificarArchivosData();

// Iniciar el servidor API
console.log(`${colors.server}Iniciando servidor API...${colors.reset}`);
const serverProcess = startProcess('node', ['server/index.js'], 'API', colors.server);

// Verificar que el servidor API se inicie correctamente
let serverStarted = false;
serverProcess.stdout.on('data', (data) => {
  if (data.toString().includes('Servidor ejecutándose')) {
    serverStarted = true;
  }
});

serverProcess.on('exit', (code) => {
  if (code !== 0 && !serverStarted) {
    console.error(`${colors.error}[API] El servidor API se cerró inesperadamente. Código: ${code}${colors.reset}`);
    process.exit(1);
  }
});

// Esperar un momento para que el servidor se inicie antes de iniciar la aplicación React con Vite
// Vite inicia más rápido que react-scripts, pero seguimos esperando a que el servidor esté listo
setTimeout(() => {
  // Iniciar la aplicación React con Vite incluyendo la opción --host para permitir acceso desde otros dispositivos
  console.log(`${colors.react}Iniciando aplicación React con Vite (accesible desde la red local)...${colors.reset}`);
  const reactProcess = startProcess('npm', ['run', 'dev', '--', '--host'], 'React', colors.react);
  
  // Manejar la terminación de los procesos cuando se cierra este script
  process.on('SIGINT', () => {
    clearConsole();
    console.log(`${colors.bold}\nCerrando aplicación...${colors.reset}`);
    serverProcess.kill();
    reactProcess.kill();
    process.exit();
  });
}, 2000);

/**
 * Obtiene la dirección IP principal de la red local
 * @returns {string|null} IP principal o null si no se encuentra
 */
function getMainLocalIP() {
  const interfaces = os.networkInterfaces();
  
  // Prioridad de interfaces (WiFi y Ethernet suelen ser las principales)
  const priorityInterfaces = ['Wi-Fi', 'Ethernet', 'eth0', 'wlan0'];
  
  // Primero intentar con interfaces prioritarias
  for (const priorityIface of priorityInterfaces) {
    if (interfaces[priorityIface]) {
      for (const info of interfaces[priorityIface]) {
        if (info.family === 'IPv4' && !info.internal) {
          return info.address;
        }
      }
    }
  }
  
  // Si no encontramos en las prioritarias, buscar en cualquier interfaz
  for (const interfaceName in interfaces) {
    const interfaceInfo = interfaces[interfaceName];
    for (const info of interfaceInfo) {
      // Solo nos interesan las direcciones IPv4 que no sean localhost
      // y que no sean direcciones de VPN o virtuales (típicamente 192.168.56.x)
      if (info.family === 'IPv4' && !info.internal && 
          !info.address.startsWith('192.168.56.')) {
        return info.address;
      }
    }
  }
  
  return null;
}

// Variable para controlar si ya se mostraron las URLs
let urlsDisplayed = false;

// Función para mostrar las URLs de acceso
function displayAccessURLs() {
  if (urlsDisplayed) return;
  urlsDisplayed = true;
  
  clearConsole();
  console.log(`${colors.bold}===========================================${colors.reset}`);
  console.log(`${colors.bold}  DASHBOARD DE GESTIÓN DE PROYECTOS LISTO  ${colors.reset}`);
  console.log(`${colors.bold}===========================================${colors.reset}\n`);
  
  console.log(`${colors.bold}URLs de acceso local:${colors.reset}`);
  console.log(`${colors.react}➤ http://localhost:3000${colors.reset} - Aplicación React`);
  console.log(`${colors.server}➤ http://localhost:3001${colors.reset} - API del servidor\n`);
  
  // Mostrar la IP principal de la red local para facilitar la conexión desde dispositivos móviles
  const mainIP = getMainLocalIP();
  if (mainIP) {
    console.log(`${colors.bold}URL para dispositivos en la red local:${colors.reset}`);
    console.log(`${colors.react}➤ http://${mainIP}:3000${colors.reset} - Aplicación React`);
    console.log(`${colors.server}➤ http://${mainIP}:3001${colors.reset} - API del servidor`);
  }
  
  console.log(`\n${colors.bold}Presiona Ctrl+C para detener todos los procesos.${colors.reset}`);
  console.log(`${colors.update}Los cambios en archivos se mostrarán como "Update: /ruta/archivo"${colors.reset}\n`);
}

// Configurar un temporizador para mostrar las URLs después de un tiempo
setTimeout(displayAccessURLs, 5000);

// También mostrar las URLs cuando el servidor y la aplicación estén listos
let serverReady = false;
let reactReady = false;

serverProcess.stdout.on('data', (data) => {
  if (data.toString().includes('Servidor ejecutándose')) {
    serverReady = true;
    if (serverReady && reactReady) {
      displayAccessURLs();
    }
  }
});

// También verificar cuando React esté listo
setTimeout(() => {
  reactReady = true;
  if (serverReady && reactReady) {
    displayAccessURLs();
  }
}, 4000);
