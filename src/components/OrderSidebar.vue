<template>
  <aside class="w-80 bg-white border-l border-gray-200 h-screen fixed right-0 top-0 flex flex-col">
    <!-- Header del pedido -->
    <div class="p-4 border-b border-gray-200">
      <div class="flex gap-2 mb-4">
        <button
          @click="handleClearOrder"
          class="flex-1 bg-red-100 text-red-700 px-3 py-2 rounded-lg font-medium hover:bg-red-200 transition-colors text-sm"
        >
          Borrar Pedido
        </button>
        <button class="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm">
          Más Acciones
        </button>
      </div>
      <h3 class="font-semibold text-gray-900">Pedido #{{ orderNumber }}</h3>
    </div>

    <!-- Items del pedido -->
    <div class="flex-1 overflow-y-auto p-4">
      <div v-if="currentOrder.length === 0" class="text-center text-gray-500 py-8">
        <p>No hay items en el pedido</p>
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="item in currentOrder"
          :key="item.product.id"
          class="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
        >
          <div class="w-16 h-16 bg-gradient-to-br from-pink-100 to-purple-100 rounded flex items-center justify-center flex-shrink-0">
            <span class="text-2xl">🍦</span>
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="font-medium text-sm text-gray-900 truncate">{{ item.product.name }}</h4>
            <p class="text-xs text-gray-500">${{ formatPrice(item.product.price) }} c/u</p>
            <div class="flex items-center gap-2 mt-2">
              <button
                @click="updateQuantity(item.product.id, item.quantity - 1)"
                class="w-6 h-6 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                </svg>
              </button>
              <span class="text-sm font-medium w-8 text-center">{{ item.quantity }}</span>
              <button
                @click="updateQuantity(item.product.id, item.quantity + 1)"
                class="w-6 h-6 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>
          <div class="text-right">
            <p class="font-semibold text-sm">${{ formatPrice(item.subtotal) }}</p>
            <button
              @click="removeItem(item.product.id)"
              class="mt-1 text-red-600 hover:text-red-800"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Resumen del pedido -->
    <div class="p-4 border-t border-gray-200 space-y-3">
      <div class="flex justify-between text-sm">
        <span class="text-gray-600">Descuento</span>
        <span class="font-medium">${{ formatPrice(0) }}</span>
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-gray-600">IVA</span>
        <span class="font-medium">${{ formatPrice(iva) }}</span>
      </div>
      <div class="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
        <span>Total</span>
        <span class="text-[#FF69B4]">${{ formatPrice(total) }}</span>
      </div>
      <button
        @click="handleRegisterOrder"
        :disabled="currentOrder.length === 0"
        class="w-full bg-[#FF69B4] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#FF1493] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Registrar Pedido
      </button>
    </div>

    <!-- Modal de método de pago -->
    <PaymentMethodModal
      :is-open="showPaymentModal"
      :total="total"
      @update:is-open="showPaymentModal = $event"
      @confirm="handlePaymentConfirm"
    />
  </aside>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useOrdersStore } from '../store/orders';
import { useSalesStore } from '../store/sales';
import PaymentMethodModal from './PaymentMethodModal.vue';

const ordersStore = useOrdersStore();
const salesStore = useSalesStore();

const currentOrder = computed(() => ordersStore.currentOrder);
const iva = computed(() => ordersStore.iva);
const total = computed(() => ordersStore.total);

const orderNumber = computed(() => {
  return String(ordersStore.getOrderHistory.length + 1).padStart(3, '0');
});

const showPaymentModal = ref(false);

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-CL').format(Math.round(price));
};

const updateQuantity = (productId: string, quantity: number) => {
  ordersStore.updateQuantity(productId, quantity);
};

const removeItem = (productId: string) => {
  ordersStore.removeFromOrder(productId);
};

const handleClearOrder = () => {
  if (confirm('¿Estás seguro de borrar el pedido?')) {
    ordersStore.clearOrder();
  }
};

const handleRegisterOrder = () => {
  if (currentOrder.value.length === 0) return;
  showPaymentModal.value = true;
};

const handlePaymentConfirm = (paymentMethod: 'Efectivo' | 'Débito' | 'Crédito' | 'Transferencia') => {
  const order = ordersStore.registerOrder(0);
  
  // Crear venta asociada
  salesStore.addSale({
    id: order.id,
    orderId: order.id,
    date: order.createdAt,
    branch: 'Casa Matriz',
    seller: 'Empleado #004',
    paymentMethod: paymentMethod,
    subtotal: order.subtotal,
    iva: order.iva,
    total: order.total,
    status: 'Emitida',
    order: order,
  });
  
  alert(`Pedido ${order.id} registrado exitosamente con pago ${paymentMethod}`);
};
</script>

