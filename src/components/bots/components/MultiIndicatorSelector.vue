<template>
  <div class="multi-indicator-selector">
    <!-- 标题 -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <div>
          <div class="text-lg font-semibold text-slate-900">趋势指标（可多选）</div>
          <div class="text-xs text-slate-500">选择一个或多个指标，所有指标都满足时才触发信号</div>
        </div>
      </div>

      <!-- 快捷配置按钮 -->
      <div class="relative" ref="presetMenuContainer">
        <button
          type="button"
          @click.stop="showPresetMenu = !showPresetMenu"
          class="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all shadow-sm hover:shadow-md flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          快捷配置
        </button>

        <!-- 下拉菜单 -->
        <transition
          enter-active-class="transition ease-out duration-100"
          enter-from-class="transform opacity-0 scale-95"
          enter-to-class="transform opacity-100 scale-100"
          leave-active-class="transition ease-in duration-75"
          leave-from-class="transform opacity-100 scale-100"
          leave-to-class="transform opacity-0 scale-95"
        >
          <div
            v-if="showPresetMenu"
            class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-200 z-50 overflow-hidden"
          >
            <div class="p-2 space-y-1">
              <button
                v-for="preset in presetConfigs"
                :key="preset.name"
                type="button"
                @click="applyPreset(preset)"
                class="w-full text-left px-3 py-2.5 rounded-md hover:bg-slate-50 transition-colors group"
              >
                <div class="flex items-start gap-2">
                  <div class="flex-shrink-0 mt-0.5">
                    <div class="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                         :class="preset.iconBg">
                      {{ preset.icon }}
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-semibold text-slate-900 mb-0.5">
                      {{ preset.name }}
                    </div>
                    <div class="text-xs text-slate-600 mb-1">
                      {{ preset.description }}
                    </div>
                    <div class="text-xs text-blue-600 font-medium">
                      {{ preset.indicators.length }} 个指标
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <!-- 指标列表 -->
    <div class="space-y-3">
      <div
        v-for="indicator in availableIndicators"
        :key="indicator.value"
        class="indicator-card border-2 rounded-lg transition-all"
        :class="[
          isIndicatorSelected(indicator.value)
            ? 'border-blue-500 bg-blue-50'
            : 'border-slate-200 bg-white hover:border-slate-300'
        ]"
      >
        <!-- 指标头部：图标 + 名称 + 描述 + 开关 -->
        <div class="flex items-center gap-4 p-4 cursor-pointer" @click="toggleIndicator(indicator.value)">
          <!-- 图标 -->
          <div class="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
               :class="isIndicatorSelected(indicator.value) ? 'bg-blue-100' : 'bg-slate-100'">
            <component :is="getIndicatorIcon(indicator.value)" 
                       class="w-6 h-6"
                       :class="isIndicatorSelected(indicator.value) ? 'text-blue-600' : 'text-slate-600'" />
          </div>

          <!-- 名称和描述 -->
          <div class="flex-1 min-w-0">
            <div class="text-sm font-semibold text-slate-900 mb-0.5">
              {{ indicator.name }}
            </div>
            <div class="text-xs text-slate-600 mb-1">
              {{ indicator.description }}
            </div>
            <div class="text-xs text-blue-600 font-medium">
              {{ indicator.usage }}
            </div>
          </div>

          <!-- 开关 -->
          <div class="flex-shrink-0">
            <button
              type="button"
              @click.stop="toggleIndicator(indicator.value)"
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              :class="isIndicatorSelected(indicator.value) ? 'bg-blue-600' : 'bg-slate-300'"
            >
              <span
                class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                :class="isIndicatorSelected(indicator.value) ? 'translate-x-6' : 'translate-x-1'"
              />
            </button>
          </div>
        </div>

        <!-- 参数配置（展开时显示） -->
        <transition name="expand">
          <div v-if="isIndicatorSelected(indicator.value)" class="border-t border-slate-200 p-4 bg-slate-50 rounded-b-lg">
            <div class="text-xs font-semibold text-slate-700 mb-3">📊 {{ indicator.params }}</div>

            <!-- 动态参数表单 -->
            <component
              :is="getIndicatorParamsComponent(indicator.value)"
              :modelValue="getIndicatorParams(indicator.value)"
              @update:modelValue="updateIndicatorParams(indicator.value, $event)"
            />
          </div>
        </transition>
      </div>
    </div>

    <!-- 已选指标摘要 -->
    <div v-if="selectedIndicators.length > 0" class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div class="text-sm font-semibold text-blue-900 mb-2">
        ✅ 已选择 {{ selectedIndicators.length }} 个指标
      </div>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="value in selectedIndicators"
          :key="value"
          class="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full"
        >
          {{ getIndicatorName(value) }}
          <button
            type="button"
            @click="removeIndicator(value)"
            class="hover:text-blue-900"
          >
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </span>
      </div>
      <div class="text-xs text-blue-700 mt-2">
        💡 所有指标都满足时才会触发交易信号
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import MAParamsForm from './indicator-params/MAParamsForm.vue'
import EMAParamsForm from './indicator-params/EMAParamsForm.vue'
import MACDParamsForm from './indicator-params/MACDParamsForm.vue'
import RSIParamsForm from './indicator-params/RSIParamsForm.vue'
import BollingerParamsForm from './indicator-params/BollingerParamsForm.vue'
import ADXParamsForm from './indicator-params/ADXParamsForm.vue'
import SuperTrendParamsForm from './indicator-params/SuperTrendParamsForm.vue'
import VolumeParamsForm from './indicator-params/VolumeParamsForm.vue'

