<template>
  <div class="grid grid-cols-3 gap-4">
    <div>
      <label class="block text-xs font-medium text-slate-700 mb-1.5">
        快线周期
        <span class="text-slate-500 block font-normal">推荐 12</span>
      </label>
      <input
        :value="modelValue.fast_period || 12"
        @input="updateValue('fast_period', $event.target.value)"
        type="number"
        min="1"
        max="100"
        class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
    <div>
      <label class="block text-xs font-medium text-slate-700 mb-1.5">
        慢线周期
        <span class="text-slate-500 block font-normal">推荐 26</span>
      </label>
      <input
        :value="modelValue.slow_period || 26"
        @input="updateValue('slow_period', $event.target.value)"
        type="number"
        min="1"
        max="200"
        class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
    <div>
      <label class="block text-xs font-medium text-slate-700 mb-1.5">
        信号线周期
        <span class="text-slate-500 block font-normal">推荐 9</span>
      </label>
      <input
        :value="modelValue.signal_period || 9"
        @input="updateValue('signal_period', $event.target.value)"
        type="number"
        min="1"
        max="50"
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

