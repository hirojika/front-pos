<template>
  <div class="flex relative">
    <!-- Contenido principal -->
    <div class="flex-1 pr-80">
      <Header title="Pedido" show-search />
      
      <main class="p-6">
        <!-- Barra de búsqueda adicional -->
        <div class="mb-6">
          <div class="relative max-w-md">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar Receta"
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <!-- Categoría: Helados de Conos -->
        <section v-if="filteredCones.length > 0" class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Helados de Conos</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProductCard
              v-for="product in filteredCones"
              :key="product.id"
              :product="product"
            />
          </div>
        </section>

        <!-- Categoría: Helados en Copas -->
        <section v-if="filteredCups.length > 0" class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Helados en Copas</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProductCard
              v-for="product in filteredCups"
              :key="product.id"
              :product="product"
            />
          </div>
        </section>

        <!-- Mensaje cuando no hay resultados -->
        <div v-if="filteredCones.length === 0 && filteredCups.length === 0 && searchQuery" class="text-center py-12 text-gray-500">
          <p>No se encontraron productos que coincidan con "{{ searchQuery }}"</p>
        </div>
      </main>
    </div>

    <!-- Sidebar de pedido -->
    <OrderSidebar />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import Header from '../components/Header.vue';
import ProductCard from '../components/ProductCard.vue';
import OrderSidebar from '../components/OrderSidebar.vue';
import { useProductsStore } from '../store/products';

const productsStore = useProductsStore();
const searchQuery = ref('');

const cones = computed(() => productsStore.getProductsByCategory('conos'));
const cups = computed(() => productsStore.getProductsByCategory('copas'));

const filteredCones = computed(() => {
  if (!searchQuery.value) return cones.value;
  const query = searchQuery.value.toLowerCase();
  return cones.value.filter(p => 
    p.nombre.toLowerCase().includes(query) || 
    (p.descripcion || '').toLowerCase().includes(query)
  );
});

const filteredCups = computed(() => {
  if (!searchQuery.value) return cups.value;
  const query = searchQuery.value.toLowerCase();
  return cups.value.filter(p => 
    p.nombre.toLowerCase().includes(query) || 
    (p.descripcion || '').toLowerCase().includes(query)
  );
});
</script>
