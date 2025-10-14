<template>
  <div class="bg-white rounded-2xl overflow-hidden border border-gray-200">
    <!-- Chart Header -->
    <div class="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <h3 class="text-gray-900 font-semibold">{{ symbol }}/USDT</h3>
        <div class="flex items-center space-x-2">
          <span class="text-2xl font-bold text-gray-900">${{ formatPrice(currentPrice) }}</span>
          <span v-if="priceChange" :class="priceChange >= 0 ? 'text-green-600' : 'text-red-600'" class="text-sm font-semibold">
            {{ priceChange >= 0 ? '+' : '' }}{{ priceChange }}%
          </span>
        </div>
      </div>
      
      <!-- Timeframe Selector -->
      <div class="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
        <button
          v-for="tf in timeframes"
          :key="tf"
          @click="selectedTimeframe = tf"
          :class="[
            selectedTimeframe === tf ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900',
            'px-3 py-1.5 rounded text-xs font-medium transition-colors'
          ]"
        >
          {{ tf }}
        </button>
      </div>
    </div>

    <!-- Chart Area -->
    <div class="relative bg-gray-50" style="height: 500px;">
      <!-- TradingView Chart Placeholder -->
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="text-center">
          <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
          </svg>
          <p class="text-gray-600 font-medium mb-2">K线图表</p>
          <p class="text-sm text-gray-500">专业图表与技术指标</p>
        </div>
      </div>

      <!-- Market Condition Badge -->
      <div v-if="marketCondition" class="absolute top-4 left-4">
        <div class="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg border border-gray-200 shadow-sm">
          <div class="flex items-center space-x-2">
            <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span class="text-xs font-medium text-gray-900">{{ marketCondition }}</span>
          </div>
        </div>
      </div>

      <!-- Technical Signals -->
      <div v-if="technicalSignals && Object.keys(technicalSignals).length > 0" class="absolute top-4 right-4">
        <div class="bg-white/90 backdrop-blur-sm rounded-lg border border-gray-200 shadow-sm p-3 space-y-2">
          <div class="text-xs font-semibold text-gray-600 mb-2">技术信号</div>
          <div v-if="technicalSignals.rsi" class="flex items-center justify-between space-x-4">
            <span class="text-xs text-gray-600">RSI</span>
            <span class="text-xs font-semibold" :class="getSignalColorClass(technicalSignals.rsi.color)">
              {{ technicalSignals.rsi.label }}
            </span>
          </div>
          <div v-if="technicalSignals.macd" class="flex items-center justify-between space-x-4">
            <span class="text-xs text-gray-600">MACD</span>
            <span class="text-xs font-semibold" :class="getSignalColorClass(technicalSignals.macd.color)">
              {{ technicalSignals.macd.label }}
            </span>
          </div>
          <div v-if="technicalSignals.ma_trend" class="flex items-center justify-between space-x-4">
            <span class="text-xs text-gray-600">MA</span>
            <span class="text-xs font-semibold" :class="getSignalColorClass(technicalSignals.ma_trend.color)">
              {{ technicalSignals.ma_trend.label }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Chart Footer - Quick Stats -->
    <div class="px-4 py-3 border-t border-gray-200 grid grid-cols-4 gap-4 bg-gray-50">
      <div>
        <div class="text-xs text-gray-500 mb-1">24h最高</div>
        <div class="text-sm font-semibold text-gray-900">$45,234</div>
      </div>
      <div>
        <div class="text-xs text-gray-500 mb-1">24h最低</div>
        <div class="text-sm font-semibold text-gray-900">$43,123</div>
      </div>
      <div>
        <div class="text-xs text-gray-500 mb-1">24h成交量</div>
        <div class="text-sm font-semibold text-gray-900">$2.3B</div>
      </div>
      <div>
        <div class="text-xs text-gray-500 mb-1">市值</div>
        <div class="text-sm font-semibold text-gray-900">$850B</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps } from 'vue'

const props = defineProps({
  symbol: {
    type: String,
    required: true
  },
  currentPrice: {
    type: [String, Number],
    default: 0
  },
  technicalSignals: {
    type: Object,
    default: () => ({})
  },
  marketCondition: {
    type: String,
    default: ''
  }
})

const timeframes = ['1m', '5m', '15m', '1h', '4h', '1D', '1W']
const selectedTimeframe = ref('1h')
const priceChange = ref(2.45) // Mock data

const formatPrice = (price) => {
  if (!price) return '0.00'
  const num = parseFloat(price)
  if (num >= 1) {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 })
}

const getSignalColorClass = (color) => {
  const colors = {
    'green': 'text-green-500',
    'red': 'text-red-500',
    'yellow': 'text-yellow-500',
    'gray': 'text-gray-500'
  }
  return colors[color] || 'text-gray-500'
}
</script>

