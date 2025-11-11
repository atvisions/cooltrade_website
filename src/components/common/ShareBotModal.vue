<template>
  <!-- 背景遮罩 -->
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
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
            <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100">
              <svg class="h-8 w-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </div>
          </div>

          <!-- 标题和描述 -->
          <div class="mt-4 text-center">
            <h3 class="text-xl font-semibold text-gray-900">分享机器人</h3>
            <p class="mt-2 text-sm text-gray-500">选择分享方式，让其他用户看到您的策略</p>
          </div>

          <!-- 机器人信息 -->
          <div v-if="bot" class="mt-4 p-4 bg-gray-50 rounded-lg">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <div class="flex-1">
                <p class="font-medium text-gray-900">{{ bot.name }}</p>
                <p class="text-xs text-gray-500">{{ bot.exchange_display || bot.exchange_name }}</p>
              </div>
            </div>
          </div>

          <!-- 分享选项 -->
          <div class="mt-6 space-y-3">
            <!-- 公开选项 -->
            <button
              @click="handleSelectVisibility('public')"
              :class="[
                'w-full p-4 rounded-xl border-2 transition-all duration-200 text-left',
                selectedVisibility === 'public'
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
              ]"
            >
              <div class="flex items-start gap-3">
                <div class="flex-shrink-0 mt-0.5">
                  <div :class="[
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                    selectedVisibility === 'public'
                      ? 'border-indigo-500 bg-indigo-500'
                      : 'border-gray-300'
                  ]">
                    <svg v-if="selectedVisibility === 'public'" class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span class="font-semibold text-gray-900">公开</span>
                  </div>
                  <p class="mt-1 text-sm text-gray-600">所有用户都可以在策略市场中看到并复制您的策略</p>
                </div>
              </div>
            </button>

            <!-- 仅关注者选项 -->
            <button
              @click="handleSelectVisibility('followers_only')"
              :class="[
                'w-full p-4 rounded-xl border-2 transition-all duration-200 text-left',
                selectedVisibility === 'followers_only'
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
              ]"
            >
              <div class="flex items-start gap-3">
                <div class="flex-shrink-0 mt-0.5">
                  <div :class="[
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                    selectedVisibility === 'followers_only'
                      ? 'border-indigo-500 bg-indigo-500'
                      : 'border-gray-300'
                  ]">
                    <svg v-if="selectedVisibility === 'followers_only'" class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span class="font-semibold text-gray-900">仅关注者</span>
                  </div>
                  <p class="mt-1 text-sm text-gray-600">只有关注您的用户才能看到并复制您的策略</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        <!-- 按钮区域 -->
        <div class="bg-gray-50 px-6 py-4 flex flex-col-reverse sm:flex-row sm:space-x-3 space-y-3 space-y-reverse sm:space-y-0">
          <button
            @click="handleCancel"
            type="button"
            class="w-full inline-flex justify-center rounded-lg border-2 border-gray-300 px-4 py-2.5 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            取消
          </button>
          <button
            @click="handleConfirm"
            type="button"
            :disabled="!selectedVisibility || loading"
            :class="[
              'w-full inline-flex justify-center items-center rounded-lg border-2 border-transparent px-4 py-2.5 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors',
              !selectedVisibility || loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
            ]"
          >
            <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            确认分享
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  bot: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['confirm', 'cancel', 'update:isOpen'])

// 选中的可见性
const selectedVisibility = ref(null)

// 监听弹窗打开，初始化选中状态
watch(() => props.isOpen, (newVal) => {
  if (newVal && props.bot) {
    // 如果机器人已经是公开或仅关注者，预选中当前状态
    if (props.bot.visibility === 'public' || props.bot.visibility === 'followers_only') {
      selectedVisibility.value = props.bot.visibility
    } else {
      selectedVisibility.value = null
    }
  }
})

// 选择可见性
const handleSelectVisibility = (visibility) => {
  selectedVisibility.value = visibility
}

// 处理确认
const handleConfirm = () => {
  if (selectedVisibility.value) {
    emit('confirm', selectedVisibility.value)
  }
}

// 处理取消
const handleCancel = () => {
  selectedVisibility.value = null
  emit('cancel')
  emit('update:isOpen', false)
}
</script>

