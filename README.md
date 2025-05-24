# VenTrack - Sistema de Gestión de negocio

## Descripción del Sistema

VenTrack es una aplicación web moderna para la gestión de negocio, desarrollada con React, Ant Design y usando la arquitectura de Atomic Design. Ofrece una interfaz de usuario mejorada con gráficos interactivos y un diseño intuitivo.

La aplicación permite a los usuarios gestionar ventas, productos, usuarios y pedidos a través de una interfaz amigable y responsive. Todos los datos se guardan directamente en archivos JSON, lo que permite una persistencia de datos sin necesidad de una base de datos externa.

## Índice

- [Características Principales](#características-principales)
- [Instalación](#instalación)
- [Uso](#uso)
- [Tecnologías Implementadas](#tecnologías-implementadas)
- [Estructura del Proyecto](#estructura-del-proyecto)

## Características Principales

- 📊 **Dashboard interactivo** con gráficos de área y barras personalizados con efectos de hover
- 🏈 **Tarjetas dinámicas** que se generan automáticamente basándose en los datos de dashboard.json
- 📊 **Gráficos interactivos** con Recharts
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

### Navegación por la Aplicación

1. **Dashboard**: Visualiza estadísticas clave y gráficos de ventas
2. **Gestión de Ventas**: Agrega, edita y elimina registros de ventas
3. **Gestión de Productos**: Administra el catálogo de productos
4. **Gestión de Usuarios**: Controla los usuarios del sistema
5. **Gestión de Pedidos**: Administra los pedidos del sistema


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

- **Arquitectura**:
  - [Atomic Design](https://bradfrost.com/blog/atomic-design/) - Arquitectura para la organización de componentes

## Estructura del Proyecto

El proyecto sigue la arquitectura Atomic Design para la organización de componentes, lo que facilita la reutilización y el mantenimiento del código.

```
react-dashboard-ui/
├── public/                  # Archivos públicos y estáticos
│   ├── index.html           # Página principal
│   ├── favicon.ico          # Icono de la aplicación
│   ├── manifest.json        # Configuración para PWA
│   └── robots.txt           # Configuración de robots
├── server/                  # Archivos relacionados con el servidor
│   ├── api/                 # Endpoints de la API
│   │   ├── products.js      # API de productos
│   │   ├── sales.js         # API de ventas
│   │   ├── users.js         # API de usuarios
│   │   └── orders.js        # API de pedidos
│   ├── data/                # Archivos JSON para almacenamiento
│   │   ├── products.json    # Datos de productos
│   │   ├── sales.json       # Datos de ventas
│   │   ├── users.json       # Datos de usuarios
│   │   ├── orders.json      # Datos de pedidos
│   │   └── dashboard.json   # Datos para el dashboard
│   ├── middleware/          # Middleware del servidor
│   │   └── auth.js          # Autenticación
│   ├── utils/               # Utilidades del servidor
│   │   └── fileHelpers.js   # Ayudantes para manejo de archivos
│   ├── server.js            # Servidor Express para la API
│   └── start-all.js         # Script para iniciar cliente y servidor
├── src/                     # Código fuente de la aplicación React
│   ├── assets/              # Archivos estáticos
│   │   ├── images/          # Imágenes y logos
│   │   ├── icons/           # Iconos personalizados
│   │   └── styles/          # Estilos globales CSS
│   ├── components/          # Componentes siguiendo Atomic Design
│   │   ├── atoms/           # Componentes más básicos
│   │   │   ├── Button/      # Botones personalizados
│   │   │   ├── Input/       # Campos de entrada
│   │   │   ├── Select/      # Selectores
│   │   │   ├── Typography/  # Elementos de texto
│   │   │   └── DatePicker/  # Selector de fechas personalizado
│   │   ├── molecules/       # Combinaciones de átomos
│   │   │   ├── Card/        # Tarjetas de información
│   │   │   ├── Form/        # Componentes de formulario
│   │   │   ├── Table/       # Tablas personalizadas
│   │   │   └── Modal/       # Ventanas modales
│   │   ├── organisms/       # Secciones completas
│   │   │   ├── Header/      # Encabezado de la aplicación
│   │   │   ├── Sidebar/     # Barra lateral de navegación
│   │   │   ├── DataTable/   # Tablas de datos con funcionalidades
│   │   │   ├── Charts/      # Componentes de gráficos
│   │   │   └── Forms/       # Formularios completos
│   │   ├── templates/       # Plantillas de página
│   │   │   ├── DashboardTemplate/  # Plantilla para dashboard
│   │   │   ├── ListTemplate/       # Plantilla para listas
│   │   │   └── FormTemplate/       # Plantilla para formularios
│   │   └── wrappers/        # Componentes de envoltura
│   │       ├── AuthWrapper/         # Envoltorio de autenticación
│   │       └── ReactDatePickerWrapper/ # Envoltorio para DatePicker
│   ├── context/             # Contextos de React
│   │   ├── AuthContext.js   # Contexto de autenticación
│   │   ├── ThemeContext.js  # Contexto de tema
│   │   └── DataContext.js   # Contexto de datos
│   ├── data/                # Datos estáticos y mocks
│   │   └── initialData.js   # Datos iniciales para desarrollo
│   ├── hooks/               # Hooks personalizados
│   │   ├── useApi.js        # Hook para llamadas a la API
│   │   ├── useAuth.js       # Hook para autenticación
│   │   └── useForm.js       # Hook para manejo de formularios
│   ├── layouts/             # Layouts de la aplicación
│   │   ├── MainLayout.js    # Layout principal con sidebar
│   │   └── AuthLayout.js    # Layout para páginas de autenticación
│   ├── pages/               # Páginas principales
│   │   ├── Dashboard/       # Página de dashboard
│   │   ├── Sales/           # Gestión de ventas
│   │   ├── Products/        # Gestión de productos
│   │   ├── Users/           # Gestión de usuarios
│   │   ├── Orders/          # Gestión de pedidos
│   │   ├── Reports/         # Generación de reportes
│   │   ├── Settings/        # Configuración del sistema
│   │   └── Auth/            # Páginas de autenticación
│   ├── services/            # Servicios de datos
│   │   ├── api.js           # Cliente API centralizado
│   │   ├── salesService.js  # Servicio para ventas
│   │   ├── productService.js # Servicio para productos
│   │   ├── userService.js   # Servicio para usuarios
│   │   └── orderService.js  # Servicio para pedidos
│   ├── utils/               # Utilidades
│   │   ├── formatters.js    # Formateadores (fechas, moneda)
│   │   ├── validators.js    # Validadores de formularios
│   │   ├── constants.js     # Constantes de la aplicación
│   │   └── helpers.js       # Funciones auxiliares
│   ├── routes/              # Configuración de rutas
│   │   ├── AppRoutes.js     # Rutas principales
│   │   └── PrivateRoute.js  # Componente para rutas privadas
│   ├── App.js               # Componente principal
│   ├── index.js             # Punto de entrada
│   └── setupTests.js        # Configuración de pruebas
├── tests/                   # Pruebas
│   ├── unit/                # Pruebas unitarias
│   └── integration/         # Pruebas de integración
├── start.bat                # Script de inicio rápido para Windows
├── .env                     # Variables de entorno
├── .eslintrc.js             # Configuración de ESLint
├── .prettierrc              # Configuración de Prettier
├── jsconfig.json            # Configuración de JavaScript
├── package.json             # Dependencias y scripts
├── package-lock.json        # Lock de dependencias
├── README.md                # Documentación del proyecto
└── .gitignore               # Archivos ignorados por Git
```

### Organización según Atomic Design

La estructura de componentes sigue la metodología Atomic Design, que organiza los componentes en cinco niveles de complejidad creciente:

1. **Átomos**: Los componentes más básicos como botones, inputs, etiquetas, etc. No dependen de otros componentes.

2. **Moléculas**: Combinaciones de átomos que forman componentes con una funcionalidad específica.

3. **Organismos**: Secciones completas de la interfaz compuestas por moléculas y átomos.

4. **Plantillas**: Esqueletos de página que organizan la disposición de los organismos.

5. **Páginas**: Instancias específicas de plantillas con contenido real.

### Sistema de Datos

La aplicación utiliza un enfoque de almacenamiento basado en archivos JSON para la persistencia de datos:

- Los datos se almacenan en archivos JSON en la carpeta `server/data/`
- El servidor Express proporciona una API RESTful para operaciones CRUD
- Los servicios en el frontend (`src/services/`) encapsulan la lógica de comunicación con la API
- Se utiliza React Context para la gestión del estado global

### Gestión de Fechas

Se ha implementado un sistema personalizado para la gestión de fechas:

- Se reemplazaron los DatePickers de Ant Design con un wrapper personalizado basado en react-datepicker
- Se implementó un portal para mejorar la visualización del calendario
- Las funciones de exportación de reportes trabajan con objetos Date nativos en lugar de moment.js

---
**© 2025 VenTrack**
