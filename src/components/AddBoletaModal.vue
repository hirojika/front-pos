<template>
  <Modal
    :is-open="isOpen"
    title="Añadir Boleta Manualmente"
    :show-footer="false"
    @update:is-open="$emit('update:isOpen', $event)"
  >
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Información básica -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Fecha de emisión *
          </label>
          <input
            v-model="form.date"
            type="datetime-local"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Sucursal *
          </label>
          <select
            v-model="form.branch"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="Casa Matriz">Casa Matriz</option>
            <!-- Futuro: cargar desde store de sucursales -->
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Vendedor *
          </label>
          <select
            v-model="form.seller"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="Empleado #001">Empleado #001</option>
            <option value="Empleado #002">Empleado #002</option>
            <option value="Empleado #003">Empleado #003</option>
            <option value="Empleado #004">Empleado #004</option>
            <!-- Futuro: cargar desde store de empleados -->
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Método de pago *
          </label>
          <select
            v-model="form.paymentMethod"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="Efectivo">Efectivo</option>
            <option value="Débito">Débito</option>
            <option value="Crédito">Crédito</option>
            <option value="Transferencia">Transferencia</option>
          </select>
        </div>
      </div>

      <!-- Items del pedido -->
      <div class="border-t border-gray-200 pt-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Items del Pedido</h3>
          <button
            type="button"
            @click="showAddProductModal = true"
            class="px-3 py-1.5 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Añadir Producto
          </button>
        </div>

        <!-- Lista de items -->
        <div v-if="form.items.length === 0" class="text-center text-gray-500 py-8 border-2 border-dashed border-gray-200 rounded-lg">
          <p>No hay productos agregados</p>
          <p class="text-sm mt-1">Haz clic en "Añadir Producto" para comenzar</p>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="(item, index) in form.items"
            :key="index"
            class="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
          >
            <div class="flex-1">
              <p class="font-medium text-sm text-gray-900">{{ item.product.nombre }}</p>
              <p class="text-xs text-gray-500">${{ formatPrice(getProductPrice(item.product)) }} c/u</p>
            </div>
            <div class="flex items-center gap-2">
              <button
                type="button"
                @click="updateQuantity(index, item.quantity - 1)"
                class="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                </svg>
              </button>
              <input
                v-model.number="item.quantity"
                type="number"
                min="1"
                @input="updateItemSubtotal(index)"
                class="w-16 px-2 py-1 text-center border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button
                type="button"
                @click="updateQuantity(index, item.quantity + 1)"
                class="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
            <div class="text-right min-w-[100px]">
              <p class="font-semibold text-sm">${{ formatPrice(item.subtotal) }}</p>
            </div>
            <button
              type="button"
              @click="removeItem(index)"
              class="text-red-600 hover:text-red-800 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Resumen de totales -->
      <div class="border-t border-gray-200 pt-4 space-y-2">
        <div class="flex justify-between text-sm">
          <span class="text-gray-600">Subtotal (IVA incluido)</span>
          <span class="font-medium">${{ formatPrice(calculatedSubtotal) }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-600">IVA incluido (19%)</span>
          <span class="font-medium">${{ formatPrice(calculatedIva) }}</span>
        </div>
        <div class="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
          <span>Total</span>
          <span class="text-primary">${{ formatPrice(calculatedTotal) }}</span>
        </div>
      </div>

      <!-- Mensaje de error -->
      <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-sm text-red-600">{{ error }}</p>
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
        :disabled="form.items.length === 0"
        class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Crear Boleta
      </button>
    </template>

    <!-- Modal para seleccionar producto -->
    <Modal
      :is-open="showAddProductModal"
      title="Seleccionar Producto"
      :show-footer="false"
      @update:is-open="showAddProductModal = $event"
    >
      <div class="space-y-4">
        <div class="relative">
          <input
            v-model="productSearch"
            type="text"
            placeholder="Buscar producto..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div class="max-h-64 overflow-y-auto space-y-2">
          <button
            v-for="product in filteredProducts"
            :key="product.id"
            type="button"
            @click="addProductToForm(product)"
            class="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-primary hover:bg-pink-50 transition-colors"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-sm text-gray-900">{{ product.nombre }}</p>
                <p class="text-xs text-gray-500">{{ product.descripcion || '' }}</p>
              </div>
              <div class="text-right">
                <p class="font-semibold text-sm text-gray-900">${{ formatPrice(getProductPrice(product)) }}</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      <template #footer>
        <button
          type="button"
          @click="showAddProductModal = false"
          class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cerrar
        </button>
      </template>
    </Modal>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import Modal from './Modal.vue';
import { useProductsStore } from '../store/products';
import { useSalesStore } from '../store/sales';
import type { Producto } from '@/types';
import type { OrderItem, Order } from '../store/orders';

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  'update:isOpen': [value: boolean];
  'created': [];
}>();

