<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <Header />

    <div class="max-w-7xl mx-auto pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div class="flex gap-8 relative">
        <!-- 用户侧边栏 -->
        <div class="w-64 flex-shrink-0">
          <UserSidebar activeItem="strategies" />
        </div>

        <!-- 主内容区域 -->
        <main class="flex-1 min-w-0">
          <!-- 页面标题 -->
          <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900">我的合约策略</h1>
            <p class="text-gray-600 mt-2">管理和监控您正在使用的交易策略</p>
          </div>

          <!-- 总览卡片 -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-white rounded-2xl border border-gray-200 p-6">
              <div class="text-sm text-gray-500 mb-2">总收益</div>
              <div class="text-3xl font-bold text-green-600">+$1,234.56</div>
              <div class="text-xs text-gray-500 mt-2">+15.8%</div>
            </div>
            <div class="bg-white rounded-2xl border border-gray-200 p-6">
              <div class="text-sm text-gray-500 mb-2">今日收益</div>
              <div class="text-3xl font-bold text-green-600">+$45.67</div>
              <div class="text-xs text-gray-500 mt-2">+2.3%</div>
            </div>
            <div class="bg-white rounded-2xl border border-gray-200 p-6">
              <div class="text-sm text-gray-500 mb-2">运行中策略</div>
              <div class="text-3xl font-bold text-gray-900">3</div>
              <div class="text-xs text-gray-500 mt-2">共5个策略</div>
            </div>
          </div>

          <!-- 策略列表 -->
          <div class="space-y-6">
            <div
              v-for="strategy in myStrategies"
              :key="strategy.id"
              class="bg-white rounded-xl border-2 border-gray-200 p-6 hover:shadow-lg transition-all duration-200"
            >
              <!-- 头部 -->
              <div class="flex items-start justify-between mb-4">
                <div class="flex-1">
                  <div class="flex items-center space-x-3 mb-2">
                    <h3 class="text-xl font-semibold text-gray-900">{{ strategy.name }}</h3>
                    <span :class="[
                      'px-2 py-1 rounded text-xs font-medium',
                      strategy.risk === 'low' ? 'bg-green-100 text-green-800' :
                      strategy.risk === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    ]">
                      {{ getRiskLabel(strategy.risk) }}
                    </span>
                    <span class="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      {{ getCategoryLabel(strategy.category) }}
                    </span>
                  </div>
                  <p class="text-gray-600 text-sm mb-3">{{ strategy.description }}</p>
                  <div class="flex items-center space-x-4 text-sm text-gray-500">
                    <span>订阅时间: {{ strategy.subscribedAt }}</span>
                    <span v-if="strategy.status === 'running'">最后交易: {{ strategy.lastTradeTime }}</span>
                  </div>
                </div>
                <span :class="[
                  'px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1',
                  strategy.status === 'running' ? 'bg-green-100 text-green-800' : 
                  strategy.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                ]">
                  <span :class="[
                    'w-2 h-2 rounded-full',
                    strategy.status === 'running' ? 'bg-green-500' :
                    strategy.status === 'paused' ? 'bg-yellow-500' :
                    'bg-gray-500'
                  ]"></span>
                  <span>{{ getStatusLabel(strategy.status) }}</span>
                </span>
              </div>

              <!-- 我的收益数据 -->
              <div class="grid grid-cols-5 gap-4 mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                <div>
                  <div class="text-xs text-gray-500 mb-1">我的收益</div>
                  <div :class="['text-lg font-bold', strategy.myReturn >= 0 ? 'text-green-600' : 'text-red-600']">
                    {{ strategy.myReturn >= 0 ? '+' : '' }}${{ strategy.myReturn }}
                  </div>
                  <div class="text-xs text-gray-500">{{ strategy.myReturnPercent >= 0 ? '+' : '' }}{{ strategy.myReturnPercent }}%</div>
                </div>
                <div>
                  <div class="text-xs text-gray-500 mb-1">今日收益</div>
                  <div :class="['text-lg font-bold', strategy.todayReturn >= 0 ? 'text-green-600' : 'text-red-600']">
                    {{ strategy.todayReturn >= 0 ? '+' : '' }}${{ strategy.todayReturn }}
                  </div>
                </div>
                <div>
                  <div class="text-xs text-gray-500 mb-1">今日交易</div>
                  <div class="text-lg font-bold text-gray-900">{{ strategy.todayTrades }}次</div>
                </div>
                <div>
                  <div class="text-xs text-gray-500 mb-1">胜率</div>
                  <div class="text-lg font-bold text-gray-900">{{ strategy.winRate }}%</div>
                </div>
                <div>
                  <div class="text-xs text-gray-500 mb-1">运行天数</div>
                  <div class="text-lg font-bold text-gray-900">{{ strategy.runningDays }}天</div>
                </div>
              </div>

              <!-- 操作按钮 -->
              <div class="flex items-center space-x-3">
                <button
                  v-if="strategy.status === 'running'"
                  @click="pauseStrategy(strategy.id)"
                  class="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium"
                >
                  暂停
                </button>
                <button
                  v-else
                  @click="startStrategy(strategy.id)"
                  class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  启动
                </button>
                <button class="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors font-medium">
                  调整参数
                </button>
                <button class="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  查看详情
                </button>
                <button class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- 空状态 -->
          <div v-if="myStrategies.length === 0" class="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <div class="text-6xl mb-4">📊</div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">暂无策略</h3>
            <p class="text-gray-600 mb-6">您还没有订阅任何策略，去策略市场看看吧</p>
            <button
              @click="goToMarket"
              class="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium"
            >
              前往策略市场
            </button>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Header from '../common/Header.vue'
