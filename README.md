# 🍦 Donde la Lore - Sistema POS

Sistema de punto de venta (POS) completo para la gestión de heladería artesanal "Donde la Lore". Aplicación web moderna desarrollada con Vue 3 y TypeScript que permite gestionar ventas, inventario, boletas, personalización de productos y visualizar estadísticas en tiempo real.

## ✨ Características

### 🎯 Funcionalidades Principales

#### 🔐 Autenticación y Seguridad
- **Sistema de login** con protección de rutas
- **Logout funcional** desde sidebar y header
- **Control de sesiones** y autenticación persistente
- **Perfil de usuario** con información de sesión

#### 📊 Dashboard Administrativo
- **Gráficos interactivos**: 
  - Gráfico de dona para productos más vendidos
  - Gráfico de líneas para ventas diarias
- **KPIs en tiempo real**:
  - Ingresos totales
  - Gastos
  - Totales calculados
- **Filtros temporales**: Hoy, Semana, Mes, Año
- **Visualización de ventas diarias** con tendencias
- **Lista de mejores recetas**

#### 💳 Punto de Venta (POS)
- **Catálogo de productos** por categorías (Conos y Copas)
- **Búsqueda de productos** en tiempo real
- **Carrito de compras interactivo**:
  - Agregar/eliminar productos
  - Editar cantidades
  - Visualización de subtotales
- **Personalización de productos configurables**:
  - Selección de variaciones (Bañado/No Bañado)
  - Selección de sabores de helado (múltiples bolas)
  - Selección de salsas
  - Selección de frutas
  - Selección de cremas
  - Selección de toppings (con cantidad)
  - Salsas, frutas y cremas extra (con cantidad)
  - Cálculo dinámico de precios según personalización
  - Visualización de detalles de personalización en el pedido y boletas
- **Sistema de descuentos**:
  - Descuentos por porcentaje (hasta 100% configurable)
  - Descuentos por monto fijo
  - Validación de descuentos máximos
  - Botones de acción rápida (5%, 10%, 15%, 20%)
  - Vista previa del impacto del descuento
- **Cálculo automático de IVA**:
  - Precios con IVA incluido (19%)
  - Extracción correcta de IVA para cálculos
  - Visualización clara de subtotales e IVA
- **Selección de método de pago**:
  - Efectivo
  - Débito
  - Crédito
  - Transferencia
- **Registro automático de pedidos** y ventas

#### 📋 Gestión de Boletas
- **Listado completo de ventas** con paginación y filtrado
- **Visualización de detalles de boletas**:
  - Información completa de la venta
  - Detalles de productos personalizados
  - Información de descuentos aplicados
  - Método de pago
  - Fecha y hora
- **Estados de venta**: Emitida/Anulada
- **Anulación de boletas** (solo para administradores)
- **Impresión de boletas en PDF**:
  - Formato HTML listo para imprimir
  - Información completa de la venta
  - Detalles de personalización de productos
  - Cumplimiento con regulaciones SII (Chile)
- **Filtrado y búsqueda** avanzada
- **Protección SII**: Las boletas emitidas no se pueden eliminar (cumplimiento legal)

#### 📦 Gestión de Inventario (IngredientesView)
- **Gestión de Materias Primas**:
  - CRUD completo (Crear, Leer, Actualizar, Eliminar)
  - Control de stock disponible
  - Unidades de medida (g, ml, u)
  - Tipo de ingrediente asociado
  - Búsqueda y filtrado
- **Gestión de Ingredientes**:
  - CRUD completo
  - Porciones estandarizadas
  - Valor extra por selección
  - Asociación con materias primas
  - Sincronización automática de sabores con inventario
  - Tipos de ingredientes: helado, salsa, bañado, fruta, topping, crema, café, leche
- **Gestión de Productos**:
  - CRUD completo
  - Productos configurables y no configurables
  - Reglas de personalización
  - Variaciones de productos (ej: Bañado)
  - Precios base y precios finales
  - Categorías: conos, copas, batidos, etc.
  - Vista de recetas de productos configurables
- **Exportación a Excel/CSV**:
  - Exportación completa del inventario
  - Incluye materias primas, ingredientes y productos
  - Formato CSV compatible con Excel
- **Interfaz tabbed** para fácil navegación entre secciones
- **Principios SOLID**: Arquitectura basada en composables reutilizables

#### 🔔 Sistema de Notificaciones
- **Notificaciones en tiempo real**:
  - Notificaciones de nuevas ventas
  - Alertas de stock
  - Notificaciones de errores
  - Notificaciones de éxito
