<template>
  <Modal
    :is-open="isOpen"
    :title="isEditing ? 'Editar producto' : 'Nuevo producto'"
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
            placeholder="Ej: Copa junior"
          />
        </div>

        <div class="col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">Categoría *</label>
          <select
            v-model="localFormData.categoria"
            class="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option v-for="categoria in categorias" :key="categoria" :value="categoria">
              {{ categoria }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
          <select
            v-model="localFormData.tipo"
            class="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="configurable">Configurable</option>
            <option value="no_configurable">No Configurable</option>
          </select>
        </div>

        <div v-if="localFormData.tipo === 'configurable'">
          <label class="block text-sm font-medium text-gray-700 mb-1">Precio base (CLP) *</label>
          <input
            v-model.number="localFormData.precio_base_clp"
            type="number"
            min="0"
            class="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div v-else>
          <label class="block text-sm font-medium text-gray-700 mb-1">Precio (CLP) *</label>
          <input
            v-model.number="localFormData.precio_clp"
            type="number"
            min="0"
            class="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
          />
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

        <div v-if="localFormData.tipo === 'configurable'" class="col-span-2 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
          <p class="font-medium mb-1">Nota:</p>
          <p>Para productos configurables, las reglas y variaciones se pueden gestionar después de crear el producto.</p>
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
import type { CategoriaProducto } from '@/types';
import type { ProductoFormData } from '@/composables/useProductoCRUD';

const props = defineProps<{
  isOpen: boolean;
  isEditing: boolean;
  formData: ProductoFormData;
  error?: string;
  isValid: boolean;
  categorias: CategoriaProducto[];
}>();

const emit = defineEmits<{
  'update:isOpen': [value: boolean];
  cancel: [];
  save: [];
  'update:formData': [data: ProductoFormData];
}>();

const localFormData = ref<ProductoFormData>({ ...props.formData });

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
  emit('update:isOpen', value);
  if (!value) {
    emit('cancel');
  }
};

const handleSave = () => {
  // Emitir los datos actuales del formulario antes de guardar
  emit('update:formData', { ...localFormData.value });
  emit('save');
};
</script>
