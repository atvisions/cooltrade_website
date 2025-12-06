<template>
  <div>
    <!-- 加载状态 -->
    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
    </div>

    <!-- 空状态 -->
    <div v-else-if="!positions || positions.length === 0" class="text-center py-12">
      <svg class="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
      </svg>
      <p class="text-sm text-gray-500">暂无持仓</p>
    </div>

    <!-- 持仓列表 -->
    <div v-else class="space-y-3">
      <div v-for="position in openPositions" :key="position.id"
        class="bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-200 transition-colors">
        <!-- 头部：方向 + 代币 + 平仓按钮 -->
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <img v-if="position.token_logo" :src="position.token_logo" class="w-8 h-8 rounded-full" :alt="position.token_symbol" />
            <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600" v-else>
              {{ (position.token_symbol || '?').slice(0, 2) }}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="text-sm font-semibold text-gray-900">{{ position.token_symbol || position.token_symbol_snapshot }}</span>
                <span :class="['px-2 py-0.5 rounded text-xs font-semibold',
                  position.side === 'long' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700']">
                  {{ position.side_display || (position.side === 'long' ? '做多' : '做空') }}
                </span>
                <span v-if="position.leverage && position.leverage > 1" class="px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 text-xs font-medium">
                  {{ position.leverage }}x
                </span>
              </div>
              <p class="text-xs text-gray-500">{{ position.market_type_display || getMarketTypeLabel(position.market_type) }}</p>
            </div>
          </div>
          <button @click="$emit('close', position.id)"
            class="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
            平仓
          </button>
        </div>

        <!-- 核心数据：2行4列 -->
        <div class="grid grid-cols-4 gap-4 text-sm mb-3">
          <div>
            <p class="text-gray-500 text-xs mb-0.5">开仓价</p>
            <p class="font-medium text-gray-900 font-mono">{{ formatPrice(position.entry_price) }}</p>
          </div>
          <div>
            <p class="text-gray-500 text-xs mb-0.5">当前价</p>
            <p class="font-medium text-gray-900 font-mono">{{ formatPrice(position.current_price) }}</p>
          </div>
          <div>
            <p class="text-gray-500 text-xs mb-0.5">持仓量</p>
            <p class="font-medium text-gray-900">{{ formatQuantity(position.quantity) }} <span class="text-gray-400 text-xs">{{ position.quantity_unit || '' }}</span></p>
          </div>
          <div>
            <p class="text-gray-500 text-xs mb-0.5">持仓价值</p>
            <p class="font-medium text-gray-900">${{ formatValue(position.position_value) }}</p>
          </div>
        </div>

        <!-- 盈亏信息 -->
        <div class="grid grid-cols-4 gap-4 text-sm">
          <div class="col-span-2">
            <p class="text-gray-500 text-xs mb-0.5">未实现盈亏</p>
            <p :class="['font-semibold text-lg', getUnrealizedProfit(position) >= 0 ? 'text-emerald-600' : 'text-red-600']">
              {{ getUnrealizedProfit(position) >= 0 ? '+' : '' }}{{ formatCurrency(getUnrealizedProfit(position)) }}
              <span class="text-sm font-normal">({{ position.unrealized_profit_percentage || '0.00' }}%)</span>
            </p>
          </div>
          <div>
            <p class="text-gray-500 text-xs mb-0.5">开仓时间</p>
            <p class="font-medium text-gray-700 text-xs">{{ formatDateTime(position.opened_at) }}</p>
          </div>
          <div>
            <p class="text-gray-500 text-xs mb-0.5">持仓时长</p>
            <p class="font-medium text-gray-700 text-xs">{{ formatDuration(position.opened_at) }}</p>
          </div>
        </div>

        <!-- 止盈止损信息 -->
        <div v-if="position.stop_loss_price || position.take_profit_price" class="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-4 text-xs">
          <span v-if="position.stop_loss_price" class="flex items-center gap-1">
            <span class="w-2 h-2 rounded-full bg-red-500"></span>
            <span class="text-gray-500">止损:</span>
            <span class="text-red-600 font-medium">{{ formatPrice(position.stop_loss_price) }}</span>
          </span>
          <span v-if="position.take_profit_price" class="flex items-center gap-1">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span class="text-gray-500">止盈:</span>
            <span class="text-emerald-600 font-medium">{{ formatPrice(position.take_profit_price) }}</span>
          </span>
          <span v-if="position.trailing_stop_activated" class="flex items-center gap-1">
            <span class="w-2 h-2 rounded-full bg-amber-500"></span>
            <span class="text-amber-600 font-medium">追踪止损已激活</span>
          </span>
        </div>
      </div>

      <!-- 已平仓历史 -->
      <div v-if="closedPositions.length > 0" class="mt-6">
        <h4 class="text-sm font-medium text-gray-600 mb-3">已平仓记录</h4>
        <div class="space-y-2">
          <div v-for="position in closedPositions.slice(0, 5)" :key="position.id"
            class="flex items-center justify-between py-2 border-b border-gray-100 last:border-0 text-sm">
            <div class="flex items-center gap-2">
              <span :class="['w-6 text-center text-xs font-semibold', position.side === 'long' ? 'text-emerald-600' : 'text-red-600']">
                {{ position.side === 'long' ? '多' : '空' }}
              </span>
              <span class="text-gray-900">{{ position.token_symbol_snapshot || position.symbol }}</span>
            </div>
            <div class="flex items-center gap-4">
              <span :class="['font-medium', getRealizedProfit(position) >= 0 ? 'text-emerald-600' : 'text-red-600']">
                {{ getRealizedProfit(position) >= 0 ? '+' : '' }}{{ formatCurrency(getRealizedProfit(position)) }}
              </span>
              <span class="text-gray-400 text-xs">{{ formatDate(position.closed_at) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  positions: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false }
})

defineEmits(['close'])

const openPositions = computed(() => props.positions.filter(p => p.status === 'open'))
const closedPositions = computed(() => props.positions.filter(p => p.status !== 'open'))

// 获取未实现盈亏（兼容不同字段名）
const getUnrealizedProfit = (position) => {
  return position.unrealized_profit || position.unrealized_pnl || 0
}

// 获取已实现盈亏（兼容不同字段名）
const getRealizedProfit = (position) => {
  return position.realized_profit || position.realized_pnl || 0
}

// 获取市场类型标签
const getMarketTypeLabel = (type) => {
  const map = { spot: '现货', linear: 'USDT永续', inverse: '币本位永续' }
  return map[type] || type || ''
}

const formatPrice = (price) => {
  if (!price && price !== 0) return '--'
  const num = Number(price)
  if (num >= 1000) return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  if (num >= 1) return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })
  return num.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 8 })
}

const formatQuantity = (qty) => {
  if (!qty && qty !== 0) return '0'
  const num = Number(qty)
  if (num >= 1000) return num.toLocaleString('en-US', { maximumFractionDigits: 2 })
  return num.toString()
}

const formatValue = (value) => {
  if (!value && value !== 0) return '0.00'
  return Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const formatCurrency = (value) => {
  if (!value && value !== 0) return '$0.00'
  return `$${Number(value).toFixed(2)}`
}

const formatDateTime = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

const formatDuration = (startDate) => {
  if (!startDate) return '-'
  const start = new Date(startDate)
  const now = new Date()
  const diffMs = now - start
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
  if (diffHours >= 24) {
    const days = Math.floor(diffHours / 24)
    const hours = diffHours % 24
    return `${days}天${hours}小时`
  }
  return `${diffHours}小时${diffMins}分`
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}
</script>

