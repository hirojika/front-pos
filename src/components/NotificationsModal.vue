<template>
  <Modal
    :is-open="isOpen"
    title="Notificaciones"
    @update:isOpen="$emit('update:isOpen', $event)"
  >
    <div class="space-y-4">
      <!-- Header con acciones -->
      <div v-if="notifications.length > 0" class="flex items-center justify-between pb-4 border-b">
        <span class="text-sm text-gray-600">
          {{ unreadCount }} {{ unreadCount === 1 ? 'notificación no leída' : 'notificaciones no leídas' }}
        </span>
        <div class="flex gap-2">
          <button
            v-if="unreadCount > 0"
            @click="handleMarkAllAsRead"
            class="text-sm text-primary hover:text-primary-dark"
          >
            Marcar todas como leídas
          </button>
          <button
            @click="handleClearAll"
            class="text-sm text-red-600 hover:text-red-800"
          >
            Limpiar todo
          </button>
        </div>
      </div>

      <!-- Lista de notificaciones -->
      <div v-if="notifications.length > 0" class="space-y-2 max-h-96 overflow-y-auto">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="p-4 rounded-lg border transition-colors"
          :class="
            notification.read
              ? 'bg-gray-50 border-gray-200'
              : 'bg-white border-primary/20 shadow-sm'
          "
        >
          <div class="flex items-start gap-3">
            <!-- Icono según el tipo -->
            <div
              class="shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
              :class="{
                'bg-blue-100 text-blue-600': notification.type === 'info',
                'bg-yellow-100 text-yellow-600': notification.type === 'warning',
                'bg-red-100 text-red-600': notification.type === 'error',
                'bg-green-100 text-green-600': notification.type === 'success',
              }"
            >
              <Icon
                :icon="getNotificationIcon(notification.type)"
                class="w-5 h-5"
              />
            </div>

            <!-- Contenido -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-2">
                <div class="flex-1">
                  <h4 class="font-medium text-sm text-gray-900 mb-1">
                    {{ notification.title }}
                  </h4>
                  <p class="text-sm text-gray-600 mb-2">
                    {{ notification.message }}
                  </p>
                  <p class="text-xs text-gray-400">
                    {{ formatTimestamp(notification.timestamp) }}
                  </p>
                </div>
                <div class="flex items-center gap-2">
                  <button
                    v-if="!notification.read"
                    @click="handleMarkAsRead(notification.id)"
                    class="p-1 text-gray-400 hover:text-primary"
                    title="Marcar como leída"
                  >
                    <Icon icon="mdi:check-circle-outline" class="w-5 h-5" />
                  </button>
                  <button
                    @click="handleRemove(notification.id)"
                    class="p-1 text-gray-400 hover:text-red-600"
                    title="Eliminar"
                  >
                    <Icon icon="mdi:close" class="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Estado vacío -->
      <div v-else class="text-center py-12">
        <Icon icon="mdi:bell-off-outline" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p class="text-gray-500">No hay notificaciones</p>
      </div>
    </div>

    <template #footer>
      <button
        @click="$emit('update:isOpen', false)"
        class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
      >
        Cerrar
      </button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Modal from './Modal.vue';
import { Icon } from '@iconify/vue';
import { useNotificationsStore } from '../store/notifications';
import type { Notification } from '../store/notifications';

defineProps<{
  isOpen: boolean;
}>();

defineEmits<{
  'update:isOpen': [value: boolean];
}>();

const notificationsStore = useNotificationsStore();

const notifications = computed(() => notificationsStore.getRecentNotifications);
const unreadCount = computed(() => notificationsStore.unreadCount);

const getNotificationIcon = (type: Notification['type']): string => {
  switch (type) {
    case 'info':
      return 'mdi:information';
    case 'warning':
      return 'mdi:alert';
    case 'error':
      return 'mdi:alert-circle';
    case 'success':
      return 'mdi:check-circle';
    default:
      return 'mdi:bell';
  }
};

const formatTimestamp = (timestamp: Date): string => {
  const now = new Date();
  const diff = now.getTime() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) {
    return 'Hace un momento';
  } else if (minutes < 60) {
    return `Hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
  } else if (hours < 24) {
    return `Hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
  } else if (days < 7) {
    return `Hace ${days} ${days === 1 ? 'día' : 'días'}`;
  } else {
    return new Date(timestamp).toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }
};

const handleMarkAsRead = (id: string) => {
  notificationsStore.markAsRead(id);
};

const handleMarkAllAsRead = () => {
  notificationsStore.markAllAsRead();
};

const handleRemove = (id: string) => {
  notificationsStore.removeNotification(id);
};

const handleClearAll = () => {
  if (confirm('¿Está seguro de eliminar todas las notificaciones?')) {
    notificationsStore.clearAll();
  }
};
</script>

