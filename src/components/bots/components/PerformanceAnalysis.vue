<template>
  <div class="space-y-6">
    <!-- 性能概览卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm opacity-90">总收益</span>
          <svg class="h-8 w-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-3xl font-bold">${{ statistics.total_profit.toFixed(2) }}</p>
        <p class="text-sm opacity-90 mt-1">{{ statistics.profit_rate.toFixed(2) }}%</p>
      </div>

      <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm opacity-90">胜率</span>
          <svg class="h-8 w-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-3xl font-bold">{{ statistics.win_rate.toFixed(1) }}%</p>
        <p class="text-sm opacity-90 mt-1">{{ statistics.winning_trades }}/{{ statistics.total_trades }} 笔</p>
      </div>

      <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm opacity-90">平均收益</span>
          <svg class="h-8 w-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <p class="text-3xl font-bold">${{ statistics.avg_profit.toFixed(2) }}</p>
        <p class="text-sm opacity-90 mt-1">每笔交易</p>
      </div>

      <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm opacity-90">最大回撤</span>
          <svg class="h-8 w-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
          </svg>
        </div>
        <p class="text-3xl font-bold">{{ statistics.max_drawdown.toFixed(2) }}%</p>
        <p class="text-sm opacity-90 mt-1">风险指标</p>
      </div>
    </div>

    <!-- 筛选器 -->
    <div class="bg-white rounded-xl p-4 border border-slate-200">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">时间范围</label>
          <select 
            v-model="filters.timeRange" 
            @change="loadPerformance"
            class="w-full rounded-lg bg-slate-50 border border-slate-200 px-4 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">最近7天</option>
            <option value="30d">最近30天</option>
            <option value="90d">最近90天</option>
            <option value="1y">最近1年</option>
            <option value="all">全部</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">机器人类型</label>
          <select 
            v-model="filters.bot_type" 
            @change="loadPerformance"
            class="w-full rounded-lg bg-slate-50 border border-slate-200 px-4 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部</option>
            <option value="signal">信号机器人</option>
            <option value="trend_following">趋势跟踪</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">机器人</label>
          <select 
            v-model="filters.bot_id" 
            @change="loadPerformance"
            class="w-full rounded-lg bg-slate-50 border border-slate-200 px-4 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部</option>
            <option v-for="bot in bots" :key="bot.id" :value="bot.id">
              {{ bot.name }}
            </option>
          </select>
        </div>

        <div class="flex items-end">
          <button
            @click="loadPerformance"
            :disabled="loading"
            class="w-full px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50 transition-colors"
          >
            刷新
          </button>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- 详细性能指标 -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- 交易统计 -->
      <div class="bg-white rounded-xl p-6 border border-slate-200">
        <h3 class="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <svg class="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          交易统计
        </h3>
        <div class="space-y-3">
          <div class="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
            <span class="text-sm text-slate-600">总交易数</span>
            <span class="text-lg font-semibold text-slate-900">{{ statistics.total_trades }}</span>
          </div>
          <div class="flex justify-between items-center p-3 bg-green-50 rounded-lg">
            <span class="text-sm text-green-600">盈利交易</span>
            <span class="text-lg font-semibold text-green-700">{{ statistics.winning_trades }}</span>
          </div>
          <div class="flex justify-between items-center p-3 bg-red-50 rounded-lg">
            <span class="text-sm text-red-600">亏损交易</span>
            <span class="text-lg font-semibold text-red-700">{{ statistics.losing_trades }}</span>
          </div>
          <div class="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
            <span class="text-sm text-blue-600">平均持仓时间</span>
            <span class="text-lg font-semibold text-blue-700">{{ statistics.avg_holding_time }}h</span>
          </div>
        </div>
      </div>

      <!-- 收益统计 -->
      <div class="bg-white rounded-xl p-6 border border-slate-200">
        <h3 class="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <svg class="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          收益统计
        </h3>
        <div class="space-y-3">
          <div class="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
            <span class="text-sm text-slate-600">总收益</span>
            <span class="text-lg font-semibold" :class="statistics.total_profit >= 0 ? 'text-green-600' : 'text-red-600'">
              ${{ statistics.total_profit.toFixed(2) }}
            </span>
          </div>
          <div class="flex justify-between items-center p-3 bg-green-50 rounded-lg">
            <span class="text-sm text-green-600">最大单笔盈利</span>
            <span class="text-lg font-semibold text-green-700">${{ statistics.max_profit.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between items-center p-3 bg-red-50 rounded-lg">
            <span class="text-sm text-red-600">最大单笔亏损</span>
            <span class="text-lg font-semibold text-red-700">${{ statistics.max_loss.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
            <span class="text-sm text-blue-600">盈亏比</span>
            <span class="text-lg font-semibold text-blue-700">{{ statistics.profit_loss_ratio.toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <!-- 风险指标 -->
      <div class="bg-white rounded-xl p-6 border border-slate-200">
        <h3 class="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <svg class="h-5 w-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          风险指标
        </h3>
        <div class="space-y-3">
          <div class="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
            <span class="text-sm text-slate-600">最大回撤</span>
            <span class="text-lg font-semibold text-orange-600">{{ statistics.max_drawdown.toFixed(2) }}%</span>
          </div>
          <div class="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
            <span class="text-sm text-purple-600">夏普比率</span>
            <span class="text-lg font-semibold text-purple-700">{{ statistics.sharpe_ratio.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between items-center p-3 bg-indigo-50 rounded-lg">
            <span class="text-sm text-indigo-600">波动率</span>
            <span class="text-lg font-semibold text-indigo-700">{{ statistics.volatility.toFixed(2) }}%</span>
          </div>
          <div class="flex justify-between items-center p-3 bg-pink-50 rounded-lg">
            <span class="text-sm text-pink-600">风险收益比</span>
            <span class="text-lg font-semibold text-pink-700">{{ statistics.risk_reward_ratio.toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <!-- 机器人排行 -->
      <div class="bg-white rounded-xl p-6 border border-slate-200">
        <h3 class="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <svg class="h-5 w-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          机器人排行（按收益）
        </h3>
        <div class="space-y-2">
          <div
            v-for="(bot, index) in topBots"
            :key="bot.id"
            class="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <div class="flex items-center gap-3">
              <span 
                :class="[
                  'flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm',
                  index === 0 ? 'bg-yellow-100 text-yellow-700' :
                  index === 1 ? 'bg-gray-100 text-gray-700' :
                  index === 2 ? 'bg-orange-100 text-orange-700' :
                  'bg-slate-100 text-slate-700'
                ]"
              >
                {{ index + 1 }}
              </span>
              <div>
                <div class="text-sm font-medium text-slate-900">{{ bot.name }}</div>
                <div class="text-xs text-slate-500">{{ bot.trades }} 笔交易</div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-sm font-semibold" :class="bot.profit >= 0 ? 'text-green-600' : 'text-red-600'">
                ${{ bot.profit.toFixed(2) }}
              </div>
              <div class="text-xs text-slate-500">{{ bot.win_rate.toFixed(1) }}% 胜率</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 收益曲线图占位符 -->
    <div class="bg-white rounded-xl p-6 border border-slate-200">
      <h3 class="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <svg class="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
        收益曲线
      </h3>
      <div class="h-64 flex items-center justify-center bg-slate-50 rounded-lg">
        <p class="text-slate-500">图表功能开发中...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { botAPI } from '../../../utils/api'
import { showError } from '../../../utils/notification'

const loading = ref(false)
const bots = ref([])

const filters = ref({
  timeRange: '30d',
  bot_type: '',
  bot_id: ''
})

const statistics = ref({
  total_profit: 0,
  profit_rate: 0,
  win_rate: 0,
  total_trades: 0,
  winning_trades: 0,
  losing_trades: 0,
  avg_profit: 0,
  max_drawdown: 0,
  max_profit: 0,
  max_loss: 0,
  profit_loss_ratio: 0,
  avg_holding_time: 0,
  sharpe_ratio: 0,
  volatility: 0,
  risk_reward_ratio: 0
})

const topBots = ref([])

// 加载性能数据
const loadPerformance = async () => {
  loading.value = true
  try {
    const response = await botAPI.getPerformanceAnalysis(filters.value)

    if (response.success && response.data) {
      statistics.value = response.data.statistics
      topBots.value = response.data.top_bots || []
    } else {
      showError('加载性能数据失败')
    }
  } catch (error) {
    console.error('加载性能数据失败:', error)
    showError(error.message || '加载性能数据失败')
  } finally {
    loading.value = false
  }
}

// 加载机器人列表
const loadBots = async () => {
  try {
    const response = await botAPI.getBotList({ page_size: 100 })
    bots.value = response.results || response.data || []
  } catch (error) {
    console.error('加载机器人列表失败:', error)
  }
}

// 监听筛选器变化
watch(filters, () => {
  loadPerformance()
}, { deep: true })

onMounted(() => {
  loadPerformance()
  loadBots()
})
</script>

