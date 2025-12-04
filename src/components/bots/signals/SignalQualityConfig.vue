<template>
  <Card>
    <div class="flex items-center gap-3 mb-4">
      <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
        <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div>
        <h3 class="text-sm font-semibold text-slate-900">信号质量控制</h3>
        <p class="text-xs text-slate-500">过滤假信号，提高信号可靠性</p>
      </div>
    </div>

    <!-- 三列紧凑布局 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- 信号确认K线数 -->
      <div class="bg-slate-50 rounded-lg p-3">
        <div class="flex items-center gap-1 mb-2">
          <label class="text-xs font-medium text-slate-700">确认K线数</label>
          <div class="relative">
            <button
              @mouseenter="showConfirmBarsTooltip = true"
              @mouseleave="showConfirmBarsTooltip = false"
              type="button"
              class="text-slate-400 hover:text-slate-600"
            >
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <div
              v-if="showConfirmBarsTooltip"
              class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg z-50 pointer-events-none"
              style="width: 200px"
            >
              需要连续多少根K线满足条件才触发。数值越大越可靠。
              <div class="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></div>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <Input
            :model-value="config.signal_confirmation_bars"
            @update:model-value="updateConfig('signal_confirmation_bars', $event)"
            type="number"
            min="1"
            max="10"
            placeholder="1"
            class="flex-1 !py-1.5 !text-sm"
          />
          <span class="text-xs text-slate-500 whitespace-nowrap">根</span>
        </div>
        <p class="text-[10px] text-slate-400 mt-1">短线1-2 / 日内2-3 / 波段3-5</p>
      </div>

      <!-- 信号过期时间 -->
      <div class="bg-slate-50 rounded-lg p-3">
        <div class="flex items-center gap-1 mb-2">
          <label class="text-xs font-medium text-slate-700">过期时间</label>
          <div class="relative">
            <button
              @mouseenter="showExpirationTooltip = true"
              @mouseleave="showExpirationTooltip = false"
              type="button"
              class="text-slate-400 hover:text-slate-600"
            >
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <div
              v-if="showExpirationTooltip"
              class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg z-50 pointer-events-none"
              style="width: 200px"
            >
              信号多久后自动过期，过期信号不再触发交易。
              <div class="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></div>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <Input
            :model-value="config.signal_expiration_hours"
            @update:model-value="updateConfig('signal_expiration_hours', $event)"
            type="number"
            min="1"
            max="168"
            placeholder="24"
            class="flex-1 !py-1.5 !text-sm"
          />
          <span class="text-xs text-slate-500 whitespace-nowrap">小时</span>
        </div>
        <p class="text-[10px] text-slate-400 mt-1">短线1-4h / 日内4-12h / 波段24-48h</p>
      </div>

      <!-- 信号强度阈值 -->
      <div class="bg-slate-50 rounded-lg p-3">
        <div class="flex items-center gap-1 mb-2">
          <label class="text-xs font-medium text-slate-700">强度阈值</label>
          <div class="relative">
            <button
              @mouseenter="showStrengthTooltip = true"
              @mouseleave="showStrengthTooltip = false"
              type="button"
              class="text-slate-400 hover:text-slate-600"
            >
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <div
              v-if="showStrengthTooltip"
              class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg z-50 pointer-events-none"
              style="width: 200px"
            >
              只生成强度大于此值的信号（0-100）。越高越强。
              <div class="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></div>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <Input
            :model-value="config.signal_strength_threshold"
            @update:model-value="updateConfig('signal_strength_threshold', $event)"
            type="number"
            min="0"
            max="100"
            placeholder="60"
            class="flex-1 !py-1.5 !text-sm"
          />
          <span class="text-xs text-slate-500 whitespace-nowrap">分</span>
        </div>
        <p class="text-[10px] text-slate-400 mt-1">保守70-80 / 平衡60-70 / 激进40-60</p>
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
  const processedValue = parseInt(value) || 0
  emit('update:config', {
    ...props.config,
    [key]: processedValue
  })
}
</script>

