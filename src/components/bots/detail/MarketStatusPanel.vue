<template>
  <div class="space-y-4 relative">
    <!-- 加载状态 -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-3"></div>
      <p class="text-sm text-gray-500">加载中...</p>
    </div>

    <!-- 市场状态监测网格 -->
    <div v-else-if="infoIndicators.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="(indicator, idx) in infoIndicators" :key="idx"
        :class="['border rounded-xl p-4', getSignalStyle(indicator).borderClass]">
        <!-- 标题和信号状态 -->
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <span class="text-sm font-semibold text-gray-800">{{ getIndicatorLabel(indicator.type) }}</span>
            <span class="text-[10px] text-gray-400">{{ getIndicatorConfig(indicator) }}</span>
          </div>
          <span :class="['px-2 py-0.5 rounded text-[10px] font-semibold', getSignalStyle(indicator).badgeClass]">
            {{ getSignalStyle(indicator).label }}
          </span>
        </div>
        <!-- 数据详情 -->
        <div class="space-y-1.5">
          <div v-for="(info, iIdx) in getInfoData(indicator)" :key="iIdx" class="flex justify-between items-center text-xs">
            <span class="text-gray-500">{{ info.label }}</span>
            <span :class="['font-mono', info.highlight ? getSignalStyle(indicator).textClass : 'text-gray-700']">{{ info.value }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
      <svg class="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
      </svg>
      <p class="text-sm text-gray-500 font-medium">暂无市场状态监测指标</p>
      <p class="text-xs text-gray-400 mt-2 max-w-sm mx-auto">
        请在信号机器人配置中启用以下指标：<br/>
        布林带、ATR波动率、支撑阻力位、K线形态、背离检测<br/>
        <span class="text-blue-500">合约专用：资金费率、持仓量、多空比</span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  indicatorValues: { type: Object, default: () => ({}) },
  indicators: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false }
})

// 信息展示型指标 (ATR、布林带、支撑阻力、形态、背离、资金费率、持仓量、多空比)
const INFO_INDICATOR_TYPES = ['atr', 'bollinger', 'pivot', 'pattern', 'divergence', 'funding_rate', 'open_interest', 'long_short_ratio']

const infoIndicators = computed(() => {
  console.log('MarketStatusPanel - indicators:', props.indicators)
  console.log('MarketStatusPanel - INFO_INDICATOR_TYPES:', INFO_INDICATOR_TYPES)
  const filtered = props.indicators.filter(i => i.enabled && INFO_INDICATOR_TYPES.includes(i.type))
  console.log('MarketStatusPanel - filtered infoIndicators:', filtered)
  return filtered
})

