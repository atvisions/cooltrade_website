<template>
  <Card>
    <div class="flex items-center gap-3 mb-6">
      <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
        <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div>
        <h3 class="text-base font-semibold text-slate-900">信号质量控制</h3>
        <p class="text-sm text-slate-500">过滤假信号，提高信号可靠性</p>
      </div>
    </div>

    <div class="space-y-6">
      <!-- 功能说明 -->
      <div class="bg-blue-50 rounded-lg p-3 text-xs text-slate-600 border border-blue-200">
        <div class="flex items-start gap-2">
          <svg class="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p class="font-medium text-slate-700 mb-1">什么是信号质量控制？</p>
            <p>通过K线确认、信号强度阈值和过期时间等机制，过滤掉短暂的假信号，只保留高质量的交易信号。</p>
          </div>
        </div>
      </div>

      <!-- 信号确认K线数 -->
      <div>
        <div class="flex items-baseline gap-2 mb-3">
          <label class="block text-sm font-medium text-slate-700">
            信号确认K线数
          </label>
          <div class="relative">
            <button
              @mouseenter="showConfirmBarsTooltip = true"
              @mouseleave="showConfirmBarsTooltip = false"
              type="button"
              class="p-1 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <div
              v-if="showConfirmBarsTooltip"
              class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg z-50 pointer-events-none"
              style="width: 220px"
            >
              需要连续多少根K线都满足信号条件才触发提醒。数值越大，信号越可靠，但响应越慢。
              <div class="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></div>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <Input
            :model-value="config.signal_confirmation_bars"
            @update:model-value="updateConfig('signal_confirmation_bars', $event)"
            type="number"
            min="1"
            max="10"
            placeholder="1"
            class="flex-1"
          />
          <span class="text-sm text-slate-500">根K线</span>
        </div>
        <p class="text-xs text-slate-500 mt-2">
          推荐值：超短线 1-2，日内 2-3，波段 3-5
        </p>
      </div>

      <!-- 信号过期时间 -->
      <div>
        <div class="flex items-baseline gap-2 mb-3">
          <label class="block text-sm font-medium text-slate-700">
            信号过期时间
          </label>
          <div class="relative">
            <button
              @mouseenter="showExpirationTooltip = true"
              @mouseleave="showExpirationTooltip = false"
              type="button"
              class="p-1 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <div
              v-if="showExpirationTooltip"
              class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg z-50 pointer-events-none"
              style="width: 220px"
            >
              信号生成后多少小时自动过期。过期的信号不会再触发交易或通知。
              <div class="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></div>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <Input
            :model-value="config.signal_expiration_hours"
            @update:model-value="updateConfig('signal_expiration_hours', $event)"
            type="number"
            min="1"
            max="168"
            placeholder="24"
            class="flex-1"
          />
          <span class="text-sm text-slate-500">小时</span>
        </div>
        <p class="text-xs text-slate-500 mt-2">
          推荐值：超短线 1-4小时，日内 4-12小时，波段 24-48小时
        </p>
      </div>

      <!-- 信号强度阈值 -->
      <div>
        <div class="flex items-baseline gap-2 mb-3">
          <label class="block text-sm font-medium text-slate-700">
            信号强度阈值
          </label>
          <div class="relative">
            <button
              @mouseenter="showStrengthTooltip = true"
              @mouseleave="showStrengthTooltip = false"
              type="button"
              class="p-1 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <div
              v-if="showStrengthTooltip"
              class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg z-50 pointer-events-none"
              style="width: 220px"
            >
              只生成强度大于此值的信号（0-100）。数值越高，信号越强，但数量越少。
              <div class="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></div>
            </div>
          </div>
        </div>
        <div class="space-y-3">
          <div class="flex items-center gap-4">
            <Input
              :model-value="config.signal_strength_threshold"
              @update:model-value="updateConfig('signal_strength_threshold', $event)"
              type="number"
              min="0"
              max="100"
              placeholder="60"
              class="flex-1"
            />
            <span class="text-sm text-slate-500">分</span>
          </div>
          <!-- 强度滑块 -->
          <input
            type="range"
            :value="config.signal_strength_threshold"
            @input="updateConfig('signal_strength_threshold', $event.target.value)"
            min="0"
            max="100"
            step="5"
            class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
          />
          <div class="flex justify-between text-xs text-slate-500">
            <span>0 (全部)</span>
            <span>50 (中等)</span>
            <span>100 (极强)</span>
          </div>
        </div>
        <p class="text-xs text-slate-500 mt-2">
          推荐值：保守 70-80，平衡 60-70，激进 40-60
        </p>
      </div>
    </div>
  </Card>
</template>

<script setup>
import { ref } from 'vue'
import Card from '../../common/ui/Card.vue'
import Input from '../../common/ui/Input.vue'

const props = defineProps({
  config: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:config'])

// Tooltip 显示状态
const showConfirmBarsTooltip = ref(false)
const showExpirationTooltip = ref(false)
const showStrengthTooltip = ref(false)

// 更新配置
const updateConfig = (key, value) => {
  emit('update:config', {
    ...props.config,
    [key]: parseInt(value) || 0
  })
}
</script>

