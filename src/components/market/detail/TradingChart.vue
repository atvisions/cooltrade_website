<template>
  <div class="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
    <!-- Chart Header -->
    <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <!-- 图表类型切换 -->
        <div class="flex items-center bg-gray-100 rounded-lg p-0.5">
          <button
            @click="chartType = 'line'"
            :class="[
              chartType === 'line' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700',
              'p-1.5 rounded-md transition-all'
            ]"
            title="线形图"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"/>
            </svg>
          </button>
          <button
            @click="chartType = 'candle'"
            :class="[
              chartType === 'candle' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700',
              'p-1.5 rounded-md transition-all'
            ]"
            title="蜡烛图"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="8" width="4" height="8" rx="0.5"/>
              <rect x="4.5" y="5" width="1" height="3"/>
              <rect x="4.5" y="16" width="1" height="3"/>
              <rect x="10" y="6" width="4" height="10" rx="0.5"/>
              <rect x="11.5" y="3" width="1" height="3"/>
              <rect x="11.5" y="16" width="1" height="5"/>
              <rect x="17" y="9" width="4" height="6" rx="0.5"/>
              <rect x="18.5" y="6" width="1" height="3"/>
              <rect x="18.5" y="15" width="1" height="3"/>
            </svg>
          </button>
        </div>

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
    <div class="relative" style="height: 400px;">
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

      <!-- Lightweight Charts Container -->
      <div ref="chartContainer" class="w-full h-full"></div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as LightweightCharts from 'lightweight-charts'
import { apiRequest, API_ENDPOINTS } from '../../../utils/api.js'

const props = defineProps({
  symbol: { type: String, required: true },
  currentPrice: { type: [String, Number], default: 0 },
  marketType: { type: String, default: 'spot' },
  technicalSignals: { type: Object, default: () => ({}) },
  marketCondition: { type: String, default: '' }
})

const emit = defineEmits(['price-update'])

// Timeframe mapping
const timeframeMap = { '1m': '1m', '5m': '5m', '15m': '15m', '1h': '1h', '4h': '4h', '1D': '1d', '1W': '1w' }
const timeframes = ['1m', '5m', '15m', '1h', '4h', '1D', '1W']

const selectedTimeframe = ref('1h')
const chartType = ref('line') // 'line' | 'candle'
const chartContainer = ref(null)
const loading = ref(false)
const error = ref(null)
const latestPrice = ref(null)
const priceChange = ref(null)

let chart = null
let mainSeries = null
let volumeSeries = null
let klineData = [] // 存储原始数据

// 创建图表
const initChart = () => {
  if (!chartContainer.value || chart) return

  chart = LightweightCharts.createChart(chartContainer.value, {
    layout: {
      background: { color: '#ffffff' },
      textColor: '#999',
    },
    grid: {
      vertLines: { color: '#f5f5f5' },
      horzLines: { color: '#f5f5f5' },
    },
    rightPriceScale: {
      borderColor: '#f0f0f0',
      scaleMargins: { top: 0.1, bottom: 0.25 },
    },
    timeScale: {
      borderColor: '#f0f0f0',
      timeVisible: true,
      secondsVisible: false,
    },
    crosshair: {
      mode: 1,
      vertLine: { color: '#6366f1', width: 1, style: 2, labelBackgroundColor: '#6366f1' },
      horzLine: { color: '#6366f1', width: 1, style: 2, labelBackgroundColor: '#6366f1' },
    },
  })

  // 创建交易量柱状图 (v5 API)
  volumeSeries = chart.addSeries(LightweightCharts.HistogramSeries, {
    color: '#26a69a',
    priceFormat: { type: 'volume' },
    priceScaleId: 'volume',
  })

  // 配置交易量的价格轴
  chart.priceScale('volume').applyOptions({
    scaleMargins: { top: 0.85, bottom: 0 },
  })
}

// 更新图表数据
const updateChartData = () => {
  if (!chart || klineData.length === 0) return

  // 移除旧的主系列
  if (mainSeries) {
    chart.removeSeries(mainSeries)
    mainSeries = null
  }

  const isUp = klineData[klineData.length - 1].close >= klineData[0].close
  const lineColor = isUp ? '#26a69a' : '#ef5350'

  // 确保数据有效
  const validData = klineData.filter(k => k.close > 0 && !isNaN(k.close))
  if (validData.length === 0) return

  if (chartType.value === 'line') {
    // 线形图 (v5 API)
    mainSeries = chart.addSeries(LightweightCharts.AreaSeries, {
      lineColor: lineColor,
      topColor: isUp ? 'rgba(38, 166, 154, 0.4)' : 'rgba(239, 83, 80, 0.4)',
      bottomColor: isUp ? 'rgba(38, 166, 154, 0.02)' : 'rgba(239, 83, 80, 0.02)',
      lineWidth: 2,
    })
    const lineData = validData.map(k => ({ time: k.time, value: k.close }))
    console.log('📊 Line data sample:', lineData.slice(0, 3))
    mainSeries.setData(lineData)
  } else {
    // 蜡烛图 (v5 API)
    mainSeries = chart.addSeries(LightweightCharts.CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderUpColor: '#26a69a',
      borderDownColor: '#ef5350',
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    })
    console.log('📊 Candle data sample:', validData.slice(0, 3))
    mainSeries.setData(validData)
  }

  // 更新交易量数据
  const volumeData = validData.map(k => ({
    time: k.time,
    value: k.volume || 0,
    color: k.close >= k.open ? 'rgba(38, 166, 154, 0.5)' : 'rgba(239, 83, 80, 0.5)'
  }))
  volumeSeries.setData(volumeData)

  chart.timeScale().fitContent()
}

