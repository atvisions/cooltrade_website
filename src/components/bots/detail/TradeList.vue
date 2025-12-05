<template>
  <div>
    <!-- 加载状态 -->
    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
    </div>

    <!-- 空状态 -->
    <div v-else-if="!trades || trades.length === 0" class="text-center py-12">
      <svg class="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
      </svg>
      <p class="text-sm text-gray-500">暂无交易记录</p>
    </div>

    <!-- 交易列表 -->
    <div v-else class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">时间</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">类型</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">方向</th>
            <th class="px-4 py-3 text-right text-xs font-semibold text-gray-600">价格</th>
            <th class="px-4 py-3 text-right text-xs font-semibold text-gray-600">数量</th>
            <th class="px-4 py-3 text-right text-xs font-semibold text-gray-600">盈亏</th>
            <th class="px-4 py-3 text-center text-xs font-semibold text-gray-600">状态</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="trade in trades" :key="trade.id" class="hover:bg-gray-50">
            <td class="px-4 py-3 text-gray-900">{{ formatDate(trade.created_at) }}</td>
            <td class="px-4 py-3">
              <span :class="['px-2 py-0.5 rounded text-xs font-medium', getTradeTypeClass(trade.type)]">
                {{ getTradeTypeLabel(trade.type) }}
              </span>
            </td>
            <td class="px-4 py-3">
              <span :class="['font-medium', trade.side === 'buy' ? 'text-emerald-600' : 'text-red-600']">
                {{ trade.side === 'buy' ? '买入' : '卖出' }}
              </span>
            </td>
            <td class="px-4 py-3 text-right font-mono text-gray-900">{{ formatPrice(trade.price) }}</td>
            <td class="px-4 py-3 text-right font-mono text-gray-900">{{ trade.quantity }}</td>
            <td class="px-4 py-3 text-right">
              <span v-if="trade.profit !== null && trade.profit !== undefined"
                :class="['font-medium', trade.profit >= 0 ? 'text-emerald-600' : 'text-red-600']">
                {{ trade.profit >= 0 ? '+' : '' }}{{ formatCurrency(trade.profit) }}
              </span>
              <span v-else class="text-gray-400">-</span>
            </td>
            <td class="px-4 py-3 text-center">
              <span :class="['px-2 py-0.5 rounded text-xs font-medium', getStatusClass(trade.status)]">
                {{ getStatusLabel(trade.status) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
defineProps({
  trades: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false }
})

const getTradeTypeLabel = (type) => {
  const map = { open: '开仓', close: '平仓', add: '加仓', reduce: '减仓' }
  return map[type] || type
}

const getTradeTypeClass = (type) => {
  if (type === 'open' || type === 'add') return 'bg-blue-100 text-blue-700'
  if (type === 'close' || type === 'reduce') return 'bg-orange-100 text-orange-700'
  return 'bg-gray-100 text-gray-600'
}

const getStatusLabel = (status) => {
  const map = { pending: '待执行', submitted: '已提交', filled: '已成交', partially_filled: '部分成交', cancelled: '已取消', failed: '失败' }
  return map[status] || status
}

const getStatusClass = (status) => {
  if (status === 'filled') return 'bg-emerald-100 text-emerald-700'
  if (status === 'pending' || status === 'submitted') return 'bg-amber-100 text-amber-700'
  if (status === 'failed' || status === 'cancelled') return 'bg-red-100 text-red-700'
  return 'bg-gray-100 text-gray-600'
}

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
  return new Date(date).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}
</script>

