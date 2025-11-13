<template>
  <div class="min-h-screen bg-slate-50">
    <Header />
    <div class="max-w-7xl mx-auto pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <main class="w-full">
          <!-- 页面头部 -->
          <div class="mb-10">
            <div class="flex items-start justify-between mb-8">
              <div>
                <h1 class="text-3xl font-bold text-slate-900">{{ pageConfig.title }}</h1>
                <p class="text-slate-600 mt-2">{{ pageConfig.description }}</p>
              </div>
              <!-- 胶囊形状按钮设计 -->
              <button
                @click="handleCreateBot"
                class="group inline-flex items-center gap-3 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <span class="px-2">{{ pageConfig.createButtonText }}</span>
                <div class="flex items-center justify-center w-8 h-8 bg-white rounded-full group-hover:bg-gray-50 transition-all duration-200">
                  <svg class="w-4 h-4 text-blue-600 transform group-hover:translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </div>
              </button>
            </div>

            <!-- 关键指标卡片 - 商务设计 -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
              <!-- 总机器人 -->
              <div class="bg-white rounded-2xl p-6 border border-slate-200 hover:border-slate-300 transition-colors duration-200">
                <div class="flex items-start justify-between">
                  <div>
                    <p class="text-sm font-medium text-slate-500 uppercase tracking-wider">总机器人</p>
                    <p class="text-4xl font-bold text-slate-900 mt-3">{{ statistics.total_bots }}</p>
                    <p class="text-xs text-slate-400 mt-2">全部机器人总数</p>
                  </div>
                  <div class="p-3">
                    <CpuChipIcon class="h-6 w-6 text-slate-600" />
                  </div>
                </div>
              </div>

              <!-- 运行中 -->
              <div class="bg-white rounded-2xl p-6 border border-slate-200 hover:border-slate-300 transition-colors duration-200">
                <div class="flex items-start justify-between">
                  <div>
                    <p class="text-sm font-medium text-slate-500 uppercase tracking-wider">运行中</p>
                    <p class="text-4xl font-bold text-green-600 mt-3">{{ statistics.running_bots }}</p>
                    <p class="text-xs text-slate-400 mt-2">正在运行的机器人</p>
                  </div>
                  <div class="p-3">
                    <PlayIcon class="h-6 w-6 text-slate-600" />
                  </div>
                </div>
              </div>

              <!-- 总交易次数 -->
              <div class="bg-white rounded-2xl p-6 border border-slate-200 hover:border-slate-300 transition-colors duration-200">
                <div class="flex items-start justify-between">
                  <div>
                    <p class="text-sm font-medium text-slate-500 uppercase tracking-wider">总交易次数</p>
                    <p class="text-4xl font-bold text-blue-600 mt-3">{{ statistics.total_trades || 0 }}</p>
                    <p class="text-xs text-slate-400 mt-2">累计交易次数</p>
                  </div>
                  <div class="p-3">
                    <ChartBarIcon class="h-6 w-6 text-slate-600" />
                  </div>
                </div>
              </div>

              <!-- 总收益 -->
              <div class="bg-white rounded-2xl p-6 border border-slate-200 hover:border-slate-300 transition-colors duration-200">
                <div class="flex items-start justify-between">
                  <div>
                    <p class="text-sm font-medium text-slate-500 uppercase tracking-wider">总收益</p>
                    <p class="text-4xl font-bold text-green-600 mt-3">${{ Number(statistics.total_profit || 0).toFixed(2) }}</p>
                    <p class="text-xs text-slate-400 mt-2">累计收益</p>
                  </div>
                  <div class="p-3">
                    <svg class="h-6 w-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB 标签页 - 高级设计 -->
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
                <span class="flex items-center gap-2">
                  <i :class="`pi pi-${tab.icon}`"></i>
                  {{ tab.label }}
                </span>
                <div
                  v-if="activeTab === index"
                  class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-400 rounded-t"
                ></div>
              </button>
            </div>

            <!-- TAB 1: 机器人列表 -->
            <div v-if="activeTab === 0">
              <!-- 筛选和搜索 - HeadlessUI 组件 -->
              <div class="bg-white rounded-2xl p-6 mb-6 border border-slate-200">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <!-- 状态筛选 -->
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-slate-700">状态</label>
                    <Listbox v-model="filters.status">
                      <div class="relative">
                        <ListboxButton class="relative w-full cursor-default rounded-xl bg-slate-50 py-3 pl-4 pr-10 text-left border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <span class="block truncate text-slate-700">
                            {{ statusOptionsWithAll.find(option => option.value === filters.status)?.label || '全部状态' }}
                          </span>
                          <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <ChevronUpDownIcon class="h-5 w-5 text-slate-400" aria-hidden="true" />
                          </span>
                        </ListboxButton>
                        <transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
                          <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <ListboxOption
                              v-slot="{ active, selected }"
                              v-for="option in statusOptionsWithAll"
                              :key="option.value"
                              :value="option.value"
                              as="template"
                            >
                              <li :class="[active ? 'bg-slate-100 text-slate-900' : 'text-slate-700', 'relative cursor-default select-none py-3 pl-4 pr-4']">
                                <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">{{ option.label }}</span>
                                <span v-if="selected" class="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-600">
                                  <CheckIcon class="h-5 w-5" aria-hidden="true" />
                                </span>
                              </li>
                            </ListboxOption>
                          </ListboxOptions>
                        </transition>
                      </div>
                    </Listbox>
                  </div>

                  <!-- 交易所筛选 -->
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-slate-700">交易所</label>
                    <Listbox v-model="filters.exchange">
                      <div class="relative">
                        <ListboxButton class="relative w-full cursor-default rounded-xl bg-slate-50 py-3 pl-4 pr-10 text-left border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <span class="block truncate text-slate-700">
                            {{ exchangeOptionsWithAll.find(option => option.value === filters.exchange)?.label || '选择交易所' }}
                          </span>
                          <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <ChevronUpDownIcon class="h-5 w-5 text-slate-400" aria-hidden="true" />
                          </span>
                        </ListboxButton>
                        <transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
                          <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <ListboxOption
                              v-slot="{ active, selected }"
                              v-for="option in exchangeOptionsWithAll"
                              :key="option.value"
                              :value="option.value"
                              as="template"
                            >
                              <li :class="[active ? 'bg-slate-100 text-slate-900' : 'text-slate-700', 'relative cursor-default select-none py-3 pl-4 pr-4']">
                                <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">{{ option.label }}</span>
                                <span v-if="selected" class="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-600">
                                  <CheckIcon class="h-5 w-5" aria-hidden="true" />
                                </span>
                              </li>
                            </ListboxOption>
                          </ListboxOptions>
                        </transition>
                      </div>
                    </Listbox>
                  </div>

                  <!-- 搜索框 -->
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-slate-700">搜索</label>
                    <div class="relative">
                      <input
                        v-model="filters.search"
                        type="text"
                        placeholder="机器人名称或代币"
                        class="w-full rounded-xl bg-slate-50 border border-slate-200 pl-10 pr-4 py-3 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <MagnifyingGlassIcon class="h-5 w-5 text-slate-400" />
                      </div>
                    </div>
                  </div>

                  <!-- 重置按钮 -->
                  <div class="flex items-end">
                    <button
                      @click="resetFilters"
                      class="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl px-4 py-3 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                    >
                      重置筛选
                    </button>
                  </div>
                </div>
              </div>

              <!-- 机器人表格 - 高级设计 -->
              <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div v-if="loading" class="flex items-center justify-center py-12">
                  <div class="text-center">
                    <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                    <p class="text-slate-500">加载中...</p>
                  </div>
                </div>
                <div v-else-if="filteredBots.length === 0" class="text-center py-12">
                  <p class="text-slate-500">暂无机器人数据</p>
                </div>
                <div v-else class="overflow-x-auto">
                  <table class="w-full">
                    <thead>
                      <tr class="border-b border-slate-200 bg-slate-50">
                        <th class="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">机器人名称</th>
                        <th class="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">类型</th>
                        <th class="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">状态</th>
                        <th class="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">总盈亏</th>
                        <th class="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">胜率</th>
                        <th class="px-6 py-4 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(bot, index) in filteredBots"
                        :key="bot.id"
                        :class="[
                          'border-b border-slate-200 hover:bg-slate-50 transition-colors duration-200',
                          index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                        ]"
                      >
                        <td class="px-6 py-4">
                          <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                              <CpuChipIcon class="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <p class="font-medium text-slate-900">{{ bot.name }}</p>
                              <p class="text-xs text-slate-500">
                                {{ bot.exchange_display || bot.exchange_name || '未知交易所' }}
                              </p>
                            </div>
                          </div>
                        </td>
                        <!-- 交易机器人显示类型 -->
                        <td class="px-6 py-4">
                          <span :class="[
                            'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
                            bot.bot_type === 'trend_following'
                              ? 'bg-green-100 text-green-700'
                              : bot.bot_type === 'grid_trading'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-purple-100 text-purple-700'
                          ]">
                            {{ getBotTypeLabel(bot.bot_type) }}
                          </span>
                        </td>
                        <td class="px-6 py-4">
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
                        </td>
                        <!-- 交易机器人显示盈亏数据 -->
                        <td class="px-6 py-4">
                          <p :class="bot.total_profit >= 0 ? 'text-green-600' : 'text-red-600'" class="font-semibold">
                            {{ formatCurrency(bot.total_profit) }}
                          </p>
                        </td>
                        <td class="px-6 py-4">
                          <p class="text-slate-900 font-medium">{{ bot.win_rate || 0 }}%</p>
                        </td>
                        <td class="px-6 py-4">
                          <div class="flex items-center justify-center gap-1">
                            <!-- 启动/停止按钮 -->
                            <button
                              v-if="bot.status !== 'running'"
                              @click="handleStartBot(bot.id)"
                              :disabled="loadingBotId === bot.id"
                              class="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors duration-200"
                              title="启动机器人"
                            >
                              <PlayIcon class="h-4 w-4" />
                            </button>
                            <button
                              v-else
                              @click="handleStopBot(bot.id)"
                              :disabled="loadingBotId === bot.id"
                              class="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                              title="停止机器人"
                            >
                              <StopIcon class="h-4 w-4" />
                            </button>

                            <!-- 编辑按钮 -->
                            <button
                              @click="handleEditBot(bot.id)"
                              class="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                              title="编辑机器人"
                            >
                              <PencilIcon class="h-4 w-4" />
                            </button>

                            <!-- 分享按钮 -->
                            <button
                              @click="handleShareBot(bot)"
                              class="p-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                              title="分享机器人"
                            >
                              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                              </svg>
                            </button>

                            <!-- 详情按钮 -->
                            <button
                              @click="handleViewBot(bot.id)"
                              class="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                              title="查看详情"
                            >
                              <EyeIcon class="h-4 w-4" />
                            </button>

                            <!-- 删除按钮 -->
                            <button
                              @click="handleDeleteBot(bot.id)"
                              class="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                              title="删除机器人"
                            >
                              <TrashIcon class="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- TAB 2: 持仓管理 -->
            <div v-if="activeTab === 1">
              <PositionList />
            </div>

            <!-- TAB 3: 委托订单 -->
            <div v-if="activeTab === 2">
              <OrderList />
            </div>

            <!-- TAB 4: 交易审批 -->
            <div v-if="activeTab === 3">
              <RecommendationList />
            </div>

            <!-- TAB 5: 交易记录 -->
            <div v-if="activeTab === 4">
              <TradeList />
            </div>

            <!-- TAB 6: 策略回测 -->
            <div v-if="activeTab === 5">
              <BacktestPanel />
            </div>

            <!-- TAB 7: 性能分析 -->
            <div v-if="activeTab === 6">
              <PerformanceAnalysis />
            </div>
          </div>
        </main>
    </div>

    <!-- 分享弹窗 -->
    <ShareBotModal
      :is-open="showShareModal"
      :bot="selectedBot"
      :loading="loadingBotId !== null"
      @confirm="handleConfirmShare"
      @cancel="handleCancelShare"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon, MagnifyingGlassIcon } from '@heroicons/vue/20/solid'
