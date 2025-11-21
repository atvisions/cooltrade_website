<template>
  <div class="p-4 bg-white border border-slate-200 rounded-lg space-y-4">
    <!-- 标题 -->
    <div class="flex items-center gap-2">
      <svg class="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
      <h3 class="text-base font-semibold text-slate-900">指标信号配置</h3>
    </div>

    <!-- 指标类型选择 -->
    <div>
      <label class="block text-sm font-medium text-slate-700 mb-2">
        指标类型 <span class="text-red-500">*</span>
        <span class="text-xs text-slate-500 ml-2">选择用于生成信号的技术指标</span>
      </label>
      <div class="grid grid-cols-3 gap-3">
        <button
          v-for="indicator in availableIndicators"
          :key="indicator.value"
          type="button"
          @click="selectIndicator(indicator.value)"
          :class="[
            'py-3 px-4 text-sm font-medium rounded-lg transition-all border-2',
            config.indicator_type === indicator.value
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
          ]"
        >
          {{ indicator.name }}
        </button>
      </div>
    </div>

    <!-- 指标说明 -->
    <div v-if="config.indicator_type" class="p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <div class="flex items-start gap-2">
        <svg class="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-xs text-blue-700">{{ getIndicatorDescription(config.indicator_type) }}</p>
      </div>
    </div>

    <!-- 快捷参数 -->
    <div v-if="config.indicator_type">
      <label class="block text-sm font-medium text-slate-700 mb-2">
        快捷参数
        <span class="text-xs text-slate-500 ml-2">点击快速填充参数，可继续调整</span>
      </label>
      <div class="grid grid-cols-3 gap-3">
        <button
          v-for="preset in getIndicatorPresets(config.indicator_type)"
          :key="preset.label"
          type="button"
          @click="applyPreset(preset)"
          class="py-2 px-3 text-sm border-2 border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-center"
        >
          <div class="font-medium text-slate-900">{{ preset.label }}</div>
          <div class="text-xs text-slate-500 mt-0.5">{{ preset.desc }}</div>
        </button>
      </div>
    </div>

    <!-- RSI 参数 -->
    <div v-if="config.indicator_type === 'rsi'" class="grid grid-cols-3 gap-4">
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-2">周期</label>
        <input type="number" v-model.number="config.params.period" class="w-full px-3 py-2 border border-slate-300 rounded-lg" />
        <p class="text-xs text-slate-500 mt-1">计算窗口</p>
      </div>
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-2">超买值</label>
        <input type="number" v-model.number="config.params.overbought" class="w-full px-3 py-2 border border-slate-300 rounded-lg" />
        <p class="text-xs text-slate-500 mt-1">卖出信号</p>
      </div>
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-2">超卖值</label>
        <input type="number" v-model.number="config.params.oversold" class="w-full px-3 py-2 border border-slate-300 rounded-lg" />
        <p class="text-xs text-slate-500 mt-1">买入信号</p>
      </div>
    </div>

    <!-- MACD 参数 -->
    <div v-else-if="config.indicator_type === 'macd'" class="grid grid-cols-3 gap-4">
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-2">快线周期</label>
        <input type="number" v-model.number="config.params.fast" class="w-full px-3 py-2 border border-slate-300 rounded-lg" />
      </div>
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-2">慢线周期</label>
        <input type="number" v-model.number="config.params.slow" class="w-full px-3 py-2 border border-slate-300 rounded-lg" />
      </div>
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-2">信号线周期</label>
        <input type="number" v-model.number="config.params.signal" class="w-full px-3 py-2 border border-slate-300 rounded-lg" />
      </div>
    </div>

    <!-- MA Cross 参数 -->
    <div v-else-if="config.indicator_type === 'ma_cross'" class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-2">快线周期</label>
        <input type="number" v-model.number="config.params.fast" class="w-full px-3 py-2 border border-slate-300 rounded-lg" />
      </div>
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-2">慢线周期</label>
        <input type="number" v-model.number="config.params.slow" class="w-full px-3 py-2 border border-slate-300 rounded-lg" />
      </div>
    </div>

    <!-- EMA Cross 参数 -->
    <div v-else-if="config.indicator_type === 'ema_cross'" class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-2">快线周期</label>
        <input type="number" v-model.number="config.params.fast" class="w-full px-3 py-2 border border-slate-300 rounded-lg" />
      </div>
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-2">慢线周期</label>
        <input type="number" v-model.number="config.params.slow" class="w-full px-3 py-2 border border-slate-300 rounded-lg" />
      </div>
    </div>

    <!-- Bollinger Bands 参数 -->
    <div v-else-if="config.indicator_type === 'bollinger'" class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-2">周期</label>
        <input type="number" v-model.number="config.params.period" class="w-full px-3 py-2 border border-slate-300 rounded-lg" />
      </div>
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-2">标准差倍数</label>
        <input type="number" v-model.number="config.params.std_dev" step="0.1" class="w-full px-3 py-2 border border-slate-300 rounded-lg" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      indicator_type: '',
      params: {}
    })
  }
})

