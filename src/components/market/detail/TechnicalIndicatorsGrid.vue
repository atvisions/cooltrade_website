<template>
  <div class="space-y-6">

    <!-- 核心指标 - 大卡片展示 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">

      <!-- RSI 卡片 -->
      <div class="bg-gradient-to-br from-blue-50 to-white rounded-xl p-5 border border-blue-100 shadow-sm">
        <div class="flex items-start justify-between mb-3">
          <div>
            <div class="text-xs font-medium text-gray-600 mb-0.5">相对强弱指标</div>
            <div class="text-[10px] text-gray-500">RSI (14)</div>
          </div>
          <span v-if="technicalSignals?.rsi" class="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-700">
            {{ technicalSignals.rsi.signal }}
          </span>
        </div>
        <div class="flex items-end justify-between mb-3">
          <div class="text-3xl font-bold text-gray-900">
            {{ formatNumber(indicators?.rsi) }}
          </div>
          <div class="text-right">
            <div class="text-[10px] text-gray-500 mb-0.5">信号强度</div>
            <div class="text-xs font-semibold px-2 py-0.5 rounded" :class="getRSITextColorClass(indicators?.rsi)">
              {{ getRSILabel(indicators?.rsi) }}
            </div>
          </div>
        </div>
        <!-- RSI 进度条 -->
        <div class="relative h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            class="absolute h-full rounded-full transition-all duration-500"
            :class="getRSIColorClass(indicators?.rsi)"
            :style="{ width: `${Math.min(parseFloat(indicators?.rsi || 0), 100)}%` }"
          ></div>
          <!-- 标记线 -->
          <div class="absolute top-0 left-[30%] w-px h-full bg-white opacity-60"></div>
          <div class="absolute top-0 left-[50%] w-px h-full bg-white opacity-60"></div>
          <div class="absolute top-0 left-[70%] w-px h-full bg-white opacity-60"></div>
        </div>
        <div class="flex justify-between text-[10px] text-gray-500 mt-1.5">
          <span>超卖</span>
          <span>中性</span>
          <span>超买</span>
        </div>
      </div>

      <!-- MACD 卡片 -->
      <div class="bg-gradient-to-br from-purple-50 to-white rounded-xl p-5 border border-purple-100 shadow-sm">
        <div class="flex items-start justify-between mb-3">
          <div>
            <div class="text-xs font-medium text-gray-600 mb-0.5">趋势动量指标</div>
            <div class="text-[10px] text-gray-500">MACD</div>
          </div>
          <span v-if="technicalSignals?.macd" class="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-purple-100 text-purple-700">
            {{ technicalSignals.macd.signal }}
          </span>
        </div>

        <!-- 主要显示 Histogram -->
        <div class="mb-3">
          <div class="flex items-end justify-between mb-1.5">
            <div class="text-[10px] text-gray-500">柱状图 (Histogram)</div>
            <div class="text-[10px] px-2 py-0.5 rounded" :class="parseFloat(indicators?.macd_histogram) >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'">
              {{ parseFloat(indicators?.macd_histogram) >= 0 ? '多头' : '空头' }}
            </div>
          </div>
          <div class="text-3xl font-bold" :class="parseFloat(indicators?.macd_histogram) >= 0 ? 'text-green-600' : 'text-red-600'">
            {{ formatNumber(indicators?.macd_histogram) }}
          </div>
        </div>

        <!-- DIF 和 DEA 简化显示 -->
        <div class="grid grid-cols-2 gap-3 pt-3 border-t border-purple-100">
          <div>
            <div class="text-[10px] text-gray-500 mb-1">DIF</div>
            <div class="text-sm font-semibold text-gray-900">{{ formatNumber(indicators?.macd_line) }}</div>
          </div>
          <div>
            <div class="text-[10px] text-gray-500 mb-1">DEA</div>
            <div class="text-sm font-semibold text-gray-900">{{ formatNumber(indicators?.macd_signal) }}</div>
          </div>
        </div>
      </div>

    </div>

    <!-- 指标网格 - 卡片式布局 -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">

      <!-- ATR -->
      <div class="bg-white rounded-lg p-3.5 border border-gray-200 hover:border-gray-300 transition-colors shadow-sm">
        <div class="flex items-center justify-between mb-2">
          <div class="text-[10px] text-gray-500">ATR (14)</div>
          <div class="w-7 h-7 rounded-lg bg-yellow-50 flex items-center justify-center">
            <svg class="w-3.5 h-3.5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
            </svg>
          </div>
        </div>
        <div class="text-xl font-bold text-gray-900">${{ formatPrice(indicators?.atr_14) }}</div>
        <div class="text-[10px] text-gray-500 mt-1">波动幅度</div>
      </div>

      <!-- 波动率 -->
      <div class="bg-white rounded-lg p-3.5 border border-gray-200 hover:border-gray-300 transition-colors shadow-sm">
        <div class="flex items-center justify-between mb-2">
          <div class="text-[10px] text-gray-500">30日波动率</div>
          <div class="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center">
            <svg class="w-3.5 h-3.5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"/>
            </svg>
          </div>
        </div>
        <div class="text-xl font-bold text-orange-600">{{ formatPercentage(indicators?.volatility_30d) }}%</div>
        <div class="text-[10px] text-gray-500 mt-1">年化</div>
      </div>

      <!-- PSY -->
      <div class="bg-white rounded-lg p-3.5 border border-gray-200 hover:border-gray-300 transition-colors shadow-sm">
        <div class="flex items-center justify-between mb-2">
          <div class="text-[10px] text-gray-500">PSY</div>
          <div class="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
            <svg class="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
            </svg>
          </div>
        </div>
        <div class="text-xl font-bold text-gray-900">{{ formatNumber(indicators?.psy) }}</div>
        <div class="text-[10px] text-gray-500 mt-1">心理线</div>
      </div>

      <!-- BIAS -->
      <div class="bg-white rounded-lg p-3.5 border border-gray-200 hover:border-gray-300 transition-colors shadow-sm">
        <div class="flex items-center justify-between mb-2">
          <div class="text-[10px] text-gray-500">BIAS</div>
          <div class="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center">
            <svg class="w-3.5 h-3.5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
            </svg>
          </div>
        </div>
        <div class="text-xl font-bold" :class="parseFloat(indicators?.bias) >= 0 ? 'text-green-600' : 'text-red-600'">
          {{ formatPercentage(indicators?.bias) }}%
        </div>
        <div class="text-[10px] text-gray-500 mt-1">乖离率</div>
      </div>

      <!-- VWAP -->
      <div class="bg-white rounded-lg p-3.5 border border-gray-200 hover:border-gray-300 transition-colors shadow-sm">
        <div class="flex items-center justify-between mb-2">
          <div class="text-[10px] text-gray-500">VWAP</div>
          <div class="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center">
            <svg class="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
        </div>
        <div class="text-xl font-bold text-gray-900">${{ formatPrice(indicators?.vwap) }}</div>
        <div class="text-[10px] text-gray-500 mt-1">成交量加权</div>
      </div>

      <!-- 24h High -->
      <div class="bg-white rounded-lg p-3.5 border border-gray-200 hover:border-gray-300 transition-colors shadow-sm">
        <div class="flex items-center justify-between mb-2">
          <div class="text-[10px] text-gray-500">24h 最高</div>
          <div class="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center">
            <svg class="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
            </svg>
          </div>
        </div>
        <div class="text-xl font-bold text-green-600">${{ formatPrice(indicators?.high_24h) }}</div>
      </div>

      <!-- 24h Low -->
      <div class="bg-white rounded-lg p-3.5 border border-gray-200 hover:border-gray-300 transition-colors shadow-sm">
        <div class="flex items-center justify-between mb-2">
          <div class="text-[10px] text-gray-500">24h 最低</div>
          <div class="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center">
            <svg class="w-3.5 h-3.5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
            </svg>
          </div>
        </div>
        <div class="text-xl font-bold text-red-600">${{ formatPrice(indicators?.low_24h) }}</div>
      </div>

      <!-- Sharpe Ratio -->
      <div class="bg-white rounded-lg p-3.5 border border-gray-200 hover:border-gray-300 transition-colors shadow-sm">
        <div class="flex items-center justify-between mb-2">
          <div class="text-[10px] text-gray-500">夏普比率</div>
          <div class="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
            <svg class="w-3.5 h-3.5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
          </div>
        </div>
        <div class="text-xl font-bold" :class="parseFloat(indicators?.sharpe_ratio) >= 0 ? 'text-green-600' : 'text-red-600'">
          {{ formatNumber(indicators?.sharpe_ratio) }}
        </div>
        <div class="text-[10px] text-gray-500 mt-1">风险调整收益</div>
      </div>

    </div>

  </div>
