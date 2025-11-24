<template>
  <div v-if="signalBot && (loading || priceSuggestions)" class="space-y-4">
    <!-- 加载状态 -->
    <div v-if="loading" class="flex items-center justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span class="ml-3 text-sm text-slate-600">正在获取AI价格建议...</span>
    </div>

    <!-- AI价格建议卡片 -->
    <div v-else-if="priceSuggestions && aiPowered" class="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-5">
      <!-- 标题 -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h3 class="text-sm font-semibold text-slate-900">AI价格建议</h3>
            <p class="text-xs text-slate-500">基于最新信号的AI分析</p>
          </div>
        </div>
        <div v-if="confidence" class="px-3 py-1 bg-white rounded-full border border-purple-200">
          <span class="text-xs font-medium text-purple-700">置信度: {{ confidence }}%</span>
        </div>
      </div>

      <!-- 价格建议列表 -->
      <div class="space-y-3">
        <!-- 入场价 -->
        <div class="bg-white rounded-lg p-3 border border-slate-200">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span class="text-xs font-medium text-slate-700">入场价</span>
            </div>
            <button
              v-if="pricingMode !== 'ai_suggested'"
              @click="applyAIPrice"
              class="px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
            >
              应用
            </button>
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-lg font-bold text-slate-900">${{ formatPrice(priceSuggestions.entry_price) }}</span>
            <span v-if="priceSuggestions.entry_price_min && priceSuggestions.entry_price_max" class="text-xs text-slate-500">
              范围: ${{ formatPrice(priceSuggestions.entry_price_min) }} - ${{ formatPrice(priceSuggestions.entry_price_max) }}
            </span>
          </div>
        </div>

        <!-- 止损价 -->
        <div class="bg-white rounded-lg p-3 border border-slate-200">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span class="text-xs font-medium text-slate-700">止损价</span>
            </div>
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-lg font-bold text-red-600">${{ formatPrice(priceSuggestions.stop_loss_price) }}</span>
            <span v-if="priceSuggestions.stop_loss_percentage" class="text-xs text-slate-500">
              (-{{ priceSuggestions.stop_loss_percentage }}%)
            </span>
          </div>
        </div>

        <!-- 止盈价 -->
        <div class="bg-white rounded-lg p-3 border border-slate-200">
          <div class="flex items-center gap-2 mb-2">
            <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span class="text-xs font-medium text-slate-700">止盈价</span>
          </div>
          <div class="space-y-2">
            <div v-if="priceSuggestions.take_profit_price_1" class="flex items-baseline gap-2">
              <span class="text-xs text-slate-500">目标1:</span>
              <span class="text-base font-bold text-blue-600">${{ formatPrice(priceSuggestions.take_profit_price_1) }}</span>
              <span v-if="priceSuggestions.take_profit_percentage_1" class="text-xs text-slate-500">
                (+{{ priceSuggestions.take_profit_percentage_1 }}%)
              </span>
            </div>
            <div v-if="priceSuggestions.take_profit_price_2" class="flex items-baseline gap-2">
              <span class="text-xs text-slate-500">目标2:</span>
              <span class="text-base font-bold text-blue-600">${{ formatPrice(priceSuggestions.take_profit_price_2) }}</span>
              <span v-if="priceSuggestions.take_profit_percentage_2" class="text-xs text-slate-500">
                (+{{ priceSuggestions.take_profit_percentage_2 }}%)
              </span>
            </div>
            <div v-if="priceSuggestions.take_profit_price_3" class="flex items-baseline gap-2">
              <span class="text-xs text-slate-500">目标3:</span>
              <span class="text-base font-bold text-blue-600">${{ formatPrice(priceSuggestions.take_profit_price_3) }}</span>
              <span v-if="priceSuggestions.take_profit_percentage_3" class="text-xs text-slate-500">
                (+{{ priceSuggestions.take_profit_percentage_3 }}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 提示信息 -->
      <div class="mt-4 space-y-2">
        <div class="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <svg class="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div class="text-xs text-blue-700">
            <p class="font-medium mb-1">AI价格建议说明：</p>
            <ul class="list-disc list-inside space-y-1">
              <li><strong>入场价</strong>：选择"AI建议"定价模式时自动使用</li>
              <li><strong>止损/止盈价</strong>：仅供参考，需在下方"交易策略配置"中手动设置</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- 无AI建议提示 -->
    <div v-else-if="!aiPowered" class="p-4 bg-slate-50 border border-slate-200 rounded-lg">
      <div class="flex items-start gap-2">
        <svg class="w-4 h-4 text-slate-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-xs text-slate-600">
          当前信号未使用AI分析。请在信号机器人中开启"AI分析模式"以获取价格建议。
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { botAPI } from '../../../utils/api'

const props = defineProps({
  signalBot: {
    type: Number,
    default: null
  },
  pricingMode: {
    type: String,
    default: 'auto_offset'
  }
})

const emit = defineEmits(['apply-ai-price', 'update:priceSuggestions'])

const loading = ref(false)
const priceSuggestions = ref(null)
const aiPowered = ref(false)
const confidence = ref(null)

// 格式化价格
const formatPrice = (price) => {
  if (!price) return 'N/A'
  const num = parseFloat(price)
  if (num < 0.01) return num.toFixed(8)
  if (num < 1) return num.toFixed(6)
  if (num < 100) return num.toFixed(4)
  return num.toFixed(2)
}

// 获取最新信号及AI价格建议
const fetchLatestSignal = async () => {
  if (!props.signalBot) return

  loading.value = true
  try {
    const response = await botAPI.getLatestSignal(props.signalBot)
    if (response.success && response.data) {
      priceSuggestions.value = response.data.price_suggestions
      aiPowered.value = response.data.ai_powered
      confidence.value = response.data.confidence
      
      // 通知父组件
      emit('update:priceSuggestions', response.data.price_suggestions)
    }
  } catch (error) {
    console.error('获取AI价格建议失败:', error)
    priceSuggestions.value = null
    aiPowered.value = false
  } finally {
    loading.value = false
  }
}

// 应用AI价格
const applyAIPrice = () => {
  emit('apply-ai-price', priceSuggestions.value)
}

// 监听信号机器人变化
watch(() => props.signalBot, () => {
  fetchLatestSignal()
}, { immediate: true })

onMounted(() => {
  if (props.signalBot) {
    fetchLatestSignal()
  }
})
</script>

