import { ref, computed } from 'vue'
import { botAPI } from '../../../utils/api'
import { showSuccess, showError } from '../../../utils/notification'

/**
 * 机器人列表 Composable
 * 处理机器人列表的加载、筛选、排序等业务逻辑
 */
export function useBotList() {
  // 状态
  const bots = ref([])
  const loading = ref(false)
  const loadingBotId = ref(null)

  const filters = ref({
    status: 'all',
    exchange: 'all',
    search: '',
    bot_type: 'all'
  })

  const pagination = ref({
    page: 1,
    pageSize: 10,
    total: 0
  })

  const exchangeOptions = ref([])
  const botTypeOptions = [
    { label: '全部类型', value: 'all' },
    { label: '信号机器人', value: 'signal' },
    { label: '趋势跟踪', value: 'trend_following' }
  ]

  const statusOptions = [
    { label: '全部状态', value: 'all' },
    { label: '运行中', value: 'running' },
    { label: '已暂停', value: 'paused' },
    { label: '已停止', value: 'stopped' },
    { label: '草稿', value: 'draft' }
  ]

  // 计算属性
  const filteredBots = computed(() => {
    let result = bots.value

    if (filters.value.status !== 'all') {
      result = result.filter(bot => bot.status === filters.value.status)
    }

    if (filters.value.exchange !== 'all') {
      result = result.filter(bot => bot.exchange_api?.exchange === filters.value.exchange)
    }

    if (filters.value.bot_type !== 'all') {
      result = result.filter(bot => bot.bot_type === filters.value.bot_type)
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

  // 方法
  const loadBots = async () => {
    try {
      loading.value = true
      const response = await botAPI.getBotList()
      const data = response.results || response.data || response
      bots.value = Array.isArray(data) ? data : []
      pagination.value.total = bots.value.length
      updateExchangeOptions()
    } catch (error) {
      console.error('加载机器人失败:', error)
      showError('加载机器人失败')
    } finally {
      loading.value = false
    }
  }

  const updateExchangeOptions = () => {
    const exchanges = new Set()
    bots.value.forEach(bot => {
      if (bot.exchange_api?.exchange) {
        exchanges.add(bot.exchange_api.exchange)
      }
    })
    exchangeOptions.value = Array.from(exchanges).sort()
  }

  const startBot = async (botId) => {
    try {
      loadingBotId.value = botId
      await botAPI.startBot(botId)
      showSuccess('机器人已启动')
      await loadBots()
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
      await loadBots()
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
      await loadBots()
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
      await loadBots()
    } catch (error) {
      showError(error.message || '删除失败')
    } finally {
      loadingBotId.value = null
    }
  }

  const resetFilters = () => {
    filters.value = { status: 'all', exchange: 'all', search: '', bot_type: 'all' }
    pagination.value.page = 1
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

  return {
    // 状态
    bots,
    loading,
    loadingBotId,
    filters,
    pagination,
    exchangeOptions,
    botTypeOptions,
    statusOptions,

    // 计算属性
    filteredBots,

    // 方法
    loadBots,
    updateExchangeOptions,
    startBot,
    stopBot,
    pauseBot,
    deleteBot,
    resetFilters,
    getStatusLabel,
    getStatusVariant
  }
}

