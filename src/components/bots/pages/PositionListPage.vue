<template>
  <div class="min-h-screen bg-slate-50">
    <Header />
    <div class="max-w-7xl mx-auto pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div class="flex gap-8 relative">
        <div class="w-64 flex-shrink-0">
          <UserSidebar activeItem="positions" />
        </div>
        <main class="flex-1 min-w-0">
          <!-- 页面头部 -->
          <div class="mb-8">
            <div class="flex items-start justify-between mb-6">
              <div>
                <h1 class="text-3xl font-bold text-slate-900">持仓管理</h1>
                <p class="text-slate-600 mt-1">查看和管理所有交易持仓</p>
              </div>
              <Button 
                variant="secondary" 
                @click="loadPositions"
                :loading="loading"
                class="flex items-center gap-2"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                刷新
              </Button>
            </div>

            <!-- 筛选器 -->
            <div class="bg-white rounded-xl p-6 border border-slate-200 mb-6">
              <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <!-- 状态筛选 -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-slate-700">状态</label>
                  <Listbox v-model="filters.status" @update:modelValue="loadPositions">
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
                  <Listbox v-model="filters.side" @update:modelValue="loadPositions">
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

                <!-- 市场类型筛选 -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-slate-700">市场类型</label>
                  <Listbox v-model="filters.market_type" @update:modelValue="loadPositions">
                    <div class="relative">
                      <ListboxButton class="relative w-full cursor-default rounded-xl bg-slate-50 py-3 pl-4 pr-10 text-left border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <span class="block truncate text-slate-700">
                          {{ marketTypeOptions.find(option => option.value === filters.market_type)?.label || '全部类型' }}
                        </span>
                        <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          <ChevronUpDownIcon class="h-5 w-5 text-slate-400" aria-hidden="true" />
                        </span>
                      </ListboxButton>
                      <transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
                        <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <ListboxOption
                            v-slot="{ active, selected }"
                            v-for="option in marketTypeOptions"
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
                  <Listbox v-model="filters.bot_id" @update:modelValue="loadPositions">
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
              </div>
            </div>
          </div>

          <!-- 加载状态 -->
          <div v-if="loading" class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>

          <!-- 空状态 -->
          <div v-else-if="positions.length === 0" class="bg-white rounded-xl p-12 text-center border border-slate-200">
            <svg class="mx-auto h-16 w-16 text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 class="text-lg font-medium text-slate-900 mb-2">暂无持仓</h3>
            <p class="text-slate-600">当机器人执行交易后，持仓信息会在这里显示</p>
          </div>

          <!-- 持仓列表 -->
          <div v-else class="space-y-4">
            <div
              v-for="position in positions"
              :key="position.id"
              class="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-shadow"
            >
              <div class="flex items-start justify-between mb-4">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-3">
                    <!-- Token Logo -->
                    <div class="flex items-center -space-x-2">
                      <img
                        :src="getTokenLogo(position.token_symbol)"
                        :alt="position.token_symbol"
                        class="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                        @error="handleImageError"
                      />
                      <img
                        src="https://cryptologos.cc/logos/tether-usdt-logo.png"
                        alt="USDT"
                        class="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                        @error="handleImageError"
                      />
                    </div>

                    <div>
                      <h3 class="text-lg font-semibold text-slate-900">
                        {{ position.bot_name }}
                      </h3>
                      <p class="text-sm text-slate-600">
                        {{ position.token_symbol }}/{{ position.trading_pair || 'USDT' }}
                      </p>
                    </div>
                  </div>

                  <div class="flex items-center gap-2">
                    <Tag :severity="getSideSeverity(position.side)">
                      {{ position.side_display }}
                    </Tag>
                    <Tag :severity="getStatusSeverity(position.status)">
                      {{ position.status_display }}
                    </Tag>
                    <Tag severity="info">
                      {{ position.market_type_display }}
                    </Tag>
                    <!-- 合约显示杠杆倍率 -->
                    <Tag v-if="position.market_type !== 'spot'" severity="warning">
                      {{ position.leverage || 1 }}x
                    </Tag>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-sm text-slate-500 mb-1">未实现盈亏</div>
                  <div class="text-2xl font-bold" :class="parseFloat(position.unrealized_profit || 0) >= 0 ? 'text-green-600' : 'text-red-600'">
                    {{ parseFloat(position.unrealized_profit || 0) >= 0 ? '+' : '' }}${{ Number(position.unrealized_profit || 0).toFixed(2) }}
                  </div>
                  <div class="text-sm" :class="parseFloat(position.unrealized_profit_percentage || 0) >= 0 ? 'text-green-600' : 'text-red-600'">
                    {{ parseFloat(position.unrealized_profit_percentage || 0) >= 0 ? '+' : '' }}{{ Number(position.unrealized_profit_percentage || 0).toFixed(2) }}%
                  </div>
                </div>
              </div>

              <!-- 持仓信息 -->
              <div class="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4 p-4 bg-slate-50 rounded-lg">
                <div>
                  <div class="text-xs text-slate-500 mb-1">入场价</div>
                  <div class="text-sm font-semibold text-slate-900">${{ Number(position.entry_price).toFixed(2) }}</div>
                </div>
                <div>
                  <div class="text-xs text-slate-500 mb-1">当前价</div>
                  <div class="text-sm font-semibold text-slate-900">${{ Number(position.current_price || position.entry_price).toFixed(2) }}</div>
                </div>
                <div>
                  <div class="text-xs text-slate-500 mb-1">持仓数量</div>
                  <div class="text-sm font-semibold text-slate-900">
                    {{ Number(position.quantity).toFixed(position.market_type === 'spot' ? 4 : 0) }} {{ position.quantity_unit }}
                  </div>
                </div>
                <div>
                  <div class="text-xs text-slate-500 mb-1">持仓价值</div>
                  <div class="text-sm font-semibold text-slate-900">${{ Number(position.position_value || 0).toFixed(2) }}</div>
                </div>
                <div v-if="position.market_type !== 'spot'">
                  <div class="text-xs text-slate-500 mb-1">合约倍率</div>
                  <div class="text-sm font-semibold text-orange-600">{{ position.leverage || 1 }}x</div>
                </div>
                <div v-else>
                  <div class="text-xs text-slate-500 mb-1">已实现盈亏</div>
                  <div class="text-sm font-semibold" :class="parseFloat(position.realized_profit || 0) >= 0 ? 'text-green-600' : 'text-red-600'">
                    {{ parseFloat(position.realized_profit || 0) >= 0 ? '+' : '' }}${{ Number(position.realized_profit || 0).toFixed(2) }}
                  </div>
                </div>
                <div v-if="position.market_type !== 'spot'">
                  <div class="text-xs text-slate-500 mb-1">合约大小</div>
                  <div class="text-sm font-semibold text-slate-900">{{ position.contract_size }} {{ position.token_symbol }}</div>
                </div>
                <div v-else>
                  <div class="text-xs text-slate-500 mb-1">初始数量</div>
                  <div class="text-sm font-semibold text-slate-900">{{ Number(position.initial_quantity).toFixed(4) }} {{ position.quantity_unit }}</div>
                </div>
              </div>

              <!-- 追踪止损信息 -->
              <div v-if="position.trailing_stop_activated" class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div class="flex items-center gap-2 text-sm text-blue-800">
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span class="font-medium">追踪止损已激活</span>
                  <span class="ml-auto">止损价: ${{ position.trailing_stop_price }}</span>
                </div>
              </div>

              <!-- 盈亏平衡信息 -->
              <div v-if="position.breakeven_activated" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div class="flex items-center gap-2 text-sm text-green-800">
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span class="font-medium">盈亏平衡已激活</span>
                </div>
              </div>

              <!-- 时间信息 -->
              <div class="flex items-center justify-between text-sm text-slate-500 mb-4">
                <div>开仓时间: {{ formatDate(position.opened_at) }}</div>
                <div v-if="position.closed_at">平仓时间: {{ formatDate(position.closed_at) }}</div>
              </div>

              <!-- 操作按钮 -->
              <div v-if="position.status === 'open'" class="flex gap-3">
                <Button
                  variant="danger"
                  @click="handleClose(position)"
                  :loading="actionLoading === position.id"
                  class="flex-1"
                >
                  手动平仓
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'
import Header from '../../common/Header.vue'
import UserSidebar from '../../common/UserSidebar.vue'
import Button from '../../common/ui/Button.vue'
import Tag from 'primevue/tag'
import { botAPI } from '../../../utils/api'
import { showSuccess, showError } from '../../../utils/notification'
import { showConfirm } from '../../../utils/confirm'
import { handleImageError, DEFAULT_TOKEN_LOGO } from '../../../utils/tokenUtils.js'

