import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<{ username: string; name: string } | null>(null);
  const _isAuthenticated = ref(false);

  // Getter que siempre verifica el estado actual
  // Nota: Este computed es reactivo y se actualiza cuando _isAuthenticated cambia
  const isAuthenticated = computed(() => _isAuthenticated.value);

  const login = (username: string, password: string) => {
    // TODO: Implementar llamada a API real
    // Por ahora, autenticación mock
    if (username && password) {
      user.value = {
        username,
        name: username
      };
      _isAuthenticated.value = true;
      localStorage.setItem('auth', JSON.stringify({ username, isAuthenticated: true }));
      return true;
    }
    return false;
  };

  const logout = () => {
    user.value = null;
    _isAuthenticated.value = false;
    localStorage.removeItem('auth');
    // Limpiar otras sesiones si es necesario
    // Por ejemplo, limpiar pedidos activos, etc.
  };

  const checkAuth = () => {
    try {
      const authData = localStorage.getItem('auth');
      if (authData) {
        const parsed = JSON.parse(authData);
        if (parsed.isAuthenticated && parsed.username) {
          user.value = { username: parsed.username, name: parsed.username };
          _isAuthenticated.value = true;
          return true;
        }
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      localStorage.removeItem('auth');
    }
    _isAuthenticated.value = false;
    return false;
  };

  return {
    user,
    isAuthenticated,
    login,
    logout,
    checkAuth
  };
});

