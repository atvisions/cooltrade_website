<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <!-- Header -->
    <div class="px-5 py-4 border-b border-gray-100">
      <h3 class="text-base font-semibold text-gray-900 flex items-center gap-2">
        <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        现货数据
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
            <span class="text-xs px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded font-medium">spot</span>
          </div>
          <span class="text-lg font-bold text-gray-900">${{ formatPrice(item.price) }}</span>
        </div>

        <!-- Data Grid - 2x2 -->
        <div class="grid grid-cols-2 gap-x-6 gap-y-2 text-sm mb-3">
          <!-- 24h成交额 -->
          <div class="flex justify-between items-center">
            <span class="text-gray-400">24h成交额</span>
            <span class="text-gray-900 font-semibold">${{ formatLargeNumber(item.volume_24h) }}</span>
          </div>

          <!-- 24h涨跌 -->
          <div class="flex justify-between items-center">
            <span class="text-gray-400">24h涨跌</span>
            <span :class="getPriceChangeColor(item.price_change_24h)" class="font-semibold">
              {{ formatPriceChange(item.price_change_24h) }}
            </span>
          </div>

          <!-- 24h最高 -->
          <div class="flex justify-between items-center">
            <span class="text-gray-400">24h最高</span>
            <span class="text-gray-900 font-semibold">${{ formatPrice(item.high_24h) }}</span>
          </div>

          <!-- 24h最低 -->
          <div class="flex justify-between items-center">
            <span class="text-gray-400">24h最低</span>
            <span class="text-gray-900 font-semibold">${{ formatPrice(item.low_24h) }}</span>
          </div>
        </div>

        <!-- Price Range Bar - Coinglass Style -->
        <div v-if="item.high_24h && item.low_24h && item.price" class="mt-3">
          <div class="h-2 bg-gray-100 rounded-full overflow-hidden relative">
            <div
              class="absolute h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all duration-300"
              :style="{ width: getPricePosition(item) + '%' }"
            ></div>
          </div>
          <div class="flex items-center justify-between text-xs mt-1.5">
            <span class="text-gray-400">${{ formatPrice(item.low_24h) }}</span>
            <span class="text-blue-600 font-medium">当前 {{ getPricePosition(item).toFixed(1) }}%</span>
            <span class="text-gray-400">${{ formatPrice(item.high_24h) }}</span>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!aggregatedExchanges.length" class="px-5 py-8 text-center text-gray-500">
        <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <p>暂无现货数据</p>
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

// 聚合同一交易所的数据，只保留主要交易对（USDT）
const aggregatedExchanges = computed(() => {
  const exchangeMap = new Map()

  // 获取代币的参考价格（用于过滤异常价格）
  const refPrice = parseFloat(props.token?.current_price) || 0

  props.exchanges.forEach(ex => {
    const name = ex.exchange?.toLowerCase()
    if (!name) return

    // 只选择价格合理的 USDT 交易对
    const price = parseFloat(ex.price) || 0
    if (price <= 0) return

    // 过滤异常价格（与参考价格差距太大的）
    if (refPrice > 0) {
      const ratio = price / refPrice
      if (ratio < 0.5 || ratio > 2) return // 价格差距超过50%的跳过
    }

    // 如果这个交易所还没有数据，或者当前数据的成交量更大，则更新
    const existing = exchangeMap.get(name)
    const volume = parseFloat(ex.volume_24h) || 0

    if (!existing || volume > (parseFloat(existing.volume_24h) || 0)) {
      exchangeMap.set(name, {
        exchange: name,
        price: ex.price,
        volume_24h: ex.volume_24h,
        price_change_24h: ex.price_change_24h,
        high_24h: ex.high_24h,
        low_24h: ex.low_24h
      })
    }
  })

  // 按成交量排序
  return Array.from(exchangeMap.values())
    .sort((a, b) => (parseFloat(b.volume_24h) || 0) - (parseFloat(a.volume_24h) || 0))
})

const getExchangeLogo = (exchange) => {
  const name = exchange?.toLowerCase() || 'binance'
  return `https://cooltrade.xyz/dex/${name}.png`
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

const formatPriceChange = (change) => {
  if (!change && change !== 0) return '-'
  const c = parseFloat(change)
  return (c >= 0 ? '+' : '') + c.toFixed(2) + '%'
}

const getPriceChangeColor = (change) => {
  if (!change && change !== 0) return 'text-gray-500'
  return parseFloat(change) >= 0 ? 'text-emerald-600' : 'text-red-600'
}

const getPricePosition = (item) => {
  if (!item.high_24h || !item.low_24h || !item.price) return 50
  const high = parseFloat(item.high_24h)
  const low = parseFloat(item.low_24h)
  const price = parseFloat(item.price)
  if (high === low) return 50
  return Math.min(100, Math.max(0, ((price - low) / (high - low)) * 100))
}
</script>

