<template>
  <div>
    <label class="block text-sm font-medium text-slate-700 mb-2">
      信号类型 <span class="text-red-500">*</span>
    </label>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <button
        v-for="type in signalTypes"
        :key="type.value"
        type="button"
        @click="$emit('update:signalType', type.value)"
        :class="[
          'flex flex-col items-center p-4 border-2 rounded-lg transition-all',
          signalType === type.value
            ? 'border-blue-500 bg-blue-50'
            : 'border-slate-200 hover:border-slate-300 bg-white'
        ]"
      >
        <component :is="type.icon" class="w-6 h-6 mb-2 text-slate-600" />
        <span class="text-sm font-medium text-slate-900">{{ type.label }}</span>
      </button>
    </div>
    <p v-if="error" class="mt-1 text-sm text-red-500">{{ error }}</p>
  </div>
</template>

<script setup>
import { h } from 'vue'

// 图标组件（使用 h() 函数）
const PriceIcon = () => h('svg', {
  class: 'w-6 h-6',
  fill: 'none',
  stroke: 'currentColor',
  viewBox: '0 0 24 24'
}, [
  h('path', {
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-width': '2',
    d: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  })
])

const ChartLineIcon = () => h('svg', {
  class: 'w-6 h-6',
  fill: 'none',
  stroke: 'currentColor',
  viewBox: '0 0 24 24'
}, [
  h('path', {
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-width': '2',
    d: 'M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z'
  })
])

const TrendingUpIcon = () => h('svg', {
  class: 'w-6 h-6',
  fill: 'none',
  stroke: 'currentColor',
  viewBox: '0 0 24 24'
}, [
  h('path', {
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-width': '2',
    d: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
  })
])

const VolumeIcon = () => h('svg', {
  class: 'w-6 h-6',
  fill: 'none',
  stroke: 'currentColor',
  viewBox: '0 0 24 24'
}, [
  h('path', {
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-width': '2',
    d: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
  })
])

const props = defineProps({
  signalType: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  }
})

defineEmits(['update:signalType'])

const signalTypes = [
  { label: '价格提醒', value: 'price_alert', icon: PriceIcon },
  { label: '指标信号提醒', value: 'indicator_alert', icon: ChartLineIcon },
  { label: '波动性提醒', value: 'volatility', icon: TrendingUpIcon },
  { label: '成交量/持仓提醒', value: 'volume', icon: VolumeIcon }
]
</script>


