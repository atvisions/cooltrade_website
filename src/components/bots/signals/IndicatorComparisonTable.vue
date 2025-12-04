<template>
  <div class="space-y-4">
    <!-- 条件对比型指标 -->
    <div v-if="conditionIndicators.length > 0" class="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <!-- 标题栏 -->
      <div class="px-5 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div class="flex items-center gap-3">
          <h2 class="text-sm font-semibold text-slate-800">条件判断</h2>
          <span class="text-xs text-slate-500">
            {{ satisfiedCount }}/{{ conditionIndicators.length }} 满足
            <span class="ml-1 text-slate-400">({{ requireAll ? 'AND' : 'OR' }})</span>
          </span>
          <!-- 显示当前时间周期 -->
          <span v-if="indicatorValues?.timeframe" class="px-2 py-0.5 text-[10px] font-medium bg-blue-100 text-blue-700 rounded">
            {{ getTimeframeLabel(indicatorValues.timeframe) }}
          </span>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-[10px] text-slate-400">{{ updatedAt ? formatDate(updatedAt) : '—' }}</span>
          <button @click="$emit('refresh')" :disabled="loading" class="px-2.5 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded transition-colors disabled:opacity-50">
            <svg v-if="!loading" class="w-3.5 h-3.5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <svg v-else class="w-3.5 h-3.5 inline mr-1 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity="0.25"></circle>
              <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            刷新
          </button>
        </div>
      </div>

      <!-- 对比表格 -->
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-slate-50 border-b border-slate-200">
            <tr>
              <th class="px-4 py-2.5 text-left text-xs font-semibold text-slate-600">指标 / 条件</th>
              <th class="px-4 py-2.5 text-center text-xs font-semibold text-slate-600 w-28">设定值</th>
              <th class="px-4 py-2.5 text-center text-xs font-semibold text-slate-600 w-28">当前值</th>
              <th class="px-4 py-2.5 text-center text-xs font-semibold text-slate-600 w-16">状态</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <template v-for="(indicator, idx) in conditionIndicators" :key="idx">
              <!-- 指标标题行 -->
              <tr :class="isIndicatorSatisfied(indicator) ? 'bg-green-50' : 'bg-white'">
                <td colspan="4" class="px-4 py-2">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span :class="['w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold', isIndicatorSatisfied(indicator) ? 'bg-green-500 text-white' : 'bg-slate-300 text-slate-600']">
                        {{ isIndicatorSatisfied(indicator) ? '✓' : idx + 1 }}
                      </span>
                      <span class="text-sm font-semibold text-slate-800">{{ getIndicatorLabel(indicator.type) }}</span>
                      <span class="text-[10px] text-slate-500 ml-1">{{ getIndicatorConfig(indicator) }}</span>
                      <span class="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">权重 {{ getWeightPercent(indicator) }}%</span>
                    </div>
                    <span :class="['px-2 py-0.5 rounded text-[10px] font-semibold', isIndicatorSatisfied(indicator) ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-600']">
                      {{ isIndicatorSatisfied(indicator) ? '满足' : '未满足' }}
                    </span>
                  </div>
                </td>
              </tr>
              <!-- 条件行 -->
              <tr v-for="(cond, cIdx) in getConditions(indicator)" :key="`${idx}-${cIdx}`" class="hover:bg-slate-50">
                <td class="px-4 py-1.5 text-xs text-slate-600 pl-10">{{ cond.label }}</td>
                <td class="px-4 py-1.5 text-center">
                  <span class="text-xs font-mono text-blue-600">{{ cond.operator }} {{ cond.threshold }}</span>
                </td>
                <td class="px-4 py-1.5 text-center">
                  <span :class="['text-xs font-mono', cond.statusColor || 'text-slate-700']">{{ cond.currentValue }}</span>
                </td>
                <td class="px-4 py-1.5 text-center">
                  <span :class="checkMet(cond) ? 'text-green-500' : 'text-red-400'">
                    {{ checkMet(cond) ? '✓' : '✗' }}
                  </span>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 市场状态监测 -->
    <div v-if="infoIndicators.length > 0" class="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div class="px-5 py-3 border-b border-slate-200 bg-slate-50">
        <h2 class="text-sm font-semibold text-slate-800">市场状态监测</h2>
      </div>
      <div class="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="(indicator, idx) in infoIndicators" :key="idx"
          :class="['border rounded-lg p-3', getSignalStyle(indicator).borderClass]">
          <!-- 标题和信号状态 -->
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <span class="text-sm font-semibold text-slate-800">{{ getIndicatorLabel(indicator.type) }}</span>
              <span class="text-[10px] text-slate-400">{{ getIndicatorConfig(indicator) }}</span>
            </div>
            <span :class="['px-2 py-0.5 rounded text-[10px] font-semibold', getSignalStyle(indicator).badgeClass]">
              {{ getSignalStyle(indicator).label }}
            </span>
          </div>
          <!-- 数据详情 -->
          <div class="space-y-1">
            <div v-for="(info, iIdx) in getInfoData(indicator)" :key="iIdx" class="flex justify-between items-center text-xs">
              <span class="text-slate-500">{{ info.label }}</span>
              <span :class="['font-mono', info.highlight ? getSignalStyle(indicator).textClass : 'text-slate-700']">{{ info.value }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="enabledIndicators.length === 0" class="bg-white rounded-xl border border-slate-200 py-8 text-center">
      <p class="text-sm text-slate-400">暂无启用的指标配置</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  indicators: { type: Array, default: () => [] },
  indicatorValues: { type: Object, default: () => ({}) },
  requireAll: { type: Boolean, default: true },
  loading: { type: Boolean, default: false },
  updatedAt: { type: String, default: null }
})

