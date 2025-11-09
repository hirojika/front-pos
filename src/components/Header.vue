<template>
  <header class="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
    <div class="flex items-center gap-4">
      <h1 class="text-2xl font-bold text-gray-900">{{ title }}</h1>
    </div>
    
    <div class="flex items-center gap-4">
      <!-- Barra de búsqueda (solo en POS) -->
      <div v-if="showSearch" class="relative">
        <input
          type="text"
          placeholder="Buscar Receta"
          class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <!-- Botón de acción principal -->
      <button v-if="actionLabel" @click="$emit('action')" class="btn-primary">
        {{ actionLabel }}
      </button>

      <!-- Icono de notificaciones -->
      <button
        @click="showNotificationsModal = true"
        class="p-2 text-gray-400 hover:text-gray-600 relative transition-colors"
      >
        <Icon icon="mdi:bell" class="w-6 h-6" />
        <span v-if="hasUnread" class="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
        <span v-if="unreadCount > 0" class="absolute -top-1 -right-1 min-w-[18px] h-5 px-1 bg-primary text-white text-xs rounded-full flex items-center justify-center">
          {{ unreadCount > 9 ? '9+' : unreadCount }}
        </span>
      </button>

      <!-- Menú de usuario -->
      <div class="relative" ref="userMenuRef">
        <button
          @click.stop="showUserMenu = !showUserMenu"
          class="p-2 text-gray-400 hover:text-gray-600 relative transition-colors"
        >
          <Icon icon="mdi:account-circle" class="w-6 h-6" />
        </button>

        <!-- Dropdown menu -->
        <div
          v-if="showUserMenu"
          @click.stop
          class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
        >
          <div class="px-4 py-2 border-b border-gray-200">
            <p class="text-sm font-medium text-gray-900">{{ user?.name || 'Usuario' }}</p>
            <p class="text-xs text-gray-500">{{ user?.username || '' }}</p>
          </div>
          <button
            @click="handleViewProfile"
            class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Icon icon="mdi:account" class="w-4 h-4" />
            Ver Perfil
          </button>
          <button
            @click="handleLogout"
            class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
          >
            <Icon icon="mdi:logout" class="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  </header>

  <!-- Modal de Notificaciones -->
  <NotificationsModal
    :is-open="showNotificationsModal"
    @update:is-open="showNotificationsModal = $event"
  />

  <!-- Modal de Perfil de Usuario -->
  <UserProfileModal
    :is-open="showUserProfileModal"
    @update:isOpen="showUserProfileModal = $event"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import { useAuthStore } from '../store/auth';
import { useNotificationsStore } from '../store/notifications';
import NotificationsModal from './NotificationsModal.vue';
import UserProfileModal from './UserProfileModal.vue';

defineProps<{
  title: string;
  actionLabel?: string;
  showSearch?: boolean;
}>();

defineEmits<{
  action: [];
}>();

const router = useRouter();
const authStore = useAuthStore();
const notificationsStore = useNotificationsStore();

const showNotificationsModal = ref(false);
const showUserProfileModal = ref(false);
const showUserMenu = ref(false);
const userMenuRef = ref<HTMLElement | null>(null);

const user = computed(() => authStore.user);
const unreadCount = computed(() => notificationsStore.unreadCount);
const hasUnread = computed(() => notificationsStore.hasUnread);

const handleViewProfile = () => {
  showUserProfileModal.value = true;
  showUserMenu.value = false;
};

const handleLogout = () => {
  if (confirm('¿Está seguro de cerrar sesión?')) {
    authStore.logout();
    router.push('/');
    showUserMenu.value = false;
  }
};

// Cerrar el menú al hacer clic fuera
const handleClickOutside = (event: MouseEvent) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target as Node)) {
    showUserMenu.value = false;
  }
};

// Agregar listener cuando el menú está abierto
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
