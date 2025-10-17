<template>
  <div class="p-6 border-b border-gray-200">
    <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
      <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      定投策略配置
    </h3>

    <!-- 主要参数 - 大卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <!-- 定投周期卡片 -->
      <div class="bg-gradient-to-br from-indigo-50 to-white rounded-xl p-5 border border-indigo-100">
        <div class="flex items-start justify-between mb-3">
          <div>
            <div class="text-xs font-medium text-gray-600 mb-0.5">定投周期</div>
            <div class="text-[10px] text-gray-500">DCA Frequency</div>
          </div>
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-100 text-indigo-700">
            {{ config.trigger_type || 'time' }}
          </span>
        </div>
        <div class="space-y-3">
          <div>
            <div class="text-[10px] text-gray-500 mb-1">频率</div>
            <div class="text-2xl font-bold text-indigo-600">
              {{ config.frequency_display || '每周' }}
            </div>
          </div>
          <div v-if="config.trigger_type === 'price'" class="pt-3 border-t border-indigo-100">
            <div class="text-[10px] text-gray-500 mb-1">触发价格区间</div>
            <div class="text-sm font-semibold text-gray-700">
              ${{ formatPrice(config.trigger_price_min) }} - ${{ formatPrice(config.trigger_price_max) }}
            </div>
          </div>
        </div>
      </div>

      <!-- 仓位设置卡片 -->
      <div class="bg-gradient-to-br from-green-50 to-white rounded-xl p-5 border border-green-100">
        <div class="flex items-start justify-between mb-3">
          <div>
            <div class="text-xs font-medium text-gray-600 mb-0.5">仓位设置</div>
            <div class="text-[10px] text-gray-500">Position Settings</div>
          </div>
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 text-green-700">
            {{ config.leverage || 1 }}x
          </span>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <div class="text-[10px] text-gray-500 mb-1">单次仓位</div>
            <div class="text-3xl font-bold text-green-600">
              {{ config.position_per_dca }}%
            </div>
          </div>
          <div>
            <div class="text-[10px] text-gray-500 mb-1">最大次数</div>
            <div class="text-3xl font-bold text-orange-600">
              {{ config.max_dca_times }}次
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 投资与配置 - 小卡片 -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <!-- 总仓位 -->
      <div class="bg-white rounded-lg p-3.5 border border-gray-200 hover:border-gray-300 transition-colors">
        <div class="flex items-center justify-between mb-2">
          <div class="text-[10px] text-gray-500">总仓位</div>
          <div class="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center">
            <svg class="w-3.5 h-3.5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
          </div>
        </div>
        <div class="text-xl font-bold text-purple-600">
          {{ totalPosition }}%
        </div>
        <div class="text-[10px] text-gray-500 mt-1">累计投入</div>
      </div>

      <!-- 止损 -->
      <div class="bg-white rounded-lg p-3.5 border border-gray-200 hover:border-gray-300 transition-colors">
        <div class="flex items-center justify-between mb-2">
          <div class="text-[10px] text-gray-500">总止损</div>
          <div class="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center">
            <svg class="w-3.5 h-3.5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </div>
        </div>
        <div class="text-xl font-bold text-red-600">
          {{ config.total_stop_loss_percentage }}%
        </div>
        <div class="text-[10px] text-gray-500 mt-1">风险控制</div>
      </div>

      <!-- 止盈 -->
      <div class="bg-white rounded-lg p-3.5 border border-gray-200 hover:border-gray-300 transition-colors">
        <div class="flex items-center justify-between mb-2">
          <div class="text-[10px] text-gray-500">目标收益</div>
          <div class="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center">
            <svg class="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
        </div>
        <div class="text-xl font-bold text-green-600">
          {{ config.take_profit_percentage }}%
        </div>
        <div class="text-[10px] text-gray-500 mt-1">盈利目标</div>
      </div>

      <!-- 杠杆倍数 -->
      <div class="bg-white rounded-lg p-3.5 border border-gray-200 hover:border-gray-300 transition-colors">
        <div class="flex items-center justify-between mb-2">
          <div class="text-[10px] text-gray-500">杠杆倍数</div>
          <div class="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center">
            <svg class="w-3.5 h-3.5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
            </svg>
          </div>
        </div>
        <div class="text-xl font-bold text-orange-600">
          {{ config.leverage || 1 }}x
        </div>
        <div class="text-[10px] text-gray-500 mt-1">资金放大</div>
      </div>
    </div>

    <!-- 定投明细表 -->
    <div v-if="config.levels && config.levels.length > 0" class="mb-6">
      <h4 class="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
        <svg class="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
        </svg>
        定投明细表
        <span class="text-xs text-gray-500 font-normal">
          (共 {{ config.max_dca_times }} 次)
        </span>
      </h4>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-indigo-50 border-b-2 border-indigo-200">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-semibold text-indigo-700 uppercase">批次</th>
              <th class="px-4 py-3 text-right text-xs font-semibold text-indigo-700 uppercase">触发条件</th>
              <th class="px-4 py-3 text-right text-xs font-semibold text-indigo-700 uppercase">仓位</th>
              <th class="px-4 py-3 text-right text-xs font-semibold text-indigo-700 uppercase">累计仓位</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="level in config.levels"
                :key="level.level"
                class="hover:bg-indigo-50 transition-colors">
              <td class="px-4 py-3 font-medium text-gray-900">第 {{ level.level }} 次</td>
              <td class="px-4 py-3 text-right text-gray-900">
                <span v-if="level.trigger_price">
                  ${{ formatPrice(level.trigger_price) }}
                </span>
                <span v-else class="text-gray-500">
                  {{ level.trigger_time || '定时触发' }}
                </span>
              </td>
              <td class="px-4 py-3 text-right text-gray-900">{{ level.position_percentage }}%</td>
              <td class="px-4 py-3 text-right text-green-600 font-semibold">
                {{ calculateCumulativePosition(level.level) }}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 风险提示 -->
    <div v-if="config.risk_warning" class="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
      <div class="flex items-start gap-3">
        <svg class="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
        <div>
          <div class="text-sm font-semibold text-yellow-800 mb-1">风险提示</div>
          <div class="text-sm text-yellow-700">
            {{ config.risk_warning }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  config: {
    type: Object,
    required: true
  }
})

const formatPrice = (price) => {
  if (!price) return '0.00'
  return parseFloat(price).toFixed(2)
}

// 计算总仓位
const totalPosition = computed(() => {
  if (!props.config.levels || props.config.levels.length === 0) {
    return (props.config.position_per_dca * props.config.max_dca_times).toFixed(2)
  }
  
  const total = props.config.levels.reduce((sum, level) => {
    return sum + (level.position_percentage || 0)
  }, 0)
  
  return total.toFixed(2)
})

// 计算累计仓位
const calculateCumulativePosition = (level) => {
  if (!props.config.levels || props.config.levels.length === 0) {
    return (props.config.position_per_dca * level).toFixed(2)
  }
  
  let total = 0
  for (let i = 0; i < level; i++) {
    total += props.config.levels[i].position_percentage || 0
  }
  return total.toFixed(2)
}
</script>

<style scoped>
/* 可以添加自定义样式 */
</style>

