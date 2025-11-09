<template>
  <div class="min-h-full flex flex-col">
    <Header title="Configuración" />
    <main class="flex-1 p-6">
      <div class="h-full flex flex-col">
        <!-- Tabs de navegación -->
        <div class="bg-white rounded-lg shadow mb-6 shrink-0">
          <div class="border-b border-gray-200">
            <nav 
              ref="tabsNavRef"
              class="flex overflow-x-auto -mb-px"
              @wheel.prevent="handleWheelScroll"
            >
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="[
                  'px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors',
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                ]"
              >
                <Icon :icon="tab.icon" class="w-5 h-5 inline-block mr-2" />
                {{ tab.label }}
              </button>
            </nav>
          </div>
        </div>

        <!-- Contenido de las tabs -->
        <div class="bg-white rounded-lg shadow p-6 flex-1 overflow-y-auto">
          <!-- 1. Configuración General -->
          <div v-show="activeTab === 'general'">
            <h3 class="text-xl font-semibold text-gray-900 mb-6">Configuración General</h3>
            
            <!-- Datos del negocio -->
            <div class="mb-8">
              <h4 class="text-lg font-medium text-gray-800 mb-4">Datos del Negocio</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Comercial *
                  </label>
                  <input
                    v-model="settingsStore.settings.businessInfo.nombreComercial"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Ej: Heladería El Paraíso"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    RUT *
                  </label>
                  <input
                    v-model="settingsStore.settings.businessInfo.rut"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Ej: 12.345.678-9"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Dirección *
                  </label>
                  <input
                    v-model="settingsStore.settings.businessInfo.direccion"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Ej: Av. Principal 123"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono *
                  </label>
                  <input
                    v-model="settingsStore.settings.businessInfo.telefono"
                    type="tel"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Ej: +56 9 1234 5678"
                  />
                </div>
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Correo Electrónico *
                  </label>
                  <input
                    v-model="settingsStore.settings.businessInfo.correo"
                    type="email"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Ej: contacto@heladeria.cl"
                  />
                </div>
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Logo del Negocio
                  </label>
                  <div class="flex items-center gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      @change="handleLogoUpload"
                      class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark"
                    />
                    <img
                      v-if="settingsStore.settings.businessInfo.logo"
                      :src="settingsStore.settings.businessInfo.logo"
                      alt="Logo"
                      class="w-20 h-20 object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Preferencias -->
            <div class="mb-8">
              <h4 class="text-lg font-medium text-gray-800 mb-4">Preferencias</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Idioma
                  </label>
                  <select
                    v-model="settingsStore.settings.idioma"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="es">Español</option>
                    <option value="en">English</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Moneda
                  </label>
                  <select
                    v-model="settingsStore.settings.moneda"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="CLP">CLP - Peso Chileno</option>
                    <option value="USD">USD - Dólar Estadounidense</option>
                    <option value="EUR">EUR - Euro</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Formato de Fecha
                  </label>
                  <select
                    v-model="settingsStore.settings.formatoFecha"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Formato de Hora
                  </label>
                  <select
                    v-model="settingsStore.settings.formatoHora"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="24h">24 horas</option>
                    <option value="12h">12 horas (AM/PM)</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Zona Horaria
                  </label>
                  <select
                    v-model="settingsStore.settings.zonaHoraria"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="America/Santiago">America/Santiago (Chile)</option>
                    <option value="America/Lima">America/Lima (Perú)</option>
                    <option value="America/Bogota">America/Bogota (Colombia)</option>
                    <option value="America/Mexico_City">America/Mexico_City (México)</option>
                    <option value="America/New_York">America/New_York (EE.UU. Este)</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Tema Visual
                  </label>
                  <select
                    v-model="settingsStore.settings.tema"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="light">Claro</option>
                    <option value="dark">Oscuro</option>
                    <option value="auto">Automático</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- 2. Usuarios y Roles -->
          <div v-show="activeTab === 'users'">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-semibold text-gray-900">Usuarios y Roles</h3>
              <button
                @click="showUserModal = true"
                class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
              >
                <Icon icon="mdi:account-plus" class="w-5 h-5" />
                Agregar Usuario
              </button>
            </div>
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p class="text-sm text-yellow-800">
                <Icon icon="mdi:information" class="w-5 h-5 inline-block mr-2" />
                La gestión completa de usuarios y roles estará disponible en una futura actualización.
              </p>
            </div>
            <div class="space-y-4">
              <div class="p-4 bg-gray-50 rounded-lg">
                <h4 class="font-medium text-gray-800 mb-2">Roles Disponibles</h4>
                <ul class="space-y-2 text-sm text-gray-600">
                  <li>• <strong>Administrador:</strong> Acceso completo al sistema</li>
                  <li>• <strong>Vendedor:</strong> Puede realizar ventas y consultar inventario</li>
                  <li>• <strong>Supervisor:</strong> Puede ver reportes y gestionar inventario</li>
                  <li>• <strong>Bodeguero:</strong> Gestión de inventario únicamente</li>
                </ul>
              </div>
              <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <label class="text-sm font-medium text-gray-700">Control de Sesiones</label>
                  <p class="text-xs text-gray-500">Registrar actividad de usuarios para auditorías</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    v-model="settingsStore.settings.securitySettings.logsAuditoria"
                    type="checkbox"
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </div>

          <!-- 3. Configuración del POS -->
          <div v-show="activeTab === 'pos'">
            <h3 class="text-xl font-semibold text-gray-900 mb-6">Configuración del Punto de Venta</h3>
            
            <!-- Dispositivos -->
            <div class="mb-8">
              <h4 class="text-lg font-medium text-gray-800 mb-4">Dispositivos Conectados</h4>
              <div class="space-y-4">
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label class="text-sm font-medium text-gray-700">Impresora Térmica</label>
                    <p class="text-xs text-gray-500">Conectar impresora térmica para boletas</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      v-model="settingsStore.settings.posSettings.impresoraTermica"
                      type="checkbox"
                      class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label class="text-sm font-medium text-gray-700">Gaveta de Dinero</label>
                    <p class="text-xs text-gray-500">Gaveta automática para efectivo</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      v-model="settingsStore.settings.posSettings.gavetaDinero"
                      type="checkbox"
                      class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label class="text-sm font-medium text-gray-700">Lector de Códigos</label>
                    <p class="text-xs text-gray-500">Escáner de códigos de barras</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      v-model="settingsStore.settings.posSettings.lectorCodigos"
                      type="checkbox"
                      class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label class="text-sm font-medium text-gray-700">Pantalla Secundaria</label>
                    <p class="text-xs text-gray-500">Pantalla para mostrar pedidos al cliente</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      v-model="settingsStore.settings.posSettings.pantallaSecundaria"
                      type="checkbox"
                      class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>

            <!-- Métodos de pago -->
            <div class="mb-8">
              <h4 class="text-lg font-medium text-gray-800 mb-4">Métodos de Pago Aceptados</h4>
              <div class="space-y-3">
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <label class="text-sm font-medium text-gray-700">Efectivo</label>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      v-model="settingsStore.settings.posSettings.metodosPago.efectivo"
                      type="checkbox"
                      class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <label class="text-sm font-medium text-gray-700">Tarjeta</label>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      v-model="settingsStore.settings.posSettings.metodosPago.tarjeta"
                      type="checkbox"
                      class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <label class="text-sm font-medium text-gray-700">Transferencia</label>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      v-model="settingsStore.settings.posSettings.metodosPago.transferencia"
                      type="checkbox"
                      class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <label class="text-sm font-medium text-gray-700">Crédito</label>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      v-model="settingsStore.settings.posSettings.metodosPago.credito"
                      type="checkbox"
                      class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <label class="text-sm font-medium text-gray-700">Vales</label>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      v-model="settingsStore.settings.posSettings.metodosPago.vales"
                      type="checkbox"
                      class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>

            <!-- Modo offline -->
            <div class="space-y-4">
              <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <label class="text-sm font-medium text-gray-700">Modo Offline</label>
                  <p class="text-xs text-gray-500">Permitir trabajar sin conexión a internet</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    v-model="settingsStore.settings.posSettings.modoOffline"
                    type="checkbox"
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <label class="text-sm font-medium text-gray-700">Sincronización Automática</label>
                  <p class="text-xs text-gray-500">Sincronizar datos automáticamente cuando hay conexión</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    v-model="settingsStore.settings.posSettings.sincronizacionAutomatica"
                    type="checkbox"
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </div>

          <!-- 4. Gestión de Inventario -->
          <div v-show="activeTab === 'inventory'">
            <h3 class="text-xl font-semibold text-gray-900 mb-6">Gestión de Inventario</h3>
            
            <!-- Parámetros de stock -->
            <div class="mb-8">
              <h4 class="text-lg font-medium text-gray-800 mb-4">Parámetros de Stock</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Stock Mínimo
                  </label>
                  <input
                    v-model.number="settingsStore.settings.inventorySettings.stockMinimo"
                    type="number"
                    min="0"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Stock Máximo
                  </label>
                  <input
                    v-model.number="settingsStore.settings.inventorySettings.stockMaximo"
                    type="number"
                    min="0"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
              <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <label class="text-sm font-medium text-gray-700">Alerta de Stock Bajo</label>
                  <p class="text-xs text-gray-500">Recibir alertas cuando el stock esté bajo</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    v-model="settingsStore.settings.inventorySettings.alertaStockBajo"
                    type="checkbox"
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              <div v-if="settingsStore.settings.inventorySettings.alertaStockBajo" class="mt-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Umbral de Stock Bajo
                </label>
                <input
                  v-model.number="settingsStore.settings.inventorySettings.umbralStockBajo"
                  type="number"
                  min="0"
                  class="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <!-- Unidades de medida -->
            <div class="mb-8">
              <h4 class="text-lg font-medium text-gray-800 mb-4">Unidades de Medida</h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Unidad de Peso
                  </label>
                  <select
                    v-model="settingsStore.settings.inventorySettings.unidadPeso"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="g">Gramos (g)</option>
                    <option value="kg">Kilogramos (kg)</option>
                    <option value="lb">Libras (lb)</option>
                    <option value="oz">Onzas (oz)</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Unidad de Volumen
                  </label>
                  <select
                    v-model="settingsStore.settings.inventorySettings.unidadVolumen"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="ml">Mililitros (ml)</option>
                    <option value="l">Litros (l)</option>
                    <option value="fl oz">Onzas fluidas (fl oz)</option>
                    <option value="cup">Tazas (cup)</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Unidad de Longitud
                  </label>
                  <select
                    v-model="settingsStore.settings.inventorySettings.unidadLongitud"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="cm">Centímetros (cm)</option>
                    <option value="m">Metros (m)</option>
                    <option value="in">Pulgadas (in)</option>
                    <option value="ft">Pies (ft)</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Impuestos y precios -->
            <div class="mb-8">
              <h4 class="text-lg font-medium text-gray-800 mb-4">Impuestos y Precios</h4>
              <div class="space-y-4">
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label class="text-sm font-medium text-gray-700">Aplicar IVA</label>
                    <p class="text-xs text-gray-500">Aplicar impuesto al valor agregado</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      v-model="settingsStore.settings.inventorySettings.aplicarIVA"
                      type="checkbox"
                      class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                <div v-if="settingsStore.settings.inventorySettings.aplicarIVA">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Porcentaje de IVA (%)
                  </label>
                  <input
                    v-model.number="settingsStore.settings.inventorySettings.porcentajeIVA"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    class="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label class="text-sm font-medium text-gray-700">Redondear Precios</label>
                    <p class="text-xs text-gray-500">Redondear precios al valor más cercano</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      v-model="settingsStore.settings.inventorySettings.redondearPrecios"
                      type="checkbox"
                      class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Decimales en Precios
                  </label>
                  <input
                    v-model.number="settingsStore.settings.inventorySettings.decimales"
                    type="number"
                    min="0"
                    max="2"
                    class="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label class="text-sm font-medium text-gray-700">Calcular Márgenes Automáticamente</label>
                    <p class="text-xs text-gray-500">Calcular márgenes de ganancia basados en costos</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      v-model="settingsStore.settings.inventorySettings.calcularMargenes"
                      type="checkbox"
                      class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- 5. Documentos y Facturación -->
          <div v-show="activeTab === 'billing'">
            <h3 class="text-xl font-semibold text-gray-900 mb-6">Documentos y Facturación</h3>
            
            <!-- Tipo de comprobantes -->
            <div class="mb-8">
              <h4 class="text-lg font-medium text-gray-800 mb-4">Tipo de Comprobantes</h4>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Comprobante por Defecto
                  </label>
                  <select
                    v-model="settingsStore.settings.billingSettings.tipoComprobante"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="boleta">Boleta</option>
                    <option value="factura">Factura</option>
                    <option value="nota-credito">Nota de Crédito</option>
                    <option value="guia-despacho">Guía de Despacho</option>
                  </select>
                </div>
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label class="text-sm font-medium text-gray-700">Conectar con SII (Chile)</label>
                    <p class="text-xs text-gray-500">Integración con Servicio de Impuestos Internos</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      v-model="settingsStore.settings.billingSettings.conectarSII"
                      type="checkbox"
                      class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>

            <!-- Numeración -->
            <div class="mb-8">
              <h4 class="text-lg font-medium text-gray-800 mb-4">Numeración</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Prefijo de Numeración
                  </label>
                  <input
                    v-model="settingsStore.settings.billingSettings.prefijoNumeracion"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Ej: VENTA"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Numeración Inicial
                  </label>
                  <input
                    v-model.number="settingsStore.settings.billingSettings.numeracionInicial"
                    type="number"
                    min="1"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <!-- Impresión -->
            <div class="mb-8">
              <h4 class="text-lg font-medium text-gray-800 mb-4">Configuración de Impresión</h4>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Formato de Boleta
                  </label>
                  <select
                    v-model="settingsStore.settings.billingSettings.formatoBoleta"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="A4">A4</option>
                    <option value="Ticket">Ticket</option>
                  </select>
                </div>
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label class="text-sm font-medium text-gray-700">Imprimir Automáticamente</label>
                    <p class="text-xs text-gray-500">Imprimir boletas automáticamente al registrar venta</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      v-model="settingsStore.settings.billingSettings.imprimirAutomaticamente"
                      type="checkbox"
                      class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Plantilla Personalizada
                  </label>
                  <textarea
                    v-model="settingsStore.settings.billingSettings.plantillaPersonalizada"
                    rows="4"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Plantilla personalizada de impresión (HTML/Texto)"
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Respaldo -->
            <div class="space-y-4">
              <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <label class="text-sm font-medium text-gray-700">Copia Automática</label>
                  <p class="text-xs text-gray-500">Guardar copia de cada boleta emitida</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    v-model="settingsStore.settings.billingSettings.copiaAutomatica"
                    type="checkbox"
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <label class="text-sm font-medium text-gray-700">Respaldo en PDF</label>
                  <p class="text-xs text-gray-500">Generar archivo PDF de cada boleta</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    v-model="settingsStore.settings.billingSettings.respaldoPDF"
                    type="checkbox"
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </div>

          <!-- 6. Notificaciones y Alertas -->
          <div v-show="activeTab === 'notifications'">
            <h3 class="text-xl font-semibold text-gray-900 mb-6">Notificaciones y Alertas</h3>
            
            <!-- Alertas del sistema -->
            <div class="mb-8">
              <h4 class="text-lg font-medium text-gray-800 mb-4">Alertas del Sistema</h4>
              <div class="space-y-4">
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label class="text-sm font-medium text-gray-700">Alertas de Stock</label>
                    <p class="text-xs text-gray-500">Notificar cuando el stock esté bajo</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      v-model="settingsStore.settings.notificationSettings.alertasStock"
                      type="checkbox"
                      class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label class="text-sm font-medium text-gray-700">Alertas de Ventas</label>
                    <p class="text-xs text-gray-500">Notificar ventas importantes o anómalas</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      v-model="settingsStore.settings.notificationSettings.alertasVentas"
                      type="checkbox"
                      class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label class="text-sm font-medium text-gray-700">Alertas de Errores</label>
                    <p class="text-xs text-gray-500">Notificar errores en el sistema o caja</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      v-model="settingsStore.settings.notificationSettings.alertasErrores"
                      type="checkbox"
                      class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label class="text-sm font-medium text-gray-700">Recordatorios de Vencimiento</label>
                    <p class="text-xs text-gray-500">Recordar productos próximos a vencer</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      v-model="settingsStore.settings.notificationSettings.recordatoriosVencimiento"
                      type="checkbox"
                      class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>

            <!-- Notificaciones externas -->
            <div class="mb-8">
              <h4 class="text-lg font-medium text-gray-800 mb-4">Notificaciones Externas</h4>
              <div class="space-y-4">
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label class="text-sm font-medium text-gray-700">Notificaciones por Email</label>
                    <p class="text-xs text-gray-500">Enviar notificaciones por correo electrónico</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      v-model="settingsStore.settings.notificationSettings.notificacionesEmail"
                      type="checkbox"
                      class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                <div v-if="settingsStore.settings.notificationSettings.notificacionesEmail">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Email Empresarial
                  </label>
                  <input
                    v-model="settingsStore.settings.notificationSettings.emailEmpresa"
                    type="email"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="contacto@empresa.cl"
                  />
                </div>
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label class="text-sm font-medium text-gray-700">Notificaciones por WhatsApp</label>
                    <p class="text-xs text-gray-500">Enviar notificaciones por WhatsApp Business</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      v-model="settingsStore.settings.notificationSettings.notificacionesWhatsApp"
                      type="checkbox"
                      class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                <div v-if="settingsStore.settings.notificationSettings.notificacionesWhatsApp">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp Empresarial
                  </label>
                  <input
                    v-model="settingsStore.settings.notificationSettings.whatsappEmpresa"
                    type="tel"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="+56 9 1234 5678"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- 7. Integraciones y Sincronización -->
          <div v-show="activeTab === 'integrations'">
            <h3 class="text-xl font-semibold text-gray-900 mb-6">Integraciones y Sincronización</h3>
            
            <!-- Integraciones -->
            <div class="mb-8">
              <h4 class="text-lg font-medium text-gray-800 mb-4">Integraciones</h4>
              <div class="space-y-4">
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label class="text-sm font-medium text-gray-700">Tienda Online / E-commerce</label>
                    <p class="text-xs text-gray-500">Integración con tienda online</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      v-model="settingsStore.settings.integrationSettings.tiendaOnline"
                      type="checkbox"
                      class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                <div v-if="settingsStore.settings.integrationSettings.tiendaOnline" class="ml-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    API Key E-commerce
                  </label>
                  <input
                    v-model="settingsStore.settings.integrationSettings.apiKeys.ecommerce"
                    type="password"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Ingrese su API key"
                  />
                </div>
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label class="text-sm font-medium text-gray-700">Sistema Contable</label>
                    <p class="text-xs text-gray-500">Integración con sistema contable</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      v-model="settingsStore.settings.integrationSettings.sistemaContable"
                      type="checkbox"
                      class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                <div v-if="settingsStore.settings.integrationSettings.sistemaContable" class="ml-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    API Key Contabilidad
                  </label>
                  <input
                    v-model="settingsStore.settings.integrationSettings.apiKeys.contabilidad"
                    type="password"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Ingrese su API key"
                  />
                </div>
              </div>
            </div>

            <!-- Respaldos -->
            <div class="space-y-4">
              <h4 class="text-lg font-medium text-gray-800 mb-4">Respaldos Automáticos</h4>
              <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <label class="text-sm font-medium text-gray-700">Respaldos Automáticos en la Nube</label>
                  <p class="text-xs text-gray-500">Realizar respaldos automáticos de datos</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    v-model="settingsStore.settings.integrationSettings.respaldosAutomaticos"
                    type="checkbox"
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              <div v-if="settingsStore.settings.integrationSettings.respaldosAutomaticos">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Frecuencia de Respaldo
                </label>
                <select
                  v-model="settingsStore.settings.integrationSettings.frecuenciaRespaldo"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="diario">Diario</option>
                  <option value="semanal">Semanal</option>
                  <option value="mensual">Mensual</option>
                </select>
              </div>
            </div>
          </div>

          <!-- 8. Seguridad y Mantenimiento -->
          <div v-show="activeTab === 'security'">
            <h3 class="text-xl font-semibold text-gray-900 mb-6">Seguridad y Mantenimiento</h3>
            
            <!-- Control de sesiones -->
            <div class="mb-8">
              <h4 class="text-lg font-medium text-gray-800 mb-4">Control de Sesiones</h4>
              <div class="space-y-4">
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label class="text-sm font-medium text-gray-700">Control de Sesiones Activas</label>
                    <p class="text-xs text-gray-500">Limitar número de sesiones simultáneas</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      v-model="settingsStore.settings.securitySettings.controlSesiones"
                      type="checkbox"
                      class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Tiempo de Inactividad (minutos)
                  </label>
                  <input
                    v-model.number="settingsStore.settings.securitySettings.tiempoInactividad"
                    type="number"
                    min="1"
                    class="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <!-- Respaldos -->
            <div class="mb-8">
              <h4 class="text-lg font-medium text-gray-800 mb-4">Respaldos</h4>
              <div class="space-y-4">
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label class="text-sm font-medium text-gray-700">Copia de Seguridad Manual</label>
                    <p class="text-xs text-gray-500">Permitir crear respaldos manuales</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      v-model="settingsStore.settings.securitySettings.copiaSeguridadManual"
                      type="checkbox"
                      class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label class="text-sm font-medium text-gray-700">Copia de Seguridad Automática</label>
                    <p class="text-xs text-gray-500">Crear respaldos automáticos programados</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      v-model="settingsStore.settings.securitySettings.copiaSeguridadAutomatica"
                      type="checkbox"
                      class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                <div class="flex gap-4">
                  <button
                    @click="handleBackup"
                    class="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    Crear Respaldo Manual
                  </button>
                  <button
                    @click="handleRestore"
                    class="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                  >
                    Restaurar desde Respaldo
                  </button>
                </div>
              </div>
            </div>

            <!-- Seguridad -->
            <div class="mb-8">
              <h4 class="text-lg font-medium text-gray-800 mb-4">Seguridad</h4>
              <div class="space-y-4">
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label class="text-sm font-medium text-gray-700">Cifrado de Datos</label>
                    <p class="text-xs text-gray-500">Cifrar datos sensibles almacenados</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      v-model="settingsStore.settings.securitySettings.cifradoDatos"
                      type="checkbox"
                      class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label class="text-sm font-medium text-gray-700">Logs de Auditoría</label>
                    <p class="text-xs text-gray-500">Registrar actividad del sistema para auditorías</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      v-model="settingsStore.settings.securitySettings.logsAuditoria"
                      type="checkbox"
                      class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>

            <!-- Mantenimiento -->
            <div class="space-y-4">
              <h4 class="text-lg font-medium text-gray-800 mb-4">Mantenimiento</h4>
              <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <label class="text-sm font-medium text-gray-700">Modo Mantenimiento</label>
                  <p class="text-xs text-gray-500">Activar modo mantenimiento (bloquea acceso al sistema)</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    v-model="settingsStore.settings.securitySettings.modoMantenimiento"
                    type="checkbox"
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </div>

          <!-- 9. Personalización de Reportes -->
          <div v-show="activeTab === 'reports'">
            <h3 class="text-xl font-semibold text-gray-900 mb-6">Personalización de Reportes</h3>
            
            <!-- Métricas visibles -->
            <div class="mb-8">
              <h4 class="text-lg font-medium text-gray-800 mb-4">Métricas Visibles</h4>
              <div class="space-y-3">
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <label class="text-sm font-medium text-gray-700">Ventas</label>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      v-model="settingsStore.settings.reportSettings.metricasVisibles.ventas"
                      type="checkbox"
                      class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <label class="text-sm font-medium text-gray-700">Inventario</label>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      v-model="settingsStore.settings.reportSettings.metricasVisibles.inventario"
                      type="checkbox"
                      class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <label class="text-sm font-medium text-gray-700">Usuarios</label>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      v-model="settingsStore.settings.reportSettings.metricasVisibles.usuarios"
                      type="checkbox"
                      class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <label class="text-sm font-medium text-gray-700">Productos</label>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      v-model="settingsStore.settings.reportSettings.metricasVisibles.productos"
                      type="checkbox"
                      class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>

            <!-- Formato de exportación -->
            <div class="mb-8">
              <h4 class="text-lg font-medium text-gray-800 mb-4">Formato de Exportación</h4>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Formato por Defecto
                </label>
                <select
                  v-model="settingsStore.settings.reportSettings.formatoExportacion"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="PDF">PDF</option>
                  <option value="Excel">Excel</option>
                  <option value="CSV">CSV</option>
                </select>
              </div>
            </div>

            <!-- Filtros predefinidos -->
            <div class="space-y-4">
              <h4 class="text-lg font-medium text-gray-800 mb-4">Filtros Predefinidos</h4>
              <div class="space-y-3">
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <label class="text-sm font-medium text-gray-700">Por Fecha</label>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      v-model="settingsStore.settings.reportSettings.filtrosPredefinidos.porFecha"
                      type="checkbox"
                      class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <label class="text-sm font-medium text-gray-700">Por Categoría</label>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      v-model="settingsStore.settings.reportSettings.filtrosPredefinidos.porCategoria"
                      type="checkbox"
                      class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <label class="text-sm font-medium text-gray-700">Por Vendedor</label>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      v-model="settingsStore.settings.reportSettings.filtrosPredefinidos.porVendedor"
                      type="checkbox"
                      class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Botones de acción -->
          <div class="flex items-center justify-between pt-6 mt-8 border-t border-gray-200">
            <div class="text-sm text-gray-500">
              Los cambios se guardan automáticamente
            </div>
            <button
              @click="handleReset"
              class="px-6 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              Restablecer Valores por Defecto
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Header from '../components/Header.vue';
import { useSettingsStore } from '../store/settings';
import { Icon } from '@iconify/vue';

