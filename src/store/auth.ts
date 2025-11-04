import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<{ username: string; name: string } | null>(null);
  const isAuthenticated = ref(false);

  const login = (username: string, password: string) => {
    // TODO: Implementar llamada a API real
    // Por ahora, autenticación mock
    if (username && password) {
      user.value = {
        username,
        name: username
      };
      isAuthenticated.value = true;
      localStorage.setItem('auth', JSON.stringify({ username, isAuthenticated: true }));
      return true;
    }
    return false;
  };

  const logout = () => {
    user.value = null;
    isAuthenticated.value = false;
    localStorage.removeItem('auth');
  };

  const checkAuth = () => {
    const authData = localStorage.getItem('auth');
    if (authData) {
      const parsed = JSON.parse(authData);
      if (parsed.isAuthenticated) {
        user.value = { username: parsed.username, name: parsed.username };
        isAuthenticated.value = true;
      }
    }
  };

  return {
    user,
    isAuthenticated: computed(() => isAuthenticated.value),
    login,
    logout,
    checkAuth
  };
});

