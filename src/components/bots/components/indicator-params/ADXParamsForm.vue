<template>
  <div class="grid grid-cols-2 gap-4">
    <div>
      <label class="block text-xs font-medium text-slate-700 mb-1.5">
        ADX 周期
        <span class="text-slate-500 block font-normal">推荐 14</span>
      </label>
      <input
        :value="modelValue.adx_period || 14"
        @input="updateValue('adx_period', $event.target.value)"
        type="number"
        min="1"
        max="50"
        class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
    <div>
      <label class="block text-xs font-medium text-slate-700 mb-1.5">
        强趋势阈值
        <span class="text-slate-500 block font-normal">推荐 25，ADX > 25 表示强趋势</span>
      </label>
      <input
        :value="modelValue.adx_threshold || 25"
        @input="updateValue('adx_threshold', $event.target.value)"
        type="number"
        min="10"
        max="50"
        class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  </div>
  <div class="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
    <div class="text-xs text-amber-800">
      💡 <strong>提示：</strong>ADX 只判断趋势强度，不判断方向。建议与 MA/EMA 等方向性指标组合使用。
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

