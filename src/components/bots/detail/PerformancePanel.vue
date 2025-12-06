<template>
  <div class="space-y-6">
    <!-- 核心指标 -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-100 p-4">
        <p class="text-xs text-emerald-600 mb-1">总盈亏</p>
        <p :class="['text-2xl font-bold', bot?.total_profit >= 0 ? 'text-emerald-600' : 'text-red-600']">
          {{ formatCurrency(bot?.total_profit) }}
        </p>
        <p class="text-xs text-gray-500 mt-1">
          {{ bot?.total_profit_percentage >= 0 ? '+' : '' }}{{ bot?.total_profit_percentage || 0 }}%
        </p>
      </div>

      <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-4">
        <p class="text-xs text-blue-600 mb-1">胜率</p>
        <p class="text-2xl font-bold text-blue-600">{{ bot?.win_rate || 0 }}%</p>
        <p class="text-xs text-gray-500 mt-1">{{ bot?.winning_trades || 0 }}胜 / {{ bot?.losing_trades || 0 }}负</p>
      </div>

      <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100 p-4">
        <p class="text-xs text-purple-600 mb-1">总交易</p>
        <p class="text-2xl font-bold text-purple-600">{{ bot?.total_trades || 0 }}</p>
        <p class="text-xs text-gray-500 mt-1">笔</p>
      </div>

      <div class="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100 p-4">
        <p class="text-xs text-amber-600 mb-1">运行时长</p>
        <p class="text-2xl font-bold text-amber-600">{{ runningDays }}</p>
        <p class="text-xs text-gray-500 mt-1">天</p>
      </div>
    </div>

    <!-- 详细统计 -->
    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div class="px-5 py-3 border-b border-gray-100 bg-gray-50">
        <h4 class="text-sm font-semibold text-gray-900">详细统计</h4>
      </div>
      <div class="p-5 grid grid-cols-2 gap-4">
        <div class="flex justify-between items-center py-2 border-b border-gray-100">
          <span class="text-sm text-gray-500">盈利交易</span>
          <span class="text-sm font-medium text-emerald-600">{{ bot?.winning_trades || 0 }}笔</span>
        </div>
        <div class="flex justify-between items-center py-2 border-b border-gray-100">
          <span class="text-sm text-gray-500">亏损交易</span>
          <span class="text-sm font-medium text-red-600">{{ bot?.losing_trades || 0 }}笔</span>
        </div>
        <div class="flex justify-between items-center py-2 border-b border-gray-100">
          <span class="text-sm text-gray-500">首次交易</span>
          <span class="text-sm font-medium text-gray-900">{{ formatDate(bot?.started_at) }}</span>
        </div>
        <div class="flex justify-between items-center py-2 border-b border-gray-100">
          <span class="text-sm text-gray-500">最后交易</span>
          <span class="text-sm font-medium text-gray-900">{{ formatDate(bot?.last_trade_at) }}</span>
        </div>
        <div class="flex justify-between items-center py-2 border-b border-gray-100">
          <span class="text-sm text-gray-500">今日交易</span>
          <span class="text-sm font-medium text-gray-900">{{ bot?.trend_following_bot?.today_trades_count || 0 }}笔</span>
        </div>
        <div class="flex justify-between items-center py-2 border-b border-gray-100">
          <span class="text-sm text-gray-500">今日盈亏</span>
          <span :class="['text-sm font-medium', (bot?.trend_following_bot?.today_pnl || 0) >= 0 ? 'text-emerald-600' : 'text-red-600']">
            {{ formatCurrency(bot?.trend_following_bot?.today_pnl) }}
          </span>
        </div>
      </div>
    </div>

    <!-- 配置信息 -->
    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div class="px-5 py-3 border-b border-gray-100 bg-gray-50">
        <h4 class="text-sm font-semibold text-gray-900">交易配置</h4>
      </div>
      <div class="p-5 grid grid-cols-2 gap-4">
        <div class="flex justify-between items-center py-2 border-b border-gray-100">
          <span class="text-sm text-gray-500">仓位大小</span>
          <span class="text-sm font-medium text-gray-900">{{ positionSizeText }}</span>
        </div>
        <div class="flex justify-between items-center py-2 border-b border-gray-100">
          <span class="text-sm text-gray-500">杠杆</span>
          <span class="text-sm font-medium text-gray-900">{{ bot?.leverage || 1 }}x</span>
        </div>
        <div class="flex justify-between items-center py-2 border-b border-gray-100">
          <span class="text-sm text-gray-500">止损</span>
          <span class="text-sm font-medium" :class="stopLossValue ? 'text-red-600' : 'text-gray-400'">
            {{ stopLossValue ? `${stopLossValue}%` : '未启用' }}
          </span>
        </div>
        <div class="flex justify-between items-center py-2 border-b border-gray-100">
          <span class="text-sm text-gray-500">止盈</span>
          <span class="text-sm font-medium" :class="takeProfitValue ? 'text-emerald-600' : 'text-gray-400'">
            {{ takeProfitValue ? `${takeProfitValue}%` : '未启用' }}
          </span>
        </div>
        <div class="flex justify-between items-center py-2 border-b border-gray-100">
          <span class="text-sm text-gray-500">追踪止损</span>
          <span class="text-sm font-medium" :class="trailingStopEnabled ? 'text-emerald-600' : 'text-gray-400'">
            {{ trailingStopEnabled ? '已启用' : '未启用' }}
          </span>
        </div>
        <div class="flex justify-between items-center py-2 border-b border-gray-100">
          <span class="text-sm text-gray-500">保本止损</span>
          <span class="text-sm font-medium" :class="breakevenEnabled ? 'text-emerald-600' : 'text-gray-400'">
            {{ breakevenEnabled ? '已启用' : '未启用' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  bot: { type: Object, default: null }
})

