<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <Header />

    <!-- Breadcrumb -->
    <div class="bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav class="flex items-center space-x-2 text-sm">
          <router-link to="/" class="text-gray-500 hover:text-gray-900 transition-colors">
            首页
          </router-link>
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
          <router-link to="/market" class="text-gray-500 hover:text-gray-900 transition-colors">
            市场
          </router-link>
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
          <span class="text-gray-900 font-medium">{{ route.params.symbol }}</span>
        </nav>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="animate-pulse space-y-6">
        <div class="h-32 bg-gray-200 rounded-xl"></div>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="h-32 bg-gray-200 rounded-xl"></div>
          <div class="h-32 bg-gray-200 rounded-xl"></div>
          <div class="h-32 bg-gray-200 rounded-xl"></div>
          <div class="h-32 bg-gray-200 rounded-xl"></div>
        </div>
        <div class="h-96 bg-gray-200 rounded-xl"></div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <svg class="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <h3 class="text-lg font-semibold text-red-900 mb-2">加载失败</h3>
        <p class="text-red-700 mb-4">{{ error }}</p>
        <button @click="loadData" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
          重试
        </button>
      </div>
    </div>

    <!-- Main Content - Two Column Layout -->
    <div v-else-if="tokenData" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">

      <!-- Token Header -->
      <TokenBasicInfo
        :token="tokenData.token"
        :is-in-watchlist="tokenData.is_in_watchlist"
        :is-favorite-processing="isFavoriteProcessing"
        :realtime-price="realtimePrice"
        :exchanges="tokenData.exchanges"
        @toggle-watchlist="toggleWatchlist"
        @trade="handleTrade"
      />

      <!-- Two Column Layout -->
      <div class="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">

        <!-- Left Column: Chart & Analysis (8/12) -->
        <div class="lg:col-span-8 space-y-6">

          <!-- Trading Chart -->
          <TradingChart
            :symbol="tokenData.token.symbol"
            :current-price="tokenData.token.current_price"
            :technical-signals="tokenData.market_analysis?.technical_signals"
            :market-condition="tokenData.market_analysis?.condition_label"
            @price-update="realtimePrice = $event"
          />

          <!-- Technical Indicators -->
          <TechnicalAnalysisTabs
            :technical-indicator="tokenData.technical_indicator"
            :technical-signals="tokenData.market_analysis?.technical_signals"
            :exchanges="tokenData.exchanges"
            :token="tokenData.token"
          />

          <!-- On-Chain Indicators -->
          <div class="bg-white rounded-xl overflow-hidden border border-gray-200">
            <div class="border-b border-gray-100 px-6 py-4">
              <h2 class="text-lg font-semibold text-gray-900 flex items-center">
                <svg class="w-5 h-5 mr-2 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                </svg>
                链上数据
              </h2>
            </div>
            <div class="p-6">
              <OnChainIndicators :indicators="tokenData.technical_indicator" />
            </div>
          </div>

          <!-- Strategy Feed -->
          <div class="bg-white rounded-xl overflow-hidden border border-gray-200">
            <div class="border-b border-gray-100 px-6 py-4">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold text-gray-900 flex items-center">
                  <svg class="w-5 h-5 mr-2 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  策略单
                </h2>
                <span class="text-xs text-gray-500">用户共享策略</span>
              </div>
            </div>
            <div class="p-6">
              <AIStrategiesGrid
                :strategies="tokenData.recommended_strategies"
                :market-condition="tokenData.market_analysis?.condition_label"
              />
            </div>
          </div>

        </div>

        <!-- Right Column: Bot Panel (4/12) -->
        <div class="lg:col-span-4">
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
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { apiRequest, API_BASE_URL } from '../../utils/api.js'
import { showFavoriteSuccess, showUnfavoriteSuccess, showError, showSuccess, showInfo } from '../../utils/notification.js'

// Import common components
import Header from '../common/Header.vue'

// Import child components
import TokenBasicInfo from './detail/TokenBasicInfo.vue'
import TradingChart from './detail/TradingChart.vue'
import TechnicalAnalysisTabs from './detail/TechnicalAnalysisTabs.vue'
import OnChainIndicators from './detail/OnChainIndicators.vue'
import AIStrategiesGrid from './detail/AIStrategiesGrid.vue'
import BotTradingPanel from './detail/BotTradingPanel.vue'

const route = useRoute()

// State
const loading = ref(true)
const error = ref(null)
const tokenData = ref(null)

// 防止重复点击收藏
const isFavoriteProcessing = ref(false)
const lastFavoriteTime = ref(0)

// K线实时价格（用于更新基本信息显示）
const realtimePrice = ref(null)

// Load data
const loadData = async () => {
  loading.value = true
  error.value = null

  try {
    const symbol = route.params.symbol
    const response = await apiRequest(`${API_BASE_URL}/market/tokens/${symbol}/detail/`)

    if (response.status === 'success') {
      tokenData.value = response.data
    } else {
      throw new Error(response.message || '加载失败')
    }
  } catch (err) {
    console.error('Error loading token detail:', err)
    error.value = err.message || '加载代币详情失败'
  } finally {
    loading.value = false
  }
}

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
onMounted(() => {
  loadData()
})
</script>

<style scoped>
/* Add any custom styles here */
</style>