const router = useRouter()

// 状态
const loading = ref(false)
const actionLoading = ref(null)
const positions = ref([])
const bots = ref([])
const filters = ref({
  status: 'open',  // 默认只显示未平仓
  side: '',
  market_type: '',  // 新增：市场类型筛选
  bot_id: ''
})

// 筛选选项
const statusOptions = [
  { label: '全部状态', value: '' },
  { label: '持仓中', value: 'open' },
  { label: '已平仓', value: 'closed' }
]

const sideOptions = [
  { label: '全部方向', value: '' },
  { label: '做多', value: 'long' },
  { label: '做空', value: 'short' }
]

const marketTypeOptions = [
  { label: '全部类型', value: '' },
  { label: '现货', value: 'spot' },
  { label: 'USDT合约', value: 'linear' },
  { label: '币本位合约', value: 'inverse' }
]

// 加载持仓列表
const loadPositions = async () => {
  try {
    loading.value = true
    const params = {}
    if (filters.value.status) params.status = filters.value.status
    if (filters.value.side) params.side = filters.value.side
    if (filters.value.market_type) params.market_type = filters.value.market_type
    if (filters.value.bot_id) params.bot_id = filters.value.bot_id

    const response = await botAPI.getPositionList(params)
    positions.value = response.data || response.results || []
  } catch (error) {
    console.error('加载持仓列表失败:', error)
    showError('加载持仓列表失败')
  } finally {
    loading.value = false
  }
}

