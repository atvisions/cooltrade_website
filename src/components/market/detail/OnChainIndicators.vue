<template>
  <div class="space-y-6">
    
    <!-- Category Selector -->
    <div class="flex flex-wrap gap-2">
      <button
        v-for="cat in categories"
        :key="cat.id"
        @click="activeCategory = cat.id"
        :class="[
          activeCategory === cat.id
            ? 'bg-gray-900 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100',
          'px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-gray-200 flex items-center gap-2'
        ]"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" :d="cat.iconPath"/>
        </svg>
        {{ cat.name }}
      </button>
    </div>

    <!-- CryptoQuant Indicators -->
    <div v-show="activeCategory === 'cryptoquant'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      
      <!-- Exchange Reserve -->
      <IndicatorCard
        title="Exchange Reserve"
        :value="formatLargeNumber(indicators?.exchange_reserve)"
        unit="BTC"
        description="交易所储备量"
        :trend="getTrend(indicators?.exchange_reserve, 'down')"
        platform="CryptoQuant"
      />

      <!-- Exchange Netflow -->
      <IndicatorCard
        title="Exchange Netflow"
        :value="formatLargeNumber(indicators?.exchange_netflow)"
        unit="BTC"
        description="交易所净流入"
        :trend="getTrend(indicators?.exchange_netflow, 'neutral')"
        :color="parseFloat(indicators?.exchange_netflow || 0) > 0 ? 'red' : 'green'"
        platform="CryptoQuant"
      />

      <!-- Stablecoin Reserve -->
      <IndicatorCard
        title="Stablecoin Reserve"
        :value="formatLargeNumber(indicators?.stablecoin_reserve)"
        unit="USDT"
        description="稳定币储备"
        :trend="getTrend(indicators?.stablecoin_reserve, 'up')"
        platform="CryptoQuant"
      />

      <!-- Miner Reserve -->
      <IndicatorCard
        title="Miner Reserve"
        :value="formatLargeNumber(indicators?.miner_reserve)"
        unit="BTC"
        description="矿工储备"
        platform="CryptoQuant"
      />

      <!-- Hashrate -->
      <IndicatorCard
        title="Hashrate"
        :value="formatNumber(indicators?.hashrate)"
        unit="EH/s"
        description="网络算力"
        :trend="getTrend(indicators?.hashrate, 'up')"
        platform="CryptoQuant"
      />

      <!-- Open Interest -->
      <IndicatorCard
        title="Open Interest"
        :value="formatLargeNumber(indicators?.open_interest)"
        unit="USD"
        description="未平仓合约"
        platform="CryptoQuant"
      />

    </div>

    <!-- Glassnode Indicators -->
    <div v-show="activeCategory === 'glassnode'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      
      <!-- MVRV Ratio -->
      <IndicatorCard
        title="MVRV Ratio"
        :value="formatNumber(indicators?.mvrv_ratio)"
        description="市值/实现市值"
        :signal="getMVRVSignal(indicators?.mvrv_ratio)"
        platform="Glassnode"
      />

      <!-- SOPR -->
      <IndicatorCard
        title="SOPR"
        :value="formatNumber(indicators?.sopr)"
        description="已花费输出利润率"
        :signal="getSOPRSignal(indicators?.sopr)"
        platform="Glassnode"
      />

      <!-- Realized Price -->
      <IndicatorCard
        title="Realized Price"
        :value="formatPrice(indicators?.realized_price)"
        unit="USD"
        description="平均买入价"
        platform="Glassnode"
      />

      <!-- Active Addresses -->
      <IndicatorCard
        title="Active Addresses"
        :value="formatNumber(indicators?.active_addresses)"
        description="24h活跃地址"
        :trend="getTrend(indicators?.active_addresses, 'up')"
        platform="Glassnode"
      />

      <!-- Whale Addresses -->
      <IndicatorCard
        title="Whale Addresses"
        :value="formatNumber(indicators?.whale_addresses)"
        description="巨鲸地址数 (>1000 BTC)"
        platform="Glassnode"
      />

      <!-- Supply in Profit -->
      <IndicatorCard
        title="Supply in Profit"
        :value="formatNumber(indicators?.supply_in_profit_percent)"
        unit="%"
        description="盈利供应占比"
        :signal="getSupplyProfitSignal(indicators?.supply_in_profit_percent)"
        platform="Glassnode"
      />

      <!-- NVT Ratio -->
      <IndicatorCard
        title="NVT Ratio"
        :value="formatNumber(indicators?.nvt_ratio)"
        description="网络价值/交易量"
        :signal="getNVTSignal(indicators?.nvt_ratio)"
        platform="Glassnode"
      />

      <!-- Velocity -->
      <IndicatorCard
        title="Velocity"
        :value="formatNumber(indicators?.velocity)"
        description="流通速度"
        platform="Glassnode"
      />

      <!-- Transaction Volume -->
      <IndicatorCard
        title="Transaction Volume"
        :value="formatLargeNumber(indicators?.transaction_volume)"
        unit="BTC"
        description="链上交易量"
        platform="Glassnode"
      />

    </div>

    <!-- Santiment Indicators -->
    <div v-show="activeCategory === 'santiment'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      
      <!-- Social Volume -->
      <IndicatorCard
        title="Social Volume"
        :value="formatNumber(indicators?.social_volume)"
        description="社交媒体提及"
        :trend="getTrend(indicators?.social_volume, 'neutral')"
        platform="Santiment"
      />

      <!-- Social Dominance -->
      <IndicatorCard
        title="Social Dominance"
        :value="formatNumber(indicators?.social_dominance)"
        unit="%"
        description="社交主导度"
        platform="Santiment"
      />

      <!-- Weighted Sentiment -->
      <IndicatorCard
        title="Weighted Sentiment"
        :value="formatNumber(indicators?.weighted_sentiment)"
        description="加权情绪"
        :color="parseFloat(indicators?.weighted_sentiment || 0) > 0 ? 'green' : 'red'"
        platform="Santiment"
      />

      <!-- Development Activity -->
      <IndicatorCard
        title="Development Activity"
        :value="formatNumber(indicators?.development_activity)"
        description="GitHub提交数"
        :trend="getTrend(indicators?.development_activity, 'up')"
        platform="Santiment"
      />

      <!-- Whale Transaction Count -->
      <IndicatorCard
        title="Whale Transactions"
        :value="formatNumber(indicators?.whale_transaction_count)"
        description="巨鲸交易数 (>$100k)"
        platform="Santiment"
      />

      <!-- Age Consumed -->
      <IndicatorCard
        title="Age Consumed"
        :value="formatLargeNumber(indicators?.age_consumed)"
        description="币龄消耗"
        platform="Santiment"
      />

    </div>

    <!-- No Data Message -->
    <div v-if="!hasData" class="text-center py-12 bg-white rounded-xl">
      <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
      </svg>
      <p class="text-gray-500 font-medium mb-2">链上数据暂未获取</p>
      <p class="text-sm text-gray-400">需要配置 CryptoQuant、Glassnode 和 Santiment API Key</p>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, defineProps } from 'vue'