const productsStore = useProductsStore();
const salesStore = useSalesStore();

const showAddProductModal = ref(false);
const productSearch = ref('');
const error = ref('');

// Formulario
const form = ref({
  date: new Date().toISOString().slice(0, 16), // Formato para datetime-local
  branch: 'Casa Matriz',
  seller: 'Empleado #004',
  paymentMethod: 'Efectivo' as 'Efectivo' | 'Débito' | 'Crédito' | 'Transferencia',
  items: [] as OrderItem[],
});

// Helper para obtener el precio de un producto según su tipo
function getProductPrice(product: Producto): number {
  if (product.tipo === 'configurable') {
    return product.precio_base_clp;
  } else {
    return product.precio_clp;
  }
}

// Productos filtrados
const allProducts = computed(() => {
  return productsStore.products;
});

const filteredProducts = computed(() => {
  if (!productSearch.value) return allProducts.value;
  const query = productSearch.value.toLowerCase();
  return allProducts.value.filter(p =>
    p.nombre.toLowerCase().includes(query) ||
    (p.descripcion ?? '').toLowerCase().includes(query)
  );
});

// Cálculos
// Los precios ya incluyen IVA, así que el subtotal es la suma directa
const calculatedSubtotal = computed(() => {
  return form.value.items.reduce((sum, item) => sum + item.subtotal, 0);
});

// Extraer IVA del subtotal (precio * 19/119)
const calculatedIva = computed(() => {
  return calculatedSubtotal.value * (19 / 119); // Extraer IVA de precio que ya lo incluye
});

// El total es igual al subtotal (ya incluye IVA)
const calculatedTotal = computed(() => {
  return calculatedSubtotal.value;
});

// Métodos
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-CL').format(price);
};

const addProductToForm = (product: Producto) => {
  const existingIndex = form.value.items.findIndex(item => item.product.id === product.id);
  const price = getProductPrice(product);
  
  if (existingIndex > -1) {
    // Si el producto ya existe, aumentar cantidad
    const existingItem = form.value.items[existingIndex];
    if (existingItem) {
      existingItem.quantity += 1;
      updateItemSubtotal(existingIndex);
    }
  } else {
    // Agregar nuevo producto
    form.value.items.push({
      product,
      quantity: 1,
      subtotal: price,
    });
  }
  
  showAddProductModal.value = false;
  productSearch.value = '';
};

const updateQuantity = (index: number, newQuantity: number) => {
  if (newQuantity < 1) {
    removeItem(index);
    return;
  }
  const item = form.value.items[index];
  if (item) {
    item.quantity = newQuantity;
    updateItemSubtotal(index);
  }
};

const updateItemSubtotal = (index: number) => {
  const item = form.value.items[index];
  if (item) {
    const price = getProductPrice(item.product);
    item.subtotal = price * item.quantity;
  }
};

const removeItem = (index: number) => {
  form.value.items.splice(index, 1);
};

const handleSubmit = () => {
  error.value = '';

  // Validaciones
  if (form.value.items.length === 0) {
    error.value = 'Debes agregar al menos un producto';
    return;
  }

  if (!form.value.date) {
    error.value = 'Debes seleccionar una fecha';
    return;
  }

  // Generar ID de boleta usando el método del store
  const saleId = salesStore.getNextSaleId();

  // Crear orden
  const order: Order = {
    id: saleId,
    items: form.value.items,
    subtotal: calculatedSubtotal.value,
    discount: 0,
    iva: calculatedIva.value,
    total: calculatedTotal.value,
    createdAt: new Date(form.value.date),
  };

  // Crear venta
  const sale = {
    id: saleId,
    orderId: saleId,
    date: new Date(form.value.date),
    branch: form.value.branch,
    seller: form.value.seller,
    paymentMethod: form.value.paymentMethod,
    subtotal: calculatedSubtotal.value,
    iva: calculatedIva.value,
    total: calculatedTotal.value,
    status: 'Emitida' as const,
    order: order,
  };

  // Agregar venta
  salesStore.addSale(sale);

  // La notificación se agregará automáticamente desde el store de ventas

  // Resetear formulario
  form.value = {
    date: new Date().toISOString().slice(0, 16),
    branch: 'Casa Matriz',
    seller: 'Empleado #004',
    paymentMethod: 'Efectivo',
    items: [],
  };

  // Cerrar modal y emitir evento
  emit('update:isOpen', false);
  emit('created');
};

// Resetear formulario cuando se cierra el modal
watch(() => props.isOpen, (isOpen) => {
  if (!isOpen) {
    form.value = {
      date: new Date().toISOString().slice(0, 16),
      branch: 'Casa Matriz',
      seller: 'Empleado #004',
      paymentMethod: 'Efectivo',
      items: [],
    };
    error.value = '';
    productSearch.value = '';
  }
});
</script>

