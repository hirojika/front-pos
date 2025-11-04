<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
    <!-- Imagen del producto -->
    <div class="w-full h-48 bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
      <div v-if="!product.image" class="text-6xl">
        🍦
      </div>
      <img v-else :src="product.image" :alt="product.name" class="w-full h-full object-cover" />
    </div>

    <!-- Contenido -->
    <div class="p-4">
      <h3 class="font-semibold text-lg text-gray-900 mb-1">{{ product.name }}</h3>
      <p class="text-sm text-gray-600 mb-3">{{ product.description }}</p>
      
      <div class="flex items-center justify-between">
        <span class="text-2xl font-bold text-gray-900">${{ formatPrice(product.price) }}</span>
        <button
          @click="handleAddToCart"
          class="bg-[#FF69B4] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#FF1493] transition-colors flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Añadir
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '../store/products';
import { useOrdersStore } from '../store/orders';

const props = defineProps<{
  product: Product;
}>();

const ordersStore = useOrdersStore();

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-CL').format(price);
};

const handleAddToCart = () => {
  ordersStore.addToOrder(props.product);
};
</script>

