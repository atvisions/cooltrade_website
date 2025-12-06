<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- 背景遮罩 -->
        <div class="absolute inset-0 bg-black/50" @click="handleCancel"></div>
        
        <!-- 对话框 -->
        <div class="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all">
          <!-- 图标 -->
          <div v-if="type === 'danger'" class="w-12 h-12 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div v-else-if="type === 'warning'" class="w-12 h-12 mx-auto mb-4 rounded-full bg-yellow-100 flex items-center justify-center">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div v-else-if="type === 'info'" class="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <!-- 标题 -->
          <h3 class="text-lg font-bold text-gray-900 text-center mb-2">
            {{ title }}
          </h3>
          
          <!-- 内容 -->
          <p class="text-gray-600 text-center mb-6 whitespace-pre-line">
            {{ message }}
          </p>
          
          <!-- 按钮 -->
          <div class="flex gap-3">
            <button
              v-if="showCancel"
              @click="handleCancel"
              class="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              {{ cancelText }}
            </button>
            <button
              @click="handleConfirm"
              class="flex-1 px-4 py-2.5 rounded-lg transition-colors font-medium"
              :class="confirmButtonClass"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '确认'
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'warning', // 'warning', 'info', 'danger'
    validator: (value) => ['warning', 'info', 'danger'].includes(value)
  },
  confirmText: {
    type: String,
    default: '确定'
  },
  cancelText: {
    type: String,
    default: '取消'
  },
  showCancel: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['confirm', 'cancel', 'close'])

const confirmButtonClass = computed(() => {
  if (props.type === 'danger') {
    return 'bg-red-600 text-white hover:bg-red-700'
  }
  return 'bg-blue-600 text-white hover:bg-blue-700'
})

const handleConfirm = () => {
  emit('confirm')
  emit('close')
}

const handleCancel = () => {
  emit('cancel')
  emit('close')
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active .relative,
.fade-leave-active .relative {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.fade-enter-from .relative,
.fade-leave-to .relative {
  transform: scale(0.95);
  opacity: 0;
}
</style>

