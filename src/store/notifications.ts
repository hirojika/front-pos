import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: Date;
  read: boolean;
}

export const useNotificationsStore = defineStore('notifications', () => {
  const notifications = ref<Notification[]>([]);

  // Notificaciones no leídas
  const unreadCount = computed(() => {
    return notifications.value.filter(n => !n.read).length;
  });

  // Tiene notificaciones no leídas
  const hasUnread = computed(() => {
    return unreadCount.value > 0;
  });

  // Agregar notificación
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...notification,
      timestamp: new Date(),
      read: false,
    };
    notifications.value.unshift(newNotification);
    
    // Mantener solo las últimas 50 notificaciones
    if (notifications.value.length > 50) {
      notifications.value = notifications.value.slice(0, 50);
    }
  };

  // Marcar como leída
  const markAsRead = (id: string) => {
    const notification = notifications.value.find(n => n.id === id);
    if (notification) {
      notification.read = true;
    }
  };

  // Marcar todas como leídas
  const markAllAsRead = () => {
    notifications.value.forEach(n => {
      n.read = true;
    });
  };

  // Eliminar notificación
  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex(n => n.id === id);
    if (index > -1) {
      notifications.value.splice(index, 1);
    }
  };

  // Eliminar todas las notificaciones
  const clearAll = () => {
    notifications.value = [];
  };

  // Obtener notificaciones no leídas
  const getUnreadNotifications = computed(() => {
    return notifications.value.filter(n => !n.read);
  });

  // Obtener notificaciones recientes (últimas 10)
  const getRecentNotifications = computed(() => {
    return notifications.value.slice(0, 10);
  });

  return {
    notifications,
    unreadCount,
    hasUnread,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    getUnreadNotifications,
    getRecentNotifications,
  };
});

