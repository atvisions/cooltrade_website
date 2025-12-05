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
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-3">
            <span :class="['px-2 py-1 rounded text-xs font-semibold',
              position.side === 'long' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700']">
              {{ position.side === 'long' ? '多' : '空' }}
            </span>
            <span class="text-sm font-medium text-gray-900">{{ position.token_symbol_snapshot || position.symbol }}</span>
          </div>
          <button @click="$emit('close', position.id)"
            class="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
            平仓
          </button>
        </div>

        <div class="grid grid-cols-4 gap-4 text-sm">
          <div>
            <p class="text-gray-500 text-xs mb-0.5">开仓价</p>
            <p class="font-medium text-gray-900">{{ formatPrice(position.entry_price) }}</p>
          </div>
          <div>
            <p class="text-gray-500 text-xs mb-0.5">当前价</p>
            <p class="font-medium text-gray-900">{{ formatPrice(position.current_price || position.mark_price) }}</p>
          </div>
          <div>
            <p class="text-gray-500 text-xs mb-0.5">数量</p>
            <p class="font-medium text-gray-900">{{ position.quantity }}</p>
          </div>
          <div>
            <p class="text-gray-500 text-xs mb-0.5">盈亏</p>
            <p :class="['font-medium', (position.unrealized_pnl || 0) >= 0 ? 'text-emerald-600' : 'text-red-600']">
              {{ (position.unrealized_pnl || 0) >= 0 ? '+' : '' }}{{ formatCurrency(position.unrealized_pnl) }}
            </p>
          </div>
        </div>

        <!-- 止盈止损信息 -->
        <div v-if="position.stop_loss_price || position.take_profit_price" class="mt-3 pt-3 border-t border-gray-100 flex gap-4 text-xs">
          <span v-if="position.stop_loss_price" class="text-red-600">止损: {{ formatPrice(position.stop_loss_price) }}</span>
          <span v-if="position.take_profit_price" class="text-emerald-600">止盈: {{ formatPrice(position.take_profit_price) }}</span>
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
              <span :class="['font-medium', (position.realized_pnl || 0) >= 0 ? 'text-emerald-600' : 'text-red-600']">
                {{ (position.realized_pnl || 0) >= 0 ? '+' : '' }}{{ formatCurrency(position.realized_pnl) }}
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

const formatPrice = (price) => {
  if (!price && price !== 0) return '--'
  const num = Number(price)
  if (num >= 1000) return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  if (num >= 1) return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })
  return num.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 8 })
}

const formatCurrency = (value) => {
  if (!value && value !== 0) return '$0.00'
  return `$${Number(value).toFixed(2)}`
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}
</script>