defineEmits(['refresh'])

// 条件判断型指标（有设定值，需要对比）
const conditionTypes = ['rsi', 'macd', 'ma_crossover', 'volume', 'trend_bias']
// 信息展示型指标（只显示当前状态）
const infoTypes = ['atr', 'bollinger', 'pivot', 'pattern', 'divergence', 'funding_rate', 'open_interest', 'long_short_ratio']

const enabledIndicators = computed(() => props.indicators.filter(i => i.enabled))
const conditionIndicators = computed(() => enabledIndicators.value.filter(i => conditionTypes.includes(i.type)))
const infoIndicators = computed(() => enabledIndicators.value.filter(i => infoTypes.includes(i.type)))
const totalCount = computed(() => enabledIndicators.value.length)
const satisfiedCount = computed(() => conditionIndicators.value.filter(i => isIndicatorSatisfied(i)).length)

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

// 时间周期标签
const getTimeframeLabel = (tf) => {
  const labels = {
    '1m': '1分钟K线',
    '5m': '5分钟K线',
    '15m': '15分钟K线',
    '30m': '30分钟K线',
    '1h': '1小时K线',
    '4h': '4小时K线',
    '1d': '日线',
    '1w': '周线'
  }
  return labels[tf] || tf
}

const indicatorLabels = {
  rsi: 'RSI 相对强弱',
  macd: 'MACD 趋势',
  ma_crossover: 'MA 均线交叉',
  volume: '成交量',
  atr: 'ATR 波动率',
  bollinger: '布林带',
  pivot: '支撑阻力位',
  pattern: 'K线形态',
  divergence: '背离',
  // 合约专用指标
  funding_rate: '资金费率',
  open_interest: '持仓量',
  long_short_ratio: '多空比',
  // 趋势过滤器
  trend_bias: '趋势偏向'
}

// 指标默认参数（用于显示时合并）
const indicatorDefaults = {
  rsi: { period: 14, overbought: 70, oversold: 30 },
  macd: { fast: 12, slow: 26, signal: 9 },
  ma_crossover: { fast: 7, slow: 25 },
  atr: { period: 14, threshold: 2.0 },
  volume: { multiplier: 2.0, period: 20 },
  bollinger: { period: 20, std: 2, squeeze_threshold: 0.03 },
  pivot: { pivot_left: 3, pivot_right: 3 },
  pattern: { pinbar: true, engulfing: true, double_top: true, double_bottom: true },
  divergence: { divergence_lookback: 5, use_rsi: true, use_macd: true },
  // 合约专用指标
  funding_rate: { positive_extreme: 0.01, negative_extreme: -0.01, neutral_zone: [-0.002, 0.002] },
  open_interest: { oi_trend_period: 20, oi_increase_threshold: 5, oi_decrease_threshold: -5 },
  long_short_ratio: { extreme_long: 2.0, extreme_short: 0.5 },
  // 趋势过滤器
  trend_bias: { fast_ma: 50, slow_ma: 200, bias_filter: true }
}

