<template>
  <div>
    <!-- 筛选器 -->
    <div class="bg-white rounded-2xl border border-gray-200 p-4 mb-6">
      <div class="flex items-center space-x-4">
        <button
          v-for="filter in filters"
          :key="filter.id"
          @click="activeFilter = filter.id"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
            activeFilter === filter.id
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          ]"
        >
          {{ filter.name }}
        </button>
      </div>
    </div>

    <!-- 交易历史列表 -->
    <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">时间</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">币种</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">方向</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">倍率</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">开仓价</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">平仓价</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">盈亏</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">策略</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="trade in filteredTrades" :key="trade.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ trade.time }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ trade.symbol }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="[
                'px-2 py-1 rounded text-xs font-medium',
                trade.side === 'long' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              ]">
                {{ trade.side === 'long' ? '做多' : '做空' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ trade.leverage }}x</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${{ trade.entryPrice }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${{ trade.exitPrice }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="[
                'text-sm font-bold',
                trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'
              ]">
                {{ trade.pnl >= 0 ? '+' : '' }}${{ trade.pnl }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ trade.strategy || '-' }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 统计 -->
    <div class="mt-6 bg-white rounded-2xl border border-gray-200 p-6">
      <div class="grid grid-cols-4 gap-6">
        <div>
          <div class="text-sm text-gray-500 mb-1">总交易</div>
          <div class="text-2xl font-bold text-gray-900">{{ trades.length }}笔</div>
        </div>
        <div>
          <div class="text-sm text-gray-500 mb-1">盈利交易</div>
          <div class="text-2xl font-bold text-green-600">{{ profitTrades }}笔</div>
        </div>
        <div>
          <div class="text-sm text-gray-500 mb-1">亏损交易</div>
          <div class="text-2xl font-bold text-red-600">{{ lossTrades }}笔</div>
        </div>
        <div>
          <div class="text-sm text-gray-500 mb-1">胜率</div>
          <div class="text-2xl font-bold text-gray-900">{{ winRate }}%</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 筛选器
const activeFilter = ref('all')
const filters = ref([
  { id: 'all', name: '全部' },
  { id: 'long', name: '做多' },
  { id: 'short', name: '做空' },
  { id: 'profit', name: '盈利' },
  { id: 'loss', name: '亏损' }
])

// 交易历史数据（模拟）
const trades = ref([
  {
    id: 1,
    time: '01-15 14:30',
    symbol: 'BTC/USDT',
    side: 'long',
    leverage: 10,
    entryPrice: 45000,
    exitPrice: 46000,
    pnl: 234.56,
    strategy: 'BTC网格交易策略'
  },
  {
    id: 2,
    time: '01-15 10:20',
    symbol: 'ETH/USDT',
    side: 'short',
    leverage: 5,
    entryPrice: 2400,
    exitPrice: 2350,
    pnl: 123.45,
    strategy: null
  },
  {
    id: 3,
    time: '01-14 16:45',
    symbol: 'BNB/USDT',
    side: 'long',
    leverage: 3,
    entryPrice: 320,
    exitPrice: 315,
    pnl: -56.78,
    strategy: 'DCA定投策略'
  },
  {
    id: 4,
    time: '01-14 09:15',
    symbol: 'SOL/USDT',
    side: 'long',
    leverage: 5,
    entryPrice: 100,
    exitPrice: 105,
    pnl: 89.12,
    strategy: null
  }
])

// 过滤交易
const filteredTrades = computed(() => {
  if (activeFilter.value === 'all') {
    return trades.value
  } else if (activeFilter.value === 'profit') {
    return trades.value.filter(t => t.pnl >= 0)
  } else if (activeFilter.value === 'loss') {
    return trades.value.filter(t => t.pnl < 0)
  } else {
    return trades.value.filter(t => t.side === activeFilter.value)
  }
})

// 统计
const profitTrades = computed(() => trades.value.filter(t => t.pnl >= 0).length)
const lossTrades = computed(() => trades.value.filter(t => t.pnl < 0).length)
const winRate = computed(() => ((profitTrades.value / trades.value.length) * 100).toFixed(1))
</script>

