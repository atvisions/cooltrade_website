<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
    <Header />
    <div class="max-w-7xl mx-auto pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div class="flex gap-8 relative">
        <div class="w-64 flex-shrink-0">
          <UserSidebar activeItem="signal-bots" />
        </div>
        <main class="flex-1 min-w-0">
          <!-- 返回按钮 -->
          <button
            @click="handleBack"
            class="mb-8 flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            返回列表
          </button>

          <!-- 加载状态 -->
          <div v-if="loading" class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p class="text-slate-500">加载中...</p>
          </div>

          <!-- 机器人详情 -->
          <div v-else-if="bot" class="space-y-8">
            <!-- 基本信息卡片 -->
            <div class="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
              <div class="flex items-start justify-between mb-8">
                <div class="flex-1">
                  <div class="flex items-center gap-4 mb-4">
                    <div class="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                      <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                      </svg>
                    </div>
                    <div>
                      <h1 class="text-4xl font-bold text-slate-900">{{ bot.name }}</h1>
                      <p class="text-slate-500 mt-2">{{ bot.description }}</p>
                    </div>
                  </div>
                </div>
                <div class="flex gap-3">
                  <button
                    v-if="bot.status !== 'running'"
                    @click="handleStartBot"
                    :disabled="actionLoading"
                    class="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {{ actionLoading ? '启动中...' : '启动' }}
                  </button>
                  <button
                    v-else
                    @click="handleStopBot"
                    :disabled="actionLoading"
                    class="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {{ actionLoading ? '停止中...' : '停止' }}
                  </button>
                  <button
                    @click="handleEditBot"
                    class="px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all"
                  >
                    编辑
                  </button>
                </div>
              </div>

              <!-- 基础信息网格 -->
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-purple-300 transition-colors">
                  <p class="text-xs font-medium text-slate-600 uppercase tracking-wider">类型</p>
                  <p class="text-lg font-semibold text-slate-900 mt-2">信号机器人</p>
                </div>
                <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-green-300 transition-colors">
                  <p class="text-xs font-medium text-slate-600 uppercase tracking-wider">状态</p>
                  <div class="mt-2">
                    <span :class="[
                      'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
                      bot.status === 'running'
                        ? 'bg-green-100 text-green-700'
                        : bot.status === 'paused'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    ]">
                      {{ getStatusLabel(bot.status) }}
                    </span>
                  </div>
                </div>
                <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors">
                  <p class="text-xs font-medium text-slate-600 uppercase tracking-wider">交易对</p>
                  <p class="text-lg font-semibold text-slate-900 mt-2">{{ bot.token_symbol }}/{{ bot.trading_pair }}</p>
                </div>
                <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-amber-300 transition-colors">
                  <p class="text-xs font-medium text-slate-600 uppercase tracking-wider">交易所</p>
                  <p class="text-lg font-semibold text-slate-900 mt-2">{{ bot.exchange_name }}</p>
                </div>
              </div>
            </div>

            <!-- 信号配置信息 -->
            <div class="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
              <h2 class="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <svg class="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                信号配置
              </h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="p-4 bg-gradient-to-br from-purple-50 to-white rounded-xl border border-purple-200">
                  <p class="text-sm font-medium text-slate-600 mb-2">信号类型</p>
                  <p class="text-xl font-semibold text-slate-900">{{ getSignalTypeLabel(bot.signal_bot?.signal_type) }}</p>
                </div>
                <div class="p-4 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-200">
                  <p class="text-sm font-medium text-slate-600 mb-2">检查间隔</p>
                  <p class="text-xl font-semibold text-slate-900">{{ formatCheckInterval(bot.signal_bot?.check_interval) }}</p>
                </div>
                <div class="p-4 bg-gradient-to-br from-green-50 to-white rounded-xl border border-green-200">
                  <p class="text-sm font-medium text-slate-600 mb-2">邮件通知</p>
                  <span :class="[
                    'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                    bot.signal_bot?.notify_email ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  ]">
                    {{ bot.signal_bot?.notify_email ? '已启用' : '未启用' }}
                  </span>
                </div>
                <div class="p-4 bg-gradient-to-br from-amber-50 to-white rounded-xl border border-amber-200">
                  <p class="text-sm font-medium text-slate-600 mb-2">应用内通知</p>
                  <span :class="[
                    'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                    bot.signal_bot?.notify_app ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  ]">
                    {{ bot.signal_bot?.notify_app ? '已启用' : '未启用' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Token 信息 -->
            <div class="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
              <h2 class="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Token 信息
              </h2>
              <div class="flex items-center gap-6">
                <img 
                  v-if="bot.token_logo" 
                  :src="bot.token_logo" 
                  :alt="bot.token_name"
                  class="w-16 h-16 rounded-full border-2 border-slate-200"
                />
                <div class="flex-1">
                  <h3 class="text-2xl font-bold text-slate-900">{{ bot.token_name }}</h3>
                  <p class="text-lg text-slate-600">{{ bot.token_symbol }}</p>
                </div>
                <div class="text-right">
                  <p class="text-sm text-slate-600">当前价格</p>
                  <p class="text-3xl font-bold text-blue-600">${{ formatPrice(bot.token_current_price) }}</p>
                </div>
              </div>
            </div>

            <!-- 最近信号 -->
            <div class="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
              <h2 class="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <svg class="h-6 w-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                最近信号
              </h2>
              
              <!-- 加载状态 -->
              <div v-if="loadingSignals" class="text-center py-8">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                <p class="text-slate-500 mt-2">加载信号中...</p>
              </div>

              <!-- 信号列表 -->
              <div v-else-if="signals.length > 0" class="space-y-4">
                <div 
                  v-for="signal in signals" 
                  :key="signal.id"
                  class="p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-purple-300 transition-colors"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <div class="flex items-center gap-3 mb-2">
                        <span :class="[
                          'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                          signal.signal_type === 'buy' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        ]">
                          {{ signal.signal_type === 'buy' ? '买入信号' : '卖出信号' }}
                        </span>
                        <span class="text-sm text-slate-500">{{ formatDate(signal.created_at) }}</span>
                      </div>
                      <p class="text-slate-900 font-medium">{{ signal.message }}</p>
                      <p class="text-sm text-slate-600 mt-1">价格: ${{ formatPrice(signal.price) }}</p>
                    </div>
                    <span :class="[
                      'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
                      signal.status === 'active' ? 'bg-blue-100 text-blue-700' :
                      signal.status === 'executed' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    ]">
                      {{ getSignalStatusLabel(signal.status) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- 空状态 -->
              <div v-else class="text-center py-12">
                <svg class="mx-auto h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                </svg>
                <p class="text-slate-500 mt-4">暂无信号记录</p>
              </div>
            </div>
          </div>

          <!-- 错误状态 -->
          <div v-else class="text-center py-12">
            <p class="text-slate-500">加载失败，请重试</p>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Header from '../../common/Header.vue'
import UserSidebar from '../../common/UserSidebar.vue'
import { botAPI } from '../../../utils/api'
import { showSuccess, showError } from '../../../utils/notification'

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const actionLoading = ref(false)
const loadingSignals = ref(false)
const bot = ref(null)
const signals = ref([])

// 定时刷新
let refreshInterval = null

const loadBot = async () => {
  try {
    loading.value = true
    const response = await botAPI.getBotDetail(route.params.id)
    bot.value = response.data || response
  } catch (error) {
    console.error('加载机器人详情失败:', error)
    showError('加载机器人详情失败')
  } finally {
    loading.value = false
  }
}

const loadSignals = async () => {
  try {
    loadingSignals.value = true
    console.log('正在加载机器人信号，ID:', route.params.id)
    const response = await botAPI.getBotSignals(route.params.id, { page_size: 10 })
    console.log('信号API响应:', response)
    const data = response.results || response.data || response
    console.log('解析后的信号数据:', data)
    signals.value = Array.isArray(data) ? data : []
    console.log('设置的信号数量:', signals.value.length)
  } catch (error) {
    console.error('加载信号失败:', error)
    console.error('错误详情:', error.message, error.data)
    signals.value = []
  } finally {
    loadingSignals.value = false
  }
}

const handleStartBot = async () => {
  try {
    actionLoading.value = true
    await botAPI.startBot(bot.value.id)
    showSuccess('机器人已启动')
    await loadBot()
  } catch (error) {
    showError(error.message || '启动失败')
  } finally {
    actionLoading.value = false
  }
}

const handleStopBot = async () => {
  try {
    actionLoading.value = true
    await botAPI.stopBot(bot.value.id)
    showSuccess('机器人已停止')
    await loadBot()
  } catch (error) {
    showError(error.message || '停止失败')
  } finally {
    actionLoading.value = false
  }
}

const handleEditBot = () => {
  router.push(`/bots/edit-signal/${bot.value.id}`)
}

const handleBack = () => {
  router.push('/signal-bots')
}

const getStatusLabel = (status) => {
  const map = {
    running: '运行中',
    paused: '已暂停',
    stopped: '已停止',
    draft: '草稿'
  }
  return map[status] || status
}

const getSignalTypeLabel = (type) => {
  const map = {
    price_alert: '价格提醒',
    technical_indicator: '技术指标',
    volume_alert: '成交量提醒',
    price_change: '价格变化'
  }
  return map[type] || type || '未知'
}

const getSignalStatusLabel = (status) => {
  const map = {
    active: '活跃',
    executed: '已执行',
    cancelled: '已取消',
    expired: '已过期'
  }
  return map[status] || status
}

const formatPrice = (value) => {
  if (!value) return '0.00'
  return parseFloat(value).toFixed(2)
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatCheckInterval = (interval) => {
  if (!interval) return '5 分钟'

  // 解析间隔字符串（如 "1m", "5m", "15m", "1h", "4h", "1d"）
  const match = interval.match(/^(\d+)([mhd])$/)
  if (!match) return interval

  const value = parseInt(match[1])
  const unit = match[2]

  const unitMap = {
    'm': '分钟',
    'h': '小时',
    'd': '天'
  }

  return `${value} ${unitMap[unit] || unit}`
}

onMounted(async () => {
  await loadBot()
  await loadSignals()

  // 每30秒自动刷新信号数据
  refreshInterval = setInterval(async () => {
    await loadSignals()
  }, 30000)
})

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})
</script>


