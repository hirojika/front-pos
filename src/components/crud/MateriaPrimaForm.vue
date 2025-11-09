<template>
  <Modal
    :is-open="isOpen"
    :title="isEditing ? 'Editar materia prima' : 'Nueva materia prima'"
    @update:isOpen="handleClose"
  >
    <div class="space-y-4">
      <div v-if="error" class="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
        {{ error }}
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
          <input
            v-model="localFormData.nombre"
            type="text"
            class="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Ej: Helado vainilla"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Unidad *</label>
          <select
            v-model="localFormData.unidad_medida"
            class="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="u">Unidad</option>
            <option value="ml">Mililitro</option>
            <option value="g">Gramo</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
          <input
            v-model.number="localFormData.stock_disponible"
            type="number"
            min="0"
            class="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div class="col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de ingrediente</label>
          <select
            v-model="localFormData.tipo_ingrediente"
            class="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option :value="undefined">— Sin tipo —</option>
            <option v-for="tipo in tiposIngrediente" :key="tipo" :value="tipo">
              {{ tipo }}
            </option>
          </select>
        </div>

        <div class="col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <textarea
            v-model="localFormData.descripcion"
            class="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
            rows="2"
            placeholder="Descripción opcional"
          ></textarea>
        </div>
      </div>
    </div>

    <template #footer>
      <button
        type="button"
        class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        @click="handleClose(false)"
      >
        Cancelar
      </button>
      <button
        type="button"
        class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="!isValid"
        @click="handleSave"
      >
        {{ isEditing ? 'Guardar cambios' : 'Crear' }}
      </button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import Modal from '../Modal.vue';
import type { TipoIngrediente } from '@/types';
import type { MateriaPrimaFormData } from '@/composables/useMateriaPrimaCRUD';

const props = defineProps<{
  isOpen: boolean;
  isEditing: boolean;
  formData: MateriaPrimaFormData;
  error?: string;
  isValid: boolean;
  tiposIngrediente: TipoIngrediente[];
}>();

const emit = defineEmits<{
  'update:isOpen': [value: boolean];
  cancel: [];
  save: [];
  'update:formData': [data: MateriaPrimaFormData];
}>();

const localFormData = ref<MateriaPrimaFormData>({ ...props.formData });

// Solo sincronizar desde props cuando el modal se abre o cuando las props cambian externamente
watch(
  () => props.formData,
  (newData) => {
    // Actualizar solo si el modal está abierto y los datos son diferentes
    if (props.isOpen) {
      // Comparación simple para evitar actualizaciones innecesarias
      const currentStr = JSON.stringify(localFormData.value);
      const newStr = JSON.stringify(newData);
      if (currentStr !== newStr) {
        localFormData.value = { ...newData };
      }
    }
  },
  { deep: true }
);

// Sincronizar cuando el modal se abre
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      // Cuando el modal se abre, sincronizar con las props
      localFormData.value = { ...props.formData };
    }
  }
);

const handleClose = (value: boolean) => {
  if (!value) {
    emit('cancel');
  }
  emit('update:isOpen', value);
};

const handleSave = () => {
  // Emitir los datos actuales del formulario antes de guardar
  emit('update:formData', { ...localFormData.value });
  emit('save');
};
</script>

