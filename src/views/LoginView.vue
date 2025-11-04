<template>
  <div class="min-h-screen bg-white flex">
    <!-- Sección izquierda - Logo y branding -->
    <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-100 to-yellow-100 items-center justify-center p-8">
      <div class="text-center">
        <div class="relative mb-8">
          <!-- Logo circular con helados -->
          <div class="w-64 h-64 mx-auto bg-gradient-to-br from-orange-200 to-yellow-200 rounded-full flex items-center justify-center shadow-lg">
            <div class="text-center relative">
              <!-- Cono de helado -->
              <div class="mb-4">
                <div class="w-24 h-24 mx-auto relative">
                  <!-- Bolita rosa -->
                  <div class="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-pink-300 rounded-full"></div>
                  <!-- Bolita verde -->
                  <div class="absolute top-4 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-green-300 rounded-full"></div>
                  <!-- Bolita azul -->
                  <div class="absolute top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-blue-300 rounded-full"></div>
                  <!-- Cono -->
                  <div class="absolute top-16 left-1/2 transform -translate-x-1/2 w-12 h-16 bg-amber-200 rounded-b-full"></div>
                </div>
              </div>
              <!-- Banner con texto -->
              <div class="bg-white px-6 py-3 rounded-lg shadow-md">
                <h1 class="text-4xl font-handwritten text-black mb-1">Donde la Lore</h1>
                <p class="text-sm text-gray-700 font-sans">Helados Artesanales</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sección derecha - Formulario de login -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-8">
      <div class="w-full max-w-md">
        <h2 class="text-3xl font-bold text-gray-900 mb-8">Bienvenido a Donde la Lore</h2>
        
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Campo Usuario -->
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
              Nombre de Usuario
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                id="username"
                v-model="username"
                type="text"
                required
                class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Ingresa tu usuario"
              />
            </div>
          </div>

          <!-- Campo Contraseña -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                id="password"
                v-model="password"
                type="password"
                required
                class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Ingresa tu contraseña"
              />
            </div>
          </div>

          <!-- Link Olvidaste contraseña -->
          <div class="text-right">
            <a href="#" class="text-sm text-primary hover:underline">
              ¿Olvidaste tu Contraseña?
            </a>
          </div>

          <!-- Botón Login -->
          <button
            type="submit"
            class="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium text-lg hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Login
          </button>

          <!-- Mensaje de error -->
          <div v-if="error" class="text-red-600 text-sm text-center">
            {{ error }}
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth';

const router = useRouter();
const authStore = useAuthStore();

const username = ref('');
const password = ref('');
const error = ref('');

const handleLogin = () => {
  error.value = '';
  
  if (authStore.login(username.value, password.value)) {
    router.push('/dashboard');
  } else {
    error.value = 'Usuario o contraseña incorrectos';
  }
};
</script>