// 获取指标参数（合并默认值）
const getIndicatorParams = (indicator) => {
  const defaults = indicatorDefaults[indicator.type] || {}
  const userParams = indicator.params || {}
  return { ...defaults, ...userParams }
}

const getIndicatorLabel = (type) => indicatorLabels[type] || type

// 获取指标配置说明（显示在标题旁边）
const getIndicatorConfig = (indicator) => {
  const params = getIndicatorParams(indicator)
  switch (indicator.type) {
    case 'rsi':
      return `(${params.period || 14})`
    case 'macd':
      return `(${params.fast || 12}/${params.slow || 26}/${params.signal || 9})`
    case 'ma_crossover':
      return `(${params.fast || 7}/${params.slow || 25})`
    case 'volume':
      return `(${params.period || 20}, ${params.multiplier || 1.5}x)`
    case 'atr':
      return `(${params.period || 14})`
    case 'bollinger':
      return `(${params.period || 20}, ${params.std || params.std_dev || 2}σ)`
    case 'pivot':
      return `(L${params.pivot_left || 3}/R${params.pivot_right || 3})`
    case 'pattern':
      // 显示用户选择的形态类型
      const selectedPatterns = []
      if (params.pin_bar || params.pinbar) selectedPatterns.push('锤子线')
      if (params.engulfing) selectedPatterns.push('吞没')
      if (params.double_top) selectedPatterns.push('双顶')
      if (params.double_bottom) selectedPatterns.push('双底')
      return selectedPatterns.length > 0 ? `(${selectedPatterns.join('/')})` : `(${params.lookback || 5}K)`
    case 'divergence':
      return params.use_rsi && params.use_macd ? '(RSI+MACD)' : params.use_rsi ? '(RSI)' : params.use_macd ? '(MACD)' : ''
    // 合约专用指标
    case 'funding_rate':
      return `(${params.negative_extreme || -0.01}~${params.positive_extreme || 0.01})`
    case 'open_interest':
      return `(${params.oi_trend_period || 20}期, ${params.oi_decrease_threshold || -5}%~${params.oi_increase_threshold || 5}%)`
    case 'long_short_ratio':
      return `(${params.extreme_short || 0.5}~${params.extreme_long || 2.0})`
    // 趋势过滤器
    case 'trend_bias':
      return `(MA${params.fast_ma || 50}/${params.slow_ma || 200})`
    default:
      return ''
  }
}

const getWeightPercent = (indicator) => {
  const totalWeight = enabledIndicators.value.reduce((sum, i) => sum + (i.weight || 1), 0)
  return totalWeight > 0 ? Math.round((indicator.weight || 1) / totalWeight * 100) : 0
}

// 简化的条件判断
const isIndicatorSatisfied = (indicator) => {
  const values = props.indicatorValues[indicator.type] || {}
  const params = indicator.params || {}

  switch (indicator.type) {
    case 'rsi':
      if (params.oversold && values.rsi < params.oversold) return true
      if (params.overbought && values.rsi > params.overbought) return true
      return false
    case 'macd':
      return values.macd_histogram > 0
    case 'ma_crossover':
      const fast = values[`ma_${params.fast || 7}`]
      const slow = values[`ma_${params.slow || 25}`]
      return fast && slow && fast > slow
    case 'volume':
      return values.volume > (values.volume_ma || 0) * (params.multiplier || 1.5)

    default:
      return false
  }
}

// 格式化数值
const fmt = (v) => v !== undefined && v !== null ? (typeof v === 'number' ? v.toFixed(2) : v) : '--'

