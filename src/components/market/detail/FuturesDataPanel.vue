<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <!-- Header -->
    <div class="px-5 py-4 border-b border-gray-100">
      <h3 class="text-base font-semibold text-gray-900 flex items-center gap-2">
        <svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
        </svg>
        合约数据
      </h3>
    </div>

    <!-- Exchange List - Coinglass Style -->
    <div class="divide-y divide-gray-100">
      <div v-for="item in aggregatedExchanges" :key="item.exchange" class="px-5 py-4 hover:bg-gray-50/50 transition-colors">
        <!-- Exchange Header -->
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <img :src="getExchangeLogo(item.exchange)" :alt="item.exchange" class="w-6 h-6 rounded-lg" />
            <span class="font-semibold text-gray-900 capitalize">{{ item.exchange }}</span>
            <span class="text-xs px-1.5 py-0.5 bg-purple-50 text-purple-600 rounded font-medium">linear</span>
          </div>
          <span class="text-lg font-bold text-gray-900">${{ formatPrice(item.price) }}</span>
        </div>

        <!-- Data Grid - 2x2 -->
        <div class="grid grid-cols-2 gap-x-6 gap-y-2 text-sm mb-3">
          <!-- 资金费率 -->
          <div class="flex justify-between items-center">
            <span class="text-gray-400">资金费率</span>
            <span :class="getFundingRateColor(item.funding_rate)" class="font-semibold">
              {{ formatFundingRate(item.funding_rate) }}
            </span>
          </div>

          <!-- 持仓量 -->
          <div class="flex justify-between items-center">
            <span class="text-gray-400">持仓量</span>
            <span class="text-gray-900 font-semibold">${{ formatLargeNumber(item.open_interest) }}</span>
          </div>

          <!-- 多空比 -->
          <div class="flex justify-between items-center">
            <span class="text-gray-400">多空比</span>
            <span :class="getLongShortColor(item.long_short_ratio)" class="font-semibold">
              {{ formatNumber(item.long_short_ratio, 2) }}
            </span>
          </div>

          <!-- 24h成交额 -->
          <div class="flex justify-between items-center">
            <span class="text-gray-400">24h成交额</span>
            <span class="text-gray-900 font-semibold">${{ formatLargeNumber(item.volume_24h) }}</span>
          </div>
        </div>

        <!-- Long/Short Bar - Coinglass Style -->
        <div v-if="item.long_short_ratio" class="mt-3">
          <div class="h-2 rounded-full overflow-hidden flex">
            <div
              class="bg-emerald-500 transition-all duration-300"
              :style="{ width: getLongPercent(item.long_short_ratio) + '%' }"
            ></div>
            <div
              class="bg-red-500 transition-all duration-300"
              :style="{ width: getShortPercent(item.long_short_ratio) + '%' }"
            ></div>
          </div>
          <div class="flex items-center justify-between text-xs mt-1.5">
            <span class="text-emerald-600 font-medium">多 {{ getLongPercent(item.long_short_ratio) }}%</span>
            <span class="text-red-500 font-medium">空 {{ getShortPercent(item.long_short_ratio) }}%</span>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!aggregatedExchanges.length" class="px-5 py-8 text-center text-gray-500">
        <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <p>暂无合约数据</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  exchanges: { type: Array, default: () => [] },
  token: { type: Object, default: () => ({}) }
})

// 聚合同一交易所的数据，只保留主要交易对（USDT永续）
const aggregatedExchanges = computed(() => {
  const exchangeMap = new Map()

  props.exchanges.forEach(ex => {
    const name = ex.exchange?.toLowerCase()
    if (!name) return

    // 只选择价格合理的 USDT 交易对（价格在当前代币价格的合理范围内）
    const price = parseFloat(ex.price) || 0
    if (price <= 0 || price > 1000000) return // 过滤异常价格

    // 如果这个交易所还没有数据，或者当前数据的成交量更大，则更新
    const existing = exchangeMap.get(name)
    const volume = parseFloat(ex.volume_24h) || 0

    if (!existing || volume > (parseFloat(existing.volume_24h) || 0)) {
      exchangeMap.set(name, {
        exchange: name,
        price: ex.price,
        funding_rate: ex.funding_rate,
        open_interest: ex.open_interest,
        long_short_ratio: ex.long_short_ratio,
        volume_24h: ex.volume_24h,
        market_type: ex.market_type
      })
    }
  })

  // 按成交量排序
  return Array.from(exchangeMap.values())
    .sort((a, b) => (parseFloat(b.volume_24h) || 0) - (parseFloat(a.volume_24h) || 0))
})

const getExchangeLogo = (exchange) => {
  const name = exchange?.toLowerCase() || 'binance'
  return `/DEX/${name}.png`
}

const formatPrice = (price) => {
  if (!price) return '-'
  const num = parseFloat(price)
  if (num >= 1) return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return num.toFixed(6)
}

const formatLargeNumber = (num) => {
  if (!num) return '-'
  const n = parseFloat(num)
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B'
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M'
  if (n >= 1e3) return (n / 1e3).toFixed(2) + 'K'
  return n.toFixed(2)
}

const formatNumber = (num, decimals = 2) => {
  if (!num) return '-'
  return parseFloat(num).toFixed(decimals)
}

const formatFundingRate = (rate) => {
  if (!rate) return '-'
  const r = parseFloat(rate) * 100
  return (r >= 0 ? '+' : '') + r.toFixed(4) + '%'
}

const getFundingRateColor = (rate) => {
  if (!rate) return 'text-gray-500'
  return parseFloat(rate) >= 0 ? 'text-emerald-600' : 'text-red-600'
}

const getLongShortColor = (ratio) => {
  if (!ratio) return 'text-gray-500'
  return parseFloat(ratio) >= 1 ? 'text-emerald-600' : 'text-red-600'
}

const getLongPercent = (ratio) => {
  if (!ratio) return 50
  const r = parseFloat(ratio)
  return ((r / (r + 1)) * 100).toFixed(1)
}

const getShortPercent = (ratio) => {
  if (!ratio) return 50
  const r = parseFloat(ratio)
  return ((1 / (r + 1)) * 100).toFixed(1)
}
</script>

