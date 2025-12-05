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
          :marketType="bot.signal_bot?.market_type"
          :status="bot.status"
          :actionLoading="actionLoading"
          backPath="/signal-bots"
          backLabel="信号机器人"
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
                    <component :is="tab.icon" class="w-4 h-4" />
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
                <!-- 指标对比 Tab -->
                <div v-show="activeTab === 'indicators'">
                  <IndicatorComparisonTable
                    :indicators="bot.signal_bot?.indicators_config?.indicators || []"
                    :indicatorValues="indicatorValues"
                    :requireAll="bot.signal_bot?.indicators_config?.require_all"
                    :triggerMode="bot.signal_bot?.indicators_config?.trigger_mode || 'state_change'"
                    :loading="loadingIndicators"
                    :updatedAt="indicatorValuesUpdatedAt"
                    @refresh="refreshIndicatorValues"
                  />
                </div>

                <!-- 市场状态 Tab -->
                <div v-show="activeTab === 'market'">
                  <MarketStatusPanel
                    :indicatorValues="indicatorValues"
                    :marketType="bot.signal_bot?.market_type || 'spot'"
                    :timeframe="indicatorValues.timeframe || bot.signal_bot?.timeframes_config?.primary || '1h'"
                    :loading="loadingIndicators"
                  />
                </div>

                <!-- 信号历史 Tab -->
                <div v-show="activeTab === 'signals'">
                  <SignalListSection
                    :signals="signals"
                    :loading="loadingSignals"
                    @toggleAnalysis="toggleAnalysis"
                    :expandedSignals="expandedSignals"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧边栏 (4列) -->
          <div class="col-span-12 lg:col-span-4 space-y-6">
            <!-- 市场健康度评分 -->
            <MarketHealthScore
              :score="healthScore"
              :trend="trendStatus"
              :volatility="volatilityStatus"
              :sentiment="sentimentStatus"
            />

            <!-- 基础信息面板 -->
            <BotInfoPanel
              :infoItems="infoItems"
              :extraItems="extraItems"
            />
          </div>
        </div>
      </div>

      <!-- 错误状态 -->
      <div v-else class="text-center py-24">
        <p class="text-gray-500">加载失败，请重试</p>
        <button @click="fetchBotDetail" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">重新加载</button>
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

    <!-- 删除确认对话框 -->
    <ConfirmDialog
      :show="showDeleteConfirm"
      type="danger"
      title="删除机器人"
      message="确定要删除这个机器人吗？此操作不可恢复。"
      confirm-text="删除"
      cancel-text="取消"
      @confirm="confirmDelete"
      @close="showDeleteConfirm = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, h } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Header from '../../common/Header.vue'
import ConfirmDialog from '../../common/ConfirmDialog.vue'
import BotHeader from '../detail/BotHeader.vue'
import BotInfoPanel from '../detail/BotInfoPanel.vue'
import MarketHealthScore from '../detail/MarketHealthScore.vue'
import MarketStatusPanel from '../detail/MarketStatusPanel.vue'
import IndicatorComparisonTable from '../signals/IndicatorComparisonTable.vue'
import SignalListSection from '../signals/SignalListSection.vue'
import { botAPI } from '../../../utils/api'
import { showSuccess, showError } from '../../../utils/notification'

