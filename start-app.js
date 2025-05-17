const { spawn } = require('child_process');
const path = require('path');

// Función para iniciar un proceso
function startProcess(command, args, name) {
  console.log(`Iniciando ${name}...`);
  
  const process = spawn(command, args, {
    shell: true,
    stdio: 'pipe',
    cwd: __dirname
  });
  
  process.stdout.on('data', (data) => {
    console.log(`[${name}] ${data.toString().trim()}`);
  });
  
  process.stderr.on('data', (data) => {
    console.error(`[${name} ERROR] ${data.toString().trim()}`);
  });
  
  process.on('close', (code) => {
    console.log(`${name} se ha cerrado con código: ${code}`);
  });
  
  return process;
}

// Iniciar el servidor Express
const serverProcess = startProcess('node', ['server.js'], 'Servidor API');

// Esperar un momento para que el servidor se inicie antes de iniciar la aplicación React
setTimeout(() => {
  // Iniciar la aplicación React
  const reactProcess = startProcess('npm', ['start'], 'Aplicación React');
  
  // Manejar la terminación de los procesos cuando se cierra este script
  process.on('SIGINT', () => {
    console.log('Cerrando aplicación...');
    serverProcess.kill();
    reactProcess.kill();
    process.exit();
  });
}, 2000);

console.log('Iniciando aplicación completa...');
console.log('Presiona Ctrl+C para detener todos los procesos.');
