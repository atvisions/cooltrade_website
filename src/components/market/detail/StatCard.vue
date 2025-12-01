<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all">
    <div class="flex items-center gap-2 mb-2">
      <!-- Icon -->
      <div :class="iconBgClass" class="w-8 h-8 rounded-lg flex items-center justify-center">
        <svg v-if="icon === 'volume'" class="w-4 h-4" :class="iconColorClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
        </svg>
        <svg v-else-if="icon === 'high'" class="w-4 h-4" :class="iconColorClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
        </svg>
        <svg v-else-if="icon === 'low'" class="w-4 h-4" :class="iconColorClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
        </svg>
        <svg v-else-if="icon === 'market'" class="w-4 h-4" :class="iconColorClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <svg v-else-if="icon === 'supply'" class="w-4 h-4" :class="iconColorClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
        </svg>
        <svg v-else-if="icon === 'funding'" class="w-4 h-4" :class="iconColorClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
        </svg>
        <svg v-else-if="icon === 'openInterest'" class="w-4 h-4" :class="iconColorClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
        </svg>
        <svg v-else-if="icon === 'ratio'" class="w-4 h-4" :class="iconColorClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"/>
        </svg>
        <svg v-else-if="icon === 'leverage'" class="w-4 h-4" :class="iconColorClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
        </svg>
        <svg v-else class="w-4 h-4" :class="iconColorClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
      <span class="text-xs font-medium text-gray-500">{{ label }}</span>
    </div>
    <div class="flex items-baseline gap-1">
      <span v-if="prefix" class="text-sm text-gray-400">{{ prefix }}</span>
      <span class="text-xl font-bold" :class="valueColorClass">{{ value }}</span>
      <span v-if="suffix" class="text-sm text-gray-400">{{ suffix }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], default: '-' },
  prefix: { type: String, default: '' },
  suffix: { type: String, default: '' },
  icon: { type: String, default: 'info' },
  color: { type: String, default: 'gray' } // gray, green, red
})

const iconBgClass = computed(() => {
  const colors = {
    gray: 'bg-gray-100',
    green: 'bg-emerald-50',
    red: 'bg-red-50'
  }
  return colors[props.color] || colors.gray
})

const iconColorClass = computed(() => {
  const colors = {
    gray: 'text-gray-500',
    green: 'text-emerald-500',
    red: 'text-red-500'
  }
  return colors[props.color] || colors.gray
})

const valueColorClass = computed(() => {
  const colors = {
    gray: 'text-gray-900',
    green: 'text-emerald-600',
    red: 'text-red-600'
  }
  return colors[props.color] || colors.gray
})
</script>