// 图标组件
const ChartIcon = { render: () => h('svg', { class: 'w-4 h-4', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' })] ) }
const GlobeIcon = { render: () => h('svg', { class: 'w-4 h-4', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' })] ) }
const BellIcon = { render: () => h('svg', { class: 'w-4 h-4', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' })] ) }

const router = useRouter()
const route = useRoute()

// 状态
const loading = ref(false)
const actionLoading = ref(false)
const loadingSignals = ref(false)
const loadingIndicators = ref(false)
const bot = ref(null)
const signals = ref([])
const expandedSignals = ref({})
const showStopConfirm = ref(false)
const showDeleteConfirm = ref(false)
const indicatorValues = ref({})
const indicatorValuesUpdatedAt = ref(null)
const activeTab = ref('indicators')

let refreshInterval = null
let indicatorRefreshInterval = null

// Tab 配置
const tabs = computed(() => [
  { key: 'indicators', label: '指标对比', icon: ChartIcon },
  { key: 'market', label: '市场状态', icon: GlobeIcon },
  { key: 'signals', label: '信号历史', icon: BellIcon, count: signals.value.length }
])

// 头部统计数据
const headerStats = computed(() => {
  const price = indicatorValues.value?.price
  const change = indicatorValues.value?.price_change_24h || 0
  return [
    { label: '当前价格', value: formatPrice(price) },
    { label: '24h涨跌', value: `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`, color: change >= 0 ? 'text-emerald-600' : 'text-red-600' },
    { label: '24h成交量', value: formatVolume(indicatorValues.value?.volume_24h) },
    { label: '历史信号', value: signals.value.length, color: 'text-blue-600' }
  ]
})

// 右侧信息面板数据
const infoItems = computed(() => [
  { label: '交易对', value: `${bot.value?.token_symbol}/${bot.value?.trading_pair}` },
  { label: '交易所', value: bot.value?.exchange_display || bot.value?.exchange_name },
  { label: '市场类型', value: bot.value?.signal_bot?.market_type === 'futures' ? '合约' : '现货' },
  { label: '时间周期', value: bot.value?.signal_bot?.timeframes_config?.primary || '1h' },
  { label: '检查间隔', value: formatCheckInterval(bot.value?.signal_bot?.check_interval) }
])

const extraItems = computed(() => [
  { label: '信号过期', value: `${bot.value?.signal_bot?.signal_expiration_hours || 24}小时` },
  { label: '触发模式', value: bot.value?.signal_bot?.indicators_config?.trigger_mode === 'current_state' ? '当前状态' : '状态变化' },
  { label: '创建时间', value: formatDate(bot.value?.created_at) }
])

// 市场健康度评分计算
const healthScore = computed(() => {
  const indicators = bot.value?.signal_bot?.indicators_config?.indicators || []
  const values = indicatorValues.value
  if (!indicators.length || !Object.keys(values).length) return 50

  let score = 50
  const rsi = values.rsi?.rsi
  if (rsi) {
    if (rsi < 30) score += 15
    else if (rsi > 70) score -= 15
    else if (rsi < 45) score += 5
    else if (rsi > 55) score -= 5
  }
  const macd = values.macd
  if (macd?.macd_histogram > 0) score += 10
  else if (macd?.macd_histogram < 0) score -= 10

  return Math.max(0, Math.min(100, score))
})

const trendStatus = computed(() => {
  const indicators = bot.value?.signal_bot?.indicators_config?.indicators || []
  const trendIndicators = indicators.filter(i => ['rsi', 'macd', 'ma_crossover', 'trend_bias'].includes(i.type) && i.enabled)
  let satisfied = 0
  trendIndicators.forEach(i => { if (isIndicatorBullish(i)) satisfied++ })
  const status = satisfied > trendIndicators.length / 2 ? 'bullish' : satisfied < trendIndicators.length / 2 ? 'bearish' : 'neutral'
  return { status, satisfied, total: trendIndicators.length }
})

const volatilityStatus = computed(() => {
  const atr = indicatorValues.value?.atr
  if (!atr) return { status: 'normal', label: '正常' }
  return { status: 'normal', label: '正常' }
})

const sentimentStatus = computed(() => {
  const ls = indicatorValues.value?.long_short_ratio
  if (!ls) return { status: 'neutral', label: '中性' }
  if (ls.ratio > 1.5) return { status: 'bullish', label: '偏多' }
  if (ls.ratio < 0.67) return { status: 'bearish', label: '偏空' }
  return { status: 'neutral', label: '中性' }
})

// 辅助函数
const isIndicatorBullish = (indicator) => {
  const values = indicatorValues.value[indicator.type] || {}
  switch (indicator.type) {
    case 'rsi': return values.rsi < 50
    case 'macd': return values.macd_histogram > 0
    case 'ma_crossover': return values[`ma_${indicator.params?.fast || 7}`] > values[`ma_${indicator.params?.slow || 25}`]
    default: return false
  }
}

const formatPrice = (price) => {
  if (!price && price !== 0) return '--'
  const num = Number(price)
  if (num >= 1000) return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  if (num >= 1) return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })
  return num.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 8 })
}

const formatVolume = (volume) => {
  if (!volume && volume !== 0) return '--'
  const num = Number(volume)
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`
  if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`
  return num.toFixed(2)
}

const formatCheckInterval = (interval) => {
  if (!interval) return '1分钟'
  if (typeof interval === 'string') {
    const match = interval.match(/^(\d+)([smhd])$/)
    if (match) {
      const value = parseInt(match[1])
      const unit = { s: '秒', m: '分钟', h: '小时', d: '天' }[match[2]]
      return `${value}${unit}`
    }
    return interval
  }
  if (typeof interval === 'number') {
    if (interval < 60) return `${interval}秒`
    if (interval < 3600) return `${Math.floor(interval / 60)}分钟`
    return `${Math.floor(interval / 3600)}小时`
  }
  return '1分钟'
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

// API 调用
const fetchBotDetail = async () => {
  loading.value = true
  try {
    const response = await botAPI.getBotDetail(route.params.id)
    bot.value = response.data || response
  } catch (err) {
    showError('获取机器人详情失败')
  } finally {
    loading.value = false
  }
}

const fetchSignals = async () => {
  if (!bot.value?.id) return
  loadingSignals.value = true
  try {
    const response = await botAPI.getBotSignals(bot.value.id, { page_size: 20 })
    signals.value = Array.isArray(response.results || response.data || response) ? (response.results || response.data || response) : []
  } catch (err) {
    signals.value = []
  } finally {
    loadingSignals.value = false
  }
}

const refreshIndicatorValues = async () => {
  if (!bot.value?.id) return
  loadingIndicators.value = true
  try {
    const response = await botAPI.getBotIndicatorValues(bot.value.id)
    // 后端返回格式: { success: true, data: { price_change_24h: ..., ... } }
    const rawData = response.data || response
    indicatorValues.value = rawData.data || rawData.values || rawData || {}
    indicatorValuesUpdatedAt.value = rawData.updated_at || indicatorValues.value._metadata?.price_updated_at || new Date().toISOString()
  } catch (err) {
    console.error('获取指标值失败:', err)
  } finally {
    loadingIndicators.value = false
  }
}

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

const handleEditBot = () => {
  if (bot.value?.status === 'running') {
    showStopConfirm.value = true
  } else {
    router.push(`/bots/edit-signal/${bot.value.id}`)
  }
}

const confirmStopAndEdit = async () => {
  showStopConfirm.value = false
  await handleStopBot()
  router.push(`/bots/edit-signal/${bot.value.id}`)
}

const handleDeleteBot = () => {
  showDeleteConfirm.value = true
}

const confirmDelete = async () => {
  showDeleteConfirm.value = false
  try {
    await botAPI.deleteBot(bot.value.id)
    showSuccess('机器人已删除')
    router.push('/signal-bots')
  } catch (err) {
    showError(err.response?.data?.detail || '删除失败')
  }
}

const toggleAnalysis = (signalId) => {
  expandedSignals.value[signalId] = !expandedSignals.value[signalId]
}

onMounted(async () => {
  await fetchBotDetail()
  if (bot.value) {
    await Promise.all([fetchSignals(), refreshIndicatorValues()])
    refreshInterval = setInterval(fetchSignals, 60000)
    indicatorRefreshInterval = setInterval(refreshIndicatorValues, 30000)
  }
})

onUnmounted(() => {
  if (refreshInterval) clearInterval(refreshInterval)
  if (indicatorRefreshInterval) clearInterval(indicatorRefreshInterval)
})
</script>

