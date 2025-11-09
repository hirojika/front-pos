<template>
  <div>
  <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
    <!-- Imagen del producto -->
      <div class="w-full h-48 bg-linear-to-br from-pink-100 to-purple-100 flex items-center justify-center">
        <div class="text-6xl">
        🍦
      </div>
    </div>

    <!-- Contenido -->
    <div class="p-4">
        <h3 class="font-semibold text-lg text-gray-900 mb-1">{{ product.nombre }}</h3>
        <p class="text-sm text-gray-600 mb-3">{{ product.descripcion || '' }}</p>
      
      <div class="flex items-center justify-between">
          <span class="text-2xl font-bold text-gray-900">
            ${{ formatPrice(getProductPrice(product)) }}
            <span v-if="product.tipo === 'configurable'" class="text-sm text-gray-500 font-normal">
              (desde)
            </span>
          </span>
        <button
          @click="handleAddToCart"
            class="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
            {{ product.tipo === 'configurable' ? 'Personalizar' : 'Añadir' }}
        </button>
      </div>
    </div>
    </div>

    <!-- Modal de personalización -->
    <ProductCustomizationModal
      v-if="product.tipo === 'configurable'"
      :is-open="showCustomizationModal"
      :product="product as ProductoConfigurable"
      @update:is-open="showCustomizationModal = $event"
      @save="handleSaveCustomization"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Producto, ProductoConfigurable } from '@/types';
import type { ProductCustomization } from './ProductCustomizationModal.vue';
import ProductCustomizationModal from './ProductCustomizationModal.vue';
import { useOrdersStore } from '../store/orders';
import { useIngredientsStore } from '../store/ingredients';

const props = defineProps<{
  product: Producto;
}>();

const ordersStore = useOrdersStore();
const ingredientsStore = useIngredientsStore();
const showCustomizationModal = ref(false);

// Helper para obtener el precio de un producto según su tipo
function getProductPrice(product: Producto): number {
  if (product.tipo === 'configurable') {
    return product.precio_base_clp;
  } else {
    return product.precio_clp;
  }
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-CL').format(price);
};

const handleAddToCart = () => {
  if (props.product.tipo === 'configurable') {
    showCustomizationModal.value = true;
  } else {
  ordersStore.addToOrder(props.product);
  }
};

function handleSaveCustomization(customization: ProductCustomization) {
  console.log('ProductCard: Saving customization for product', props.product.nombre, customization);
  ordersStore.addToOrder(props.product, 1, customization, ingredientsStore);
  showCustomizationModal.value = false;
}
</script>
