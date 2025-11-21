<template>
  <Card variant="default" class="mb-6">
    <div class="flex items-center gap-3 mb-6">
      <div class="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
        <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
      </div>
      <div>
        <h2 class="text-lg font-semibold text-slate-900">指标信号提醒设置</h2>
        <p class="text-sm text-slate-500">选择用于生成信号的技术指标</p>
      </div>
    </div>

    <!-- 指标类型选择 -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-slate-700 mb-3">
        指标类型
        <span class="text-xs text-slate-500 block mt-1">选择用于生成信号的技术指标</span>
      </label>
      <div class="grid grid-cols-4 gap-2">
        <button
          v-for="indicator in indicators"
          :key="indicator.value"
          type="button"
          @click="handleIndicatorTypeChange(indicator.value)"
          :class="[
            'p-3 border-2 rounded-lg text-sm font-medium transition-all',
            indicatorType === indicator.value
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
          ]"
        >
          {{ indicator.label }}
        </button>
      </div>
    </div>

    <!-- RSI 参数 -->
    <div v-if="indicatorType === 'rsi'" class="space-y-4">
      <!-- 功能描述 -->
      <div class="bg-white rounded-lg p-3 text-xs text-slate-600 border border-slate-200">
        <div class="flex items-start gap-2">
          <svg class="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p class="font-medium text-slate-700 mb-1">RSI（相对强弱指标）</p>
            <p>衡量价格涨跌动能，判断超买超卖状态。RSI > 70 为超买（可能回调），RSI < 30 为超卖（可能反弹）。</p>
          </div>
        </div>
      </div>

      <!-- 快捷参数 -->
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-2">快捷参数</label>
        <div class="grid grid-cols-3 gap-2">
          <button
            type="button"
            @click="setRsiPreset('standard')"
            class="px-3 py-2 text-xs border-2 border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
          >
            <div class="font-semibold text-slate-900">标准</div>
            <div class="text-slate-500">14/70/30</div>
            <div class="text-slate-400">常规交易</div>
          </button>
          <button
            type="button"
            @click="setRsiPreset('aggressive')"
            class="px-3 py-2 text-xs border-2 border-slate-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all"
          >
            <div class="font-semibold text-slate-900">激进</div>
            <div class="text-slate-500">14/80/20</div>
            <div class="text-slate-400">高频交易</div>
          </button>
          <button
            type="button"
            @click="setRsiPreset('conservative')"
            class="px-3 py-2 text-xs border-2 border-slate-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all"
          >
            <div class="font-semibold text-slate-900">保守</div>
            <div class="text-slate-500">14/65/35</div>
            <div class="text-slate-400">稳健交易</div>
          </button>
        </div>
      </div>

      <!-- 参数输入 -->
      <div class="grid grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">
            周期
            <span class="text-xs text-slate-500 block">计算窗口</span>
          </label>
          <Input
            :model-value="rsiConfig.period"
            @update:model-value="updateRsiConfig('period', $event)"
            type="number"
            placeholder="14"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">
            超买阈值
            <span class="text-xs text-slate-500 block">卖出信号</span>
          </label>
          <Input
            :model-value="rsiConfig.overbought"
            @update:model-value="updateRsiConfig('overbought', $event)"
            type="number"
            placeholder="70"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">
            超卖阈值
            <span class="text-xs text-slate-500 block">买入信号</span>
          </label>
          <Input
            :model-value="rsiConfig.oversold"
            @update:model-value="updateRsiConfig('oversold', $event)"
            type="number"
            placeholder="30"
          />
        </div>
      </div>
    </div>

    <!-- MACD 参数 -->
    <div v-if="indicatorType === 'macd'" class="space-y-4">
      <!-- 功能描述 -->
      <div class="bg-white rounded-lg p-3 text-xs text-slate-600 border border-slate-200">
        <div class="flex items-start gap-2">
          <svg class="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p class="font-medium text-slate-700 mb-1">MACD（指数平滑异同移动平均线）</p>
            <p>通过快慢均线的交叉判断趋势变化。MACD 线上穿信号线为金叉（买入），下穿为死叉（卖出）。柱状图越大信号越强。</p>
          </div>
        </div>
      </div>

      <!-- 快捷参数 -->
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-2">快捷参数</label>
        <div class="grid grid-cols-3 gap-2">
          <button
            type="button"
            @click="setMacdPreset('standard')"
            class="px-3 py-2 text-xs border-2 border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
          >
            <div class="font-semibold text-slate-900">标准</div>
            <div class="text-slate-500">12/26/9</div>
            <div class="text-slate-400">适合日线</div>
          </button>
          <button
            type="button"
            @click="setMacdPreset('fast')"
            class="px-3 py-2 text-xs border-2 border-slate-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all"
          >
            <div class="font-semibold text-slate-900">快速</div>
            <div class="text-slate-500">5/13/5</div>
            <div class="text-slate-400">适合短线</div>
          </button>
          <button
            type="button"
            @click="setMacdPreset('slow')"
            class="px-3 py-2 text-xs border-2 border-slate-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all"
          >
            <div class="font-semibold text-slate-900">慢速</div>
            <div class="text-slate-500">19/39/9</div>
            <div class="text-slate-400">适合长线</div>
          </button>
        </div>
      </div>

      <!-- 参数输入 -->
      <div class="grid grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">
            快线周期
            <span class="text-xs text-slate-500 block">短期EMA</span>
          </label>
          <Input
            :model-value="macdConfig.fast"
            @update:model-value="updateMacdConfig('fast', $event)"
            type="number"
            placeholder="12"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">
            慢线周期
            <span class="text-xs text-slate-500 block">长期EMA</span>
          </label>
          <Input
            :model-value="macdConfig.slow"
            @update:model-value="updateMacdConfig('slow', $event)"
            type="number"
            placeholder="26"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">
            信号线周期
            <span class="text-xs text-slate-500 block">MACD平滑</span>
          </label>
          <Input
            :model-value="macdConfig.signal"
            @update:model-value="updateMacdConfig('signal', $event)"
            type="number"
            placeholder="9"
          />
        </div>
      </div>
    </div>

    <!-- MA交叉 参数 -->
    <div v-if="indicatorType === 'ma_crossover'" class="space-y-4">
      <!-- 功能描述 -->
      <div class="bg-white rounded-lg p-3 text-xs text-slate-600 border border-slate-200">
        <div class="flex items-start gap-2">
          <svg class="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p class="font-medium text-slate-700 mb-1">MA交叉（移动平均线交叉）</p>
            <p>通过快慢均线的交叉判断趋势转折。快线上穿慢线为金叉（买入），下穿为死叉（卖出）。交叉幅度越大信号越强。</p>
          </div>
        </div>
      </div>

      <!-- 快捷参数 -->
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-2">快捷参数</label>
        <div class="grid grid-cols-3 gap-2">
          <button
            type="button"
            @click="setMaCrossPreset('short')"
            class="px-3 py-2 text-xs border-2 border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
          >
            <div class="font-semibold text-slate-900">短线</div>
            <div class="text-slate-500">7/25</div>
            <div class="text-slate-400">快速反应</div>
          </button>
          <button
            type="button"
            @click="setMaCrossPreset('medium')"
            class="px-3 py-2 text-xs border-2 border-slate-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all"
          >
            <div class="font-semibold text-slate-900">中线</div>
            <div class="text-slate-500">20/50</div>
            <div class="text-slate-400">平衡稳定</div>
          </button>
          <button
            type="button"
            @click="setMaCrossPreset('long')"
            class="px-3 py-2 text-xs border-2 border-slate-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all"
          >
            <div class="font-semibold text-slate-900">长线</div>
            <div class="text-slate-500">50/200</div>
            <div class="text-slate-400">黄金交叉</div>
          </button>
        </div>
      </div>

      <!-- 参数输入 -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">
            快线周期
            <span class="text-xs text-slate-500 block">短期均线</span>
          </label>
          <Input
            :model-value="maCrossConfig.fast"
            @update:model-value="updateMaCrossConfig('fast', $event)"
            type="number"
            placeholder="7"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">
            慢线周期
            <span class="text-xs text-slate-500 block">长期均线</span>
          </label>
          <Input
            :model-value="maCrossConfig.slow"
            @update:model-value="updateMaCrossConfig('slow', $event)"
            type="number"
            placeholder="25"
          />
        </div>
      </div>
    </div>

    <!-- ATR 参数 -->
    <div v-if="indicatorType === 'atr'" class="space-y-4">
      <!-- 功能描述 -->
      <div class="bg-white rounded-lg p-3 text-xs text-slate-600 border border-slate-200">
        <div class="flex items-start gap-2">
          <svg class="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p class="font-medium text-slate-700 mb-1">ATR（平均真实波幅）</p>
            <p>衡量市场波动性的指标。ATR 值越大表示波动越剧烈，适合设置更宽的止损；ATR 值越小表示波动越平稳。</p>
          </div>
        </div>
      </div>

      <!-- 快捷参数 -->
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-2">快捷参数</label>
        <div class="grid grid-cols-3 gap-2">
          <button
            type="button"
            @click="setAtrPreset('tight')"
            class="px-3 py-2 text-xs border-2 border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
          >
            <div class="font-semibold text-slate-900">紧密</div>
            <div class="text-slate-500">14/1.5</div>
            <div class="text-slate-400">短线交易</div>
          </button>
          <button
            type="button"
            @click="setAtrPreset('standard')"
            class="px-3 py-2 text-xs border-2 border-slate-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all"
          >
            <div class="font-semibold text-slate-900">标准</div>
            <div class="text-slate-500">14/2.0</div>
            <div class="text-slate-400">平衡稳定</div>
          </button>
          <button
            type="button"
            @click="setAtrPreset('loose')"
            class="px-3 py-2 text-xs border-2 border-slate-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all"
          >
            <div class="font-semibold text-slate-900">宽松</div>
            <div class="text-slate-500">14/3.0</div>
            <div class="text-slate-400">长线持有</div>
          </button>
        </div>
      </div>

      <!-- 参数输入 -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">
            ATR 周期
            <span class="text-xs text-slate-500 block">计算窗口</span>
          </label>
          <Input
            :model-value="atrConfig.period"
            @update:model-value="updateAtrConfig('period', $event)"
            type="number"
            placeholder="14"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">
            ATR 倍数
            <span class="text-xs text-slate-500 block">波动倍数</span>
          </label>
          <Input
            :model-value="atrConfig.multiplier"
            @update:model-value="updateAtrConfig('multiplier', $event)"
            type="number"
            step="0.1"
            placeholder="2.0"
          />
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup>
import { ref } from 'vue'
import Card from '../../common/ui/Card.vue'
import Input from '../../common/ui/Input.vue'

