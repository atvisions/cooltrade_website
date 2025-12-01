<template>
  <div class="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
    <!-- Header with Timeframe Selector -->
    <div class="border-b border-gray-100 px-5 py-4 flex items-center justify-between">
      <h2 class="text-base font-semibold text-gray-900 flex items-center gap-2">
        <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
        </svg>
        技术指标
      </h2>

      <!-- Timeframe Selector -->
      <div class="flex items-center bg-gray-100 rounded-xl p-1">
        <button
          v-for="interval in intervals"
          :key="interval"
          @click="changeInterval(interval)"
          :class="[
            selectedInterval === interval ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900',
            'px-3 py-1.5 rounded-lg text-xs font-medium transition-all'
          ]"
        >
          {{ interval }}
        </button>
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
import { apiRequest, API_BASE_URL } from '../../../utils/api.js'
import TechnicalIndicatorsGrid from './TechnicalIndicatorsGrid.vue'

const props = defineProps({
  technicalIndicator: { type: Object, default: null },
  technicalSignals: { type: Object, default: () => ({}) },
  exchanges: { type: Array, default: () => [] },
  token: { type: Object, default: () => ({}) }
})

// State
const intervals = ['1h', '4h', '1d']
const selectedInterval = ref('1h')
const currentIndicator = ref(props.technicalIndicator)
const loading = ref(false)
const error = ref(null)

// Fetch indicators for selected interval
const fetchIndicators = async (interval) => {
  if (!props.token || !props.token.symbol) return

  loading.value = true
  error.value = null

  try {
    const response = await apiRequest(
      `${API_BASE_URL}/market/tokens/${props.token.symbol}/detail/?interval=${interval}`
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

// Change interval
const changeInterval = (interval) => {
  selectedInterval.value = interval
  fetchIndicators(interval)
}

// Initialize with default interval
onMounted(() => {
  if (props.technicalIndicator) {
    currentIndicator.value = props.technicalIndicator
    // 如果后端返回了interval字段，使用它作为默认值
    if (props.technicalIndicator.interval) {
      selectedInterval.value = props.technicalIndicator.interval
    }
  }
})

// Watch for prop changes
watch(() => props.technicalIndicator, (newVal) => {
  if (newVal && selectedInterval.value === '1h') {
    currentIndicator.value = newVal
  }
})
</script>