const emit = defineEmits(['update:modelValue'])

const config = reactive({
  indicator_type: props.modelValue.indicator_type || '',
  params: props.modelValue.params || {}
})

// 可用指标列表
const availableIndicators = [
  { value: 'rsi', name: 'RSI' },
  { value: 'macd', name: 'MACD' },
  { value: 'ma_cross', name: 'MA交叉' },
  { value: 'ema_cross', name: 'EMA交叉' },
  { value: 'bollinger', name: '布林带' },
  { value: 'kdj', name: 'KDJ' }
]

// 指标说明
const descriptions = {
  rsi: 'RSI（相对强弱指标）衡量价格动能，判断超买超卖状态。RSI > 70 为超买（可能回调），RSI < 30 为超卖（可能反弹）。',
  macd: 'MACD（指数平滑异同移动平均线）通过快慢线交叉判断趋势变化。快线上穿慢线为买入信号，下穿为卖出信号。',
  ma_cross: 'MA Cross（移动均线交叉）短期均线上穿长期均线为金叉（买入），下穿为死叉（卖出）。',
  ema_cross: 'EMA Cross（指数均线交叉）与MA类似，但对近期价格更敏感，反应更快。',
  bollinger: 'Bollinger Bands（布林带）价格触及上轨为超买，触及下轨为超卖。带宽收窄预示突破。',
  kdj: 'KDJ 指标结合动量、强弱和移动平均的概念，K值和D值交叉产生买卖信号。'
}

// 快捷参数预设
const presets = {
  rsi: [
    { label: '标准', desc: '14/70/30', params: { period: 14, overbought: 70, oversold: 30 } },
    { label: '激进', desc: '14/80/20', params: { period: 14, overbought: 80, oversold: 20 } },
    { label: '保守', desc: '14/65/35', params: { period: 14, overbought: 65, oversold: 35 } }
  ],
  macd: [
    { label: '标准', desc: '12/26/9', params: { fast: 12, slow: 26, signal: 9 } },
    { label: '快速', desc: '6/13/5', params: { fast: 6, slow: 13, signal: 5 } },
    { label: '慢速', desc: '19/39/9', params: { fast: 19, slow: 39, signal: 9 } }
  ],
  ma_cross: [
    { label: '标准', desc: '7/25', params: { fast: 7, slow: 25 } },
    { label: '短期', desc: '5/10', params: { fast: 5, slow: 10 } },
    { label: '长期', desc: '50/200', params: { fast: 50, slow: 200 } }
  ],
  ema_cross: [
    { label: '标准', desc: '12/26', params: { fast: 12, slow: 26 } },
    { label: '短期', desc: '5/13', params: { fast: 5, slow: 13 } },
    { label: '长期', desc: '50/200', params: { fast: 50, slow: 200 } }
  ],
  bollinger: [
    { label: '标准', desc: '20/2.0', params: { period: 20, std_dev: 2.0 } },
    { label: '敏感', desc: '20/1.5', params: { period: 20, std_dev: 1.5 } },
    { label: '保守', desc: '20/2.5', params: { period: 20, std_dev: 2.5 } }
  ],
  kdj: [
    { label: '标准', desc: '9/3/3', params: { period: 9, k: 3, d: 3 } }
  ]
}

// 默认参数
const defaultParams = {
  rsi: { period: 14, overbought: 70, oversold: 30 },
  macd: { fast: 12, slow: 26, signal: 9 },
  ma_cross: { fast: 7, slow: 25 },
  ema_cross: { fast: 12, slow: 26 },
  bollinger: { period: 20, std_dev: 2.0 },
  kdj: { period: 9, k: 3, d: 3 }
}

// 选择指标
const selectIndicator = (type) => {
  config.indicator_type = type
  config.params = { ...defaultParams[type] }
}

// 获取指标说明
const getIndicatorDescription = (type) => {
  return descriptions[type] || ''
}

// 获取快捷参数
const getIndicatorPresets = (type) => {
  return presets[type] || []
}

// 应用快捷参数
const applyPreset = (preset) => {
  config.params = { ...preset.params }
}

// 监听变化并发送给父组件
watch(config, () => {
  emit('update:modelValue', {
    indicator_type: config.indicator_type,
    params: config.params
  })
}, { deep: true })


