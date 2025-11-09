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
        <div class="space-y-3">
          <div
            v-for="(item, index) in sale.order.items"
            :key="`${item.product.id}-${index}-${item.customization ? JSON.stringify(item.customization).substring(0, 20) : 'no-custom'}`"
            class="p-4 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div class="flex items-start justify-between mb-2">
              <div class="flex-1">
                <p class="font-medium text-sm text-gray-900">{{ item.product.nombre }}</p>
                <p class="text-xs text-gray-500 mt-1">
                  Cantidad: {{ item.quantity }} × ${{ formatPrice(item.customization ? item.subtotal / item.quantity : getProductPrice(item.product)) }}
                </p>
              </div>
              <p class="font-semibold text-sm text-gray-900">${{ formatPrice(item.subtotal) }}</p>
            </div>
            
            <!-- Personalización -->
            <div v-if="item.customization" class="mt-3 pt-3 border-t border-gray-300 space-y-1.5">
              <p class="text-xs font-semibold text-gray-700 mb-2">Personalización:</p>
              <div v-if="item.customization.variacionId !== null && item.customization.variacionId !== undefined" class="text-xs text-gray-600">
                <span class="font-medium">Variación:</span> {{ getVariationName(item.product, item.customization.variacionId) }}
              </div>
              <div v-if="item.customization.sabores && item.customization.sabores.length > 0" class="text-xs text-gray-600">
                <span class="font-medium">Sabores:</span>
                <span v-for="(sabor, idx) in item.customization.sabores" :key="sabor.id || idx">
                  {{ sabor.nombre || getIngredientNameById(sabor.id) || sabor.id }} ({{ sabor.cantidad }})<span v-if="idx < item.customization.sabores.length - 1">, </span>
                </span>
              </div>
              <div v-if="item.customization.salsa !== null && item.customization.salsa !== undefined" class="text-xs text-gray-600">
                <span class="font-medium">Salsa:</span> {{ getIngredientName('salsa', item.customization.salsa) }}
              </div>
              <div v-if="item.customization.fruta !== null && item.customization.fruta !== undefined" class="text-xs text-gray-600">
                <span class="font-medium">Fruta:</span> {{ getIngredientName('fruta', item.customization.fruta) }}
              </div>
              <div v-if="item.customization.crema === true" class="text-xs text-gray-600">
                <span class="font-medium">Crema chantilly:</span> Sí
              </div>
              <div v-if="item.customization.extras && item.customization.extras.toppings && item.customization.extras.toppings.length > 0" class="text-xs text-gray-600">
                <span class="font-medium">Toppings:</span>
                <span v-for="(topping, idx) in item.customization.extras.toppings" :key="topping.id || idx">
                  {{ getIngredientName('topping', topping.id) }} ({{ topping.cantidad }})<span v-if="idx < item.customization.extras.toppings.length - 1">, </span>
                </span>
              </div>
              <div v-if="item.customization.extras && item.customization.extras.salsa_extra && item.customization.extras.salsa_extra.cantidad > 0" class="text-xs text-gray-600">
                <span class="font-medium">Salsa extra:</span> {{ item.customization.extras.salsa_extra.cantidad }}x
                <span v-if="item.customization.extras.salsa_extra.tipo">({{ getIngredientName('salsa', item.customization.extras.salsa_extra.tipo) }})</span>
              </div>
              <div v-if="item.customization.extras && item.customization.extras.fruta_extra && item.customization.extras.fruta_extra.cantidad > 0" class="text-xs text-gray-600">
                <span class="font-medium">Fruta extra:</span> {{ item.customization.extras.fruta_extra.cantidad }}x
                <span v-if="item.customization.extras.fruta_extra.tipo">({{ getIngredientName('fruta', item.customization.extras.fruta_extra.tipo) }})</span>
              </div>
              <div v-if="item.customization.extras && item.customization.extras.crema_extra > 0" class="text-xs text-gray-600">
                <span class="font-medium">Crema extra:</span> {{ item.customization.extras.crema_extra }}x
              </div>
            </div>
            <!-- Mostrar mensaje si es configurable pero no tiene personalización -->
            <div v-else-if="item.product.tipo === 'configurable'" class="mt-3 pt-3 border-t border-gray-300">
              <p class="text-xs text-orange-600 italic">Sin personalización</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Resumen -->
      <div class="border-t border-gray-200 pt-4 space-y-2">
        <div class="flex justify-between text-sm">
          <span class="text-gray-600">Subtotal (IVA incluido)</span>
          <span class="font-medium">${{ formatPrice(sale.subtotal) }}</span>
        </div>
        <div v-if="sale.discount !== undefined && sale.discount > 0" class="flex justify-between text-sm">
          <span class="text-gray-600">Descuento</span>
          <span class="font-medium text-red-600">-${{ formatPrice(sale.discount) }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-600">IVA incluido (19%)</span>
          <span class="font-medium">${{ formatPrice(sale.iva) }}</span>
        </div>
        <div class="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
          <span>Total</span>
          <span class="text-primary">${{ formatPrice(sale.total) }}</span>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import Modal from './Modal.vue';
import type { Sale } from '../store/sales';
import type { Producto, TipoIngrediente, Id } from '@/types';
import { useIngredientsStore } from '../store/ingredients';

defineProps<{
  isOpen: boolean;
  sale: Sale | null;
}>();

defineEmits<{
  'update:isOpen': [value: boolean];
}>();

const ingredientsStore = useIngredientsStore();

// Helper para obtener el precio de un producto según su tipo
function getProductPrice(product: Producto): number {
  if (product.tipo === 'configurable') {
    return product.precio_base_clp;
  } else {
    return product.precio_clp;
  }
}

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

