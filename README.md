# Dashboard de Gestión de Ventas con React y Ant Design

Una aplicación web moderna para la gestión de ventas, desarrollada con React y Ant Design, optimizada para el formato monetario chileno (CLP).

## Índice

- [Características](#características)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Uso](#uso)
- [Funcionalidades](#funcionalidades)
- [Tecnologías](#tecnologías)
- [Estructura del Proyecto](#estructura-del-proyecto)

## Características

- 📊 Dashboard interactivo con gráficos y estadísticas
- 💰 Formato monetario chileno (CLP) con separadores de miles
- 📱 Diseño responsive para dispositivos móviles y escritorio
- 💾 Persistencia de datos con localStorage
- 🔍 Filtrado y búsqueda avanzada de ventas
- 📝 Registro de nuevas ventas con validación de datos

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

### Iniciar el Servidor de Desarrollo

```bash
npm start
```

Esto iniciará el servidor de desarrollo en [http://localhost:3000](http://localhost:3000).

### Compilar para Producción

```bash
npm run build
```

## Funcionalidades

### Dashboard Principal

El dashboard principal muestra una visión general del negocio con:

- **Tarjetas de Resumen**: Muestran métricas clave como ventas totales, promedio diario y tendencias.
- **Gráficos Interactivos**: Visualización de datos de ventas por período y categoría.
- **Ventas Recientes**: Últimas ventas registradas en el sistema.

### Gestión de Ventas

- **Registro de Ventas**: Formulario optimizado para agregar nuevas ventas con validación de datos.
- **Tabla de Ventas**: Visualización detallada de todas las ventas con opciones de filtrado y ordenamiento.
- **Acciones Rápidas**: Eliminar ventas directamente desde la tabla.

### Características del Formulario de Ventas

- **Formato CLP**: Los montos se muestran y se ingresan con formato chileno (puntos como separadores de miles).
- **Teclado Numérico**: En dispositivos móviles, se abre automáticamente el teclado numérico para facilitar la entrada de datos.
- **Validación**: Verificación de datos antes de registrar la venta para evitar errores.

### Persistencia de Datos

- Los datos de ventas se almacenan en localStorage, permitiendo que la información persista entre sesiones.
- Las fechas se convierten correctamente entre formato string y objeto Date para mantener la integridad de los datos.

### Navegación Adaptativa

- **Título Dinámico**: El encabezado muestra el título de la sección actual para mejor orientación.
- **Barra Lateral Responsive**: Se adapta a diferentes tamaños de pantalla, con modo colapsable en dispositivos móviles.
- **Botón Flotante**: En dispositivos móviles, un botón flotante permite agregar ventas rápidamente desde cualquier sección.

## Tecnologías

- **Framework**: [React](https://reactjs.org/)
- **UI Components**: [Ant Design](https://ant.design/)
- **Gráficos**: [Recharts](https://recharts.org/)
- **Enrutamiento**: [React Router](https://reactrouter.com/)
- **Gestión de Estado**: React Context API
- **Almacenamiento**: localStorage

## Estructura del Proyecto

```
src/
├── components/           # Componentes reutilizables
│   ├── charts/           # Componentes de gráficos
│   ├── dashboard/        # Componentes específicos del dashboard
│   └── layout/           # Componentes de estructura (header, sidebar)
├── context/              # Contextos de React para gestión de estado
├── pages/                # Páginas de la aplicación
└── utils/                # Utilidades y funciones auxiliares
```

---

Desarrollado con ❤️ para la gestión eficiente de ventas con formato chileno.
