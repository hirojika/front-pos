<template>
  <Modal
    :is-open="isOpen"
    title="Aplicar Descuento"
    @update:is-open="$emit('update:isOpen', $event)"
  >
    <div class="space-y-6">
      <!-- Información del pedido -->
      <div class="p-4 bg-gray-50 rounded-lg">
        <div class="flex justify-between text-sm mb-2">
          <span class="text-gray-600">Subtotal (IVA incluido):</span>
          <span class="font-medium">${{ formatPrice(subtotal) }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-600">IVA incluido (19%):</span>
          <span class="font-medium">${{ formatPrice(subtotal * (19 / 119)) }}</span>
        </div>
        <div class="flex justify-between text-lg font-bold mt-2 pt-2 border-t border-gray-300">
          <span>Total:</span>
          <span class="text-primary">${{ formatPrice(subtotal) }}</span>
        </div>
      </div>

      <!-- Tipo de descuento -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-3">
          Tipo de Descuento *
        </label>
        <div class="grid grid-cols-2 gap-3">
          <button
            type="button"
            @click="discountType = 'percentage'"
            :class="[
              'p-3 border-2 rounded-lg transition-all text-center',
              discountType === 'percentage'
                ? 'border-primary bg-primary/10'
                : 'border-gray-200 hover:border-gray-300'
            ]"
          >
            <div class="flex items-center justify-center gap-2">
              <div
                :class="[
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                  discountType === 'percentage'
                    ? 'border-primary bg-primary'
                    : 'border-gray-300'
                ]"
              >
                <svg v-if="discountType === 'percentage'" class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
              <span class="font-medium">Porcentaje</span>
            </div>
          </button>
          <button
            type="button"
            @click="discountType = 'fixed'"
            :class="[
              'p-3 border-2 rounded-lg transition-all text-center',
              discountType === 'fixed'
                ? 'border-primary bg-primary/10'
                : 'border-gray-200 hover:border-gray-300'
            ]"
          >
            <div class="flex items-center justify-center gap-2">
              <div
                :class="[
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                  discountType === 'fixed'
                    ? 'border-primary bg-primary'
                    : 'border-gray-300'
                ]"
              >
                <svg v-if="discountType === 'fixed'" class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
              <span class="font-medium">Monto Fijo</span>
            </div>
          </button>
        </div>
      </div>

      <!-- Valor del descuento -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          <span v-if="discountType === 'percentage'">Porcentaje de Descuento (%) *</span>
          <span v-else>Monto del Descuento ($) *</span>
        </label>
        <div class="relative">
          <input
            v-model.number="discountValue"
            type="number"
            :min="0"
            :max="discountType === 'percentage' ? maxPercentage : subtotal"
            :step="discountType === 'percentage' ? 1 : 100"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            :placeholder="discountType === 'percentage' ? 'Ej: 10' : 'Ej: 1000'"
            @input="validateDiscount"
          />
          <span v-if="discountType === 'percentage'" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            %
          </span>
          <span v-else class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            $
          </span>
        </div>
        <p class="text-xs text-gray-500 mt-1">
          <span v-if="discountType === 'percentage'">
            Máximo: {{ maxPercentage }}% ({{ formatPrice(maxDiscountAmount) }})
          </span>
          <span v-else>
            Máximo: ${{ formatPrice(subtotal) }}
          </span>
        </p>
      </div>

      <!-- Vista previa del descuento -->
      <div v-if="discountValue > 0" class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 class="font-semibold text-sm text-blue-900 mb-2">Vista Previa del Descuento</h4>
        <div class="space-y-1 text-sm">
          <div class="flex justify-between">
            <span class="text-blue-700">Subtotal (IVA incluido):</span>
            <span class="font-medium text-blue-900">${{ formatPrice(subtotal) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-blue-700">Descuento:</span>
            <span class="font-medium text-red-600">-${{ formatPrice(calculatedDiscount) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-blue-700">Total con descuento:</span>
            <span class="font-medium text-blue-900">${{ formatPrice(calculatedTotal) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-blue-700">IVA incluido (19%):</span>
            <span class="font-medium text-blue-900">${{ formatPrice(calculatedIva) }}</span>
          </div>
        </div>
      </div>

      <!-- Mensaje de error -->
      <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-sm text-red-600">{{ error }}</p>
      </div>

      <!-- Botones de acción rápida (solo para porcentaje) -->
      <div v-if="discountType === 'percentage'" class="grid grid-cols-4 gap-2">
        <button
          v-for="percent in [5, 10, 15, 20]"
          :key="percent"
          type="button"
          @click="applyQuickDiscount(percent)"
          class="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {{ percent }}%
        </button>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-between items-center w-full gap-3">
        <button
          v-if="currentDiscount && currentDiscount > 0"
          type="button"
          @click="handleClearDiscount"
          class="px-4 py-2 text-red-700 bg-red-50 border border-red-300 rounded-lg hover:bg-red-100 transition-colors"
        >
          Quitar Descuento
        </button>
        <div v-else></div>
        <div class="flex gap-3">
          <button
            type="button"
            @click="$emit('update:isOpen', false)"
            class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            @click="handleApplyDiscount"
            :disabled="!discountValue || discountValue <= 0 || error !== ''"
            class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            Aplicar Descuento
          </button>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import Modal from './Modal.vue';

const props = defineProps<{
  isOpen: boolean;
  subtotal: number;
  currentDiscount?: number;
  discountType?: 'percentage' | 'fixed';
  discountValue?: number; // Valor original del descuento (porcentaje o monto)
  maxPercentage?: number; // Máximo porcentaje de descuento permitido (por defecto 100%)
}>();

const emit = defineEmits<{
  'update:isOpen': [value: boolean];
  'apply': [discount: number, type: 'percentage' | 'fixed'];
  'clear': [];
}>();

const discountType = ref<'percentage' | 'fixed'>('percentage');
const discountValue = ref<number>(0);
const error = ref('');
const maxPercentage = computed(() => props.maxPercentage || 100); // Por defecto 100%, pero configurable

// Calcular el monto máximo de descuento
const maxDiscountAmount = computed(() => {
  return props.subtotal * (maxPercentage.value / 100);
});

// Calcular el descuento aplicado
const calculatedDiscount = computed(() => {
  if (!discountValue.value || discountValue.value <= 0) return 0;
  
  if (discountType.value === 'percentage') {
    const discount = props.subtotal * (discountValue.value / 100);
    return Math.min(discount, maxDiscountAmount.value);
  } else {
    return Math.min(discountValue.value, props.subtotal);
  }
});

// Calcular total con descuento (el precio ya incluye IVA, no se suma)
const calculatedTotal = computed(() => {
  return props.subtotal - calculatedDiscount.value;
});

// Calcular IVA incluido en el total con descuento
const calculatedIva = computed(() => {
  const totalWithDiscount = calculatedTotal.value;
  // Extraer IVA: precio * (19/119)
  return totalWithDiscount * (19 / 119);
});

// Validar descuento
const validateDiscount = () => {
  error.value = '';

  if (!discountValue.value || discountValue.value <= 0) {
    error.value = 'El valor del descuento debe ser mayor a 0';
    return;
  }

  if (discountType.value === 'percentage') {
    if (discountValue.value > maxPercentage.value) {
      error.value = `El descuento no puede ser mayor al ${maxPercentage.value}%`;
      return;
    }
    if (discountValue.value < 0) {
      error.value = 'El porcentaje no puede ser negativo';
      return;
    }
  } else {
    if (discountValue.value > props.subtotal) {
      error.value = `El descuento no puede ser mayor al subtotal ($${formatPrice(props.subtotal)})`;
      return;
    }
    if (discountValue.value < 0) {
      error.value = 'El monto no puede ser negativo';
      return;
    }
  }
};

// Aplicar descuento
const handleApplyDiscount = () => {
  validateDiscount();
  if (error.value) return;

  emit('apply', discountValue.value, discountType.value);
  emit('update:isOpen', false);
};

// Aplicar descuento rápido (desde botones)
const applyQuickDiscount = (percent: number) => {
  discountType.value = 'percentage';
  discountValue.value = percent;
  error.value = '';
  // Aplicar automáticamente después de un breve delay para dar feedback visual
  setTimeout(() => {
    handleApplyDiscount();
  }, 100);
};

// Quitar descuento
const handleClearDiscount = () => {
  discountValue.value = 0;
  error.value = '';
  emit('clear');
  emit('update:isOpen', false);
};

// Formatear precio
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-CL').format(Math.round(price));
};

// Resetear formulario cuando se cierra o se abre
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    // Si hay un descuento actual, cargarlo
    if (props.discountType && props.discountValue !== undefined && props.discountValue > 0) {
      discountType.value = props.discountType;
      discountValue.value = props.discountValue;
    } else if (props.currentDiscount && props.currentDiscount > 0 && props.discountType) {
      // Fallback: calcular el valor original desde el monto
      if (props.discountType === 'percentage') {
        discountType.value = 'percentage';
        // Intentar calcular el porcentaje (puede no ser exacto si el subtotal cambió)
        discountValue.value = Math.round((props.currentDiscount / props.subtotal) * 100);
      } else {
        discountType.value = 'fixed';
        discountValue.value = props.currentDiscount;
      }
    } else {
      discountType.value = 'percentage';
      discountValue.value = 0;
    }
    error.value = '';
  }
});

// Resetear cuando cambia el tipo de descuento
watch(discountType, () => {
  discountValue.value = 0;
  error.value = '';
});
</script>

