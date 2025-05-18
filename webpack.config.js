const path = require('path');

module.exports = {
  // Configuración para ignorar cambios en archivos JSON durante el desarrollo
  watchOptions: {
    ignored: ['**/src/data/*.json'],
  },
};
