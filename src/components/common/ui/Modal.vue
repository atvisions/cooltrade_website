<template>
  <TransitionRoot appear :show="modelValue" as="template">
    <Dialog as="div" @close="handleClose" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              :class="[
                'w-full transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all',
                sizeClasses
              ]"
            >
              <!-- 头部 -->
              <div v-if="title || $slots.header" class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <DialogTitle as="h3" class="text-lg font-semibold text-gray-900">
                  <slot name="header">{{ title }}</slot>
                </DialogTitle>
                <button
                  v-if="closable"
                  @click="handleClose"
                  class="text-gray-400 hover:text-gray-500 transition-colors"
                >
                  <XMarkIcon class="h-6 w-6" />
                </button>
              </div>

              <!-- 内容 -->
              <div class="px-6 py-4">
                <slot></slot>
              </div>

              <!-- 底部按钮 -->
              <div v-if="$slots.footer || showDefaultFooter" class="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <slot name="footer">
                  <div class="flex justify-end gap-3">
                    <Button
                      variant="secondary"
                      label="取消"
                      @click="handleClose"
                    />
                    <Button
                      variant="primary"
                      label="确定"
                      :loading="loading"
                      @click="$emit('confirm')"
                    />
                  </div>
                </slot>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { computed } from 'vue'
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import Button from './Button.vue'

const props = defineProps({
  // 显示状态
  modelValue: {
    type: Boolean,
    default: false
  },
  // 标题
  title: String,
  // 大小
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl', 'fullscreen'].includes(value)
  },
  // 可关闭
  closable: {
    type: Boolean,
    default: true
  },
  // 加载状态
  loading: Boolean,
  // 显示默认底部
  showDefaultFooter: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'close'])

// 关闭处理
const handleClose = () => {
  if (props.closable) {
    emit('update:modelValue', false)
    emit('close')
  }
}

// 大小类
const sizeClasses = computed(() => {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    fullscreen: 'max-w-full h-full'
  }
  return sizes[props.size]
})
</script>
