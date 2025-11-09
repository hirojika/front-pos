<template>
  <Modal
    :is-open="isOpen"
    title="Recuperar Contraseña"
    @update:isOpen="$emit('update:isOpen', $event)"
  >
    <div class="space-y-4">
      <p class="text-sm text-gray-600">
        Ingrese su nombre de usuario o correo electrónico para recibir un enlace de recuperación de contraseña.
      </p>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Usuario o Correo Electrónico *</label>
        <input
          v-model="emailOrUsername"
          type="text"
          class="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="usuario@ejemplo.com"
          @keyup.enter="handleReset"
        />
      </div>

      <div v-if="error" class="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
        {{ error }}
      </div>

      <div v-if="success" class="p-3 bg-green-50 text-green-700 rounded-lg text-sm">
        {{ success }}
      </div>
    </div>

    <template #footer>
      <button
        type="button"
        class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        @click="$emit('update:isOpen', false)"
      >
        Cancelar
      </button>
      <button
        type="button"
        class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="!emailOrUsername.trim() || isLoading"
        @click="handleReset"
      >
        {{ isLoading ? 'Enviando...' : 'Enviar' }}
      </button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import Modal from './Modal.vue';

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  'update:isOpen': [value: boolean];
}>();

const emailOrUsername = ref('');
const error = ref('');
const success = ref('');
const isLoading = ref(false);

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    emailOrUsername.value = '';
    error.value = '';
    success.value = '';
    isLoading.value = false;
  }
});

const handleReset = async () => {
  error.value = '';
  success.value = '';

  if (!emailOrUsername.value.trim()) {
    error.value = 'Por favor ingrese su usuario o correo electrónico';
    return;
  }

  isLoading.value = true;

  try {
    // TODO: Implementar llamada a API real
    // Simular envío
    await new Promise(resolve => setTimeout(resolve, 1000));

    success.value = `Se ha enviado un enlace de recuperación a ${emailOrUsername.value}. Por favor revise su correo electrónico.`;
    
    // Cerrar modal después de 3 segundos
    setTimeout(() => {
      emit('update:isOpen', false);
    }, 3000);
  } catch (err) {
    error.value = 'Error al enviar el correo de recuperación. Por favor intente nuevamente.';
  } finally {
    isLoading.value = false;
  }
};
</script>