import IndicatorCard from './IndicatorCard.vue'

const props = defineProps({
  indicators: { type: Object, default: () => ({}) }
})

const categories = [
  {
    id: 'cryptoquant',
    name: '交易所数据',
    iconPath: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
  },
  {
    id: 'glassnode',
    name: '链上行为',
    iconPath: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1'
  },
  {
    id: 'santiment',
    name: '社交情绪',
    iconPath: 'M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z'
  }
]

const activeCategory = ref('cryptoquant')

const hasData = computed(() => {
  return Object.keys(props.indicators || {}).length > 0
})

const formatNumber = (value) => {
  if (!value) return '-'
  return parseFloat(value).toLocaleString('en-US', { maximumFractionDigits: 2 })
}

const formatLargeNumber = (value) => {
  if (!value) return '-'
  const num = parseFloat(value)
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K'
  return num.toFixed(2)
}

const formatPrice = (value) => {
  if (!value) return '-'
  return '$' + parseFloat(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const getTrend = (value, direction) => {
  if (!value) return null
  return direction
}

const getMVRVSignal = (value) => {
  if (!value) return null
  const num = parseFloat(value)
  if (num > 3.7) return { label: 'Overvalued', color: 'red' }
  if (num < 1) return { label: 'Undervalued', color: 'green' }
  return { label: 'Fair Value', color: 'gray' }
}

const getSOPRSignal = (value) => {
  if (!value) return null
  const num = parseFloat(value)
  if (num > 1) return { label: 'Profit Taking', color: 'green' }
  if (num < 1) return { label: 'Loss Selling', color: 'red' }
  return { label: 'Neutral', color: 'gray' }
}

const getSupplyProfitSignal = (value) => {
  if (!value) return null
  const num = parseFloat(value)
  if (num > 95) return { label: 'Top Signal', color: 'red' }
  if (num < 50) return { label: 'Bottom Signal', color: 'green' }
  return { label: 'Normal', color: 'gray' }
}

const getNVTSignal = (value) => {
  if (!value) return null
  const num = parseFloat(value)
  if (num > 95) return { label: 'Overvalued', color: 'red' }
  if (num < 45) return { label: 'Undervalued', color: 'green' }
  return { label: 'Fair Value', color: 'gray' }
}
</script>

