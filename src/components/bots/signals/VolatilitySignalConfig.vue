<template>
  <div class="p-6 bg-slate-50 rounded-lg border border-slate-200">
    <h3 class="text-base font-semibold text-slate-900 mb-4">波动性提醒配置</h3>
    
    <div class="space-y-4">
      <p class="text-sm text-slate-500">波动性提醒配置（待实现）</p>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue'])

const config = reactive({ ...props.modelValue })
</script>

