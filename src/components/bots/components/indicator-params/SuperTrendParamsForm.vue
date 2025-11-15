<template>
  <div class="grid grid-cols-2 gap-4">
    <div>
      <label class="block text-xs font-medium text-slate-700 mb-1.5">
        ATR 周期
        <span class="text-slate-500 block font-normal">推荐 10</span>
      </label>
      <input
        :value="modelValue.atr_period || 10"
        @input="updateValue('atr_period', $event.target.value)"
        type="number"
        min="1"
        max="50"
        class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
    <div>
      <label class="block text-xs font-medium text-slate-700 mb-1.5">
        ATR 倍数
        <span class="text-slate-500 block font-normal">推荐 3.0</span>
      </label>
      <input
        :value="modelValue.atr_multiplier || 3.0"
        @input="updateValue('atr_multiplier', $event.target.value)"
        type="number"
        min="0.5"
        max="10"
        step="0.1"
        class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  </div>
  <div class="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
    <div class="text-xs text-blue-800">
      💡 <strong>提示：</strong>SuperTrend 基于 ATR 计算动态支撑/阻力位，适合趋势跟踪和动态止损。
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue'])

const updateValue = (key, value) => {
  emit('update:modelValue', {
    ...props.modelValue,
    [key]: Number(value)
  })
}
</script>

