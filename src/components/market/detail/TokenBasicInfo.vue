<template>
  <div class="bg-white rounded-2xl p-6 border border-gray-200">
    <div class="flex items-start justify-between">
      <!-- Left: Token Info -->
      <div class="flex items-start space-x-4 flex-1">
        <!-- Logo -->
        <div class="w-16 h-16 rounded-full bg-white flex items-center justify-center flex-shrink-0">
          <img v-if="token.logo" :src="token.logo" :alt="token.name" class="w-14 h-14 rounded-full" />
          <div v-else class="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-xl">
            {{ token.symbol.charAt(0) }}
          </div>
        </div>

        <!-- Info -->
        <div class="flex-1">
          <div class="flex items-center space-x-3 mb-2">
            <h1 class="text-2xl font-bold text-gray-900">{{ token.symbol }}</h1>
            <span class="text-lg text-gray-600">{{ token.name }}</span>
          </div>
          
          <div class="flex items-center space-x-3 text-sm text-gray-600 mb-4">
            <span v-if="token.market_cap_rank">Rank #{{ token.market_cap_rank }}</span>
            <span v-if="token.category">{{ getCategoryLabel(token.category) }}</span>
            <span 
              class="px-2 py-0.5 rounded text-xs font-medium"
              :class="getRiskLevelBadgeClass(token.risk_level)"
            >
              {{ getRiskLevelLabel(token.risk_level) }}
            </span>
          </div>

          <!-- Price -->
          <div class="flex items-baseline space-x-3 mb-3">
            <span class="text-4xl font-bold text-gray-900">
              ${{ formatPrice(token.current_price) }}
            </span>
            <span 
              v-if="token.price_change_percentage_24h"
              :class="getPriceChangeClass(token.price_change_percentage_24h)"
              class="text-xl font-semibold"
            >
              {{ parseFloat(token.price_change_percentage_24h) > 0 ? '+' : '' }}{{ formatPercentage(token.price_change_percentage_24h) }}%
            </span>
          </div>

          <!-- 24h Stats -->
          <div class="flex items-center space-x-8 text-sm">
            <div>
              <span class="text-gray-500">24h Volume</span>
              <span class="ml-2 text-gray-900 font-semibold">${{ formatLargeNumber(token.total_volume) }}</span>
            </div>
            <div v-if="token.market_cap">
              <span class="text-gray-500">Market Cap</span>
              <span class="ml-2 text-gray-900 font-semibold">${{ formatLargeNumber(token.market_cap) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Actions -->
      <div class="flex items-center ml-6">
        <button
          @click="$emit('toggle-watchlist')"
          :class="isInWatchlist ? 'text-yellow-500 border-yellow-500' : 'text-gray-400 border-gray-300'"
          class="flex items-center justify-center w-10 h-10 border rounded-lg hover:text-yellow-500 hover:border-yellow-500 transition-colors"
          :title="isInWatchlist ? '取消收藏' : '收藏'"
        >
          <svg class="w-5 h-5" :fill="isInWatchlist ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  token: {
    type: Object,
    required: true
  },
  isInWatchlist: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle-watchlist', 'trade'])

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
</script>

