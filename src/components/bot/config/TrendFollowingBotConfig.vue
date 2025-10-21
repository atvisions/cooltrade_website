<template>
  <div class="bg-green-50 rounded-lg p-4">
    <h4 class="font-semibold text-gray-900 mb-4">趋势跟踪机器人配置</h4>
    <p class="text-sm text-gray-600 mb-4">
      趋势跟踪机器人会自动识别市场趋势，在趋势形成时开仓，趋势反转时平仓。
    </p>

    <div class="space-y-4">
      <!-- 趋势识别方法 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">趋势识别方法</label>
        <select
          v-model="config.trend_method"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="ma_cross">移动平均线交叉</option>
          <option value="ema_cross">指数移动平均线交叉</option>
          <option value="macd">MACD</option>
          <option value="adx">ADX (平均趋向指标)</option>
        </select>
      </div>

      <!-- MA/EMA 交叉配置 -->
      <div v-if="config.trend_method === 'ma_cross' || config.trend_method === 'ema_cross'" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">短期周期</label>
            <input
              v-model.number="config.short_period"
              type="number"
              min="5"
              max="100"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">长期周期</label>
            <input
              v-model.number="config.long_period"
              type="number"
              min="10"
              max="200"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <!-- MACD 配置 -->
      <div v-if="config.trend_method === 'macd'" class="space-y-4">
        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">快线周期</label>
            <input
              v-model.number="config.macd_fast"
              type="number"
              min="5"
              max="50"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">慢线周期</label>
            <input
              v-model.number="config.macd_slow"
              type="number"
              min="10"
              max="100"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">信号线周期</label>
            <input
              v-model.number="config.macd_signal"
              type="number"
              min="5"
              max="50"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <!-- ADX 配置 -->
      <div v-if="config.trend_method === 'adx'" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">ADX 周期</label>
            <input
              v-model.number="config.adx_period"
              type="number"
              min="5"
              max="50"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">趋势强度阈值</label>
            <input
              v-model.number="config.adx_threshold"
              type="number"
              min="10"
              max="50"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p class="text-xs text-gray-500 mt-1">ADX > 阈值时认为趋势强劲</p>
          </div>
        </div>
      </div>

      <!-- 交易方向 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">交易方向</label>
        <select
          v-model="config.direction"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="both">双向 (做多和做空)</option>
          <option value="long">仅做多</option>
          <option value="short">仅做空</option>
        </select>
      </div>

      <!-- 时间框架 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">时间框架</label>
        <select
          v-model="config.timeframe"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="1m">1分钟</option>
          <option value="5m">5分钟</option>
          <option value="15m">15分钟</option>
          <option value="1h">1小时</option>
          <option value="4h">4小时</option>
          <option value="1d">1天</option>
        </select>
      </div>

      <!-- 加仓策略 -->
      <div class="bg-white rounded-lg p-4">
        <h5 class="font-medium text-gray-900 mb-3">加仓策略</h5>
        <div class="space-y-4">
          <label class="flex items-center">
            <input
              type="checkbox"
              v-model="config.enable_pyramiding"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span class="ml-2 text-sm text-gray-700">启用加仓</span>
          </label>

          <div v-if="config.enable_pyramiding" class="space-y-4 pl-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">最大加仓次数</label>
              <input
                v-model.number="config.max_pyramiding"
                type="number"
                min="1"
                max="10"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">加仓间隔 (%)</label>
              <input
                v-model.number="config.pyramiding_interval"
                type="number"
                step="0.1"
                min="0.5"
                max="10"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p class="text-xs text-gray-500 mt-1">价格变动达到此百分比时加仓</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 移动止损 -->
      <div class="bg-white rounded-lg p-4">
        <h5 class="font-medium text-gray-900 mb-3">移动止损</h5>
        <div class="space-y-4">
          <label class="flex items-center">
            <input
              type="checkbox"
              v-model="config.enable_trailing_stop"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span class="ml-2 text-sm text-gray-700">启用移动止损</span>
          </label>

          <div v-if="config.enable_trailing_stop" class="space-y-4 pl-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">移动止损距离 (%)</label>
              <input
                v-model.number="config.trailing_stop_distance"
                type="number"
                step="0.1"
                min="0.5"
                max="20"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p class="text-xs text-gray-500 mt-1">止损线跟随价格移动，保持此距离</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">激活阈值 (%)</label>
              <input
                v-model.number="config.trailing_stop_activation"
                type="number"
                step="0.1"
                min="0"
                max="50"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p class="text-xs text-gray-500 mt-1">盈利达到此百分比时激活移动止损</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 过滤条件 -->
      <div class="bg-white rounded-lg p-4">
        <h5 class="font-medium text-gray-900 mb-3">过滤条件</h5>
        <div class="space-y-4">
          <label class="flex items-center">
            <input
              type="checkbox"
              v-model="config.filter_volume"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span class="ml-2 text-sm text-gray-700">成交量过滤</span>
          </label>

          <div v-if="config.filter_volume" class="pl-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">最小成交量倍数</label>
            <input
              v-model.number="config.min_volume_multiplier"
              type="number"
              step="0.1"
              min="0.5"
              max="5"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p class="text-xs text-gray-500 mt-1">成交量必须大于平均值的此倍数</p>
          </div>
        </div>
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
  trend_method: 'ma_cross',
  short_period: 20,
  long_period: 50,
  macd_fast: 12,
  macd_slow: 26,
  macd_signal: 9,
  adx_period: 14,
  adx_threshold: 25,
  direction: 'both',
  timeframe: '1h',
  enable_pyramiding: false,
  max_pyramiding: 3,
  pyramiding_interval: 2,
  enable_trailing_stop: true,
  trailing_stop_distance: 2,
  trailing_stop_activation: 3,
  filter_volume: false,
  min_volume_multiplier: 1.5,
  ...props.modelValue
})

// 监听配置变化
watch(config, (newValue) => {
  emit('update:modelValue', newValue)
}, { deep: true })
</script>

