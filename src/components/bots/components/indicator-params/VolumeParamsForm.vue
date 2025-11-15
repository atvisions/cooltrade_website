<template>
  <div class="grid grid-cols-2 gap-4">
    <div>
      <label class="block text-xs font-medium text-slate-700 mb-1.5">
        成交量均线周期
        <span class="text-slate-500 block font-normal">推荐 20</span>
      </label>
      <input
        :value="modelValue.volume_ma_period || 20"
        @input="updateValue('volume_ma_period', $event.target.value)"
        type="number"
        min="1"
        max="100"
        class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
    <div>
      <label class="block text-xs font-medium text-slate-700 mb-1.5">
        放量倍数阈值
        <span class="text-slate-500 block font-normal">推荐 1.5，成交量 > 1.5倍均线</span>
      </label>
      <input
        :value="modelValue.volume_threshold || 1.5"
        @input="updateValue('volume_threshold', $event.target.value)"
        type="number"
        min="1.0"
        max="5.0"
        step="0.1"
        class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  </div>
  <div class="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
    <div class="text-xs text-purple-800">
      💡 <strong>提示：</strong>成交量用于确认趋势真实性，建议与 MA/EMA 等方向性指标组合使用。放量上涨/下跌更可靠。
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

