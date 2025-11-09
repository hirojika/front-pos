<template>
  <aside class="w-20 bg-pink-200 border-r border-gray-200 flex flex-col items-center py-6 fixed left-0 top-0 h-screen z-50">
    <!-- Logo -->
    <div class="mb-8 w-10 h-10">
      <img src="../assets/logo.webp" alt="Logo" class="w-10 h-10 object-contain">
    </div>

    <!-- Iconos de navegación -->
    <nav class="flex-1 flex flex-col gap-4">
      <template v-for="item in navigationItems" :key="item.name">
        <router-link
          v-if="item.type === 'route'"
          :to="item.path"
          class="p-3 rounded-lg transition-colors relative group"
          :class="isActive(item.path) ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'"
        >
          <Icon :icon="item.icon" class="w-6 h-6" />
          <span class="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-9999 pointer-events-none">
            {{ item.label }}
          </span>
        </router-link>
        <button
          v-else-if="item.type === 'action'"
          @click="item.name === 'notifications' ? showNotificationsModal = true : null"
          class="p-3 rounded-lg transition-colors relative group"
          :class="item.name === 'notifications' && hasUnread ? 'text-primary' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'"
        >
          <Icon :icon="item.icon" class="w-6 h-6" />
          <span v-if="item.name === 'notifications' && hasUnread" class="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full z-10"></span>
          <span class="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-9999 pointer-events-none">
            {{ item.label }}
            <span v-if="item.name === 'notifications' && unreadCount > 0" class="ml-1">({{ unreadCount }})</span>
          </span>
        </button>
      </template>
    </nav>

    <!-- Botón de logout -->
    <div class="mt-auto">
      <button
        @click="handleLogout"
        class="p-3 rounded-lg transition-colors relative group text-red-600 hover:text-red-800 hover:bg-red-50"
        title="Cerrar Sesión"
      >
        <Icon icon="mdi:logout" class="w-6 h-6" />
        <span class="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-9999 pointer-events-none">
          Cerrar Sesión
        </span>
      </button>
    </div>
  </aside>

  <!-- Modal de Notificaciones -->
  <NotificationsModal
    :is-open="showNotificationsModal"
    @update:is-open="showNotificationsModal = $event"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';
import { useAuthStore } from '../store/auth';
import { useNotificationsStore } from '../store/notifications';
import NotificationsModal from './NotificationsModal.vue';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const notificationsStore = useNotificationsStore();

const showNotificationsModal = ref(false);

const unreadCount = computed(() => notificationsStore.unreadCount);
const hasUnread = computed(() => notificationsStore.hasUnread);

const navigationItems = [
  { name: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: 'mdi:view-dashboard', type: 'route' },
  { name: 'boletas', label: 'Boletas', path: '/boletas', icon: 'mdi:file-document-multiple', type: 'route' },
  { name: 'ingredientes', label: 'Ingredientes', path: '/ingredientes', icon: 'mdi:food-apple', type: 'route' },
  { name: 'menu', label: 'POS / Menú', path: '/pos', icon: 'mdi:food-variant', type: 'route' },
  { name: 'settings', label: 'Configuración', path: '/configuracion', icon: 'mdi:cog', type: 'route' },
];

const isActive = (path: string) => {
  return route.path === path || route.path.startsWith(path + '/');
};

const handleLogout = () => {
  if (confirm('¿Está seguro de cerrar sesión?')) {
    authStore.logout();
    router.push('/');
  }
};
</script>