// 加载K线数据
const loadKlineData = async (timeframe) => {
  loading.value = true
  error.value = null

  try {
    const apiTimeframe = timeframeMap[timeframe] || '1h'
    const limit = timeframe === '1m' || timeframe === '5m' ? 500 : 200
    const cleanSymbol = props.symbol.replace('/USDT', '').replace('USDT', '')

    // 使用支持 market_type 的新 API
    const response = await apiRequest(
      API_ENDPOINTS.MARKET_TOKEN_KLINES(cleanSymbol),
      { method: 'GET', params: { interval: apiTimeframe, limit: limit, market_type: props.marketType } }
    )

    // 新 API 返回格式: { symbol, interval, spot: {count, data}, futures: {count, data} }
    const marketData = props.marketType === 'futures' ? response.futures : response.spot
    const klines = marketData?.data || []

    if (!klines || klines.length === 0) {
      error.value = props.marketType === 'futures' ? '该代币暂无合约K线数据' : '该代币暂无现货K线数据'
      return
    }

    // 转换为 lightweight-charts 格式
    // 新 API 返回的字段: time, open, high, low, close, volume
    klineData = klines
      .filter(k => k.time && k.close != null && k.open != null && k.high != null && k.low != null)
      .map(k => {
        // time 字段是 ISO 字符串，需要转换为 Unix 时间戳（秒）
        const timestamp = typeof k.time === 'string' ? Math.floor(new Date(k.time).getTime() / 1000) : k.time
        return {
          time: timestamp,
          open: Number(k.open) || 0,
          high: Number(k.high) || 0,
          low: Number(k.low) || 0,
          close: Number(k.close) || 0,
          volume: Number(k.volume || k.quote_volume || 0)
        }
      })
      .filter(k => !isNaN(k.close) && k.close > 0 && !isNaN(k.time))
      .sort((a, b) => a.time - b.time)

    if (klineData.length === 0) {
      error.value = '该代币暂无有效K线数据'
      return
    }

    // 更新最新价格
    const lastKline = klineData[klineData.length - 1]
    if (lastKline) {
      latestPrice.value = {
        price: lastKline.close,
        high_24h: Math.max(...klineData.slice(-24).map(k => k.high)),
        low_24h: Math.min(...klineData.slice(-24).map(k => k.low)),
        volume_24h: klineData.slice(-24).reduce((sum, k) => sum + k.volume, 0)
      }
      emit('price-update', latestPrice.value)
    }

    // 计算涨跌
    const firstPrice = klineData[0].close
    const lastPrice = klineData[klineData.length - 1].close
    priceChange.value = ((lastPrice - firstPrice) / firstPrice) * 100

    await nextTick()
    initChart()
    updateChartData()
  } catch (err) {
    console.error('Error loading kline data:', err)
    error.value = err.message || '加载K线数据失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

const changeTimeframe = (timeframe) => {
  selectedTimeframe.value = timeframe
  loadKlineData(timeframe)
}

const formatPrice = (price) => {
  if (!price) return '0.00'
  const num = parseFloat(price)
  if (num >= 1) return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 })
}

// 监听图表类型变化
watch(chartType, () => {
  if (klineData.length > 0) updateChartData()
})

// 监听容器大小变化
const handleResize = () => {
  if (chart && chartContainer.value) {
    chart.applyOptions({ width: chartContainer.value.clientWidth })
  }
}

onMounted(() => {
  loadKlineData(selectedTimeframe.value)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (chart) {
    chart.remove()
    chart = null
  }
})

watch(() => props.symbol, () => {
  if (chart) {
    chart.remove()
    chart = null
    mainSeries = null
    volumeSeries = null
  }
  loadKlineData(selectedTimeframe.value)
})

// 监听 marketType 变化
watch(() => props.marketType, () => {
  if (chart) {
    chart.remove()
    chart = null
    mainSeries = null
    volumeSeries = null
  }
  loadKlineData(selectedTimeframe.value)
})

// 处理 WebSocket K线更新
const handleKlineUpdate = (data) => {
  // 检查是否是当前周期的数据
  if (data.interval !== timeframeMap[selectedTimeframe.value]) {
    return
  }

  if (!mainSeries || klineData.length === 0) return

  const newBar = {
    time: Math.floor(data.timestamp / 1000),
    open: data.open,
    high: data.high,
    low: data.low,
    close: data.close,
    volume: data.volume
  }

  // 更新或添加K线
  const lastBar = klineData[klineData.length - 1]
  if (lastBar && lastBar.time === newBar.time) {
    // 更新最后一根K线
    klineData[klineData.length - 1] = newBar
  } else if (data.is_closed) {
    // 添加新K线
    klineData.push(newBar)
  }

  // 更新图表
  if (chartType.value === 'candle') {
    mainSeries.update(newBar)
  } else {
    mainSeries.update({ time: newBar.time, value: newBar.close })
  }

  // 更新成交量
  if (volumeSeries) {
    volumeSeries.update({
      time: newBar.time,
      value: newBar.volume,
      color: newBar.close >= newBar.open ? '#26a69a' : '#ef5350'
    })
  }

  // 更新最新价格
  latestPrice.value = {
    price: newBar.close,
    high_24h: Math.max(...klineData.slice(-24).map(k => k.high)),
    low_24h: Math.min(...klineData.slice(-24).map(k => k.low)),
    volume_24h: klineData.slice(-24).reduce((sum, k) => sum + k.volume, 0)
  }
  emit('price-update', latestPrice.value)

  console.log(`📈 K线更新: ${data.symbol} ${data.interval} close=$${newBar.close}`)
}

// 暴露方法给父组件
defineExpose({
  loadKlineData: () => loadKlineData(selectedTimeframe.value),
  handleKlineUpdate
})
</script>

