<template>
  <div
    :class="[
      'rounded-lg transition-all duration-200',
      variantClasses,
      customClass
    ]"
  >
    <!-- 头部 -->
    <div v-if="$slots.header || title" class="px-6 py-4 border-b border-gray-200">
      <slot name="header">
        <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
      </slot>
    </div>

    <!-- 内容 -->
    <div :class="['px-6 py-4', contentPadding]">
      <slot></slot>
    </div>

    <!-- 底部 -->
    <div v-if="$slots.footer" class="px-6 py-4 border-t border-gray-200 bg-gray-50">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // 卡片类型
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'elevated', 'outlined', 'flat'].includes(value)
  },
  // 标题
  title: String,
  // 内容内边距
  contentPadding: {
    type: Boolean,
    default: true
  },
  // 自定义类名
  customClass: String
})

// 变体类
const variantClasses = computed(() => {
  const variants = {
    default: 'bg-white border border-gray-200 shadow-sm hover:shadow-md',
    elevated: 'bg-white shadow-lg hover:shadow-xl',
    outlined: 'bg-white border-2 border-gray-300',
    flat: 'bg-gray-50 border border-gray-200'
  }
  return variants[props.variant]
})
</script>

