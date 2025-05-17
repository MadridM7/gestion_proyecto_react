# VentaSoft Analytics Pro - Dashboard de Gestión de Ventas

Una aplicación web moderna para la gestión de ventas, desarrollada con React y Ant Design, optimizada para el formato monetario chileno (CLP). Ofrece una interfaz de usuario mejorada con gráficos interactivos y un diseño intuitivo. Todos los datos se guardan directamente en archivos JSON, lo que permite una persistencia de datos sin necesidad de una base de datos externa.

## Índice

- [Características](#características)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Uso](#uso)
- [Funcionalidades](#funcionalidades)
- [Tecnologías](#tecnologías)
- [Estructura del Proyecto](#estructura-del-proyecto)

## Características

- 📊 **Dashboard interactivo** con gráficos de área y barras personalizados
- 🏈 **Tarjetas de reportes** con iconos mejorados y efectos visuales
- 💰 **Formato monetario chileno (CLP)** con separadores de miles
- 📱 **Diseño responsive** para dispositivos móviles y escritorio
- 💾 **Persistencia de datos** con archivos JSON
- 🔍 **Filtrado y búsqueda avanzada** de ventas, productos y usuarios
- 📝 **Registro simplificado** de ventas con formulario optimizado
- 🔄 **Sincronización automática** entre la interfaz y los archivos JSON
- 💻 **Arquitectura cliente-servidor** con Express para manejar operaciones CRUD
- 🔥 **API RESTful** para operaciones de datos

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (versión 14.0.0 o superior)
- [npm](https://www.npmjs.com/) (normalmente viene con Node.js)
- [Git](https://git-scm.com/) para clonar el repositorio

## Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/react-dashboard-ui.git
cd react-dashboard-ui
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configuración del Entorno

No se requiere configuración adicional para el entorno de desarrollo local.

## Uso

### Iniciar la Aplicación Completa (Cliente y Servidor)

Utiliza el script de inicio rápido que inicia tanto el servidor API como la aplicación React:

```bash
# En Windows
start.bat

# O usando Node.js directamente
node start-all.js
```

Esto iniciará:
- El servidor API en [http://localhost:3001](http://localhost:3001)
- La aplicación React en [http://localhost:3000](http://localhost:3000)

### Iniciar Solo el Servidor API

```bash
node server.js
```

### Iniciar Solo la Aplicación React

```bash
npm start
```

### Compilar para Producción

```bash
npm run build
```

## Funcionalidades

### Sistema de Persistencia de Datos

- **Almacenamiento en JSON**: Todos los datos (ventas, productos, usuarios) se guardan directamente en archivos JSON.
- **API RESTful**: Implementación de endpoints para operaciones CRUD completas en todas las entidades.
- **Sincronización Automática**: Los cambios en la interfaz se reflejan inmediatamente en los archivos JSON.
- **Respaldo en LocalStorage**: Sistema de respaldo en caso de fallos en la comunicación con el servidor.

### Dashboard Principal Mejorado

- **Tarjetas de Resumen**: Muestran métricas clave como ventas totales, promedio diario y ventas por tipo de pago, con iconos distintivos y colores temáticos.
- **Gráficos Interactivos**: 
  - **Gráfico de Área**: Visualización de ventas por día de la semana con degradados y efectos visuales.
  - **Gráfico de Barras**: Distribución de ventas por tipo de pago con colores personalizados para cada categoría.
- **Tabla de Ventas Mejorada**: Visualización de ventas con etiquetas de colores para los tipos de pago y mejor formato de datos.

### Gestión de Ventas

- **Registro de Nuevas Ventas**: Interfaz simplificada para agregar ventas con validación de datos.
- **Edición y Eliminación**: Funcionalidades completas para modificar o eliminar ventas existentes.
- **Filtrado y Búsqueda**: Herramientas avanzadas para encontrar ventas por fecha, monto o tipo de pago.
- **Estadísticas en Tiempo Real**: Cálculo automático de estadísticas basadas en los datos actuales.

### Gestión de Productos

- **Catálogo de Productos**: Visualización y gestión completa del inventario de productos.
- **Cálculo Automático de Precios**: Sistema para calcular precios de venta basados en costos y márgenes.
- **Generación de IDs Únicos**: Asignación automática de identificadores únicos para nuevos productos.
- **Validación de Datos**: Verificación de la integridad de los datos de productos.

### Gestión de Usuarios

- **Registro de Usuarios**: Sistema para agregar nuevos usuarios con roles y permisos.
- **Perfiles de Usuario**: Gestión de información detallada de cada usuario.
- **Control de Acceso**: Diferentes niveles de acceso según el rol del usuario.
- **Estadísticas de Usuarios**: Seguimiento de la actividad y rendimiento de los usuarios.

### Arquitectura Cliente-Servidor

- **Servidor Express**: Backend robusto para manejar operaciones de datos.
- **API REST**: Endpoints bien definidos para todas las operaciones CRUD.
- **Manejo de Errores**: Sistema completo de captura y gestión de errores.
- **Scripts de Inicio Unificados**: Herramientas para iniciar toda la aplicación con un solo comando.

- **Barra Lateral Mejorada**: Diseño con bordes redondeados y mejor contraste para facilitar la navegación.
- **Indicadores Visuales**: Resaltado de la sección actual para mejor orientación del usuario.
- **Botón Flotante Optimizado**: Acceso rápido para agregar ventas desde cualquier página de la aplicación.

## Tecnologías

- **Framework**: [React](https://reactjs.org/) - Biblioteca JavaScript para construir interfaces de usuario
- **UI Components**: [Ant Design](https://ant.design/) - Sistema de diseño y biblioteca de componentes UI
- **Gráficos**: [Recharts](https://recharts.org/) - Biblioteca de gráficos basada en componentes React
- **Enrutamiento**: [React Router](https://reactrouter.com/) - Enrutamiento para aplicaciones React
- **Gestión de Estado**: React Context API - Gestión de estado global sin dependencias externas
- **Formato de Fechas**: [Moment.js](https://momentjs.com/) - Biblioteca para manipulación y formato de fechas
- **Datos**: Archivos JSON para almacenamiento y recuperación de datos
- **Estilos**: CSS personalizado con módulos para componentes específicos

## Estructura del Proyecto

```
react-dashboard-ui/
│à-- public/               # Archivos públicos y estáticos
│à-- server/               # Archivos relacionados con el servidor
│à-- src/                  # Código fuente de la aplicación React
│   │à-- components/           # Componentes reutilizables
│   │   │à-- dashboard/        # Componentes del dashboard (gráficos, tablas, cards)
│   │   │à-- layout/           # Componentes de estructura (header, sidebar)
│   │   │à-- charts/           # Componentes de gráficos y visualizaciones
│   │   │à-- reportes/         # Componentes para la sección de reportes
│   │   │à-- usuarios/         # Componentes para la gestión de usuarios
│   │à-- context/              # Contextos de React para gestión de estado
│   │   │à-- VentasContext.js   # Contexto para la gestión de ventas
│   │   │à-- ProductosContext.js # Contexto para la gestión de productos
│   │   │à-- UsuariosContext.js # Contexto para la gestión de usuarios
│   │à-- data/                 # Archivos JSON con datos de la aplicación
│   │   │à-- ventas.json        # Datos de ventas
│   │   │à-- productos.json     # Datos de productos
│   │   │à-- usuarios.json      # Datos de usuarios
│   │   │à-- dashboard.json     # Datos para el dashboard
│   │à-- pages/                # Páginas principales de la aplicación
│   │   │à-- Dashboard.js       # Página principal del dashboard
│   │   │à-- Ventas.js          # Página de gestión de ventas
│   │   │à-- Productos.js       # Página de gestión de productos
│   │   │à-- Usuarios.js        # Página de gestión de usuarios
│   │   │à-- Reportes.js        # Página de reportes
│   │à-- services/             # Servicios para comunicación con el servidor
│   │   │à-- api.js             # Funciones para comunicación con la API
│   │à-- styles/               # Archivos CSS y estilos
│   │à-- utils/                # Utilidades y funciones auxiliares
│   │à-- App.js                # Componente principal de la aplicación
│   │à-- index.js              # Punto de entrada de React
│à-- server.js              # Servidor Express para la API
│à-- start-all.js          # Script para iniciar cliente y servidor juntos
│à-- start.bat             # Script de inicio rápido para Windows
│à-- package.json          # Dependencias y scripts
│à-- README.md             # Documentación del proyecto
```

---

Desarrollado con ❤️ para la gestión eficiente de ventas con formato chileno.
