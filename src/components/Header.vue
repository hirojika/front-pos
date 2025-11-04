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
      <button class="p-2 text-gray-400 hover:text-gray-600 relative">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <span v-if="hasNotifications" class="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full"></span>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  actionLabel?: string;
  showSearch?: boolean;
  hasNotifications?: boolean;
}>();

defineEmits<{
  action: [];
}>();
</script>

