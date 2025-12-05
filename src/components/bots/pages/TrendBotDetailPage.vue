<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <Header />
    <div class="max-w-7xl mx-auto pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <!-- 加载状态 -->
      <div v-if="loading" class="text-center py-24">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p class="text-gray-500">加载中...</p>
      </div>

      <!-- 主内容 -->
      <div v-else-if="bot" class="space-y-6">
        <!-- 顶部头部 -->
        <BotHeader
          :botName="bot.name"
          :tokenSymbol="bot.token_symbol"
          :tokenLogo="bot.token_logo"
          :tradingPair="bot.trading_pair"
          :exchangeName="bot.exchange_display || bot.exchange_name"
          :marketType="bot.trend_following_bot?.market_type"
          :status="bot.status"
          :actionLoading="actionLoading"
          backPath="/bots"
          backLabel="趋势跟踪机器人"
          :stats="headerStats"
          @start="handleStartBot"
          @stop="handleStopBot"
          @edit="handleEditBot"
          @delete="handleDeleteBot"
        />

        <!-- 12列网格布局 -->
        <div class="grid grid-cols-12 gap-6">
          <!-- 左侧主内容区 (8列) -->
          <div class="col-span-12 lg:col-span-8 space-y-6">
            <!-- Tab 导航 -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div class="flex border-b border-gray-100">
                <button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key"
                  :class="['flex-1 px-4 py-3.5 text-sm font-medium transition-colors relative',
                    activeTab === tab.key ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700']">
                  <span class="flex items-center justify-center gap-2">
                    {{ tab.label }}
                    <span v-if="tab.count !== undefined" class="px-1.5 py-0.5 text-[10px] rounded-full"
                      :class="activeTab === tab.key ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'">
                      {{ tab.count }}
                    </span>
                  </span>
                  <span v-if="activeTab === tab.key" class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></span>
                </button>
              </div>

              <!-- Tab 内容区 -->
              <div class="p-5">
                <!-- 持仓 Tab -->
                <div v-show="activeTab === 'positions'">
                  <PositionList :positions="positions" :loading="loadingPositions" @close="handleClosePosition" />
                </div>

                <!-- 交易历史 Tab -->
                <div v-show="activeTab === 'trades'">
                  <TradeList :trades="trades" :loading="loadingTrades" />
                </div>

                <!-- 盈亏统计 Tab -->
                <div v-show="activeTab === 'performance'">
                  <PerformancePanel :bot="bot" />
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧边栏 (4列) -->
          <div class="col-span-12 lg:col-span-4 space-y-6">
            <!-- 盈亏卡片 -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-base font-semibold text-gray-900">收益概览</h3>
                <span :class="['text-lg font-bold', bot.total_profit >= 0 ? 'text-emerald-600' : 'text-red-600']">
                  {{ bot.total_profit >= 0 ? '+' : '' }}{{ formatCurrency(bot.total_profit) }}
                </span>
              </div>
              <div class="space-y-3">
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-500">收益率</span>
                  <span :class="['text-sm font-medium', bot.total_profit_percentage >= 0 ? 'text-emerald-600' : 'text-red-600']">
                    {{ bot.total_profit_percentage >= 0 ? '+' : '' }}{{ bot.total_profit_percentage || 0 }}%
                  </span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-500">胜率</span>
                  <span class="text-sm font-medium text-gray-900">{{ bot.win_rate || 0 }}%</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-500">总交易</span>
                  <span class="text-sm font-medium text-gray-900">{{ bot.total_trades || 0 }}笔</span>
                </div>
              </div>
            </div>

            <!-- 基础信息面板 -->
            <BotInfoPanel :infoItems="infoItems" :extraItems="extraItems" />

            <!-- 关联信号机器人 -->
            <div v-if="bot.trend_following_bot?.signal_bot" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 class="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                </svg>
                关联信号源
              </h3>
              <router-link :to="`/signal-bots/${signalBotId}`" class="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ signalBotName }}</p>
                    <p class="text-xs text-gray-500">点击查看信号详情</p>
                  </div>
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- 错误状态 -->
      <div v-else class="text-center py-24">
        <p class="text-gray-500">加载失败，请重试</p>
        <button @click="loadBot" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">重新加载</button>
      </div>
    </div>

    <!-- 确认对话框 -->
    <ConfirmDialog :show="showStopConfirm" type="warning" title="停止机器人" message="机器人正在运行中，编辑前需要先停止。是否停止并继续编辑？" confirm-text="停止并编辑" cancel-text="取消" @confirm="confirmStopAndEdit" @close="showStopConfirm = false" />
    <ConfirmDialog :show="showDeleteConfirm" type="danger" title="删除机器人" message="确定要删除这个机器人吗？此操作不可恢复。" confirm-text="删除" cancel-text="取消" @confirm="confirmDelete" @close="showDeleteConfirm = false" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Header from '../../common/Header.vue'
import ConfirmDialog from '../../common/ConfirmDialog.vue'
import BotHeader from '../detail/BotHeader.vue'
import BotInfoPanel from '../detail/BotInfoPanel.vue'
import PositionList from '../detail/PositionList.vue'
import TradeList from '../detail/TradeList.vue'
import PerformancePanel from '../detail/PerformancePanel.vue'
import { botAPI } from '../../../utils/api'
import { showSuccess, showError } from '../../../utils/notification'

const router = useRouter()
const route = useRoute()

// 状态
const loading = ref(false)
const actionLoading = ref(false)
const loadingPositions = ref(false)
const loadingTrades = ref(false)
const bot = ref(null)
const positions = ref([])
const trades = ref([])
const showStopConfirm = ref(false)
const showDeleteConfirm = ref(false)
const activeTab = ref('positions')

