<template>
  <Modal
    :is-open="isOpen"
    :title="isEditing ? 'Editar ingrediente' : 'Nuevo ingrediente'"
    @update:isOpen="handleClose"
  >
    <div class="space-y-4">
      <div v-if="error" class="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
        {{ error }}
      </div>

      <div class="grid grid-cols-3 gap-4">
        <div class="col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
          <input
            v-model="localFormData.nombre"
            type="text"
            class="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Ej: Vainilla"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
          <select
            v-model="localFormData.tipo"
            class="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option v-for="tipo in tiposIngrediente" :key="tipo" :value="tipo">
              {{ tipo }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Porción estándar *</label>
          <input
            v-model.number="localFormData.porcion_estandar"
            type="number"
            min="1"
            class="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Unidad *</label>
          <select
            v-model="localFormData.unidad"
            class="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="g">g</option>
            <option value="ml">ml</option>
            <option value="u">u</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Valor extra (CLP)</label>
          <input
            v-model.number="localFormData.valor_extra_clp"
            type="number"
            min="0"
            class="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div class="col-span-3">
          <label class="block text-sm font-medium text-gray-700 mb-1">Materia prima fija (opcional)</label>
          <select
            v-model="localFormData.id_materia_prima"
            class="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option :value="null">— Ninguna (usar sabores) —</option>
            <option v-for="materia in materiasPrimas" :key="materia.id" :value="materia.id">
              {{ materia.nombre }}
            </option>
          </select>
        </div>

        <div class="col-span-3">
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
import type { TipoIngrediente, MateriaPrima } from '@/types';
import type { IngredienteFormData } from '@/composables/useIngredienteCRUD';

const props = defineProps<{
  isOpen: boolean;
  isEditing: boolean;
  formData: IngredienteFormData;
  error?: string;
  isValid: boolean;
  tiposIngrediente: TipoIngrediente[];
  materiasPrimas: MateriaPrima[];
}>();

const emit = defineEmits<{
  'update:isOpen': [value: boolean];
  cancel: [];
  save: [];
  'update:formData': [data: IngredienteFormData];
}>();

const localFormData = ref<IngredienteFormData>({ ...props.formData });

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
