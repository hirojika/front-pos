import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'
import { useAuthStore } from './store/auth'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Verificar autenticación al iniciar
const authStore = useAuthStore()
authStore.checkAuth()

app.mount('#app')
