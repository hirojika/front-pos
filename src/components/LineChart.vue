<template>
  <div class="relative h-64">
    <svg :width="width" :height="height" class="overflow-visible">
      <!-- Grid lines -->
      <g v-for="(line, index) in gridLines" :key="index">
        <line
          :x1="0"
          :y1="line"
          :x2="width"
          :y2="line"
          stroke="#e5e7eb"
          stroke-width="1"
        />
        <text :x="-10" :y="line" text-anchor="end" class="text-xs fill-gray-500" alignment-baseline="middle">
          {{ formatYValue(maxValue - (index * step)) }}
        </text>
      </g>

      <!-- Line path -->
      <path
        :d="pathData"
        fill="none"
        stroke="#FF69B4"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />

      <!-- Area under line -->
      <path
        :d="areaPathData"
        fill="url(#gradient)"
        opacity="0.3"
      />

      <!-- Gradient definition -->
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#FF69B4;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#FF69B4;stop-opacity:0" />
        </linearGradient>
      </defs>

      <!-- Data points -->
      <circle
        v-for="(point, index) in points"
        :key="index"
        :cx="point.x"
        :cy="point.y"
        r="4"
        fill="#FF69B4"
        stroke="white"
        stroke-width="2"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  data: number[];
  labels?: string[];
  width?: number;
  height?: number;
}>();

const width = props.width || 600;
const height = props.height || 256;
const padding = 40;

const maxValue = computed(() => Math.max(...props.data, 1000000));
const minValue = computed(() => Math.min(...props.data, 0));
const range = computed(() => maxValue.value - minValue.value);

const step = computed(() => maxValue.value / 4);

const gridLines = computed(() => {
  const lines = [];
  for (let i = 0; i <= 4; i++) {
    lines.push(padding + (i * (height - padding * 2)) / 4);
  }
  return lines;
});

const points = computed(() => {
  const stepX = (width - padding * 2) / (props.data.length - 1);
  return props.data.map((value, index) => {
    const x = padding + index * stepX;
    const y = height - padding - ((value - minValue.value) / range.value) * (height - padding * 2);
    return { x, y, value };
  });
});

const pathData = computed(() => {
  if (points.value.length === 0) return '';
  const firstPoint = points.value[0];
  if (!firstPoint) return '';
  let path = `M ${firstPoint.x} ${firstPoint.y}`;
  for (let i = 1; i < points.value.length; i++) {
    const point = points.value[i];
    if (point) {
      path += ` L ${point.x} ${point.y}`;
    }
  }
  return path;
});

const areaPathData = computed(() => {
  if (points.value.length === 0) return '';
  const firstPoint = points.value[0];
  const lastPoint = points.value[points.value.length - 1];
  if (!firstPoint || !lastPoint) return '';
  let path = `M ${padding} ${height - padding}`;
  path += ` L ${firstPoint.x} ${firstPoint.y}`;
  for (let i = 1; i < points.value.length; i++) {
    const point = points.value[i];
    if (point) {
      path += ` L ${point.x} ${point.y}`;
    }
  }
  path += ` L ${lastPoint.x} ${height - padding}`;
  path += ' Z';
  return path;
});

const formatYValue = (value: number) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
  return value.toFixed(0);
};
</script>

