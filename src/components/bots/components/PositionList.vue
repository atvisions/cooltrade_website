<template>
  <div class="space-y-6">
    <!-- 筛选器 -->
    <div class="bg-white rounded-xl p-6 border border-slate-200">
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
        class="bg-white rounded-xl border border-slate-200 hover:shadow-lg transition-shadow overflow-hidden"
      >
        <!-- 卡片头部 - 带 title -->
        <div class="bg-slate-50 px-6 py-4 border-b border-slate-200">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <!-- Token Logo -->
              <div class="flex items-center -space-x-2">
                <img
                  v-if="position.token_logo"
                  :src="position.token_logo"
                  :alt="position.token_symbol"
                  class="w-10 h-10 rounded-full border-2 border-white shadow-sm object-contain"
                  @error="handleImageError"
                />
                <div v-else class="w-10 h-10 rounded-full border-2 border-white shadow-sm bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  {{ position.token_symbol ? position.token_symbol.charAt(0) : '?' }}
                </div>
                <img
                  :src="USDT_LOGO"
                  alt="USDT"
                  class="w-10 h-10 rounded-full border-2 border-white shadow-sm object-contain"
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

            <!-- 盈亏显示 -->
            <div class="text-right">
              <div class="text-sm text-slate-500 mb-1">盈亏</div>
              <div
                class="text-2xl font-bold"
                :class="parseFloat(position.unrealized_profit || 0) >= 0 ? 'text-green-600' : 'text-red-600'"
              >
                {{ parseFloat(position.unrealized_profit || 0) >= 0 ? '+' : '' }}${{ Number(position.unrealized_profit || 0).toFixed(2) }}
              </div>
              <div
                class="text-sm"
                :class="parseFloat(position.unrealized_profit_percentage || 0) >= 0 ? 'text-green-600' : 'text-red-600'"
              >
                {{ parseFloat(position.unrealized_profit_percentage || 0) >= 0 ? '+' : '' }}{{ Number(position.unrealized_profit_percentage || 0).toFixed(2) }}%
              </div>
            </div>
          </div>
        </div>

        <!-- 卡片内容 -->
        <div class="p-6">
          <!-- 标签 -->
          <div class="flex items-center gap-2 mb-4">
            <span
              :class="[
                'px-2 py-1 text-xs font-medium rounded',
                position.side === 'long' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              ]"
            >
              {{ position.side === 'long' ? '做多' : '做空' }}
            </span>
            <span
              :class="[
                'px-2 py-1 text-xs font-medium rounded',
                position.status === 'open' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
              ]"
            >
              {{ position.status === 'open' ? '持仓中' : '已平仓' }}
            </span>
            <span class="px-2 py-1 text-xs font-medium rounded bg-purple-100 text-purple-700">
              {{ position.market_type_display || '现货' }}
            </span>
            <!-- 合约显示杠杆倍率 -->
            <span v-if="position.market_type !== 'spot'" class="px-2 py-1 text-xs font-medium rounded bg-orange-100 text-orange-700">
              {{ position.leverage || 1 }}x
            </span>
          </div>

          <!-- 持仓详情 -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <!-- 第一行：价格信息 -->
            <div>
              <div class="text-xs text-slate-500 mb-1">开仓均价</div>
              <div class="text-sm font-medium text-slate-900">${{ Number(position.entry_price || 0).toFixed(2) }}</div>
            </div>
            <div>
              <div class="text-xs text-slate-500 mb-1">标记价格</div>
              <div class="text-sm font-medium text-slate-900">${{ Number(position.current_price || 0).toFixed(2) }}</div>
            </div>
            <div>
              <div class="text-xs text-slate-500 mb-1">数量</div>
              <div class="text-sm font-medium text-slate-900">
                {{ Number(position.quantity || 0).toFixed(position.market_type === 'spot' ? 8 : 0) }} {{ position.quantity_unit || position.token_symbol }}
              </div>
            </div>
            <div v-if="position.market_type !== 'spot'">
              <div class="text-xs text-slate-500 mb-1">保证金</div>
              <div class="text-sm font-medium text-slate-900">${{ calculateMargin(position).toFixed(2) }}</div>
            </div>
            <div v-else>
              <div class="text-xs text-slate-500 mb-1">持仓价值</div>
              <div class="text-sm font-medium text-slate-900">${{ Number(position.position_value || 0).toFixed(2) }}</div>
            </div>
          </div>

          <!-- 第二行：合约信息（仅合约显示） -->
          <div v-if="position.market_type !== 'spot'" class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <div class="text-xs text-slate-500 mb-1">合约倍率</div>
              <div class="text-sm font-medium text-orange-600">{{ position.leverage || 1 }}x</div>
            </div>
            <div v-if="position.contract_size">
              <div class="text-xs text-slate-500 mb-1">合约大小</div>
              <div class="text-sm font-medium text-slate-900">{{ position.contract_size }} {{ position.token_symbol }}</div>
            </div>
            <div>
              <div class="text-xs text-slate-500 mb-1">持仓价值</div>
              <div class="text-sm font-medium text-slate-900">${{ Number(position.position_value || 0).toFixed(2) }}</div>
            </div>
            <div v-if="position.initial_quantity">
              <div class="text-xs text-slate-500 mb-1">初始数量</div>
              <div class="text-sm font-medium text-slate-900">{{ Number(position.initial_quantity).toFixed(0) }} 张</div>
            </div>
          </div>

          <!-- 第二行：盈亏信息 -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <div class="text-xs text-slate-500 mb-1">未实现盈亏</div>
              <div :class="[
                'text-sm font-medium',
                Number(position.unrealized_profit || 0) >= 0 ? 'text-green-600' : 'text-red-600'
              ]">
                {{ Number(position.unrealized_profit || 0) >= 0 ? '+' : '' }}${{ Number(position.unrealized_profit || 0).toFixed(2) }}
              </div>
            </div>
            <div>
              <div class="text-xs text-slate-500 mb-1">收益率</div>
              <div :class="[
                'text-sm font-medium',
                Number(position.unrealized_profit_percentage || 0) >= 0 ? 'text-green-600' : 'text-red-600'
              ]">
                {{ Number(position.unrealized_profit_percentage || 0) >= 0 ? '+' : '' }}{{ Number(position.unrealized_profit_percentage || 0).toFixed(2) }}%
              </div>
            </div>
            <div v-if="position.realized_profit && Number(position.realized_profit) !== 0">
              <div class="text-xs text-slate-500 mb-1">已实现盈亏</div>
              <div :class="[
                'text-sm font-medium',
                Number(position.realized_profit || 0) >= 0 ? 'text-green-600' : 'text-red-600'
              ]">
                {{ Number(position.realized_profit || 0) >= 0 ? '+' : '' }}${{ Number(position.realized_profit || 0).toFixed(2) }}
              </div>
            </div>
            <div>
              <div class="text-xs text-slate-500 mb-1">开仓时间</div>
              <div class="text-sm font-medium text-slate-900">{{ formatDate(position.opened_at) }}</div>
            </div>
          </div>

          <!-- 止盈止损信息 -->
          <div v-if="position.stop_loss_price || position.take_profit_price" class="grid grid-cols-2 gap-4 mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div v-if="position.stop_loss_price">
              <div class="flex items-center gap-2 mb-1">
                <svg class="h-4 w-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span class="text-xs text-slate-500">止损价格</span>
              </div>
              <div class="text-sm font-medium text-red-600">
                ${{ Number(position.stop_loss_price).toFixed(2) }}
                <span class="text-xs text-slate-500 ml-1">
                  ({{ calculateStopLossPercentage(position) }}%)
                </span>
              </div>
            </div>
            <div v-if="position.take_profit_price">
              <div class="flex items-center gap-2 mb-1">
                <svg class="h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-xs text-slate-500">止盈价格</span>
              </div>
              <div class="text-sm font-medium text-green-600">
                ${{ Number(position.take_profit_price).toFixed(2) }}
                <span class="text-xs text-slate-500 ml-1">
                  ({{ calculateTakeProfitPercentage(position) }}%)
                </span>
              </div>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div v-if="position.status === 'open'" class="flex justify-end">
            <!-- 合约交易：显示"平仓"按钮 -->
            <button
              v-if="position.market_type === 'linear' || position.market_type === 'inverse'"
              @click="closePosition(position.id)"
              :disabled="actionLoading === position.id"
              class="px-6 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {{ actionLoading === position.id ? '平仓中...' : '平仓' }}
            </button>

            <!-- 现货做多：显示"平仓"按钮 -->
            <button
              v-else-if="position.market_type === 'spot' && position.side === 'long'"
              @click="closePosition(position.id)"
              :disabled="actionLoading === position.id"
              class="px-6 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {{ actionLoading === position.id ? '平仓中...' : '平仓' }}
            </button>

            <!-- 现货做空：显示"平仓"按钮 -->
            <button
              v-else-if="position.market_type === 'spot' && position.side === 'short'"
              @click="closePosition(position.id)"
              :disabled="actionLoading === position.id"
              class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {{ actionLoading === position.id ? '平仓中...' : '平仓' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'
import { botAPI } from '../../../utils/api'
import { showSuccess, showError } from '../../../utils/notification'
import { handleImageError, USDT_LOGO } from '../../../utils/tokenUtils.js'
import { showConfirm } from '../../../utils/confirm'

const loading = ref(false)
const actionLoading = ref(null)
const positions = ref([])
const bots = ref([])
const filters = ref({
  status: '',
  side: '',
  market_type: '',
  bot_id: ''
})

// 自动刷新定时器
let refreshInterval = null

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
    console.error('加载持仓失败:', error)
    showError('加载持仓失败')
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

// 平仓
const closePosition = async (positionId) => {
  // 使用通用确认对话框
  const confirmed = await showConfirm({
    type: 'warning',
    title: '确认平仓',
    message: '确定要平仓吗？',
    confirmText: '确认',
    cancelText: '取消'
  })

  if (!confirmed) return

  try {
    actionLoading.value = positionId
    await botAPI.closePosition(positionId)
    showSuccess('平仓成功')
    await loadPositions()
  } catch (error) {
    console.error('平仓失败:', error)
    showError(error.message || '平仓失败')
  } finally {
    actionLoading.value = null
  }
}



// 计算保证金
const calculateMargin = (position) => {
  if (position.market_type === 'spot') {
    return Number(position.position_value || 0)
  }

  // 合约保证金 = 持仓价值 / 杠杆
  const positionValue = Number(position.position_value || 0)
  const leverage = Number(position.leverage || 1)

  return positionValue / leverage
}

// 计算止损百分比
const calculateStopLossPercentage = (position) => {
  if (!position.stop_loss_price || !position.entry_price) return '0.00'
  const entryPrice = Number(position.entry_price)
  const stopLossPrice = Number(position.stop_loss_price)

  let percentage = 0
  if (position.side === 'long') {
    percentage = ((stopLossPrice - entryPrice) / entryPrice) * 100
  } else {
    percentage = ((entryPrice - stopLossPrice) / entryPrice) * 100
  }

  return percentage.toFixed(2)
}

// 计算止盈百分比
const calculateTakeProfitPercentage = (position) => {
  if (!position.take_profit_price || !position.entry_price) return '0.00'
  const entryPrice = Number(position.entry_price)
  const takeProfitPrice = Number(position.take_profit_price)

  let percentage = 0
  if (position.side === 'long') {
    percentage = ((takeProfitPrice - entryPrice) / entryPrice) * 100
  } else {
    percentage = ((entryPrice - takeProfitPrice) / entryPrice) * 100
  }

  return percentage.toFixed(2)
}

// 格式化日期
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

// 启动自动刷新（每30秒刷新一次）
const startAutoRefresh = () => {
  refreshInterval = setInterval(() => {
    loadPositions()
  }, 30000) // 30秒
}

// 停止自动刷新
const stopAutoRefresh = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
    refreshInterval = null
  }
}

onMounted(() => {
  loadPositions()
  loadBots()
  startAutoRefresh()
})

onUnmounted(() => {
  stopAutoRefresh()
})
</script>

