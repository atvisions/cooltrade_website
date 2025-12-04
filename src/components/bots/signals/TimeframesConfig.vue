<template>
  <Card>
    <div class="flex items-center gap-2 mb-4">
      <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="text-base font-semibold text-slate-900">时间周期配置</h3>
    </div>

    <div class="space-y-6">
      <!-- 信号触发设置 -->
      <div class="p-4 bg-slate-50 rounded-lg space-y-4">
        <div class="flex items-center gap-2 mb-2">
          <svg class="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span class="text-sm font-medium text-slate-700">信号触发设置</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- K线收盘确认 -->
          <div class="bg-white rounded-lg p-3 border border-slate-200">
            <div class="flex items-center justify-between mb-2">
              <label class="text-xs font-medium text-slate-700">K线收盘确认</label>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  :checked="triggerConfig.require_close"
                  @change="updateTrigger('require_close', $event.target.checked)"
                  class="sr-only peer"
                />
                <div class="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <p class="text-[10px] text-slate-500">{{ triggerConfig.require_close ? '等待K线收盘后确认' : '实时检测，立即触发' }}</p>
          </div>

          <!-- 信号冷却时间 -->
          <div class="bg-white rounded-lg p-3 border border-slate-200">
            <label class="text-xs font-medium text-slate-700 block mb-2">信号冷却时间</label>
            <div class="flex items-center gap-2">
              <select
                :value="triggerConfig.cooldown"
                @change="updateTrigger('cooldown', Number($event.target.value))"
                class="flex-1 px-2 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option :value="0">无冷却</option>
                <option :value="300">5 分钟</option>
                <option :value="600">10 分钟</option>
                <option :value="1800">30 分钟</option>
                <option :value="3600">1 小时</option>
                <option :value="7200">2 小时</option>
                <option :value="14400">4 小时</option>
              </select>
            </div>
            <p class="text-[10px] text-slate-500 mt-1">同一信号的最小间隔</p>
          </div>

          <!-- 重复提醒 -->
          <div class="bg-white rounded-lg p-3 border border-slate-200">
            <label class="text-xs font-medium text-slate-700 block mb-2">重复提醒</label>
            <select
              :value="triggerConfig.re_alert"
              @change="updateTrigger('re_alert', $event.target.value)"
              class="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
            >
              <option value="once">仅提醒一次</option>
              <option value="interval">间隔重复提醒</option>
              <option value="none">不提醒</option>
            </select>
            <select
              v-if="triggerConfig.re_alert === 'interval'"
              :value="triggerConfig.alert_interval"
              @change="updateTrigger('alert_interval', Number($event.target.value))"
              class="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option :value="60">每 1 分钟</option>
              <option :value="300">每 5 分钟</option>
              <option :value="600">每 10 分钟</option>
              <option :value="1800">每 30 分钟</option>
            </select>
          </div>
        </div>
      </div>

      <!-- 主时间周期 -->
      <div>
        <div class="flex items-baseline gap-2 mb-3">
          <label class="block text-sm font-medium text-slate-700">
            主时间周期 <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <button
              @mouseenter="showPrimaryTooltip = true"
              @mouseleave="showPrimaryTooltip = false"
              type="button"
              class="p-1 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <div
              v-if="showPrimaryTooltip"
              class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg z-50 pointer-events-none whitespace-nowrap"
            >
              用于计算技术指标的主要K线周期
              <div class="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></div>
            </div>
          </div>
        </div>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="tf in timeframes"
            :key="tf.value"
            type="button"
            @click="$emit('update:primary', tf.value)"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-all',
              timeframesConfig.primary === tf.value
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            ]"
          >
            {{ tf.label }}
          </button>
        </div>
      </div>

      <!-- 确认时间周期（多选） -->
      <div>
        <div class="flex items-baseline gap-2 mb-3">
          <label class="block text-sm font-medium text-slate-700">
            确认时间周期（多选）
          </label>
          <div class="relative">
            <button
              @mouseenter="showConfirmTooltip = true"
              @mouseleave="showConfirmTooltip = false"
              type="button"
              class="p-1 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <div
              v-if="showConfirmTooltip"
              class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg z-50 pointer-events-none"
              style="width: 200px"
            >
              <div>用于确认主周期信号的其他周期</div>
              <div>可选择多个周期进行多重确认</div>
              <div class="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></div>
            </div>
          </div>
        </div>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="tf in timeframes"
            :key="tf.value"
            type="button"
            @click="$emit('toggle-confirm', tf.value)"
            :disabled="tf.value === timeframesConfig.primary"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-all',
              timeframesConfig.confirm.includes(tf.value)
                ? 'bg-green-600 text-white shadow-sm'
                : tf.value === timeframesConfig.primary
                ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            ]"
          >
            {{ tf.label }}
            <span v-if="timeframesConfig.confirm.includes(tf.value)" class="ml-1">✓</span>
          </button>
        </div>
      </div>

      <!-- 确认逻辑 -->
      <div v-if="timeframesConfig.confirm.length > 0" class="space-y-4 pt-4 border-t border-slate-200">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-3">确认逻辑</label>
          <div class="space-y-2">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                :checked="!timeframesConfig.require_all_confirm"
                @change="$emit('update:require-all-confirm', false)"
                class="w-4 h-4 text-blue-600"
              />
              <span class="text-sm text-slate-700">部分确认（至少满足指定数量的确认周期）</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                :checked="timeframesConfig.require_all_confirm"
                @change="$emit('update:require-all-confirm', true)"
                class="w-4 h-4 text-blue-600"
              />
              <span class="text-sm text-slate-700">全部确认（所有确认周期都必须满足）</span>
            </label>
          </div>
        </div>

        <!-- 最少确认数量 -->
        <div v-if="!timeframesConfig.require_all_confirm && timeframesConfig.confirm.length > 1">
          <label class="block text-sm font-medium text-slate-700 mb-2">
            最少确认数量
            <span class="text-xs text-slate-500 block mt-1">至少需要几个确认周期满足条件</span>
          </label>
          <input
            :value="timeframesConfig.min_confirm_count"
            @input="$emit('update:min-confirm-count', $event.target.value)"
            type="number"
            :min="1"
            :max="timeframesConfig.confirm.length"
            class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <!-- 说明提示 -->
      <div class="p-4 bg-blue-50 border border-blue-100 rounded-lg">
        <div class="flex gap-3">
          <svg class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div class="text-sm text-slate-700 space-y-1.5">
            <p><span class="font-semibold text-slate-900">主时间周期</span>：用于计算指标的K线周期（如 1 小时 K 线）</p>
            <p><span class="font-semibold text-slate-900">确认时间周期</span>：用于多重确认信号的其他周期（如 4 小时、1 天）</p>
            <p class="text-blue-700 font-medium">💡 推荐：使用更大的周期确认信号，提高信号质量</p>
          </div>
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup>
import { ref, computed } from 'vue'
import Card from '../../common/ui/Card.vue'

