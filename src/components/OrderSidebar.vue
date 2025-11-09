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
          v-for="(item, index) in currentOrder"
          :key="`${item.product.id}-${index}-${JSON.stringify(item.customization || {})}`"
          class="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
        >
          <div class="w-16 h-16 bg-linear-to-br from-pink-100 to-purple-100 rounded flex items-center justify-center shrink-0">
            <span class="text-2xl">🍦</span>
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="font-medium text-sm text-gray-900 truncate">{{ item.product.nombre }}</h4>
            <div v-if="item.customization" class="text-xs text-gray-600 mt-1 space-y-0.5">
              <div v-if="item.customization.variacionId !== null && item.customization.variacionId !== undefined" class="text-primary font-medium">
                Variación: {{ getVariationName(item.product, item.customization.variacionId) }}
              </div>
              <div v-if="item.customization.sabores && item.customization.sabores.length > 0" class="block">
                <span class="font-medium">Sabores:</span>
                <span v-for="(sabor, idx) in item.customization.sabores" :key="sabor.id || idx">
                  {{ sabor.nombre || getIngredientNameById(sabor.id) || sabor.id }} ({{ sabor.cantidad }})<span v-if="idx < item.customization.sabores.length - 1">, </span>
                </span>
              </div>
              <div v-if="item.customization.salsa !== null && item.customization.salsa !== undefined" class="block">
                <span class="font-medium">Salsa:</span> {{ getIngredientName('salsa', item.customization.salsa) }}
              </div>
              <div v-if="item.customization.fruta !== null && item.customization.fruta !== undefined" class="block">
                <span class="font-medium">Fruta:</span> {{ getIngredientName('fruta', item.customization.fruta) }}
              </div>
              <div v-if="item.customization.crema === true" class="block">
                <span class="font-medium">Crema:</span> Sí
              </div>
              <div v-if="item.customization.extras && item.customization.extras.toppings && item.customization.extras.toppings.length > 0" class="block">
                <span class="font-medium">Toppings:</span>
                <span v-for="(topping, idx) in item.customization.extras.toppings" :key="topping.id || idx">
                  {{ getIngredientName('topping', topping.id) }} ({{ topping.cantidad }})<span v-if="idx < item.customization.extras.toppings.length - 1">, </span>
                </span>
              </div>
              <div v-if="item.customization.extras && item.customization.extras.salsa_extra && item.customization.extras.salsa_extra.cantidad > 0" class="block">
                <span class="font-medium">Salsa extra:</span> {{ item.customization.extras.salsa_extra.cantidad }}x
                <span v-if="item.customization.extras.salsa_extra.tipo">({{ getIngredientName('salsa', item.customization.extras.salsa_extra.tipo) }})</span>
              </div>
              <div v-if="item.customization.extras && item.customization.extras.fruta_extra && item.customization.extras.fruta_extra.cantidad > 0" class="block">
                <span class="font-medium">Fruta extra:</span> {{ item.customization.extras.fruta_extra.cantidad }}x
                <span v-if="item.customization.extras.fruta_extra.tipo">({{ getIngredientName('fruta', item.customization.extras.fruta_extra.tipo) }})</span>
              </div>
              <div v-if="item.customization.extras && item.customization.extras.crema_extra > 0" class="block">
                <span class="font-medium">Crema extra:</span> {{ item.customization.extras.crema_extra }}x
              </div>
            </div>
            <p class="text-xs text-gray-500">
              ${{ formatPrice(item.customization ? item.subtotal / item.quantity : getProductPrice(item.product)) }} c/u
            </p>
            <div class="flex items-center gap-2 mt-2">
              <button
                @click="updateQuantityByIndex(index, item.quantity - 1)"
                class="w-6 h-6 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                </svg>
              </button>
              <span class="text-sm font-medium w-8 text-center">{{ item.quantity }}</span>
              <button
                @click="updateQuantityByIndex(index, item.quantity + 1)"
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
              @click="removeItemByIndex(index)"
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
      <div class="flex items-center justify-between text-sm">
        <div class="flex items-center gap-2">
          <span class="text-gray-600">Descuento</span>
          <button
            v-if="!currentDiscount"
            @click="showDiscountModal = true"
            class="text-primary hover:text-primary-dark text-xs font-medium"
            title="Aplicar descuento"
          >
            Aplicar
          </button>
          <button
            v-else
            @click="showDiscountModal = true"
            class="text-blue-600 hover:text-blue-800 text-xs font-medium"
            title="Editar descuento"
          >
            Editar
          </button>
        </div>
        <div class="flex items-center gap-2">
          <span v-if="currentDiscount" class="text-xs text-gray-500">
            ({{ currentDiscount.type === 'percentage' ? `${currentDiscount.value}%` : `$${formatPrice(currentDiscount.value)}` }})
          </span>
          <span class="font-medium" :class="discountAmount > 0 ? 'text-red-600' : ''">
            {{ discountAmount > 0 ? '-' : '' }}${{ formatPrice(discountAmount) }}
          </span>
        </div>
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-gray-600">Subtotal (IVA incluido)</span>
        <span class="font-medium">${{ formatPrice(subtotal) }}</span>
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-gray-600">IVA incluido (19%)</span>
        <span class="font-medium">${{ formatPrice(iva) }}</span>
      </div>
      <div class="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
        <span>Total</span>
        <span class="text-primary">${{ formatPrice(total) }}</span>
      </div>
      <button
        @click="handleRegisterOrder"
        :disabled="currentOrder.length === 0"
        class="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

    <!-- Modal de descuentos -->
    <DiscountModal
      :is-open="showDiscountModal"
      :subtotal="subtotal"
      :current-discount="discountAmount"
      :discount-type="currentDiscount?.type"
      :discount-value="currentDiscount?.value"
      @update:is-open="showDiscountModal = $event"
      @apply="handleApplyDiscount"
      @clear="handleClearDiscount"
    />
  </aside>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useOrdersStore } from '../store/orders';
