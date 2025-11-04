<template>
  <div class="min-h-screen bg-gray-50">
    <Sidebar />
    <div class="ml-20">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from '../components/Sidebar.vue';
</script>

