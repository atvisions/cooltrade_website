<template>
  <div class="space-y-6">
    <!-- Indicators Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">

      <!-- Technical Indicators Cards -->
      <div class="bg-white rounded-xl p-6 border border-gray-200">
        <h3 class="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">动量指标</h3>
        <div class="space-y-3">

          <!-- RSI -->
          <div class="p-3 bg-gray-50 rounded-lg">
            <div class="text-xs text-gray-600 mb-1">RSI (14)</div>
            <div class="text-xl font-bold text-gray-900">
              {{ formatNumber(indicators?.rsi) }}
            </div>
            <div v-if="technicalSignals?.rsi" class="text-xs text-gray-500 mt-1">
              {{ technicalSignals.rsi.description }}
            </div>
          </div>

          <!-- PSY -->
          <div class="p-3 bg-gray-50 rounded-lg">
            <div class="text-xs text-gray-600 mb-1">PSY</div>
            <div class="text-xl font-bold text-gray-900">
              {{ formatNumber(indicators?.psy) }}
            </div>
          </div>

        </div>
      </div>

      <!-- MACD Card -->
      <div class="bg-white rounded-xl p-6 border border-gray-200">
        <h3 class="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">MACD</h3>
        <div class="space-y-3">
          <div class="p-3 bg-gray-50 rounded-lg">
            <div v-if="indicators?.macd_line" class="space-y-2 text-xs">
              <div class="flex justify-between">
                <span class="text-gray-600">Line:</span>
                <span class="font-semibold text-gray-900">{{ formatNumber(indicators.macd_line) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Signal:</span>
                <span class="font-semibold text-gray-900">{{ formatNumber(indicators.macd_signal) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Histogram:</span>
                <span class="font-semibold" :class="parseFloat(indicators.macd_histogram) >= 0 ? 'text-green-600' : 'text-red-600'">
                  {{ formatNumber(indicators.macd_histogram) }}
                </span>
              </div>
            </div>
            <div v-else class="text-sm text-gray-400">暂无数据</div>
          </div>

          <!-- Bollinger Bands -->
          <div class="p-3 bg-gray-50 rounded-lg">
            <div class="text-xs text-gray-600 mb-2">Bollinger Bands</div>
            <div v-if="indicators?.bollinger_middle" class="space-y-2 text-xs">
              <div class="flex justify-between">
                <span class="text-gray-600">Upper:</span>
                <span class="font-semibold text-gray-900">${{ formatPrice(indicators.bollinger_upper) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Middle:</span>
                <span class="font-semibold text-gray-900">${{ formatPrice(indicators.bollinger_middle) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Lower:</span>
                <span class="font-semibold text-gray-900">${{ formatPrice(indicators.bollinger_lower) }}</span>
              </div>
            </div>
            <div v-else class="text-sm text-gray-400">暂无数据</div>
          </div>
        </div>
      </div>

      <!-- DMI & Other Indicators Card -->
      <div class="bg-white rounded-xl p-6 border border-gray-200">
        <h3 class="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">趋势指标</h3>
        <div class="space-y-3">
          <!-- DMI -->
          <div class="p-3 bg-gray-50 rounded-lg">
            <div class="text-xs text-gray-600 mb-2">DMI</div>
            <div v-if="indicators?.dmi_adx" class="space-y-2 text-xs">
              <div class="flex justify-between">
                <span class="text-gray-600">+DI:</span>
                <span class="font-semibold text-green-600">{{ formatNumber(indicators.dmi_plus) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">-DI:</span>
                <span class="font-semibold text-red-600">{{ formatNumber(indicators.dmi_minus) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">ADX:</span>
                <span class="font-semibold text-gray-900">{{ formatNumber(indicators.dmi_adx) }}</span>
              </div>
            </div>
            <div v-else class="text-sm text-gray-400">No data</div>
          </div>

          <!-- Other Indicators -->
          <div class="grid grid-cols-2 gap-3">
            <!-- BIAS -->
            <div class="p-3 bg-gray-50 rounded-lg">
              <div class="text-xs text-gray-600 mb-1">BIAS</div>
              <div class="text-xl font-bold" :class="parseFloat(indicators?.bias) >= 0 ? 'text-green-600' : 'text-red-600'">
                {{ formatPercentage(indicators?.bias) }}%
              </div>
            </div>

            <!-- VWAP -->
            <div class="p-3 bg-gray-50 rounded-lg">
              <div class="text-xs text-gray-600 mb-1">VWAP</div>
              <div class="text-xl font-bold text-gray-900">
                ${{ formatPrice(indicators?.vwap) }}
              </div>
            </div>
          </div>

          <!-- On-chain Metrics -->
          <div class="grid grid-cols-2 gap-3">
            <!-- NUPL -->
            <div class="p-3 bg-gray-50 rounded-lg">
              <div class="text-xs text-gray-600 mb-1">NUPL (Net Unrealized P/L)</div>
              <div class="text-xl font-bold" :class="parseFloat(indicators?.nupl) >= 0 ? 'text-green-600' : 'text-red-600'">
                {{ formatNumber(indicators?.nupl) }}
              </div>
            </div>

            <!-- Mayer Multiple -->
            <div class="p-3 bg-gray-50 rounded-lg">
              <div class="text-xs text-gray-600 mb-1">Mayer Multiple</div>
              <div class="text-xl font-bold text-gray-900">
                {{ formatNumber(indicators?.mayer_multiple) }}
              </div>
            </div>
          </div>

          <!-- Exchange Data -->
          <div class="grid grid-cols-2 gap-3">
            <!-- Funding Rate -->
            <div class="p-3 bg-gray-50 rounded-lg">
              <div class="text-xs text-gray-600 mb-1">Funding Rate</div>
              <div class="text-xl font-bold" :class="parseFloat(indicators?.funding_rate) >= 0 ? 'text-green-600' : 'text-red-600'">
                {{ formatFundingRate(indicators?.funding_rate) }}
              </div>
            </div>

            <!-- Exchange Netflow -->
            <div class="p-3 bg-gray-50 rounded-lg">
              <div class="text-xs text-gray-600 mb-1">Exchange Netflow</div>
              <div class="text-xl font-bold" :class="parseFloat(indicators?.exchange_netflow) >= 0 ? 'text-green-600' : 'text-red-600'">
                {{ formatNumber(indicators?.exchange_netflow) }}
              </div>
            </div>
          </div>

        </div>
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

  // Merge direct fields with custom_indicators
  const direct = {
    rsi: props.technicalIndicator.rsi_14,
    macd_line: props.technicalIndicator.macd,
    macd_signal: props.technicalIndicator.macd_signal,
    macd_histogram: props.technicalIndicator.macd_histogram,
    bollinger_upper: props.technicalIndicator.bollinger_upper,
    bollinger_middle: props.technicalIndicator.bollinger_middle,
    bollinger_lower: props.technicalIndicator.bollinger_lower,
  }

  // Merge with custom_indicators if available
  const custom = props.technicalIndicator.custom_indicators || {}

  return { ...direct, ...custom }
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
  if (!value) return '-'
  return parseFloat(value).toFixed(2)
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
  if (!rate) return '-'
  return (parseFloat(rate) * 100).toFixed(4) + '%'
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
</script>

