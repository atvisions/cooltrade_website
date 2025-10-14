<template>
  <div class="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
    <!-- Header -->
    <div class="flex items-start justify-between mb-3">
      <div class="flex-1">
        <h4 class="text-sm font-semibold text-gray-900 mb-1">{{ title }}</h4>
        <p class="text-xs text-gray-500">{{ description }}</p>
      </div>
      <span v-if="platform" class="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
        {{ platform }}
      </span>
    </div>

    <!-- Value -->
    <div class="mb-2">
      <div class="flex items-baseline space-x-2">
        <span 
          class="text-2xl font-bold"
          :class="getValueColorClass()"
        >
          {{ value }}
        </span>
        <span v-if="unit" class="text-sm text-gray-500">{{ unit }}</span>
      </div>
    </div>

    <!-- Signal Badge -->
    <div v-if="signal" class="mt-2">
      <span 
        class="inline-block px-2 py-1 rounded text-xs font-medium"
        :class="getSignalBadgeClass(signal.color)"
      >
        {{ signal.label }}
      </span>
    </div>

    <!-- Trend Indicator -->
    <div v-if="trend" class="mt-2 flex items-center space-x-1">
      <svg v-if="trend === 'up'" class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
      </svg>
      <svg v-else-if="trend === 'down'" class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"/>
      </svg>
      <svg v-else class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14"/>
      </svg>
      <span class="text-xs text-gray-500">
        {{ trend === 'up' ? '上升' : trend === 'down' ? '下降' : '稳定' }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  title: { type: String, required: true },
  value: { type: [String, Number], default: '-' },
  unit: { type: String, default: '' },
  description: { type: String, default: '' },
  platform: { type: String, default: '' },
  signal: { type: Object, default: null }, // { label: 'Bullish', color: 'green' }
  trend: { type: String, default: null }, // 'up', 'down', 'neutral'
  color: { type: String, default: 'gray' } // 'green', 'red', 'gray'
})

const getValueColorClass = () => {
  const colors = {
    'green': 'text-green-600',
    'red': 'text-red-600',
    'gray': 'text-gray-900'
  }
  return colors[props.color] || 'text-gray-900'
}

const getSignalBadgeClass = (color) => {
  const classes = {
    'green': 'bg-green-100 text-green-700',
    'red': 'bg-red-100 text-red-700',
    'yellow': 'bg-yellow-100 text-yellow-700',
    'gray': 'bg-gray-100 text-gray-700'
  }
  return classes[color] || 'bg-gray-100 text-gray-700'
}
</script>

