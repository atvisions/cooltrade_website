<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
    <Header />
    <div class="max-w-6xl mx-auto pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <!-- 返回按钮 -->
      <button @click="handleBack" class="mb-6 flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <div v-else-if="bot" class="space-y-6">
        <!-- 顶部卡片 -->
        <div class="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div class="p-5">
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 rounded-xl flex items-center justify-center overflow-hidden bg-slate-100">
                  <img v-if="bot.token_logo" :src="bot.token_logo" :alt="bot.token_symbol" class="w-full h-full object-cover" />
                  <div v-else class="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                    <span class="text-white text-lg font-bold">{{ bot.token_symbol?.charAt(0) || '?' }}</span>
                  </div>
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <h1 class="text-xl font-bold text-slate-900">{{ bot.token_symbol }}/{{ bot.trading_pair }}</h1>
                    <span :class="['px-2 py-0.5 rounded-full text-xs font-semibold', bot.status === 'running' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600']">
                      {{ bot.status === 'running' ? '运行中' : '已停止' }}
                    </span>
                  </div>
                  <p class="text-sm text-slate-500 mt-1">{{ bot.name }}</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button v-if="bot.status === 'running'" @click="handleStopBot" :disabled="actionLoading" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50">
                  {{ actionLoading ? '停止中...' : '停止' }}
                </button>
                <button v-else @click="handleStartBot" :disabled="actionLoading" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50">
                  {{ actionLoading ? '启动中...' : '启动' }}
                </button>
                <button @click="handleEditBot" class="px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors">编辑</button>
              </div>
            </div>
          </div>
          <!-- 核心配置 -->
          <div class="border-t border-slate-200 bg-slate-50">
            <div class="grid grid-cols-7 divide-x divide-slate-200">
              <div class="px-3 py-2.5 text-center">
                <p class="text-[10px] text-slate-500 mb-0.5">市场类型</p>
                <p class="text-xs font-semibold" :class="bot.signal_bot?.market_type === 'futures' ? 'text-orange-600' : 'text-blue-600'">
                  {{ bot.signal_bot?.market_type === 'futures' ? '合约' : '现货' }}
                </p>
              </div>
              <div class="px-3 py-2.5 text-center">
                <p class="text-[10px] text-slate-500 mb-0.5">交易所</p>
                <p class="text-xs font-semibold text-slate-900">{{ bot.exchange_display || bot.exchange_name }}</p>
              </div>
              <div class="px-3 py-2.5 text-center">
                <p class="text-[10px] text-slate-500 mb-0.5">信号类型</p>
                <p class="text-xs font-semibold text-slate-900">{{ getSignalTypeLabel(bot.signal_bot?.signal_type) }}</p>
              </div>
              <div class="px-3 py-2.5 text-center">
                <p class="text-[10px] text-slate-500 mb-0.5">时间周期</p>
                <p class="text-xs font-semibold text-slate-900">{{ bot.signal_bot?.timeframes_config?.primary || '1h' }}</p>
              </div>
              <div class="px-3 py-2.5 text-center">
                <p class="text-[10px] text-slate-500 mb-0.5">检查间隔</p>
                <p class="text-xs font-semibold text-slate-900">{{ formatCheckInterval(bot.signal_bot?.check_interval) }}</p>
              </div>
              <div class="px-3 py-2.5 text-center">
                <p class="text-[10px] text-slate-500 mb-0.5">信号过期</p>
                <p class="text-xs font-semibold text-slate-900">{{ bot.signal_bot?.signal_expiration_hours || 24 }}h</p>
              </div>
              <div class="px-3 py-2.5 text-center">
                <p class="text-[10px] text-slate-500 mb-0.5">通知</p>
                <div class="flex items-center justify-center gap-1">
                  <span v-if="bot.signal_bot?.notify_email" class="text-green-600" title="邮件">
                    <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                    </svg>
                  </span>
                  <span v-if="bot.signal_bot?.notify_app" class="text-blue-600" title="应用">
                    <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path>
                    </svg>
                  </span>
                  <span v-if="!bot.signal_bot?.notify_email && !bot.signal_bot?.notify_app" class="text-[10px] text-slate-400">—</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 市场概览 -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- 当前价格 -->
          <div class="bg-white rounded-lg border border-slate-200 p-4">
            <p class="text-xs text-slate-500 mb-1">当前价格</p>
            <p class="text-xl font-bold text-slate-900">{{ formatPrice(indicatorValues?.price) }}</p>
          </div>
          <!-- 24h涨跌 -->
          <div class="bg-white rounded-lg border border-slate-200 p-4">
            <p class="text-xs text-slate-500 mb-1">24h 涨跌</p>
            <p :class="['text-xl font-bold', (indicatorValues?.price_change_24h || 0) >= 0 ? 'text-green-600' : 'text-red-600']">
              {{ (indicatorValues?.price_change_24h || 0) >= 0 ? '+' : '' }}{{ (indicatorValues?.price_change_24h || 0).toFixed(2) }}%
            </p>
          </div>
          <!-- 24h成交量 -->
          <div class="bg-white rounded-lg border border-slate-200 p-4">
            <p class="text-xs text-slate-500 mb-1">24h 成交量</p>
            <p class="text-xl font-bold text-slate-900">{{ formatVolume(indicatorValues?.volume_24h) }}</p>
          </div>
          <!-- 信号数量 -->
          <div class="bg-white rounded-lg border border-slate-200 p-4">
            <p class="text-xs text-slate-500 mb-1">历史信号</p>
            <p class="text-xl font-bold text-blue-600">{{ signals.length }}</p>
          </div>
        </div>

        <!-- Tab 切换 -->
        <div class="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div class="flex border-b border-slate-200">
            <button
              @click="activeTab = 'indicators'"
              :class="[
                'flex-1 px-4 py-3 text-sm font-medium transition-colors relative',
                activeTab === 'indicators'
                  ? 'text-blue-600 bg-blue-50/50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              ]"
            >
              <div class="flex items-center justify-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                指标监控
              </div>
              <div v-if="activeTab === 'indicators'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
            </button>
            <button
              @click="activeTab = 'signals'"
              :class="[
                'flex-1 px-4 py-3 text-sm font-medium transition-colors relative',
                activeTab === 'signals'
                  ? 'text-blue-600 bg-blue-50/50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              ]"
            >
              <div class="flex items-center justify-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                信号历史
                <span v-if="signals.length > 0" class="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-semibold rounded-full">
                  {{ signals.length }}
                </span>
              </div>
              <div v-if="activeTab === 'signals'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
            </button>
          </div>
        </div>

        <!-- 指标监控 Tab 内容 -->
        <div v-show="activeTab === 'indicators'">
          <!-- 价格提醒监控（仅 price_alert 类型） -->
          <div v-if="bot.signal_bot?.signal_type === 'price_alert'" class="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div class="px-5 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h2 class="text-sm font-semibold text-slate-800">价格监控</h2>
              <button @click="refreshIndicatorValues" :disabled="loadingIndicators" class="text-xs text-blue-600 hover:text-blue-700">刷新</button>
            </div>
            <div class="p-5 grid grid-cols-2 gap-4">
              <div class="bg-blue-50 rounded-lg p-4">
                <p class="text-xs text-blue-600 mb-1">当前价格</p>
                <p class="text-2xl font-bold text-blue-900">{{ formatPrice(indicatorValues?.price) }}</p>
              </div>
              <div class="bg-purple-50 rounded-lg p-4">
                <p class="text-xs text-purple-600 mb-1">目标价格</p>
                <p class="text-2xl font-bold text-purple-900">{{ formatPrice(bot.signal_bot?.price_alert_config?.target_price) }}</p>
                <p class="text-xs text-purple-600 mt-1">{{ bot.signal_bot?.price_alert_config?.condition === 'above' ? '高于触发' : '低于触发' }}</p>
              </div>
            </div>
          </div>

          <!-- 指标对比表格（仅 indicator_alert 类型） -->
          <IndicatorComparisonTable
            v-if="bot.signal_bot?.signal_type === 'indicator_alert'"
            :indicators="bot.signal_bot?.indicators_config?.indicators || []"
            :indicatorValues="indicatorValues"
            :requireAll="bot.signal_bot?.indicators_config?.require_all"
            :triggerMode="bot.signal_bot?.indicators_config?.trigger_mode || 'state_change'"
            :loading="loadingIndicators"
            :updatedAt="indicatorValuesUpdatedAt"
            @refresh="refreshIndicatorValues"
          />
        </div>

        <!-- 信号历史 Tab 内容 -->
        <div v-show="activeTab === 'signals'">
          <SignalListSection
            :signals="signals"
            :loading="loadingSignals"
            @toggleAnalysis="toggleAnalysis"
            :expandedSignals="expandedSignals"
          />
        </div>
      </div>

      <!-- 错误状态 -->
      <div v-else class="text-center py-12">
        <p class="text-slate-500">加载失败，请重试</p>
      </div>
    </div>

    <!-- 停止确认对话框 -->
    <ConfirmDialog
      :show="showStopConfirm"
      type="warning"
      title="停止机器人"
      message="机器人正在运行中，编辑前需要先停止。是否停止并继续编辑？"
      confirm-text="停止并编辑"
      cancel-text="取消"
      @confirm="confirmStopAndEdit"
      @close="showStopConfirm = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Header from '../../common/Header.vue'