// 获取条件型指标的判断条件（用于表格对比）
const getConditions = (indicator) => {
  const values = props.indicatorValues[indicator.type] || {}
  const params = indicator.params || {}
  const conditions = []

  switch (indicator.type) {
    case 'rsi':
      if (params.oversold) conditions.push({ label: 'RSI 超卖', currentValue: fmt(values.rsi), operator: '<', threshold: params.oversold })
      if (params.overbought) conditions.push({ label: 'RSI 超买', currentValue: fmt(values.rsi), operator: '>', threshold: params.overbought })
      break
    case 'macd':
      conditions.push({ label: 'MACD 柱状图', currentValue: fmt(values.macd_histogram), operator: '>', threshold: 0 })
      break
    case 'ma_crossover':
      const maFast = values[`ma_${params.fast || 7}`] || values.ma_7
      const maSlow = values[`ma_${params.slow || 25}`] || values.ma_25
      conditions.push({
        label: '金叉/死叉',
        currentValue: maFast && maSlow ? (maFast > maSlow ? '金叉' : '死叉') : '--',
        operator: '=',
        threshold: '金叉',
        isCross: true,
        fastVal: maFast,
        slowVal: maSlow,
        detail: `MA${params.fast||7}: ${fmt(maFast)} / MA${params.slow||25}: ${fmt(maSlow)}`
      })
      break
    case 'volume':
      const volMa = values.volume_ma || 0
      const volThreshold = volMa * (params.multiplier || 1.5)
      conditions.push({
        label: '成交量激增',
        currentValue: fmt(values.volume),
        operator: '>',
        threshold: volThreshold > 0 ? Math.round(volThreshold) : '--'
      })
      break
    case 'trend_bias':
      const trendFastMa = values[`ma_${params.fast_ma || 50}`] || values.ma_50
      const trendSlowMa = values[`ma_${params.slow_ma || 200}`] || values.ma_200
      const currentTrend = trendFastMa && trendSlowMa ? (trendFastMa > trendSlowMa ? '上升趋势' : '下降趋势') : '--'
      conditions.push({
        label: '趋势方向',
        currentValue: currentTrend,
        operator: '=',
        threshold: '上升趋势',
        isCross: true,
        fastVal: trendFastMa,
        slowVal: trendSlowMa,
        detail: `MA${params.fast_ma||50}: ${fmt(trendFastMa)} / MA${params.slow_ma||200}: ${fmt(trendSlowMa)}`
      })
      break
  }
  return conditions
}