const settingsStore = useSettingsStore();
const activeTab = ref('general');
const showUserModal = ref(false);
const tabsNavRef = ref<HTMLElement | null>(null);

const tabs = [
  { id: 'general', label: 'General', icon: 'mdi:cog' },
  { id: 'users', label: 'Usuarios y Roles', icon: 'mdi:account-group' },
  { id: 'pos', label: 'POS', icon: 'mdi:point-of-sale' },
  { id: 'inventory', label: 'Inventario', icon: 'mdi:package-variant' },
  { id: 'billing', label: 'Facturación', icon: 'mdi:file-document' },
  { id: 'notifications', label: 'Notificaciones', icon: 'mdi:bell' },
  { id: 'integrations', label: 'Integraciones', icon: 'mdi:link-variant' },
  { id: 'security', label: 'Seguridad', icon: 'mdi:shield-lock' },
  { id: 'reports', label: 'Reportes', icon: 'mdi:chart-box' },
];

const handleReset = () => {
  if (confirm('¿Está seguro de restablecer todas las configuraciones a los valores por defecto?')) {
    settingsStore.resetToDefaults();
  }
};

const handleLogoUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      settingsStore.updateSubSetting('businessInfo', { logo: result });
    };
    reader.readAsDataURL(file);
  }
};

