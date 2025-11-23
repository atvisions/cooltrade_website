<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isVisible"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
        @click.self="handleClose"
      >
        <div class="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all">
          <!-- 图标 -->
          <div class="flex justify-center mb-4">
            <div class="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>

          <!-- 标题 -->
          <h3 class="text-xl font-bold text-gray-900 text-center mb-2">
            {{ title }}
          </h3>

          <!-- 描述 -->
          <p class="text-gray-600 text-center mb-6">
            {{ message }}
          </p>

          <!-- 当前限制信息 -->
          <div v-if="currentUsage && limitInfo" class="bg-gray-50 rounded-lg p-4 mb-6">
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600">当前使用</span>
              <span class="font-semibold text-gray-900">{{ currentUsage }}/{{ limitInfo }}</span>
            </div>
          </div>

          <!-- 按钮组 -->
          <div class="flex gap-3">
            <button
              @click="handleClose"
              class="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              取消
            </button>
            <button
              @click="handleUpgrade"
              class="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              升级会员
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  title: {
    type: String,
    default: '需要升级会员'
  },
  message: {
    type: String,
    default: '您已达到当前会员等级的使用限制，升级会员以解锁更多功能'
  },
  currentUsage: {
    type: [String, Number],
    default: null
  },
  limitInfo: {
    type: [String, Number],
    default: null
  }
})

const emit = defineEmits(['close', 'upgrade'])

const router = useRouter()
const isVisible = ref(false)

const show = () => {
  isVisible.value = true
}

const hide = () => {
  isVisible.value = false
}

const handleClose = () => {
  hide()
  emit('close')
}

const handleUpgrade = () => {
  hide()
  emit('upgrade')
  router.push('/membership')
}

defineExpose({
  show,
  hide
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
  transition: transform 0.3s ease;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: scale(0.9);
}
</style>

