<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <!-- Header -->
    <Header />

    <!-- 主容器 - 包含侧边栏和内容 -->
    <div class="max-w-7xl mx-auto pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div class="flex gap-8 relative">
        <!-- 用户侧边栏 -->
        <div class="w-64 flex-shrink-0">
          <UserSidebar :activeItem="`bots-${botType}`" />
        </div>

        <!-- 主内容区域 -->
        <main class="flex-1 min-w-0">
          <!-- 页面标题和创建按钮 -->
          <div class="mb-6 flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">{{ botTypeConfig.title }}</h1>
              <p class="mt-2 text-gray-600">{{ botTypeConfig.description }}</p>
            </div>
            <button
              @click="showCreateModal = true"
              class="flex items-center px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <PlusIcon class="h-5 w-5 mr-2" />
              创建{{ botTypeConfig.shortName }}
            </button>
          </div>

          <!-- 筛选栏 -->
          <div class="mb-6 flex items-center justify-between bg-white rounded-lg shadow-sm p-4">
            <div class="flex items-center space-x-4">
              <!-- 交易所筛选 -->
              <div class="w-48">
                <CustomSelect
                  v-model="exchangeFilter"
                  :options="exchangeOptions"
                  placeholder="所有交易所"
                />
              </div>

              <!-- 交易对筛选 -->
              <div class="w-40">
                <CustomSelect
                  v-model="pairFilter"
                  :options="pairOptions"
                  placeholder="所有交易对"
                />
              </div>

              <!-- 状态筛选 -->
              <div class="w-40">
                <CustomSelect
                  v-model="statusFilter"
                  :options="statusOptions"
                  placeholder="所有状态"
                />
              </div>
            </div>

            <!-- 搜索 -->
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="搜索机器人..."
                class="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <MagnifyingGlassIcon class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <!-- 机器人列表 -->
          <div v-if="loading" class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p class="mt-4 text-gray-600">加载中...</p>
          </div>

          <div v-else-if="filteredBots.length === 0" class="bg-white rounded-lg shadow-sm p-12 text-center">
            <component :is="botTypeConfig.icon" class="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-gray-900 mb-2">还没有{{ botTypeConfig.shortName }}</h3>
            <p class="text-gray-600 mb-6">{{ botTypeConfig.emptyMessage }}</p>
            <button
              @click="showCreateModal = true"
              class="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon class="h-5 w-5 mr-2" />
              创建{{ botTypeConfig.shortName }}
            </button>
          </div>

          <!-- 表格视图 -->
          <div v-else class="bg-white rounded-lg shadow-sm overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态/名称</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">交易所</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">交易对</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">总盈亏</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">胜率</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">交易次数</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">启用</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="bot in filteredBots" :key="bot.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <span
                        :class="[
                          'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mr-3',
                          statusColors[bot.status]
                        ]"
                      >
                        {{ bot.status_display }}
                      </span>
                      <div>
                        <div class="text-sm font-medium text-gray-900">{{ bot.name }}</div>
                        <div class="text-sm text-gray-500">{{ bot.token_symbol }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ bot.exchange_display }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ bot.token_symbol }}/{{ bot.trading_pair }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium" :class="bot.total_profit >= 0 ? 'text-green-600' : 'text-red-600'">
                      {{ formatCurrency(bot.total_profit) }}
                    </div>
                    <div class="text-xs" :class="bot.total_profit_percentage >= 0 ? 'text-green-600' : 'text-red-600'">
                      {{ bot.total_profit_percentage >= 0 ? '+' : '' }}{{ bot.total_profit_percentage }}%
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ bot.win_rate.toFixed(2) }}%
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ bot.total_trades }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <button
                      @click="toggleBot(bot)"
                      :class="[
                        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                        bot.status === 'running' ? 'bg-green-600' : 'bg-gray-200'
                      ]"
                    >
                      <span
                        :class="[
                          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                          bot.status === 'running' ? 'translate-x-6' : 'translate-x-1'
                        ]"
                      />
                    </button>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      @click="handleViewBot(bot)"
                      class="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      查看
                    </button>
                    <button
                      @click="handleEditBot(bot)"
                      class="text-gray-600 hover:text-gray-900 mr-3"
                    >
                      编辑
                    </button>
                    <button
                      @click="handleDeleteBot(bot)"
                      class="text-red-600 hover:text-red-900"
                    >
                      删除
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>

    <!-- 创建/编辑机器人模态框 -->
    <CreateBotModal
      v-if="showCreateModal"
      :bot="editingBot"
      :defaultBotType="botType"
      @close="showCreateModal = false; editingBot = null"
      @success="handleBotCreated"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Header from '../common/Header.vue'
import UserSidebar from '../common/UserSidebar.vue'
import CustomSelect from '../common/CustomSelect.vue'
import CreateBotModal from './CreateBotModal.vue'
import {
  PlusIcon,
  MagnifyingGlassIcon,
  BellIcon,
  ChartBarIcon,
  BoltIcon,
  ArrowTrendingUpIcon,
  ScaleIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  DocumentIcon,
} from '@heroicons/vue/24/outline'
import { botAPI, exchangeAPI } from '../../utils/api'

// Props
const props = defineProps({
  botType: {
    type: String,
    required: true
  }
})

const router = useRouter()

