<template>
  <div class="bg-white rounded-2xl overflow-hidden border border-gray-200">
    <!-- Chart Header -->
    <div class="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <h3 class="text-gray-900 font-semibold">{{ symbol }}/USDT</h3>
      </div>

      <!-- Timeframe Selector -->
      <div class="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
        <button
          v-for="tf in timeframes"
          :key="tf"
          @click="changeTimeframe(tf)"
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
      <!-- Loading State -->
      <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p class="text-gray-600 font-medium">加载K线数据...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="absolute inset-0 flex items-center justify-center">
        <div class="text-center">
          <svg class="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p class="text-red-600 font-medium mb-2">加载失败</p>
          <p class="text-sm text-gray-500 mb-4">{{ error }}</p>
          <button @click="loadKlineData(selectedTimeframe)" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            重试
          </button>
        </div>
      </div>

      <!-- Chart Container -->
      <div ref="chartContainer" class="w-full h-full"></div>

      <!-- Market Condition Badge -->
      <div v-if="marketCondition" class="absolute top-4 left-4 z-20">
        <div class="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg border border-gray-200 shadow-sm">
          <div class="flex items-center space-x-2">
            <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span class="text-xs font-medium text-gray-900">{{ marketCondition }}</span>
          </div>
        </div>
      </div>


    </div>

    <!-- Chart Footer - Quick Stats -->
    <div class="px-4 py-3 border-t border-gray-200 grid grid-cols-4 gap-4 bg-gray-50">
      <div>
        <div class="text-xs text-gray-500 mb-1">24h最高</div>
        <div class="text-sm font-semibold text-gray-900">
          ${{ latestPrice?.high_24h ? formatPrice(latestPrice.high_24h) : '--' }}
        </div>
      </div>
      <div>
        <div class="text-xs text-gray-500 mb-1">24h最低</div>
        <div class="text-sm font-semibold text-gray-900">
          ${{ latestPrice?.low_24h ? formatPrice(latestPrice.low_24h) : '--' }}
        </div>
      </div>
      <div>
        <div class="text-xs text-gray-500 mb-1">24h成交量</div>
        <div class="text-sm font-semibold text-gray-900">
          {{ latestPrice?.volume_24h ? formatVolume(latestPrice.volume_24h) : '--' }}
        </div>
      </div>
      <div>
        <div class="text-xs text-gray-500 mb-1">数据点</div>
        <div class="text-sm font-semibold text-gray-900">{{ klineCount }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { createChart, CrosshairMode, CandlestickSeries } from 'lightweight-charts'
import { apiRequest, API_BASE_URL } from '../../../utils/api.js'

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

const emit = defineEmits(['price-update'])

// Timeframe mapping: display -> API format
const timeframeMap = {
  '1m': '1m',
  '5m': '5m',
  '15m': '15m',
  '1h': '1h',
  '4h': '4h',
  '1D': '1d',
  '1W': '1w'
}

const timeframes = ['1m', '5m', '15m', '1h', '4h', '1D', '1W']
const selectedTimeframe = ref('1h')
const chartContainer = ref(null)
const loading = ref(false)
const error = ref(null)
const latestPrice = ref(null)
const klineCount = ref(0)

let chart = null
let candlestickSeries = null
let resizeObserver = null

// Initialize chart
const initChart = () => {
  if (!chartContainer.value || chart) return

  try {
    chart = createChart(chartContainer.value, {
      width: chartContainer.value.clientWidth,
      height: 500,
      layout: {
        background: { color: '#fafafa' },
        textColor: '#333',
      },
      grid: {
        vertLines: { color: '#f0f0f0' },
        horzLines: { color: '#f0f0f0' },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      rightPriceScale: {
        borderColor: '#e0e0e0',
      },
      timeScale: {
        borderColor: '#e0e0e0',
        timeVisible: true,
        secondsVisible: false,
      },
    })

    // 使用 v5 的新 API: addSeries
    candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    })

    // Handle window resize
    resizeObserver = new ResizeObserver(entries => {
      if (entries.length === 0 || entries[0].target !== chartContainer.value) return
      const newRect = entries[0].contentRect
      chart.applyOptions({ width: newRect.width })
    })

    resizeObserver.observe(chartContainer.value)
  } catch (err) {
    console.error('Error initializing chart:', err)
    error.value = '图表初始化失败: ' + err.message
  }
}

// Load K-line data
const loadKlineData = async (timeframe) => {
  if (!candlestickSeries) return

  loading.value = true
  error.value = null

  try {
    const apiTimeframe = timeframeMap[timeframe] || '1h'
    const limit = timeframe === '1m' || timeframe === '5m' ? 500 : 200

    // Convert symbol format (remove any existing /USDT)
    const cleanSymbol = props.symbol.replace('/USDT', '').replace('USDT', '')

    const response = await apiRequest(
      `${API_BASE_URL}/market/klines/${cleanSymbol}/`,
      {
        method: 'GET',
        params: {
          timeframe: apiTimeframe,
          limit: limit,
          exchange: 'binance'
        }
      }
    )

    if (response.status === 'success' && response.data) {
      const { klines, latest_price } = response.data

      // Update latest price info
      if (latest_price) {
        latestPrice.value = latest_price
        // 发送价格更新事件给父组件
        emit('price-update', latest_price)
      }

      // Format data for lightweight-charts
      const formattedData = klines.map(k => ({
        time: k.timestamp / 1000, // Convert to seconds
        open: k.open,
        high: k.high,
        low: k.low,
        close: k.close,
      }))

      klineCount.value = formattedData.length

      // Update chart
      candlestickSeries.setData(formattedData)
      chart.timeScale().fitContent()
    } else {
      throw new Error(response.message || '加载K线数据失败')
    }
  } catch (err) {
    console.error('Error loading kline data:', err)
    error.value = err.message || '加载K线数据失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

// Change timeframe
const changeTimeframe = (timeframe) => {
  selectedTimeframe.value = timeframe
  loadKlineData(timeframe)
}

// Format price
const formatPrice = (price) => {
  if (!price) return '0.00'
  const num = parseFloat(price)
  if (num >= 1) {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 })
}

// Format volume
const formatVolume = (volume) => {
  if (!volume) return '0'
  const num = parseFloat(volume)
  if (num >= 1e9) {
    return `$${(num / 1e9).toFixed(2)}B`
  } else if (num >= 1e6) {
    return `$${(num / 1e6).toFixed(2)}M`
  } else if (num >= 1e3) {
    return `$${(num / 1e3).toFixed(2)}K`
  }
  return `$${num.toFixed(2)}`
}

// Get signal color class
const getSignalColorClass = (color) => {
  const colors = {
    'green': 'text-green-500',
    'red': 'text-red-500',
    'yellow': 'text-yellow-500',
    'gray': 'text-gray-500'
  }
  return colors[color] || 'text-gray-500'
}

// Lifecycle hooks
onMounted(() => {
  initChart()
  loadKlineData(selectedTimeframe.value)
})

onUnmounted(() => {
  if (resizeObserver && chartContainer.value) {
    resizeObserver.unobserve(chartContainer.value)
  }
  if (chart) {
    chart.remove()
    chart = null
  }
})

// Watch for symbol changes
watch(() => props.symbol, () => {
  loadKlineData(selectedTimeframe.value)
})
</script>

