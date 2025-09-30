<template>
  <div>
    <!-- 账户余额概览 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div class="bg-white rounded-2xl border border-gray-200 p-6">
        <div class="text-sm text-gray-500 mb-2">总资产</div>
        <div class="text-3xl font-bold text-gray-900">$12,500.00</div>
        <div class="text-xs text-gray-500 mt-2">≈ 12,500 USDT</div>
      </div>
      <div class="bg-white rounded-2xl border border-gray-200 p-6">
        <div class="text-sm text-gray-500 mb-2">可用保证金</div>
        <div class="text-3xl font-bold text-green-600">$8,250.00</div>
        <div class="text-xs text-gray-500 mt-2">可用于开仓</div>
      </div>
      <div class="bg-white rounded-2xl border border-gray-200 p-6">
        <div class="text-sm text-gray-500 mb-2">已用保证金</div>
        <div class="text-3xl font-bold text-orange-600">$4,250.00</div>
        <div class="text-xs text-gray-500 mt-2">当前持仓占用</div>
      </div>
    </div>

    <!-- 账户健康度 -->
    <div class="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h3 class="text-lg font-semibold text-gray-900">账户健康度</h3>
          <p class="text-sm text-gray-500">距离强平线的安全距离</p>
        </div>
        <div class="text-right">
          <div class="text-3xl font-bold text-green-600">85%</div>
          <div class="text-sm text-gray-500">风险等级: 中等 🟡</div>
        </div>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-4">
        <div class="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full" style="width: 85%"></div>
      </div>
      <div class="flex justify-between text-xs text-gray-500 mt-2">
        <span>危险 (0-30%)</span>
        <span>警告 (30-60%)</span>
        <span>安全 (60-100%)</span>
      </div>
    </div>

    <!-- 绑定的交易所 -->
    <div class="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">绑定的交易所</h3>
        <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
          绑定新交易所
        </button>
      </div>

      <div class="space-y-4">
        <div
          v-for="exchange in exchanges"
          :key="exchange.id"
          class="border-2 border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-all duration-200"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-3 mb-2">
                <div class="text-2xl">{{ exchange.icon }}</div>
                <div>
                  <h4 class="text-lg font-semibold text-gray-900">{{ exchange.name }}</h4>
                  <div class="flex items-center space-x-2 text-sm">
                    <span :class="[
                      'flex items-center space-x-1',
                      exchange.status === 'connected' ? 'text-green-600' : 'text-red-600'
                    ]">
                      <span :class="[
                        'w-2 h-2 rounded-full',
                        exchange.status === 'connected' ? 'bg-green-500' : 'bg-red-500'
                      ]"></span>
                      <span>{{ exchange.status === 'connected' ? '已连接' : '未连接' }}</span>
                    </span>
                    <span class="text-gray-400">•</span>
                    <span class="text-gray-500">最后同步: {{ exchange.lastSync }}</span>
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4 mt-3 p-3 bg-gray-50 rounded-lg">
                <div>
                  <div class="text-xs text-gray-500 mb-1">合约账户余额</div>
                  <div class="text-lg font-bold text-gray-900">${{ exchange.balance.toLocaleString() }}</div>
                </div>
                <div>
                  <div class="text-xs text-gray-500 mb-1">今日盈亏</div>
                  <div :class="[
                    'text-lg font-bold',
                    exchange.todayPnL >= 0 ? 'text-green-600' : 'text-red-600'
                  ]">
                    {{ exchange.todayPnL >= 0 ? '+' : '' }}${{ exchange.todayPnL }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="flex items-center space-x-3 mt-4">
            <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
              同步余额
            </button>
            <button class="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors text-sm font-medium">
              查看详情
            </button>
            <button class="px-4 py-2 border-2 border-red-300 text-red-700 rounded-lg hover:border-red-400 hover:bg-red-50 transition-colors text-sm font-medium">
              解绑
            </button>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="exchanges.length === 0" class="text-center py-8">
        <div class="text-4xl mb-3">🔗</div>
        <p class="text-gray-600 mb-4">还没有绑定交易所</p>
        <button class="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium">
          绑定交易所
        </button>
      </div>
    </div>

    <!-- 资金流水 -->
    <div class="bg-white rounded-2xl border border-gray-200 p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">资金流水</h3>
        <div class="flex items-center space-x-2">
          <button
            v-for="filter in flowFilters"
            :key="filter.id"
            @click="activeFlowFilter = filter.id"
            :class="[
              'px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200',
              activeFlowFilter === filter.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            ]"
          >
            {{ filter.name }}
          </button>
          <button class="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors text-sm font-medium">
            导出
          </button>
        </div>
      </div>

      <!-- 流水列表 -->
      <div class="overflow-hidden">
        <table class="min-w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">时间</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">类型</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">金额</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">余额</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">备注</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="flow in filteredFlows" :key="flow.id" class="hover:bg-gray-50">
              <td class="px-4 py-3 text-sm text-gray-900">{{ flow.time }}</td>
              <td class="px-4 py-3">
                <span :class="[
                  'px-2 py-1 rounded text-xs font-medium',
                  flow.type === 'profit' ? 'bg-green-100 text-green-800' :
                  flow.type === 'loss' ? 'bg-red-100 text-red-800' :
                  flow.type === 'deposit' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                ]">
                  {{ getFlowTypeLabel(flow.type) }}
                </span>
              </td>
              <td class="px-4 py-3 text-right">
                <span :class="[
                  'text-sm font-bold',
                  flow.amount >= 0 ? 'text-green-600' : 'text-red-600'
                ]">
                  {{ flow.amount >= 0 ? '+' : '' }}${{ Math.abs(flow.amount).toLocaleString() }}
                </span>
              </td>
              <td class="px-4 py-3 text-right text-sm text-gray-900">${{ flow.balance.toLocaleString() }}</td>
              <td class="px-4 py-3 text-sm text-gray-500">{{ flow.note }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 绑定的交易所（模拟数据）
const exchanges = ref([
  {
    id: 1,
    name: 'Binance',
    icon: '🟡',
    status: 'connected',
    balance: 12500,
    todayPnL: 234.56,
    lastSync: '2分钟前'
  }
])

// 资金流水筛选
const activeFlowFilter = ref('all')
const flowFilters = ref([
  { id: 'all', name: '全部' },
  { id: 'income', name: '收入' },
  { id: 'expense', name: '支出' }
])

// 资金流水数据（模拟）
const flows = ref([
  {
    id: 1,
    time: '01-15 14:30',
    type: 'profit',
    amount: 234.56,
    balance: 12500,
    note: 'BTC/USDT 平仓盈利'
  },
  {
    id: 2,
    time: '01-15 10:20',
    type: 'margin',
    amount: -2250,
    balance: 12265.44,
    note: 'BTC/USDT 开仓保证金'
  },
  {
    id: 3,
    time: '01-14 16:45',
    type: 'profit',
    amount: 123.45,
    balance: 14515.44,
    note: 'ETH/USDT 平仓盈利'
  },
  {
    id: 4,
    time: '01-14 09:15',
    type: 'margin',
    amount: -960,
    balance: 14391.99,
    note: 'ETH/USDT 开仓保证金'
  },
  {
    id: 5,
    time: '01-13 18:00',
    type: 'deposit',
    amount: 5000,
    balance: 15351.99,
    note: '充值'
  },
  {
    id: 6,
    time: '01-13 10:30',
    type: 'fee',
    amount: -12.50,
    balance: 10351.99,
    note: '交易手续费'
  }
])

// 过滤资金流水
const filteredFlows = computed(() => {
  if (activeFlowFilter.value === 'all') {
    return flows.value
  } else if (activeFlowFilter.value === 'income') {
    return flows.value.filter(f => f.amount >= 0)
  } else {
    return flows.value.filter(f => f.amount < 0)
  }
})

// 获取流水类型标签
const getFlowTypeLabel = (type) => {
  const labels = {
    profit: '平仓盈利',
    loss: '平仓亏损',
    margin: '开仓保证金',
    deposit: '充值',
    withdraw: '提现',
    fee: '手续费'
  }
  return labels[type] || type
}
</script>