const runningDays = computed(() => {
  if (!props.bot?.started_at) return 0
  const start = new Date(props.bot.started_at)
  const end = props.bot.stopped_at ? new Date(props.bot.stopped_at) : new Date()
  return Math.floor((end - start) / (1000 * 60 * 60 * 24))
})

const positionSizeText = computed(() => {
  const tfBot = props.bot?.trend_following_bot
  if (!tfBot) return '-'
  const method = tfBot.position_sizing_method
  const value = tfBot.position_size_value
  if (method === 'fixed_amount') return `${value} USDT`
  if (method === 'fixed_percent') return `${value}%`
  return `${value}`
})

// 止损值：优先从 config 获取，否则用旧字段
const stopLossValue = computed(() => {
  const tfBot = props.bot?.trend_following_bot
  if (!tfBot?.stop_loss_enabled) return null
  return tfBot.stop_loss_config?.value || tfBot.stop_loss_percentage || null
})

// 止盈值：优先从 config 获取，否则用旧字段
const takeProfitValue = computed(() => {
  const tfBot = props.bot?.trend_following_bot
  if (!tfBot?.take_profit_enabled) return null
  return tfBot.take_profit_config?.single_value || tfBot.take_profit_percentage || null
})

// 追踪止损：从 config 或旧字段获取
const trailingStopEnabled = computed(() => {
  const tfBot = props.bot?.trend_following_bot
  return tfBot?.trailing_stop_config?.enabled || tfBot?.trailing_stop_enabled || false
})

// 保本止损：从 config 或旧字段获取
const breakevenEnabled = computed(() => {
  const tfBot = props.bot?.trend_following_bot
  return tfBot?.breakeven_config?.enabled || tfBot?.breakeven_enabled || false
})

const formatCurrency = (value) => {
  if (!value && value !== 0) return '$0.00'
  const num = Number(value)
  return num >= 0 ? `$${num.toFixed(2)}` : `-$${Math.abs(num).toFixed(2)}`
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
}
</script>

