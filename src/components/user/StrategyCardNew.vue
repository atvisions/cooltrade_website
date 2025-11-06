<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-200">
    <!-- 顶部核心判断卡片 -->
    <div class="p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-t-2xl border-b border-gray-200">
      <div class="flex items-start justify-between mb-4">
        <div class="flex-1">
          <div class="flex items-center gap-3 mb-3">
            <img v-if="strategy.token_logo" :src="strategy.token_logo" :alt="strategy.token_symbol" class="w-12 h-12 rounded-full ring-2 ring-white shadow-sm" />
            <div>
              <h2 class="text-2xl font-bold text-gray-900">{{ strategy.token_symbol }}/USDT</h2>
              <p class="text-sm text-gray-600">{{ strategy.token_name }}</p>
            </div>
          </div>
          
          <!-- 一句话总结 -->
          <div class="bg-white/80 backdrop-blur-sm rounded-xl p-4 mb-3">
            <p class="text-lg font-semibold text-gray-900 leading-relaxed">
              {{ strategy.summary || strategy.key_insight || '暂无策略摘要' }}
            </p>
          </div>
          
          <!-- 核心指标 -->
          <div class="grid grid-cols-3 gap-3">
            <!-- 市场趋势 -->
            <div class="bg-white/80 backdrop-blur-sm rounded-lg p-3">
              <div class="text-xs text-gray-600 mb-1">市场趋势</div>
              <div class="flex items-center gap-2">
                <div class="text-2xl">
                  {{ strategy.market_trend === 'bullish' ? '📈' : strategy.market_trend === 'bearish' ? '📉' : '↔️' }}
                </div>
                <div>
                  <div class="font-bold text-gray-900">
                    {{ strategy.market_trend === 'bullish' ? '看涨' : strategy.market_trend === 'bearish' ? '看跌' : '横盘' }}
                  </div>
                  <div class="text-xs text-gray-500">
                    {{ strategy.market_trend_strength === 'strong' ? '强势' : strategy.market_trend_strength === 'weak' ? '弱势' : '中等' }}
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 信心度 -->
            <div class="bg-white/80 backdrop-blur-sm rounded-lg p-3">
              <div class="text-xs text-gray-600 mb-1">信心度</div>
              <div class="flex items-center gap-2">
                <div class="text-3xl font-bold" :class="getConfidenceColor(strategy.confidence_level)">
                  {{ strategy.confidence_level || 50 }}%
                </div>
              </div>
              <div class="mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div class="h-full transition-all" :class="getConfidenceColor(strategy.confidence_level)" :style="{ width: `${strategy.confidence_level || 50}%` }"></div>
              </div>
            </div>
            
            <!-- 当前价格 -->
            <div class="bg-white/80 backdrop-blur-sm rounded-lg p-3">
              <div class="text-xs text-gray-600 mb-1">当前价格</div>
              <div class="text-2xl font-bold text-blue-600">
                ${{ formatPrice(strategy.snapshot_price || strategy.token_current_price) }}
              </div>
              <div class="text-xs text-gray-500 mt-1">
                {{ formatDateTime(strategy.created_at) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 关键价位 -->
    <div v-if="hasKeyLevels" class="p-6 border-b border-gray-200 bg-gray-50">
      <div class="flex items-center gap-2 mb-4">
        <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
        </svg>
        <h3 class="text-lg font-bold text-gray-900">关键价位</h3>
      </div>
      
      <div class="grid grid-cols-2 gap-4">
        <!-- 阻力位 -->
        <div class="bg-white rounded-xl p-4 border border-red-100">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
              </svg>
            </div>
            <span class="font-semibold text-gray-900">阻力位</span>
          </div>
          <div class="space-y-2">
            <div v-if="strategy.resistance_1_price" class="flex items-center justify-between p-2 bg-red-50 rounded-lg">
              <div>
                <div class="font-bold text-red-700">${{ formatPrice(strategy.resistance_1_price) }}</div>
                <div class="text-xs text-gray-600">{{ strategy.resistance_1_reason || '技术分析' }}</div>
              </div>
              <span class="px-2 py-1 text-xs font-medium rounded-full" :class="getStrengthClass(strategy.resistance_1_strength)">
                {{ getStrengthText(strategy.resistance_1_strength) }}
              </span>
            </div>
            <div v-if="strategy.resistance_2_price" class="flex items-center justify-between p-2 bg-red-50 rounded-lg">
              <div>
                <div class="font-bold text-red-700">${{ formatPrice(strategy.resistance_2_price) }}</div>
                <div class="text-xs text-gray-600">{{ strategy.resistance_2_reason || '技术分析' }}</div>
              </div>
              <span class="px-2 py-1 text-xs font-medium rounded-full" :class="getStrengthClass(strategy.resistance_2_strength)">
                {{ getStrengthText(strategy.resistance_2_strength) }}
              </span>
            </div>
          </div>
        </div>
        
        <!-- 支撑位 -->
        <div class="bg-white rounded-xl p-4 border border-green-100">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </div>
            <span class="font-semibold text-gray-900">支撑位</span>
          </div>
          <div class="space-y-2">
            <div v-if="strategy.support_1_price" class="flex items-center justify-between p-2 bg-green-50 rounded-lg">
              <div>
                <div class="font-bold text-green-700">${{ formatPrice(strategy.support_1_price) }}</div>
                <div class="text-xs text-gray-600">{{ strategy.support_1_reason || '技术分析' }}</div>
              </div>
              <span class="px-2 py-1 text-xs font-medium rounded-full" :class="getStrengthClass(strategy.support_1_strength)">
                {{ getStrengthText(strategy.support_1_strength) }}
              </span>
            </div>
            <div v-if="strategy.support_2_price" class="flex items-center justify-between p-2 bg-green-50 rounded-lg">
              <div>
                <div class="font-bold text-green-700">${{ formatPrice(strategy.support_2_price) }}</div>
                <div class="text-xs text-gray-600">{{ strategy.support_2_reason || '技术分析' }}</div>
              </div>
              <span class="px-2 py-1 text-xs font-medium rounded-full" :class="getStrengthClass(strategy.support_2_strength)">
                {{ getStrengthText(strategy.support_2_strength) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 交易计划 -->
    <div class="p-6">
      <div class="flex items-center gap-2 mb-4">
        <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
        </svg>
        <h3 class="text-lg font-bold text-gray-900">交易计划</h3>
      </div>
      
      <!-- 计划 A 和 计划 B 切换 -->
      <div class="flex gap-2 mb-4">
        <button
          @click="activePlan = 'A'"
          class="flex-1 py-3 px-4 rounded-xl font-semibold transition-all"
          :class="activePlan === 'A' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
        >
          <div class="flex items-center justify-center gap-2">
            <span>计划 A</span>
            <span v-if="strategy.primary_plan_name" class="text-sm opacity-80">({{ strategy.primary_plan_name }})</span>
          </div>
        </button>
        <button
          @click="activePlan = 'B'"
          class="flex-1 py-3 px-4 rounded-xl font-semibold transition-all"
          :class="activePlan === 'B' ? 'bg-purple-600 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
        >
          <div class="flex items-center justify-center gap-2">
            <span>计划 B</span>
            <span v-if="strategy.alternative_plan_name" class="text-sm opacity-80">({{ strategy.alternative_plan_name }})</span>
          </div>
        </button>
      </div>
      
      <!-- 计划 A 内容 -->
      <div v-if="activePlan === 'A' && hasPlanA" class="space-y-4">
        <PlanCard
          :plan="getPlanA()"
          :color="'blue'"
        />
      </div>
      
      <!-- 计划 B 内容 -->
      <div v-if="activePlan === 'B' && hasPlanB" class="space-y-4">
        <PlanCard
          :plan="getPlanB()"
          :color="'purple'"
        />
      </div>
      
      <!-- 无计划提示 -->
      <div v-if="(activePlan === 'A' && !hasPlanA) || (activePlan === 'B' && !hasPlanB)" class="text-center py-8 text-gray-500">
        <svg class="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <p>暂无{{ activePlan === 'A' ? '主要' : '备选' }}计划数据</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import PlanCard from './PlanCard.vue'

const props = defineProps({
  strategy: {
    type: Object,
    required: true
  }
})

const activePlan = ref('A')

// 计算属性
const hasKeyLevels = computed(() => {
  return props.strategy.resistance_1_price || props.strategy.resistance_2_price ||
         props.strategy.support_1_price || props.strategy.support_2_price
})

const hasPlanA = computed(() => {
  return props.strategy.primary_entry_price || props.strategy.primary_stop_loss
})

const hasPlanB = computed(() => {
  return props.strategy.alternative_entry_price || props.strategy.alternative_stop_loss
})

// 方法
const formatPrice = (price) => {
  if (!price) return '0.00'
  const num = parseFloat(price)
  if (num >= 1000) return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  if (num >= 1) return num.toFixed(2)
  if (num >= 0.01) return num.toFixed(4)
  return num.toFixed(8)
}

const formatDateTime = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit', 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const getConfidenceColor = (level) => {
  if (!level) return 'text-gray-600 bg-gray-200'
  if (level >= 75) return 'text-green-600 bg-green-500'
  if (level >= 50) return 'text-blue-600 bg-blue-500'
  return 'text-orange-600 bg-orange-500'
}

const getStrengthClass = (strength) => {
  if (strength === 'strong') return 'bg-red-100 text-red-700'
  if (strength === 'weak') return 'bg-gray-100 text-gray-600'
  return 'bg-yellow-100 text-yellow-700'
}

const getStrengthText = (strength) => {
  if (strength === 'strong') return '强'
  if (strength === 'weak') return '弱'
  return '中'
}

const getPlanA = () => {
  return {
    name: props.strategy.primary_plan_name || '主要方案',
    direction: props.strategy.primary_plan_direction || 'long',
    entry_triggers: props.strategy.primary_entry_triggers || [],
    entry_price_min: props.strategy.primary_entry_price_min,
    entry_price_max: props.strategy.primary_entry_price_max,
    entry_price: props.strategy.primary_entry_price,
    stop_loss: props.strategy.primary_stop_loss,
    stop_loss_percentage: props.strategy.primary_stop_loss_percentage,
    take_profit_1: props.strategy.primary_take_profit_1,
    take_profit_1_percentage: props.strategy.primary_take_profit_1_percentage,
    take_profit_2: props.strategy.primary_take_profit_2,
    take_profit_2_percentage: props.strategy.primary_take_profit_2_percentage,
    take_profit_3: props.strategy.primary_take_profit_3,
    take_profit_3_percentage: props.strategy.primary_take_profit_3_percentage,
    position_size_percentage: props.strategy.primary_position_size_percentage,
    leverage: props.strategy.primary_leverage,
    win_probability: props.strategy.primary_win_probability
  }
}

const getPlanB = () => {
  return {
    name: props.strategy.alternative_plan_name || '备选方案',
    direction: props.strategy.alternative_plan_direction || 'short',
    entry_triggers: props.strategy.alternative_entry_triggers || [],
    entry_price_min: props.strategy.alternative_entry_price_min,
    entry_price_max: props.strategy.alternative_entry_price_max,
    entry_price: props.strategy.alternative_entry_price,
    stop_loss: props.strategy.alternative_stop_loss,
    stop_loss_percentage: props.strategy.alternative_stop_loss_percentage,
    take_profit_1: props.strategy.alternative_take_profit_1,
    take_profit_1_percentage: props.strategy.alternative_take_profit_1_percentage,
    take_profit_2: props.strategy.alternative_take_profit_2,
    take_profit_2_percentage: props.strategy.alternative_take_profit_2_percentage,
    take_profit_3: props.strategy.alternative_take_profit_3,
    take_profit_3_percentage: props.strategy.alternative_take_profit_3_percentage,
    position_size_percentage: props.strategy.alternative_position_size_percentage,
    leverage: props.strategy.alternative_leverage,
    win_probability: props.strategy.alternative_win_probability
  }
}
</script>