import { useIngredientsStore } from '../store/ingredients';
import { useSalesStore } from '../store/sales';
import PaymentMethodModal from './PaymentMethodModal.vue';
import DiscountModal from './DiscountModal.vue';
import type { Producto, TipoIngrediente, Id } from '@/types';

const ordersStore = useOrdersStore();
const ingredientsStore = useIngredientsStore();
const salesStore = useSalesStore();

// Helper para obtener el precio de un producto según su tipo
function getProductPrice(product: Producto): number {
  if (product.tipo === 'configurable') {
    return product.precio_base_clp;
  } else {
    return product.precio_clp;
  }
}

const currentOrder = computed(() => ordersStore.currentOrder);
const currentDiscount = computed(() => ordersStore.currentDiscount);
const subtotal = computed(() => ordersStore.subtotal);
const discountAmount = computed(() => ordersStore.discountAmount);
const iva = computed(() => ordersStore.iva);
const total = computed(() => ordersStore.total);

const orderNumber = computed(() => {
  return String(ordersStore.getOrderHistory.length + 1).padStart(3, '0');
});

const showPaymentModal = ref(false);
const showDiscountModal = ref(false);

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-CL').format(Math.round(price));
};

  const updateQuantityByIndex = (index: number, quantity: number) => {
    const item = currentOrder.value[index];
    if (item) {
      if (quantity <= 0) {
        removeItemByIndex(index);
      } else {
        // Actualizar cantidad y recalcular subtotal
        item.quantity = quantity;
        if (item.customization && item.product.tipo === 'configurable') {
          // Para items personalizados, recalcular el precio
          const price = ordersStore.calculateCustomizedPrice(
            item.product,
            item.customization,
            ingredientsStore
          );
          item.subtotal = price * quantity;
        } else {
          const price = getProductPrice(item.product);
          item.subtotal = price * quantity;
        }
      }
    }
};

const removeItemByIndex = (index: number) => {
  currentOrder.value.splice(index, 1);
};

// Helpers para mostrar nombres de personalización
function getVariationName(product: Producto, variacionId: Id | null): string {
  if (product.tipo === 'configurable' && variacionId) {
    const variacion = product.variaciones?.find(v => v.id_variacion === variacionId);
    return variacion?.nombre || 'Bañado';
  }
  return '';
}

function getIngredientName(tipo: TipoIngrediente, id: Id | null): string {
  if (!id) return '';
  const ingrediente = ingredientsStore.getIngredientesByTipo(tipo).find(
    (ing: any) => ing.id_ingrediente === id
  );
  return ingrediente?.nombre || String(id);
}

function getIngredientNameById(id: Id | null): string {
  if (!id) return '';
  // Buscar en todos los tipos de ingredientes
  const tipos: TipoIngrediente[] = ['helado', 'salsa', 'banado', 'fruta', 'topping', 'crema', 'cafe', 'leche'];
  for (const tipo of tipos) {
    const ingrediente = ingredientsStore.getIngredientesByTipo(tipo).find(
      (ing: any) => ing.id_ingrediente === id
    );
    if (ingrediente) {
      return ingrediente.nombre;
    }
  }
  return String(id);
}

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
  const order = ordersStore.registerOrder();
  
  // Crear venta asociada - hacer una copia profunda del order para preservar la personalización
  const saleOrder: typeof order = JSON.parse(JSON.stringify(order));
  
  salesStore.addSale({
    id: order.id,
    orderId: order.id,
    date: order.createdAt,
    branch: 'Casa Matriz',
    seller: 'Empleado #004',
    paymentMethod: paymentMethod,
    subtotal: order.subtotal,
    discount: order.discount > 0 ? order.discount : undefined,
    iva: order.iva,
    total: order.total,
    status: 'Emitida',
    order: saleOrder,
  });
  
  // La notificación se agregará automáticamente desde el store de ventas
  
  alert(`Pedido ${order.id} registrado exitosamente con pago ${paymentMethod}`);
};

const handleApplyDiscount = (value: number, type: 'percentage' | 'fixed') => {
  ordersStore.applyDiscount(value, type);
};

const handleClearDiscount = () => {
  ordersStore.clearDiscount();
};
</script>