const props = defineProps({
  timeframesConfig: {
    type: Object,
    required: true
  }
})

const emit = defineEmits([
  'update:primary',
  'toggle-confirm',
  'update:require-all-confirm',
  'update:min-confirm-count',
  'update:trigger'
])

// 注意：1分钟(1m)周期暂未支持技术指标计算，建议最小使用5分钟
const timeframes = [
  { value: '5m', label: '5分钟' },
  { value: '15m', label: '15分钟' },
  { value: '30m', label: '30分钟' },
  { value: '1h', label: '1小时' },
  { value: '4h', label: '4小时' },
  { value: '1d', label: '1天' }
]

const showPrimaryTooltip = ref(false)
const showConfirmTooltip = ref(false)

// 触发配置（带默认值）
const triggerConfig = computed(() => ({
  require_close: props.timeframesConfig.trigger?.require_close ?? true,
  cooldown: props.timeframesConfig.trigger?.cooldown ?? 1800,
  re_alert: props.timeframesConfig.trigger?.re_alert ?? 'once',
  alert_interval: props.timeframesConfig.trigger?.alert_interval ?? 300
}))

// 更新触发配置
const updateTrigger = (key, value) => {
  emit('update:trigger', {
    ...triggerConfig.value,
    [key]: value
  })
}
</script>