// 机器人类型配置
const botTypeConfigs = {
  signal: {
    title: '信号机器人',
    shortName: '信号机器人',
    description: '监控市场信号，发送通知提醒，不自动交易',
    emptyMessage: '创建您的第一个信号机器人，实时监控市场动态',
    icon: BellIcon
  },
  'trend-following': {
    title: '趋势跟踪机器人',
    shortName: '趋势跟踪机器人',
    description: '识别趋势方向，自动开仓、加仓、止盈止损',
    emptyMessage: '创建趋势跟踪机器人，自动捕捉市场趋势',
    icon: ChartBarIcon
  },
  breakout: {
    title: '突破机器人',
    shortName: '突破机器人',
    description: '监控关键价格位，突破时自动开仓',
    emptyMessage: '创建突破机器人，捕捉价格突破机会',
    icon: BoltIcon
  },
  martingale: {
    title: '马丁格尔机器人',
    shortName: '马丁格尔机器人',
    description: '逆势加仓策略，高风险高收益',
    emptyMessage: '创建马丁格尔机器人，使用高级交易策略',
    icon: ArrowTrendingUpIcon
  },
  arbitrage: {
    title: '套利机器人',
    shortName: '套利机器人',
    description: '跨交易所价差套利，低风险稳定收益',
    emptyMessage: '创建套利机器人，获取稳定收益',
    icon: ScaleIcon
  }
}

const botTypeConfig = computed(() => botTypeConfigs[props.botType] || botTypeConfigs.signal)

// 状态
const loading = ref(false)
const bots = ref([])
const exchanges = ref([])
const exchangeFilter = ref('all')
const pairFilter = ref('all')
const statusFilter = ref('all')
const searchQuery = ref('')
const showCreateModal = ref(false)
const editingBot = ref(null)

// 交易所选项
const exchangeOptions = computed(() => {
  return [
    { value: 'all', label: '所有交易所' },
    ...exchanges.value.map(exchange => ({
      value: exchange.id,
      label: exchange.exchange_display
    }))
  ]
})

// 交易对选项
const pairOptions = [
  { value: 'all', label: '所有交易对' },
  { value: 'USDT', label: 'USDT' },
  { value: 'BUSD', label: 'BUSD' },
  { value: 'USDC', label: 'USDC' },
]

// 状态选项
const statusOptions = [
  { value: 'all', label: '所有状态' },
  { value: 'running', label: '运行中', icon: PlayIcon },
  { value: 'paused', label: '已暂停', icon: PauseIcon },
  { value: 'stopped', label: '已停止', icon: StopIcon },
  { value: 'draft', label: '草稿', icon: DocumentIcon },
]

// 状态颜色
const statusColors = {
  draft: 'bg-gray-100 text-gray-700',
  running: 'bg-green-100 text-green-700',
  paused: 'bg-yellow-100 text-yellow-700',
  stopped: 'bg-red-100 text-red-700',
  error: 'bg-red-100 text-red-700',
}

// 计算属性 - 筛选后的机器人
const filteredBots = computed(() => {
  let result = bots.value

  // 按交易所筛选
  if (exchangeFilter.value !== 'all') {
    result = result.filter(bot => bot.exchange_api === parseInt(exchangeFilter.value))
  }

  // 按交易对筛选
  if (pairFilter.value !== 'all') {
    result = result.filter(bot => bot.trading_pair === pairFilter.value)
  }

  // 按状态筛选
  if (statusFilter.value !== 'all') {
    result = result.filter(bot => bot.status === statusFilter.value)
  }

  // 按搜索关键词筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(bot =>
      bot.name.toLowerCase().includes(query) ||
      bot.token_symbol.toLowerCase().includes(query)
    )
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
    const botTypeMap = {
      'signal': 'signal',
      'trend-following': 'trend_following',
      'breakout': 'breakout',
      'martingale': 'martingale',
      'arbitrage': 'arbitrage'
    }
    const response = await botAPI.getBotList({ bot_type: botTypeMap[props.botType] })
    if (response.success !== false) {
      bots.value = Array.isArray(response) ? response : (response.data || [])
    }
  } catch (error) {
    console.error('加载机器人列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 加载交易所列表
const loadExchanges = async () => {
  try {
    const response = await exchangeAPI.getExchangeList()
    exchanges.value = Array.isArray(response) ? response : (response.data || [])
  } catch (error) {
    console.error('加载交易所列表失败:', error)
  }
}

// 切换机器人状态
const toggleBot = async (bot) => {
  try {
    if (bot.status === 'running') {
      await botAPI.stopBot(bot.id)
    } else {
      await botAPI.startBot(bot.id)
    }
    await loadBots()
  } catch (error) {
    console.error('切换机器人状态失败:', error)
    alert(error.message || '操作失败')
  }
}

// 查看机器人
const handleViewBot = (bot) => {
  router.push(`/bots/${bot.id}`)
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
    await botAPI.deleteBot(bot.id)
    await loadBots()
  } catch (error) {
    console.error('删除机器人失败:', error)
    alert(error.message || '删除失败')
  }
}

// 机器人创建/更新成功
const handleBotCreated = async () => {
  showCreateModal.value = false
  editingBot.value = null
  await loadBots()
}

// 初始化
onMounted(() => {
  loadBots()
  loadExchanges()
})
</script>