- **Icono de campana** en sidebar y header
- **Contador de notificaciones no leídas**
- **Modal de notificaciones**:
  - Lista de todas las notificaciones
  - Marcar como leída/no leída
  - Marcar todas como leídas
  - Eliminar notificaciones individuales
  - Limpiar todas las notificaciones
- **Historial de notificaciones** (últimas 50)
- **Tipos de notificaciones**: info, warning, error, success

#### ⚙️ Sistema de Configuración
- **Vista completa de configuración** con pestañas navegables:
  - **Configuración General**:
    - Datos del negocio (nombre comercial, RUT, dirección, teléfono, correo)
    - Logo del negocio
    - Preferencias de idioma y moneda
    - Formato de fecha y hora
    - Zona horaria local
  - **Usuarios y Roles**:
    - Gestión de usuarios
    - Roles y permisos
    - Control de acceso
    - Registro de actividad (logs)
  - **Configuración del POS**:
    - Dispositivos conectados (impresoras térmicas, gaveta de dinero, lector de códigos, pantallas secundarias)
    - Métodos de pago aceptados
    - Formato de boleta/factura
    - Descuentos y promociones
    - Modo offline / sincronización automática
  - **Gestión de Inventario**:
    - Parámetros de stock mínimo y máximo
    - Alertas de inventario bajo
    - Unidades de medida personalizadas
    - Categorías y subcategorías
    - Impuestos aplicables (IVA)
    - Política de redondeo
    - Costos y márgenes automáticos
  - **Documentos y Facturación**:
    - Tipo de comprobantes (boletas, facturas, notas de crédito, guías de despacho)
    - Conectividad con SII (Chile)
    - Plantillas personalizadas de impresión
    - Numeración secuencial y prefijos
    - Copia automática o respaldo en PDF
  - **Notificaciones y Alertas**:
    - Alertas de stock
    - Alertas de ventas altas
    - Alertas de errores en caja
    - Recordatorios automáticos
    - Notificaciones por correo o WhatsApp
  - **Integraciones y Sincronización**:
    - Integración con tienda online / e-commerce
    - Integración con sistemas contables
    - Respaldos automáticos en la nube
    - API keys para conectar aplicaciones externas
  - **Seguridad y Mantenimiento**:
    - Control de sesiones activas
    - Copia de seguridad (manual y automática)
    - Restauración de datos
    - Cifrado de contraseñas y datos sensibles
    - Modo mantenimiento
    - Logs de auditoría
  - **Personalización de Reportes**:
    - Selección de métricas visibles
    - Formato de exportación (PDF, Excel, CSV)
    - Filtros predefinidos
- **Persistencia automática** en localStorage
- **Scroll horizontal con rueda del mouse** en las pestañas
- **Configuración anidada** para mejor organización

## 🛠️ Tecnologías

### Core
- **Vue 3** (Composition API)
- **TypeScript**
- **Vite** - Build tool y dev server

### Estado y Routing
- **Pinia** - Gestión de estado
- **Vue Router 4** - Enrutamiento con guards de autenticación

### Estilos
- **Tailwind CSS v4** - Framework de utilidades CSS
- **PostCSS** - Procesamiento de CSS

### Visualización
- **Chart.js** - Gráficos (dona y líneas)
- **Vue-ChartJS** - Integración de Chart.js con Vue
- **Iconify** - Iconos vectoriales

