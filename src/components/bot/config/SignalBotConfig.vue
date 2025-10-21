<template>
  <div class="bg-blue-50 rounded-lg p-4">
    <h4 class="font-semibold text-gray-900 mb-4">信号机器人配置</h4>
    <p class="text-sm text-gray-600 mb-4">
      信号机器人会监控市场条件，当满足设定的条件时发送通知，不会自动执行交易。
    </p>

    <div class="space-y-4">
      <!-- 信号类型 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">信号类型</label>
        <select
          v-model="config.signal_type"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="price_alert">价格提醒</option>
          <option value="indicator_alert">指标提醒</option>
          <option value="volume_alert">成交量提醒</option>
        </select>
      </div>

      <!-- 价格提醒配置 -->
      <div v-if="config.signal_type === 'price_alert'" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">条件</label>
          <select
            v-model="config.condition"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="above">高于</option>
            <option value="below">低于</option>
            <option value="crosses_above">向上突破</option>
            <option value="crosses_below">向下突破</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">目标价格 (USDT)</label>
          <input
            v-model.number="config.target_price"
            type="number"
            step="0.01"
            placeholder="输入目标价格"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <!-- 指标提醒配置 -->
      <div v-if="config.signal_type === 'indicator_alert'" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">技术指标</label>
          <select
            v-model="config.indicator"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="rsi">RSI (相对强弱指标)</option>
            <option value="macd">MACD (指数平滑移动平均线)</option>
            <option value="ma_cross">MA交叉 (移动平均线交叉)</option>
            <option value="bollinger">布林带</option>
          </select>
        </div>

        <!-- RSI 配置 -->
        <div v-if="config.indicator === 'rsi'" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">RSI 周期</label>
            <input
              v-model.number="config.rsi_period"
              type="number"
              min="5"
              max="50"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">超买阈值</label>
              <input
                v-model.number="config.rsi_overbought"
                type="number"
                min="50"
                max="100"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">超卖阈值</label>
              <input
                v-model.number="config.rsi_oversold"
                type="number"
                min="0"
                max="50"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <!-- MA交叉配置 -->
        <div v-if="config.indicator === 'ma_cross'" class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">短期均线周期</label>
            <input
              v-model.number="config.ma_short_period"
              type="number"
              min="5"
              max="100"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">长期均线周期</label>
            <input
              v-model.number="config.ma_long_period"
              type="number"
              min="10"
              max="200"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <!-- 成交量提醒配置 -->
      <div v-if="config.signal_type === 'volume_alert'" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">成交量倍数</label>
          <input
            v-model.number="config.volume_multiplier"
            type="number"
            step="0.1"
            min="1"
            placeholder="相对于平均成交量的倍数"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p class="text-xs text-gray-500 mt-1">例如：2 表示成交量是平均值的2倍时触发</p>
        </div>
      </div>

      <!-- 通知渠道 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">通知渠道</label>
        <div class="space-y-2">
          <label class="flex items-center">
            <input
              type="checkbox"
              v-model="config.notify_email"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span class="ml-2 text-sm text-gray-700">邮件通知</span>
          </label>
          <label class="flex items-center">
            <input
              type="checkbox"
              v-model="config.notify_app"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span class="ml-2 text-sm text-gray-700">应用内通知</span>
          </label>
        </div>
      </div>

      <!-- 检查频率 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">检查频率</label>
        <select
          v-model="config.check_interval"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="1m">每分钟</option>
          <option value="5m">每5分钟</option>
          <option value="15m">每15分钟</option>
          <option value="1h">每小时</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

// Props
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  }
})

// Emits
const emit = defineEmits(['update:modelValue'])

// 配置数据
const config = ref({
  signal_type: 'price_alert',
  condition: 'above',
  target_price: null,
  indicator: 'rsi',
  rsi_period: 14,
  rsi_overbought: 70,
  rsi_oversold: 30,
  ma_short_period: 20,
  ma_long_period: 50,
  volume_multiplier: 2,
  notify_email: true,
  notify_app: true,
  check_interval: '5m',
  ...props.modelValue
})

// 监听配置变化
watch(config, (newValue) => {
  emit('update:modelValue', newValue)
}, { deep: true })
</script>

