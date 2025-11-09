<template>
  <Modal
    :is-open="isOpen"
    title="Receta del Producto"
    @update:isOpen="$emit('update:isOpen', $event)"
  >
    <div v-if="producto && producto.tipo === 'configurable'" class="space-y-4">
      <h3 class="text-lg font-semibold">{{ producto.nombre }}</h3>

      <div>
        <h4 class="font-semibold mb-2">Reglas</h4>
        <div class="overflow-x-auto">
          <table class="w-full text-sm border">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-4 py-2 text-left">Tipo</th>
                <th class="px-4 py-2 text-right">Mín.</th>
                <th class="px-4 py-2 text-right">Máx.</th>
                <th class="px-4 py-2 text-right">Incluidas</th>
                <th class="px-4 py-2 text-left">Obligatorio</th>
                <th class="px-4 py-2 text-right">Extra</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="regla in producto.reglas" :key="regla.id_regla" class="border-t">
                <td class="px-4 py-2 capitalize">{{ regla.tipo }}</td>
                <td class="px-4 py-2 text-right">{{ regla.minimo }}</td>
                <td class="px-4 py-2 text-right">{{ regla.maximo }}</td>
                <td class="px-4 py-2 text-right">{{ regla.incluidas }}</td>
                <td class="px-4 py-2">{{ regla.obligatorio ? 'Sí' : 'No' }}</td>
                <td class="px-4 py-2 text-right">${{ formatPrice(regla.precio_extra_unitario_clp || 0) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="producto.variaciones && producto.variaciones.length > 0">
        <h4 class="font-semibold mb-2">Variaciones</h4>
        <div class="overflow-x-auto">
          <table class="w-full text-sm border">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-4 py-2 text-left">Nombre</th>
                <th class="px-4 py-2 text-right">Precio final</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="variacion in producto.variaciones" :key="variacion.id_variacion" class="border-t">
                <td class="px-4 py-2">{{ variacion.nombre }}</td>
                <td class="px-4 py-2 text-right">${{ formatPrice(variacion.precio_final_clp) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div v-else class="text-center py-4 text-gray-500">
      Este producto no es configurable o no tiene receta disponible.
    </div>

    <template #footer>
      <button
        type="button"
        class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        @click="$emit('update:isOpen', false)"
      >
        Cerrar
      </button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import Modal from '../Modal.vue';
import type { Producto } from '@/types';

const props = defineProps<{
  isOpen: boolean;
  producto: Producto | null;
}>();

const emit = defineEmits<{
  'update:isOpen': [value: boolean];
}>();

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-CL').format(Math.round(price));
};
</script>

