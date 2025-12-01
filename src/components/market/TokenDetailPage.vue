<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <!-- Header -->
    <Header />

    <!-- Loading State -->
    <div v-if="loading" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8">
      <div class="animate-pulse space-y-4">
        <div class="h-24 bg-white/60 rounded-2xl"></div>
        <div class="grid grid-cols-5 gap-4">
          <div class="h-[100px] bg-white/60 rounded-2xl"></div>
          <div class="h-[100px] bg-white/60 rounded-2xl"></div>
          <div class="h-[100px] bg-white/60 rounded-2xl"></div>
          <div class="h-[100px] bg-white/60 rounded-2xl"></div>
          <div class="h-[100px] bg-white/60 rounded-2xl"></div>
        </div>
        <div class="h-[500px] bg-white/60 rounded-2xl"></div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8">
      <div class="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
        <svg class="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <h3 class="text-xl font-semibold text-red-900 mb-2">加载失败</h3>
        <p class="text-red-700 mb-6">{{ error }}</p>
        <button @click="loadData" class="px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium">
          重新加载
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else-if="tokenData" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8">

      <!-- ===== 顶部信息栏 ===== -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
        <div class="flex items-center justify-between">
          <!-- 左侧：代币信息 -->
          <div class="flex items-center gap-4">
            <!-- Logo -->
            <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center border border-gray-200 overflow-hidden">
              <img v-if="tokenData.token.logo" :src="tokenData.token.logo" :alt="tokenData.token.name" class="w-10 h-10 object-contain" />
              <span v-else class="text-xl font-bold text-gray-400">{{ tokenData.token.symbol.charAt(0) }}</span>
            </div>

            <!-- 名称和标签 -->
            <div>
              <div class="flex items-center gap-2 mb-1">
                <h1 class="text-2xl font-bold text-gray-900">{{ tokenData.token.symbol }}</h1>
                <span class="text-base text-gray-500">{{ tokenData.token.name }}</span>
                <span v-if="tokenData.token.market_cap_rank" class="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg">
                  #{{ tokenData.token.market_cap_rank }}
                </span>
              </div>
              <div class="flex items-center gap-2">
                <span v-if="tokenData.token.category" class="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-medium rounded-lg">
                  {{ getCategoryLabel(tokenData.token.category) }}
                </span>
                <span v-if="tokenData.token.is_spot_available" class="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-xs font-medium rounded-lg">
                  现货
                </span>
                <span v-if="tokenData.token.is_futures_available" class="px-2 py-0.5 bg-purple-50 text-purple-600 text-xs font-medium rounded-lg">
                  合约
                </span>
              </div>
            </div>
          </div>

          <!-- 中间：价格 -->
          <div class="flex items-center gap-6">
            <div class="text-right">
              <div class="text-3xl font-bold text-gray-900 tracking-tight">
                ${{ formatPrice(displayPrice) }}
              </div>
              <div class="flex items-center justify-end gap-2 mt-1">
                <span
                  :class="displayChange24h >= 0 ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'"
                  class="px-2 py-0.5 rounded-lg text-sm font-semibold flex items-center gap-1"
                >
                  <svg v-if="displayChange24h >= 0" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
                  </svg>
                  <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
                  </svg>
                  {{ displayChange24h >= 0 ? '+' : '' }}{{ formatPercent(displayChange24h) }}%
                </span>
                <span class="text-xs text-gray-400">24h</span>
              </div>
            </div>
          </div>

          <!-- 右侧：操作按钮 -->
          <div class="flex items-center gap-3">
            <!-- 收藏按钮 -->
            <button
              @click="toggleWatchlist"
              :disabled="isFavoriteProcessing"
              :class="tokenData.is_in_watchlist ? 'text-yellow-500 bg-yellow-50 border-yellow-200' : 'text-gray-400 bg-gray-50 border-gray-200'"
              class="w-10 h-10 flex items-center justify-center border rounded-xl hover:scale-105 transition-all disabled:opacity-50"
            >
              <svg v-if="isFavoriteProcessing" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              <svg v-else class="w-5 h-5" :fill="tokenData.is_in_watchlist ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
              </svg>
            </button>
            <!-- 交易按钮 -->
            <button
              @click="handleTrade"
              class="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
              </svg>
              交易
            </button>
          </div>
        </div>
      </div>

      <!-- ===== 市场类型 Tab ===== -->
      <div class="flex items-center gap-2 mb-4">
        <button
          v-for="tab in marketTabs"
          :key="tab.key"
          @click="activeMarketTab = tab.key"
          :disabled="!tab.available"
          :class="[
            'px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2',
            activeMarketTab === tab.key
              ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
              : tab.available
                ? 'text-gray-600 hover:bg-white/50'
                : 'text-gray-400 cursor-not-allowed'
          ]"
        >
          <component :is="tab.icon" class="w-4 h-4" />
          {{ tab.label }}
        </button>
      </div>

      <!-- ===== 数据统计卡片 ===== -->
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4">
        <!-- 现货数据卡片 -->
        <template v-if="activeMarketTab === 'spot'">
          <StatCard label="24h 成交额" :value="formatLargeNumber(tokenData.token.total_volume)" prefix="$" icon="volume" />
          <StatCard label="24h 最高" :value="formatPrice(tokenData.token.high_24h)" prefix="$" icon="high" color="green" />
          <StatCard label="24h 最低" :value="formatPrice(tokenData.token.low_24h)" prefix="$" icon="low" color="red" />
          <StatCard label="市值" :value="formatLargeNumber(tokenData.token.market_cap)" prefix="$" icon="market" />
          <StatCard label="流通量" :value="formatLargeNumber(tokenData.token.circulating_supply)" :suffix="tokenData.token.symbol" icon="supply" />
        </template>

        <!-- 合约数据卡片 -->
        <template v-else>
          <StatCard
            label="资金费率"
            :value="formatFundingRate(futuresData.avgFundingRate)"
            suffix="%"
            icon="funding"
            :color="futuresData.avgFundingRate > 0 ? 'red' : futuresData.avgFundingRate < 0 ? 'green' : 'gray'"
          />
          <StatCard label="未平仓量" :value="formatLargeNumber(futuresData.totalOpenInterest)" prefix="$" icon="openInterest" />
          <StatCard
            label="多空比"
            :value="formatNumber(futuresData.avgLongShortRatio, 2)"
            icon="ratio"
            :color="futuresData.avgLongShortRatio > 1 ? 'green' : 'red'"
          />
          <StatCard label="24h 成交额" :value="formatLargeNumber(tokenData.token.total_volume)" prefix="$" icon="volume" />
          <StatCard label="最大杠杆" :value="futuresData.maxLeverage" suffix="x" icon="leverage" />
        </template>
      </div>

      <!-- ===== 主体内容：图表 + 侧边栏 ===== -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <!-- 左侧：K线图表 + 技术指标 (8/12) -->
        <div class="lg:col-span-8 space-y-4">
          <!-- K线图表 -->
          <TradingChart
            ref="tradingChartRef"
            :symbol="tokenData.token.symbol"
            :current-price="tokenData.token.current_price"
            :market-type="activeMarketTab"
            :technical-signals="tokenData.market_analysis?.technical_signals"
            :market-condition="tokenData.market_analysis?.condition_label"
            @price-update="handlePriceUpdate"
          />

          <!-- 技术指标面板 -->
          <TechnicalAnalysisTabs
            :technical-indicator="tokenData.technical_indicator"
            :technical-signals="tokenData.market_analysis?.technical_signals"
            :exchanges="tokenData.exchanges"
            :token="tokenData.token"
          />
        </div>

        <!-- 右侧：数据面板 (4/12) -->
        <div class="lg:col-span-4 space-y-4">
          <!-- 合约数据面板 -->
          <FuturesDataPanel
            v-if="activeMarketTab === 'futures'"
            :exchanges="futuresExchanges"
            :token="tokenData.token"
          />

          <!-- 现货数据面板 -->
          <SpotDataPanel
            v-else
            :exchanges="spotExchanges"
            :token="tokenData.token"
          />

          <!-- 代币信息面板 -->
          <TokenInfoPanel :token="tokenData.token" />

          <!-- 机器人面板 -->
          <BotTradingPanel
            :token="tokenData.token"
            :exchanges="tokenData.exchanges"
            :strategies="tokenData.recommended_strategies"
            :market-condition="tokenData.market_analysis?.condition_label"
            :technical-signals="tokenData.market_analysis?.technical_signals"
            @create-bot="handleCreateBot"
            @start-bot="handleStartBot"
            @stop-bot="handleStopBot"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, h } from 'vue'
