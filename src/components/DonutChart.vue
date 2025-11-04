<template>
  <div class="relative">
    <svg :width="size" :height="size" class="transform -rotate-90">
      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        fill="none"
        stroke="#e5e7eb"
        :stroke-width="strokeWidth"
      />
      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        fill="none"
        :stroke="colors[0]"
        :stroke-width="strokeWidth"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="getOffset(0)"
        stroke-linecap="round"
      />
      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        fill="none"
        :stroke="colors[1]"
        :stroke-width="strokeWidth"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="getOffset(1)"
        stroke-linecap="round"
      />
      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        fill="none"
        :stroke="colors[2]"
        :stroke-width="strokeWidth"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="getOffset(2)"
        stroke-linecap="round"
      />
    </svg>
    <div class="absolute inset-0 flex items-center justify-center">
      <div class="text-center">
        <div class="text-3xl font-bold text-gray-900">{{ total }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  data: number[];
  labels: string[];
  colors?: string[];
  size?: number;
  total?: string;
}>();

const size = props.size || 200;
const center = size / 2;
const radius = (size - 20) / 2;
const strokeWidth = 20;
const circumference = 2 * Math.PI * radius;

const defaultColors = ['#60A5FA', '#34D399', '#FB923C'];
const colors = computed(() => props.colors || defaultColors);

const totalSum = computed(() => props.data.reduce((a, b) => a + b, 0));
const percentages = computed(() => props.data.map(val => (val / totalSum.value) * 100));

const getOffset = (index: number) => {
  let offset = circumference;
  for (let i = 0; i < index; i++) {
    offset -= (circumference * percentages.value[i]) / 100;
  }
  return offset;
};
</script>

