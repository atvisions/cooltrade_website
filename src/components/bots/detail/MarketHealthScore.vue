<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <!-- Header -->
    <div class="px-5 py-4 border-b border-gray-100">
      <div class="flex items-center justify-between">
        <h3 class="text-base font-semibold text-gray-900 flex items-center gap-2">
          <svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
          </svg>
          市场健康度
        </h3>
        <span class="text-2xl font-bold" :class="scoreColor">{{ score }}</span>
      </div>
    </div>

    <!-- Score Bar -->
    <div class="px-5 py-4">
      <!-- 进度条 -->
      <div class="h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
        <div class="h-full rounded-full transition-all duration-500" :class="barColor" :style="{ width: `${score}%` }"></div>
      </div>

      <!-- 状态标签 -->
      <div class="flex items-center justify-between mb-4">
        <span class="text-sm font-medium" :class="scoreColor">{{ statusLabel }}</span>
        <span class="text-xs text-gray-400">{{ suggestion }}</span>
      </div>

      <!-- 三类指标摘要 -->
      <div class="space-y-2">
        <!-- 趋势 -->
        <div class="flex items-center justify-between py-2 border-t border-gray-100">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full" :class="trendDotColor"></span>
            <span class="text-sm text-gray-600">趋势</span>
          </div>
          <span class="text-sm font-medium" :class="trendColor">{{ trendLabel }} ({{ trendCount }})</span>
        </div>
        <!-- 波动 -->
        <div class="flex items-center justify-between py-2 border-t border-gray-100">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full" :class="volatilityDotColor"></span>
            <span class="text-sm text-gray-600">波动</span>
          </div>
          <span class="text-sm font-medium" :class="volatilityColor">{{ volatilityLabel }}</span>
        </div>
        <!-- 情绪 -->
        <div class="flex items-center justify-between py-2 border-t border-gray-100">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full" :class="sentimentDotColor"></span>
            <span class="text-sm text-gray-600">情绪</span>
          </div>
          <span class="text-sm font-medium" :class="sentimentColor">{{ sentimentLabel }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  score: { type: Number, default: 50 },
  trend: { type: Object, default: () => ({ status: 'neutral', satisfied: 0, total: 0 }) },
  volatility: { type: Object, default: () => ({ status: 'normal', label: '正常' }) },
  sentiment: { type: Object, default: () => ({ status: 'neutral', label: '中性' }) }
})

// 分数颜色
const scoreColor = computed(() => {
  if (props.score >= 70) return 'text-emerald-600'
  if (props.score >= 40) return 'text-amber-600'
  return 'text-red-600'
})

const barColor = computed(() => {
  if (props.score >= 70) return 'bg-gradient-to-r from-emerald-400 to-emerald-600'
  if (props.score >= 40) return 'bg-gradient-to-r from-amber-400 to-amber-600'
  return 'bg-gradient-to-r from-red-400 to-red-600'
})

// 状态标签
const statusLabel = computed(() => {
  if (props.score >= 80) return '强多'
  if (props.score >= 60) return '偏多'
  if (props.score >= 40) return '中性'
  if (props.score >= 20) return '偏空'
  return '强空'
})

const suggestion = computed(() => {
  if (props.score >= 70) return '适合做多策略'
  if (props.score >= 40) return '观望或轻仓'
  return '谨慎做空或观望'
})

// 趋势
const trendLabel = computed(() => {
  const s = props.trend.status
  if (s === 'bullish') return '偏多'
  if (s === 'bearish') return '偏空'
  return '中性'
})
const trendCount = computed(() => `${props.trend.satisfied}/${props.trend.total}`)
const trendColor = computed(() => {
  if (props.trend.status === 'bullish') return 'text-emerald-600'
  if (props.trend.status === 'bearish') return 'text-red-600'
  return 'text-gray-600'
})
const trendDotColor = computed(() => {
  if (props.trend.status === 'bullish') return 'bg-emerald-500'
  if (props.trend.status === 'bearish') return 'bg-red-500'
  return 'bg-gray-400'
})

// 波动
const volatilityLabel = computed(() => props.volatility.label || '正常')
const volatilityColor = computed(() => {
  if (props.volatility.status === 'high') return 'text-red-600'
  if (props.volatility.status === 'low') return 'text-blue-600'
  return 'text-gray-600'
})
const volatilityDotColor = computed(() => {
  if (props.volatility.status === 'high') return 'bg-red-500'
  if (props.volatility.status === 'low') return 'bg-blue-500'
  return 'bg-gray-400'
})

// 情绪
const sentimentLabel = computed(() => props.sentiment.label || '中性')
const sentimentColor = computed(() => {
  if (props.sentiment.status === 'bullish') return 'text-emerald-600'
  if (props.sentiment.status === 'bearish') return 'text-red-600'
  return 'text-gray-600'
})
const sentimentDotColor = computed(() => {
  if (props.sentiment.status === 'bullish') return 'bg-emerald-500'
  if (props.sentiment.status === 'bearish') return 'bg-red-500'
  return 'bg-gray-400'
})
</script>

