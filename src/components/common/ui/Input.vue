<template>
  <div class="w-full">
    <!-- 标签 -->
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 mb-2">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <!-- 输入框容器 -->
    <div class="relative">
      <!-- 左侧图标 -->
      <div v-if="$slots['icon-left'] && type !== 'textarea'" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        <slot name="icon-left"></slot>
      </div>

      <!-- 输入框 -->
      <input
        v-if="type !== 'textarea'"
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :readonly="readonly"
        :class="[
          'w-full px-4 py-2 rounded-lg border transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-0',
          'disabled:bg-gray-100 disabled:cursor-not-allowed',
          $slots['icon-left'] ? 'pl-10' : '',
          $slots['icon-right'] ? 'pr-10' : '',
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
          customClass
        ]"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur')"
        @focus="$emit('focus')"
      />

      <!-- Textarea -->
      <textarea
        v-else
        :id="id"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :readonly="readonly"
        :class="[
          'w-full px-4 py-2 rounded-lg border transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-0',
          'disabled:bg-gray-100 disabled:cursor-not-allowed',
          'resize-vertical min-h-[100px]',
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
          customClass
        ]"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur')"
        @focus="$emit('focus')"
      />

      <!-- 右侧图标 -->
      <div v-if="$slots['icon-right'] && type !== 'textarea'" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        <slot name="icon-right"></slot>
      </div>
    </div>

    <!-- 错误提示 -->
    <p v-if="error" class="mt-1 text-sm text-red-500">{{ error }}</p>

    <!-- 帮助文本 -->
    <p v-if="hint && !error" class="mt-1 text-sm text-gray-500">{{ hint }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  // 输入框类型
  type: {
    type: String,
    default: 'text',
    validator: (value) => ['text', 'password', 'email', 'number', 'tel', 'url', 'date', 'time', 'datetime-local', 'search', 'textarea'].includes(value)
  },
  // 绑定值
  modelValue: {
    type: [String, Number],
    default: ''
  },
  // 标签
  label: String,
  // 占位符
  placeholder: String,
  // 禁用
  disabled: Boolean,
  // 只读
  readonly: Boolean,
  // 必填
  required: Boolean,
  // 错误信息
  error: String,
  // 帮助文本
  hint: String,
  // 自定义类名
  customClass: String,
  // ID
  id: {
    type: String,
    default: () => `input-${Math.random().toString(36).substring(2, 11)}`
  }
})

defineEmits(['update:modelValue', 'blur', 'focus'])
</script>