import Header from '../../common/Header.vue'
import ShareBotModal from '../../common/ShareBotModal.vue'
import PositionList from '../components/PositionList.vue'
import OrderList from '../components/OrderList.vue'
import RecommendationList from '../components/RecommendationList.vue'
import TradeList from '../components/TradeList.vue'
import BacktestPanel from '../components/BacktestPanel.vue'
import PerformanceAnalysis from '../components/PerformanceAnalysis.vue'
import { CpuChipIcon, PlayIcon, BellIcon, ChartBarIcon, StopIcon, PencilIcon, EyeIcon, TrashIcon } from '@heroicons/vue/24/outline'
import { botAPI } from '../../../utils/api'
import { showSuccess, showError } from '../../../utils/notification'

const router = useRouter()
const route = useRoute()

// 机器人类型配置
const botTypeConfigs = {
  trend_following: {
    title: '趋势跟踪',
    description: '管理和监控所有趋势跟踪机器人，自动执行交易策略',
    createButtonText: '创建机器人',
    createPath: '/bots/create',
    apiType: 'trend_following'
  },
  grid_trading: {
    title: '网格交易',
    description: '管理和监控所有网格交易机器人，自动执行网格策略',
    createButtonText: '创建机器人',
    createPath: '/bots/create?type=grid_trading',
    apiType: 'grid_trading'
  },
  dca: {
    title: 'DCA 定投',
    description: '管理和监控所有定投机器人，自动执行定投策略',
    createButtonText: '创建机器人',
    createPath: '/bots/create?type=dca',
    apiType: 'dca'
  }
}