// 格式化数字
const fmt = (val, decimals = 2) => {
  if (val === null || val === undefined || isNaN(val)) return '-'
  return Number(val).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

// 获取指标标签
const getIndicatorLabel = (type) => {
  const labels = {
    atr: 'ATR 波动率', bollinger: '布林带', pivot: '支撑阻力位',
    pattern: 'K线形态', divergence: '背离',
    funding_rate: '资金费率', open_interest: '持仓量', long_short_ratio: '多空比'
  }
  return labels[type] || type
}

// 获取指标配置描述
const getIndicatorConfig = (indicator) => {
  const p = getIndicatorParams(indicator)
  const configs = {
    atr: `(${p.period || 14})`,
    bollinger: `(${p.period || 20}, ${p.std_dev || 2}σ)`,
    pivot: `(L${p.left_bars || 3}/R${p.right_bars || 3})`,
    pattern: '(锤子线/吞没/双顶/双底)',
    divergence: '(RSI+MACD)',
    funding_rate: `(${(p.neutral_zone?.[0] * 100 || -0.01).toFixed(2)}~${(p.neutral_zone?.[1] * 100 || 0.01).toFixed(2)})`,
    open_interest: `(${p.oi_trend_period || 20}期, -${p.oi_decrease_threshold || 5}%~${p.oi_increase_threshold || 5}%)`,
    long_short_ratio: `(${p.extreme_short || 0.5}~${p.extreme_long || 2.0})`
  }
  return configs[indicator.type] || ''
}

// 获取指标参数 (合并 bot 配置和默认值)
const getIndicatorParams = (indicator) => {
  const defaults = {
    atr: { period: 14 },
    bollinger: { period: 20, std_dev: 2 },
    pivot: { left_bars: 3, right_bars: 3 },
    pattern: { pin_bar: true, engulfing: true, double_top: true, double_bottom: true },
    divergence: { use_rsi: true, use_macd: true },
    funding_rate: { positive_extreme: 0.01, negative_extreme: -0.01, neutral_zone: [-0.0001, 0.0001] },
    open_interest: { oi_trend_period: 20, oi_increase_threshold: 5, oi_decrease_threshold: -5 },
    long_short_ratio: { extreme_long: 2.0, extreme_short: 0.5 }
  }
  return { ...(defaults[indicator.type] || {}), ...(indicator.params || {}) }
}

// 获取信息展示型指标的数据
const getInfoData = (indicator) => {
  const values = props.indicatorValues[indicator.type] || {}
  const price = props.indicatorValues.price
  const data = []
  const params = getIndicatorParams(indicator)

  switch (indicator.type) {
    case 'atr':
      data.push({ label: 'ATR 值', value: fmt(values.atr, 2), highlight: true })
      data.push({ label: '波动状态', value: getATRStatus(values.atr, values.atr_ma), highlight: true })
      break
    case 'bollinger':
      const bbPos = getBollingerPosition(price, values.bollinger_upper, values.bollinger_lower)
      data.push({ label: '价格位置', value: bbPos.label, highlight: true })
      data.push({ label: '上轨', value: fmt(values.bollinger_upper, 2) })
      data.push({ label: '下轨', value: fmt(values.bollinger_lower, 2) })
      break
    case 'pivot':
      const pivotStatus = getPivotStatus(price, values.support, values.resistance)
      data.push({ label: '价格位置', value: pivotStatus.label, highlight: true })
      data.push({ label: '支撑位', value: values.support ? fmt(values.support, 2) : '计算中' })
      data.push({ label: '阻力位', value: values.resistance ? fmt(values.resistance, 2) : '计算中' })
      break
    case 'pattern':
      data.push({ label: '识别形态', value: values.pattern || '无明显形态', highlight: !!values.pattern })
      const monitoringPatterns = []
      if (params.pin_bar || params.pinbar) monitoringPatterns.push('锤子线')
      if (params.engulfing) monitoringPatterns.push('吞没')
      if (params.double_top) monitoringPatterns.push('双顶')
      if (params.double_bottom) monitoringPatterns.push('双底')
      if (monitoringPatterns.length > 0) data.push({ label: '监测形态', value: monitoringPatterns.join('、') })
      break
    case 'divergence':
      data.push({ label: '背离信号', value: values.divergence_type || '无背离', highlight: !!values.divergence_type })
      const monitoringDivergence = []
      if (params.use_rsi) monitoringDivergence.push('RSI背离')
      if (params.use_macd) monitoringDivergence.push('MACD背离')
      if (monitoringDivergence.length > 0) data.push({ label: '监测类型', value: monitoringDivergence.join('、') })
      break
    case 'funding_rate':
      data.push({ label: '当前费率', value: values.funding_rate !== undefined ? `${(values.funding_rate * 100).toFixed(4)}%` : '获取中', highlight: true })
      data.push({ label: '极端多头阈值', value: `${(params.positive_extreme * 100).toFixed(2)}%` })
      data.push({ label: '极端空头阈值', value: `${(params.negative_extreme * 100).toFixed(2)}%` })
      data.push({ label: '中性区间', value: `${(params.neutral_zone[0] * 100).toFixed(2)}% ~ ${(params.neutral_zone[1] * 100).toFixed(2)}%` })
      break
    case 'open_interest':
      data.push({ label: '持仓量变化', value: values.oi_change !== undefined ? `${values.oi_change.toFixed(2)}%` : '获取中', highlight: true })
      data.push({ label: '趋势周期', value: `${params.oi_trend_period}期` })
      data.push({ label: '增仓阈值', value: `${params.oi_increase_threshold}%` })
      data.push({ label: '减仓阈值', value: `${params.oi_decrease_threshold}%` })
      break
    case 'long_short_ratio':
      data.push({ label: '当前多空比', value: values.long_short_ratio !== undefined ? values.long_short_ratio.toFixed(2) : '获取中', highlight: true })
      data.push({ label: '极端多头比例', value: params.extreme_long.toFixed(1) })
      data.push({ label: '极端空头比例', value: params.extreme_short.toFixed(1) })
      break
  }
  return data
}

// ATR 波动状态
const getATRStatus = (atr, atrMa) => {
  if (!atr) return '计算中'
  if (!atrMa) return '正常'
  if (atr > atrMa * 1.5) return '高波动'
  if (atr < atrMa * 0.5) return '低波动'
  return '正常'
}

// 布林带价格位置
const getBollingerPosition = (price, upper, lower) => {
  if (!price || !upper || !lower) return { label: '计算中', signal: 'neutral' }
  const mid = (upper + lower) / 2
  const range = upper - lower
  if (price >= upper) return { label: '超买区 ↑', signal: 'bearish' }
  if (price <= lower) return { label: '超卖区 ↓', signal: 'bullish' }
  if (price > mid + range * 0.2) return { label: '偏高', signal: 'neutral' }
  if (price < mid - range * 0.2) return { label: '偏低', signal: 'neutral' }
  return { label: '中性区', signal: 'neutral' }
}

// 支撑阻力位价格位置
const getPivotStatus = (price, support, resistance) => {
  if (!price || !support || !resistance) return { label: '计算中', signal: 'neutral' }
  const range = resistance - support
  if (range <= 0) return { label: '计算中', signal: 'neutral' }
  if (price >= resistance) return { label: '突破阻力 ↑', signal: 'bullish' }
  if (price <= support) return { label: '跌破支撑 ↓', signal: 'bearish' }
  if (price > resistance - range * 0.1) return { label: '接近阻力', signal: 'bearish' }
  if (price < support + range * 0.1) return { label: '接近支撑', signal: 'bullish' }
  return { label: '区间震荡', signal: 'neutral' }
}

// 获取指标信号样式
const getSignalStyle = (indicator) => {
  const values = props.indicatorValues[indicator.type] || {}
  const price = props.indicatorValues.price
  let signal = 'neutral'

  switch (indicator.type) {
    case 'atr':
      const atrStatus = getATRStatus(values.atr, values.atr_ma)
      signal = atrStatus === '高波动' ? 'bullish' : atrStatus === '低波动' ? 'bearish' : 'neutral'
      break
    case 'bollinger':
      const bbPos = getBollingerPosition(price, values.bollinger_upper, values.bollinger_lower)
      signal = bbPos.signal
      break
    case 'pivot':
      const pivotStatus = getPivotStatus(price, values.support, values.resistance)
      signal = pivotStatus.signal
      break
    case 'pattern':
      if (values.pattern) signal = values.pattern_direction === 'bullish' ? 'bullish' : values.pattern_direction === 'bearish' ? 'bearish' : 'neutral'
      break
    case 'divergence':
      if (values.divergence_type) signal = values.divergence_type.includes('看涨') ? 'bullish' : values.divergence_type.includes('看跌') ? 'bearish' : 'neutral'
      break
  }

  const styles = {
    bullish: { label: '看涨', borderClass: 'border-green-200 bg-green-50/50', badgeClass: 'bg-green-500 text-white', textClass: 'text-green-600' },
    bearish: { label: '看跌', borderClass: 'border-red-200 bg-red-50/50', badgeClass: 'bg-red-500 text-white', textClass: 'text-red-600' },
    neutral: { label: '中性', borderClass: 'border-gray-200', badgeClass: 'bg-gray-200 text-gray-600', textClass: 'text-gray-600' }
  }
  return styles[signal]
}
</script>

