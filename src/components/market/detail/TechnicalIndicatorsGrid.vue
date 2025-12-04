<template>
  <div class="space-y-6">

    <!-- 核心指标（信号机器人常用） -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">

      <!-- RSI 卡片 -->
      <div class="bg-gradient-to-br from-blue-50 to-white rounded-xl p-5 border border-blue-100 shadow-sm">
        <div class="flex items-start justify-between mb-3">
          <div>
            <div class="text-xs font-medium text-gray-600 mb-0.5">RSI 相对强弱指标</div>
            <div class="text-[10px] text-gray-500">周期: 14 | 超买 >70 | 超卖 &lt;30</div>
          </div>
          <span class="px-2 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-blue-700">信号指标</span>
        </div>
        <div class="flex items-end justify-between mb-3">
          <div class="text-3xl font-bold text-gray-900">
            {{ formatNumber(indicators?.rsi) }}
          </div>
          <div class="text-right">
            <div class="text-xs font-semibold px-2 py-0.5 rounded" :class="getRSITextColorClass(indicators?.rsi)">
              {{ getRSILabel(indicators?.rsi) }}
            </div>
          </div>
        </div>
        <!-- RSI 进度条 -->
        <div class="relative h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            class="absolute h-full rounded-full transition-all duration-500"
            :class="getRSIColorClass(indicators?.rsi)"
            :style="{ width: `${Math.min(parseFloat(indicators?.rsi || 0), 100)}%` }"
          ></div>
          <div class="absolute top-0 left-[30%] w-px h-full bg-white opacity-60"></div>
          <div class="absolute top-0 left-[70%] w-px h-full bg-white opacity-60"></div>
        </div>
        <div class="flex justify-between text-[10px] text-gray-500 mt-1.5">
          <span>超卖 (&lt;30)</span>
          <span>中性</span>
          <span>超买 (>70)</span>
        </div>
      </div>

      <!-- MACD 卡片 -->
      <div class="bg-gradient-to-br from-purple-50 to-white rounded-xl p-5 border border-purple-100 shadow-sm">
        <div class="flex items-start justify-between mb-3">
          <div>
            <div class="text-xs font-medium text-gray-600 mb-0.5">MACD 趋势动量</div>
            <div class="text-[10px] text-gray-500">快线 12 | 慢线 26 | 信号线 9</div>
          </div>
          <span class="px-2 py-0.5 rounded text-[10px] font-medium bg-purple-100 text-purple-700">信号指标</span>
        </div>

        <div class="mb-3">
          <div class="flex items-end justify-between mb-1.5">
            <div class="text-[10px] text-gray-500">柱状图 (Histogram)</div>
            <div class="text-[10px] px-2 py-0.5 rounded" :class="parseFloat(indicators?.macd_histogram) >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'">
              {{ parseFloat(indicators?.macd_histogram) >= 0 ? '多头' : '空头' }}
            </div>
          </div>
          <div class="text-3xl font-bold" :class="parseFloat(indicators?.macd_histogram) >= 0 ? 'text-green-600' : 'text-red-600'">
            {{ formatNumber(indicators?.macd_histogram) }}
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3 pt-3 border-t border-purple-100">
          <div>
            <div class="text-[10px] text-gray-500 mb-1">DIF (快线)</div>
            <div class="text-sm font-semibold text-gray-900">{{ formatNumber(indicators?.macd_line) }}</div>
          </div>
          <div>
            <div class="text-[10px] text-gray-500 mb-1">DEA (慢线)</div>
            <div class="text-sm font-semibold text-gray-900">{{ formatNumber(indicators?.macd_signal) }}</div>
          </div>
        </div>
      </div>

    </div>

    <!-- 移动平均线（MA/EMA 交叉信号核心） -->
    <div class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
      <div class="flex items-center justify-between mb-4">
        <div>
          <div class="text-sm font-medium text-gray-900">移动平均线</div>
          <div class="text-[10px] text-gray-500">MA/EMA 交叉产生买卖信号</div>
        </div>
        <span class="px-2 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-700">信号指标</span>
      </div>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="text-center p-3 bg-gray-50 rounded-lg">
          <div class="text-[10px] text-gray-500 mb-1">MA7</div>
          <div class="text-lg font-bold text-gray-900">${{ formatPrice(indicators?.ma_7) }}</div>
        </div>
        <div class="text-center p-3 bg-gray-50 rounded-lg">
          <div class="text-[10px] text-gray-500 mb-1">MA25</div>
          <div class="text-lg font-bold text-gray-900">${{ formatPrice(indicators?.ma_25) }}</div>
        </div>
        <div class="text-center p-3 bg-blue-50 rounded-lg">
          <div class="text-[10px] text-blue-600 mb-1">EMA12</div>
          <div class="text-lg font-bold text-blue-700">${{ formatPrice(indicators?.ema_12) }}</div>
        </div>
        <div class="text-center p-3 bg-blue-50 rounded-lg">
          <div class="text-[10px] text-blue-600 mb-1">EMA26</div>
          <div class="text-lg font-bold text-blue-700">${{ formatPrice(indicators?.ema_26) }}</div>
        </div>
      </div>
      <!-- MA 趋势状态 -->
      <div class="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
        <div class="text-[10px] text-gray-500">
          MA7 {{ getMACrossStatus('ma') }} MA25
        </div>
        <div class="text-[10px] px-2 py-0.5 rounded" :class="getMACrossBgClass('ma')">
          {{ getMACrossLabel('ma') }}
        </div>
      </div>
    </div>

    <!-- 布林带（突破信号核心） -->
    <div class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
      <div class="flex items-center justify-between mb-4">
        <div>
          <div class="text-sm font-medium text-gray-900">布林带 Bollinger Bands</div>
          <div class="text-[10px] text-gray-500">周期 20 | 标准差 2.0</div>
        </div>
        <span class="px-2 py-0.5 rounded text-[10px] font-medium bg-orange-100 text-orange-700">信号指标</span>
      </div>
      <div class="grid grid-cols-3 gap-4 mb-3">
        <div class="text-center p-3 bg-red-50 rounded-lg">
          <div class="text-[10px] text-red-600 mb-1">上轨 (超买)</div>
          <div class="text-lg font-bold text-red-700">${{ formatPrice(indicators?.bollinger_upper) }}</div>
        </div>
        <div class="text-center p-3 bg-gray-50 rounded-lg">
          <div class="text-[10px] text-gray-500 mb-1">中轨 (MA20)</div>
          <div class="text-lg font-bold text-gray-900">${{ formatPrice(indicators?.bollinger_middle) }}</div>
        </div>
        <div class="text-center p-3 bg-green-50 rounded-lg">
          <div class="text-[10px] text-green-600 mb-1">下轨 (超卖)</div>
          <div class="text-lg font-bold text-green-700">${{ formatPrice(indicators?.bollinger_lower) }}</div>
        </div>
      </div>
      <!-- 布林带宽度 -->
      <div class="flex items-center justify-between text-[10px] pt-3 border-t border-gray-100">
        <span class="text-gray-500">带宽: {{ formatPercentage(getBollingerWidth()) }}%</span>
        <span :class="getBollingerStatusClass()">{{ getBollingerStatus() }}</span>
      </div>
    </div>

    <!-- 其他信号指标 -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">

      <!-- KDJ -->
      <div class="bg-white rounded-lg p-3.5 border border-gray-200 hover:border-blue-300 transition-colors shadow-sm">
        <div class="flex items-center justify-between mb-2">
          <div class="text-[10px] text-gray-500">KDJ (9,3,3)</div>
          <span class="px-1.5 py-0.5 rounded text-[8px] bg-blue-50 text-blue-600">信号</span>
        </div>
        <div class="space-y-1">
          <div class="flex justify-between">
            <span class="text-[10px] text-gray-500">K</span>
            <span class="text-sm font-bold text-gray-900">{{ formatNumber(indicators?.kdj_k) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-[10px] text-gray-500">D</span>
            <span class="text-sm font-bold text-gray-900">{{ formatNumber(indicators?.kdj_d) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-[10px] text-gray-500">J</span>
            <span class="text-sm font-bold" :class="parseFloat(indicators?.kdj_j) > 80 ? 'text-red-600' : parseFloat(indicators?.kdj_j) < 20 ? 'text-green-600' : 'text-gray-900'">
              {{ formatNumber(indicators?.kdj_j) }}
            </span>
          </div>
        </div>
      </div>

      <!-- ATR 波动性 -->
      <div class="bg-white rounded-lg p-3.5 border border-gray-200 hover:border-yellow-300 transition-colors shadow-sm">
        <div class="flex items-center justify-between mb-2">
          <div class="text-[10px] text-gray-500">ATR (14)</div>
          <span class="px-1.5 py-0.5 rounded text-[8px] bg-yellow-50 text-yellow-600">信号</span>
        </div>
        <div class="text-xl font-bold text-gray-900">${{ formatPrice(indicators?.atr_14) }}</div>
        <div class="text-[10px] text-gray-500 mt-1">波动幅度</div>
      </div>

      <!-- 成交量 -->
      <div class="bg-white rounded-lg p-3.5 border border-gray-200 hover:border-green-300 transition-colors shadow-sm">
        <div class="flex items-center justify-between mb-2">
          <div class="text-[10px] text-gray-500">成交量 (24h)</div>
          <span class="px-1.5 py-0.5 rounded text-[8px] bg-green-50 text-green-600">信号</span>
        </div>
        <div class="text-xl font-bold text-gray-900">${{ formatLargeNumber(indicators?.volume_24h) }}</div>
        <div class="text-[10px] mt-1" :class="getVolumeRatioClass()">
          倍数: {{ formatNumber(indicators?.volume_ratio) }}x
        </div>
      </div>

      <!-- ADX 趋势强度 -->
      <div class="bg-white rounded-lg p-3.5 border border-gray-200 hover:border-indigo-300 transition-colors shadow-sm">
        <div class="flex items-center justify-between mb-2">
          <div class="text-[10px] text-gray-500">ADX (14)</div>
          <span class="px-1.5 py-0.5 rounded text-[8px] bg-indigo-50 text-indigo-600">信号</span>
        </div>
        <div class="text-xl font-bold text-gray-900">{{ formatNumber(indicators?.dmi_adx) }}</div>
        <div class="text-[10px] mt-1" :class="getADXStatusClass()">
          {{ getADXStatus() }}
        </div>
      </div>

    </div>

    <!-- 辅助指标 -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">

      <!-- 24h 最高 -->
      <div class="bg-white rounded-lg p-3.5 border border-gray-200 shadow-sm">
        <div class="flex items-center justify-between mb-2">
          <div class="text-[10px] text-gray-500">24h 最高</div>
          <div class="w-6 h-6 rounded bg-green-50 flex items-center justify-center">
            <svg class="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
            </svg>
          </div>
        </div>
        <div class="text-lg font-bold text-green-600">${{ formatPrice(indicators?.high_24h) }}</div>
      </div>

      <!-- 24h 最低 -->
      <div class="bg-white rounded-lg p-3.5 border border-gray-200 shadow-sm">
        <div class="flex items-center justify-between mb-2">
          <div class="text-[10px] text-gray-500">24h 最低</div>
          <div class="w-6 h-6 rounded bg-red-50 flex items-center justify-center">
            <svg class="w-3 h-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
            </svg>
          </div>
        </div>
        <div class="text-lg font-bold text-red-600">${{ formatPrice(indicators?.low_24h) }}</div>
      </div>

      <!-- VWAP -->
      <div class="bg-white rounded-lg p-3.5 border border-gray-200 shadow-sm">
        <div class="flex items-center justify-between mb-2">
          <div class="text-[10px] text-gray-500">VWAP</div>
          <div class="w-6 h-6 rounded bg-blue-50 flex items-center justify-center">
            <svg class="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
        </div>
        <div class="text-lg font-bold text-gray-900">${{ formatPrice(indicators?.vwap) }}</div>
        <div class="text-[10px] text-gray-500 mt-0.5">成交量加权均价</div>
      </div>

      <!-- 波动率 -->
      <div class="bg-white rounded-lg p-3.5 border border-gray-200 shadow-sm">
        <div class="flex items-center justify-between mb-2">
          <div class="text-[10px] text-gray-500">30日波动率</div>
          <div class="w-6 h-6 rounded bg-orange-50 flex items-center justify-center">
            <svg class="w-3 h-3 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4"/>
            </svg>
          </div>
        </div>
        <div class="text-lg font-bold text-orange-600">{{ formatPercentage(indicators?.volatility_30d) }}%</div>
        <div class="text-[10px] text-gray-500 mt-0.5">年化波动率</div>
      </div>

    </div>

  </div>
</template>

<script setup>
import { computed, defineProps } from 'vue'

const props = defineProps({
  technicalIndicator: { type: Object, default: null },
  technicalSignals: { type: Object, default: () => ({}) },
  exchanges: { type: Array, default: () => [] },
  token: { type: Object, default: () => ({}) }
})

// Get indicators from technical_indicator
const indicators = computed(() => {
  if (!props.technicalIndicator) return {}

  return {
    // RSI
    rsi: props.technicalIndicator.rsi_14,
    // MACD
    macd_line: props.technicalIndicator.macd,
    macd_signal: props.technicalIndicator.macd_signal,
    macd_histogram: props.technicalIndicator.macd_histogram,
    // 移动平均线
    ma_7: props.technicalIndicator.ma_7,
    ma_25: props.technicalIndicator.ma_25,
    ma_99: props.technicalIndicator.ma_99,
    ema_12: props.technicalIndicator.ema_12,
    ema_26: props.technicalIndicator.ema_26,
    // 布林带
    bollinger_upper: props.technicalIndicator.bollinger_upper,
    bollinger_middle: props.technicalIndicator.bollinger_middle,
    bollinger_lower: props.technicalIndicator.bollinger_lower,
    // KDJ
    kdj_k: props.technicalIndicator.kdj_k,
    kdj_d: props.technicalIndicator.kdj_d,
    kdj_j: props.technicalIndicator.kdj_j,
    // ADX/DMI
    dmi_plus: props.technicalIndicator.dmi_plus,
    dmi_minus: props.technicalIndicator.dmi_minus,
    dmi_adx: props.technicalIndicator.dmi_adx,
    // ATR
    atr_14: props.technicalIndicator.atr_14,
    // 成交量
    volume_24h: props.technicalIndicator.volume_24h,
    volume_ma: props.technicalIndicator.volume_ma,
    volume_ratio: props.technicalIndicator.volume_ratio,
    // 其他
    vwap: props.technicalIndicator.vwap,
    high_24h: props.technicalIndicator.high_24h,
    low_24h: props.technicalIndicator.low_24h,
    volatility_30d: props.technicalIndicator.volatility_30d,
  }
})

// 格式化函数
const formatNumber = (value) => {
  if (value === null || value === undefined) return '-'
  const num = parseFloat(value)
  if (isNaN(num)) return '-'
  return num.toFixed(2)
}

const formatPrice = (price) => {
  if (!price) return '-'
  const num = parseFloat(price)
  if (num >= 1) {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 })
}

const formatLargeNumber = (value) => {
  if (!value) return '0'
  const num = parseFloat(value)
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K'
  return num.toFixed(2)
}

const formatPercentage = (value) => {
  if (value === null || value === undefined) return '-'
  return parseFloat(value).toFixed(2)
}

// RSI 相关
const getRSIColorClass = (rsi) => {
  if (!rsi) return 'bg-gray-300'
  const value = parseFloat(rsi)
  if (value >= 70) return 'bg-red-500'
  if (value >= 50) return 'bg-orange-500'
  if (value >= 30) return 'bg-yellow-500'
  return 'bg-green-500'
}

const getRSITextColorClass = (rsi) => {
  if (!rsi) return 'bg-gray-100 text-gray-600'
  const value = parseFloat(rsi)
  if (value >= 70) return 'bg-red-50 text-red-700'
  if (value >= 50) return 'bg-orange-50 text-orange-700'
  if (value >= 30) return 'bg-yellow-50 text-yellow-700'
  return 'bg-green-50 text-green-700'
}

const getRSILabel = (rsi) => {
  if (!rsi) return '-'
  const value = parseFloat(rsi)
  if (value >= 70) return '超买'
  if (value >= 50) return '偏强'
  if (value >= 30) return '偏弱'
  return '超卖'
}

// MA 交叉状态
const getMACrossStatus = (type) => {
  const ma7 = parseFloat(indicators.value?.ma_7)
  const ma25 = parseFloat(indicators.value?.ma_25)
  if (isNaN(ma7) || isNaN(ma25)) return '—'
  return ma7 > ma25 ? '>' : '<'
}

const getMACrossLabel = (type) => {
  const ma7 = parseFloat(indicators.value?.ma_7)
  const ma25 = parseFloat(indicators.value?.ma_25)
  if (isNaN(ma7) || isNaN(ma25)) return '无数据'
  return ma7 > ma25 ? '金叉 (看涨)' : '死叉 (看跌)'
}

const getMACrossBgClass = (type) => {
  const ma7 = parseFloat(indicators.value?.ma_7)
  const ma25 = parseFloat(indicators.value?.ma_25)
  if (isNaN(ma7) || isNaN(ma25)) return 'bg-gray-100 text-gray-600'
  return ma7 > ma25 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
}

// 布林带相关
const getBollingerWidth = () => {
  const upper = parseFloat(indicators.value?.bollinger_upper)
  const lower = parseFloat(indicators.value?.bollinger_lower)
  const middle = parseFloat(indicators.value?.bollinger_middle)
  if (isNaN(upper) || isNaN(lower) || isNaN(middle) || middle === 0) return 0
  return ((upper - lower) / middle) * 100
}

const getBollingerStatus = () => {
  const width = getBollingerWidth()
  if (width === 0) return '无数据'
  if (width < 5) return '收窄 (即将突破)'
  if (width > 15) return '扩张 (趋势中)'
  return '正常'
}

const getBollingerStatusClass = () => {
  const width = getBollingerWidth()
  if (width === 0) return 'text-gray-500'
  if (width < 5) return 'text-orange-600 font-medium'
  if (width > 15) return 'text-blue-600'
  return 'text-gray-600'
}

// 成交量倍数
const getVolumeRatioClass = () => {
  const ratio = parseFloat(indicators.value?.volume_ratio)
  if (isNaN(ratio)) return 'text-gray-500'
  if (ratio >= 2) return 'text-red-600 font-medium'
  if (ratio >= 1.5) return 'text-orange-600'
  return 'text-gray-500'
}

// ADX 趋势强度
const getADXStatus = () => {
  const adx = parseFloat(indicators.value?.dmi_adx)
  if (isNaN(adx)) return '无数据'
  if (adx >= 50) return '极强趋势'
  if (adx >= 25) return '趋势明显'
  return '震荡/无趋势'
}

const getADXStatusClass = () => {
  const adx = parseFloat(indicators.value?.dmi_adx)
  if (isNaN(adx)) return 'text-gray-500'
  if (adx >= 50) return 'text-red-600 font-medium'
  if (adx >= 25) return 'text-green-600'
  return 'text-gray-500'
}
</script>

