<template>
  <teleport to="body">
    <div class="fixed top-4 right-4 z-50 space-y-2 max-w-full pr-4 sm:pr-0">
      <transition-group
        name="notification"
        tag="div"
        class="space-y-2"
      >
        <div
          v-for="notification in notifications"
          :key="notification.id"
          :class="[
            'w-full max-w-sm sm:max-w-md bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden',
            'transform transition-all duration-300 ease-in-out'
          ]"
        >
          <div class="p-4">
            <div class="flex items-start space-x-3">
              <div class="flex-shrink-0">
                <!-- 成功图标 -->
                <div
                  v-if="notification.type === 'success'"
                  class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center"
                >
                  <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                
                <!-- 错误图标 -->
                <div
                  v-else-if="notification.type === 'error'"
                  class="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center"
                >
                  <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </div>
                
                <!-- 警告图标 -->
                <div
                  v-else-if="notification.type === 'warning'"
                  class="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center"
                >
                  <svg class="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                </div>
                
                <!-- 信息图标 -->
                <div
                  v-else
                  class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center"
                >
                  <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
              
              <div class="flex-1 min-w-0">
                <p
                  v-if="notification.title"
                  :class="[
                    'text-sm font-medium leading-5 break-words',
                    notification.type === 'success' ? 'text-green-900' :
                    notification.type === 'error' ? 'text-red-900' :
                    notification.type === 'warning' ? 'text-yellow-900' :
                    'text-blue-900'
                  ]"
                >
                  {{ notification.title }}
                </p>
                <p
                  :class="[
                    'text-sm leading-5 break-words',
                    notification.title ? 'mt-1 text-gray-600' : 'text-gray-900'
                  ]"
                >
                  {{ notification.message }}
                </p>
              </div>
              
              <div class="flex-shrink-0">
                <button
                  @click="removeNotification(notification.id)"
                  class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-1"
                >
                  <span class="sr-only">关闭</span>
                  <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          <!-- 进度条 -->
          <div
            v-if="notification.showProgress"
            class="h-1 bg-gray-200"
          >
            <div
              :class="[
                'h-full transition-all duration-100 ease-linear',
                notification.type === 'success' ? 'bg-green-500' :
                notification.type === 'error' ? 'bg-red-500' :
                notification.type === 'warning' ? 'bg-yellow-500' :
                'bg-blue-500'
              ]"
              :style="{ width: `${notification.progress}%` }"
            ></div>
          </div>
        </div>
      </transition-group>
    </div>
  </teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const notifications = ref([])

// 添加通知
const addNotification = (notification) => {
  const id = Date.now() + Math.random()
  const newNotification = {
    id,
    type: 'info',
    duration: 5000,
    showProgress: true,
    progress: 100,
    ...notification
  }
  
  notifications.value.push(newNotification)
  
  // 自动移除
  if (newNotification.duration > 0) {
    // 进度条动画
    if (newNotification.showProgress) {
      const interval = 50
      const step = (interval / newNotification.duration) * 100
      
      const progressTimer = setInterval(() => {
        newNotification.progress -= step
        if (newNotification.progress <= 0) {
          clearInterval(progressTimer)
          removeNotification(id)
        }
      }, interval)
    } else {
      setTimeout(() => {
        removeNotification(id)
      }, newNotification.duration)
    }
  }
  
  return id
}

// 移除通知
const removeNotification = (id) => {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index > -1) {
    notifications.value.splice(index, 1)
  }
}

// 清空所有通知
const clearAll = () => {
  notifications.value = []
}

// 全局事件监听
const handleNotificationEvent = (event) => {
  addNotification(event.detail)
}

onMounted(() => {
  window.addEventListener('show-notification', handleNotificationEvent)
})

onUnmounted(() => {
  window.removeEventListener('show-notification', handleNotificationEvent)
})

// 暴露方法给外部使用
defineExpose({
  addNotification,
  removeNotification,
  clearAll
})
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-move {
  transition: transform 0.3s ease;
}
</style>
