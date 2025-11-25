<template>
  <div class="space-y-6">
    <!-- 性能概览卡片 - 统一为白色商务风格 -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <!-- 总收益卡片 -->
      <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between mb-3">
          <div>
            <p class="text-sm font-medium text-slate-600">总收益</p>
            <p class="text-xs text-slate-500 mt-0.5">Total Profit</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
            <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <p class="text-2xl font-bold text-slate-900">${{ statistics.total_profit.toFixed(2) }}</p>
        <p class="text-sm text-green-600 font-medium mt-1">+{{ statistics.profit_rate.toFixed(2) }}%</p>
      </div>

      <!-- 胜率卡片 -->
      <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between mb-3">
          <div>
            <p class="text-sm font-medium text-slate-600">胜率</p>
            <p class="text-xs text-slate-500 mt-0.5">Win Rate</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
            <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <p class="text-2xl font-bold text-slate-900">{{ statistics.win_rate.toFixed(1) }}%</p>
        <p class="text-sm text-slate-600 mt-1">{{ statistics.winning_trades }}/{{ statistics.total_trades }} 笔</p>
      </div>

      <!-- 平均收益卡片 -->
      <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between mb-3">
          <div>
            <p class="text-sm font-medium text-slate-600">平均收益</p>
            <p class="text-xs text-slate-500 mt-0.5">Avg Profit</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
            <svg class="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>
        <p class="text-2xl font-bold text-slate-900">${{ statistics.avg_profit.toFixed(2) }}</p>
        <p class="text-sm text-slate-600 mt-1">每笔交易</p>
      </div>

      <!-- 最大回撤卡片 -->
      <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between mb-3">
          <div>
            <p class="text-sm font-medium text-slate-600">最大回撤</p>
            <p class="text-xs text-slate-500 mt-0.5">Max Drawdown</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
            <svg class="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            </svg>
          </div>
        </div>
        <p class="text-2xl font-bold text-slate-900">{{ statistics.max_drawdown.toFixed(2) }}%</p>
        <p class="text-sm text-slate-600 mt-1">风险指标</p>
      </div>
    </div>

    <!-- 筛选器 - 统一为 Listbox 样式 -->
    <div class="bg-white rounded-xl p-6 border border-slate-200">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <!-- 时间范围筛选 -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-slate-700">时间范围</label>
          <Listbox v-model="filters.timeRange" @update:modelValue="loadPerformance">
            <div class="relative">
              <ListboxButton class="relative w-full cursor-default rounded-xl bg-slate-50 py-3 pl-4 pr-10 text-left border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <span class="block truncate text-slate-700">
                  {{ timeRangeOptions.find(option => option.value === filters.timeRange)?.label || '选择时间范围' }}
                </span>
                <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <ChevronUpDownIcon class="h-5 w-5 text-slate-400" aria-hidden="true" />
                </span>
              </ListboxButton>
              <transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
                <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  <ListboxOption
                    v-for="option in timeRangeOptions"
                    :key="option.value"
                    :value="option.value"
                    v-slot="{ active, selected }"
                    as="template"
                  >
                    <li :class="[active ? 'bg-blue-50 text-blue-900' : 'text-slate-900', 'relative cursor-default select-none py-2 pl-10 pr-4']">
                      <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">{{ option.label }}</span>
                      <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                        <CheckIcon class="h-5 w-5" aria-hidden="true" />
                      </span>
                    </li>
                  </ListboxOption>
                </ListboxOptions>
              </transition>
            </div>
          </Listbox>
        </div>

        <!-- 机器人类型筛选 -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-slate-700">机器人类型</label>
          <Listbox v-model="filters.bot_type" @update:modelValue="loadPerformance">
            <div class="relative">
              <ListboxButton class="relative w-full cursor-default rounded-xl bg-slate-50 py-3 pl-4 pr-10 text-left border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <span class="block truncate text-slate-700">
                  {{ botTypeOptions.find(option => option.value === filters.bot_type)?.label || '全部类型' }}
                </span>
                <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <ChevronUpDownIcon class="h-5 w-5 text-slate-400" aria-hidden="true" />
                </span>
              </ListboxButton>
              <transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
                <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  <ListboxOption
                    v-for="option in botTypeOptions"
                    :key="option.value"
                    :value="option.value"
                    v-slot="{ active, selected }"
                    as="template"
                  >
                    <li :class="[active ? 'bg-blue-50 text-blue-900' : 'text-slate-900', 'relative cursor-default select-none py-2 pl-10 pr-4']">
                      <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">{{ option.label }}</span>
                      <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                        <CheckIcon class="h-5 w-5" aria-hidden="true" />
                      </span>
                    </li>
                  </ListboxOption>
                </ListboxOptions>
              </transition>
            </div>
          </Listbox>
        </div>

        <!-- 机器人筛选 -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-slate-700">机器人</label>
          <Listbox v-model="filters.bot_id" @update:modelValue="loadPerformance">
            <div class="relative">
              <ListboxButton class="relative w-full cursor-default rounded-xl bg-slate-50 py-3 pl-4 pr-10 text-left border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <span class="block truncate text-slate-700">
                  {{ bots.find(bot => bot.id === filters.bot_id)?.name || '全部机器人' }}
                </span>
                <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <ChevronUpDownIcon class="h-5 w-5 text-slate-400" aria-hidden="true" />
                </span>
              </ListboxButton>
              <transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
                <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  <ListboxOption
                    :value="''"
                    v-slot="{ active, selected }"
                    as="template"
                  >
                    <li :class="[active ? 'bg-blue-50 text-blue-900' : 'text-slate-900', 'relative cursor-default select-none py-2 pl-10 pr-4']">
                      <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">全部机器人</span>
                      <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                        <CheckIcon class="h-5 w-5" aria-hidden="true" />
                      </span>
                    </li>
                  </ListboxOption>
                  <ListboxOption
                    v-for="bot in bots"
                    :key="bot.id"
                    :value="bot.id"
                    v-slot="{ active, selected }"
                    as="template"
                  >
                    <li :class="[active ? 'bg-blue-50 text-blue-900' : 'text-slate-900', 'relative cursor-default select-none py-2 pl-10 pr-4']">
                      <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">{{ bot.name }}</span>
                      <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                        <CheckIcon class="h-5 w-5" aria-hidden="true" />
                      </span>
                    </li>
                  </ListboxOption>
                </ListboxOptions>
              </transition>
            </div>
          </Listbox>
        </div>

        <!-- 刷新按钮 -->
        <div class="flex items-end">
          <button
            @click="loadPerformance"
            :disabled="loading"
            class="w-full px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            <span v-if="loading">加载中...</span>
            <span v-else>刷新数据</span>
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
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'
import { botAPI } from '../../../utils/api'
import { showError } from '../../../utils/notification'

const loading = ref(false)
const bots = ref([])

const filters = ref({
  timeRange: '30d',
  bot_type: '',
  bot_id: ''
})

// 时间范围选项
const timeRangeOptions = [
  { label: '最近7天', value: '7d' },
  { label: '最近30天', value: '30d' },
  { label: '最近90天', value: '90d' },
  { label: '最近1年', value: '1y' },
  { label: '全部', value: 'all' }
]

// 机器人类型选项
const botTypeOptions = [
  { label: '全部类型', value: '' },
  { label: '信号机器人', value: 'signal' },
  { label: '趋势跟踪', value: 'trend_following' }
]

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

