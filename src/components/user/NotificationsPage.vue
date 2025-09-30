<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <!-- Header -->
    <Header />

    <!-- 主容器 - 包含侧边栏和内容 -->
    <div class="max-w-7xl mx-auto pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div class="flex gap-8 relative">
        <!-- 用户侧边栏 -->
        <div class="w-64 flex-shrink-0">
          <UserSidebar activeItem="notifications" />
        </div>

        <!-- 主内容区域 -->
        <main class="flex-1 min-w-0">
        <!-- 页面标题 -->
        <div class="mb-8 flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">通知中心</h1>
            <p class="text-gray-600 mt-2">查看您的所有通知消息</p>
          </div>
          <button class="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium">
            全部标记为已读
          </button>
        </div>

      <!-- 筛选器 -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div class="flex items-center space-x-4">
          <button class="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium">
            全部 (8)
          </button>
          <button class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium">
            未读 (3)
          </button>
          <button class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium">
            交易提醒
          </button>
          <button class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium">
            系统消息
          </button>
        </div>
      </div>

      <!-- 通知列表 -->
      <div class="space-y-3">
        <!-- 未读通知 -->
        <div
          v-for="i in 3"
          :key="'unread-' + i"
          class="bg-blue-50 border-l-4 border-blue-600 rounded-xl shadow-sm p-6 hover:shadow-lg transition-all"
        >
          <div class="flex items-start space-x-4">
            <div class="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
            </div>
            <div class="flex-1">
              <div class="flex items-start justify-between mb-2">
                <h3 class="text-lg font-semibold text-gray-900">交易提醒</h3>
                <span class="text-sm text-gray-500">{{ i }}分钟前</span>
              </div>
              <p class="text-gray-700 mb-3">您的策略"网格交易策略"触发了买入信号，已自动执行交易</p>
              <div class="flex items-center space-x-3">
                <button class="text-sm text-blue-600 hover:text-blue-700 font-medium">查看详情</button>
                <button class="text-sm text-gray-600 hover:text-gray-700">标记为已读</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 已读通知 -->
        <div
          v-for="i in 5"
          :key="'read-' + i"
          class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all"
        >
          <div class="flex items-start space-x-4">
            <div class="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
              </svg>
            </div>
            <div class="flex-1">
              <div class="flex items-start justify-between mb-2">
                <h3 class="text-lg font-semibold text-gray-900">系统消息</h3>
                <span class="text-sm text-gray-500">{{ i }}小时前</span>
              </div>
              <p class="text-gray-600 mb-3">系统将于今晚23:00进行例行维护，预计持续30分钟</p>
              <div class="flex items-center space-x-3">
                <button class="text-sm text-blue-600 hover:text-blue-700 font-medium">查看详情</button>
                <button class="text-sm text-red-600 hover:text-red-700">删除</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="false" class="text-center py-16">
        <div class="text-6xl mb-4">🔔</div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">暂无通知</h3>
        <p class="text-gray-600">您目前没有任何通知消息</p>
      </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import Header from '../common/Header.vue'
import UserSidebar from '../common/UserSidebar.vue'
</script>