const handleBackup = () => {
  const data = {
    settings: settingsStore.settings,
    timestamp: new Date().toISOString(),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  alert('Respaldo creado exitosamente');
};

const handleRestore = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json';
  input.onchange = (e) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          if (data.settings) {
            if (confirm('¿Está seguro de restaurar desde este respaldo? Esto sobrescribirá todas las configuraciones actuales.')) {
              settingsStore.updateSettings(data.settings);
              alert('Configuración restaurada exitosamente');
            }
          }
        } catch (error) {
          alert('Error al leer el archivo de respaldo');
        }
      };
      reader.readAsText(file);
    }
  };
  input.click();
};

// Manejar scroll horizontal con la rueda del mouse
const handleWheelScroll = (event: WheelEvent) => {
  if (!tabsNavRef.value) return;
  
  // Convertir scroll vertical en desplazamiento horizontal
  // Scroll hacia abajo (deltaY positivo) = desplazar hacia la derecha
  // Scroll hacia arriba (deltaY negativo) = desplazar hacia la izquierda
  // Factor de multiplicación para controlar la velocidad del scroll
  const scrollSpeed = 1.5;
  const scrollAmount = event.deltaY * scrollSpeed;
  
  // Aplicar scroll suave
  tabsNavRef.value.scrollBy({
    left: scrollAmount,
    behavior: 'auto' // Usar 'auto' para respuesta inmediata
  });
};
</script>