// Tab 配置
const tabs = computed(() => [
  { key: 'positions', label: '当前持仓', count: positions.value.filter(p => p.status === 'open').length },
  { key: 'trades', label: '交易历史', count: trades.value.length },
  { key: 'performance', label: '盈亏统计' }
])

// 头部统计数据
const headerStats = computed(() => [
  { label: '总盈亏', value: formatCurrency(bot.value?.total_profit), color: bot.value?.total_profit >= 0 ? 'text-emerald-600' : 'text-red-600' },
  { label: '胜率', value: `${bot.value?.win_rate || 0}%` },
  { label: '总交易', value: `${bot.value?.total_trades || 0}笔` },
  { label: '持仓', value: `${positions.value.filter(p => p.status === 'open').length}个`, color: 'text-blue-600' }
])

// 信号机器人信息
const signalBotId = computed(() => bot.value?.trend_following_bot?.signal_bot?.id || bot.value?.trend_following_bot?.signal_bot)
const signalBotName = computed(() => {
  const sb = bot.value?.trend_following_bot?.signal_bot
  return typeof sb === 'object' ? sb?.bot?.name : '信号机器人'
})

// 右侧信息面板数据
const infoItems = computed(() => {
  const tfBot = bot.value?.trend_following_bot
  return [
    { label: '交易对', value: `${bot.value?.token_symbol}/${bot.value?.trading_pair}` },
    { label: '交易所', value: bot.value?.exchange_display || bot.value?.exchange_name },
    { label: '市场类型', value: getMarketTypeLabel(tfBot?.market_type) },
    { label: '杠杆', value: tfBot?.leverage ? `${tfBot.leverage}x` : '-' }
  ]
})

const extraItems = computed(() => {
  const tfBot = bot.value?.trend_following_bot
  return [
    { label: '止损', value: tfBot?.stop_loss_percentage ? `${tfBot.stop_loss_percentage}%` : '-' },
    { label: '止盈', value: tfBot?.take_profit_percentage ? `${tfBot.take_profit_percentage}%` : '-' },
    { label: '仓位大小', value: formatPositionSize(tfBot) },
    { label: '创建时间', value: formatDate(bot.value?.created_at) }
  ]
})

// 辅助函数
const getMarketTypeLabel = (type) => {
  const map = { spot: '现货', linear: 'USDT永续', inverse: '币本位永续' }
  return map[type] || type || '-'
}

const formatPositionSize = (tfBot) => {
  if (!tfBot) return '-'
  const method = tfBot.position_sizing_method
  const value = tfBot.position_size_value
  if (method === 'fixed_amount') return `${value} USDT`
  if (method === 'fixed_percent') return `${value}%`
  return `${value}`
}

const formatCurrency = (value) => {
  if (!value && value !== 0) return '$0.00'
  const num = Number(value)
  return num >= 0 ? `$${num.toFixed(2)}` : `-$${Math.abs(num).toFixed(2)}`
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

// API 调用
const loadBot = async () => {
  loading.value = true
  try {
    const response = await botAPI.getBotDetail(route.params.id)
    bot.value = response.data || response
  } catch (error) {
    showError('加载机器人详情失败')
  } finally {
    loading.value = false
  }
}

const loadPositions = async () => {
  if (!bot.value?.id) return
  loadingPositions.value = true
  try {
    // TODO: 实现持仓API后替换
    // const response = await positionAPI.getPositions({ bot_id: bot.value.id })
    // positions.value = response.results || response.data || response || []
    positions.value = []
  } catch (error) {
    positions.value = []
  } finally {
    loadingPositions.value = false
  }
}

const loadTrades = async () => {
  if (!bot.value?.id) return
  loadingTrades.value = true
  try {
    const response = await botAPI.getBotTrades(bot.value.id, { page_size: 50 })
    trades.value = Array.isArray(response.results || response.data || response) ? (response.results || response.data || response) : []
  } catch (error) {
    trades.value = []
  } finally {
    loadingTrades.value = false
  }
}

const handleStartBot = async () => {
  actionLoading.value = true
  try {
    await botAPI.startBot(bot.value.id)
    showSuccess('机器人已启动')
    await loadBot()
  } catch (err) {
    showError(err.response?.data?.detail || '启动失败')
  } finally {
    actionLoading.value = false
  }
}

const handleStopBot = async () => {
  actionLoading.value = true
  try {
    await botAPI.stopBot(bot.value.id)
    showSuccess('机器人已停止')
    await loadBot()
  } catch (err) {
    showError(err.response?.data?.detail || '停止失败')
  } finally {
    actionLoading.value = false
  }
}

const handleEditBot = () => {
  if (bot.value?.status === 'running') {
    showStopConfirm.value = true
  } else {
    router.push(`/bots/edit/${bot.value.id}`)
  }
}

const confirmStopAndEdit = async () => {
  showStopConfirm.value = false
  await handleStopBot()
  router.push(`/bots/edit/${bot.value.id}`)
}

const handleDeleteBot = () => { showDeleteConfirm.value = true }

const confirmDelete = async () => {
  showDeleteConfirm.value = false
  try {
    await botAPI.deleteBot(bot.value.id)
    showSuccess('机器人已删除')
    router.push('/bots')
  } catch (err) {
    showError(err.response?.data?.detail || '删除失败')
  }
}

// eslint-disable-next-line no-unused-vars
const handleClosePosition = async (_positionId) => {
  try {
    // TODO: 实现平仓API
    // await botAPI.closePosition(_positionId)
    showSuccess('平仓功能待实现')
    await loadPositions()
  } catch (err) {
    showError(err.response?.data?.detail || '平仓失败')
  }
}

onMounted(async () => {
  await loadBot()
  if (bot.value) {
    await Promise.all([loadPositions(), loadTrades()])
  }
})
</script>