// 当前机器人类型（从 query 参数获取，默认为 trend_following）
const currentBotType = computed(() => route.query.type || 'trend_following')

// 当前页面配置
const pageConfig = computed(() => {
  return botTypeConfigs[currentBotType.value] || botTypeConfigs.trend_following
})

// TAB 配置
const activeTab = ref(0)  // 默认显示"机器人列表"
const tabs = ref([
  { label: '机器人列表', icon: 'list' },
  { label: '持仓管理', icon: 'wallet' },
  { label: '委托订单', icon: 'document-text' },
  { label: '交易审批', icon: 'bolt' },
  { label: '交易记录', icon: 'clock' },
  { label: '策略回测', icon: 'chart-bar' },
  { label: '性能分析', icon: 'chart-line' }
])

const loading = ref(false)
const loadingBotId = ref(null)
const bots = ref([])
const statistics = ref({
  total_bots: 0,
  running_bots: 0,
  paused_bots: 0,
  total_profit: 0,
  total_trades: 0,
  win_rate: 0
})

const filters = ref({
  status: '',
  bot_type: '',
  exchange: '',
  search: ''
})

const statusOptions = [
  { label: '运行中', value: 'running' },
  { label: '已暂停', value: 'paused' },
  { label: '已停止', value: 'stopped' },
  { label: '草稿', value: 'draft' }
]

