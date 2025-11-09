<template>
  <Modal
    :is-open="isOpen"
    title="Configuración"
    @update:isOpen="$emit('update:isOpen', $event)"
  >
    <div class="space-y-6">
      <!-- Estándares de medición -->
      <div>
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Estándares de Medición</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Unidad de Peso
            </label>
            <select
              v-model="localSettings.unidadPeso"
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
              v-model="localSettings.unidadVolumen"
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
              v-model="localSettings.unidadLongitud"
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

      <!-- Configuraciones de calidad de vida -->
      <div>
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Calidad de Vida</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <label class="text-sm font-medium text-gray-700">Mostrar Notificaciones</label>
              <p class="text-xs text-gray-500">Recibir notificaciones del sistema</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                v-model="localSettings.mostrarNotificaciones"
                type="checkbox"
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <label class="text-sm font-medium text-gray-700">Sonido de Notificaciones</label>
              <p class="text-xs text-gray-500">Reproducir sonido al recibir notificaciones</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                v-model="localSettings.sonidoNotificaciones"
                type="checkbox"
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Tema
            </label>
            <select
              v-model="localSettings.tema"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="light">Claro</option>
              <option value="dark">Oscuro</option>
              <option value="auto">Automático</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Idioma
            </label>
            <select
              v-model="localSettings.idioma"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Formato de Fecha
            </label>
            <select
              v-model="localSettings.formatoFecha"
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
              v-model="localSettings.formatoHora"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="24h">24 horas</option>
              <option value="12h">12 horas (AM/PM)</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Decimales en Precios
            </label>
            <input
              v-model.number="localSettings.decimales"
              type="number"
              min="0"
              max="2"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <!-- Configuraciones de ventas -->
      <div>
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Ventas</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <label class="text-sm font-medium text-gray-700">Redondear Precios</label>
              <p class="text-xs text-gray-500">Redondear precios al valor más cercano</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                v-model="localSettings.redondearPrecios"
                type="checkbox"
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <label class="text-sm font-medium text-gray-700">Mostrar IVA</label>
              <p class="text-xs text-gray-500">Mostrar desglose de IVA en las boletas</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                v-model="localSettings.mostrarIVA"
                type="checkbox"
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <label class="text-sm font-medium text-gray-700">Permitir Descuentos</label>
              <p class="text-xs text-gray-500">Permitir aplicar descuentos a las ventas</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                v-model="localSettings.permitirDescuentos"
                type="checkbox"
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div v-if="localSettings.permitirDescuentos">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Descuento Máximo (%)
            </label>
            <input
              v-model.number="localSettings.maxDescuentoPorcentaje"
              type="number"
              min="0"
              max="100"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <!-- Configuraciones de inventario -->
      <div>
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Inventario</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <label class="text-sm font-medium text-gray-700">Alerta de Stock Bajo</label>
              <p class="text-xs text-gray-500">Recibir alertas cuando el stock esté bajo</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                v-model="localSettings.alertaStockBajo"
                type="checkbox"
                class="sr-only peer"
              />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div v-if="localSettings.alertaStockBajo">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Umbral de Stock Bajo
            </label>
            <input
              v-model.number="localSettings.umbralStockBajo"
              type="number"
              min="0"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex items-center justify-between">
        <button
          @click="handleReset"
          class="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
        >
          Restablecer
        </button>
        <div class="flex gap-2">
          <button
            @click="$emit('update:isOpen', false)"
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="handleSave"
            class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Guardar
          </button>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import Modal from './Modal.vue';
import { useSettingsStore } from '../store/settings';
import type { AppSettings } from '../store/settings';

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  'update:isOpen': [value: boolean];
}>();

const settingsStore = useSettingsStore();
const localSettings = ref<AppSettings>({ ...settingsStore.settings });

// Sincronizar con el store cuando se abre el modal
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    localSettings.value = { ...settingsStore.settings };
  }
});

const handleSave = () => {
  settingsStore.updateSettings(localSettings.value);
  emit('update:isOpen', false);
};

const handleReset = () => {
  if (confirm('¿Está seguro de restablecer todas las configuraciones a los valores por defecto?')) {
    settingsStore.resetToDefaults();
    localSettings.value = { ...settingsStore.settings };
  }
};
</script>

