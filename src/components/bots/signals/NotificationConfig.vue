<template>
  <Card variant="default" class="mb-6">
    <div class="flex items-center gap-3 mb-4">
      <div class="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
        <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      </div>
      <div>
        <h2 class="text-lg font-semibold text-slate-900">通知设置</h2>
        <p class="text-sm text-slate-500">选择接收信号通知的渠道</p>
      </div>
    </div>

    <!-- 通知渠道 -->
    <div>
      <label class="block text-sm font-medium text-slate-700 mb-3">通知渠道</label>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label
          :class="[
            'flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all',
            notifyEmail
              ? 'border-blue-500 bg-blue-50'
              : 'border-slate-200 bg-white hover:border-slate-300'
          ]"
        >
          <input
            type="checkbox"
            :checked="notifyEmail"
            @change="$emit('update:notifyEmail', $event.target.checked)"
            class="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <div class="ml-3 flex-1">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span class="font-medium text-slate-900">邮件通知</span>
            </div>
            <p class="text-xs text-slate-500 mt-1">发送信号通知到您的邮箱</p>
          </div>
        </label>

        <label
          :class="[
            'flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all',
            notifyApp
              ? 'border-blue-500 bg-blue-50'
              : 'border-slate-200 bg-white hover:border-slate-300'
          ]"
        >
          <input
            type="checkbox"
            :checked="notifyApp"
            @change="$emit('update:notifyApp', $event.target.checked)"
            class="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <div class="ml-3 flex-1">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span class="font-medium text-slate-900">应用内通知</span>
            </div>
            <p class="text-xs text-slate-500 mt-1">在应用内实时接收通知</p>
          </div>
        </label>
      </div>
    </div>
  </Card>
</template>

<script setup>
import Card from '../../common/ui/Card.vue'

defineProps({
  notifyEmail: {
    type: Boolean,
    default: true
  },
  notifyApp: {
    type: Boolean,
    default: true
  }
})

defineEmits(['update:notifyEmail', 'update:notifyApp'])
</script>


