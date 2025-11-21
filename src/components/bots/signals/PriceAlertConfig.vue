<template>
  <div class="p-6 bg-slate-50 rounded-lg border border-slate-200">
    <div class="flex items-center gap-2 mb-4">
      <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="text-base font-semibold text-slate-900">价格提醒设置</h3>
    </div>

    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-2">
          触发条件
          <span class="text-xs text-slate-500 ml-2">当价格满足条件时触发通知</span>
        </label>
        <div class="grid grid-cols-4 gap-2">
          <button
            v-for="cond in priceConditions"
            :key="cond.value"
            type="button"
            @click="config.condition = cond.value"
            :class="[
              'p-3 border-2 rounded-lg text-sm font-medium transition-all',
              config.condition === cond.value
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
            ]"
          >
            {{ cond.label }}
          </button>
        </div>
      </div>

      <div>
        <div class="flex items-center justify-between mb-2">
          <label class="text-sm font-medium text-slate-700">
            目标价格 (USD)
            <span class="text-xs text-slate-500 ml-2">设置触发通知的价格</span>
          </label>
          <span v-if="currentPrice" class="text-sm font-semibold text-slate-900">
            当前价格 ${{ formatPrice(currentPrice) }}
          </span>
        </div>
        <input
          v-model="config.target_price"
          type="number"
          placeholder="例如: 95000"
          step="0.00000001"
          class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />

        <!-- 快捷百分比按钮 -->
        <div v-if="currentPrice" class="mt-3">
          <div class="text-xs text-slate-600 mb-2">快速设置（点击自动填入）：</div>
          <div class="grid grid-cols-5 gap-2">
            <button
              v-for="percent in quickPercentages"
              :key="percent"
              type="button"
              @click="setQuickPrice(percent)"
              class="p-2 border border-slate-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-center"
            >
              <div class="text-xs font-semibold" :class="percent > 0 ? 'text-green-600' : 'text-red-600'">
                {{ percent > 0 ? '+' : '' }}{{ percent }}%
              </div>
              <div class="text-xs text-slate-500 mt-0.5">
                ${{ formatQuickPrice(currentPrice, percent) }}
              </div>
            </button>
          </div>
        </div>

        <!-- 价格变化预览 -->
        <div v-if="priceChangePreview" class="mt-3 p-3 bg-white border rounded-lg" :class="priceChangePreview.isLogicalError ? 'border-red-300 bg-red-50' : 'border-slate-200'">
          <div class="text-xs font-semibold mb-2" :class="priceChangePreview.isLogicalError ? 'text-red-700' : 'text-slate-700'">
            {{ priceChangePreview.isLogicalError ? '逻辑错误' : '价格变化预览' }}
          </div>
          <div class="space-y-1.5 text-xs">
            <div class="flex justify-between">
              <span class="text-slate-600">目标价格：</span>
              <span class="font-semibold text-slate-900">${{ priceChangePreview.targetFormatted }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-600">当前价格：</span>
              <span class="font-semibold text-slate-900">${{ priceChangePreview.currentFormatted }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-600">变化幅度：</span>
              <span class="font-semibold" :class="priceChangePreview.percent >= 0 ? 'text-green-600' : 'text-red-600'">
                {{ priceChangePreview.percent >= 0 ? '+' : '' }}{{ priceChangePreview.percent }}%
                {{ priceChangePreview.direction === 'up' ? '↑' : '↓' }}
                ({{ priceChangePreview.directionText }} ${{ priceChangePreview.diffFormatted }})
              </span>
            </div>
            <div class="pt-2 border-t border-slate-200">
              <div :class="priceChangePreview.isLogicalError ? 'text-red-700' : 'text-slate-700'">
                <span class="font-medium">触发条件：</span>
                <span>{{ priceChangePreview.triggerDescription }}</span>
              </div>
            </div>

            <!-- 逻辑错误警告 -->
            <div v-if="priceChangePreview.isLogicalError" class="pt-2 border-t border-red-200">
              <div class="flex items-start gap-2 text-red-700">
                <svg class="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <div class="font-semibold">此条件永远无法触发！</div>
                  <div class="mt-1">{{ priceChangePreview.errorMessage }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 使用说明 -->
      <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div class="flex items-start gap-2">
          <svg class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div class="flex-1 text-sm text-blue-900">
            <div class="font-semibold mb-2">使用说明：</div>
            <ul class="space-y-1 text-xs">
              <li>• <strong>价格高于/低于：</strong>当价格达到目标值时触发一次通知</li>
              <li>• <strong>向上/向下突破：</strong>当价格穿越目标值时触发通知</li>
            </ul>
            <div class="mt-3 text-xs">
              <strong>示例：</strong>设置"向上突破"或"向下突破"关键价格位，突破时收到通知，提醒您关注市场变化
            </div>
          </div>
        </div>
        <div class="mt-3 pt-3 border-t border-blue-200">
          <p class="text-xs text-blue-900">
            <strong>注意：</strong>价格提醒只是通知工具，不提供交易建议。收到通知后，请结合市场情况自行判断操作。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      condition: 'above',
      target_price: ''
    })
  },
  currentPrice: {
    type: Number,
    default: null
  }
})