import { useRoute } from 'vue-router'
import { apiRequest, API_ENDPOINTS, API_BASE_URL } from '../../utils/api.js'
import { showFavoriteSuccess, showUnfavoriteSuccess, showError, showSuccess, showInfo } from '../../utils/notification.js'
import { useWebSocket } from '../../utils/websocket.js'

// Import common components
import Header from '../common/Header.vue'

// Import child components
import TradingChart from './detail/TradingChart.vue'
import TechnicalAnalysisTabs from './detail/TechnicalAnalysisTabs.vue'
import BotTradingPanel from './detail/BotTradingPanel.vue'
import StatCard from './detail/StatCard.vue'
import FuturesDataPanel from './detail/FuturesDataPanel.vue'
import SpotDataPanel from './detail/SpotDataPanel.vue'
import TokenInfoPanel from './detail/TokenInfoPanel.vue'

const route = useRoute()

// State
const loading = ref(true)
const error = ref(null)
const tokenData = ref(null)

// 市场类型 Tab
const activeMarketTab = ref('spot')

// 市场 Tab 配置
const marketTabs = computed(() => [
  {
    key: 'spot',
    label: '现货',
    available: tokenData.value?.token?.is_spot_available ?? false,
    icon: {
      render() {
        return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
          h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' })
        ])
      }
    }
  },
  {
    key: 'futures',
    label: '合约',
    available: tokenData.value?.token?.is_futures_available ?? false,
    icon: {
      render() {
        return h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
          h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' })
        ])
      }
    }
  }
])

