<template>
  <div class="space-y-3">
    <h2 class="text-sm font-semibold text-slate-800">最近信号</h2>

    <!-- 加载状态 -->
    <div v-if="loading" class="text-center py-8 bg-white rounded-xl border border-slate-200">
      <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-slate-300"></div>
      <p class="text-xs text-slate-500 mt-2">加载中...</p>
    </div>

    <!-- 信号列表 -->
    <div v-else-if="signals.length > 0" class="space-y-2">
      <div
        v-for="signal in signals"
        :key="signal.id"
        class="bg-white rounded-lg border border-slate-200 overflow-hidden hover:border-slate-300 transition-colors"
      >
        <!-- 信号头部 -->
        <div class="px-4 py-3 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span :class="[
              'px-2 py-0.5 rounded text-xs font-semibold',
              signal.signal_type === 'buy' ? 'bg-green-100 text-green-700' :
              signal.signal_type === 'sell' ? 'bg-red-100 text-red-700' :
              'bg-yellow-100 text-yellow-700'
            ]">
              {{ signal.signal_type_display || getSignalTypeLabel(signal.signal_type) }}
            </span>
            <span class="text-sm font-medium text-slate-800">{{ signal.title || formatPrice(signal.price) }}</span>
            <span v-if="signal.strength" class="text-xs text-slate-500">
              强度 {{ signal.strength }}%
            </span>
          </div>
          <div class="flex items-center gap-3">
            <span :class="[
              'px-2 py-0.5 rounded text-[10px] font-medium',
              signal.status === 'active' ? 'bg-blue-100 text-blue-700' :
              signal.status === 'executed' ? 'bg-green-100 text-green-700' :
              signal.status === 'expired' ? 'bg-slate-100 text-slate-500' :
              'bg-slate-100 text-slate-600'
            ]">
              {{ getStatusLabel(signal.status) }}
            </span>
            <span class="text-xs text-slate-400">{{ formatTime(signal.created_at) }}</span>
            <button
              v-if="signal.ai_analysis"
              @click="$emit('toggleAnalysis', signal.id)"
              class="text-xs text-blue-600 hover:text-blue-700"
            >
              {{ expandedSignals[signal.id] ? '收起' : 'AI分析' }}
            </button>
          </div>
        </div>

        <!-- AI 分析详情（可展开） -->
        <div v-if="signal.ai_analysis && expandedSignals[signal.id]" class="px-4 py-3 bg-slate-50 border-t border-slate-200">
          <div class="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p class="text-slate-500 mb-1">趋势分析</p>
              <p class="text-slate-700">{{ signal.ai_analysis.trend || '--' }}</p>
            </div>
            <div>
              <p class="text-slate-500 mb-1">风险等级</p>
              <p class="text-slate-700">{{ signal.ai_analysis.risk_level || '--' }}</p>
            </div>
            <div>
              <p class="text-slate-500 mb-1">建议操作</p>
              <p class="text-slate-700">{{ signal.ai_analysis.recommendation || '--' }}</p>
            </div>
            <div>
              <p class="text-slate-500 mb-1">置信度</p>
              <p class="text-slate-700">{{ signal.ai_analysis.confidence || '--' }}%</p>
            </div>
          </div>
          <div v-if="signal.ai_analysis.summary" class="mt-3 pt-3 border-t border-slate-200">
            <p class="text-xs text-slate-500 mb-1">AI 总结</p>
            <p class="text-xs text-slate-600">{{ signal.ai_analysis.summary }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="bg-white rounded-xl border border-slate-200 px-6 py-8 text-center">
      <svg class="mx-auto h-8 w-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
      </svg>
      <p class="text-sm text-slate-500 mt-2">暂无信号记录</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  signals: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  expandedSignals: { type: Object, default: () => ({}) }
})

defineEmits(['toggleAnalysis'])

const formatPrice = (price) => {
  if (!price) return '--'
  return Number(price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 })
}

const formatTime = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const now = new Date()
  const diff = (now - d) / 1000 / 60 // minutes
  if (diff < 60) return `${Math.round(diff)}分钟前`
  if (diff < 1440) return `${Math.round(diff / 60)}小时前`
  return d.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const getStatusLabel = (status) => {
  const labels = {
    active: '活跃',
    executed: '已执行',
    expired: '已过期',
    cancelled: '已取消'
  }
  return labels[status] || status
}

const getSignalTypeLabel = (signalType) => {
  const labels = {
    buy: '买入信号',
    sell: '卖出信号',
    close: '平仓信号',
    alert: '价格提醒',
    neutral: '中性信号'
  }
  return labels[signalType] || signalType
}
</script>

