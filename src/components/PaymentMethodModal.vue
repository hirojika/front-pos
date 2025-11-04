<template>
  <Modal
    :is-open="isOpen"
    title="Seleccionar Método de Pago"
    @update:is-open="$emit('update:isOpen', $event)"
    @confirm="handleConfirm"
  >
    <div class="space-y-4">
      <div class="text-sm text-gray-600 mb-4">
        <p>Total a pagar: <span class="font-semibold text-lg text-gray-900">${{ formatPrice(total) }}</span></p>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <button
          v-for="method in paymentMethods"
          :key="method"
          @click="selectedMethod = method"
          :class="[
            'p-4 border-2 rounded-lg transition-all text-left',
            selectedMethod === method
              ? 'border-[#FF69B4] bg-[#FF69B4]/10'
              : 'border-gray-200 hover:border-gray-300'
          ]"
        >
          <div class="flex items-center gap-3">
            <div
              :class="[
                'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                selectedMethod === method
                  ? 'border-[#FF69B4] bg-[#FF69B4]'
                  : 'border-gray-300'
              ]"
            >
              <svg v-if="selectedMethod === method" class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
            <span class="font-medium">{{ method }}</span>
          </div>
        </button>
      </div>

      <div v-if="selectedMethod === 'Crédito'" class="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p class="text-sm text-yellow-800">
          <strong>Nota:</strong> Los pagos con tarjeta de crédito pueden tener un recargo adicional.
        </p>
      </div>
    </div>

    <template #footer>
      <button
        @click="$emit('update:isOpen', false)"
        class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        Cancelar
      </button>
      <button
        @click="handleConfirm"
        :disabled="!selectedMethod"
        class="px-4 py-2 bg-[#FF69B4] text-white rounded-lg hover:bg-[#FF1493] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Confirmar Pago
      </button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Modal from './Modal.vue';

const props = defineProps<{
  isOpen: boolean;
  total: number;
}>();

const emit = defineEmits<{
  'update:isOpen': [value: boolean];
  confirm: [method: 'Efectivo' | 'Débito' | 'Crédito' | 'Transferencia'];
}>();

const paymentMethods: Array<'Efectivo' | 'Débito' | 'Crédito' | 'Transferencia'> = [
  'Efectivo',
  'Débito',
  'Crédito',
  'Transferencia',
];

const selectedMethod = ref<'Efectivo' | 'Débito' | 'Crédito' | 'Transferencia' | null>(null);

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-CL').format(Math.round(price));
};

const handleConfirm = () => {
  if (selectedMethod.value) {
    emit('confirm', selectedMethod.value);
    emit('update:isOpen', false);
  }
};
</script>