import ConfirmDialog from '../../common/ConfirmDialog.vue'
import IndicatorComparisonTable from '../signals/IndicatorComparisonTable.vue'
import SignalListSection from '../signals/SignalListSection.vue'
import { botAPI } from '../../../utils/api'
import { showSuccess, showError } from '../../../utils/notification'

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const actionLoading = ref(false)
const loadingSignals = ref(false)
const loadingIndicators = ref(false)
const bot = ref(null)
const signals = ref([])
const expandedSignals = ref({})
const showStopConfirm = ref(false)
const indicatorValues = ref({})
const indicatorValuesUpdatedAt = ref(null)
const activeTab = ref('indicators') // 'indicators' | 'signals'

let refreshInterval = null
let indicatorRefreshInterval = null

// 获取信号类型标签
const getSignalTypeLabel = (type) => {
  const labels = {
    price_alert: '价格提醒',
    indicator_alert: '指标信号',
    volume: '成交量异动',
    volatility: '波动率异动'
  }
  return labels[type] || type || '未知'
}

// 格式化检查间隔
const formatCheckInterval = (interval) => {
  if (!interval) return '1分钟'
  // 如果是字符串格式如 "1h", "5m", "30s"
  if (typeof interval === 'string') {
    const match = interval.match(/^(\d+)([smhd])$/)
    if (match) {
      const value = parseInt(match[1])
      const unit = match[2]
      switch (unit) {
        case 's': return `${value}秒`
        case 'm': return `${value}分钟`
        case 'h': return `${value}小时`
        case 'd': return `${value}天`
      }
    }
    return interval
  }
  // 如果是数字（秒）
  if (typeof interval === 'number') {
    if (interval < 60) return `${interval}秒`
    if (interval < 3600) return `${Math.floor(interval / 60)}分钟`
    return `${Math.floor(interval / 3600)}小时`
  }
  return '1分钟'
}

