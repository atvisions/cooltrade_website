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

    <!-- Loading 状态 -->
    <div v-if="isLoading" class="bg-white rounded-xl border border-gray-200 p-12 text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p class="text-gray-600">加载策略中...</p>
    </div>

    <!-- 策略列表 -->
    <div v-else class="space-y-6">
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
      <p class="text-gray-600 mb-6">去策略生成器创建您的第一个策略吧</p>
      <button
        @click="goToAI"
        class="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium"
      >
        生成策略
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { apiRequest, API_ENDPOINTS } from '../../../utils/api'

const router = useRouter()

// 筛选器
const activeFilter = ref('all')
const filters = ref([
  { id: 'all', name: '全部', count: 0 },
  { id: 'running', name: '运行中', count: 0 },
  { id: 'paused', name: '已暂停', count: 0 },
  { id: 'draft', name: '草稿', count: 0 }
])

// 策略数据
const strategies = ref([])
const isLoading = ref(false)

// 加载策略列表
const loadStrategies = async () => {
  isLoading.value = true
  try {
    // 加载 AI 生成的策略（只加载已保存的）
    const aiResponse = await apiRequest(`${API_ENDPOINTS.AI_STRATEGY_LIST}?saved_only=true`)

    if (aiResponse.status === 'success' && aiResponse.data) {
      // 转换 AI 生成的策略数据格式
      const aiStrategies = aiResponse.data.map(strategy => ({
        id: strategy.id,
        name: strategy.title || `${strategy.token_symbol} 策略`,
        description: strategy.summary || '基于 AI 分析生成的交易策略',
        source: 'ai',
        sourceDetail: 'AI 生成',
        status: strategy.is_applied ? 'running' : 'draft',
        autoTrade: strategy.is_applied,
        myReturn: 0,  // TODO: 从交易记录计算
        myReturnPercent: 0,
        todayTrades: 0,
        currentPositions: 0,
        runningDays: calculateRunningDays(strategy.created_at),
        canShare: !strategy.visibility || strategy.visibility === 'private',
        isShared: strategy.visibility === 'public',
        // 保留原始数据
        rawData: strategy
      }))

      strategies.value = aiStrategies

      // 更新筛选器计数
      updateFilterCounts()
    }
  } catch (error) {
    console.error('加载策略失败:', error)
  } finally {
    isLoading.value = false
  }
}

// 计算运行天数
const calculateRunningDays = (createdAt) => {
  const created = new Date(createdAt)
  const now = new Date()
  const diff = now - created
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

// 更新筛选器计数
const updateFilterCounts = () => {
  filters.value[0].count = strategies.value.length
  filters.value[1].count = strategies.value.filter(s => s.status === 'running').length
  filters.value[2].count = strategies.value.filter(s => s.status === 'paused').length
  filters.value[3].count = strategies.value.filter(s => s.status === 'draft').length
}

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

const startStrategy = async (id) => {
  const strategy = strategies.value.find(s => s.id === id)
  if (!strategy) return

  try {
    // 应用策略到交易系统
    const response = await apiRequest(API_ENDPOINTS.AI_STRATEGY_APPLY, {
      method: 'POST',
      body: JSON.stringify({ strategy_id: id })
    })

    if (response.status === 'success') {
      strategy.status = 'running'
      strategy.autoTrade = true
      console.log('启动策略:', id)
      alert('策略已启动并应用到交易系统')
    }
  } catch (error) {
    console.error('启动策略失败:', error)
    alert('启动策略失败，请稍后重试')
  }
}

const pauseStrategy = async (id) => {
  const strategy = strategies.value.find(s => s.id === id)
  if (!strategy) return

  try {
    // TODO: 实现暂停策略的 API
    strategy.status = 'paused'
    strategy.autoTrade = false
    console.log('暂停策略:', id)
    alert('策略已暂停')
  } catch (error) {
    console.error('暂停策略失败:', error)
    alert('暂停策略失败，请稍后重试')
  }
}

const goToAI = () => {
  router.push('/ai-strategy')
}

// 页面加载
onMounted(() => {
  loadStrategies()
})
</script>

