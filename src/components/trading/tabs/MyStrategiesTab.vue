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
          <span v-if="filter.count" class="ml-2">{{ filter.count }}</span>
        </button>
      </div>
    </div>

    <!-- 策略列表 -->
    <div class="space-y-6">
      <div
        v-for="strategy in filteredStrategies"
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
                strategy.source === 'ai' ? 'bg-purple-100 text-purple-800' :
                strategy.source === 'subscribed' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              ]">
                {{ getSourceLabel(strategy.source) }}
              </span>
            </div>
            <p class="text-gray-600 text-sm mb-2">{{ strategy.description }}</p>
            <div class="flex items-center space-x-4 text-sm text-gray-500">
              <span v-if="strategy.sourceDetail">{{ strategy.sourceDetail }}</span>
              <span v-if="strategy.autoTrade" class="text-blue-600">🤖 自动交易</span>
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

        <!-- 收益数据 -->
        <div class="grid grid-cols-4 gap-4 mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
          <div>
            <div class="text-xs text-gray-500 mb-1">我的收益</div>
            <div :class="['text-lg font-bold', strategy.myReturn >= 0 ? 'text-green-600' : 'text-red-600']">
              {{ strategy.myReturn >= 0 ? '+' : '' }}${{ strategy.myReturn }}
            </div>
            <div class="text-xs text-gray-500">{{ strategy.myReturnPercent >= 0 ? '+' : '' }}{{ strategy.myReturnPercent }}%</div>
          </div>
          <div>
            <div class="text-xs text-gray-500 mb-1">今日交易</div>
            <div class="text-lg font-bold text-gray-900">{{ strategy.todayTrades }}次</div>
          </div>
          <div>
            <div class="text-xs text-gray-500 mb-1">当前持仓</div>
            <div class="text-lg font-bold text-gray-900">{{ strategy.currentPositions }}个</div>
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
            编辑
          </button>
          <button
            v-if="strategy.canShare && !strategy.isShared"
            class="px-6 py-2 border-2 border-blue-300 text-blue-700 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors font-medium"
          >
            分享到社区
          </button>
          <button class="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            查看详情
          </button>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredStrategies.length === 0" class="bg-white rounded-2xl border border-gray-200 p-12 text-center">
      <div class="text-6xl mb-4">📊</div>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">暂无策略</h3>
      <p class="text-gray-600 mb-6">去AI策略生成器创建您的第一个策略吧</p>
      <button
        @click="goToAI"
        class="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium"
      >
        AI生成策略
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 筛选器
const activeFilter = ref('all')
const filters = ref([
  { id: 'all', name: '全部', count: 5 },
  { id: 'running', name: '运行中', count: 3 },
  { id: 'paused', name: '已暂停', count: 1 },
  { id: 'draft', name: '草稿', count: 1 }
])

// 策略数据（模拟）
const strategies = ref([
  {
    id: 1,
    name: 'BTC网格交易策略',
    description: '适合震荡市场的BTC网格交易策略，自动低买高卖',
    source: 'ai',
    sourceDetail: 'Coze AI生成',
    status: 'running',
    autoTrade: true,
    myReturn: 456.78,
    myReturnPercent: 12.3,
    todayTrades: 5,
    currentPositions: 1,
    runningDays: 15,
    canShare: true,
    isShared: false
  },
  {
    id: 2,
    name: 'ETH趋势跟踪策略',
    description: '基于移动平均线的ETH趋势跟踪策略',
    source: 'subscribed',
    sourceDetail: '订阅自 CryptoMaster',
    status: 'paused',
    autoTrade: false,
    myReturn: 789.12,
    myReturnPercent: 23.4,
    todayTrades: 0,
    currentPositions: 0,
    runningDays: 30,
    canShare: false,
    isShared: false
  },
  {
    id: 3,
    name: 'DCA定投策略',
    description: '定期定额投资策略，降低市场波动风险',
    source: 'custom',
    sourceDetail: '自己创建',
    status: 'running',
    autoTrade: true,
    myReturn: 234.56,
    myReturnPercent: 8.9,
    todayTrades: 2,
    currentPositions: 0,
    runningDays: 45,
    canShare: true,
    isShared: false
  }
])

// 过滤策略
const filteredStrategies = computed(() => {
  if (activeFilter.value === 'all') {
    return strategies.value
  }
  return strategies.value.filter(s => s.status === activeFilter.value)
})

// 方法
const getSourceLabel = (source) => {
  const labels = {
    ai: '🤖 AI生成',
    subscribed: '📊 已订阅',
    custom: '✏️ 自定义',
    shared: '🌟 已分享'
  }
  return labels[source] || source
}

const getStatusLabel = (status) => {
  const labels = {
    running: '运行中',
    paused: '已暂停',
    draft: '草稿'
  }
  return labels[status] || status
}

const startStrategy = (id) => {
  const strategy = strategies.value.find(s => s.id === id)
  if (strategy) {
    strategy.status = 'running'
    console.log('启动策略:', id)
  }
}

const pauseStrategy = (id) => {
  const strategy = strategies.value.find(s => s.id === id)
  if (strategy) {
    strategy.status = 'paused'
    console.log('暂停策略:', id)
  }
}

const goToAI = () => {
  router.push('/ai-strategy')
}
</script>

