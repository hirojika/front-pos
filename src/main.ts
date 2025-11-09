import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'
import { useAuthStore } from './store/auth'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Verificar autenticación al iniciar ANTES de montar
// Esto asegura que el estado esté listo cuando el router ejecute los guards
const authStore = useAuthStore()
authStore.checkAuth()

// Si el usuario está autenticado y está en la raíz, redirigir al dashboard después de montar
app.mount('#app')

// Redirigir después de montar para asegurar que el router esté listo
if (authStore.isAuthenticated && window.location.pathname === '/') {
  router.replace('/dashboard')
}
