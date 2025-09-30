<template>
  <div class="strategy-card bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-blue-300 transition-all duration-200 hover:shadow-lg">
    <!-- 头部：币种信息和风险标签 -->
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-center space-x-3">
        <div class="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-yellow-500 flex items-center justify-center text-white font-bold text-lg">
          {{ coin.symbol.substring(0, 2) }}
        </div>
        <div>
          <h3 class="text-lg font-bold text-gray-900">{{ coin.symbol }}/USDT</h3>
          <span class="text-sm text-gray-500">{{ coin.name }}</span>
        </div>
      </div>
      <div :class="[
        'px-3 py-1 rounded-full text-xs font-semibold',
        riskBadgeClass
      ]">
        {{ riskLevelText }}
      </div>
    </div>

    <!-- 价格和涨跌 -->
    <div class="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
      <div>
        <div class="text-sm text-gray-500 mb-1">当前价格</div>
        <div class="text-2xl font-bold text-gray-900">${{ formatPrice(coin.price) }}</div>
      </div>
      <div :class="[
        'text-lg font-bold',
        coin.change24h >= 0 ? 'text-green-600' : 'text-red-600'
      ]">
        {{ coin.change24h >= 0 ? '+' : '' }}{{ coin.change24h }}%
      </div>
    </div>

    <!-- 推荐策略 -->
    <div class="mb-6">
      <h4 class="text-sm font-semibold text-gray-900 mb-4">推荐策略</h4>
      <div class="grid grid-cols-3 gap-3">
        <div class="text-center p-3 bg-blue-50 rounded-xl">
          <div class="text-2xl mb-1">📊</div>
          <div class="text-xs text-gray-500 mb-1">策略类型</div>
          <div class="text-sm font-semibold text-gray-900">{{ strategy.type }}</div>
        </div>
        <div class="text-center p-3 bg-purple-50 rounded-xl">
          <div class="text-2xl mb-1">⚡</div>
          <div class="text-xs text-gray-500 mb-1">合约倍率</div>
          <div class="text-sm font-semibold text-gray-900">{{ strategy.leverage }}x</div>
        </div>
        <div class="text-center p-3 bg-green-50 rounded-xl">
          <div class="text-2xl mb-1">💰</div>
          <div class="text-xs text-gray-500 mb-1">建议仓位</div>
          <div class="text-sm font-semibold text-gray-900">{{ strategy.positionSize }}%</div>
        </div>
      </div>
    </div>

    <!-- 风险参数 -->
    <div class="mb-6 p-4 bg-gray-50 rounded-xl">
      <div class="grid grid-cols-3 gap-4 text-center">
        <div>
          <div class="text-xs text-gray-500 mb-1">入场价</div>
          <div class="text-sm font-semibold text-gray-900">${{ formatPrice(strategy.entryPrice) }}</div>
        </div>
        <div>
          <div class="text-xs text-red-500 mb-1">止损</div>
          <div class="text-sm font-semibold text-red-600">${{ formatPrice(strategy.stopLoss) }}</div>
          <div class="text-xs text-red-500">-{{ strategy.stopLossPercent }}%</div>
        </div>
        <div>
          <div class="text-xs text-green-500 mb-1">止盈</div>
          <div class="text-sm font-semibold text-green-600">${{ formatPrice(strategy.takeProfit) }}</div>
          <div class="text-xs text-green-500">+{{ strategy.takeProfitPercent }}%</div>
        </div>
      </div>
    </div>

    <!-- 市场指标 -->
    <div class="mb-6 grid grid-cols-3 gap-3 text-center">
      <div>
        <div class="text-xs text-gray-500 mb-1">市值排名</div>
        <div class="text-sm font-semibold text-gray-900">#{{ coin.marketCapRank }}</div>
      </div>
      <div>
        <div class="text-xs text-gray-500 mb-1">24h成交量</div>
        <div class="text-sm font-semibold text-gray-900">${{ formatVolume(coin.volume24h) }}</div>
      </div>
      <div>
        <div class="text-xs text-gray-500 mb-1">波动率</div>
        <div class="text-sm font-semibold text-gray-900">{{ coin.volatility }}%</div>
      </div>
    </div>

    <!-- 匹配度 -->
    <div class="mb-6 flex items-center justify-center">
      <div class="relative w-20 h-20">
        <svg class="transform -rotate-90 w-20 h-20">
          <circle
            cx="40"
            cy="40"
            r="32"
            stroke="#e5e7eb"
            stroke-width="6"
            fill="none"
          />
          <circle
            cx="40"
            cy="40"
            r="32"
            :stroke="matchScoreColor"
            stroke-width="6"
            fill="none"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="circumference - (matchScore / 100) * circumference"
            class="transition-all duration-1000"
          />
        </svg>
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="text-lg font-bold text-gray-900">{{ matchScore }}%</span>
        </div>
      </div>
      <div class="ml-4">
        <div class="text-sm font-semibold text-gray-900">匹配度</div>
        <div class="text-xs text-gray-500">基于您的风险偏好</div>
      </div>
    </div>

    <!-- 推荐理由 -->
    <div class="mb-6">
      <h5 class="text-sm font-semibold text-gray-900 mb-3">推荐理由</h5>
      <ul class="space-y-2">
        <li v-for="(reason, index) in strategy.reasons" :key="index" class="flex items-start text-sm text-gray-600">
          <svg class="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          {{ reason }}
        </li>
      </ul>
    </div>

    <!-- 操作按钮 -->
    <div class="flex gap-3">
      <button
        @click="$emit('view-details', strategy.id)"
        class="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 font-medium"
      >
        查看详情
      </button>
      <button
        @click="$emit('start-trade', strategy.id)"
        class="flex-1 px-4 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
      >
        立即交易
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  coin: {
    type: Object,
    required: true
  },
  strategy: {
    type: Object,
    required: true
  },
  riskLevel: {
    type: String,
    required: true
  },
  matchScore: {
    type: Number,
    required: true
  }
})

defineEmits(['view-details', 'start-trade'])

// 风险等级文本
const riskLevelText = computed(() => {
  const levels = {
    conservative: '保守型',
    moderate: '稳健型',
    aggressive: '激进型'
  }
  return levels[props.riskLevel] || '稳健型'
})

// 风险标签样式
const riskBadgeClass = computed(() => {
  const classes = {
    conservative: 'bg-green-100 text-green-700',
    moderate: 'bg-blue-100 text-blue-700',
    aggressive: 'bg-red-100 text-red-700'
  }
  return classes[props.riskLevel] || 'bg-blue-100 text-blue-700'
})

// 匹配度颜色
const matchScoreColor = computed(() => {
  if (props.matchScore >= 80) return '#10b981' // green
  if (props.matchScore >= 60) return '#3b82f6' // blue
  return '#f59e0b' // orange
})

// 圆形进度条周长
const circumference = computed(() => 2 * Math.PI * 32)

// 格式化价格
const formatPrice = (price) => {
  if (price >= 1000) {
    return price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
  } else if (price >= 1) {
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  } else {
    return price.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 6 })
  }
}

// 格式化成交量
const formatVolume = (volume) => {
  if (volume >= 1e9) {
    return (volume / 1e9).toFixed(1) + 'B'
  } else if (volume >= 1e6) {
    return (volume / 1e6).toFixed(1) + 'M'
  } else if (volume >= 1e3) {
    return (volume / 1e3).toFixed(1) + 'K'
  }
  return volume.toString()
}
</script>

<style scoped>
.strategy-card {
  max-width: 400px;
}
</style>

