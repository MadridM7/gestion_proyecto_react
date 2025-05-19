# VentaSoft Analytics Pro - Dashboard de Gestión de Ventas

## Descripción del Sistema

VentaSoft Analytics Pro es una aplicación web moderna para la gestión de ventas, desarrollada con React y Ant Design, optimizada para el formato monetario chileno (CLP). Ofrece una interfaz de usuario mejorada con gráficos interactivos y un diseño intuitivo que sigue los principios de Atomic Design para una mejor organización del código. 

La aplicación permite a los usuarios gestionar ventas, productos y usuarios a través de una interfaz amigable y responsive. Todos los datos se guardan directamente en archivos JSON, lo que permite una persistencia de datos sin necesidad de una base de datos externa.

**Última actualización: Mayo 2025** - Implementación de tarjetas dinámicas en el dashboard y mejoras en la visualización de gráficos.

## Índice

- [Características Principales](#características-principales)
- [Instalación](#instalación)
- [Uso](#uso)
- [Tecnologías Implementadas](#tecnologías-implementadas)
- [Estructura del Proyecto](#estructura-del-proyecto)

## Características Principales

- 📊 **Dashboard interactivo** con gráficos de área y barras personalizados con efectos de hover
- 🏈 **Tarjetas dinámicas** que se generan automáticamente basándose en los datos de dashboard.json
- 💰 **Formato monetario chileno (CLP)** con separadores de miles
- 📱 **Diseño responsive** para dispositivos móviles y escritorio
- 💾 **Persistencia de datos** con archivos JSON
- 🔍 **Filtrado y búsqueda avanzada** de ventas, productos y usuarios
- 💻 **Arquitectura cliente-servidor** con Express para manejar operaciones CRUD

## Instalación

### Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (versión 14.0.0 o superior)
- [npm](https://www.npmjs.com/) (normalmente viene con Node.js)
- [Git](https://git-scm.com/) para clonar el repositorio

### Pasos de Instalación

1. **Clonar el Repositorio**

   ```bash
   git clone https://github.com/tu-usuario/react-dashboard-ui.git
   cd react-dashboard-ui
   ```

2. **Instalar Dependencias**

   ```bash
   npm install
   ```

3. **Configuración del Entorno**

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

### Navegación por la Aplicación

1. **Dashboard Principal**: Visualiza estadísticas clave y gráficos de ventas
2. **Gestión de Ventas**: Agrega, edita y elimina registros de ventas
3. **Gestión de Productos**: Administra el catálogo de productos
4. **Gestión de Usuarios**: Controla los usuarios del sistema



## Tecnologías Implementadas

- **Frontend**:
  - [React](https://reactjs.org/) - Biblioteca JavaScript para construir interfaces de usuario
  - [Ant Design](https://ant.design/) - Sistema de diseño y biblioteca de componentes UI
  - [Recharts](https://recharts.org/) - Biblioteca de gráficos basada en componentes React
  - [React Router](https://reactrouter.com/) - Enrutamiento para aplicaciones React

- **Backend**:
  - [Express](https://expressjs.com/) - Framework para Node.js para crear APIs
  - Archivos JSON para almacenamiento de datos

- **Gestión de Estado**:
  - React Context API - Gestión de estado global sin dependencias externas

- **Utilidades**:
  - [Moment.js](https://momentjs.com/) - Biblioteca para manipulación y formato de fechas

- **Estilos**:
  - CSS externo organizado siguiendo principios de Atomic Design
  - Estilos modulares para componentes específicos

## Estructura del Proyecto

El proyecto sigue la arquitectura Atomic Design para la organización de componentes, lo que facilita la reutilización y el mantenimiento del código.

```
react-dashboard-ui/
│
├── public/               # Archivos públicos y estáticos
│
├── server/               # Archivos relacionados con el servidor
│
├── src/                  # Código fuente de la aplicación React
│   │
│   ├── components/       # Componentes reutilizables (Arquitectura Atomic Design)
│   │   │
│   │   ├── atoms/        # Componentes atómicos (botones, inputs, iconos)
│   │   │   └── FloatingActionButton.js  # Botón de acción flotante
│   │   │
│   │   ├── molecules/    # Componentes moleculares (grupos de átomos)
│   │   │   ├── AddSaleButton.js  # Botón para agregar ventas
│   │   │   ├── ReportCard.js     # Tarjeta de reportes
│   │   │   └── SearchInput.js    # Componente de búsqueda
│   │   │
│   │   ├── organisms/    # Componentes organismos (secciones complejas)
│   │   │   ├── DataTable.js          # Tabla de datos genérica
│   │   │   ├── VentasDataTable.js    # Tabla de ventas
│   │   │   ├── VentasDashboard.js    # Dashboard de ventas
│   │   │   └── UsuariosStats.js      # Estadísticas de usuarios
│   │   │
│   │   ├── templates/    # Plantillas de páginas
│   │   │   └── VentasTemplate.js     # Plantilla de ventas
│   │   │
│   │   └── layout/       # Componentes de layout
│   │       └── MainLayout.js         # Layout principal de la aplicación
│   │
│   ├── context/          # Contextos de React para gestión de estado
│   │   └── VentasContext.js  # Contexto para la gestión de ventas
│   │
│   ├── data/             # Archivos JSON con datos de la aplicación
│   │
│   ├── pages/            # Páginas principales de la aplicación
│   │
│   ├── services/         # Servicios para comunicación con el servidor
│   │
│   ├── styles/           # Archivos CSS y estilos
│   │   └── components/   # Estilos específicos para componentes
│   │       ├── atoms/
│   │       ├── molecules/
│   │       ├── organisms/
│   │       └── templates/
│   │
│   ├── utils/            # Utilidades y funciones auxiliares
│   │
│   ├── App.js            # Componente principal de la aplicación
│   └── index.js          # Punto de entrada de React
│
├── server.js             # Servidor Express para la API
├── start-all.js          # Script para iniciar cliente y servidor juntos
├── start.bat             # Script de inicio rápido para Windows
├── package.json          # Dependencias y scripts
└── README.md             # Documentación del proyecto
```

---

Desarrollado con ❤️ para la gestión eficiente de ventas con formato chileno.

**© 2025 VentaSoft Analytics Pro**