const statusOptionsWithAll = [
  { label: '全部状态', value: '' },
  ...statusOptions
]



const exchangeOptions = ref([])

const exchangeOptionsWithAll = computed(() => [
  { label: '选择交易所', value: '' },
  ...exchangeOptions.value.map(exchange => ({ label: exchange, value: exchange }))
])

const filteredBots = computed(() => {
  let result = bots.value

  // bots.value 已经在 loadBots 中根据 currentBotType 过滤过了
  // 这里只需要应用额外的过滤条件

  if (filters.value.status && filters.value.status !== '') {
    result = result.filter(bot => bot.status === filters.value.status)
  }

  if (filters.value.exchange && filters.value.exchange !== '') {
    result = result.filter(bot => bot.exchange_name === filters.value.exchange)
  }

  if (filters.value.search.trim()) {
    console.log('应用搜索过滤:', filters.value.search)
    const beforeCount = result.length
    const query = filters.value.search.toLowerCase()
    result = result.filter(bot =>
      bot.name.toLowerCase().includes(query) ||
      bot.token?.symbol?.toLowerCase().includes(query)
    )
    console.log(`搜索过滤: ${beforeCount} -> ${result.length}`)
  }

  return result
})

const loadBots = async () => {
  try {
    loading.value = true
    console.log('开始加载机器人数据...', '类型:', currentBotType.value)
    const response = await botAPI.getBotList()
    console.log('API响应:', response)
    const data = response.results || response.data || response
    console.log('处理后的数据:', data)

    // 根据机器人类型过滤
    const allBots = Array.isArray(data) ? data : []
    bots.value = allBots.filter(bot => bot.bot_type === currentBotType.value)

    console.log('过滤后的机器人数据:', bots.value)
    updateExchangeOptions()
    updateStatistics()
  } catch (error) {
    console.error('加载机器人失败:', error)
    showError('加载机器人失败: ' + (error.message || '未知错误'))
  } finally {
    loading.value = false
  }
}

const updateExchangeOptions = () => {
  const exchanges = new Set()


  bots.value.forEach(bot => {
    if (bot.exchange_name) {
      exchanges.add(bot.exchange_name)
    }
  })

  // 如果没有找到交易所数据，使用临时的固定列表
  if (exchanges.size === 0) {
    console.log('未找到交易所数据，使用默认列表')
    exchangeOptions.value = ['Binance', 'Gate.io', 'OKX', 'Huobi']
  } else {
    exchangeOptions.value = Array.from(exchanges).sort()
  }
  console.log('交易所选项:', exchangeOptions.value)
}

const updateStatistics = () => {
  statistics.value = {
    total_bots: bots.value.length,
    running_bots: bots.value.filter(bot => bot.status === 'running').length,
    paused_bots: bots.value.filter(bot => bot.status === 'paused').length,
    total_profit: bots.value.reduce((sum, bot) => sum + (bot.total_profit || 0), 0),
    total_trades: bots.value.reduce((sum, bot) => sum + (bot.total_trades || 0), 0),
    win_rate: bots.value.length > 0
      ? Math.round(bots.value.reduce((sum, bot) => sum + (bot.win_rate || 0), 0) / bots.value.length)
      : 0
  }
}