### Arquitectura
- **Composables** - Lógica reutilizable siguiendo principios SOLID
- **Componentes modulares** - Arquitectura basada en componentes
- **TypeScript** - Tipado estático completo
- **Exportación de datos** - Utilidades para exportar a Excel/CSV

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
│   │   ├── crud/           # Componentes CRUD
│   │   │   ├── MateriaPrimaForm.vue
│   │   │   ├── IngredienteForm.vue
│   │   │   ├── ProductoForm.vue
│   │   │   └── ProductRecipeModal.vue
│   │   ├── DonutChart.vue   # Gráfico de dona
│   │   ├── LineChart.vue    # Gráfico de líneas
│   │   ├── Modal.vue        # Componente modal base
│   │   ├── OrderSidebar.vue # Sidebar de pedidos POS
│   │   ├── ProductCard.vue  # Tarjeta de producto
│   │   ├── ProductCustomizationModal.vue # Modal de personalización
│   │   ├── DiscountModal.vue # Modal de descuentos
│   │   ├── NotificationsModal.vue # Modal de notificaciones
│   │   ├── SaleDetailModal.vue # Modal de detalles de venta
│   │   ├── AddBoletaModal.vue # Modal para añadir boleta manualmente
│   │   ├── Sidebar.vue      # Barra lateral de navegación
│   │   ├── Header.vue       # Header de la aplicación
│   │   └── ...
│   ├── composables/         # Composables reutilizables
│   │   ├── useMateriaPrimaCRUD.ts
│   │   ├── useIngredienteCRUD.ts
│   │   └── useProductoCRUD.ts
│   ├── layouts/             # Layouts de página
│   │   └── MainLayout.vue    # Layout principal con sidebar
│   ├── router/              # Configuración de rutas
│   │   └── index.ts
│   ├── store/               # Stores de Pinia
│   │   ├── auth.ts          # Autenticación
│   │   ├── products.ts      # Productos
│   │   ├── orders.ts        # Pedidos
│   │   ├── sales.ts         # Ventas/Boletas
│   │   ├── inventory.ts     # Inventario (Materias Primas)
│   │   ├── ingredients.ts   # Ingredientes
│   │   ├── notifications.ts # Notificaciones
│   │   └── settings.ts      # Configuración
│   ├── utils/               # Utilidades
│   │   ├── exportUtils.ts   # Utilidades de exportación
│   │   └── validators.ts    # Validadores reutilizables
│   ├── views/               # Vistas/páginas
│   │   ├── LoginView.vue
│   │   ├── DashboardView.vue
│   │   ├── POSView.vue
│   │   ├── BoletasView.vue
│   │   ├── IngredientesView.vue
│   │   └── ConfiguracionView.vue
│   ├── types.ts             # Tipos TypeScript
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
- **Paleta de Colores**: Rosa (#FF69B4) como color primary
- **UI Moderna**: Interfaz limpia y moderna con Tailwind CSS
- **Componentes Modulares**: Arquitectura basada en componentes reutilizables
- **Modales con fondo difuminado**: Efecto blur y opacidad para mejor UX
- **Transiciones suaves**: Animaciones y transiciones para mejor experiencia de usuario

## 🔒 Rutas Protegidas

El sistema implementa protección de rutas mediante guards de Vue Router:
- **Rutas públicas**: `/` (Login)
- **Rutas protegidas**: 
  - `/dashboard` - Dashboard administrativo
  - `/pos` - Punto de venta
  - `/boletas` - Gestión de boletas
  - `/ingredientes` - Gestión de inventario
  - `/configuracion` - Configuración del sistema

## 📊 Stores de Pinia

### `auth`
- Gestión de autenticación
- Persistencia en localStorage
- Estado de usuario
- Funciones de login y logout

### `products`
- Catálogo de productos
- Productos configurables y no configurables
- Categorización (Conos/Copas/Batidos)
- Búsqueda y filtrado
- Reglas de personalización
- Variaciones de productos

### `orders`
- Carrito de compras
- Cálculo de totales (IVA incluido)
- Sistema de descuentos
- Personalización de productos
- Historial de pedidos
- Cálculo de precios personalizados

### `sales`
- Registro de ventas/boletas
- Estados de venta (Emitida/Anulada)
- Anulación de boletas
- Generación de PDF
- Estadísticas y reportes
- Filtrado por período
- Notificaciones automáticas de nuevas ventas

### `inventory`
- Gestión de materias primas
- Control de stock
- Unidades de medida
- Búsqueda y filtrado

### `ingredients`
- Gestión de ingredientes
- Tipos de ingredientes
- Porciones estandarizadas
- Valores extra
- Sincronización con inventario
- Sabores y toppings

### `notifications`
- Sistema de notificaciones
- Notificaciones no leídas
- Historial de notificaciones
- Tipos de notificaciones (info, warning, error, success)

### `settings`
- Configuración del sistema
- Persistencia en localStorage
- Configuración anidada
- Múltiples categorías de configuración
- Migración de configuraciones antiguas

## 🎯 Funcionalidades por Módulo

### Dashboard
- Visualización de KPIs en tiempo real
- Gráfico de productos más vendidos (dona)
- Gráfico de ventas diarias (líneas)
- Lista de mejores recetas
- Filtros temporales funcionales (Hoy, Semana, Mes, Año)
- Cálculos automáticos de ingresos y gastos

### POS
- Selección de productos por categoría
- Búsqueda de productos en tiempo real
- Carrito con edición de cantidades
- **Personalización de productos**:
  - Selección de variaciones
  - Selección de sabores (múltiples bolas)
  - Selección de salsas, frutas, cremas
  - Selección de toppings con cantidad
  - Salsas, frutas y cremas extra
  - Cálculo dinámico de precios
- **Sistema de descuentos**:
  - Por porcentaje o monto fijo
  - Validación de máximos
  - Botones de acción rápida
- Selección de método de pago
- Registro automático de ventas
- Visualización de detalles de personalización en el pedido

### Boletas
- Tabla con todas las ventas
- Vista detallada de cada boleta
- **Visualización de personalización** de productos
- Estados visuales (Emitida/Anulada)
- **Anulación de boletas** (solo administradores)
- **Impresión en PDF** con detalles completos
- Filtrado y búsqueda avanzada
- Protección SII: no se pueden eliminar boletas emitidas

### Ingredientes
- **Gestión de Materias Primas**:
  - CRUD completo
  - Control de stock
  - Unidades de medida
  - Tipo de ingrediente
- **Gestión de Ingredientes**:
  - CRUD completo
  - Porciones estandarizadas
  - Valores extra
  - Asociación con materias primas
  - Sincronización automática
- **Gestión de Productos**:
  - CRUD completo
  - Productos configurables y no configurables
  - Reglas de personalización
  - Variaciones
  - Vista de recetas
- **Exportación a Excel/CSV**
- Interfaz tabbed para fácil navegación
- Búsqueda y filtrado
- Arquitectura basada en composables SOLID

### Configuración
- **Vista completa de configuración** con 9 pestañas:
  1. Configuración General
  2. Usuarios y Roles
  3. Configuración del POS
  4. Gestión de Inventario
  5. Documentos y Facturación
  6. Notificaciones y Alertas
  7. Integraciones y Sincronización
  8. Seguridad y Mantenimiento
  9. Personalización de Reportes
- Persistencia automática en localStorage
- Scroll horizontal con rueda del mouse
- Configuración anidada para mejor organización

### Notificaciones
- Sistema de notificaciones en tiempo real
- Icono de campana en sidebar y header
- Contador de notificaciones no leídas
- Modal de notificaciones con gestión completa
- Notificaciones automáticas de nuevas ventas
- Historial de notificaciones (últimas 50)

## 🔧 Configuración

### Variables de Entorno

Actualmente no se requieren variables de entorno. Para producción, se pueden agregar:
- API endpoints
- Configuraciones de autenticación
- Configuraciones de base de datos

### Tailwind CSS

El proyecto usa Tailwind CSS v4 con configuración en `src/style.css` usando `@theme` para variables personalizadas.

### TypeScript

El proyecto usa TypeScript con tipos completos definidos en `src/types.ts`:
- `Id` - Identificadores (number | string)
- `Unidad` - Unidades de medida (g, ml, u)
- `TipoIngrediente` - Tipos de ingredientes
- `MateriaPrima` - Materias primas
- `Ingrediente` - Ingredientes
- `Producto` - Productos (configurables y no configurables)
- `ProductCustomization` - Personalización de productos
- Y más...

## 🏗️ Arquitectura

### Principios SOLID
- **Single Responsibility**: Cada composable tiene una responsabilidad única
- **Open/Closed**: Extensible sin modificar código existente
- **Liskov Substitution**: Interfaces consistentes
- **Interface Segregation**: Interfaces específicas
- **Dependency Inversion**: Dependencias de abstracciones, no implementaciones

### Composables
- `useMateriaPrimaCRUD` - Operaciones CRUD de materias primas
- `useIngredienteCRUD` - Operaciones CRUD de ingredientes
- `useProductoCRUD` - Operaciones CRUD de productos

### Componentes CRUD
- Formularios reutilizables para cada entidad
- Validación de datos
- Manejo de errores
- Prevención de ciclos infinitos de reactividad

## 🚧 Próximas Funcionalidades

- [ ] Integración con API backend
- [ ] Sistema de roles y permisos más avanzado
- [ ] Múltiples sucursales
- [ ] Gestión de empleados
- [ ] Reportes avanzados con gráficos
- [ ] Integración con sistemas de pago
- [ ] App móvil
- [ ] Modo offline completo
- [ ] Sincronización en tiempo real
- [ ] Integración con SII (Chile) para facturación electrónica

## 📝 Notas de Desarrollo

### Cumplimiento SII (Chile)
- Las boletas emitidas no se pueden eliminar (cumplimiento legal)
- Se implementa anulación de boletas en lugar de eliminación
- Las boletas anuladas mantienen su historial

### Personalización de Productos
- Los productos configurables permiten personalización completa
- Los detalles de personalización se muestran en el pedido y en las boletas
- Los precios se calculan dinámicamente según la personalización

### Sistema de Descuentos
- Los descuentos se aplican al subtotal
- El IVA se calcula después de aplicar el descuento
- Validación de descuentos máximos para prevenir errores

## 📝 Licencia

Este proyecto es privado y propiedad de "Donde la Lore".
