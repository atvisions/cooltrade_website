<template>
  <div class="grid grid-cols-2 gap-4">
    <div>
      <label class="block text-xs font-medium text-slate-700 mb-1.5">
        周期
        <span class="text-slate-500 block font-normal">推荐 20</span>
      </label>
      <input
        :value="modelValue.bollinger_period || 20"
        @input="updateValue('bollinger_period', $event.target.value)"
        type="number"
        min="1"
        max="100"
        class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
    <div>
      <label class="block text-xs font-medium text-slate-700 mb-1.5">
        标准差倍数
        <span class="text-slate-500 block font-normal">推荐 2</span>
      </label>
      <input
        :value="modelValue.bollinger_std || 2"
        @input="updateValue('bollinger_std', $event.target.value)"
        type="number"
        min="0.5"
        max="5"
        step="0.1"
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

