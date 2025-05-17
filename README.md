# VentaSoft Analytics Pro - Dashboard de Gestión de Ventas

Una aplicación web moderna para la gestión de ventas, desarrollada con React y Ant Design, optimizada para el formato monetario chileno (CLP). Ofrece una interfaz de usuario mejorada con gráficos interactivos y un diseño intuitivo.

## Índice

- [Características](#características)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Uso](#uso)
- [Funcionalidades](#funcionalidades)
- [Tecnologías](#tecnologías)
- [Estructura del Proyecto](#estructura-del-proyecto)

## Características

- 📊 Dashboard interactivo con gráficos de área y barras personalizados
- 🏈 Tarjetas de reportes con iconos mejorados y efectos visuales
- 💰 Formato monetario chileno (CLP) con separadores de miles
- 📱 Diseño responsive para dispositivos móviles y escritorio
- 💾 Persistencia de datos con archivos JSON
- 🔍 Filtrado y búsqueda avanzada de ventas
- 📝 Registro simplificado de ventas con formulario optimizado

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

### Dashboard Principal Mejorado

El dashboard principal ofrece una experiencia visual mejorada con:

- **Tarjetas de Resumen**: Muestran métricas clave como ventas totales, promedio diario y ventas por tipo de pago, con iconos distintivos y colores temáticos.
- **Gráficos Interactivos**: 
  - **Gráfico de Área**: Visualización de ventas por día de la semana con degradados y efectos visuales.
  - **Gráfico de Barras**: Distribución de ventas por tipo de pago con colores personalizados para cada categoría.
- **Tabla de Ventas Mejorada**: Visualización de ventas con etiquetas de colores para los tipos de pago y mejor formato de datos.

### Página de Reportes Optimizada

- **Tarjetas de Reportes**: Diseño mejorado con iconos más grandes y efectos visuales atractivos.
- **Animaciones de Gradiente**: Fondos dinámicos para las cabeceras de las tarjetas de reportes.
- **Botones de Descarga**: Opciones para descargar reportes en diferentes formatos (Excel, PDF, CSV).

### Formulario de Ventas Simplificado

- **Entrada Mínima de Datos**: Solo requiere monto y tipo de pago, autocompletando fecha y vendedor.
- **Formato CLP Automático**: Los montos se formatean automáticamente con separadores de miles.
- **Interfaz Centrada**: Botones centrados y diseño limpio para mejor experiencia de usuario.
- **Validación Mejorada**: Verificación instantánea de datos para prevenir errores.

### Mejoras en la Interfaz de Usuario

- **Header Rediseñado**: Fondo blanco con bordes redondeados y separador oscuro para mejor contraste.
- **Logo Personalizado**: Nuevo logo con el nombre "VentaSoft Analytics Pro" para una identidad visual más profesional.
- **Espaciado Optimizado**: Mejor distribución de elementos para evitar superposiciones y mejorar la legibilidad.
- **Consistencia Visual**: Paleta de colores coherente en toda la aplicación para una experiencia unificada.

### Navegación Adaptativa

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
src/
│à── components/           # Componentes reutilizables
│   │à── dashboard/        # Componentes específicos del dashboard (gráficos, tablas, etc.)
│   └à── layout/           # Componentes de estructura (header, sidebar)
│à── context/              # Contextos de React para gestión de estado
│à── data/                 # Archivos JSON con datos de la aplicación
│à── pages/                # Páginas principales de la aplicación
│à── styles/               # Archivos CSS organizados por componentes y páginas
│   │à── components/       # Estilos para componentes específicos
│   └à── pages/            # Estilos para páginas completas
└à── utils/                # Utilidades y funciones auxiliares
```

---

Desarrollado con ❤️ para la gestión eficiente de ventas con formato chileno.
