<template>
  <div class="space-y-6 relative">
    <!-- 加载状态 -->
    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mb-2"></div>
      <p class="text-xs text-gray-500">加载中...</p>
    </div>

    <div v-else class="space-y-6">
      <!-- 时间周期提示（右上角） -->
      <div class="flex justify-end">
        <span class="text-[11px] text-gray-400">
          {{ formatTimeframe(timeframe) }} · {{ marketType === 'futures' ? '合约' : '现货' }}
        </span>
      </div>

      <!-- 核心指标 RSI + MACD -->
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
            <div class="text-3xl font-bold text-gray-900">{{ fmt(indicatorValues.rsi?.rsi, 1) }}</div>
            <div class="text-right">
              <div class="text-xs font-semibold px-2 py-0.5 rounded" :class="getRSITextColorClass()">
                {{ getRSILabel() }}
              </div>
            </div>
          </div>
          <!-- RSI 进度条 -->
          <div class="relative h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div class="absolute h-full rounded-full transition-all duration-500" :class="getRSIBarColor()"
                 :style="{ width: `${Math.min(parseFloat(indicatorValues.rsi?.rsi || 0), 100)}%` }"></div>
            <div class="absolute top-0 left-[30%] w-px h-full bg-white opacity-60"></div>
            <div class="absolute top-0 left-[70%] w-px h-full bg-white opacity-60"></div>
          </div>
          <div class="flex justify-between text-[10px] text-gray-500 mt-1.5">
            <span>超卖 (&lt;30)</span><span>中性</span><span>超买 (>70)</span>
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
              <div class="text-[10px] px-2 py-0.5 rounded" :class="getMACDHistogramClass()">
                {{ getMACDHistogramLabel() }}
              </div>
            </div>
            <div class="text-3xl font-bold" :class="getMACDHistogramTextClass()">
              {{ fmt(indicatorValues.macd?.histogram, 2) }}
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3 pt-3 border-t border-purple-100">
            <div>
              <div class="text-[10px] text-gray-500 mb-1">DIF (快线)</div>
              <div class="text-sm font-semibold text-gray-900">{{ fmt(indicatorValues.macd?.dif, 2) }}</div>
            </div>
            <div>
              <div class="text-[10px] text-gray-500 mb-1">DEA (慢线)</div>
              <div class="text-sm font-semibold text-gray-900">{{ fmt(indicatorValues.macd?.dea, 2) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 移动平均线 -->
      <div class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <div>
            <div class="text-sm font-medium text-gray-900">移动平均线</div>
            <div class="text-[10px] text-gray-500">MA 交叉产生买卖信号</div>
          </div>
          <span class="px-2 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-700">信号指标</span>
        </div>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="text-center p-3 bg-gray-50 rounded-lg">
            <div class="text-[10px] text-gray-500 mb-1">MA7</div>
            <div class="text-lg font-bold text-gray-900">${{ formatPrice(indicatorValues.ma?.ma_7) }}</div>
          </div>
          <div class="text-center p-3 bg-gray-50 rounded-lg">
            <div class="text-[10px] text-gray-500 mb-1">MA25</div>
            <div class="text-lg font-bold text-gray-900">${{ formatPrice(indicatorValues.ma?.ma_25) }}</div>
          </div>
          <div class="text-center p-3 bg-blue-50 rounded-lg">
            <div class="text-[10px] text-blue-600 mb-1">MA50</div>
            <div class="text-lg font-bold text-blue-700">${{ formatPrice(indicatorValues.ma?.ma_50 || indicatorValues.trend_bias?.ma_50) }}</div>
          </div>
          <div class="text-center p-3 bg-blue-50 rounded-lg">
            <div class="text-[10px] text-blue-600 mb-1">MA200</div>
            <div class="text-lg font-bold text-blue-700">${{ formatPrice(indicatorValues.ma?.ma_200 || indicatorValues.trend_bias?.ma_200) }}</div>
          </div>
        </div>
        <!-- MA 趋势状态 -->
        <div class="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div class="text-[10px] text-gray-500">MA7 {{ getMACrossSymbol('short') }} MA25</div>
          <div class="text-[10px] px-2 py-0.5 rounded" :class="getMACrossBgClass('short')">{{ getMACrossLabel('short') }}</div>
        </div>
        <div class="mt-1 flex items-center justify-between">
          <div class="text-[10px] text-gray-500">MA50 {{ getMACrossSymbol('mid') }} MA200</div>
          <div class="text-[10px] px-2 py-0.5 rounded" :class="getMACrossBgClass('mid')">{{ getMACrossLabel('mid') }}</div>
        </div>
      </div>

      <!-- 布林带 -->
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
            <div class="text-lg font-bold text-red-700">${{ formatPrice(indicatorValues.bollinger?.bollinger_upper) }}</div>
          </div>
          <div class="text-center p-3 bg-gray-50 rounded-lg">
            <div class="text-[10px] text-gray-500 mb-1">中轨 (MA20)</div>
            <div class="text-lg font-bold text-gray-900">${{ formatPrice(indicatorValues.bollinger?.bollinger_middle) }}</div>
          </div>
          <div class="text-center p-3 bg-green-50 rounded-lg">
            <div class="text-[10px] text-green-600 mb-1">下轨 (超卖)</div>
            <div class="text-lg font-bold text-green-700">${{ formatPrice(indicatorValues.bollinger?.bollinger_lower) }}</div>
          </div>
        </div>
        <div class="flex items-center justify-between text-[10px] pt-3 border-t border-gray-100">
          <span class="text-gray-500">带宽: {{ getBollingerWidth() }}%</span>
          <span :class="getBollingerStatusClass()">{{ getBollingerStatus() }}</span>
        </div>
      </div>

      <!-- 其他指标网格 -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- ATR 波动率 -->
        <div class="bg-white rounded-lg p-3.5 border border-gray-200 hover:border-yellow-300 transition-colors shadow-sm">
          <div class="flex items-center justify-between mb-2">
            <div class="text-[10px] text-gray-500">ATR (14)</div>
            <span class="px-1.5 py-0.5 rounded text-[8px] bg-yellow-50 text-yellow-600">信号</span>
          </div>
          <div class="text-xl font-bold text-gray-900">${{ formatPrice(indicatorValues.atr?.atr) }}</div>
          <div class="text-[10px] text-gray-500 mt-1">均值: ${{ formatPrice(indicatorValues.atr?.atr_ma?.['14_ma']) }}</div>
        </div>

        <!-- 成交量 -->
        <div class="bg-white rounded-lg p-3.5 border border-gray-200 hover:border-green-300 transition-colors shadow-sm">
          <div class="flex items-center justify-between mb-2">
            <div class="text-[10px] text-gray-500">成交量</div>
            <span class="px-1.5 py-0.5 rounded text-[8px] bg-green-50 text-green-600">信号</span>
          </div>
          <div class="text-xl font-bold text-gray-900">${{ formatVolume(indicatorValues.volume?.volume) }}</div>
          <div class="text-[10px] mt-1" :class="getVolumeRatioClass()">
            倍数: {{ getVolumeRatio() }}x
          </div>
        </div>

        <!-- 支撑位 -->
        <div class="bg-white rounded-lg p-3.5 border border-gray-200 shadow-sm">
          <div class="flex items-center justify-between mb-2">
            <div class="text-[10px] text-gray-500">支撑位</div>
            <div class="w-6 h-6 rounded bg-green-50 flex items-center justify-center">
              <svg class="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
              </svg>
            </div>
          </div>
          <div class="text-lg font-bold text-green-600">${{ formatPrice(indicatorValues.pivot?.support) }}</div>
        </div>

        <!-- 阻力位 -->
        <div class="bg-white rounded-lg p-3.5 border border-gray-200 shadow-sm">
          <div class="flex items-center justify-between mb-2">
            <div class="text-[10px] text-gray-500">阻力位</div>
            <div class="w-6 h-6 rounded bg-red-50 flex items-center justify-center">
              <svg class="w-3 h-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
              </svg>
            </div>
          </div>
          <div class="text-lg font-bold text-red-600">${{ formatPrice(indicatorValues.pivot?.resistance) }}</div>
        </div>
      </div>

      <!-- 合约数据（仅合约模式显示） -->
      <div v-if="marketType === 'futures'" class="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-5 border border-orange-200 shadow-sm">
        <div class="flex items-center gap-2 mb-4">
          <span class="text-base">🔥</span>
          <span class="text-sm font-semibold text-orange-700">合约市场数据</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- 资金费率 -->
          <div class="bg-white/80 rounded-lg p-4">
            <div class="text-[10px] text-gray-500 mb-2">资金费率</div>
            <div :class="['text-2xl font-bold', getFundingRateColor()]">
              {{ indicatorValues.funding_rate?.funding_rate !== undefined ? (indicatorValues.funding_rate.funding_rate * 100).toFixed(4) + '%' : '-' }}
            </div>
            <div class="text-[10px] text-gray-500 mt-2">{{ getFundingRateHint() }}</div>
          </div>
          <!-- 持仓量 -->
          <div class="bg-white/80 rounded-lg p-4">
            <div class="text-[10px] text-gray-500 mb-2">持仓量</div>
            <div class="text-2xl font-bold text-gray-800">{{ formatVolume(indicatorValues.open_interest?.open_interest) }}</div>
            <div class="text-[10px] text-gray-500 mt-2">
              24h变化: {{ indicatorValues.open_interest?.oi_change !== undefined ? (indicatorValues.open_interest.oi_change > 0 ? '+' : '') + indicatorValues.open_interest.oi_change.toFixed(2) + '%' : '-' }}
            </div>
          </div>
          <!-- 多空比 -->
          <div class="bg-white/80 rounded-lg p-4">
            <div class="text-[10px] text-gray-500 mb-2">多空比</div>
            <div :class="['text-2xl font-bold', getLongShortColor()]">
              {{ indicatorValues.long_short_ratio?.long_short_ratio !== undefined ? indicatorValues.long_short_ratio.long_short_ratio.toFixed(2) : '-' }}
            </div>
            <div class="text-[10px] text-gray-500 mt-2">{{ getLongShortHint() }}</div>
          </div>
        </div>
      </div>

      <!-- 数据更新时间 -->
      <div class="text-center text-[10px] text-gray-400">
        数据仅供参考，不构成投资建议
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  indicatorValues: { type: Object, default: () => ({}) },
  marketType: { type: String, default: 'spot' },
  timeframe: { type: String, default: '1h' },
  loading: { type: Boolean, default: false }
})

