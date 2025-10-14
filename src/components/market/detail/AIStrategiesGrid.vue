<template>
  <div>
    <div v-if="!strategies || strategies.length === 0" class="text-center py-12 bg-white rounded-xl">
      <p class="text-gray-500">No AI strategies available</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div 
        v-for="strategy in strategies.slice(0, 4)" 
        :key="strategy.code"
        class="bg-white rounded-xl p-5 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
      >
        <div class="flex items-start justify-between mb-3">
          <div class="flex-1">
            <h3 class="text-base font-bold text-gray-900 mb-1">{{ strategy.name }}</h3>
            <span 
              class="inline-block px-2 py-1 text-xs font-medium rounded"
              :class="getRiskBadgeClass(strategy.risk_level)"
            >
              {{ getRiskLevelText(strategy.risk_level) }}
            </span>
          </div>
          <div class="ml-3 text-right">
            <div class="text-xl font-bold text-gray-900">{{ strategy.confidence }}%</div>
            <div class="text-xs text-gray-500">Match</div>
          </div>
        </div>

        <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{ strategy.description }}</p>

        <div class="space-y-2 mb-3">
          <div class="flex justify-between text-xs">
            <span class="text-gray-600">Leverage:</span>
            <span class="font-semibold text-gray-900">{{ strategy.default_params.leverage || 1 }}x</span>
          </div>
          <div v-if="strategy.default_params.stop_loss_percent" class="flex justify-between text-xs">
            <span class="text-gray-600">Stop Loss:</span>
            <span class="font-semibold text-gray-900">{{ strategy.default_params.stop_loss_percent }}%</span>
          </div>
        </div>

        <button class="w-full py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium">
          Use Strategy
        </button>
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
    'low': 'Low Risk',
    'medium': 'Medium Risk',
    'high': 'High Risk',
    'very_high': 'Very High Risk'
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
</script>