// 图标组件
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  SignalIcon,
  ScaleIcon,
  BoltIcon,
  FireIcon,
  RocketLaunchIcon,
  ChartPieIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  availableIndicators: {
    type: Array,
    required: true
  },
  indicatorParams: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue', 'update:indicatorParams'])

const selectedIndicators = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 快捷配置菜单状态
const showPresetMenu = ref(false)
const presetMenuContainer = ref(null)

// 点击外部关闭菜单
const handleClickOutside = (event) => {
  if (presetMenuContainer.value && !presetMenuContainer.value.contains(event.target)) {
    showPresetMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// 快捷配置预设
const presetConfigs = ref([
  {
    name: '① 稳健型',
    icon: '🛡️',
    iconBg: 'bg-green-100',
    description: '最适合新手，胜率高，只在确认趋势后入场',
    indicators: ['ma_crossover', 'macd', 'adx', 'volume'],
    params: {
      ma_crossover: { fast_period: 25, slow_period: 99 },
      macd: { fast_period: 12, slow_period: 26, signal_period: 9 },
      adx: { period: 14, threshold: 20 },
      volume: { period: 20, multiplier: 1.5 }
    }
  },
  {
    name: '② 平衡型',
    icon: '⚖️',
    iconBg: 'bg-blue-100',
    description: '默认推荐，趋势刚出现就上车，反应速度快',
    indicators: ['ema_crossover', 'macd', 'rsi'],
    params: {
      ema_crossover: { fast_period: 12, slow_period: 26 },
      macd: { fast_period: 12, slow_period: 26, signal_period: 9 },
      rsi: { period: 14, oversold: 40, overbought: 60 }
    }
  },
  {
    name: '③ 激进型',
    icon: '🚀',
    iconBg: 'bg-orange-100',
    description: '敏捷抓趋势初期，最早上车，获利空间大',
    indicators: ['ema_crossover', 'rsi', 'supertrend'],
    params: {
      ema_crossover: { fast_period: 9, slow_period: 21 },
      rsi: { period: 14, oversold: 40, overbought: 70 },
      supertrend: { period: 10, multiplier: 3.0 }
    }
  },
  {
    name: '④ 突破型',
    icon: '💥',
    iconBg: 'bg-purple-100',
    description: '适合 BTC/ETH 高波动，吃大波动行情',
    indicators: ['bollinger', 'volume', 'adx'],
    params: {
      bollinger: { period: 20, std_dev: 2.0 },
      volume: { period: 20, multiplier: 1.5 },
      adx: { period: 14, threshold: 25 }
    }
  },
  {
    name: '⑤ 专业版',
    icon: '🎯',
    iconBg: 'bg-red-100',
    description: '多指标模型，最稳+最完整，趋势确认最严谨',
    indicators: ['ma_crossover', 'ema_crossover', 'macd', 'adx', 'volume', 'rsi', 'supertrend'],
    params: {
      ma_crossover: { fast_period: 25, slow_period: 99 },
      ema_crossover: { fast_period: 12, slow_period: 26 },
      macd: { fast_period: 12, slow_period: 26, signal_period: 9 },
      adx: { period: 14, threshold: 20 },
      volume: { period: 20, multiplier: 1.5 },
      rsi: { period: 14, oversold: 30, overbought: 70 },
      supertrend: { period: 10, multiplier: 3.0 }
    }
  }
])

// 应用快捷配置
const applyPreset = (preset) => {
  console.log('📋 应用快捷配置:', preset.name)

  // 更新选中的指标
  selectedIndicators.value = [...preset.indicators]

  // 更新指标参数
  const newParams = { ...props.indicatorParams }
  Object.keys(preset.params).forEach(indicator => {
    newParams[indicator] = { ...preset.params[indicator] }
  })
  emit('update:indicatorParams', newParams)

  // 关闭菜单
  showPresetMenu.value = false

  console.log('✅ 快捷配置已应用:', {
    indicators: selectedIndicators.value,
    params: newParams
  })
}

const isIndicatorSelected = (value) => {
  return selectedIndicators.value.includes(value)
}

const toggleIndicator = (value) => {
  const index = selectedIndicators.value.indexOf(value)
  if (index > -1) {
    // 移除
    const newValue = [...selectedIndicators.value]
    newValue.splice(index, 1)
    selectedIndicators.value = newValue
  } else {
    // 添加
    selectedIndicators.value = [...selectedIndicators.value, value]
  }
}

const removeIndicator = (value) => {
  const index = selectedIndicators.value.indexOf(value)
  if (index > -1) {
    const newValue = [...selectedIndicators.value]
    newValue.splice(index, 1)
    selectedIndicators.value = newValue
  }
}

const getIndicatorName = (value) => {
  const indicator = props.availableIndicators.find(i => i.value === value)
  return indicator?.name || value
}

const getIndicatorIcon = (value) => {
  const iconMap = {
    'ma_crossover': ArrowTrendingUpIcon,
    'ema_crossover': SignalIcon,
    'macd': ChartBarIcon,
    'rsi': ScaleIcon,
    'bollinger': BoltIcon,
    'adx': FireIcon,
    'supertrend': RocketLaunchIcon,
    'volume': ChartPieIcon
  }
  return iconMap[value] || ChartBarIcon
}

const getIndicatorParamsComponent = (value) => {
  const componentMap = {
    'ma_crossover': MAParamsForm,
    'ema_crossover': EMAParamsForm,
    'macd': MACDParamsForm,
    'rsi': RSIParamsForm,
    'bollinger': BollingerParamsForm,
    'adx': ADXParamsForm,
    'supertrend': SuperTrendParamsForm,
    'volume': VolumeParamsForm
  }
  return componentMap[value] || 'div'
}

const getIndicatorParams = (value) => {
  return props.indicatorParams[value] || {}
}

const updateIndicatorParams = (indicator, params) => {
  emit('update:indicatorParams', {
    ...props.indicatorParams,
    [indicator]: params
  })
}
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  max-height: 500px;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>

