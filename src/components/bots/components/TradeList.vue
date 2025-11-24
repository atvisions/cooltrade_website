<template>
  <div class="space-y-6">
    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm opacity-90">总交易数</span>
          <svg class="h-8 w-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <p class="text-3xl font-bold">{{ statistics.total_trades }}</p>
      </div>

      <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm opacity-90">已成交</span>
          <svg class="h-8 w-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-3xl font-bold">{{ statistics.filled_trades }}</p>
      </div>

      <div class="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm opacity-90">待执行</span>
          <svg class="h-8 w-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-3xl font-bold">{{ statistics.pending_trades }}</p>
      </div>

      <div class="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm opacity-90">失败/取消</span>
          <svg class="h-8 w-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-3xl font-bold">{{ statistics.failed_trades }}</p>
      </div>
    </div>

    <!-- 筛选器 -->
    <div class="bg-white rounded-xl p-6 border border-slate-200">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-6">
        <!-- 状态筛选 -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-slate-700">状态</label>
          <Listbox v-model="filters.status" @update:modelValue="loadTrades">
            <div class="relative">
              <ListboxButton class="relative w-full cursor-default rounded-xl bg-slate-50 py-3 pl-4 pr-10 text-left border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <span class="block truncate text-slate-700">
                  {{ statusOptions.find(option => option.value === filters.status)?.label || '全部状态' }}
                </span>
                <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <ChevronUpDownIcon class="h-5 w-5 text-slate-400" aria-hidden="true" />
                </span>
              </ListboxButton>
              <transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
                <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <ListboxOption
                    v-slot="{ active, selected }"
                    v-for="option in statusOptions"
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

        <!-- 方向筛选 -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-slate-700">方向</label>
          <Listbox v-model="filters.side" @update:modelValue="loadTrades">
            <div class="relative">
              <ListboxButton class="relative w-full cursor-default rounded-xl bg-slate-50 py-3 pl-4 pr-10 text-left border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <span class="block truncate text-slate-700">
                  {{ sideOptions.find(option => option.value === filters.side)?.label || '全部方向' }}
                </span>
                <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <ChevronUpDownIcon class="h-5 w-5 text-slate-400" aria-hidden="true" />
                </span>
              </ListboxButton>
              <transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
                <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <ListboxOption
                    v-slot="{ active, selected }"
                    v-for="option in sideOptions"
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

        <!-- 类型筛选 -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-slate-700">类型</label>
          <Listbox v-model="filters.trade_type" @update:modelValue="loadTrades">
            <div class="relative">
              <ListboxButton class="relative w-full cursor-default rounded-xl bg-slate-50 py-3 pl-4 pr-10 text-left border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <span class="block truncate text-slate-700">
                  {{ tradeTypeOptions.find(option => option.value === filters.trade_type)?.label || '全部类型' }}
                </span>
                <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <ChevronUpDownIcon class="h-5 w-5 text-slate-400" aria-hidden="true" />
                </span>
              </ListboxButton>
              <transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
                <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <ListboxOption
                    v-slot="{ active, selected }"
                    v-for="option in tradeTypeOptions"
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

        <!-- 机器人筛选 -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-slate-700">机器人</label>
          <Listbox v-model="filters.bot_id" @update:modelValue="loadTrades">
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
                <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <ListboxOption
                    v-slot="{ active, selected }"
                    :value="''"
                    as="template"
                  >
                    <li :class="[active ? 'bg-slate-100 text-slate-900' : 'text-slate-700', 'relative cursor-default select-none py-3 pl-4 pr-4']">
                      <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">全部机器人</span>
                      <span v-if="selected" class="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-600">
                        <CheckIcon class="h-5 w-5" aria-hidden="true" />
                      </span>
                    </li>
                  </ListboxOption>
                  <ListboxOption
                    v-slot="{ active, selected }"
                    v-for="bot in bots"
                    :key="bot.id"
                    :value="bot.id"
                    as="template"
                  >
                    <li :class="[active ? 'bg-slate-100 text-slate-900' : 'text-slate-700', 'relative cursor-default select-none py-3 pl-4 pr-4']">
                      <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">{{ bot.name }}</span>
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

        <!-- 刷新按钮 -->
        <div class="flex items-end">
          <button
            @click="loadTrades"
            :disabled="loading"
            class="w-full px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
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

    <!-- 空状态 -->
    <div v-else-if="trades.length === 0" class="bg-white rounded-xl p-12 text-center border border-slate-200">
      <svg class="mx-auto h-16 w-16 text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <h3 class="text-lg font-medium text-slate-900 mb-2">暂无交易记录</h3>
      <p class="text-slate-600">当机器人执行交易后，记录会在这里显示</p>
    </div>

    <!-- 交易列表 -->
    <div v-else class="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-slate-50 border-b border-slate-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">交易ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">机器人</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">交易对</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">方向/类型</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">价格</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">数量</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">总额</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">状态</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">时间</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr
              v-for="trade in trades"
              :key="trade.id"
              class="hover:bg-slate-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm font-mono text-slate-900">#{{ trade.id }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-slate-900">{{ trade.bot_name }}</div>
                <div class="text-xs text-slate-500">{{ trade.exchange }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <!-- Token Logo -->
                  <div class="flex items-center -space-x-1">
                    <img
                      v-if="trade.token_logo"
                      :src="trade.token_logo"
                      :alt="trade.token_symbol"
                      class="w-6 h-6 rounded-full border border-white shadow-sm"
                      @error="handleImageError"
                    />
                    <div
                      v-else
                      class="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold border border-white shadow-sm"
                    >
                      {{ trade.token_symbol?.charAt(0) || '?' }}
                    </div>
                    <img
                      src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png"
                      alt="USDT"
                      class="w-6 h-6 rounded-full border border-white shadow-sm"
                      @error="handleImageError"
                    />
                  </div>
                  <span class="text-sm font-medium text-slate-900">
                    {{ trade.token_symbol }}/{{ trade.trading_pair || 'USDT' }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex flex-col gap-1">
                  <span 
                    :class="[
                      'inline-flex items-center px-2 py-1 rounded text-xs font-medium w-fit',
                      trade.side === 'buy' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    ]"
                  >
                    {{ trade.side === 'buy' ? '买入' : '卖出' }}
                  </span>
                  <span class="text-xs text-slate-600">
                    {{ getTradeTypeLabel(trade.trade_type) }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm font-medium text-slate-900">${{ Number(trade.price).toFixed(2) }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-slate-900">
                  {{ Number(trade.quantity).toFixed(8) }}
                  <span class="text-xs text-slate-500 ml-1">
                    {{ trade.market_type === 'linear' ? '张' : trade.token_symbol }}
                  </span>
                </div>
                <div v-if="trade.filled_quantity && Number(trade.filled_quantity) > 0" class="text-xs text-slate-500">
                  已成交: {{ Number(trade.filled_quantity).toFixed(8) }}
                  {{ trade.market_type === 'linear' ? '张' : trade.token_symbol }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm font-medium text-slate-900">
                  ${{ Number(trade.total_value).toFixed(2) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  :class="[
                    'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                    getStatusClass(trade.status)
                  ]"
                >
                  {{ getStatusLabel(trade.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-slate-900">{{ formatDate(trade.created_at) }}</div>
                <div v-if="trade.executed_at" class="text-xs text-slate-500">
                  执行: {{ formatDate(trade.executed_at) }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 分页 -->
    <div v-if="totalPages > 1" class="flex justify-center items-center gap-2">
      <button
        @click="currentPage--"
        :disabled="currentPage === 1"
        class="px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        上一页
      </button>
      <span class="text-slate-600">
        第 {{ currentPage }} / {{ totalPages }} 页
      </span>
      <button
        @click="currentPage++"
        :disabled="currentPage === totalPages"
        class="px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        下一页
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'
import { botAPI } from '../../../utils/api'
import { showError } from '../../../utils/notification'

const loading = ref(false)
const trades = ref([])
const bots = ref([])
const currentPage = ref(1)
const pageSize = ref(20)
const totalPages = ref(1)

const filters = ref({
  status: '',
  side: '',
  trade_type: '',
  bot_id: ''
})

// 筛选选项
const statusOptions = [
  { label: '全部状态', value: '' },
  { label: '已成交', value: 'filled' },
  { label: '待执行', value: 'pending' },
  { label: '已提交', value: 'submitted' },
  { label: '部分成交', value: 'partially_filled' },
  { label: '已取消', value: 'cancelled' },
  { label: '失败', value: 'failed' }
]

const sideOptions = [
  { label: '全部方向', value: '' },
  { label: '买入', value: 'buy' },
  { label: '卖出', value: 'sell' }
]

const tradeTypeOptions = [
  { label: '全部类型', value: '' },
  { label: '开仓', value: 'open' },
  { label: '平仓', value: 'close' },
  { label: '加仓', value: 'add' },
  { label: '减仓', value: 'reduce' }
]

const statistics = computed(() => {
  return {
    total_trades: trades.value.length,
    filled_trades: trades.value.filter(t => t.status === 'filled').length,
    pending_trades: trades.value.filter(t => ['pending', 'submitted', 'partially_filled'].includes(t.status)).length,
    failed_trades: trades.value.filter(t => ['cancelled', 'failed'].includes(t.status)).length
  }
})

// 加载交易记录
const loadTrades = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      page_size: pageSize.value,
      ...filters.value
    }

    // 移除空值
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === null) {
        delete params[key]
      }
    })

    const response = await botAPI.getTradeList(params)

    trades.value = response.results || response.data || []
    totalPages.value = Math.ceil((response.count || 0) / pageSize.value)
  } catch (error) {
    console.error('加载交易记录失败:', error)
    showError('加载交易记录失败')
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

// 获取交易类型标签
const getTradeTypeLabel = (type) => {
  const map = {
    open: '开仓',
    close: '平仓',
    add: '加仓',
    reduce: '减仓'
  }
  return map[type] || type
}

// 获取状态标签
const getStatusLabel = (status) => {
  const map = {
    pending: '待执行',
    submitted: '已提交',
    filled: '已成交',
    partially_filled: '部分成交',
    cancelled: '已取消',
    failed: '失败'
  }
  return map[status] || status
}

// 获取状态样式
const getStatusClass = (status) => {
  const map = {
    pending: 'bg-yellow-100 text-yellow-700',
    submitted: 'bg-blue-100 text-blue-700',
    filled: 'bg-green-100 text-green-700',
    partially_filled: 'bg-orange-100 text-orange-700',
    cancelled: 'bg-gray-100 text-gray-700',
    failed: 'bg-red-100 text-red-700'
  }
  return map[status] || 'bg-gray-100 text-gray-700'
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 从交易对中提取代币符号（例如：BTC/USDT:USDT -> BTC）
const getSymbolFromPair = (symbol) => {
  if (!symbol) return ''
  // 处理 BTC/USDT:USDT 格式
  const parts = symbol.split('/')
  return parts[0] || symbol
}

// 获取代币 logo
const getTokenLogo = (symbol) => {
  if (!symbol) return 'https://via.placeholder.com/24'

  // CryptoLogos CDN
  const symbolLower = symbol.toLowerCase()
  return `https://cryptologos.cc/logos/${symbolLower}-${symbolLower}-logo.png`
}

// 图片加载失败处理
const handleImageError = (event) => {
  event.target.src = 'https://via.placeholder.com/24?text=' + (event.target.alt || '?')
}

// 监听分页变化
watch(currentPage, () => {
  loadTrades()
})

onMounted(() => {
  loadTrades()
  loadBots()
})
</script>

