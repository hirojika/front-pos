<template>
  <div>
    <Header title="Dashboard del Administrador" />
    <main class="p-6">
        <div class="mb-6 flex justify-between items-center">
          <div class="flex gap-2">
            <button
              v-for="period in timePeriods"
              :key="period"
              @click="selectedPeriod = period"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-colors',
                selectedPeriod === period
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              ]"
            >
              {{ period }}
            </button>
          </div>
          <button
            @click="exportDashboard"
            class="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exportar a PDF
          </button>
        </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Lo Más Vendido -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-4">Lo Más Vendido</h3>
          <div class="flex items-center justify-center gap-8">
            <DonutChart
              :data="salesByCategory"
              :labels="['Helado de Cono', 'Helado en Copa', 'Café Helado']"
              :colors="['#60A5FA', '#34D399', '#FB923C']"
              :total="`$${formatPrice(salesByCategory.reduce((a, b) => a + b, 0))}`"
            />
            <div class="space-y-3 text-sm">
              <div class="flex items-center gap-2">
                <div class="w-4 h-4 bg-blue-300 rounded"></div>
                <span>Helado de Cono</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-4 h-4 bg-green-300 rounded"></div>
                <span>Helado en Copa</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-4 h-4 bg-orange-300 rounded"></div>
                <span>Café Helado</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Total -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-4">Total</h3>
          <div class="text-4xl font-bold text-green-600 mb-6">${{ formatPrice(totalRevenue) }}</div>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span class="font-medium">Ingresos Totales</span>
              </div>
              <div class="text-right">
                <div class="font-semibold">${{ formatPrice(totalRevenue) }}</div>
                <div class="text-sm text-green-600">(+ {{ Math.round((totalRevenue / 15500000 - 1) * 100) || 0 }}% Aumento)</div>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                  <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <span class="font-medium">Gastos Totales</span>
              </div>
              <div class="text-right">
                <div class="font-semibold">${{ formatPrice(totalExpenses) }}</div>
                <div class="text-sm text-red-600">(+ 20% Aumento)</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Ventas Diarias -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-4">Ventas Diarias</h3>
          <LineChart
            :data="dailySales.length > 0 ? dailySales : [300000, 500000, 700000, 1000000, 800000, 600000, 900000]"
            :labels="['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']"
            class="flex justify-center"
          />
        </div>

        <!-- Mejores Recetas -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold mb-4">Mejores Recetas</h3>
          <div class="space-y-3">
            <div
              v-for="recipe in bestRecipes.length > 0 ? bestRecipes : [{ name: 'Simple Pequeño + 1 bolita', price: 3000, orders: 500 }, { name: 'Copa Chica + 2 bolitas', price: 2000, orders: 800 }, { name: 'Simple Grande + 1 bolita', price: 5000, orders: 950 }]"
              :key="recipe.name"
              class="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
            >
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-linear-to-br from-pink-200 to-purple-200 rounded flex items-center justify-center">
                  <span class="text-xl">🍦</span>
                </div>
                <div>
                  <div class="font-medium">{{ recipe.name }}</div>
                  <div class="text-sm text-gray-500">${{ formatPrice(recipe.price) }}</div>
                </div>
              </div>
              <div class="text-right">
                <div class="font-semibold">{{ recipe.orders }}</div>
                <div class="text-sm text-gray-500">Pedidos</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import Header from '../components/Header.vue';
import DonutChart from '../components/DonutChart.vue';
import LineChart from '../components/LineChart.vue';
import { useSalesStore } from '../store/sales';
import type { Producto } from '@/types';
import { exportDashboardToPDF } from '../utils/exportUtils';

const salesStore = useSalesStore();

const timePeriods = ['Hoy', 'Esta Semana', 'Este Mes', 'Este Año'];
const selectedPeriod = ref('Este Año');

const periodMap: Record<string, 'today' | 'week' | 'month' | 'year'> = {
  'Hoy': 'today',
  'Esta Semana': 'week',
  'Este Mes': 'month',
  'Este Año': 'year',
};

const currentSales = computed(() => {
  const period = periodMap[selectedPeriod.value] || 'year';
  return salesStore.getSalesByPeriod(period);
});

const totalRevenue = computed(() => {
  return currentSales.value.reduce((sum, sale) => sum + sale.total, 0);
});

const totalExpenses = computed(() => salesStore.totalExpenses);

const dailySales = computed(() => {
  return salesStore.getDailySales(7);
});

// Helper para obtener el precio de un producto según su tipo
function getProductPrice(product: Producto): number {
  if (product.tipo === 'configurable') {
    return product.precio_base_clp;
  } else {
    return product.precio_clp;
  }
}

// Calcular productos más vendidos
const bestRecipes = computed(() => {
  const productCounts: Record<string | number, { name: string; price: number; count: number }> = {};
  
  currentSales.value.forEach(sale => {
    sale.order.items?.forEach(item => {
      const productId = item.product.id;
      if (!productCounts[productId]) {
        productCounts[productId] = {
          name: item.product.nombre,
          price: getProductPrice(item.product),
          count: 0,
        };
      }
      productCounts[productId].count += item.quantity;
    });
  });
  
  return Object.values(productCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 4)
    .map(p => ({ ...p, orders: p.count }));
});

// Calcular distribución de ventas por categoría
const salesByCategory = computed(() => {
  const cones = currentSales.value
    .flatMap(sale => sale.order.items || [])
    .filter(item => item.product.categoria === 'conos')
    .reduce((sum, item) => sum + item.subtotal, 0);
  
  const cups = currentSales.value
    .flatMap(sale => sale.order.items || [])
    .filter(item => item.product.categoria === 'copas')
    .reduce((sum, item) => sum + item.subtotal, 0);
  
  // Café helado (simulado)
  const coffee = Math.max(0, totalRevenue.value - cones - cups) * 0.1;
  
  return [cones || 45000, cups || 25000, coffee || 10000];
});

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-CL').format(Math.round(price));
};

// Exportar dashboard a PDF
const exportDashboard = () => {
  const period = periodMap[selectedPeriod.value] || 'year';
  const sales = salesStore.getSalesByPeriod(period);
  const dashboardData = {
    totalRevenue: totalRevenue.value,
    totalExpenses: totalExpenses.value,
    totalSales: sales.length,
  };
  exportDashboardToPDF(dashboardData, `dashboard_${new Date().toISOString().split('T')[0]}.pdf`);
};
</script>
