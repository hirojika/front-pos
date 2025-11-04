<template>
  <aside class="w-20 bg-pink-200 border-r border-gray-200 flex flex-col items-center py-6 fixed left-0 top-0 h-full">
    <!-- Logo -->
    <div class="mb-8">
      <div class="w-16 h-16 rounded-full bg-gradient-to-br from-pink-200 via-purple-200 to-yellow-200 flex items-center justify-center shadow-md">
        <span class="text-xs font-handwritten text-gray-800 text-center px-2">Donde la Lore</span>
      </div>
    </div>

    <!-- Iconos de navegación -->
    <nav class="flex-1 flex flex-col gap-4">
      <template v-for="item in navigationItems" :key="item.name">
        <router-link
          v-if="item.route"
          :to="item.path"
          class="p-3 rounded-lg transition-colors relative group"
          :class="isActive(item.path) ? 'bg-[#FF69B4]/10 text-[#FF69B4]' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'"
        >
          <Icon :icon="item.icon" class="w-6 h-6" />
          <span class="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
            {{ item.label }}
          </span>
        </router-link>
        <button
          v-else
          disabled
          class="p-3 rounded-lg transition-colors relative group opacity-50 cursor-not-allowed"
          :class="isActive(item.path) ? 'bg-[#FF69B4]/10 text-[#FF69B4]' : 'text-gray-400'"
          :title="item.label + ' (Próximamente)'"
        >
          <Icon :icon="item.icon" class="w-6 h-6" />
          <span class="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
            {{ item.label }} (Próximamente)
          </span>
        </button>
      </template>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { Icon } from '@iconify/vue';

const route = useRoute();

const navigationItems = [
  { name: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: 'mdi:view-dashboard', route: true },
  { name: 'boletas', label: 'Boletas', path: '/boletas', icon: 'mdi:file-document-multiple', route: true },
  { name: 'ingredientes', label: 'Ingredientes', path: '/ingredientes', icon: 'mdi:food-apple', route: true },
  { name: 'menu', label: 'POS / Menú', path: '/pos', icon: 'mdi:food-variant', route: true },
  { name: 'notifications', label: 'Notificaciones', path: '#', icon: 'mdi:bell', route: false },
  { name: 'profile', label: 'Perfil', path: '#', icon: 'mdi:account-circle', route: false },
  { name: 'settings', label: 'Configuración', path: '#', icon: 'mdi:cog', route: false },
];

const isActive = (path: string) => {
  return route.path === path || route.path.startsWith(path + '/');
};
</script>