import UserSidebar from '../common/UserSidebar.vue'

const router = useRouter()

// 我的策略数据（模拟数据）
const myStrategies = ref([
  {
    id: 1,
    name: 'BTC网格交易策略',
    description: '适合震荡市场的BTC网格交易策略，自动低买高卖',
    category: 'grid',
    risk: 'low',
    status: 'running',
    myReturn: 456.78,
    myReturnPercent: 12.3,
    todayReturn: 23.45,
    todayTrades: 5,
    winRate: 72,
    runningDays: 15,
    subscribedAt: '2024-01-01',
    lastTradeTime: '2小时前'
  },
  {
    id: 2,
    name: 'ETH趋势跟踪策略',
    description: '基于移动平均线的ETH趋势跟踪策略',
    category: 'trend',
    risk: 'medium',
    status: 'paused',
    myReturn: 789.12,
    myReturnPercent: 23.4,
    todayReturn: 0,
    todayTrades: 0,
    winRate: 68,
    runningDays: 30,
    subscribedAt: '2023-12-15',
    lastTradeTime: '5小时前'
  },
  {
    id: 3,
    name: 'DCA定投策略',
    description: '定期定额投资策略，降低市场波动风险',
    category: 'dca',
    risk: 'low',
    status: 'running',
    myReturn: 234.56,
    myReturnPercent: 8.9,
    todayReturn: 12.34,
    todayTrades: 2,
    winRate: 65,
    runningDays: 45,
    subscribedAt: '2023-11-20',
    lastTradeTime: '1小时前'
  }
])

// 方法
const getRiskLabel = (risk) => {
  const labels = { low: '低风险', medium: '中风险', high: '高风险' }
  return labels[risk] || risk
}

const getCategoryLabel = (category) => {
  const labels = {
    grid: '网格交易',
    trend: '趋势跟踪',
    arbitrage: '套利',
    dca: '定投',
    swing: '波段交易'
  }
  return labels[category] || category
}

const getStatusLabel = (status) => {
  const labels = {
    running: '运行中',
    paused: '已暂停',
    stopped: '已停止'
  }
  return labels[status] || status
}

const startStrategy = (id) => {
  const strategy = myStrategies.value.find(s => s.id === id)
  if (strategy) {
    strategy.status = 'running'
    console.log('启动策略:', id)
  }
}

const pauseStrategy = (id) => {
  const strategy = myStrategies.value.find(s => s.id === id)
  if (strategy) {
    strategy.status = 'paused'
    console.log('暂停策略:', id)
  }
}

const goToMarket = () => {
  router.push('/strategies')
}
</script>

