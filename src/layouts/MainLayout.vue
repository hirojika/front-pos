<template>
  <div class="h-screen bg-gray-50 relative flex">
    <Sidebar />
    <div class="ml-20 flex-1 relative z-0 overflow-y-auto">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from '../components/Sidebar.vue';
</script>
