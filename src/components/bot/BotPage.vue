<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <!-- Header -->
    <Header />

    <!-- 主容器 - 包含侧边栏和内容 -->
    <div class="max-w-7xl mx-auto pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div class="flex gap-8 relative">
        <!-- 用户侧边栏 -->
        <div class="w-64 flex-shrink-0">
          <UserSidebar activeItem="bots" />
        </div>

        <!-- 主内容区域 -->
        <main class="flex-1 min-w-0">
        <!-- 页面标题和创建按钮 -->
        <div class="mb-6 flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">我的机器人</h1>
            <p class="mt-2 text-gray-600">管理您的交易机器人，自动化您的交易策略</p>
          </div>
          <button
            @click="showCreateModal = true"
            class="flex items-center px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <PlusIcon class="h-5 w-5 mr-2" />
            创建机器人
          </button>
        </div>

        <!-- 统计卡片 -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">总机器人</p>
                <p class="text-2xl font-bold text-gray-900 mt-1">{{ statistics.total_bots }}</p>
              </div>
              <div class="p-3 bg-blue-100 rounded-lg">
                <CpuChipIcon class="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">运行中</p>
                <p class="text-2xl font-bold text-green-600 mt-1">{{ statistics.running_bots }}</p>
              </div>
              <div class="p-3 bg-green-100 rounded-lg">
                <PlayIcon class="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">总盈亏</p>
                <p class="text-2xl font-bold mt-1" :class="statistics.total_profit >= 0 ? 'text-green-600' : 'text-red-600'">
                  {{ formatCurrency(statistics.total_profit) }}
                </p>
              </div>
              <div class="p-3 bg-purple-100 rounded-lg">
                <CurrencyDollarIcon class="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">胜率</p>
                <p class="text-2xl font-bold text-gray-900 mt-1">{{ statistics.win_rate }}%</p>
              </div>
              <div class="p-3 bg-yellow-100 rounded-lg">
                <ChartBarIcon class="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        <!-- 操作栏 -->
        <div class="flex justify-between items-center mb-6">
          <div class="flex items-center space-x-4">
            <!-- 类型筛选按钮 -->
            <div class="flex space-x-2">
              <button
                v-for="typeFilter in typeFilters"
                :key="typeFilter.value"
                @click="currentTypeFilter = typeFilter.value"
                :class="[
                  'px-4 py-2 rounded-lg font-medium transition-colors',
                  currentTypeFilter === typeFilter.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                ]"
              >
                {{ typeFilter.label }}
              </button>
            </div>

            <!-- 状态筛选下拉 -->
            <select
              v-model="currentStatusFilter"
              class="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">全部状态</option>
              <option value="running">运行中</option>
              <option value="paused">已暂停</option>
              <option value="stopped">已停止</option>
              <option value="draft">草稿</option>
            </select>
          </div>

          <!-- 创建机器人按钮 -->
          <button
            @click="showCreateModal = true"
            class="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon class="h-5 w-5 mr-2" />
            创建机器人
          </button>
        </div>

        <!-- 机器人列表 -->
        <div v-if="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p class="mt-4 text-gray-600">加载中...</p>
        </div>

        <div v-else-if="filteredBots.length === 0" class="bg-white rounded-lg shadow p-12 text-center">
          <CpuChipIcon class="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">还没有机器人</h3>
          <p class="text-gray-600 mb-6">创建您的第一个交易机器人，开始自动化交易</p>
          <button
            @click="showCreateModal = true"
            class="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon class="h-5 w-5 mr-2" />
            创建机器人
          </button>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <BotCard
            v-for="bot in filteredBots"
            :key="bot.id"
            :bot="bot"
            @start="handleStartBot"
            @stop="handleStopBot"
            @pause="handlePauseBot"
            @edit="handleEditBot"
            @delete="handleDeleteBot"
            @view="handleViewBot"
          />
        </div>
        </main>
      </div>
    </div>

    <!-- 创建/编辑机器人模态框 -->
    <CreateBotModal
      v-if="showCreateModal"
      :bot="editingBot"
      @close="showCreateModal = false; editingBot = null"
      @success="handleBotCreated"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Header from '../common/Header.vue'
import UserSidebar from '../common/UserSidebar.vue'
import BotCard from './BotCard.vue'
import CreateBotModal from './CreateBotModal.vue'
import {
  CpuChipIcon,
  PlayIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  PlusIcon,
} from '@heroicons/vue/24/outline'
import { botAPI } from '../../utils/api'

