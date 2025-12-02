<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <!-- Header with Tabs -->
    <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
      <h3 class="text-base font-semibold text-gray-900">{{ token.symbol }} 市场</h3>
      <div class="flex bg-gray-100 rounded-lg p-1">
        <button
          @click="activeTab = 'futures'"
          :class="[
            'px-4 py-1.5 text-sm font-medium rounded-md transition-all',
            activeTab === 'futures'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          ]"
        >
          合约
        </button>
        <button
          @click="activeTab = 'spot'"
          :class="[
            'px-4 py-1.5 text-sm font-medium rounded-md transition-all',
            activeTab === 'spot'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          ]"
        >
          现货
        </button>
      </div>
    </div>

    <!-- Table with sticky first column -->
    <div class="relative">
      <div class="overflow-x-auto">
        <table class="w-full min-w-max">
          <!-- Table Header -->
          <thead>
            <tr class="text-xs text-gray-500 border-b border-gray-100 h-11">
              <th class="sticky left-0 z-10 bg-white px-3 py-3 text-left font-medium w-10">#</th>
              <th class="sticky left-10 z-10 bg-white px-3 py-3 text-left font-medium min-w-[140px]">交易所</th>
              <th class="px-3 py-3 text-left font-medium min-w-[120px]">交易对</th>
              <th class="px-3 py-3 text-right font-medium min-w-[100px]">价格</th>
              <th class="px-3 py-3 text-right font-medium min-w-[90px]">24h涨跌</th>
              <th class="px-3 py-3 text-right font-medium min-w-[100px]">24h最高</th>
              <th class="px-3 py-3 text-right font-medium min-w-[100px]">24h最低</th>
              <th class="px-3 py-3 text-right font-medium min-w-[110px]">24h成交额</th>
              <!-- 合约专属列 -->
              <th v-if="activeTab === 'futures'" class="px-3 py-3 text-right font-medium min-w-[100px]">资金费率</th>
              <th v-if="activeTab === 'futures'" class="px-3 py-3 text-right font-medium min-w-[110px]">持仓量</th>
              <th v-if="activeTab === 'futures'" class="px-3 py-3 text-right font-medium min-w-[100px]">多空比</th>
              <th v-if="activeTab === 'futures'" class="px-3 py-3 text-right font-medium min-w-[130px]">24h爆仓</th>
              <!-- 现货专属列 -->
              <th v-if="activeTab === 'spot'" class="px-3 py-3 text-right font-medium min-w-[110px]">净流入</th>
            </tr>
          </thead>
          <!-- Table Body -->
          <tbody class="divide-y divide-gray-50">
            <tr
              v-for="(item, index) in displayedData"
              :key="item.exchange + item.trading_pair"
              class="hover:bg-gray-50/50 transition-colors text-sm h-14"
            >
              <!-- Rank (sticky) -->
              <td class="sticky left-0 z-10 bg-white px-3 py-3 text-gray-400">{{ index + 1 }}</td>
              <!-- Exchange (sticky) -->
              <td class="sticky left-10 z-10 bg-white px-3 py-3">
                <div class="flex items-center gap-2">
                  <img :src="getExchangeLogo(item.exchange)" :alt="item.exchange" class="w-5 h-5 rounded" />
                  <span class="font-medium text-gray-900 capitalize">{{ item.exchange }}</span>
                </div>
              </td>
              <!-- Trading Pair -->
              <td class="px-3 py-3">
                <span class="text-gray-700">{{ item.trading_pair }}</span>
              </td>
              <!-- Price -->
              <td class="px-3 py-3 text-right">
                <span class="font-semibold text-gray-900">${{ formatPrice(item.price) }}</span>
              </td>
              <!-- Price Change 24h -->
              <td class="px-3 py-3 text-right">
                <span :class="getPriceChangeColor(item.price_change_24h)" class="font-medium">
                  {{ formatPriceChange(item.price_change_24h) }}
                </span>
              </td>
              <!-- 24h High -->
              <td class="px-3 py-3 text-right">
                <span class="text-gray-700">${{ formatPrice(item.high_24h) }}</span>
              </td>
              <!-- 24h Low -->
              <td class="px-3 py-3 text-right">
                <span class="text-gray-700">${{ formatPrice(item.low_24h) }}</span>
              </td>
              <!-- Volume 24h -->
              <td class="px-3 py-3 text-right">
                <span class="font-medium text-gray-900">${{ formatLargeNumber(item.volume_24h) }}</span>
              </td>

              <!-- ===== 合约专属列 ===== -->
              <!-- Funding Rate -->
              <td v-if="activeTab === 'futures'" class="px-3 py-3 text-right">
                <span :class="getFundingRateColor(item.funding_rate)" class="font-medium">
                  {{ formatFundingRate(item.funding_rate) }}
                </span>
              </td>
              <!-- Open Interest -->
              <td v-if="activeTab === 'futures'" class="px-3 py-3 text-right">
                <span class="font-medium text-gray-900">${{ formatLargeNumber(item.open_interest) }}</span>
              </td>
              <!-- Long/Short Ratio -->
              <td v-if="activeTab === 'futures'" class="px-3 py-3 text-right">
                <div v-if="item.long_short_ratio" class="flex flex-col items-end">
                  <span :class="getLongShortColor(item.long_short_ratio)" class="font-medium">
                    {{ formatNumber(item.long_short_ratio, 4) }}
                  </span>
                  <div class="flex items-center gap-1 text-xs mt-0.5">
                    <span class="text-emerald-600">{{ getLongPercent(item.long_short_ratio) }}%</span>
                    <span class="text-gray-300">/</span>
                    <span class="text-red-500">{{ getShortPercent(item.long_short_ratio) }}%</span>
                  </div>
                </div>
                <span v-else class="text-gray-400">-</span>
              </td>
              <!-- 24h Liquidation -->
              <td v-if="activeTab === 'futures'" class="px-3 py-3 text-right">
                <div v-if="item.liquidation_24h_long || item.liquidation_24h_short" class="flex flex-col items-end">
                  <span class="font-medium text-gray-900">${{ formatLargeNumber(getTotalLiquidation(item)) }}</span>
                  <div class="flex items-center gap-1 text-xs mt-0.5">
                    <span class="text-emerald-600">${{ formatLargeNumber(item.liquidation_24h_long) }}</span>
                    <span class="text-gray-300">/</span>
                    <span class="text-red-500">${{ formatLargeNumber(item.liquidation_24h_short) }}</span>
                  </div>
                </div>
                <span v-else class="text-gray-400">-</span>
              </td>

              <!-- ===== 现货专属列 ===== -->
              <!-- Net Inflow -->
              <td v-if="activeTab === 'spot'" class="px-3 py-3 text-right">
                <span :class="getNetInflowColor(item.net_inflow)" class="font-medium">
                  {{ formatNetInflow(item.net_inflow) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="!displayedData.length" class="px-5 py-12 text-center text-gray-500">
        <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <p>暂无{{ activeTab === 'futures' ? '合约' : '现货' }}数据</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  spotExchanges: { type: Array, default: () => [] },
  futuresExchanges: { type: Array, default: () => [] },
  token: { type: Object, default: () => ({}) },
  defaultTab: { type: String, default: 'futures' }
})

