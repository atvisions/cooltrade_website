<template>
  <div class="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
    <!-- Header with Market Type & Timeframe Selector -->
    <div class="border-b border-gray-100 px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <h2 class="text-base font-semibold text-gray-900 flex items-center gap-2">
        <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
        </svg>
        技术指标
      </h2>

      <div class="flex items-center gap-3">
        <!-- Market Type Selector (现货/合约) -->
        <div class="flex items-center bg-gray-100 rounded-lg p-0.5">
          <button
            v-for="market in marketTypes"
            :key="market.value"
            @click="changeMarketType(market.value)"
            :class="[
              selectedMarketType === market.value
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-900',
              'px-3 py-1.5 rounded-md text-xs font-medium transition-all'
            ]"
          >
            {{ market.label }}
          </button>
        </div>

        <!-- Timeframe Dropdown -->
        <div class="relative">
          <select
            v-model="selectedInterval"
            @change="changeInterval(selectedInterval)"
            class="appearance-none bg-gray-100 text-gray-900 text-xs font-medium pl-3 pr-8 py-2 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option v-for="interval in intervals" :key="interval.value" :value="interval.value">
              {{ interval.label }}
            </option>
          </select>
          <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="p-5">
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <p class="text-sm text-red-600">{{ error }}</p>
      </div>

      <!-- Indicators Grid -->
      <TechnicalIndicatorsGrid
        v-else
        :technical-indicator="currentIndicator"
        :technical-signals="technicalSignals"
        :exchanges="exchanges"
        :token="token"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, onMounted, watch } from 'vue'
import { apiRequest, getAPIBaseURL } from '../../../utils/api.js'
import TechnicalIndicatorsGrid from './TechnicalIndicatorsGrid.vue'

const props = defineProps({
  technicalIndicator: { type: Object, default: null },
  technicalSignals: { type: Object, default: () => ({}) },
  exchanges: { type: Array, default: () => [] },
  token: { type: Object, default: () => ({}) }
})

// Options
const marketTypes = [
  { value: 'spot', label: '现货' },
  { value: 'futures', label: '合约' }
]

const intervals = [
  { value: '15m', label: '15分钟' },
  { value: '1h', label: '1小时' },
  { value: '4h', label: '4小时' },
  { value: '1d', label: '1天' }
]

// State
const selectedMarketType = ref('spot')
const selectedInterval = ref('1h')
const currentIndicator = ref(props.technicalIndicator)
const loading = ref(false)
const error = ref(null)

// Fetch indicators for selected interval and market type
const fetchIndicators = async () => {
  if (!props.token || !props.token.symbol) return

  loading.value = true
  error.value = null

  try {
    const response = await apiRequest(
      `${getAPIBaseURL()}/market/tokens/${props.token.symbol}/detail/?interval=${selectedInterval.value}&market_type=${selectedMarketType.value}`
    )

    if (response.status === 'success' && response.data) {
      currentIndicator.value = response.data.technical_indicator
    } else {
      throw new Error(response.message || '加载技术指标失败')
    }
  } catch (err) {
    console.error('Error fetching indicators:', err)
    error.value = err.message || '加载技术指标失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

// Change market type (现货/合约)
const changeMarketType = (marketType) => {
  selectedMarketType.value = marketType
  fetchIndicators()
}

// Change interval
const changeInterval = (interval) => {
  selectedInterval.value = interval
  fetchIndicators()
}

// Initialize with default interval
onMounted(() => {
  if (props.technicalIndicator) {
    currentIndicator.value = props.technicalIndicator
    // 如果后端返回了interval字段，使用它作为默认值
    if (props.technicalIndicator.interval) {
      selectedInterval.value = props.technicalIndicator.interval
    }
    if (props.technicalIndicator.market_type) {
      selectedMarketType.value = props.technicalIndicator.market_type
    }
  }
})

// Watch for prop changes
watch(() => props.technicalIndicator, (newVal) => {
  if (newVal && selectedInterval.value === '1h' && selectedMarketType.value === 'spot') {
    currentIndicator.value = newVal
  }
})
</script>

