<template>
  <div class="bg-gradient-to-br rounded-xl border-2 p-6" :class="getBgClass()">
    <!-- 计划头部 -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <!-- 方向图标 -->
        <div class="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm" :class="getDirectionIconBg()">
          <svg v-if="plan.direction === 'long'" class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
          </svg>
          <svg v-else class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"/>
          </svg>
        </div>
        
        <div>
          <div class="text-lg font-bold text-gray-900">{{ plan.name }}</div>
          <div class="text-sm font-medium" :class="getDirectionTextClass()">
            {{ plan.direction === 'long' ? '做多 (Long)' : '做空 (Short)' }}
          </div>
        </div>
      </div>
      
      <!-- 胜率 -->
      <div v-if="plan.win_probability" class="text-right">
        <div class="text-xs text-gray-600 mb-1">预估胜率</div>
        <div class="text-2xl font-bold" :class="getWinRateColor(plan.win_probability)">
          {{ plan.win_probability }}%
        </div>
      </div>
    </div>
    
    <!-- 入场触发条件 -->
    <div v-if="plan.entry_triggers && plan.entry_triggers.length > 0" class="mb-4 p-4 bg-white/80 backdrop-blur-sm rounded-lg">
      <div class="flex items-center gap-2 mb-2">
        <svg class="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
        </svg>
        <span class="text-sm font-semibold text-gray-900">入场触发条件</span>
      </div>
      <ul class="space-y-1">
        <li v-for="(trigger, index) in plan.entry_triggers" :key="index" class="text-sm text-gray-700 flex items-start gap-2">
          <span class="text-blue-600 font-bold">•</span>
          <span>{{ trigger }}</span>
        </li>
      </ul>
    </div>
    
    <!-- 价格区间 -->
    <div class="grid grid-cols-2 gap-3 mb-4">
      <!-- 入场价格 -->
      <div class="bg-white/80 backdrop-blur-sm rounded-lg p-4">
        <div class="flex items-center gap-2 mb-2">
          <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
          </svg>
          <span class="text-xs font-semibold text-gray-700">入场价格</span>
        </div>
        <div v-if="plan.entry_price_min && plan.entry_price_max" class="space-y-1">
          <div class="text-xs text-gray-600">区间</div>
          <div class="font-bold text-green-700">
            ${{ formatPrice(plan.entry_price_min) }} - ${{ formatPrice(plan.entry_price_max) }}
          </div>
          <div class="text-xs text-gray-600 mt-1">
            中间价: ${{ formatPrice(plan.entry_price) }}
          </div>
        </div>
        <div v-else-if="plan.entry_price" class="font-bold text-green-700 text-lg">
          ${{ formatPrice(plan.entry_price) }}
        </div>
        <div v-else class="text-sm text-gray-500">
          未设置
        </div>
      </div>
      
      <!-- 止损价格 -->
      <div class="bg-white/80 backdrop-blur-sm rounded-lg p-4">
        <div class="flex items-center gap-2 mb-2">
          <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
          <span class="text-xs font-semibold text-gray-700">止损价格</span>
        </div>
        <div v-if="plan.stop_loss" class="space-y-1">
          <div class="font-bold text-red-700 text-lg">
            ${{ formatPrice(plan.stop_loss) }}
          </div>
          <div v-if="plan.stop_loss_percentage" class="text-xs text-red-600">
            -{{ plan.stop_loss_percentage }}%
          </div>
        </div>
        <div v-else class="text-sm text-gray-500">
          未设置
        </div>
      </div>
    </div>
    
    <!-- 止盈目标 -->
    <div v-if="plan.take_profit_1" class="mb-4">
      <div class="flex items-center gap-2 mb-3">
        <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
        </svg>
        <span class="text-sm font-semibold text-gray-900">止盈目标</span>
      </div>
      
      <div class="space-y-2">
        <!-- TP1 -->
        <div class="flex items-center justify-between p-3 bg-white/80 backdrop-blur-sm rounded-lg">
          <div>
            <span class="text-xs text-gray-600">TP1</span>
            <div class="font-bold text-blue-700">${{ formatPrice(plan.take_profit_1) }}</div>
          </div>
          <div v-if="plan.take_profit_1_percentage" class="text-right">
            <span class="text-xs text-gray-600">收益</span>
            <div class="font-bold text-green-600">+{{ plan.take_profit_1_percentage }}%</div>
          </div>
        </div>
        
        <!-- TP2 -->
        <div v-if="plan.take_profit_2" class="flex items-center justify-between p-3 bg-white/80 backdrop-blur-sm rounded-lg">
          <div>
            <span class="text-xs text-gray-600">TP2</span>
            <div class="font-bold text-blue-700">${{ formatPrice(plan.take_profit_2) }}</div>
          </div>
          <div v-if="plan.take_profit_2_percentage" class="text-right">
            <span class="text-xs text-gray-600">收益</span>
            <div class="font-bold text-green-600">+{{ plan.take_profit_2_percentage }}%</div>
          </div>
        </div>
        
        <!-- TP3 -->
        <div v-if="plan.take_profit_3" class="flex items-center justify-between p-3 bg-white/80 backdrop-blur-sm rounded-lg">
          <div>
            <span class="text-xs text-gray-600">TP3</span>
            <div class="font-bold text-blue-700">${{ formatPrice(plan.take_profit_3) }}</div>
          </div>
          <div v-if="plan.take_profit_3_percentage" class="text-right">
            <span class="text-xs text-gray-600">收益</span>
            <div class="font-bold text-green-600">+{{ plan.take_profit_3_percentage }}%</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 仓位和杠杆 -->
    <div class="grid grid-cols-2 gap-3">
      <!-- 仓位 -->
      <div class="bg-white/80 backdrop-blur-sm rounded-lg p-3">
        <div class="text-xs text-gray-600 mb-1">建议仓位</div>
        <div class="text-xl font-bold text-gray-900">
          {{ plan.position_size_percentage || 0 }}%
        </div>
      </div>
      
      <!-- 杠杆 -->
      <div class="bg-white/80 backdrop-blur-sm rounded-lg p-3">
        <div class="text-xs text-gray-600 mb-1">建议杠杆</div>
        <div class="text-xl font-bold text-gray-900">
          {{ plan.leverage || 1 }}x
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  plan: {
    type: Object,
    required: true
  },
  color: {
    type: String,
    default: 'blue'
  }
})

const formatPrice = (price) => {
  if (!price) return '0.00'
  const num = parseFloat(price)
  if (num >= 1000) return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  if (num >= 1) return num.toFixed(2)
  if (num >= 0.01) return num.toFixed(4)
  return num.toFixed(8)
}

const getBgClass = () => {
  if (props.color === 'blue') {
    return 'from-blue-50 to-indigo-50 border-blue-200'
  } else if (props.color === 'purple') {
    return 'from-purple-50 to-pink-50 border-purple-200'
  }
  return 'from-gray-50 to-white border-gray-200'
}

const getDirectionIconBg = () => {
  if (props.plan.direction === 'long') {
    return 'bg-green-500'
  } else {
    return 'bg-red-500'
  }
}

const getDirectionTextClass = () => {
  if (props.plan.direction === 'long') {
    return 'text-green-700'
  } else {
    return 'text-red-700'
  }
}

const getWinRateColor = (rate) => {
  if (rate >= 70) return 'text-green-600'
  if (rate >= 50) return 'text-blue-600'
  return 'text-orange-600'
}
</script>