// 现货交易所数据
const spotExchanges = computed(() => {
  if (!tokenData.value?.exchanges) return []
  return tokenData.value.exchanges.filter(e => !e.is_futures)
})

// 合约交易所数据
const futuresExchanges = computed(() => {
  if (!tokenData.value?.exchanges) return []
  return tokenData.value.exchanges.filter(e => e.is_futures)
})

// 合约汇总数据
const futuresData = computed(() => {
  const exchanges = futuresExchanges.value
  if (!exchanges.length) {
    return {
      avgFundingRate: 0,
      totalOpenInterest: 0,
      avgLongShortRatio: 1,
      maxLeverage: 0
    }
  }

  const fundingRates = exchanges.filter(e => e.funding_rate).map(e => parseFloat(e.funding_rate))
  const openInterests = exchanges.filter(e => e.open_interest).map(e => parseFloat(e.open_interest))
  const longShortRatios = exchanges.filter(e => e.long_short_ratio).map(e => parseFloat(e.long_short_ratio))
  const leverages = exchanges.filter(e => e.contract_spec?.max_leverage).map(e => e.contract_spec.max_leverage)

  return {
    avgFundingRate: fundingRates.length ? fundingRates.reduce((a, b) => a + b, 0) / fundingRates.length : 0,
    totalOpenInterest: openInterests.reduce((a, b) => a + b, 0),
    avgLongShortRatio: longShortRatios.length ? longShortRatios.reduce((a, b) => a + b, 0) / longShortRatios.length : 1,
    maxLeverage: leverages.length ? Math.max(...leverages) : 125
  }
})

// 防止重复点击收藏
const isFavoriteProcessing = ref(false)
const lastFavoriteTime = ref(0)

// K线实时价格
const realtimePrice = ref({
  price: null,
  change_24h: null,
  volume_24h: null,
  high_24h: null,
  low_24h: null
})

// 计算显示价格
const displayPrice = computed(() => {
  return realtimePrice.value.price ?? tokenData.value?.token?.current_price ?? 0
})

const displayChange24h = computed(() => {
  return realtimePrice.value.change_24h ?? tokenData.value?.token?.price_change_percentage_24h ?? 0
})

// WebSocket 实时数据
const wsConnected = ref(false)
const lastUpdateTime = ref(null)

// TradingChart 组件引用
const tradingChartRef = ref(null)

// WebSocket 实例
let ws = null

// ===== 辅助函数 =====
const formatPrice = (price) => {
  if (!price && price !== 0) return '-'
  const num = parseFloat(price)
  if (num >= 1000) return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  if (num >= 1) return num.toFixed(2)
  if (num >= 0.01) return num.toFixed(4)
  return num.toFixed(6)
}

const formatPercent = (value) => {
  if (!value && value !== 0) return '-'
  return Math.abs(parseFloat(value)).toFixed(2)
}

const formatLargeNumber = (num) => {
  if (!num && num !== 0) return '-'
  const n = parseFloat(num)
  if (n >= 1e12) return (n / 1e12).toFixed(2) + 'T'
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B'
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M'
  if (n >= 1e3) return (n / 1e3).toFixed(2) + 'K'
  return n.toFixed(2)
}

