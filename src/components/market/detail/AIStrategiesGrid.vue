<template>
  <div>
    <div v-if="!strategies || strategies.length === 0" class="text-center py-16">
      <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
      </svg>
      <p class="text-gray-500 text-sm">暂无策略单</p>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div
        v-for="strategy in strategies.slice(0, 6)"
        :key="strategy.code"
        class="bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer overflow-hidden"
      >
        <!-- Header with User Info -->
        <div class="p-4 border-b border-gray-100">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <!-- User Avatar -->
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                {{ getInitials(strategy.author || 'AI Bot') }}
              </div>
              <div>
                <div class="font-semibold text-gray-900 text-sm">{{ strategy.author || 'AI Bot' }}</div>
                <div class="text-xs text-gray-500">{{ getTimeAgo(strategy.created_at) }}</div>
              </div>
            </div>

            <!-- Match Score -->
            <div class="flex items-center space-x-2">
              <div class="text-right">
                <div class="text-lg font-bold text-gray-900">{{ strategy.confidence }}%</div>
                <div class="text-xs text-gray-500">匹配度</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Strategy Content -->
        <div class="p-4">
          <!-- Strategy Name & Risk -->
          <div class="flex items-start justify-between mb-3">
            <div class="flex-1">
              <h3 class="text-base font-bold text-gray-900 mb-2">{{ strategy.name }}</h3>
              <p class="text-sm text-gray-600 line-clamp-2 mb-3">{{ strategy.description }}</p>
            </div>
          </div>

          <!-- Strategy Params -->
          <div class="grid grid-cols-3 gap-3 mb-4">
            <div class="bg-gray-50 rounded-lg p-2.5 text-center">
              <div class="text-xs text-gray-500 mb-1">杠杆</div>
              <div class="text-sm font-bold text-gray-900">{{ strategy.default_params.leverage || 1 }}x</div>
            </div>
            <div v-if="strategy.default_params.stop_loss_percent" class="bg-gray-50 rounded-lg p-2.5 text-center">
              <div class="text-xs text-gray-500 mb-1">止损</div>
              <div class="text-sm font-bold text-red-600">-{{ strategy.default_params.stop_loss_percent }}%</div>
            </div>
            <div class="bg-gray-50 rounded-lg p-2.5 text-center">
              <div class="text-xs text-gray-500 mb-1">风险</div>
              <div class="text-xs font-semibold px-2 py-0.5 rounded inline-block" :class="getRiskBadgeClass(strategy.risk_level)">
                {{ getRiskLevelText(strategy.risk_level) }}
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center space-x-2">
            <button class="flex-1 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium">
              使用策略
            </button>
            <button class="px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
              </svg>
            </button>
            <button class="px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Footer Stats -->
        <div class="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <div class="flex items-center space-x-4">
            <span class="flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
              {{ strategy.views || 0 }}
            </span>
            <span class="flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
              </svg>
              {{ strategy.saves || 0 }}
            </span>
          </div>
          <span>{{ strategy.timeframe || '中线' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  strategies: { type: Array, default: () => [] },
  marketCondition: { type: String, default: '' }
})

const getRiskLevelText = (level) => {
  const labels = {
    'low': '低风险',
    'medium': '中风险',
    'high': '高风险',
    'very_high': '极高风险'
  }
  return labels[level] || level
}

const getRiskBadgeClass = (level) => {
  const classes = {
    'low': 'bg-green-100 text-green-700',
    'medium': 'bg-yellow-100 text-yellow-700',
    'high': 'bg-orange-100 text-orange-700',
    'very_high': 'bg-red-100 text-red-700'
  }
  return classes[level] || 'bg-gray-100 text-gray-700'
}

const getInitials = (name) => {
  if (!name) return 'AI'
  const words = name.split(' ')
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

const getTimeAgo = (timestamp) => {
  if (!timestamp) return '刚刚'
  const now = new Date()
  const time = new Date(timestamp)
  const diff = Math.floor((now - time) / 1000) // seconds

  if (diff < 60) return '刚刚'
  if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`
  if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`
  if (diff < 604800) return `${Math.floor(diff / 86400)}天前`
  return time.toLocaleDateString('zh-CN')
}
</script>

