<template>
  <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
    <div class="p-6">
      <div class="flex items-start justify-between">
        <!-- Left: Token Info -->
        <div class="flex items-start space-x-5 flex-1">
          <!-- Logo -->
          <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center flex-shrink-0 border border-gray-200">
            <img v-if="token.logo" :src="token.logo" :alt="token.name" class="w-16 h-16 rounded-xl" />
            <div v-else class="w-16 h-16 rounded-xl bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-2xl">
              {{ token.symbol.charAt(0) }}
            </div>
          </div>

          <!-- Info -->
          <div class="flex-1">
            <!-- Title Row -->
            <div class="flex items-center space-x-3 mb-2">
              <h1 class="text-3xl font-bold text-gray-900">{{ token.symbol }}</h1>
              <span class="text-lg text-gray-500">{{ token.name }}</span>
              <span
                class="px-2.5 py-1 rounded-lg text-xs font-semibold"
                :class="getRiskLevelBadgeClass(token.risk_level)"
              >
                {{ getRiskLevelLabel(token.risk_level) }}
              </span>
            </div>

            <!-- Meta Row -->
            <div class="flex items-center space-x-4 text-sm text-gray-600 mb-3">
              <span v-if="token.market_cap_rank" class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"/>
                </svg>
                Rank #{{ token.market_cap_rank }}
              </span>
              <span v-if="token.category" class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                </svg>
                {{ getCategoryLabel(token.category) }}
              </span>
            </div>

            <!-- Social Links & Contract -->
            <div class="flex items-center space-x-4 mb-4">
              <!-- Social Links -->
              <div class="flex items-center space-x-2">
                <a v-if="token.website" :href="token.website" target="_blank"
                   class="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                   title="Website">
                  <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
                  </svg>
                </a>
                <a v-if="token.twitter" :href="`https://twitter.com/${token.twitter}`" target="_blank"
                   class="w-8 h-8 rounded-lg bg-gray-100 hover:bg-blue-100 flex items-center justify-center transition-colors"
                   title="Twitter">
                  <svg class="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a v-if="token.telegram" :href="`https://t.me/${token.telegram}`" target="_blank"
                   class="w-8 h-8 rounded-lg bg-gray-100 hover:bg-blue-100 flex items-center justify-center transition-colors"
                   title="Telegram">
                  <svg class="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                  </svg>
                </a>
                <a v-if="token.discord" :href="token.discord" target="_blank"
                   class="w-8 h-8 rounded-lg bg-gray-100 hover:bg-indigo-100 flex items-center justify-center transition-colors"
                   title="Discord">
                  <svg class="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                </a>
              </div>

              <!-- Contract Address -->
              <div v-if="token.contract_address" class="flex items-center space-x-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <span class="text-xs font-mono text-gray-600">{{ formatAddress(token.contract_address) }}</span>
                <button @click="copyAddress" class="text-gray-400 hover:text-gray-600 transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                  </svg>
                </button>
              </div>
            </div>

          <!-- Price -->
          <div class="flex items-baseline space-x-4 mb-6">
            <span class="text-5xl font-bold text-gray-900 tracking-tight">
              ${{ formatPrice(displayPrice) }}
            </span>
            <div
              v-if="displayChange24h !== null && displayChange24h !== undefined"
              :class="getPriceChangeClass(displayChange24h)"
              class="flex items-center space-x-1 px-3 py-1.5 rounded-lg font-semibold"
              :style="getPriceChangeBgClass(displayChange24h)"
            >
              <svg v-if="parseFloat(displayChange24h) >= 0" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
              </svg>
              <span class="text-lg">{{ parseFloat(displayChange24h) > 0 ? '+' : '' }}{{ formatPercentage(displayChange24h) }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Actions -->
      <div class="flex items-start ml-6">
        <button
          @click="$emit('toggle-watchlist')"
          :class="isInWatchlist ? 'text-yellow-500 bg-yellow-50 border-yellow-200' : 'text-gray-400 bg-gray-50 border-gray-200'"
          class="flex items-center justify-center w-12 h-12 border-2 rounded-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          :title="isInWatchlist ? '取消收藏' : '收藏'"
          :disabled="isFavoriteProcessing"
        >
          <!-- Loading状态 -->
          <svg
            v-if="isFavoriteProcessing"
            class="w-6 h-6 text-gray-400 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <!-- 收藏图标 -->
          <svg v-else class="w-6 h-6" :fill="isInWatchlist ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
          </svg>
        </button>
      </div>
    </div>
  </div>

    <!-- Market Stats Grid -->
    <div class="border-t border-gray-100 bg-gray-50 px-6 py-4">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <!-- 24h Volume -->
        <div class="flex flex-col">
          <span class="text-xs text-gray-500 mb-1">24h Volume</span>
          <span class="text-base font-semibold text-gray-900">${{ formatLargeNumber(token.total_volume) }}</span>
        </div>

        <!-- Market Cap -->
        <div v-if="token.market_cap" class="flex flex-col">
          <span class="text-xs text-gray-500 mb-1">Market Cap</span>
          <span class="text-base font-semibold text-gray-900">${{ formatLargeNumber(token.market_cap) }}</span>
        </div>

        <!-- Funding Rate -->
        <div v-if="primaryExchange?.funding_rate" class="flex flex-col">
          <span class="text-xs text-gray-500 mb-1">Funding Rate</span>
          <span class="text-base font-semibold" :class="parseFloat(primaryExchange.funding_rate) >= 0 ? 'text-green-600' : 'text-red-600'">
            {{ formatFundingRate(primaryExchange.funding_rate) }}
          </span>
        </div>

        <!-- Open Interest -->
        <div v-if="totalOpenInterest > 0" class="flex flex-col">
          <span class="text-xs text-gray-500 mb-1">Open Interest</span>
          <span class="text-base font-semibold text-gray-900">${{ formatLargeNumber(totalOpenInterest) }}</span>
        </div>

        <!-- Max Leverage -->
        <div v-if="primaryExchange?.contract_spec" class="flex flex-col">
          <span class="text-xs text-gray-500 mb-1">Max Leverage</span>
          <span class="text-base font-semibold text-gray-900">{{ primaryExchange.contract_spec.max_leverage }}x</span>
        </div>

        <!-- Long/Short Ratio -->
        <div v-if="primaryExchange?.long_short_ratio" class="flex flex-col">
          <span class="text-xs text-gray-500 mb-1">Long/Short</span>
          <span class="text-base font-semibold text-gray-900">{{ formatRatio(primaryExchange.long_short_ratio) }}</span>
        </div>

        <!-- Maker Fee -->
        <div v-if="primaryExchange?.contract_spec" class="flex flex-col">
          <span class="text-xs text-gray-500 mb-1">Maker Fee</span>
          <span class="text-base font-semibold text-gray-900">{{ formatFeeRate(primaryExchange.contract_spec.maker_fee_rate) }}</span>
        </div>

        <!-- Taker Fee -->
        <div v-if="primaryExchange?.contract_spec" class="flex flex-col">
          <span class="text-xs text-gray-500 mb-1">Taker Fee</span>
          <span class="text-base font-semibold text-gray-900">{{ formatFeeRate(primaryExchange.contract_spec.taker_fee_rate) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'

const props = defineProps({
  token: {
    type: Object,
    required: true
  },
  isInWatchlist: {
    type: Boolean,
    default: false
  },
  isFavoriteProcessing: {
    type: Boolean,
    default: false
  },
  realtimePrice: {
    type: Object,
    default: null
  },
  exchanges: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['toggle-watchlist', 'trade'])

// 计算显示的价格和变化（优先使用实时价格）
const displayPrice = computed(() => {
  if (props.realtimePrice && props.realtimePrice.price) {
    return props.realtimePrice.price
  }
  return props.token.current_price
})

const displayChange24h = computed(() => {
  if (props.realtimePrice && props.realtimePrice.change_24h !== undefined) {
    return props.realtimePrice.change_24h
  }
  return props.token.price_change_24h
})

// 计算主要交易所数据
const primaryExchange = computed(() => {
  if (!props.exchanges || props.exchanges.length === 0) return null
  const binance = props.exchanges.find(e => e.exchange === 'binance')
  return binance || props.exchanges[0]
})

// 计算总持仓量
const totalOpenInterest = computed(() => {
  if (!props.exchanges || props.exchanges.length === 0) return 0
  return props.exchanges.reduce((sum, exchange) => {
    return sum + parseFloat(exchange.open_interest_value || 0)
  }, 0)
})

const formatPrice = (price) => {
  if (!price) return '0.00'
  const num = parseFloat(price)
  if (num >= 1) {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 })
}

const formatLargeNumber = (value) => {
  if (!value) return '0'
  const num = parseFloat(value)
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K'
  return num.toFixed(2)
}

const formatPercentage = (value) => {
  if (!value) return '0.00'
  return parseFloat(value).toFixed(2)
}

const getPriceChangeClass = (change) => {
  return parseFloat(change) >= 0 ? 'text-green-600' : 'text-red-600'
}

const getPriceChangeBgClass = (change) => {
  return parseFloat(change) >= 0
    ? 'background-color: rgba(34, 197, 94, 0.1);'
    : 'background-color: rgba(239, 68, 68, 0.1);'
}

const formatAddress = (address) => {
  if (!address) return ''
  if (address.length <= 13) return address
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

const copyAddress = () => {
  if (props.token.contract_address) {
    navigator.clipboard.writeText(props.token.contract_address)
    // You can add a toast notification here
  }
}

const getCategoryLabel = (category) => {
  const labels = {
    'layer-1': 'Layer 1',
    'defi': 'DeFi',
    'nft': 'NFT',
    'meme': 'Meme',
    'gaming': 'Gaming',
    'ai': 'AI',
  }
  return labels[category] || category
}

const getRiskLevelLabel = (level) => {
  const labels = {
    'very_low': 'Very Low',
    'low': 'Low',
    'medium': 'Medium',
    'high': 'High',
    'very_high': 'Very High',
    'extreme': 'Extreme',
  }
  return labels[level] || 'Unknown'
}

const getRiskLevelBadgeClass = (level) => {
  const classes = {
    'very_low': 'bg-green-100 text-green-700',
    'low': 'bg-green-100 text-green-700',
    'medium': 'bg-yellow-100 text-yellow-700',
    'high': 'bg-orange-100 text-orange-700',
    'very_high': 'bg-red-100 text-red-700',
    'extreme': 'bg-red-100 text-red-700',
  }
  return classes[level] || 'bg-gray-100 text-gray-700'
}

const formatFundingRate = (rate) => {
  if (!rate) return '-'
  return (parseFloat(rate) * 100).toFixed(4) + '%'
}

const formatRatio = (ratio) => {
  if (!ratio) return '-'
  return parseFloat(ratio).toFixed(2)
}

const formatFeeRate = (rate) => {
  if (!rate) return '-'
  return (parseFloat(rate) * 100).toFixed(3) + '%'
}
</script>

