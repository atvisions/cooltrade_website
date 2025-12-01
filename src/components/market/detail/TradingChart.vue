<template>
  <div class="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
    <!-- Chart Header -->
    <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <h3 class="text-base font-semibold text-gray-900">{{ symbol }}/USDT</h3>
        <span v-if="marketType === 'futures'" class="px-2 py-0.5 bg-purple-50 text-purple-600 text-xs font-medium rounded-lg">永续合约</span>
        <span v-else class="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-xs font-medium rounded-lg">现货</span>
        <!-- 涨跌指示 -->
        <span v-if="priceChange !== null" :class="[
          'px-2 py-0.5 text-xs font-medium rounded-lg',
          priceChange >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
        ]">
          {{ priceChange >= 0 ? '+' : '' }}{{ priceChange.toFixed(2) }}%
        </span>
      </div>

      <!-- Timeframe Selector -->
      <div class="flex items-center bg-gray-100 rounded-xl p-1">
        <button
          v-for="tf in timeframes"
          :key="tf"
          @click="changeTimeframe(tf)"
          :class="[
            selectedTimeframe === tf ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900',
            'px-3 py-1.5 rounded-lg text-xs font-medium transition-all'
          ]"
        >
          {{ tf }}
        </button>
      </div>
    </div>

    <!-- Chart Area -->
    <div class="relative p-4" style="height: 400px;">
      <!-- Loading State -->
      <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-white/90 z-10">
        <div class="text-center">
          <div class="animate-spin rounded-full h-10 w-10 border-2 border-blue-600 border-t-transparent mx-auto mb-3"></div>
          <p class="text-sm text-gray-600">加载K线数据...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="absolute inset-0 flex items-center justify-center bg-gray-50">
        <div class="text-center">
          <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p class="text-sm text-gray-600 mb-3">{{ error }}</p>
          <button @click="loadKlineData(selectedTimeframe)" class="px-4 py-2 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-700 transition-colors">
            重新加载
          </button>
        </div>
      </div>

      <!-- Chart.js Canvas -->
      <canvas ref="chartCanvas"></canvas>

      <!-- Current Price Overlay -->
      <div v-if="latestPrice?.price" class="absolute top-6 right-6 z-20">
        <div class="px-3 py-2 bg-white/95 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm">
          <div class="text-xs text-gray-400 mb-0.5">当前价格</div>
          <div class="text-lg font-bold" :class="priceChange >= 0 ? 'text-emerald-600' : 'text-red-600'">
            ${{ formatPrice(latestPrice.price) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Chart Footer - Quick Stats -->
    <div class="px-5 py-3 border-t border-gray-100 grid grid-cols-4 gap-4 bg-gray-50/50">
      <div>
        <div class="text-xs text-gray-400 mb-0.5">24h最高</div>
        <div class="text-sm font-semibold text-emerald-600">
          ${{ latestPrice?.high_24h ? formatPrice(latestPrice.high_24h) : '--' }}
        </div>
      </div>
      <div>
        <div class="text-xs text-gray-400 mb-0.5">24h最低</div>
        <div class="text-sm font-semibold text-red-600">
          ${{ latestPrice?.low_24h ? formatPrice(latestPrice.low_24h) : '--' }}
        </div>
      </div>
      <div>
        <div class="text-xs text-gray-400 mb-0.5">24h成交额</div>
        <div class="text-sm font-semibold text-gray-900">
          {{ latestPrice?.volume_24h ? formatVolume(latestPrice.volume_24h) : '--' }}
        </div>
      </div>
      <div>
        <div class="text-xs text-gray-400 mb-0.5">K线数量</div>
        <div class="text-sm font-semibold text-gray-900">{{ klineCount }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { Chart, registerables } from 'chart.js'
import { apiRequest, API_ENDPOINTS } from '../../../utils/api.js'

// 注册 Chart.js 组件
Chart.register(...registerables)

const props = defineProps({
  symbol: {
    type: String,
    required: true
  },
  currentPrice: {
    type: [String, Number],
    default: 0
  },
  marketType: {
    type: String,
    default: 'spot'
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
const chartCanvas = ref(null)
const loading = ref(false)
const error = ref(null)
const latestPrice = ref(null)
const klineCount = ref(0)
const priceChange = ref(null)

let chartInstance = null

// 创建渐变
const createGradient = (ctx, chartArea, isUp) => {
  const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
  if (isUp) {
    gradient.addColorStop(0, 'rgba(38, 166, 154, 0.4)')
    gradient.addColorStop(1, 'rgba(38, 166, 154, 0.02)')
  } else {
    gradient.addColorStop(0, 'rgba(239, 83, 80, 0.4)')
    gradient.addColorStop(1, 'rgba(239, 83, 80, 0.02)')
  }
  return gradient
}

// 创建/更新图表
const createChart = (labels, data, isUp) => {
  if (!chartCanvas.value) return

  // 销毁旧图表
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }

  const ctx = chartCanvas.value.getContext('2d')
  const lineColor = isUp ? 'rgb(38, 166, 154)' : 'rgb(239, 83, 80)'

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        borderColor: lineColor,
        borderWidth: 2,
        fill: true,
        backgroundColor: (context) => {
          const chart = context.chart
          const { ctx, chartArea } = chart
          if (!chartArea) return null
          return createGradient(ctx, chartArea, isUp)
        },
        tension: 0.1,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: lineColor,
        pointHoverBorderWidth: 2,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: 'index',
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          titleColor: '#333',
          bodyColor: '#666',
          borderColor: '#e5e5e5',
          borderWidth: 1,
          padding: 12,
          displayColors: false,
          callbacks: {
            title: (items) => items[0]?.label || '',
            label: (item) => `$${formatPrice(item.raw)}`,
          }
        }
      },
      scales: {
        x: {
          display: true,
          grid: { display: false },
          ticks: {
            color: '#999',
            font: { size: 11 },
            maxRotation: 0,
            maxTicksLimit: 8,
          },
          border: { display: false }
        },
        y: {
          display: true,
          position: 'right',
          grid: { color: '#f5f5f5' },
          ticks: {
            color: '#999',
            font: { size: 11 },
            callback: (value) => '$' + formatPrice(value),
          },
          border: { display: false }
        }
      }
    }
  })
}

