<template>
  <div id="app">
    <router-view />
    <!-- 全局通知组件 -->
    <GlobalNotification />
    <!-- 全局确认对话框 -->
    <ConfirmModal
      v-if="confirmDialog.show"
      :type="confirmDialog.type"
      :title="confirmDialog.title"
      :message="confirmDialog.message"
      :confirmText="confirmDialog.confirmText"
      :cancelText="confirmDialog.cancelText"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, provide } from 'vue'
import GlobalNotification from './components/common/GlobalNotification.vue'
import ConfirmModal from './components/common/ConfirmModal.vue'

// 通知函数
const showNotification = (type, message, title = '') => {
  window.dispatchEvent(new CustomEvent('show-notification', {
    detail: {
      type,
      message,
      title,
      duration: 5000,
      showProgress: true
    }
  }))
}

const showSuccess = (message, title = '成功') => {
  showNotification('success', message, title)
}

const showError = (message, title = '错误') => {
  showNotification('error', message, title)
}

const showWarning = (message, title = '警告') => {
  showNotification('warning', message, title)
}

const showInfo = (message, title = '提示') => {
  showNotification('info', message, title)
}

// 提供给子组件使用
provide('showSuccess', showSuccess)
provide('showError', showError)
provide('showWarning', showWarning)
provide('showInfo', showInfo)

// 确认对话框状态
const confirmDialog = ref({
  show: false,
  type: 'warning',
  title: '',
  message: '',
  confirmText: '确认',
  cancelText: '取消',
  onConfirm: null,
  onCancel: null
})

// 显示确认对话框
const showConfirmDialog = (event) => {
  const { detail } = event
  confirmDialog.value = {
    show: true,
    type: detail.type || 'warning',
    title: detail.title || '',
    message: detail.message || '',
    confirmText: detail.confirmText || '确认',
    cancelText: detail.cancelText || '取消',
    onConfirm: detail.onConfirm,
    onCancel: detail.onCancel
  }
}

// 处理确认
const handleConfirm = () => {
  if (confirmDialog.value.onConfirm) {
    confirmDialog.value.onConfirm()
  }
  confirmDialog.value.show = false
}

// 处理取消
const handleCancel = () => {
  if (confirmDialog.value.onCancel) {
    confirmDialog.value.onCancel()
  }
  confirmDialog.value.show = false
}

// 监听全局确认对话框事件
onMounted(() => {
  window.addEventListener('show-confirm', showConfirmDialog)
})

onUnmounted(() => {
  window.removeEventListener('show-confirm', showConfirmDialog)
})
</script>

<style>
/* 全局样式 */
</style>
