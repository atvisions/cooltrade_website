<template>
  <div class="min-h-screen bg-slate-50">
    <Header />
    <div class="max-w-7xl mx-auto pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div class="flex gap-8 relative">
        <div class="w-64 flex-shrink-0">
          <UserSidebar activeItem="signal-bots" />
        </div>
        <main class="flex-1 min-w-0">
          <!-- 页面头部 -->
          <div class="mb-8">
            <div class="flex items-start justify-between mb-6">
              <div>
                <h1 class="text-3xl font-bold text-slate-900">信号机器人</h1>
                <p class="text-slate-600 mt-1">监控和管理所有信号机器人</p>
              </div>
              <Button 
                variant="primary" 
                @click="handleCreateBot"
                class="flex items-center gap-2"
              >
                <PlusIcon class="h-5 w-5" />
                创建机器人
              </Button>
            </div>

            <!-- 关键指标卡片 -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card variant="default">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-slate-600">活跃机器人</p>
                    <p class="text-2xl font-bold text-slate-900 mt-1">{{ statistics.active_bots }}</p>
                  </div>
                  <div class="p-3 bg-blue-100 rounded-lg">
                    <CpuChipIcon class="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </Card>

              <Card variant="default">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-slate-600">今日信号</p>
                    <p class="text-2xl font-bold text-slate-900 mt-1">{{ statistics.today_signals }}</p>
                  </div>
                  <div class="p-3 bg-green-100 rounded-lg">
                    <BellIcon class="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </Card>

              <Card variant="default">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-slate-600">总信号数</p>
                    <p class="text-2xl font-bold text-slate-900 mt-1">{{ statistics.total_signals }}</p>
                  </div>
                  <div class="p-3 bg-purple-100 rounded-lg">
                    <ChartBarIcon class="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </Card>

              <Card variant="default">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-slate-600">平均响应</p>
                    <p class="text-2xl font-bold text-slate-900 mt-1">{{ statistics.avg_response_time }}<span class="text-sm">ms</span></p>
                  </div>
                  <div class="p-3 bg-amber-100 rounded-lg">
                    <svg class="h-6 w-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <!-- 标签页 -->
          <div class="mb-8">
            <!-- TAB 导航 -->
            <div class="flex gap-2 mb-6 border-b border-slate-200">
              <button
                v-for="(tab, index) in tabs"
                :key="index"
                @click="activeTab = index"
                :class="[
                  'px-6 py-3 font-medium text-sm transition-all duration-300 relative',
                  activeTab === index
                    ? 'text-slate-900'
                    : 'text-slate-500 hover:text-slate-700'
                ]"
              >
                <span>{{ tab.label }}</span>
                <div
                  v-if="activeTab === index"
                  class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-400 rounded-t"
                ></div>
              </button>
            </div>

            <!-- 机器人列表 TAB -->
            <div v-if="activeTab === 0">
              <div class="space-y-4">
                <!-- 筛选栏 -->
                <Card variant="default">
                  <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Select 
                      v-model="filters.status"
                      :options="statusOptions"
                      option-label="label"
                      option-value="value"
                      placeholder="选择状态"
                      @change="handleFilterChange"
                    />
                    <Select 
                      v-model="filters.exchange"
                      :options="exchangeOptions"
                      placeholder="选择交易所"
                      @change="handleFilterChange"
                    />
                    <Input 
                      v-model="filters.search"
                      placeholder="搜索机器人名称或代币"
                      @input="handleFilterChange"
                    />
                    <Button 
                      variant="secondary"
                      @click="resetFilters"
                    >
                      重置筛选
                    </Button>
                  </div>
                </Card>

                <!-- 机器人表格 -->
                <Card variant="default">
                  <Table 
                    :data="filteredBots"
                    :columns="botColumns"
                    :loading="loading"
                    :paginator="true"
                    :rows="10"
                  >
                    <template #col-name="{ row }">
                      <div class="flex items-center gap-2">
                        <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <CpuChipIcon class="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p class="font-medium text-slate-900">{{ row.name }}</p>
                          <p class="text-xs text-slate-500">{{ row.token?.symbol }}</p>
                        </div>
                      </div>
                    </template>

                    <template #col-status="{ row }">
                      <Badge :variant="getStatusVariant(row.status)">
                        {{ getStatusLabel(row.status) }}
                      </Badge>
                    </template>

                    <template #col-signal_type="{ row }">
                      <Badge variant="info">
                        {{ row.signal_bot?.signal_type || 'N/A' }}
                      </Badge>
                    </template>

                    <template #col-actions="{ row }">
                      <div class="flex items-center gap-2">
                        <Button 
                          v-if="row.status !== 'running'"
                          variant="primary"
                          size="sm"
                          @click="handleStartBot(row.id)"
                          :loading="loadingBotId === row.id"
                        >
                          启动
                        </Button>
                        <Button 
                          v-else
                          variant="danger"
                          size="sm"
                          @click="handleStopBot(row.id)"
                          :loading="loadingBotId === row.id"
                        >
                          停止
                        </Button>
                        <Button 
                          variant="secondary"
                          size="sm"
                          @click="handleEditBot(row.id)"
                        >
                          编辑
                        </Button>
                      </div>
                    </template>
                  </Table>
                </Card>
              </div>
            </div>

            <!-- 信号监控 TAB -->
            <div v-if="activeTab === 1">
              <div class="space-y-4">
                <!-- 信号表格 -->
                <Card variant="default">
                  <Table 
                    :data="recentSignals"
                    :columns="signalColumns"
                    :loading="loadingSignals"
                    :paginator="true"
                    :rows="10"
                  >
                    <template #col-bot_name="{ row }">
                      <p class="font-medium text-slate-900">{{ row.bot_name }}</p>
                    </template>

                    <template #col-signal_type="{ row }">
                      <Badge :variant="getSignalTypeVariant(row.signal_type)">
                        {{ row.signal_type }}
                      </Badge>
                    </template>

                    <template #col-price="{ row }">
                      <p class="font-mono text-slate-900">${{ row.price }}</p>
                    </template>

                    <template #col-created_at="{ row }">
                      <p class="text-sm text-slate-600">{{ formatTime(row.created_at) }}</p>
                    </template>

                    <template #col-status>
                      <Badge variant="success">已发送</Badge>
                    </template>
                  </Table>
                </Card>
              </div>
            </div>

            <!-- 统计数据 TAB -->
            <div v-if="activeTab === 2">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- 信号类型分布 -->
                <Card variant="default">
                  <h3 class="text-lg font-semibold text-slate-900 mb-4">信号类型分布</h3>
                  <div class="space-y-4">
                    <div v-for="(count, type) in signalTypeDistribution" :key="type" class="flex items-center justify-between">
                      <span class="text-sm text-slate-600">{{ type }}</span>
                      <div class="flex items-center gap-3">
                        <div class="w-32 bg-slate-200 rounded-full h-2">
                          <div class="bg-blue-600 h-2 rounded-full" :style="{ width: getPercentage(count) + '%' }"></div>
                        </div>
                        <span class="text-sm font-medium text-slate-900 w-12 text-right">{{ count }}</span>
                      </div>
                    </div>
                  </div>
                </Card>

                <!-- 机器人状态分布 -->
                <Card variant="default">
                  <h3 class="text-lg font-semibold text-slate-900 mb-4">机器人状态分布</h3>
                  <div class="space-y-4">
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-slate-600">运行中</span>
                      <span class="text-sm font-medium text-slate-900">{{ statistics.active_bots }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-slate-600">已暂停</span>
                      <span class="text-sm font-medium text-slate-900">{{ statistics.paused_bots }}</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-slate-600">已停止</span>
                      <span class="text-sm font-medium text-slate-900">{{ statistics.stopped_bots }}</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            <!-- 集群回测 TAB -->
            <div v-if="activeTab === 3">
              <BacktestPanel />
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Header from '../../common/Header.vue'
import UserSidebar from '../../common/UserSidebar.vue'
import Button from '../../common/ui/Button.vue'
import Input from '../../common/ui/Input.vue'
import Select from '../../common/ui/Select.vue'
import Card from '../../common/ui/Card.vue'
import Badge from '../../common/ui/Badge.vue'
import Table from '../../common/ui/Table.vue'
import BacktestPanel from '../components/BacktestPanel.vue'
import { CpuChipIcon, BellIcon, PlusIcon, ChartBarIcon } from '@heroicons/vue/24/outline'
import { botAPI } from '../../../utils/api'
import { showSuccess, showError } from '../../../utils/notification'

const router = useRouter()
const activeTab = ref(0)
const loading = ref(false)
const loadingSignals = ref(false)
const loadingBotId = ref(null)
const signalBots = ref([])
const recentSignals = ref([])
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

const statusOptions = [
  { label: '全部状态', value: 'all' },
  { label: '运行中', value: 'running' },
  { label: '已暂停', value: 'paused' },
  { label: '已停止', value: 'stopped' }
]

const exchangeOptions = ref([])

const tabs = [
  { label: '机器人列表', content: 'bots' },
  { label: '信号监控', content: 'signals' },
  { label: '统计数据', content: 'statistics' },
  { label: '集群回测', content: 'backtest' }
]

const botColumns = [
  { field: 'name', header: '机器人名称' },
  { field: 'status', header: '状态' },
  { field: 'signal_type', header: '信号类型' },
  { field: 'actions', header: '操作' }
]

const signalColumns = [
  { field: 'bot_name', header: '机器人' },
  { field: 'signal_type', header: '信号类型' },
  { field: 'price', header: '价格' },
  { field: 'created_at', header: '时间' },
  { field: 'status', header: '状态' }
]

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
    const response = await botAPI.getSignalList()
    const signals = response.results || response.data || response
    recentSignals.value = Array.isArray(signals) ? signals : []
  } catch (error) {
    console.error('加载信号失败:', error)
    recentSignals.value = []
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

const handleFilterChange = () => {
  // 筛选自动应用
}

const resetFilters = () => {
  filters.value = { status: 'all', exchange: 'all', search: '' }
}

const handleStartBot = async (botId) => {
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

const handleStopBot = async (botId) => {
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

const handleEditBot = (botId) => {
  router.push(`/edit-signal-bot/${botId}`)
}

const handleCreateBot = () => {
  router.push('/create-signal-bot')
}

const getStatusLabel = (status) => {
  const map = { running: '运行中', paused: '已暂停', stopped: '已停止', draft: '草稿' }
  return map[status] || status
}

const getStatusVariant = (status) => {
  const map = { running: 'success', paused: 'warning', stopped: 'danger', draft: 'secondary' }
  return map[status] || 'secondary'
}

const getSignalTypeVariant = (type) => {
  const map = { buy: 'success', sell: 'danger', neutral: 'secondary' }
  return map[type] || 'info'
}

const formatTime = (dateString) => {
  return new Date(dateString).toLocaleString('zh-CN')
}

const getPercentage = (count) => {
  const total = Object.values(signalTypeDistribution.value).reduce((a, b) => a + b, 0)
  return total > 0 ? Math.round((count / total) * 100) : 0
}

onMounted(async () => {
  await loadSignalBots()
  await loadRecentSignals()
})
</script>