const formatNumber = (num, decimals = 2) => {
  if (!num && num !== 0) return '-'
  return parseFloat(num).toFixed(decimals)
}

const formatFundingRate = (rate) => {
  if (!rate && rate !== 0) return '-'
  return (parseFloat(rate) * 100).toFixed(4)
}

const getCategoryLabel = (category) => {
  const labels = {
    'layer1': 'Layer 1',
    'layer2': 'Layer 2',
    'defi': 'DeFi',
    'meme': 'Meme',
    'ai': 'AI',
    'gaming': 'Gaming',
    'nft': 'NFT',
    'infrastructure': '基础设施',
    'exchange': '交易所',
    'stablecoin': '稳定币'
  }
  return labels[category] || category
}

// 处理价格更新
const handlePriceUpdate = (priceData) => {
  if (priceData.price) realtimePrice.value.price = priceData.price
  if (priceData.change_24h !== undefined) realtimePrice.value.change_24h = priceData.change_24h
  if (priceData.volume_24h !== undefined) realtimePrice.value.volume_24h = priceData.volume_24h
  if (priceData.high_24h !== undefined) realtimePrice.value.high_24h = priceData.high_24h
  if (priceData.low_24h !== undefined) realtimePrice.value.low_24h = priceData.low_24h
}

// Load data
const loadData = async () => {
  loading.value = true
  error.value = null
  // 重置实时价格
  realtimePrice.value = {
    price: null,
    change_24h: null,
    volume_24h: null,
    high_24h: null,
    low_24h: null
  }

  try {
    const symbol = route.params.symbol
    console.log('🔍 加载代币详情:', symbol)
    const response = await apiRequest(API_ENDPOINTS.MARKET_TOKEN_DETAIL(symbol))

    if (response.status === 'success') {
      tokenData.value = response.data
      console.log('✅ 代币详情加载成功:', tokenData.value.token.symbol)
    } else {
      throw new Error(response.message || '加载失败')
    }
  } catch (err) {
    console.error('❌ Error loading token detail:', err)
    error.value = err.message || '加载代币详情失败'
  } finally {
    loading.value = false
  }
}

// WebSocket 消息处理
const handleWebSocketMessage = (data) => {
  console.log('📡 收到 WebSocket 数据:', data)

  if (data.type === 'token_info') {
    // 初始代币信息
    console.log('📊 代币信息:', data.data)
  } else if (data.type === 'market_update') {
    // 市场数据更新（包含价格、涨跌幅、成交量等）
    const marketData = data.data

    // 更新实时价格对象
    realtimePrice.value.price = marketData.price
    realtimePrice.value.change_24h = marketData.change_24h
    realtimePrice.value.volume_24h = marketData.volume_24h
    realtimePrice.value.high_24h = marketData.high_24h
    realtimePrice.value.low_24h = marketData.low_24h

    lastUpdateTime.value = new Date()

    // 更新代币数据（注意：要更新 tokenData.value.token，而不是 tokenData.value）
    if (tokenData.value && tokenData.value.token) {
      tokenData.value.token.current_price = marketData.price

      // 更新 24h 涨跌幅
      if (marketData.change_24h !== undefined) {
        tokenData.value.token.price_change_percentage_24h = marketData.change_24h
      }

      // 更新 24h 成交量
      if (marketData.volume_24h !== undefined) {
        tokenData.value.token.total_volume = marketData.volume_24h
      }

      // 更新 24h 最高价
      if (marketData.high_24h !== undefined) {
        tokenData.value.token.high_24h = marketData.high_24h
      }

      // 更新 24h 最低价
      if (marketData.low_24h !== undefined) {
        tokenData.value.token.low_24h = marketData.low_24h
      }
    }

    console.log(`💰 市场更新: ${marketData.symbol} = $${marketData.price} (${marketData.change_24h >= 0 ? '+' : ''}${marketData.change_24h}%)`)
  } else if (data.type === 'price_update') {
    // 兼容旧的价格更新消息
    const priceData = data.data
    realtimePrice.value.price = priceData.price
    lastUpdateTime.value = new Date()

    if (tokenData.value && tokenData.value.token) {
      tokenData.value.token.current_price = priceData.price
    }

    console.log(`💰 价格更新: ${priceData.symbol} = $${priceData.price}`)
  } else if (data.type === 'kline_update') {
    // K线数据更新（转发给 TradingChart 组件）
    console.log('📈 K线更新:', data.data)
    if (tradingChartRef.value && tradingChartRef.value.handleKlineUpdate) {
      tradingChartRef.value.handleKlineUpdate(data.data)
    }
  } else if (data.type === 'pong') {
    // 心跳响应
    wsConnected.value = true
  }
}