// 加载机器人列表
const loadBots = async () => {
  try {
    const response = await botAPI.getBotList({ bot_type: 'trend_following' })
    bots.value = response.data || response.results || []
  } catch (error) {
    console.error('加载机器人列表失败:', error)
  }
}

// 手动平仓
const handleClose = async (position) => {
  // 使用通用确认对话框
  const confirmed = await showConfirm({
    type: 'warning',
    title: '确认平仓',
    message: `确定要平仓 ${position.bot_name} 的持仓吗？`,
    confirmText: '确认',
    cancelText: '取消'
  })

  if (!confirmed) return

  try {
    actionLoading.value = position.id
    await botAPI.closePosition(position.id)
    showSuccess('平仓成功')
    await loadPositions()
  } catch (error) {
    console.error('平仓失败:', error)
    showError(error.message || '平仓失败')
  } finally {
    actionLoading.value = null
  }
}

// 辅助函数
const getSideSeverity = (side) => {
  return side === 'long' ? 'success' : 'danger'
}

const getStatusSeverity = (status) => {
  const map = {
    open: 'success',
    closed: 'secondary'
  }
  return map[status] || 'info'
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 获取代币 logo
const getTokenLogo = (symbol) => {
  if (!symbol) return DEFAULT_TOKEN_LOGO

  // CryptoLogos CDN
  const symbolLower = symbol.toLowerCase()
  return `https://cryptologos.cc/logos/${symbolLower}-${symbolLower}-logo.png`
}

onMounted(() => {
  loadPositions()
  loadBots()
})
</script>

