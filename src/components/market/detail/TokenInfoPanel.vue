<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <!-- Header -->
    <div class="px-5 py-4 border-b border-gray-100">
      <h3 class="text-base font-semibold text-gray-900 flex items-center gap-2">
        <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        代币信息
      </h3>
    </div>

    <!-- Info List -->
    <div class="px-5 py-4 space-y-3">
      <!-- 市值排名 -->
      <div class="flex justify-between items-center">
        <span class="text-sm text-gray-500">市值排名</span>
        <span class="text-sm font-medium text-gray-900">#{{ token.market_cap_rank || '-' }}</span>
      </div>

      <!-- 市值 -->
      <div class="flex justify-between items-center">
        <span class="text-sm text-gray-500">市值</span>
        <span class="text-sm font-medium text-gray-900">${{ formatLargeNumber(token.market_cap) }}</span>
      </div>

      <!-- 完全稀释市值 -->
      <div class="flex justify-between items-center">
        <span class="text-sm text-gray-500">完全稀释市值</span>
        <span class="text-sm font-medium text-gray-900">${{ formatLargeNumber(token.fully_diluted_valuation) }}</span>
      </div>

      <!-- 流通量 -->
      <div class="flex justify-between items-center">
        <span class="text-sm text-gray-500">流通量</span>
        <span class="text-sm font-medium text-gray-900">{{ formatLargeNumber(token.circulating_supply) }} {{ token.symbol }}</span>
      </div>

      <!-- 总供应量 -->
      <div class="flex justify-between items-center">
        <span class="text-sm text-gray-500">总供应量</span>
        <span class="text-sm font-medium text-gray-900">{{ formatLargeNumber(token.total_supply) }} {{ token.symbol }}</span>
      </div>

      <!-- 最大供应量 -->
      <div v-if="token.max_supply" class="flex justify-between items-center">
        <span class="text-sm text-gray-500">最大供应量</span>
        <span class="text-sm font-medium text-gray-900">{{ formatLargeNumber(token.max_supply) }} {{ token.symbol }}</span>
      </div>

      <!-- 分隔线 -->
      <div class="border-t border-gray-100 my-2"></div>

      <!-- ATH -->
      <div class="flex justify-between items-center">
        <span class="text-sm text-gray-500">历史最高 (ATH)</span>
        <div class="text-right">
          <div class="text-sm font-medium text-gray-900">${{ formatPrice(token.ath) }}</div>
          <div class="text-xs text-red-500">{{ formatAthChange(token.ath_change_percentage) }}</div>
        </div>
      </div>

      <!-- ATL -->
      <div class="flex justify-between items-center">
        <span class="text-sm text-gray-500">历史最低 (ATL)</span>
        <div class="text-right">
          <div class="text-sm font-medium text-gray-900">${{ formatPrice(token.atl) }}</div>
          <div class="text-xs text-emerald-500">{{ formatAtlChange(token.atl_change_percentage) }}</div>
        </div>
      </div>

      <!-- 分隔线 -->
      <div v-if="hasLinks" class="border-t border-gray-100 my-2"></div>

      <!-- 链接 -->
      <div v-if="hasLinks" class="flex flex-wrap gap-2">
        <a v-if="token.website" :href="token.website" target="_blank" 
           class="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium text-gray-700 transition-colors flex items-center gap-1">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
          </svg>
          官网
        </a>
        <a v-if="token.twitter" :href="token.twitter" target="_blank"
           class="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium text-gray-700 transition-colors flex items-center gap-1">
          <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          Twitter
        </a>
        <a v-if="token.telegram" :href="token.telegram" target="_blank"
           class="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium text-gray-700 transition-colors flex items-center gap-1">
          <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
          </svg>
          Telegram
        </a>
        <a v-if="token.github" :href="token.github" target="_blank"
           class="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium text-gray-700 transition-colors flex items-center gap-1">
          <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          GitHub
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  token: { type: Object, default: () => ({}) }
})

const hasLinks = computed(() => {
  return props.token.website || props.token.twitter || props.token.telegram || props.token.github
})

const formatLargeNumber = (num) => {
  if (!num) return '-'
  const n = parseFloat(num)
  if (n >= 1e12) return (n / 1e12).toFixed(2) + 'T'
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B'
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M'
  if (n >= 1e3) return (n / 1e3).toFixed(2) + 'K'
  return n.toFixed(2)
}

const formatPrice = (price) => {
  if (!price) return '-'
  const num = parseFloat(price)
  if (num >= 1) return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return num.toFixed(6)
}

const formatAthChange = (change) => {
  if (!change && change !== 0) return ''
  return parseFloat(change).toFixed(2) + '% from ATH'
}

const formatAtlChange = (change) => {
  if (!change && change !== 0) return ''
  return '+' + parseFloat(change).toFixed(2) + '% from ATL'
}
</script>

