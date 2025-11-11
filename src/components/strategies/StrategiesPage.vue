<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <Header />

    <!-- 页面标题区域 - 高级商务设计 -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <!-- 标题和描述 -->
        <div class="mb-8">
          <div class="flex items-center gap-3 mb-2">
            <svg class="w-7 h-7 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h1 class="text-3xl font-semibold text-gray-900 tracking-tight">策略市场</h1>
          </div>
          <p class="text-gray-600 text-base">发现并复制社区中优秀的交易策略，快速启动您的自动化交易</p>
        </div>

        <!-- 统计卡片 -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div class="flex items-center gap-2 mb-2">
              <svg class="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span class="text-xs font-medium text-gray-600 uppercase tracking-wide">信号机器人</span>
            </div>
            <div class="text-2xl font-semibold text-gray-900">{{ stats.total_signal_bots }}</div>
          </div>

          <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div class="flex items-center gap-2 mb-2">
              <svg class="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span class="text-xs font-medium text-gray-600 uppercase tracking-wide">交易机器人</span>
            </div>
            <div class="text-2xl font-semibold text-gray-900">{{ stats.total_trading_bots }}</div>
          </div>

          <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div class="flex items-center gap-2 mb-2">
              <svg class="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span class="text-xs font-medium text-gray-600 uppercase tracking-wide">活跃用户</span>
            </div>
            <div class="text-2xl font-semibold text-gray-900">{{ stats.total_users || 0 }}</div>
          </div>

          <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div class="flex items-center gap-2 mb-2">
              <svg class="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
              <span class="text-xs font-medium text-gray-600 uppercase tracking-wide">总复制数</span>
            </div>
            <div class="text-2xl font-semibold text-gray-900">{{ stats.total_copies || 0 }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 筛选和内容区域 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <!-- 筛选区域 -->
      <div class="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <!-- 机器人类型标签 -->
        <div class="mb-6">
          <div class="inline-flex gap-1 bg-gray-100 rounded-lg p-1">
            <button
              @click="activeTab = 'signal'"
              :class="[
                'px-6 py-2 rounded-md font-medium transition-all duration-200 text-sm',
                activeTab === 'signal'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              ]"
            >
              信号机器人
            </button>
            <button
              @click="activeTab = 'trading'"
              :class="[
                'px-6 py-2 rounded-md font-medium transition-all duration-200 text-sm',
                activeTab === 'trading'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              ]"
            >
              交易机器人
            </button>
          </div>
        </div>

        <!-- 信号类别（仅信号机器人显示） -->
        <div v-if="activeTab === 'signal'" class="mb-6 pb-6 border-b border-gray-200">
          <div class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">信号类型</div>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="category in signalCategories"
              :key="category.value"
              @click="filters.signalType = category.value"
              :class="[
                'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border',
                filters.signalType === category.value
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
              ]"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" :d="category.icon" />
              </svg>
              <span>{{ category.label }}</span>
            </button>
          </div>
        </div>

        <!-- 搜索和筛选 -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
          <!-- 搜索框 -->
          <div class="md:col-span-6 relative">
            <input
              v-model="filters.search"
              type="text"
              placeholder="搜索策略或创建者..."
              class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-sm transition-colors"
            />
            <svg class="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <!-- 交易所筛选 -->
          <div class="md:col-span-3">
            <Select
              v-model="filters.exchange"
              :options="exchangeOptions"
              placeholder="所有交易所"
            />
          </div>

          <!-- 排序 -->
          <div class="md:col-span-3">
            <Select
              v-model="filters.sortBy"
              :options="sortOptions"
              placeholder="排序方式"
            />
          </div>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p class="text-gray-500">加载中...</p>
      </div>

      <!-- 策略列表 -->
      <div v-else-if="strategies.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="strategy in strategies"
          :key="strategy.id"
          class="bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 overflow-hidden group cursor-pointer"
          @click="viewStrategy(strategy)"
        >
          <!-- 创建者信息 -->
          <div class="p-4 border-b border-gray-100 bg-gradient-to-r from-slate-50 to-blue-50">
            <div class="flex items-center gap-3">
              <!-- 用户头像 -->
              <div v-if="strategy.user?.avatar" class="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <img :src="strategy.user.avatar" :alt="strategy.user.username" class="w-full h-full object-cover" />
              </div>
              <div v-else class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                {{ strategy.user?.username?.charAt(0).toUpperCase() || 'U' }}
              </div>
              <div class="flex-1 min-w-0">
                <div class="font-semibold text-gray-900 truncate">{{ strategy.user?.username || '匿名用户' }}</div>
                <div class="text-xs text-gray-500">{{ formatDate(strategy.created_at) }}</div>
              </div>
              <!-- 不是自己的策略才显示关注按钮 -->
              <button
                v-if="!isOwnStrategy(strategy)"
                @click.stop="toggleFollow(strategy)"
                class="px-3 py-1 text-xs font-medium rounded-lg transition-colors"
                :class="strategy.is_following ? 'bg-gray-200 text-gray-700' : 'bg-blue-600 text-white hover:bg-blue-700'"
              >
                {{ strategy.is_following ? '已关注' : '关注' }}
              </button>
              <!-- 自己的策略显示"我的"标签 -->
              <span
                v-else
                class="px-3 py-1 text-xs font-medium rounded-lg bg-green-100 text-green-700"
              >
                我的策略
              </span>
            </div>
          </div>

          <!-- 策略信息 -->
          <div class="p-4">
            <h3 class="font-bold text-lg text-gray-900 mb-2 truncate group-hover:text-blue-600 transition-colors">
              {{ strategy.name }}
            </h3>
            <p class="text-sm text-gray-600 mb-3 line-clamp-2">
              {{ strategy.description || '暂无描述' }}
            </p>

            <!-- 交易对和交易所 -->
            <div class="flex items-center gap-2 mb-3">
              <span class="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                {{ strategy.token_symbol || 'N/A' }}/{{ strategy.trading_pair || 'USDT' }}
              </span>
              <span class="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                {{ strategy.exchange_display || strategy.exchange_name || 'N/A' }}
              </span>
              <span class="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded">
                {{ strategy.timeframe || 'N/A' }}
              </span>
            </div>

            <!-- 统计数据 -->
            <div class="grid grid-cols-2 gap-3 mb-4">
              <!-- 信号机器人显示信号统计 -->
              <template v-if="strategy.bot_type === 'signal'">
                <div class="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-3">
                  <div class="text-xs text-gray-600 mb-1">历史触发</div>
                  <div class="text-lg font-bold text-purple-600">
                    {{ strategy.total_signals || 0 }} 次
                  </div>
                </div>
                <div class="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-3">
                  <div class="text-xs text-gray-600 mb-1">监控状态</div>
                  <div class="text-sm font-medium text-blue-600 flex items-center gap-1">
                    <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span>持续监控中</span>
                  </div>
                </div>
              </template>

              <!-- 交易机器人显示收益和胜率 -->
              <template v-else>
                <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3">
                  <div class="text-xs text-gray-600 mb-1">总收益</div>
                  <div class="text-lg font-bold" :class="strategy.total_profit >= 0 ? 'text-green-600' : 'text-red-600'">
                    {{ strategy.total_profit >= 0 ? '+' : '' }}{{ formatNumber(strategy.total_profit) }}%
                  </div>
                </div>
                <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3">
                  <div class="text-xs text-gray-600 mb-1">胜率</div>
                  <div class="text-lg font-bold text-blue-600">
                    {{ formatNumber(strategy.win_rate) }}%
                  </div>
                </div>
              </template>
            </div>

            <!-- 底部信息 -->
            <div class="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
              <div class="flex items-center gap-3">
                <span class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {{ strategy.view_count || 0 }}
                </span>
                <span class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  {{ strategy.copy_count || 0 }}
                </span>
              </div>
              <!-- 如果是自己的策略，显示编辑按钮 -->
              <button
                v-if="isOwnStrategy(strategy)"
                @click.stop="editStrategy(strategy)"
                class="px-3 py-1.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all shadow-sm hover:shadow-md"
              >
                编辑策略
              </button>
              <!-- 如果不是自己的策略，显示复制按钮 -->
              <button
                v-else-if="!strategy.is_copied"
                @click.stop="copyStrategy(strategy)"
                class="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm hover:shadow-md"
              >
                复制策略
              </button>
              <button
                v-else
                disabled
                class="px-3 py-1.5 bg-gray-200 text-gray-500 rounded-lg font-medium cursor-not-allowed"
              >
                已复制
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="text-center py-12 bg-white rounded-xl border border-gray-200">
        <div class="text-6xl mb-4">🔍</div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">暂无策略</h3>
        <p class="text-gray-600">当前筛选条件下没有找到策略</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Header from '../common/Header.vue'
