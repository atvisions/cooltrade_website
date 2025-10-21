<template>
  <!-- 背景遮罩 -->
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <!-- 背景遮罩动画 -->
      <div
        class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
        @click="handleCancel"
      ></div>

      <!-- 居中对齐的技巧 -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

      <!-- 弹窗内容 -->
      <div
        class="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
      >
        <div class="bg-white px-6 pt-6 pb-4">
          <!-- 图标 -->
          <div class="flex items-center justify-center">
            <div :class="[
              'mx-auto flex items-center justify-center h-16 w-16 rounded-full',
              iconBgClass
            ]">
              <!-- 警告图标 -->
              <ExclamationTriangleIcon v-if="type === 'warning'" :class="['h-8 w-8', iconColorClass]" />
              <!-- 危险图标 -->
              <TrashIcon v-else-if="type === 'danger'" :class="['h-8 w-8', iconColorClass]" />
              <!-- 信息图标 -->
              <InformationCircleIcon v-else-if="type === 'info'" :class="['h-8 w-8', iconColorClass]" />
              <!-- 成功图标 -->
              <CheckCircleIcon v-else :class="['h-8 w-8', iconColorClass]" />
            </div>
          </div>

          <!-- 标题和内容 -->
          <div class="mt-4 text-center">
            <h3 class="text-xl font-bold text-gray-900 mb-2">
              {{ title }}
            </h3>
            <div class="mt-2">
              <p class="text-sm text-gray-600 leading-relaxed">
                {{ message }}
              </p>
            </div>
          </div>
        </div>

        <!-- 按钮区域 -->
        <div class="bg-gray-50 px-6 py-4 flex flex-col-reverse sm:flex-row sm:space-x-3 space-y-3 space-y-reverse sm:space-y-0">
          <button
            @click="handleCancel"
            type="button"
            class="w-full inline-flex justify-center rounded-lg border-2 border-gray-300 px-4 py-2.5 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            {{ cancelText }}
          </button>
          <button
            @click="handleConfirm"
            type="button"
            :class="[
              'w-full inline-flex justify-center rounded-lg border-2 border-transparent px-4 py-2.5 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors',
              confirmButtonClass
            ]"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  ExclamationTriangleIcon,
  TrashIcon,
  InformationCircleIcon,
  CheckCircleIcon
} from '@heroicons/vue/24/outline'

// Props
const props = defineProps({
  type: {
    type: String,
    default: 'warning', // warning, danger, info, success
    validator: (value) => ['warning', 'danger', 'info', 'success'].includes(value)
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  confirmText: {
    type: String,
    default: '确认'
  },
  cancelText: {
    type: String,
    default: '取消'
  }
})

// Emits
const emit = defineEmits(['confirm', 'cancel'])

// 图标背景颜色
const iconBgClass = computed(() => {
  const classes = {
    warning: 'bg-yellow-100',
    danger: 'bg-red-100',
    info: 'bg-blue-100',
    success: 'bg-green-100'
  }
  return classes[props.type] || classes.warning
})

// 图标颜色
const iconColorClass = computed(() => {
  const classes = {
    warning: 'text-yellow-600',
    danger: 'text-red-600',
    info: 'text-blue-600',
    success: 'text-green-600'
  }
  return classes[props.type] || classes.warning
})

// 确认按钮样式
const confirmButtonClass = computed(() => {
  const classes = {
    warning: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
    danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    info: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    success: 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
  }
  return classes[props.type] || classes.warning
})

// 处理确认
const handleConfirm = () => {
  emit('confirm')
}

// 处理取消
const handleCancel = () => {
  emit('cancel')
}
</script>

