<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <!-- Header -->
    <Header />

    <!-- Page Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">加密货币市场</h1>
        <p class="text-gray-600">实时合约市场数据和价格走势</p>
      </div>
    </div>

    <!-- Market Overview Stats -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Market Cap -->
        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-gray-600">Market Cap</span>
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="text-2xl font-bold text-gray-900">${{ formatNumber(marketStats.marketCap) }}</div>
          <div class="flex items-center mt-2">
            <span :class="marketStats.marketCapChange >= 0 ? 'text-green-600' : 'text-red-600'" class="text-sm font-medium">
              {{ marketStats.marketCapChange >= 0 ? '+' : '' }}{{ marketStats.marketCapChange }}%
            </span>
          </div>
        </div>

        <!-- 24h Volume -->
        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-gray-600">24h Volume</span>
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="text-2xl font-bold text-gray-900">${{ formatNumber(marketStats.volume24h) }}</div>
          <div class="flex items-center mt-2">
            <span :class="marketStats.volumeChange >= 0 ? 'text-green-600' : 'text-red-600'" class="text-sm font-medium">
              {{ marketStats.volumeChange >= 0 ? '+' : '' }}{{ marketStats.volumeChange }}%
            </span>
          </div>
        </div>

        <!-- BTC Dominance -->
        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-gray-600">BTC Dominance</span>
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="text-2xl font-bold text-gray-900">{{ marketStats.btcDominance }}%</div>
          <div class="flex items-center mt-2">
            <span class="text-sm text-gray-500">ETH: {{ marketStats.ethDominance }}%</span>
          </div>
        </div>

        <!-- Fear & Greed Index -->
        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-gray-600">Fear & Greed</span>
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="text-2xl font-bold text-gray-900">{{ marketStats.fearGreedIndex }}</div>
          <div class="flex items-center mt-2">
            <span :class="getFearGreedColor(marketStats.fearGreedIndex)" class="text-sm font-medium">
              {{ getFearGreedLabel(marketStats.fearGreedIndex) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <!-- Filters and Search -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <!-- Search -->
          <div class="relative flex-1 max-w-md">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索代币名称或符号..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>

          <!-- Filters -->
          <div class="flex items-center gap-3">
            <!-- Exchange Filter -->
            <select
              v-model="selectedExchange"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">所有交易所</option>
              <option value="binance">Binance</option>
              <option value="okx">OKX</option>
              <option value="bybit">Bybit</option>
              <option value="gate">Gate.io</option>
            </select>

            <!-- Category Filter -->
            <select
              v-model="selectedCategory"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">所有类型</option>
              <option value="layer1">Layer 1</option>
              <option value="defi">DeFi</option>
              <option value="nft">NFT</option>
              <option value="meme">Meme</option>
              <option value="ai">AI</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600">加载中...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <div class="text-6xl mb-4">⚠️</div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">加载失败</h3>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <button
          @click="loadTokensList"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          重试
        </button>
      </div>

      <!-- Tokens Table -->
      <div v-else class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100" @click="sortBy('rank')">
                  <div class="flex items-center gap-1">
                    #
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
                    </svg>
                  </div>
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">名称</th>
                <th class="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100" @click="sortBy('price')">
                  <div class="flex items-center justify-end gap-1">
                    价格
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
                    </svg>
                  </div>
                </th>
                <th class="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100" @click="sortBy('change24h')">
                  <div class="flex items-center justify-end gap-1">
                    24h %
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
                    </svg>
                  </div>
                </th>
                <th class="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100" @click="sortBy('change7d')">
                  <div class="flex items-center justify-end gap-1">
                    7d %
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
                    </svg>
                  </div>
                </th>
                <th class="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100" @click="sortBy('marketCap')">
                  <div class="flex items-center justify-end gap-1">
                    市值
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
                    </svg>
                  </div>
                </th>
                <th class="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100" @click="sortBy('volume24h')">
                  <div class="flex items-center justify-end gap-1">
                    24h 交易量
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
                    </svg>
                  </div>
                </th>
                <th class="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">7天走势</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="token in filteredTokens" :key="token.id" class="hover:bg-gray-50 transition-colors cursor-pointer">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  {{ token.rank }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                      {{ token.symbol.substring(0, 2) }}
                    </div>
                    <div>
                      <div class="text-sm font-semibold text-gray-900">{{ token.name }}</div>
                      <div class="text-xs text-gray-500">{{ token.symbol }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                  ${{ formatPrice(token.price) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold" :class="token.change24h >= 0 ? 'text-green-600' : 'text-red-600'">
                  {{ token.change24h >= 0 ? '+' : '' }}{{ token.change24h.toFixed(2) }}%
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold" :class="token.change7d >= 0 ? 'text-green-600' : 'text-red-600'">
                  {{ token.change7d >= 0 ? '+' : '' }}{{ token.change7d.toFixed(2) }}%
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                  ${{ formatNumber(token.marketCap) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                  ${{ formatNumber(token.volume24h) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <div class="w-24 h-12 ml-auto">
                    <svg viewBox="0 0 100 50" class="w-full h-full">
                      <polyline
                        :points="generateSparkline(token.priceHistory)"
                        fill="none"
                        :stroke="token.change7d >= 0 ? '#10b981' : '#ef4444'"
                        stroke-width="2"
                      />
                    </svg>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="filteredTokens.length === 0" class="text-center py-16">
          <div class="text-6xl mb-4">🔍</div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">暂无结果</h3>
          <p class="text-gray-600">尝试调整搜索条件或筛选器</p>
        </div>

        <!-- Pagination -->
        <div v-if="filteredTokens.length > 0" class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div class="text-sm text-gray-600">
            显示 {{ (currentPage - 1) * pageSize + 1 }} - {{ Math.min(currentPage * pageSize, filteredTokens.length) }} 条，共 {{ filteredTokens.length }} 条
          </div>
          <div class="flex items-center gap-2">
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              上一页
            </button>
            <button
              @click="currentPage++"
              :disabled="currentPage * pageSize >= filteredTokens.length"
              class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              下一页
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import Header from '../common/Header.vue'
// import { marketAPI } from '../../utils/api.js' // 暂时注释，等待后端市场应用创建

// 响应式数据
const searchQuery = ref('')
const selectedExchange = ref('all')
const selectedCategory = ref('all')
const currentPage = ref(1)
const pageSize = ref(50)
const sortField = ref('rank')
const sortDirection = ref('asc')
const loading = ref(false)
const error = ref(null)

// 市场统计数据
const marketStats = ref({
  marketCap: 3927000000000,
  marketCapChange: 1.79,
  volume24h: 249200000000,
  volumeChange: 18.3,
  btcDominance: 47.53,
  ethDominance: 18.2,
  fearGreedIndex: 43
})

// 模拟代币数据
const tokens = ref([
  { id: 1, rank: 1, name: '比特币', symbol: 'BTC', price: 114501.31, change24h: -0.22, change7d: 2.07, marketCap: 65072288300000, volume24h: 38346606338000, priceHistory: [45, 48, 46, 50, 52, 49, 51, 53, 50, 52], exchanges: ['binance', 'okx', 'bybit'], category: 'layer1' },
  { id: 2, rank: 2, name: '以太坊', symbol: 'ETH', price: 4302.27, change24h: -0.55, change7d: 0.82, marketCap: 507721700550000, volume24h: 38351606338000, priceHistory: [42, 44, 43, 45, 46, 44, 45, 47, 45, 46], exchanges: ['binance', 'okx', 'bybit'], category: 'layer1' },
  { id: 3, rank: 3, name: 'Tether', symbol: 'USDT', price: 100.00, change24h: 0.02, change7d: -0.02, marketCap: 174688200000, volume24h: 182888054670000, priceHistory: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50], exchanges: ['binance', 'okx', 'bybit', 'gate'], category: 'defi' },
  { id: 4, rank: 4, name: 'XRP', symbol: 'XRP', price: 2.48, change24h: -0.25, change7d: 1.76, marketCap: 172688222790000, volume24h: 5235607847000, priceHistory: [40, 42, 41, 43, 45, 44, 46, 48, 46, 47], exchanges: ['binance', 'okx'], category: 'layer1' },
  { id: 5, rank: 5, name: 'BNB', symbol: 'BNB', price: 1025.24, change24h: -0.32, change7d: 4.20, marketCap: 142699774823000, volume24h: 3314823401000, priceHistory: [38, 40, 39, 41, 43, 42, 44, 46, 44, 45], exchanges: ['binance'], category: 'layer1' },
  { id: 6, rank: 6, name: 'Solana', symbol: 'SOL', price: 210.72, change24h: -1.00, change7d: -2.98, marketCap: 114555647465000, volume24h: 7047882083000, priceHistory: [52, 50, 48, 46, 44, 42, 40, 38, 40, 42], exchanges: ['binance', 'okx', 'bybit'], category: 'layer1' },
  { id: 7, rank: 7, name: 'USD Coin', symbol: 'USDC', price: 0.9999, change24h: 0.03, change7d: -0.01, marketCap: 73526081140000, volume24h: 15988112301000, priceHistory: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50], exchanges: ['binance', 'okx', 'bybit', 'gate'], category: 'defi' },
  { id: 8, rank: 8, name: 'Cardano', symbol: 'ADA', price: 1.23, change24h: -0.45, change7d: 3.15, marketCap: 43526081140000, volume24h: 2988112301000, priceHistory: [35, 37, 36, 38, 40, 39, 41, 43, 41, 42], exchanges: ['binance', 'okx', 'bybit'], category: 'layer1' },
  { id: 9, rank: 9, name: 'Avalanche', symbol: 'AVAX', price: 45.67, change24h: -1.20, change7d: 5.80, marketCap: 18526081140000, volume24h: 1988112301000, priceHistory: [30, 32, 31, 33, 35, 34, 36, 38, 36, 37], exchanges: ['binance', 'okx', 'bybit'], category: 'layer1' },
  { id: 10, rank: 10, name: 'Dogecoin', symbol: 'DOGE', price: 0.42, change24h: 2.50, change7d: 8.90, marketCap: 62526081140000, volume24h: 4988112301000, priceHistory: [25, 28, 30, 32, 35, 38, 40, 42, 45, 48], exchanges: ['binance', 'okx', 'bybit', 'gate'], category: 'meme' },
  { id: 11, rank: 11, name: 'Polkadot', symbol: 'DOT', price: 8.92, change24h: -0.80, change7d: 2.40, marketCap: 12526081140000, volume24h: 988112301000, priceHistory: [40, 42, 41, 43, 44, 43, 44, 45, 44, 45], exchanges: ['binance', 'okx', 'bybit'], category: 'layer1' },
  { id: 12, rank: 12, name: 'Polygon', symbol: 'MATIC', price: 0.98, change24h: -1.50, change7d: -3.20, marketCap: 9526081140000, volume24h: 788112301000, priceHistory: [48, 46, 44, 42, 40, 38, 36, 34, 36, 38], exchanges: ['binance', 'okx', 'bybit'], category: 'layer1' },
  { id: 13, rank: 13, name: 'Chainlink', symbol: 'LINK', price: 18.45, change24h: 0.90, change7d: 6.50, marketCap: 11526081140000, volume24h: 1288112301000, priceHistory: [30, 32, 34, 36, 38, 40, 42, 44, 46, 48], exchanges: ['binance', 'okx', 'bybit'], category: 'defi' },
  { id: 14, rank: 14, name: 'Uniswap', symbol: 'UNI', price: 12.34, change24h: -0.60, change7d: 4.10, marketCap: 9326081140000, volume24h: 688112301000, priceHistory: [38, 40, 39, 41, 42, 41, 42, 43, 42, 43], exchanges: ['binance', 'okx', 'bybit'], category: 'defi' },
  { id: 15, rank: 15, name: 'Litecoin', symbol: 'LTC', price: 105.67, change24h: -0.35, change7d: 1.80, marketCap: 7926081140000, volume24h: 588112301000, priceHistory: [42, 43, 42, 43, 44, 43, 44, 45, 44, 45], exchanges: ['binance', 'okx', 'bybit'], category: 'layer1' },
])

// 计算属性 - 过滤后的代币
const filteredTokens = computed(() => {
  let result = tokens.value

  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(t =>
      t.name.toLowerCase().includes(query) ||
      t.symbol.toLowerCase().includes(query)
    )
  }

  // 交易所过滤
  if (selectedExchange.value !== 'all') {
    result = result.filter(t => t.exchanges.includes(selectedExchange.value))
  }

  // 类型过滤
  if (selectedCategory.value !== 'all') {
    result = result.filter(t => t.category === selectedCategory.value)
  }

  // 排序
  result = [...result].sort((a, b) => {
    const aVal = a[sortField.value]
    const bVal = b[sortField.value]

    if (sortDirection.value === 'asc') {
      return aVal > bVal ? 1 : -1
    } else {
      return aVal < bVal ? 1 : -1
    }
  })

  return result
})

// 方法
const formatNumber = (num) => {
  if (num >= 1e12) {
    return (num / 1e12).toFixed(2) + 'T'
  } else if (num >= 1e9) {
    return (num / 1e9).toFixed(2) + 'B'
  } else if (num >= 1e6) {
    return (num / 1e6).toFixed(2) + 'M'
  } else if (num >= 1e3) {
    return (num / 1e3).toFixed(2) + 'K'
  }
  return num.toFixed(2)
}

const formatPrice = (price) => {
  if (price >= 1) {
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  } else if (price >= 0.01) {
    return price.toFixed(4)
  } else {
    return price.toFixed(6)
  }
}

const sortBy = (field) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
}

const getFearGreedColor = (value) => {
  if (value <= 25) return 'text-red-600'
  if (value <= 45) return 'text-orange-600'
  if (value <= 55) return 'text-yellow-600'
  if (value <= 75) return 'text-green-600'
  return 'text-blue-600'
}

const getFearGreedLabel = (value) => {
  if (value <= 25) return 'Extreme Fear'
  if (value <= 45) return 'Fear'
  if (value <= 55) return 'Neutral'
  if (value <= 75) return 'Greed'
  return 'Extreme Greed'
}

const generateSparkline = (history) => {
  if (!history || history.length === 0) return '0,50'

  const width = 100
  const height = 50
  const max = Math.max(...history)
  const min = Math.min(...history)
  const range = max - min || 1

  const points = history.map((value, index) => {
    const x = (index / (history.length - 1)) * width
    const y = height - ((value - min) / range) * height
    return `${x},${y}`
  })
  return points.join(' ')
}

// TODO: 等待后端市场应用创建后，取消注释以下代码并集成真实API
// 加载市场概览数据
// const loadMarketOverview = async () => {
//   try {
//     const response = await marketAPI.getMarketOverview()
//     if (response.status === 'success') {
//       marketStats.value = response.data
//     }
//   } catch (err) {
//     console.error('加载市场概览数据失败:', err)
//   }
// }

// 加载代币列表
// const loadTokensList = async () => {
//   loading.value = true
//   error.value = null
//
//   try {
//     const params = {
//       page: currentPage.value,
//       per_page: pageSize.value,
//       exchange: selectedExchange.value,
//       category: selectedCategory.value,
//       sort_by: sortField.value === 'rank' ? 'market_cap' : sortField.value,
//       order: sortDirection.value,
//       search: searchQuery.value
//     }
//
//     const response = await marketAPI.getTokensList(params)
//     if (response.status === 'success') {
//       tokens.value = response.data.tokens
//     }
//   } catch (err) {
//     console.error('加载代币列表失败:', err)
//     error.value = '加载数据失败，请稍后重试'
//   } finally {
//     loading.value = false
//   }
// }

// 监听筛选条件变化
// watch([selectedExchange, selectedCategory, sortField, sortDirection], () => {
//   currentPage.value = 1
//   loadTokensList()
// })

// 监听搜索关键词变化（防抖）
// let searchTimeout = null
// watch(searchQuery, () => {
//   if (searchTimeout) clearTimeout(searchTimeout)
//   searchTimeout = setTimeout(() => {
//     currentPage.value = 1
//     loadTokensList()
//   }, 500)
// })

// 监听页码变化
// watch(currentPage, () => {
//   loadTokensList()
// })

// 组件挂载时加载数据
// onMounted(() => {
//   loadMarketOverview()
//   loadTokensList()
//
//   // 每30秒刷新一次市场概览数据
//   setInterval(loadMarketOverview, 30000)
// })
</script>