// 获取信息展示型指标的数据（用于卡片展示）
const getInfoData = (indicator) => {
  const values = props.indicatorValues[indicator.type] || {}
  const price = props.indicatorValues.price
  const data = []

  switch (indicator.type) {
    case 'atr':
      data.push({ label: 'ATR 值', value: fmt(values.atr), highlight: true })
      data.push({ label: '波动状态', value: getATRStatus(values.atr, values.atr_ma), highlight: true })
      break
    case 'bollinger':
      const bbPos = getBollingerPosition(price, values.bollinger_upper, values.bollinger_lower)
      data.push({ label: '价格位置', value: bbPos.label, highlight: true })
      data.push({ label: '上轨', value: fmt(values.bollinger_upper) })
      data.push({ label: '下轨', value: fmt(values.bollinger_lower) })
      break
    case 'pivot':
      const pivotStatus = getPivotStatus(price, values.support, values.resistance)
      data.push({ label: '价格位置', value: pivotStatus.label, highlight: true })
      data.push({ label: '支撑位', value: values.support ? fmt(values.support) : '计算中' })
      data.push({ label: '阻力位', value: values.resistance ? fmt(values.resistance) : '计算中' })
      break
    case 'pattern':
      // 显示识别结果
      data.push({ label: '识别形态', value: values.pattern || '无明显形态', highlight: !!values.pattern })
      // 显示监测的形态列表（使用合并后的参数）
      const params_p = getIndicatorParams(indicator)
      const monitoringPatterns = []
      if (params_p.pin_bar || params_p.pinbar) monitoringPatterns.push('锤子线')
      if (params_p.engulfing) monitoringPatterns.push('吞没')
      if (params_p.double_top) monitoringPatterns.push('双顶')
      if (params_p.double_bottom) monitoringPatterns.push('双底')
      if (monitoringPatterns.length > 0) {
        data.push({ label: '监测形态', value: monitoringPatterns.join('、') })
      }
      break
    case 'divergence':
      // 显示识别结果
      data.push({ label: '背离信号', value: values.divergence_type || '无背离', highlight: !!values.divergence_type })
      // 显示监测的背离类型（使用合并后的参数）
      const params_d = getIndicatorParams(indicator)
      const monitoringDivergence = []
      if (params_d.use_rsi) monitoringDivergence.push('RSI背离')
      if (params_d.use_macd) monitoringDivergence.push('MACD背离')
      if (monitoringDivergence.length > 0) {
        data.push({ label: '监测类型', value: monitoringDivergence.join('、') })
      }
      break
    // 合约专用指标
    case 'funding_rate':
      const params_fr = getIndicatorParams(indicator)
      data.push({ label: '当前费率', value: values.funding_rate !== undefined ? `${(values.funding_rate * 100).toFixed(4)}%` : '获取中', highlight: true })
      data.push({ label: '极端多头阈值', value: `${(params_fr.positive_extreme * 100).toFixed(2)}%` })
      data.push({ label: '极端空头阈值', value: `${(params_fr.negative_extreme * 100).toFixed(2)}%` })
      data.push({ label: '中性区间', value: `${(params_fr.neutral_zone[0] * 100).toFixed(2)}% ~ ${(params_fr.neutral_zone[1] * 100).toFixed(2)}%` })
      break
    case 'open_interest':
      const params_oi = getIndicatorParams(indicator)
      data.push({ label: '持仓量变化', value: values.oi_change !== undefined ? `${values.oi_change.toFixed(2)}%` : '获取中', highlight: true })
      data.push({ label: '趋势周期', value: `${params_oi.oi_trend_period}期` })
      data.push({ label: '增仓阈值', value: `${params_oi.oi_increase_threshold}%` })
      data.push({ label: '减仓阈值', value: `${params_oi.oi_decrease_threshold}%` })
      break
    case 'long_short_ratio':
      const params_lsr = getIndicatorParams(indicator)
      data.push({ label: '当前多空比', value: values.long_short_ratio !== undefined ? values.long_short_ratio.toFixed(2) : '获取中', highlight: true })
      data.push({ label: '极端多头比例', value: params_lsr.extreme_long.toFixed(1) })
      data.push({ label: '极端空头比例', value: params_lsr.extreme_short.toFixed(1) })
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
  let signal = 'neutral' // bullish, bearish, neutral

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
      if (values.pattern) {
        signal = values.pattern_direction === 'bullish' ? 'bullish' : values.pattern_direction === 'bearish' ? 'bearish' : 'neutral'
      }
      break
    case 'divergence':
      if (values.divergence_type) {
        signal = values.divergence_type.includes('看涨') ? 'bullish' : values.divergence_type.includes('看跌') ? 'bearish' : 'neutral'
      }
      break
  }

  const styles = {
    bullish: {
      label: '看涨',
      borderClass: 'border-green-200 bg-green-50/50',
      badgeClass: 'bg-green-500 text-white',
      textClass: 'text-green-600'
    },
    bearish: {
      label: '看跌',
      borderClass: 'border-red-200 bg-red-50/50',
      badgeClass: 'bg-red-500 text-white',
      textClass: 'text-red-600'
    },
    neutral: {
      label: '中性',
      borderClass: 'border-slate-200',
      badgeClass: 'bg-slate-200 text-slate-600',
      textClass: 'text-slate-600'
    }
  }
  return styles[signal]
}

// 检查单个条件是否满足
const checkMet = (cond) => {
  if (cond.isCross) {
    return cond.fastVal && cond.slowVal && cond.fastVal > cond.slowVal
  }
  const current = parseFloat(String(cond.currentValue).replace(/[^\d.-]/g, ''))
  const threshold = parseFloat(String(cond.threshold).replace(/[^\d.-]/g, ''))
  if (isNaN(current) || isNaN(threshold)) return false
  return cond.operator === '>' ? current > threshold : cond.operator === '<' ? current < threshold : false
}
</script>

