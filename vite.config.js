import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Plugin personalizado para evitar recargas cuando se modifican archivos JSON
    {
      name: 'no-reload-on-json-change',
      handleHotUpdate({ file, server }) {
        // Ignorar cambios en archivos JSON para evitar recompilaciones
        if (file.endsWith('.json')) {
          console.log(`Cambio detectado en ${file}, pero se evitó la recompilación`);
          return []; // No hacer nada cuando cambian archivos JSON
        }
      },
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
    watch: {
      // Configuración adicional para el watcher
      ignored: ['**/src/data/**/*.json'], // Ignorar cambios en archivos JSON en la carpeta data
    },
  },
  build: {
    outDir: 'build',
  },
});