const activeTab = ref(props.defaultTab)

// Aggregate and filter data - 每个交易所只保留一条记录
const aggregateExchanges = (exchanges, isFutures) => {
  const exchangeMap = new Map()
  const refPrice = parseFloat(props.token?.current_price) || 0
  const tokenSymbol = props.token?.symbol?.toUpperCase() || ''

  // 先过滤数据
  const filtered = exchanges.filter(ex => {
    const name = ex.exchange?.toLowerCase()
    if (!name) return false

    const pair = ex.trading_pair || ''

    // 只选择该代币的 USDT 交易对（如 BTC/USDT, BTC/USDT:USDT）
    // 排除其他币种对该代币的交易对（如 ETH/BTC）
    if (!pair.startsWith(`${tokenSymbol}/USDT`)) return false

    // 合约数据：只选择永续合约（trading_pair 不含日期后缀如 -251226）
    if (isFutures) {
      if (pair.match(/-\d{6}$/)) return false // 跳过交割合约
    }

    const price = parseFloat(ex.price) || 0
    if (price <= 0) return false

    return true
  })

  // 聚合：每个交易所选择最佳记录
  filtered.forEach(ex => {
    const name = ex.exchange?.toLowerCase()
    const existing = exchangeMap.get(name)
    const volume = parseFloat(ex.volume_24h) || 0
    const hasFundingData = ex.funding_rate != null

    // 决定是否替换现有记录
    let shouldReplace = false
    if (!existing) {
      shouldReplace = true
    } else if (isFutures) {
      // 合约：优先选择有 funding_rate 的记录
      const existingHasFunding = existing.funding_rate != null
      if (hasFundingData && !existingHasFunding) {
        shouldReplace = true
      } else if (hasFundingData === existingHasFunding && volume > (parseFloat(existing.volume_24h) || 0)) {
        shouldReplace = true
      }
    } else {
      // 现货：选择成交量最大的
      if (volume > (parseFloat(existing.volume_24h) || 0)) {
        shouldReplace = true
      }
    }

    if (shouldReplace) {
      // 计算净流入（买入 - 卖出）
      const buyVol = parseFloat(ex.buy_volume_24h) || 0
      const sellVol = parseFloat(ex.sell_volume_24h) || 0
      const netInflow = (buyVol || sellVol) ? buyVol - sellVol : null

      exchangeMap.set(name, {
        exchange: name,
        trading_pair: ex.trading_pair,
        price: ex.price,
        volume_24h: ex.volume_24h,
        high_24h: ex.high_24h,
        low_24h: ex.low_24h,
        // 现货使用每个交易所自己的涨跌幅，如果没有则用 token 整体涨跌幅
        price_change_24h: ex.price_change_24h || (isFutures ? null : props.token?.price_change_percentage_24h),
        net_inflow: netInflow,
        // 合约字段
        open_interest: ex.open_interest,
        funding_rate: ex.funding_rate,
        long_short_ratio: ex.long_short_ratio,
        liquidation_24h_long: ex.liquidation_24h_long,
        liquidation_24h_short: ex.liquidation_24h_short,
      })
    }
  })

  return Array.from(exchangeMap.values())
    .sort((a, b) => (parseFloat(b.volume_24h) || 0) - (parseFloat(a.volume_24h) || 0))
}

