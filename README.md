# 🍦 Donde la Lore - Sistema POS

Sistema de punto de venta (POS) completo para la gestión de heladería artesanal "Donde la Lore". Aplicación web moderna desarrollada con Vue 3 y TypeScript que permite gestionar ventas, inventario, boletas y visualizar estadísticas en tiempo real.

## ✨ Características

### 🎯 Funcionalidades Principales

- **🔐 Autenticación**: Sistema de login con protección de rutas
- **📊 Dashboard Administrativo**: 
  - Gráficos de ventas y productos más vendidos
  - KPIs (Ingresos, Gastos, Totales)
  - Filtros temporales (Hoy, Semana, Mes, Año)
  - Visualización de ventas diarias
- **💳 Punto de Venta (POS)**:
  - Catálogo de productos por categorías (Conos y Copas)
  - Carrito de compras interactivo
  - Selección de método de pago (Efectivo, Débito, Crédito, Transferencia)
  - Cálculo automático de IVA (19%)
  - Registro de pedidos
- **📋 Gestión de Boletas**:
  - Listado completo de ventas
  - Visualización de detalles de boletas
  - Estados de venta (Emitida/Anulada)
  - Filtrado y búsqueda
- **📦 Gestión de Inventario**:
  - Control de ingredientes
  - Alertas de stock (Bajo stock, Sin stock, Stock estancado)
  - CRUD completo de ingredientes
  - Seguimiento de cantidades y precios

## 🛠️ Tecnologías

### Core
- **Vue 3** (Composition API)
- **TypeScript**
- **Vite** - Build tool y dev server

### Estado y Routing
- **Pinia** - Gestión de estado
- **Vue Router 4** - Enrutamiento

### Estilos
- **Tailwind CSS v4** - Framework de utilidades CSS
- **PostCSS** - Procesamiento de CSS

### Visualización
- **Chart.js** - Gráficos (dona y líneas)
- **Vue-ChartJS** - Integración de Chart.js con Vue
- **Iconify** - Iconos vectoriales

## 📦 Instalación

### Prerrequisitos

- Node.js 18+ 
- pnpm (recomendado) o npm

### Pasos

1. **Clonar el repositorio**
```bash
git clone https://github.com/hirojika/front-pos.git
cd front-pos
```

2. **Instalar dependencias**
```bash
pnpm install
```

3. **Ejecutar en desarrollo**
```bash
pnpm dev
```

La aplicación estará disponible en `http://localhost:5173`

## 🚀 Scripts Disponibles

```bash
# Desarrollo
pnpm dev          # Inicia servidor de desarrollo con hot-reload

# Producción
pnpm build        # Compila para producción
pnpm preview      # Previsualiza el build de producción
```

## 📁 Estructura del Proyecto

```
front-POS/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── DonutChart.vue   # Gráfico de dona
│   │   ├── LineChart.vue    # Gráfico de líneas
│   │   ├── Modal.vue        # Componente modal base
│   │   ├── OrderSidebar.vue # Sidebar de pedidos POS
│   │   ├── ProductCard.vue  # Tarjeta de producto
│   │   ├── Sidebar.vue      # Barra lateral de navegación
│   │   └── ...
│   ├── layouts/             # Layouts de página
│   │   └── MainLayout.vue    # Layout principal con sidebar
│   ├── router/              # Configuración de rutas
│   │   └── index.ts
│   ├── store/               # Stores de Pinia
│   │   ├── auth.ts          # Autenticación
│   │   ├── products.ts      # Productos
│   │   ├── orders.ts        # Pedidos
│   │   ├── sales.ts         # Ventas/Boletas
│   │   └── inventory.ts     # Inventario
│   ├── views/               # Vistas/páginas
│   │   ├── LoginView.vue
│   │   ├── DashboardView.vue
│   │   ├── POSView.vue
│   │   ├── BoletasView.vue
│   │   └── IngredientesView.vue
│   ├── App.vue              # Componente raíz
│   ├── main.ts              # Entry point
│   └── style.css            # Estilos globales
├── public/                  # Archivos estáticos
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js       # Configuración de Tailwind
└── tsconfig.json            # Configuración de TypeScript
```

## 🎨 Características de Diseño

- **Diseño Responsive**: Adaptable a diferentes tamaños de pantalla
- **Paleta de Colores**: Rosa (#FF69B4) como color principal
- **UI Moderna**: Interfaz limpia y moderna con Tailwind CSS
- **Componentes Modulares**: Arquitectura basada en componentes reutilizables

## 🔒 Rutas Protegidas

El sistema implementa protección de rutas mediante guards de Vue Router:
- Rutas públicas: `/` (Login)
- Rutas protegidas: `/dashboard`, `/pos`, `/boletas`, `/ingredientes`

## 📊 Stores de Pinia

### `auth`
- Gestión de autenticación
- Persistencia en localStorage
- Estado de usuario

### `products`
- Catálogo de productos
- Categorización (Conos/Copas)
- Búsqueda y filtrado

### `orders`
- Carrito de compras
- Cálculo de totales (IVA incluido)
- Historial de pedidos

### `sales`
- Registro de ventas/boletas
- Estadísticas y reportes
- Filtrado por período

### `inventory`
- Gestión de ingredientes
- Alertas de stock
- Control de inventario

## 🎯 Funcionalidades por Módulo

### Dashboard
- Visualización de KPIs en tiempo real
- Gráfico de productos más vendidos
- Gráfico de ventas diarias
- Lista de mejores recetas
- Filtros temporales funcionales

### POS
- Selección de productos por categoría
- Búsqueda de productos
- Carrito con edición de cantidades
- Selección de método de pago
- Registro automático de ventas

### Boletas
- Tabla con todas las ventas
- Vista detallada de cada boleta
- Estados visuales (Emitida/Anulada)
- Acciones: Ver detalles, Eliminar

### Ingredientes
- Lista completa de ingredientes
- Alertas de stock automáticas
- CRUD completo (Crear, Leer, Actualizar, Eliminar)
- Información de precios y cantidades

## 🔧 Configuración

### Variables de Entorno

Actualmente no se requieren variables de entorno. Para producción, se pueden agregar:
- API endpoints
- Configuraciones de autenticación
- Configuraciones de base de datos

### Tailwind CSS

El proyecto usa Tailwind CSS v4 con configuración en `src/style.css` usando `@theme` para variables personalizadas.

## 🚧 Próximas Funcionalidades

- [ ] Integración con API backend
- [ ] Generación de reportes PDF
- [ ] Sistema de notificaciones
- [ ] Perfil de usuario
- [ ] Configuración del sistema
- [ ] Múltiples sucursales
- [ ] Gestión de empleados

## 📝 Licencia

Este proyecto es privado y propiedad de "Donde la Lore".
