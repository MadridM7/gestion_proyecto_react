/**
 * Script para iniciar tanto el servidor API como la aplicación React
 * Ejecuta ambos procesos en paralelo y maneja su ciclo de vida
 * Muestra la IP de la red local para facilitar la conexión desde dispositivos móviles
 */

const { spawn } = require('child_process');
const os = require('os');

// Colores para la consola
const colors = {
  server: '\x1b[36m', // Cyan
  react: '\x1b[32m',  // Verde
  error: '\x1b[31m',  // Rojo
  reset: '\x1b[0m'    // Reset
};

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
  
  process.stdout.on('data', (data) => {
    console.log(`${color}[${name}] ${data.toString().trim()}${colors.reset}`);
  });
  
  process.stderr.on('data', (data) => {
    console.error(`${colors.error}[${name} ERROR] ${data.toString().trim()}${colors.reset}`);
  });
  
  process.on('close', (code) => {
    console.log(`${color}[${name}] Proceso finalizado con código: ${code}${colors.reset}`);
  });
  
  return process;
}

// Iniciar el servidor API
console.log(`${colors.server}Iniciando servidor API...${colors.reset}`);
const serverProcess = startProcess('node', ['server/index.js'], 'API', colors.server);

// Esperar un momento para que el servidor se inicie antes de iniciar la aplicación React
setTimeout(() => {
  // Iniciar la aplicación React
  console.log(`${colors.react}Iniciando aplicación React...${colors.reset}`);
  const reactProcess = startProcess('npm', ['start'], 'React', colors.react);
  
  // Manejar la terminación de los procesos cuando se cierra este script
  process.on('SIGINT', () => {
    console.log('\nCerrando aplicación...');
    serverProcess.kill();
    reactProcess.kill();
    process.exit();
  });
}, 2000);

/**
 * Obtiene las direcciones IP de la red local
 * @returns {Array<string>} Lista de direcciones IP
 */
function getLocalIPs() {
  const interfaces = os.networkInterfaces();
  const addresses = [];
  
  for (const interfaceName in interfaces) {
    const interfaceInfo = interfaces[interfaceName];
    for (const info of interfaceInfo) {
      // Solo nos interesan las direcciones IPv4 que no sean localhost
      if (info.family === 'IPv4' && !info.internal) {
        addresses.push(info.address);
      }
    }
  }
  
  return addresses;
}

console.log('Iniciando aplicación completa...');
console.log('Presiona Ctrl+C para detener todos los procesos.');

// Mostrar las IPs de la red local para facilitar la conexión desde dispositivos móviles
const localIPs = getLocalIPs();
if (localIPs.length > 0) {
  console.log('\nPara acceder desde dispositivos móviles, utiliza una de estas direcciones:');
  localIPs.forEach(ip => {
    console.log(`${colors.react}http://${ip}:3000${colors.reset} - Para la aplicación React`);
    console.log(`${colors.server}http://${ip}:3001${colors.reset} - Para la API del servidor`);
  });
} else {
  console.log('\nNo se pudieron detectar direcciones IP de la red local.');
}