const displayedData = computed(() => {
  return activeTab.value === 'futures'
    ? aggregateExchanges(props.futuresExchanges, true)
    : aggregateExchanges(props.spotExchanges, false)
})

const getExchangeLogo = (exchange) => `https://cooltrade.xyz/dex/${exchange?.toLowerCase() || 'binance'}.png`

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

const formatFundingRate = (rate) => {
  if (!rate) return '-'
  const r = parseFloat(rate) * 100
  return (r >= 0 ? '+' : '') + r.toFixed(4) + '%'
}

const getFundingRateColor = (rate) => {
  if (!rate) return 'text-gray-500'
  return parseFloat(rate) >= 0 ? 'text-emerald-600' : 'text-red-600'
}

const formatNumber = (num, decimals = 2) => {
  if (!num) return '-'
  return parseFloat(num).toFixed(decimals)
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

// 净流入格式化
const formatNetInflow = (inflow) => {
  if (inflow == null) return '-'
  const n = parseFloat(inflow)
  const prefix = n >= 0 ? '+' : ''
  const absN = Math.abs(n)
  if (absN >= 1e9) return prefix + '$' + (n / 1e9).toFixed(2) + 'B'
  if (absN >= 1e6) return prefix + '$' + (n / 1e6).toFixed(2) + 'M'
  if (absN >= 1e3) return prefix + '$' + (n / 1e3).toFixed(2) + 'K'
  return prefix + '$' + n.toFixed(2)
}

const getNetInflowColor = (inflow) => {
  if (inflow == null) return 'text-gray-400'
  return parseFloat(inflow) >= 0 ? 'text-emerald-600' : 'text-red-600'
}

// 计算总爆仓量
const getTotalLiquidation = (item) => {
  const long = parseFloat(item.liquidation_24h_long) || 0
  const short = parseFloat(item.liquidation_24h_short) || 0
  return long + short
}
</script>

<style scoped>
/* 固定列阴影效果 */
.sticky {
  position: sticky;
}

/* 当滚动时给固定列添加阴影 */
td.sticky::after,
th.sticky::after {
  content: '';
  position: absolute;
  top: 0;
  right: -8px;
  bottom: 0;
  width: 8px;
  pointer-events: none;
}

/* 第二个固定列的阴影 */
td.sticky.left-10::after,
th.sticky.left-10::after {
  box-shadow: 4px 0 8px -4px rgba(0, 0, 0, 0.1);
}

/* hover时保持背景色 */
tr:hover td.sticky {
  background-color: rgb(249 250 251 / 0.5);
}
</style>
