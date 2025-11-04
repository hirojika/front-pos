<template>
  <Modal
    :is-open="isOpen"
    :title="ingredient ? 'Editar Ingrediente' : 'Añadir Ingrediente'"
    @update:is-open="$emit('update:isOpen', $event)"
    @confirm="handleSubmit"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Nombre del Ingrediente *
        </label>
        <input
          v-model="form.name"
          type="text"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF69B4] focus:border-transparent"
          placeholder="Ej: Helado de Chocolate"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Descripción
        </label>
        <textarea
          v-model="form.description"
          rows="3"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF69B4] focus:border-transparent"
          placeholder="Descripción del ingrediente"
        ></textarea>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            ID Producto *
          </label>
          <input
            v-model="form.productId"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF69B4] focus:border-transparent"
            placeholder="Ej: 67869052"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Cantidad *
          </label>
          <input
            v-model.number="form.quantity"
            type="number"
            required
            min="0"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF69B4] focus:border-transparent"
            placeholder="0"
          />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Precio *
        </label>
        <input
          v-model.number="form.price"
          type="number"
          required
          min="0"
          step="0.01"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF69B4] focus:border-transparent"
          placeholder="0.00"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Estado
        </label>
        <select
          v-model="form.status"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF69B4] focus:border-transparent"
        >
          <option value="En Stock">En Stock</option>
          <option value="Bajo Stock">Bajo Stock</option>
          <option value="No queda Stock">No queda Stock</option>
          <option value="Stock estancado">Stock estancado</option>
        </select>
      </div>
    </form>

    <template #footer>
      <button
        type="button"
        @click="$emit('update:isOpen', false)"
        class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        Cancelar
      </button>
      <button
        type="button"
        @click="handleSubmit"
        class="px-4 py-2 bg-[#FF69B4] text-white rounded-lg hover:bg-[#FF1493] transition-colors"
      >
        {{ ingredient ? 'Guardar' : 'Añadir' }}
      </button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import Modal from './Modal.vue';
import type { Ingredient } from '../store/inventory';

const props = defineProps<{
  isOpen: boolean;
  ingredient?: Ingredient | null;
}>();

const emit = defineEmits<{
  'update:isOpen': [value: boolean];
  submit: [data: Omit<Ingredient, 'id'>];
}>();

const form = ref({
  name: '',
  description: '',
  productId: '',
  productName: '',
  quantity: 0,
  price: 0,
  status: 'En Stock' as Ingredient['status'],
});

watch(() => props.ingredient, (newIngredient) => {
  if (newIngredient) {
    form.value = {
      name: newIngredient.name,
      description: newIngredient.description,
      productId: newIngredient.productId,
      productName: newIngredient.productName,
      quantity: newIngredient.quantity,
      price: newIngredient.price,
      status: newIngredient.status,
    };
  } else {
    form.value = {
      name: '',
      description: '',
      productId: '',
      productName: '',
      quantity: 0,
      price: 0,
      status: 'En Stock',
    };
  }
});

const handleSubmit = () => {
  emit('submit', {
    ...form.value,
    productName: form.value.name,
  });
  emit('update:isOpen', false);
};
</script>

