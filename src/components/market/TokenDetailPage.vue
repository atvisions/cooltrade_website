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
          />

          <!-- Technical Analysis Tabs -->
          <TechnicalAnalysisTabs
            :technical-indicator="tokenData.technical_indicator"
            :technical-signals="tokenData.market_analysis?.technical_signals"
            :exchanges="tokenData.exchanges"
            :token="tokenData.token"
            :strategies="tokenData.recommended_strategies"
            :market-condition="tokenData.market_analysis?.condition_label"
          />

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

// Import common components
import Header from '../common/Header.vue'

// Import child components
import TokenBasicInfo from './detail/TokenBasicInfo.vue'
import TradingChart from './detail/TradingChart.vue'
import TechnicalAnalysisTabs from './detail/TechnicalAnalysisTabs.vue'
import BotTradingPanel from './detail/BotTradingPanel.vue'

const route = useRoute()

// Simple toast notification function (replace with your preferred notification library)
const showToast = (message, type = 'success') => {
  // For now, use console.log. You can replace this with your notification system
  console.log(`[${type.toUpperCase()}] ${message}`)
  // TODO: Integrate with your notification system
}

// State
const loading = ref(true)
const error = ref(null)
const tokenData = ref(null)

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

  try {
    const token = tokenData.value.token

    if (tokenData.value.is_in_watchlist) {
      // Remove from watchlist
      await apiRequest(`${API_BASE_URL}/market/watchlist/${token.symbol}/`, {
        method: 'DELETE'
      })
      tokenData.value.is_in_watchlist = false
      showToast('已从关注列表移除', 'success')
    } else {
      // Add to watchlist
      await apiRequest(`${API_BASE_URL}/market/watchlist/`, {
        method: 'POST',
        body: JSON.stringify({ symbol: token.symbol })
      })
      tokenData.value.is_in_watchlist = true
      showToast('已添加到关注列表', 'success')
    }
  } catch (err) {
    console.error('Error toggling watchlist:', err)
    showToast(err.message || '操作失败', 'error')
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
  showToast('Bot created successfully', 'success')
}

// Handle start bot
const handleStartBot = (botId) => {
  console.log('Starting bot:', botId)
  showToast('Bot started', 'success')
}

// Handle stop bot
const handleStopBot = (botId) => {
  console.log('Stopping bot:', botId)
  showToast('Bot stopped', 'info')

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