// Load K-line data
const loadKlineData = async (timeframe) => {
  loading.value = true
  error.value = null

  try {
    const apiTimeframe = timeframeMap[timeframe] || '1h'
    const limit = timeframe === '1m' || timeframe === '5m' ? 500 : 200
    const cleanSymbol = props.symbol.replace('/USDT', '').replace('USDT', '')

    const response = await apiRequest(
      API_ENDPOINTS.MARKET_KLINES(cleanSymbol),
      { method: 'GET', params: { timeframe: apiTimeframe, limit: limit } }
    )

    if (response.status === 'success' && response.data) {
      const { klines, latest_price, high_24h, low_24h, volume_24h } = response.data

      if (!klines || klines.length === 0) {
        error.value = '该代币暂无K线数据'
        return
      }

      // Update latest price info
      if (latest_price) {
        latestPrice.value = {
          ...latest_price,
          high_24h: high_24h || latest_price.high_24h,
          low_24h: low_24h || latest_price.low_24h,
          volume_24h: volume_24h || latest_price.volume_24h
        }
        emit('price-update', latestPrice.value)
      }

      // 格式化数据
      const sortedKlines = klines
        .filter(k => k.timestamp && k.close)
        .sort((a, b) => a.timestamp - b.timestamp)

      if (sortedKlines.length === 0) {
        error.value = '该代币暂无有效K线数据'
        return
      }

      // 格式化时间标签
      const labels = sortedKlines.map(k => {
        const date = new Date(k.timestamp)
        if (timeframe === '1D' || timeframe === '1W') {
          return `${date.getMonth() + 1}/${date.getDate()}`
        }
        return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
      })

      const data = sortedKlines.map(k => Number(k.close))
      klineCount.value = data.length

      // 计算涨跌
      const firstPrice = data[0]
      const lastPrice = data[data.length - 1]
      const isUp = lastPrice >= firstPrice
      priceChange.value = ((lastPrice - firstPrice) / firstPrice) * 100

      console.log('📊 K线数据数量:', data.length, '涨跌:', isUp ? '涨' : '跌')

      // 创建图表
      await nextTick()
      createChart(labels, data, isUp)

    } else {
      const errorMsg = response.message || '加载K线数据失败'
      const errorDetail = response.detail || ''
      error.value = errorDetail ? `${errorMsg}: ${errorDetail}` : errorMsg
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



// Lifecycle hooks
onMounted(() => {
  loadKlineData(selectedTimeframe.value)
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
})

// Watch for symbol changes
watch(() => props.symbol, () => {
  loadKlineData(selectedTimeframe.value)
})
</script>

