<template>
  <div class="grid grid-cols-3 gap-4">
    <div>
      <label class="block text-xs font-medium text-slate-700 mb-1.5">
        周期
        <span class="text-slate-500 block font-normal">推荐 14</span>
      </label>
      <input
        :value="modelValue.rsi_period || 14"
        @input="updateValue('rsi_period', $event.target.value)"
        type="number"
        min="1"
        max="50"
        class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
    <div>
      <label class="block text-xs font-medium text-slate-700 mb-1.5">
        超卖阈值
        <span class="text-slate-500 block font-normal">推荐 30</span>
      </label>
      <input
        :value="modelValue.rsi_oversold || 30"
        @input="updateValue('rsi_oversold', $event.target.value)"
        type="number"
        min="1"
        max="50"
        class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
    <div>
      <label class="block text-xs font-medium text-slate-700 mb-1.5">
        超买阈值
        <span class="text-slate-500 block font-normal">推荐 70</span>
      </label>
      <input
        :value="modelValue.rsi_overbought || 70"
        @input="updateValue('rsi_overbought', $event.target.value)"
        type="number"
        min="50"
        max="100"
        class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
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

