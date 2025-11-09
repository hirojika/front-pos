<template>
  <Modal
    :is-open="isOpen"
    title="Perfil de Usuario"
    @update:isOpen="$emit('update:isOpen', $event)"
  >
    <div class="space-y-6">
      <!-- Tabs -->
      <div class="border-b border-gray-200">
        <nav class="flex -mb-px">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            {{ tab.label }}
          </button>
        </nav>
      </div>

      <!-- Ver Perfil -->
      <div v-if="activeTab === 'view'" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre de Usuario</label>
            <p class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded">{{ user?.username || '—' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <p class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded">{{ user?.name || '—' }}</p>
          </div>
          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
            <p class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded">{{ userProfile.email || 'No registrado' }}</p>
          </div>
          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Rol</label>
            <p class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded">{{ userProfile.role || 'Usuario' }}</p>
          </div>
        </div>
      </div>

      <!-- Editar Perfil -->
      <div v-if="activeTab === 'edit'" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
            <input
              v-model="editForm.name"
              type="text"
              class="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Ingrese su nombre"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
            <input
              v-model="editForm.email"
              type="email"
              class="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="correo@ejemplo.com"
            />
          </div>
        </div>
        <div v-if="error" class="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          {{ error }}
        </div>
      </div>

      <!-- Cambiar Contraseña -->
      <div v-if="activeTab === 'password'" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña Actual *</label>
          <input
            v-model="passwordForm.currentPassword"
            type="password"
            class="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Ingrese su contraseña actual"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nueva Contraseña *</label>
          <input
            v-model="passwordForm.newPassword"
            type="password"
            class="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Ingrese la nueva contraseña"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Confirmar Nueva Contraseña *</label>
          <input
            v-model="passwordForm.confirmPassword"
            type="password"
            class="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Confirme la nueva contraseña"
          />
        </div>
        <div v-if="error" class="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          {{ error }}
        </div>
      </div>
    </div>

    <template #footer>
      <button
        type="button"
        class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        @click="$emit('update:isOpen', false)"
      >
        {{ activeTab === 'view' ? 'Cerrar' : 'Cancelar' }}
      </button>
      <button
        v-if="activeTab !== 'view'"
        type="button"
        class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        @click="handleSave"
      >
        Guardar
      </button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import Modal from './Modal.vue';
import { useAuthStore } from '../store/auth';

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  'update:isOpen': [value: boolean];
}>();

const authStore = useAuthStore();
const user = computed(() => authStore.user);

const activeTab = ref<'view' | 'edit' | 'password'>('view');
const tabs = [
  { id: 'view', label: 'Ver Perfil' },
  { id: 'edit', label: 'Editar Perfil' },
  { id: 'password', label: 'Cambiar Contraseña' },
];

const userProfile = ref({
  email: '',
  role: 'Usuario',
});

const editForm = ref({
  name: '',
  email: '',
});

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});

const error = ref('');

// Inicializar datos cuando se abre el modal
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    editForm.value.name = user.value?.name || '';
    editForm.value.email = userProfile.value.email;
    error.value = '';
    activeTab.value = 'view';
  }
});

const handleSave = () => {
  error.value = '';

  if (activeTab.value === 'edit') {
    // Validar edición de perfil
    if (!editForm.value.name.trim()) {
      error.value = 'El nombre es requerido';
      return;
    }

    // Actualizar perfil (por ahora solo el nombre en el store)
    if (user.value) {
      user.value.name = editForm.value.name;
      userProfile.value.email = editForm.value.email;
    }

    alert('Perfil actualizado exitosamente');
    activeTab.value = 'view';
  } else if (activeTab.value === 'password') {
    // Validar cambio de contraseña
    if (!passwordForm.value.currentPassword) {
      error.value = 'La contraseña actual es requerida';
      return;
    }

    if (!passwordForm.value.newPassword) {
      error.value = 'La nueva contraseña es requerida';
      return;
    }

    if (passwordForm.value.newPassword.length < 6) {
      error.value = 'La nueva contraseña debe tener al menos 6 caracteres';
      return;
    }

    if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
      error.value = 'Las contraseñas no coinciden';
      return;
    }

    // TODO: Implementar cambio de contraseña real con API
    alert('Contraseña cambiada exitosamente');
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };
    activeTab.value = 'view';
  }
};
</script>