const router = useRouter()
const route = useRoute()

// 状态
const loading = ref(false)
const bots = ref([])
const statistics = ref({
  total_bots: 0,
  running_bots: 0,
  paused_bots: 0,
  total_profit: 0,
  total_trades: 0,
  win_rate: 0,
  best_bot: null,
  recent_signals: []
})
const currentTypeFilter = ref('all')
const currentStatusFilter = ref('all')
const showCreateModal = ref(false)
const editingBot = ref(null)

// 类型筛选选项
const typeFilters = [
  { label: '全部', value: 'all' },
  { label: '信号机器人', value: 'signal' },
  { label: '趋势跟踪', value: 'trend_following' },
  { label: '突破机器人', value: 'breakout' },
  { label: '马丁格尔', value: 'martingale' },
  { label: '套利机器人', value: 'arbitrage' },
]

// 计算属性
const filteredBots = computed(() => {
  let result = bots.value

  // 按类型筛选
  if (currentTypeFilter.value !== 'all') {
    result = result.filter(bot => bot.bot_type === currentTypeFilter.value)
  }

  // 按状态筛选
  if (currentStatusFilter.value !== 'all') {
    result = result.filter(bot => bot.status === currentStatusFilter.value)
  }

  return result
})

// 格式化货币
const formatCurrency = (value) => {
  const numValue = parseFloat(value || 0)
  if (numValue > 0 && numValue < 0.01) {
    return '$' + numValue.toLocaleString('en-US', {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4
    })
  }
  return '$' + numValue.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

// 加载机器人列表
const loadBots = async () => {
  try {
    loading.value = true
    const response = await botAPI.getBotList()
    if (response.success !== false) {
      bots.value = Array.isArray(response) ? response : (response.data || [])
    }
  } catch (error) {
    console.error('加载机器人列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 加载统计数据
const loadStatistics = async () => {
  try {
    const response = await botAPI.getBotStatistics()
    if (response.success) {
      statistics.value = response.data
    }
  } catch (error) {
    console.error('加载统计数据失败:', error)
  }
}

// 启动机器人
const handleStartBot = async (bot) => {
  try {
    const response = await botAPI.startBot(bot.id)
    if (response.success) {
      await loadBots()
      await loadStatistics()
    }
  } catch (error) {
    console.error('启动机器人失败:', error)
    alert(error.message || '启动机器人失败')
  }
}

// 停止机器人
const handleStopBot = async (bot) => {
  try {
    const response = await botAPI.stopBot(bot.id)
    if (response.success) {
      await loadBots()
      await loadStatistics()
    }
  } catch (error) {
    console.error('停止机器人失败:', error)
    alert(error.message || '停止机器人失败')
  }
}

// 暂停机器人
const handlePauseBot = async (bot) => {
  try {
    const response = await botAPI.pauseBot(bot.id)
    if (response.success) {
      await loadBots()
      await loadStatistics()
    }
  } catch (error) {
    console.error('暂停机器人失败:', error)
    alert(error.message || '暂停机器人失败')
  }
}

// 编辑机器人
const handleEditBot = (bot) => {
  editingBot.value = bot
  showCreateModal.value = true
}

// 删除机器人
const handleDeleteBot = async (bot) => {
  if (!confirm(`确定要删除机器人"${bot.name}"吗？`)) {
    return
  }

  try {
    const response = await botAPI.deleteBot(bot.id)
    if (response.success !== false) {
      await loadBots()
      await loadStatistics()
    }
  } catch (error) {
    console.error('删除机器人失败:', error)
    alert(error.message || '删除机器人失败')
  }
}

// 查看机器人详情
const handleViewBot = (bot) => {
  router.push(`/bots/${bot.id}`)
}

// 机器人创建/更新成功
const handleBotCreated = async () => {
  showCreateModal.value = false
  editingBot.value = null
  await loadBots()
  await loadStatistics()
}

// 监听路由变化，自动设置筛选
watch(() => route.query.type, (newType) => {
  if (newType) {
    currentTypeFilter.value = newType
  } else {
    currentTypeFilter.value = 'all'
  }
}, { immediate: true })

// 初始化
onMounted(() => {
  loadBots()
  loadStatistics()
})
</script>