// 格式化价格
const formatPrice = (price) => {
  if (!price && price !== 0) return '--'
  const num = Number(price)
  if (num >= 1000) return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  if (num >= 1) return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })
  return num.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 8 })
}

// 格式化成交量
const formatVolume = (volume) => {
  if (!volume && volume !== 0) return '--'
  const num = Number(volume)
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`
  if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`
  return num.toFixed(2)
}

// 返回列表
const handleBack = () => router.push('/signal-bots')

// 切换分析详情
const toggleAnalysis = (signalId) => {
  expandedSignals.value[signalId] = !expandedSignals.value[signalId]
}

// 获取机器人详情
const fetchBotDetail = async () => {
  loading.value = true
  try {
    const id = route.params.id
    const response = await botAPI.getBotDetail(id)
    bot.value = response.data || response
    console.log('机器人详情:', bot.value)
  } catch (err) {
    showError('获取机器人详情失败')
    console.error(err)
  } finally {
    loading.value = false
  }
}

// 获取信号列表
const fetchSignals = async () => {
  if (!bot.value?.id) return
  loadingSignals.value = true
  try {
    const response = await botAPI.getBotSignals(bot.value.id, { page_size: 20 })
    const data = response.results || response.data || response
    signals.value = Array.isArray(data) ? data : []
    console.log('信号数据:', signals.value)
  } catch (err) {
    console.error('获取信号失败:', err)
    signals.value = []
  } finally {
    loadingSignals.value = false
  }
}

// 刷新指标值
const refreshIndicatorValues = async () => {
  if (!bot.value?.id) return
  loadingIndicators.value = true
  try {
    const response = await botAPI.getBotIndicatorValues(bot.value.id)
    const data = response.data || response
    indicatorValues.value = data.values || data || {}
    indicatorValuesUpdatedAt.value = data.updated_at || new Date().toISOString()
    console.log('指标值:', indicatorValues.value)
  } catch (err) {
    console.error('获取指标值失败:', err)
  } finally {
    loadingIndicators.value = false
  }
}

// 启动机器人
const handleStartBot = async () => {
  actionLoading.value = true
  try {
    await botAPI.startBot(bot.value.id)
    showSuccess('机器人已启动')
    await fetchBotDetail()
  } catch (err) {
    showError(err.response?.data?.detail || '启动失败')
  } finally {
    actionLoading.value = false
  }
}

// 停止机器人
const handleStopBot = async () => {
  actionLoading.value = true
  try {
    await botAPI.stopBot(bot.value.id)
    showSuccess('机器人已停止')
    await fetchBotDetail()
  } catch (err) {
    showError(err.response?.data?.detail || '停止失败')
  } finally {
    actionLoading.value = false
  }
}

// 编辑机器人
const handleEditBot = () => {
  if (bot.value?.status === 'running') {
    showStopConfirm.value = true
  } else {
    router.push(`/bots/edit-signal/${bot.value.id}`)
  }
}

// 确认停止并编辑
const confirmStopAndEdit = async () => {
  showStopConfirm.value = false
  await handleStopBot()
  router.push(`/bots/edit-signal/${bot.value.id}`)
}

onMounted(async () => {
  await fetchBotDetail()
  if (bot.value) {
    await Promise.all([fetchSignals(), refreshIndicatorValues()])
    // 定时刷新
    refreshInterval = setInterval(fetchSignals, 60000)
    indicatorRefreshInterval = setInterval(refreshIndicatorValues, 30000)
  }
})

onUnmounted(() => {
  if (refreshInterval) clearInterval(refreshInterval)
  if (indicatorRefreshInterval) clearInterval(indicatorRefreshInterval)
})
</script>
