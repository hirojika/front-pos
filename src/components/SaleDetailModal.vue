<template>
  <Modal
    :is-open="isOpen"
    :title="`Boleta ${sale?.id || ''}`"
    :show-footer="false"
    @update:is-open="$emit('update:isOpen', $event)"
  >
    <div v-if="sale" class="space-y-6">
      <!-- Información de la boleta -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="text-sm font-medium text-gray-500">Fecha de emisión</label>
          <p class="text-sm text-gray-900">{{ formatDate(sale.date) }}</p>
        </div>
        <div>
          <label class="text-sm font-medium text-gray-500">Estado</label>
          <p class="text-sm">
            <span
              class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium"
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
          </p>
        </div>
        <div>
          <label class="text-sm font-medium text-gray-500">Sucursal</label>
          <p class="text-sm text-gray-900">{{ sale.branch }}</p>
        </div>
        <div>
          <label class="text-sm font-medium text-gray-500">Vendedor</label>
          <p class="text-sm text-gray-900">{{ sale.seller }}</p>
        </div>
        <div>
          <label class="text-sm font-medium text-gray-500">Método de pago</label>
          <p class="text-sm text-gray-900">{{ sale.paymentMethod }}</p>
        </div>
      </div>

      <!-- Items de la venta -->
      <div class="border-t border-gray-200 pt-4">
        <h3 class="font-semibold text-gray-900 mb-3">Items</h3>
        <div class="space-y-2">
          <div
            v-for="(item, index) in sale.order.items"
            :key="index"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div class="flex-1">
              <p class="font-medium text-sm text-gray-900">{{ item.product.name }}</p>
              <p class="text-xs text-gray-500">Cantidad: {{ item.quantity }} × ${{ formatPrice(item.product.price) }}</p>
            </div>
            <p class="font-semibold text-sm text-gray-900">${{ formatPrice(item.subtotal) }}</p>
          </div>
        </div>
      </div>

      <!-- Resumen -->
      <div class="border-t border-gray-200 pt-4 space-y-2">
        <div class="flex justify-between text-sm">
          <span class="text-gray-600">Subtotal</span>
          <span class="font-medium">${{ formatPrice(sale.subtotal) }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-600">IVA (19%)</span>
          <span class="font-medium">${{ formatPrice(sale.iva) }}</span>
        </div>
        <div class="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
          <span>Total</span>
          <span class="text-[#FF69B4]">${{ formatPrice(sale.total) }}</span>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import Modal from './Modal.vue';
import type { Sale } from '../store/sales';

defineProps<{
  isOpen: boolean;
  sale: Sale | null;
}>();

defineEmits<{
  'update:isOpen': [value: boolean];
}>();

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
</script>

