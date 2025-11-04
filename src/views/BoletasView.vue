<template>
  <div>
    <Header title="Boletas" action-label="+ Añadir Boleta" @action="handleAddBoleta" />
    <main class="p-6">
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  N° Boleta
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha de emisión
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sucursal
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vendedor
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Método de pago
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subtotal
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IVA
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="sale in sales"
                :key="sale.id"
                class="hover:bg-gray-50"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ sale.id }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(sale.date) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ sale.branch }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ sale.seller }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ sale.paymentMethod }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${{ formatPrice(sale.subtotal) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${{ formatPrice(sale.iva) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  ${{ formatPrice(sale.total) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="
                      sale.status === 'Emitida'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    "
                  >
                    <span
                      class="w-2 h-2 rounded-full"
                      :class="
                        sale.status === 'Emitida'
                          ? 'bg-green-500'
                          : 'bg-red-500'
                      "
                    ></span>
                    {{ sale.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center gap-3">
                    <button
                      @click="viewSale(sale.id)"
                      class="text-blue-600 hover:text-blue-900"
                      title="Ver"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button
                      @click="deleteSale(sale.id)"
                      class="text-red-600 hover:text-red-900"
                      title="Eliminar"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <!-- Modal de detalle de boleta -->
    <SaleDetailModal
      :is-open="showDetailModal"
      :sale="selectedSale"
      @update:is-open="showDetailModal = $event"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import Header from '../components/Header.vue';
import SaleDetailModal from '../components/SaleDetailModal.vue';
import { useSalesStore } from '../store/sales';
import type { Sale } from '../store/sales';

const salesStore = useSalesStore();
const sales = computed(() => salesStore.getSales);

const showDetailModal = ref(false);
const selectedSale = ref<Sale | null>(null);

const formatDate = (date: Date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-CL').format(price);
};

const viewSale = (id: string) => {
  const sale = sales.value.find(s => s.id === id);
  if (sale) {
    selectedSale.value = sale;
    showDetailModal.value = true;
  }
};

const deleteSale = (id: string) => {
  if (confirm(`¿Estás seguro de eliminar la boleta ${id}?`)) {
    salesStore.deleteSale(id);
  }
};

const handleAddBoleta = () => {
  alert('Funcionalidad de añadir boleta manualmente - En desarrollo');
};
</script>