const resetFilters = () => {
  filters.value = { status: '', bot_type: '', exchange: '', search: '' }
}

const handleStartBot = async (botId) => {
  try {
    loadingBotId.value = botId
    await botAPI.startBot(botId)
    showSuccess('机器人已启动')

    // 只更新特定机器人的状态，而不是重新加载整个列表
    const botIndex = bots.value.findIndex(bot => bot.id === botId)
    if (botIndex !== -1) {
      bots.value[botIndex].status = 'running'
      bots.value[botIndex].is_active = true
    }
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

    // 只更新特定机器人的状态，而不是重新加载整个列表
    const botIndex = bots.value.findIndex(bot => bot.id === botId)
    if (botIndex !== -1) {
      bots.value[botIndex].status = 'stopped'
      bots.value[botIndex].is_active = false
    }
  } catch (error) {
    showError(error.message || '停止失败')
  } finally {
    loadingBotId.value = null
  }
}

const handleEditBot = (botId) => {
  router.push(`/bots/edit/${botId}`)
}

const handleViewBot = (botId) => {
  router.push(`/bots/${botId}`)
}

const handleDeleteBot = async (botId) => {
  if (!confirm('确定要删除这个机器人吗？此操作不可撤销。')) {
    return
  }

  try {
    loadingBotId.value = botId
    await botAPI.deleteBot(botId)
    showSuccess('机器人已删除')

    // 从列表中移除已删除的机器人
    const botIndex = bots.value.findIndex(bot => bot.id === botId)
    if (botIndex !== -1) {
      bots.value.splice(botIndex, 1)
    }
  } catch (error) {
    console.error('删除机器人失败:', error)
    showError(error.response?.data?.message || '删除机器人失败')
  } finally {
    loadingBotId.value = null
  }
}

// 分享弹窗状态
const showShareModal = ref(false)
const selectedBot = ref(null)

const handleShareBot = (bot) => {
  selectedBot.value = bot
  showShareModal.value = true
}

const handleConfirmShare = async (visibility) => {
  if (!selectedBot.value) return

  try {
    loadingBotId.value = selectedBot.value.id
    const response = await botAPI.updateBot(selectedBot.value.id, { visibility })

    // 更新本地数据
    const botIndex = bots.value.findIndex(b => b.id === selectedBot.value.id)
    if (botIndex !== -1) {
      bots.value[botIndex].visibility = visibility
      bots.value[botIndex].share_code = response.data.share_code
    }

    if (visibility === 'public') {
      const shareUrl = `${window.location.origin}/strategies?share_code=${response.data.share_code}`

      // 复制到剪贴板
      try {
        await navigator.clipboard.writeText(shareUrl)
        showSuccess(`已设置为公开！分享链接已复制到剪贴板`)
      } catch (err) {
        showSuccess(`已设置为公开！分享链接：${shareUrl}`)
      }
    } else if (visibility === 'followers_only') {
      showSuccess('已设置为仅关注者可见')
    }

    // 关闭弹窗
    showShareModal.value = false
    selectedBot.value = null
  } catch (error) {
    console.error('更新分享设置失败:', error)
    showError(error.response?.data?.message || '更新分享设置失败')
  } finally {
    loadingBotId.value = null
  }
}

const handleCancelShare = () => {
  showShareModal.value = false
  selectedBot.value = null
}

const handleCreateBot = () => {
  router.push(pageConfig.value.createPath)
}

const getStatusLabel = (status) => {
  const map = { running: '运行中', paused: '已暂停', stopped: '已停止', draft: '草稿' }
  return map[status] || status
}

// 获取机器人类型标签
const getBotTypeLabel = (botType) => {
  const labels = {
    'trend_following': '趋势跟踪',
    'grid_trading': '网格交易',
    'dca': 'DCA定投',
    'martingale': '马丁格尔'
  }
  return labels[botType] || botType
}

// 获取信号类型标签
const getSignalTypeLabel = (signalType) => {
  const labels = {
    'price_alert': '价格提醒',
    'rsi': 'RSI指标',
    'ma_crossover': 'MA交叉',
    'bollinger': '布林带',
    'volume': '成交量',
    'macd': 'MACD',
    'kdj': 'KDJ',
    'custom': '自定义'
  }
  return labels[signalType] || signalType || '未知'
}

const formatCurrency = (value) => {
  if (!value) return '$0.00'
  return '$' + parseFloat(value).toFixed(2)
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}



// 监听路由变化，重新加载数据
watch(() => route.query.type, async () => {
  await loadBots()
})

onMounted(async () => {
  await loadBots()
})
</script>