// 格式化时间周期
const formatTimeframe = (tf) => {
  const map = {
    '1m': '1分钟', '3m': '3分钟', '5m': '5分钟', '15m': '15分钟', '30m': '30分钟',
    '1h': '1小时', '2h': '2小时', '4h': '4小时', '6h': '6小时', '8h': '8小时', '12h': '12小时',
    '1d': '1天', '3d': '3天', '1w': '1周', '1M': '1月'
  }
  return map[tf] || tf
}

// 格式化数字
const fmt = (val, decimals = 2) => {
  if (val === null || val === undefined || isNaN(val)) return '-'
  return Number(val).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

// 格式化价格
const formatPrice = (val) => {
  if (val === null || val === undefined || isNaN(val)) return '-'
  const num = Number(val)
  if (num >= 1000) return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  if (num >= 1) return num.toFixed(4)
  return num.toFixed(6)
}

// 格式化成交量
const formatVolume = (val) => {
  if (val === null || val === undefined || isNaN(val)) return '-'
  const num = Number(val)
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K'
  return num.toFixed(2)
}

// RSI 相关
const getRSITextColorClass = () => {
  const rsi = props.indicatorValues.rsi?.rsi
  if (!rsi) return 'bg-gray-100 text-gray-600'
  if (rsi >= 70) return 'bg-red-50 text-red-700'
  if (rsi >= 50) return 'bg-orange-50 text-orange-700'
  if (rsi >= 30) return 'bg-yellow-50 text-yellow-700'
  return 'bg-green-50 text-green-700'
}

const getRSILabel = () => {
  const rsi = props.indicatorValues.rsi?.rsi
  if (!rsi) return '-'
  if (rsi >= 70) return '超买'
  if (rsi >= 50) return '偏强'
  if (rsi >= 30) return '偏弱'
  return '超卖'
}

const getRSIBarColor = () => {
  const rsi = props.indicatorValues.rsi?.rsi
  if (!rsi) return 'bg-gray-300'
  if (rsi >= 70) return 'bg-red-500'
  if (rsi >= 50) return 'bg-orange-500'
  if (rsi >= 30) return 'bg-yellow-500'
  return 'bg-green-500'
}

// MACD 相关
const getMACDHistogramClass = () => {
  const histogram = props.indicatorValues.macd?.histogram
  if (histogram === undefined || histogram === null) return 'bg-gray-100 text-gray-600'
  return histogram >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
}

const getMACDHistogramLabel = () => {
  const histogram = props.indicatorValues.macd?.histogram
  if (histogram === undefined || histogram === null) return '-'
  return histogram >= 0 ? '多头' : '空头'
}

const getMACDHistogramTextClass = () => {
  const histogram = props.indicatorValues.macd?.histogram
  if (histogram === undefined || histogram === null) return 'text-gray-600'
  return histogram >= 0 ? 'text-green-600' : 'text-red-600'
}

// MA 交叉相关
const getMACrossSymbol = (type) => {
  if (type === 'short') {
    const ma7 = props.indicatorValues.ma?.ma_7
    const ma25 = props.indicatorValues.ma?.ma_25
    if (!ma7 || !ma25) return '—'
    return ma7 > ma25 ? '>' : '<'
  } else {
    const ma50 = props.indicatorValues.ma?.ma_50 || props.indicatorValues.trend_bias?.ma_50
    const ma200 = props.indicatorValues.ma?.ma_200 || props.indicatorValues.trend_bias?.ma_200
    if (!ma50 || !ma200) return '—'
    return ma50 > ma200 ? '>' : '<'
  }
}

const getMACrossLabel = (type) => {
  if (type === 'short') {
    const ma7 = props.indicatorValues.ma?.ma_7
    const ma25 = props.indicatorValues.ma?.ma_25
    if (!ma7 || !ma25) return '无数据'
    return ma7 > ma25 ? '金叉 (看涨)' : '死叉 (看跌)'
  } else {
    const ma50 = props.indicatorValues.ma?.ma_50 || props.indicatorValues.trend_bias?.ma_50
    const ma200 = props.indicatorValues.ma?.ma_200 || props.indicatorValues.trend_bias?.ma_200
    if (!ma50 || !ma200) return '无数据'
    return ma50 > ma200 ? '金叉 (看涨)' : '死叉 (看跌)'
  }
}

const getMACrossBgClass = (type) => {
  if (type === 'short') {
    const ma7 = props.indicatorValues.ma?.ma_7
    const ma25 = props.indicatorValues.ma?.ma_25
    if (!ma7 || !ma25) return 'bg-gray-100 text-gray-600'
    return ma7 > ma25 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
  } else {
    const ma50 = props.indicatorValues.ma?.ma_50 || props.indicatorValues.trend_bias?.ma_50
    const ma200 = props.indicatorValues.ma?.ma_200 || props.indicatorValues.trend_bias?.ma_200
    if (!ma50 || !ma200) return 'bg-gray-100 text-gray-600'
    return ma50 > ma200 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
  }
}

// 布林带相关
const getBollingerWidth = () => {
  const upper = props.indicatorValues.bollinger?.bollinger_upper
  const lower = props.indicatorValues.bollinger?.bollinger_lower
  const middle = props.indicatorValues.bollinger?.bollinger_middle
  if (!upper || !lower || !middle || middle === 0) return '-'
  return (((upper - lower) / middle) * 100).toFixed(2)
}

const getBollingerStatus = () => {
  const width = parseFloat(getBollingerWidth())
  if (isNaN(width)) return '无数据'
  if (width < 5) return '收窄 (即将突破)'
  if (width > 15) return '扩张 (趋势中)'
  return '正常'
}

const getBollingerStatusClass = () => {
  const width = parseFloat(getBollingerWidth())
  if (isNaN(width)) return 'text-gray-500'
  if (width < 5) return 'text-orange-600 font-medium'
  if (width > 15) return 'text-blue-600'
  return 'text-gray-600'
}

// 成交量倍数
const getVolumeRatio = () => {
  const volume = props.indicatorValues.volume?.volume
  const volumeMa = props.indicatorValues.volume?.volume_ma
  if (!volume || !volumeMa || volumeMa === 0) return '-'
  return (volume / volumeMa).toFixed(2)
}

const getVolumeRatioClass = () => {
  const ratio = parseFloat(getVolumeRatio())
  if (isNaN(ratio)) return 'text-gray-500'
  if (ratio >= 2) return 'text-red-600 font-medium'
  if (ratio >= 1.5) return 'text-orange-600'
  return 'text-gray-500'
}

// 资金费率颜色
const getFundingRateColor = () => {
  const rate = props.indicatorValues.funding_rate?.funding_rate
  if (rate === undefined) return 'text-gray-600'
  if (rate > 0.01) return 'text-red-600'
  if (rate < -0.01) return 'text-green-600'
  return 'text-gray-700'
}

// 资金费率提示
const getFundingRateHint = () => {
  const rate = props.indicatorValues.funding_rate?.funding_rate
  if (rate === undefined) return '等待数据...'
  if (rate > 0.01) return '多头支付费用，看空信号'
  if (rate < -0.01) return '空头支付费用，看多信号'
  return '费率正常，中性'
}

// 多空比颜色
const getLongShortColor = () => {
  const ratio = props.indicatorValues.long_short_ratio?.long_short_ratio
  if (ratio === undefined) return 'text-gray-600'
  if (ratio > 2.0) return 'text-red-600'
  if (ratio < 0.5) return 'text-green-600'
  return 'text-gray-700'
}

// 多空比提示
const getLongShortHint = () => {
  const ratio = props.indicatorValues.long_short_ratio?.long_short_ratio
  if (ratio === undefined) return '等待数据...'
  if (ratio > 2.0) return '多头过度拥挤，看空信号'
  if (ratio < 0.5) return '空头过度拥挤，看多信号'
  return '多空平衡，中性'
}
</script>