</template>

<script setup>
import { computed, defineProps } from 'vue'

const props = defineProps({
  technicalIndicator: { type: Object, default: null },
  technicalSignals: { type: Object, default: () => ({}) },
  exchanges: { type: Array, default: () => [] },
  token: { type: Object, default: () => ({}) }
})

// Get indicators from technical_indicator (merge direct fields and custom_indicators)
const indicators = computed(() => {
  if (!props.technicalIndicator) return {}

  // 直接使用后端返回的字段
  return {
    rsi: props.technicalIndicator.rsi_14,
    psy: props.technicalIndicator.psy,
    macd_line: props.technicalIndicator.macd,
    macd_signal: props.technicalIndicator.macd_signal,
    macd_histogram: props.technicalIndicator.macd_histogram,
    bollinger_upper: props.technicalIndicator.bollinger_upper,
    bollinger_middle: props.technicalIndicator.bollinger_middle,
    bollinger_lower: props.technicalIndicator.bollinger_lower,
    dmi_plus: props.technicalIndicator.dmi_plus,
    dmi_minus: props.technicalIndicator.dmi_minus,
    dmi_adx: props.technicalIndicator.dmi_adx,
    bias: props.technicalIndicator.bias,
    vwap: props.technicalIndicator.vwap,
    nupl: props.technicalIndicator.nupl,
    mayer_multiple: props.technicalIndicator.mayer_multiple,
    funding_rate: props.technicalIndicator.funding_rate,
    exchange_netflow: props.technicalIndicator.exchange_netflow,
    // 新增字段
    atr_14: props.technicalIndicator.atr_14,
    high_24h: props.technicalIndicator.high_24h,
    low_24h: props.technicalIndicator.low_24h,
    volume_24h: props.technicalIndicator.volume_24h,
    volatility_30d: props.technicalIndicator.volatility_30d,
    max_drawdown_7d: props.technicalIndicator.max_drawdown_7d,
    max_drawdown_30d: props.technicalIndicator.max_drawdown_30d,
    sharpe_ratio: props.technicalIndicator.sharpe_ratio,
    long_short_ratio: props.technicalIndicator.long_short_ratio,
    funding_rate_8h_avg: props.technicalIndicator.funding_rate_8h_avg,
    funding_rate_24h_avg: props.technicalIndicator.funding_rate_24h_avg,
  }
})