import Select from '../common/ui/Select.vue'
import axios from 'axios'
import { showSuccess, showError, showLoginRequired } from '../../utils/notification'

const router = useRouter()

// 状态
const activeTab = ref('signal')
const loading = ref(false)
const strategies = ref([])
const stats = ref({
  total_strategies: 0,
  total_signal_bots: 0,
  total_trading_bots: 0
})

// 筛选条件
const filters = ref({
  search: '',
  sortBy: '-copy_count',
  exchange: '',
  token: '',
  signalType: ''  // 空字符串表示全部
})

// 信号类别（与创建页面保持一致）
const signalCategories = ref([
  {
    value: '',
    label: '全部信号',
    icon: 'M4 6h16M4 10h16M4 14h16M4 18h16'  // 列表图标
  },
  {
    value: 'price_alert',
    label: '价格提醒',
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'  // 价格图标
  },
  {
    value: 'rsi',
    label: 'RSI指标',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'  // 柱状图
  },
  {
    value: 'ma_crossover',
    label: 'MA交叉',
    icon: 'M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z'  // 交叉图标
  },
  {
    value: 'bollinger',
    label: '布林带',
    icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'  // 趋势图标
  },
  {
    value: 'volume',
    label: '成交量',
    icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3'  // 成交量图标
  },
  {
    value: 'macd',
    label: 'MACD',
    icon: 'M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z'  // 线图
  },
  {
    value: 'kdj',
    label: 'KDJ',
    icon: 'M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'  // 图表图标
  }
])

