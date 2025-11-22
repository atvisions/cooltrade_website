<template>
  <div>
    <Card variant="default" class="mb-6">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div>
          <h2 class="text-lg font-semibold text-slate-900">成交量/持仓提醒设置</h2>
          <p class="text-sm text-slate-500">监控成交量异动，及时发现市场异动</p>
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
              <p class="font-medium text-slate-700 mb-1">成交量异动提醒</p>
              <p>监控成交量突然放大或缩小，帮助识别市场情绪变化。成交量放大通常意味着趋势加强，缩小则可能预示趋势减弱。</p>
            </div>
          </div>
        </div>

        <!-- 快捷参数 -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">快捷参数</label>
          <div class="grid grid-cols-3 gap-2">
            <button
              type="button"
              @click="setPreset('sensitive')"
              class="px-3 py-2 text-xs border-2 border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <div class="font-semibold text-slate-900">敏感</div>
              <div class="text-slate-500">1.5倍/20期</div>
              <div class="text-slate-400">快速响应</div>
            </button>
            <button
              type="button"
              @click="setPreset('standard')"
              class="px-3 py-2 text-xs border-2 border-slate-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all"
            >
              <div class="font-semibold text-slate-900">标准</div>
              <div class="text-slate-500">2.0倍/20期</div>
              <div class="text-slate-400">平衡稳定</div>
            </button>
            <button
              type="button"
              @click="setPreset('conservative')"
              class="px-3 py-2 text-xs border-2 border-slate-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all"
            >
              <div class="font-semibold text-slate-900">保守</div>
              <div class="text-slate-500">3.0倍/20期</div>
              <div class="text-slate-400">减少噪音</div>
            </button>
          </div>
        </div>

        <!-- 参数输入 -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">
              成交量倍数
              <span class="text-xs text-slate-500 block">相对平均值</span>
            </label>
            <Input
              :model-value="config.volume_multiplier"
              @update:model-value="updateConfig('volume_multiplier', $event)"
              type="number"
              step="0.1"
              placeholder="2.0"
            />
            <p class="text-xs text-slate-500 mt-1">当前成交量超过平均值的倍数时触发提醒</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">
              平均周期
              <span class="text-xs text-slate-500 block">K线数量</span>
            </label>
            <Input
              :model-value="config.volume_period"
              @update:model-value="updateConfig('volume_period', $event)"
              type="number"
              placeholder="20"
            />
            <p class="text-xs text-slate-500 mt-1">用于计算平均成交量的K线数量</p>
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
      volume_multiplier: 2.0,
      volume_period: 20
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
    sensitive: { volume_multiplier: 1.5, volume_period: 20 },
    standard: { volume_multiplier: 2.0, volume_period: 20 },
    conservative: { volume_multiplier: 3.0, volume_period: 20 }
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

