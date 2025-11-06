import { ref, computed } from 'vue'
import { botAPI } from '../../../utils/api'
import { showSuccess, showError } from '../../../utils/notification'

/**
 * 信号监控 Composable
 * 处理信号机器人的加载、筛选、操作等业务逻辑
 */
export function useSignalMonitor() {
  // 状态
  const signalBots = ref([])
  const recentSignals = ref([])
  const loading = ref(false)
  const loadingSignals = ref(false)
  const loadingBotId = ref(null)

  const statistics = ref({
    active_bots: 0,
    paused_bots: 0,
    stopped_bots: 0,
    today_signals: 0,
    total_signals: 0,
    avg_response_time: 0
  })

  const filters = ref({
    status: 'all',
    exchange: 'all',
    search: ''
  })

  const exchangeOptions = ref([])

  // 计算属性
  const filteredBots = computed(() => {
    let result = signalBots.value

    if (filters.value.status !== 'all') {
      result = result.filter(bot => bot.status === filters.value.status)
    }

    if (filters.value.exchange !== 'all') {
      result = result.filter(bot => bot.exchange_api?.exchange === filters.value.exchange)
    }

    if (filters.value.search.trim()) {
      const query = filters.value.search.toLowerCase()
      result = result.filter(bot =>
        bot.name.toLowerCase().includes(query) ||
        bot.token?.symbol?.toLowerCase().includes(query)
      )
    }

    return result
  })

  const signalTypeDistribution = computed(() => {
    const distribution = {}
    recentSignals.value.forEach(signal => {
      distribution[signal.signal_type] = (distribution[signal.signal_type] || 0) + 1
    })
    return distribution
  })

  // 方法
  const loadSignalBots = async () => {
    try {
      loading.value = true
      const response = await botAPI.getBotList()
      const bots = response.results || response.data || response
      signalBots.value = Array.isArray(bots) ? bots.filter(bot => bot.bot_type === 'signal') : []
      updateExchangeOptions()
      updateStatistics()
    } catch (error) {
      console.error('加载信号机器人失败:', error)
      showError('加载信号机器人失败')
    } finally {
      loading.value = false
    }
  }

  const loadRecentSignals = async () => {
    try {
      loadingSignals.value = true
      // TODO: 调用信号API获取最近信号
      recentSignals.value = []
    } catch (error) {
      console.error('加载信号失败:', error)
    } finally {
      loadingSignals.value = false
    }
  }

  const updateExchangeOptions = () => {
    const exchanges = new Set()
    signalBots.value.forEach(bot => {
      if (bot.exchange_api?.exchange) {
        exchanges.add(bot.exchange_api.exchange)
      }
    })
    exchangeOptions.value = Array.from(exchanges).sort()
  }

  const updateStatistics = () => {
    statistics.value = {
      active_bots: signalBots.value.filter(bot => bot.status === 'running').length,
      paused_bots: signalBots.value.filter(bot => bot.status === 'paused').length,
      stopped_bots: signalBots.value.filter(bot => bot.status === 'stopped').length,
      today_signals: recentSignals.value.filter(signal => {
        const today = new Date().toDateString()
        return new Date(signal.created_at).toDateString() === today
      }).length,
      total_signals: recentSignals.value.length,
      avg_response_time: 45
    }
  }

  const startBot = async (botId) => {
    try {
      loadingBotId.value = botId
      await botAPI.startBot(botId)
      showSuccess('机器人已启动')
      await loadSignalBots()
    } catch (error) {
      showError(error.message || '启动失败')
    } finally {
      loadingBotId.value = null
    }
  }

  const stopBot = async (botId) => {
    try {
      loadingBotId.value = botId
      await botAPI.stopBot(botId)
      showSuccess('机器人已停止')
      await loadSignalBots()
    } catch (error) {
      showError(error.message || '停止失败')
    } finally {
      loadingBotId.value = null
    }
  }

  const pauseBot = async (botId) => {
    try {
      loadingBotId.value = botId
      await botAPI.pauseBot(botId)
      showSuccess('机器人已暂停')
      await loadSignalBots()
    } catch (error) {
      showError(error.message || '暂停失败')
    } finally {
      loadingBotId.value = null
    }
  }

  const deleteBot = async (botId) => {
    try {
      loadingBotId.value = botId
      await botAPI.deleteBot(botId)
      showSuccess('机器人已删除')
      await loadSignalBots()
    } catch (error) {
      showError(error.message || '删除失败')
    } finally {
      loadingBotId.value = null
    }
  }

  const resetFilters = () => {
    filters.value = { status: 'all', exchange: 'all', search: '' }
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

  const getStatusVariant = (status) => {
    const map = {
      running: 'success',
      paused: 'warning',
      stopped: 'danger',
      draft: 'secondary'
    }
    return map[status] || 'secondary'
  }

  const getSignalTypeVariant = (type) => {
    const map = {
      buy: 'success',
      sell: 'danger',
      neutral: 'secondary'
    }
    return map[type] || 'info'
  }

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleString('zh-CN')
  }

  const getPercentage = (count) => {
    const total = Object.values(signalTypeDistribution.value).reduce((a, b) => a + b, 0)
    return total > 0 ? Math.round((count / total) * 100) : 0
  }

  return {
    // 状态
    signalBots,
    recentSignals,
    loading,
    loadingSignals,
    loadingBotId,
    statistics,
    filters,
    exchangeOptions,

    // 计算属性
    filteredBots,
    signalTypeDistribution,

    // 方法
    loadSignalBots,
    loadRecentSignals,
    updateExchangeOptions,
    updateStatistics,
    startBot,
    stopBot,
    pauseBot,
    deleteBot,
    resetFilters,
    getStatusLabel,
    getStatusVariant,
    getSignalTypeVariant,
    formatTime,
    getPercentage
  }
}