// 交易所选项
const exchangeOptions = ref([
  { label: '所有交易所', value: '' },
  { label: 'Binance', value: 'binance' },
  { label: 'OKX', value: 'okx' },
  { label: 'Bybit', value: 'bybit' },
  { label: 'Gate.io', value: 'gateio' }
])

// 排序选项（根据机器人类型动态变化）
const sortOptions = computed(() => {
  const baseOptions = [
    { label: '最多复制', value: '-copy_count' },
    { label: '最多查看', value: '-view_count' },
    { label: '最新创建', value: '-created_at' }
  ]

  if (activeTab.value === 'signal') {
    return [
      ...baseOptions,
      { label: '触发次数（多到少）', value: '-total_signals' }
    ]
  } else {
    return [
      ...baseOptions,
      { label: '收益率（高到低）', value: '-total_profit' },
      { label: '胜率（高到低）', value: '-win_rate' }
    ]
  }
})

// 计算当前机器人类型
const currentBotType = computed(() => {
  return activeTab.value === 'signal' ? 'signal' : 'trend_following'
})

// API 基础 URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

// 加载统计数据
const loadStats = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/trading/marketplace/stats/`)
    if (response.data.success) {
      stats.value = response.data.data
    }
  } catch (error) {
    console.error('加载统计数据失败:', error)
  }
}

// 加载策略列表
const loadStrategies = async () => {
  try {
    loading.value = true
    const params = {
      bot_type: currentBotType.value,
      sort_by: filters.value.sortBy
    }

    if (filters.value.search) params.search = filters.value.search
    if (filters.value.exchange) params.exchange = filters.value.exchange
    if (filters.value.token) params.token = filters.value.token
    if (filters.value.signalType) {
      params.signal_type = filters.value.signalType
    }

    const token = localStorage.getItem('auth_token')
    const headers = token ? { 'Authorization': `Token ${token}` } : {}

    const response = await axios.get(`${API_BASE_URL}/api/trading/marketplace/`, {
      params,
      headers
    })
    strategies.value = response.data.results || response.data || []
  } catch (error) {
    console.error('加载策略失败:', error)
    showError('加载策略失败，请稍后重试', '加载失败')
  } finally {
    loading.value = false
  }
}

// 查看策略详情
const viewStrategy = (strategy) => {
  router.push(`/strategies/${strategy.share_code}`)
}

// 检查是否是自己的策略
const isOwnStrategy = (strategy) => {
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
  return strategy.user?.id === currentUser.id
}

// 编辑策略
const editStrategy = (strategy) => {
  if (strategy.bot_type === 'signal') {
    router.push(`/signal-bots/edit/${strategy.id}`)
  } else {
    router.push(`/bots/edit/${strategy.id}`)
  }
}

// 复制策略
const copyStrategy = async (strategy) => {
  try {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      showLoginRequired()
      router.push('/auth')
      return
    }

    const response = await axios.post(
      `${API_BASE_URL}/api/trading/marketplace/${strategy.share_code}/copy/`,
      {},
      {
        headers: {
          'Authorization': `Token ${token}`
        }
      }
    )

    if (response.data.success) {
      showSuccess('策略已成功复制到您的账户，正在跳转到编辑页面...', '复制成功')
      // 根据机器人类型跳转到对应的编辑页面
      const botType = response.data.data.bot_type
      const botId = response.data.data.bot_id

      setTimeout(() => {
        if (botType === 'signal') {
          // 信号机器人跳转到信号机器人编辑页面
          router.push(`/bots/edit-signal/${botId}`)
        } else {
          // 其他类型跳转到交易机器人编辑页面
          router.push(`/bots/edit/${botId}`)
        }
      }, 1000)
    }
  } catch (error) {
    console.error('复制策略失败:', error)
    showError(error.response?.data?.error || '复制策略失败，请稍后重试', '复制失败')
  }
}

// 关注/取消关注
const toggleFollow = async (strategy) => {
  try {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      showLoginRequired()
      router.push('/auth')
      return
    }

    const response = await axios.post(
      `${API_BASE_URL}/api/auth/follow/`,
      { user_id: strategy.user.id },
      {
        headers: {
          'Authorization': `Token ${token}`
        }
      }
    )

    if (response.data.status === 'success') {
      strategy.is_following = response.data.data.is_following
      const action = strategy.is_following ? '关注' : '取消关注'
      showSuccess(`已${action} ${strategy.user.username}`, `${action}成功`)
    }
  } catch (error) {
    console.error('关注操作失败:', error)
    showError(error.response?.data?.message || '操作失败，请稍后重试', '操作失败')
  }
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return '今天'
  if (days === 1) return '昨天'
  if (days < 7) return `${days}天前`
  if (days < 30) return `${Math.floor(days / 7)}周前`
  if (days < 365) return `${Math.floor(days / 30)}个月前`
  return `${Math.floor(days / 365)}年前`
}

// 格式化数字
const formatNumber = (num) => {
  if (num === null || num === undefined) return '0.00'
  return Number(num).toFixed(2)
}



// 监听标签页切换
watch(activeTab, () => {
  loadStrategies()
})

// 监听筛选条件变化
watch(filters, () => {
  loadStrategies()
}, { deep: true })

// 页面加载时
onMounted(() => {
  loadStats()
  loadStrategies()
})
</script>

