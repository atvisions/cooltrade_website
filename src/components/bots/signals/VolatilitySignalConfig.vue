<template>
  <div>
    <Card variant="default" class="mb-6">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <div>
          <h2 class="text-lg font-semibold text-slate-900">波动性提醒设置</h2>
          <p class="text-sm text-slate-500">监控价格波动幅度，及时发现市场异常波动</p>
        </div>
      </div>

      <div class="space-y-4">
        <!-- 功能描述 -->
        <div class="bg-white rounded-lg p-3 text-xs text-slate-600 border border-slate-200">
          <div class="flex items-start gap-2">
            <svg class="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p class="font-medium text-slate-700 mb-1">波动性监控提醒</p>
              <p>监控价格在指定时间内的波动幅度，当波动超过设定阈值时触发提醒。适用于捕捉市场剧烈波动时机。</p>
            </div>
          </div>
        </div>

        <!-- 快捷参数 -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">快捷参数</label>
          <div class="grid grid-cols-3 gap-2">
            <button
              type="button"
              @click="setPreset('low')"
              class="px-3 py-2 text-xs border-2 border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <div class="font-semibold text-slate-900">低波动</div>
              <div class="text-slate-500">3%/1小时</div>
              <div class="text-slate-400">稳定市场</div>
            </button>
            <button
              type="button"
              @click="setPreset('medium')"
              class="px-3 py-2 text-xs border-2 border-slate-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all"
            >
              <div class="font-semibold text-slate-900">中等波动</div>
              <div class="text-slate-500">5%/1小时</div>
              <div class="text-slate-400">常规市场</div>
            </button>
            <button
              type="button"
              @click="setPreset('high')"
              class="px-3 py-2 text-xs border-2 border-slate-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all"
            >
              <div class="font-semibold text-slate-900">高波动</div>
              <div class="text-slate-500">10%/1小时</div>
              <div class="text-slate-400">剧烈波动</div>
            </button>
          </div>
        </div>

        <!-- 参数输入 -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">
              波动阈值
              <span class="text-xs text-slate-500 block">百分比</span>
            </label>
            <Input
              :model-value="config.volatility_threshold"
              @update:model-value="updateConfig('volatility_threshold', $event)"
              type="number"
              step="0.1"
              placeholder="5.0"
            />
            <p class="text-xs text-slate-500 mt-1">价格波动超过此百分比时触发提醒</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">
              监控周期
              <span class="text-xs text-slate-500 block">K线数量</span>
            </label>
            <Input
              :model-value="config.volatility_period"
              @update:model-value="updateConfig('volatility_period', $event)"
              type="number"
              placeholder="20"
            />
            <p class="text-xs text-slate-500 mt-1">计算波动幅度的K线数量</p>
          </div>
        </div>
      </div>
    </Card>

    <!-- 时间周期配置 -->
    <TimeframesConfig
      :timeframes-config="timeframesConfig"
      @update:primary="updatePrimaryTimeframe"
      @toggle-confirm="toggleConfirmTimeframe"
      @update:require-all-confirm="updateRequireAllConfirm"
      @update:min-confirm-count="updateMinConfirmCount"
    />
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'
import Card from '../../common/ui/Card.vue'
import Input from '../../common/ui/Input.vue'
import TimeframesConfig from './TimeframesConfig.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      volatility_threshold: 5.0,
      volatility_period: 20
    })
  },
  timeframesConfig: {
    type: Object,
    default: () => ({
      primary: '1h',
      confirm: [],
      require_all_confirm: false,
      min_confirm_count: 1
    })
  }
})

const emit = defineEmits(['update:modelValue', 'update:timeframesConfig'])

const config = reactive({ ...props.modelValue })
const timeframesConfig = reactive({ ...props.timeframesConfig })

// 监听配置变化，同步到父组件
watch(config, (newConfig) => {
  emit('update:modelValue', { ...newConfig })
}, { deep: true })

watch(timeframesConfig, (newConfig) => {
  emit('update:timeframesConfig', { ...newConfig })
}, { deep: true })

// 预设
const setPreset = (preset) => {
  const presets = {
    low: { volatility_threshold: 3.0, volatility_period: 20 },
    medium: { volatility_threshold: 5.0, volatility_period: 20 },
    high: { volatility_threshold: 10.0, volatility_period: 20 }
  }
  Object.assign(config, presets[preset])
}

// 更新配置
const updateConfig = (key, value) => {
  config[key] = Number(value)
}

// 时间周期配置
const updatePrimaryTimeframe = (value) => {
  timeframesConfig.primary = value
}

const toggleConfirmTimeframe = (value) => {
  const index = timeframesConfig.confirm.indexOf(value)
  if (index > -1) {
    timeframesConfig.confirm.splice(index, 1)
  } else {
    timeframesConfig.confirm.push(value)
  }
}

const updateRequireAllConfirm = (value) => {
  timeframesConfig.require_all_confirm = value
}

const updateMinConfirmCount = (value) => {
  timeframesConfig.min_confirm_count = Number(value)
}
</script>