const emit = defineEmits(['update:modelValue'])

const config = reactive({
  condition: props.modelValue.condition || 'above',
  target_price: props.modelValue.target_price || ''
})

// 监听 props.modelValue 的变化，更新 config
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    config.condition = newValue.condition || 'above'
    config.target_price = newValue.target_price || ''
  }
}, { deep: true, immediate: true })

// 价格条件选项
const priceConditions = [
  { label: '价格高于', value: 'above' },
  { label: '价格低于', value: 'below' },
  { label: '向上突破', value: 'crosses_above' },
  { label: '向下突破', value: 'crosses_below' }
]

// 快捷百分比选项（从 old 文件复制）
const quickPercentages = [-20, -10, -5, 5, 10, 15, 20, 30, 50, 100]

// 格式化快捷价格（从 old 文件复制，修复小数位问题）
const formatQuickPrice = (currentPrice, percent) => {
  if (!currentPrice) return '0'
  const numPrice = typeof currentPrice === 'string' ? parseFloat(currentPrice) : currentPrice
  if (isNaN(numPrice)) return '0'
  const targetPrice = numPrice * (1 + percent / 100)

  // 根据价格大小决定小数位数
  if (targetPrice >= 1) {
    return targetPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  } else if (targetPrice >= 0.01) {
    return targetPrice.toFixed(4)
  } else {
    return targetPrice.toFixed(8)
  }
}

// 设置快捷价格（从 old 文件复制，修复小数位问题）
const setQuickPrice = (percent) => {
  if (!props.currentPrice) return
  const currentPrice = parseFloat(props.currentPrice)
  const targetPrice = currentPrice * (1 + percent / 100)

  // 根据价格大小决定小数位数
  if (targetPrice >= 1) {
    config.target_price = targetPrice.toFixed(2)
  } else if (targetPrice >= 0.01) {
    config.target_price = targetPrice.toFixed(4)
  } else {
    config.target_price = targetPrice.toFixed(8)
  }

  // 智能切换触发条件
  // 如果目标价格低于当前价格，自动切换到"价格低于"
  // 如果目标价格高于当前价格，自动切换到"价格高于"
  if (percent < 0) {
    config.condition = 'below'
  } else if (percent > 0) {
    config.condition = 'above'
  }
}

// 格式化价格
const formatPrice = (price) => {
  if (!price) return '0'
  if (price >= 1) {
    return parseFloat(price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  } else {
    return parseFloat(price).toFixed(8)
  }
}

// 价格变化预览（从 old 文件复制）
const priceChangePreview = computed(() => {
  if (!config.target_price || !props.currentPrice) {
    return null
  }

  const target = parseFloat(config.target_price)
  const current = parseFloat(props.currentPrice)

  if (isNaN(target) || isNaN(current) || current === 0) {
    return null
  }

  const diff = target - current
  const percent = ((diff / current) * 100).toFixed(2)
  const direction = diff > 0 ? 'up' : 'down'
  const directionText = diff > 0 ? '上涨' : '下跌'

  // 格式化价格（根据价格大小决定小数位数）
  const formatPriceForPreview = (price) => {
    if (price >= 1) {
      return price.toLocaleString('en-US', { maximumFractionDigits: 2 })
    } else if (price >= 0.01) {
      return price.toFixed(4)
    } else {
      return price.toFixed(8)
    }
  }

  // 触发条件描述
  let triggerDescription = ''
  const condition = config.condition
  const targetFormatted = formatPriceForPreview(target)

  // 检查逻辑错误（已移除验证，允许设置任何目标价格）
  let isLogicalError = false
  let errorMessage = ''

  if (condition === 'above') {
    triggerDescription = `当价格涨至 $${targetFormatted} 或以上时通知`
  } else if (condition === 'below') {
    triggerDescription = `当价格跌至 $${targetFormatted} 或以下时通知`
  } else if (condition === 'crosses_above') {
    triggerDescription = `当价格向上突破 $${targetFormatted} 时通知`
  } else if (condition === 'crosses_below') {
    triggerDescription = `当价格向下跌破 $${targetFormatted} 时通知`
  }

  return {
    target,
    current,
    diff: Math.abs(diff),
    percent: parseFloat(percent),
    direction,
    directionText,
    targetFormatted: formatPriceForPreview(target),
    currentFormatted: formatPriceForPreview(current),
    diffFormatted: formatPriceForPreview(Math.abs(diff)),
    triggerDescription,
    isLogicalError,
    errorMessage
  }
})

// 监听变化并发送给父组件
watch(config, () => {
  emit('update:modelValue', {
    condition: config.condition,
    target_price: config.target_price
  })
}, { deep: true })
</script>


