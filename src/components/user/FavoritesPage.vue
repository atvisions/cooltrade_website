<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <!-- Header -->
    <Header />

    <!-- 主容器 - 包含侧边栏和内容 -->
    <div class="max-w-7xl mx-auto pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div class="flex gap-8 relative">
        <!-- 用户侧边栏 -->
        <div class="w-64 flex-shrink-0">
          <UserSidebar activeItem="favorites" />
        </div>

        <!-- 主内容区域 -->
        <main class="flex-1 min-w-0">
        <!-- 页面标题 -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">我的收藏</h1>
          <p class="text-gray-600 mt-2">管理您收藏的策略和交易员</p>
        </div>

      <!-- 标签页 -->
      <div class="mb-6">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8">
            <button
              @click="activeTab = 'strategies'"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === 'strategies'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              策略收藏 (8)
            </button>
            <button
              @click="activeTab = 'traders'"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === 'traders'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              交易员收藏 (4)
            </button>
          </nav>
        </div>
      </div>

      <!-- 内容区域 -->
      <div class="grid md:grid-cols-2 gap-6">
        <!-- 占位卡片 -->
        <div
          v-for="i in 6"
          :key="i"
          class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">
                {{ activeTab === 'strategies' ? '策略名称' : '交易员名称' }} {{ i }}
              </h3>
              <p class="text-sm text-gray-600">这是一个示例描述...</p>
            </div>
            <button class="text-red-500 hover:text-red-700">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"></path>
              </svg>
            </button>
          </div>
          <div class="flex items-center justify-between text-sm text-gray-500">
            <span>收藏于 2024-01-15</span>
            <button class="text-blue-600 hover:text-blue-700 font-medium">查看详情</button>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="false" class="text-center py-16">
        <div class="text-6xl mb-4">💝</div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">暂无收藏</h3>
        <p class="text-gray-600 mb-6">开始收藏您喜欢的策略和交易员</p>
        <router-link
          to="/explore"
          class="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          去探索
        </router-link>
      </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Header from '../common/Header.vue'
import UserSidebar from '../common/UserSidebar.vue'

const activeTab = ref('strategies')
</script>