const props = defineProps({
  indicatorType: {
    type: String,
    default: 'rsi'
  },
  rsiConfig: {
    type: Object,
    default: () => ({
      period: 14,
      overbought: 70,
      oversold: 30
    })
  },
  macdConfig: {
    type: Object,
    default: () => ({
      fast: 12,
      slow: 26,
      signal: 9
    })
  },
  maCrossConfig: {
    type: Object,
    default: () => ({
      fast: 7,
      slow: 25
    })
  },
  atrConfig: {
    type: Object,
    default: () => ({
      period: 14,
      multiplier: 2.0
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

const emit = defineEmits([
  'update:indicatorType',
  'update:rsiConfig',
  'update:macdConfig',
  'update:maCrossConfig',
  'update:atrConfig',
  'update:timeframesConfig'
])

const indicators = [
  { label: 'RSI', value: 'rsi' },
  { label: 'MACD', value: 'macd' },
  { label: 'MA交叉', value: 'ma_crossover' },
  { label: 'ATR', value: 'atr' }
]

const timeframes = [
  { value: '1m', label: '1分钟' },
  { value: '5m', label: '5分钟' },
  { value: '15m', label: '15分钟' },
  { value: '30m', label: '30分钟' },
  { value: '1h', label: '1小时' },
  { value: '4h', label: '4小时' },
  { value: '1d', label: '1天' }
]

const showTimeframeTooltip = ref(false)
const showConfirmTooltip = ref(false)

// RSI 预设
const setRsiPreset = (preset) => {
  const presets = {
    standard: { period: 14, overbought: 70, oversold: 30 },
    aggressive: { period: 14, overbought: 80, oversold: 20 },
    conservative: { period: 14, overbought: 65, oversold: 35 }
  }
  emit('update:rsiConfig', presets[preset])
}

// MACD 预设
const setMacdPreset = (preset) => {
  const presets = {
    standard: { fast: 12, slow: 26, signal: 9 },
    fast: { fast: 5, slow: 13, signal: 5 },
    slow: { fast: 19, slow: 39, signal: 9 }
  }
  emit('update:macdConfig', presets[preset])
}

// MA交叉 预设
const setMaCrossPreset = (preset) => {
  const presets = {
    short: { fast: 7, slow: 25 },
    medium: { fast: 20, slow: 50 },
    long: { fast: 50, slow: 200 }
  }
  emit('update:maCrossConfig', presets[preset])
}

// ATR 预设
const setAtrPreset = (preset) => {
  const presets = {
    standard: { period: 14, multiplier: 2.0 },
    tight: { period: 14, multiplier: 1.5 },
    loose: { period: 14, multiplier: 3.0 }
  }
  emit('update:atrConfig', presets[preset])
}

// 更新配置
const updateRsiConfig = (key, value) => {
  emit('update:rsiConfig', { ...props.rsiConfig, [key]: Number(value) })
}

const updateMacdConfig = (key, value) => {
  emit('update:macdConfig', { ...props.macdConfig, [key]: Number(value) })
}

const updateMaCrossConfig = (key, value) => {
  emit('update:maCrossConfig', { ...props.maCrossConfig, [key]: Number(value) })
}

const updateAtrConfig = (key, value) => {
  emit('update:atrConfig', { ...props.atrConfig, [key]: Number(value) })
}

// 时间周期配置
const updatePrimaryTimeframe = (value) => {
  emit('update:timeframesConfig', { ...props.timeframesConfig, primary: value })
}

const toggleConfirmTimeframe = (value) => {
  const confirm = [...props.timeframesConfig.confirm]
  const index = confirm.indexOf(value)
  if (index > -1) {
    confirm.splice(index, 1)
  } else {
    confirm.push(value)
  }
  emit('update:timeframesConfig', { ...props.timeframesConfig, confirm })
}

const updateRequireAllConfirm = (value) => {
  emit('update:timeframesConfig', { ...props.timeframesConfig, require_all_confirm: value })
}

const updateMinConfirmCount = (value) => {
  emit('update:timeframesConfig', { ...props.timeframesConfig, min_confirm_count: Number(value) })
}

// 切换指标类型时重置时间周期配置
const handleIndicatorTypeChange = (newType) => {
  emit('update:indicatorType', newType)

  // 重置时间周期配置为默认值
  emit('update:timeframesConfig', {
    primary: '1h',
    confirm: [],
    require_all_confirm: false,
    min_confirm_count: 1
  })
}
</script>