// 初始化 WebSocket
let wsDisconnect = null

const initWebSocket = () => {
  if (!tokenData.value) return

  const symbol = tokenData.value.token.symbol
  console.log(`🔌 初始化 WebSocket: ${symbol}`)

  const { connect, disconnect, getConnection } = useWebSocket(symbol, handleWebSocketMessage)
  connect()
  wsDisconnect = disconnect
  ws = getConnection(symbol)
  wsConnected.value = true
}

// 断开 WebSocket
const closeWebSocket = () => {
  if (wsDisconnect) {
    console.log('🔌 断开 WebSocket')
    wsDisconnect()
    wsDisconnect = null
    ws = null
    wsConnected.value = false
  }
}

// 监听路由参数变化，重新加载数据
watch(() => route.params.symbol, (newSymbol, oldSymbol) => {
  if (newSymbol && newSymbol !== oldSymbol) {
    console.log('🔄 路由参数变化，重新加载:', oldSymbol, '->', newSymbol)

    // 断开旧的 WebSocket
    closeWebSocket()

    // 加载新数据
    loadData()
  }
})

// Toggle watchlist
const toggleWatchlist = async () => {
  if (!tokenData.value) return

  // 防止重复点击
  if (isFavoriteProcessing.value) {
    return
  }

  // 检查冷却期（防止快速连续点击）
  const cooldownPeriod = 1000 // 1秒冷却期
  const now = Date.now()
  if (now - lastFavoriteTime.value < cooldownPeriod) {
    return
  }

  try {
    const token = tokenData.value.token

    // 标记为处理中
    isFavoriteProcessing.value = true

    // 使用后端的 toggle_favorite 接口
    const response = await apiRequest(`${API_BASE_URL}/market/tokens/${token.symbol}/toggle_favorite/`, {
      method: 'POST'
    })

    if (response.status === 'success') {
      tokenData.value.is_in_watchlist = response.is_favorited

      // 使用全局通知组件
      if (response.is_favorited) {
        showFavoriteSuccess(token.symbol)
      } else {
        showUnfavoriteSuccess(token.symbol)
      }
    } else {
      throw new Error(response.message || '操作失败')
    }
  } catch (err) {
    console.error('Error toggling watchlist:', err)
    showError(err.message || '操作失败')
  } finally {
    // 移除处理中标记
    isFavoriteProcessing.value = false

    // 记录最后操作时间
    lastFavoriteTime.value = Date.now()
  }
}

// Handle trade
const handleTrade = (exchange = 'binance') => {
  if (!tokenData.value) return
  
  const symbol = tokenData.value.token.symbol
  
  // Generate trade link based on exchange
  let tradeUrl = ''
  
  switch (exchange.toLowerCase()) {
    case 'binance':
      tradeUrl = `https://www.binance.com/zh-CN/futures/${symbol}USDT`
      break
    case 'okx':
      tradeUrl = `https://www.okx.com/trade-swap/${symbol.toLowerCase()}-usdt-swap`
      break
    case 'bybit':
      tradeUrl = `https://www.bybit.com/trade/usdt/${symbol}USDT`
      break
    case 'gate':
      tradeUrl = `https://www.gate.io/futures_trade/USDT/${symbol}_USDT`
      break
    default:
      tradeUrl = `https://www.binance.com/zh-CN/futures/${symbol}USDT`
  }
  
  window.open(tradeUrl, '_blank')
}

// Handle create bot
const handleCreateBot = (botConfig) => {
  console.log('Creating bot:', botConfig)
  showSuccess('Bot 创建成功', 'Bot 创建')
}

// Handle start bot
const handleStartBot = (botId) => {
  console.log('Starting bot:', botId)
  showSuccess('Bot 已启动', 'Bot 启动')
}

// Handle stop bot
const handleStopBot = (botId) => {
  console.log('Stopping bot:', botId)
  showInfo('Bot 已停止', 'Bot 停止')

  // For now, just open trade with recommended parameters
  handleTrade()
}

// Lifecycle
onMounted(async () => {
  await loadData()

  // 数据加载完成后，初始化 WebSocket
  if (tokenData.value) {
    initWebSocket()
  }
})

onUnmounted(() => {
  // 组件卸载时断开 WebSocket
  closeWebSocket()
})
</script>

<style scoped>
/* Add any custom styles here */
</style>

