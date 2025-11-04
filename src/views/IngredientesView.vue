<template>
  <div>
    <Header title="Ingredientes" action-label="+ Añadir Ingrediente" @action="handleAddIngredient" />
    <main class="p-6 space-y-6">
      <!-- Alertas de Stock -->
      <div v-if="alerts.length > 0" class="bg-white rounded-lg shadow overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold">Alertas de Stock</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ingredientes</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acción</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="alert in alerts" :key="alert.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ alert.ingredient }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-500">
                  {{ alert.description }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ alert.quantity }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    @click="deleteAlert(alert.id)"
                    class="text-red-600 hover:text-red-900 flex items-center gap-2"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Borrar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Lista de Ingredientes -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold">Lista de Ingredientes</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ingredientes</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID Producto</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acción</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="ingredient in ingredients" :key="ingredient.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-12 bg-gradient-to-br from-pink-100 to-purple-100 rounded flex items-center justify-center flex-shrink-0">
                      <span class="text-xl">🍦</span>
                    </div>
                    <div class="text-sm font-medium text-gray-900">{{ ingredient.name }}</div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {{ ingredient.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ ingredient.productId }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ ingredient.quantity }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${{ formatPrice(ingredient.price) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center gap-2">
                    <button
                      @click="editIngredient(ingredient.id)"
                      class="text-green-600 hover:text-green-900 flex items-center gap-1"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Editar
                    </button>
                    <button
                      @click="deleteIngredient(ingredient.id)"
                      class="text-orange-600 hover:text-orange-900 flex items-center gap-1"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Borrar
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <!-- Modal de ingrediente -->
    <IngredientModal
      :is-open="showModal"
      :ingredient="selectedIngredient"
      @update:is-open="showModal = $event"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import Header from '../components/Header.vue';
import IngredientModal from '../components/IngredientModal.vue';
import { useInventoryStore } from '../store/inventory';
import type { Ingredient } from '../store/inventory';

const inventoryStore = useInventoryStore();
const ingredients = computed(() => inventoryStore.getIngredients);
const alerts = computed(() => inventoryStore.getAlerts);

const showModal = ref(false);
const selectedIngredient = ref<Ingredient | null>(null);

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-CL').format(price);
};

const editIngredient = (id: string) => {
  const ingredient = ingredients.value.find(i => i.id === id);
  if (ingredient) {
    selectedIngredient.value = ingredient;
    showModal.value = true;
  }
};

const deleteIngredient = (id: string) => {
  if (confirm('¿Estás seguro de eliminar este ingrediente?')) {
    inventoryStore.deleteIngredient(id);
  }
};

const deleteAlert = (id: string) => {
  inventoryStore.deleteAlert(id);
};

const handleAddIngredient = () => {
  selectedIngredient.value = null;
  showModal.value = true;
};

const handleSubmit = (data: Omit<Ingredient, 'id'>) => {
  if (selectedIngredient.value) {
    // Editar
    inventoryStore.updateIngredient(selectedIngredient.value.id, data);
  } else {
    // Añadir nuevo
    const newIngredient: Ingredient = {
      id: String(Date.now()),
      ...data,
    };
    inventoryStore.addIngredient(newIngredient);
  }
  selectedIngredient.value = null;
};
</script>
