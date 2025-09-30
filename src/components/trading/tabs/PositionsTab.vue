<template>
  <div>
    <!-- 总览卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div class="bg-white rounded-2xl border border-gray-200 p-6">
        <div class="text-sm text-gray-500 mb-2">总持仓价值</div>
        <div class="text-3xl font-bold text-gray-900">$10,234.56</div>
      </div>
      <div class="bg-white rounded-2xl border border-gray-200 p-6">
        <div class="text-sm text-gray-500 mb-2">未实现盈亏</div>
        <div class="text-3xl font-bold text-green-600">+$234.56</div>
        <div class="text-xs text-gray-500 mt-2">+2.3%</div>
      </div>
      <div class="bg-white rounded-2xl border border-gray-200 p-6">
        <div class="text-sm text-gray-500 mb-2">持仓数量</div>
        <div class="text-3xl font-bold text-gray-900">{{ positions.length }}</div>
      </div>
      <div class="bg-white rounded-2xl border border-gray-200 p-6">
        <div class="text-sm text-gray-500 mb-2">已用保证金</div>
        <div class="text-3xl font-bold text-gray-900">$4,250.00</div>
      </div>
    </div>

    <!-- 持仓列表 -->
    <div class="space-y-6">
      <div
        v-for="position in positions"
        :key="position.id"
        class="bg-white rounded-xl border-2 border-gray-200 p-6 hover:shadow-lg transition-all duration-200"
      >
        <!-- 头部 -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1">
            <div class="flex items-center space-x-3 mb-2">
              <h3 class="text-2xl font-bold text-gray-900">{{ position.symbol }}</h3>
              <span :class="[
                'px-3 py-1 rounded-full text-sm font-medium',
                position.side === 'long' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              ]">
                {{ position.side === 'long' ? '做多' : '做空' }}
              </span>
              <span class="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {{ position.leverage }}x
              </span>
            </div>
            <div class="text-sm text-gray-600 mb-2">
              <span v-if="position.strategyName">
                策略: {{ position.strategyName }}
                <span v-if="position.isAutoTrade" class="text-blue-600">(自动交易)</span>
              </span>
              <span v-else class="text-gray-500">手动交易</span>
            </div>
            <div class="text-xs text-gray-500">
              开仓时间: {{ position.openTime }}
            </div>
          </div>
          <div :class="[
            'text-right',
            position.unrealizedPnL >= 0 ? 'text-green-600' : 'text-red-600'
          ]">
            <div class="text-3xl font-bold">
              {{ position.unrealizedPnL >= 0 ? '+' : '' }}${{ position.unrealizedPnL }}
            </div>
            <div class="text-lg font-medium">
              {{ position.unrealizedPnLPercent >= 0 ? '+' : '' }}{{ position.unrealizedPnLPercent }}%
            </div>
          </div>
        </div>

        <!-- 价格和持仓信息 -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg">
          <div>
            <div class="text-xs text-gray-500 mb-1">开仓价</div>
            <div class="text-lg font-bold text-gray-900">${{ position.entryPrice.toLocaleString() }}</div>
          </div>
          <div>
            <div class="text-xs text-gray-500 mb-1">当前价</div>
            <div class="text-lg font-bold text-blue-600">${{ position.currentPrice.toLocaleString() }}</div>
          </div>
          <div>
            <div class="text-xs text-gray-500 mb-1">持仓量</div>
            <div class="text-lg font-bold text-gray-900">{{ position.quantity }} {{ position.symbol.split('/')[0] }}</div>
          </div>
          <div>
            <div class="text-xs text-gray-500 mb-1">保证金</div>
            <div class="text-lg font-bold text-gray-900">${{ position.margin.toLocaleString() }}</div>
          </div>
        </div>

        <!-- 止损止盈 -->
        <div class="grid grid-cols-2 gap-4 mb-4 p-4 bg-gradient-to-r from-red-50 to-green-50 rounded-lg">
          <div>
            <div class="text-xs text-gray-500 mb-1">止损价</div>
            <div class="text-lg font-bold text-red-600">${{ position.stopLoss.toLocaleString() }}</div>
            <div class="text-xs text-gray-500">
              {{ ((position.stopLoss - position.entryPrice) / position.entryPrice * 100).toFixed(2) }}%
            </div>
          </div>
          <div>
            <div class="text-xs text-gray-500 mb-1">止盈价</div>
            <div class="text-lg font-bold text-green-600">${{ position.takeProfit.toLocaleString() }}</div>
            <div class="text-xs text-gray-500">
              {{ ((position.takeProfit - position.entryPrice) / position.entryPrice * 100).toFixed(2) }}%
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="flex items-center space-x-3">
          <button
            @click="closePosition(position.id)"
            class="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            平仓
          </button>
          <button
            class="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors font-medium"
          >
            调整止损止盈
          </button>
          <button
            class="px-6 py-2 border-2 border-blue-300 text-blue-700 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors font-medium"
          >
            {{ position.side === 'long' ? '加仓' : '减仓' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="positions.length === 0" class="bg-white rounded-2xl border border-gray-200 p-12 text-center">
      <div class="text-6xl mb-4">📊</div>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">暂无持仓</h3>
      <p class="text-gray-600">您当前没有任何持仓</p>
    </div>

    <!-- 批量操作 -->
    <div v-if="positions.length > 0" class="mt-6 flex justify-end space-x-3">
      <button
        @click="closeAllPositions"
        class="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 font-medium"
      >
        一键平仓所有
      </button>
      <button
        class="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 font-medium"
      >
        刷新
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 持仓数据（模拟）
const positions = ref([
  {
    id: 1,
    symbol: 'BTC/USDT',
    side: 'long',
    leverage: 10,
    entryPrice: 45000,
    currentPrice: 46000,
    quantity: 0.5,
    margin: 2250,
    unrealizedPnL: 500,
    unrealizedPnLPercent: 22.2,
    stopLoss: 43500,
    takeProfit: 48000,
    strategyId: 1,
    strategyName: 'BTC网格交易策略',
    isAutoTrade: true,
    openTime: '2024-01-15 10:30'
  },
  {
    id: 2,
    symbol: 'ETH/USDT',
    side: 'short',
    leverage: 5,
    entryPrice: 2400,
    currentPrice: 2350,
    quantity: 2,
    margin: 960,
    unrealizedPnL: 100,
    unrealizedPnLPercent: 10.4,
    stopLoss: 2520,
    takeProfit: 2200,
    strategyId: null,
    strategyName: null,
    isAutoTrade: false,
    openTime: '2024-01-15 14:20'
  }
])

// 方法
const closePosition = (id) => {
  if (confirm('确定要平仓吗？')) {
    console.log('平仓:', id)
    // TODO: 调用API平仓
  }
}

const closeAllPositions = () => {
  if (confirm('确定要平仓所有持仓吗？')) {
    console.log('平仓所有')
    // TODO: 调用API平仓所有
  }
}
</script>