const primaryExchange = computed(() => {
  if (!props.exchanges || props.exchanges.length === 0) return null
  const binance = props.exchanges.find(e => e.exchange === 'binance')
  return binance || props.exchanges[0]
})

const totalOpenInterest = computed(() => {
  if (!props.exchanges || props.exchanges.length === 0) return 0
  return props.exchanges.reduce((sum, exchange) => {
    return sum + parseFloat(exchange.open_interest_value || 0)
  }, 0)
})

const formatNumber = (value) => {
  if (value === null || value === undefined) return '-'
  const num = parseFloat(value)
  if (isNaN(num)) return '-'
  return num.toFixed(2)
}

const formatPrice = (price) => {
  if (!price) return '-'
  const num = parseFloat(price)
  if (num >= 1) {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 })
}

const formatFundingRate = (rate) => {
  if (rate === null || rate === undefined) return '-'
  const num = parseFloat(rate)
  if (isNaN(num)) return '-'
  return (num * 100).toFixed(4) + '%'
}

const formatLargeNumber = (value) => {
  if (!value) return '0'
  const num = parseFloat(value)
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M'
  return num.toFixed(2)
}

const formatRatio = (ratio) => {
  if (!ratio) return '-'
  return parseFloat(ratio).toFixed(2)
}

const formatFeeRate = (rate) => {
  if (!rate) return '-'
  return (parseFloat(rate) * 100).toFixed(3) + '%'
}

const formatPercentage = (value) => {
  if (value === null || value === undefined) return '-'
  return parseFloat(value).toFixed(2)
}

// RSI 颜色类（进度条）
const getRSIColorClass = (rsi) => {
  if (!rsi) return 'bg-gray-300'
  const value = parseFloat(rsi)
  if (value >= 70) return 'bg-red-500'
  if (value >= 50) return 'bg-orange-500'
  if (value >= 30) return 'bg-yellow-500'
  return 'bg-green-500'
}

// RSI 文字颜色类
const getRSITextColorClass = (rsi) => {
  if (!rsi) return 'bg-gray-100 text-gray-600'
  const value = parseFloat(rsi)
  if (value >= 70) return 'bg-red-50 text-red-700'
  if (value >= 50) return 'bg-orange-50 text-orange-700'
  if (value >= 30) return 'bg-yellow-50 text-yellow-700'
  return 'bg-green-50 text-green-700'
}

// RSI 标签
const getRSILabel = (rsi) => {
  if (!rsi) return '-'
  const value = parseFloat(rsi)
  if (value >= 70) return '超买'
  if (value >= 50) return '偏强'
  if (value >= 30) return '偏弱'
  return '超卖'
}
</script>

