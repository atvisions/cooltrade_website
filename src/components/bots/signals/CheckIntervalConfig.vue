<template>
  <div class="space-y-3">
    <div class="flex items-baseline gap-2">
      <label class="block text-sm font-medium text-slate-700">
        检查间隔
      </label>
      <div class="relative">
        <button
          @mouseenter="showTooltip = true"
          @mouseleave="showTooltip = false"
          class="p-1 text-slate-400 hover:text-slate-600 transition-colors"
          type="button"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
        <div
          v-if="showTooltip"
          class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg z-50 pointer-events-none whitespace-nowrap"
        >
          系统多久检查一次价格条件
          <div class="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></div>
        </div>
      </div>
    </div>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="interval in checkIntervals"
        :key="interval.value"
        type="button"
        @click="$emit('update:modelValue', interval.value)"
        :class="[
          'px-4 py-2 rounded-lg text-sm font-medium transition-all',
          modelValue === interval.value
            ? 'bg-blue-600 text-white shadow-sm'
            : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
        ]"
      >
        {{ interval.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  modelValue: String
})

defineEmits(['update:modelValue'])

const showTooltip = ref(false)

const checkIntervals = [
  { label: '1分钟', value: '1m' },
  { label: '5分钟', value: '5m' },
  { label: '15分钟', value: '15m' },
  { label: '30分钟', value: '30m' },
  { label: '1小时', value: '1h' }
]
</script>

