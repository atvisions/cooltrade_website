<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <!-- Header -->
    <Header />

    <!-- 主容器 - 包含侧边栏和内容 -->
    <div class="max-w-7xl mx-auto pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div class="flex gap-8 relative">
        <!-- 用户侧边栏 -->
        <div class="w-64 flex-shrink-0">
          <UserSidebar activeItem="following" />
        </div>

        <!-- 主内容区域 -->
        <main class="flex-1 min-w-0">
        <!-- 页面标题 -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">我的关注</h1>
          <p class="text-gray-600 mt-2">查看您关注的交易员动态</p>
        </div>

      <!-- 统计 -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 mb-1">关注的交易员</p>
            <p class="text-3xl font-bold text-gray-900">24</p>
          </div>
          <router-link
            to="/community"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            发现更多
          </router-link>
        </div>
      </div>

      <!-- 关注列表 -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="i in 12"
          :key="i"
          class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all"
        >
          <div class="flex items-start space-x-4 mb-4">
            <div class="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <span class="text-white font-bold text-xl">U{{ i }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-lg font-semibold text-gray-900 truncate">交易员 {{ i }}</h3>
              <p class="text-sm text-gray-500 truncate">专注量化交易</p>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-4 mb-4">
            <div class="text-center">
              <div class="text-lg font-bold text-gray-900">{{ 10 + i }}</div>
              <div class="text-xs text-gray-500">策略</div>
            </div>
            <div class="text-center">
              <div class="text-lg font-bold text-gray-900">{{ 100 + i * 10 }}</div>
              <div class="text-xs text-gray-500">粉丝</div>
            </div>
            <div class="text-center">
              <div class="text-lg font-bold text-green-600">+{{ 20 + i }}%</div>
              <div class="text-xs text-gray-500">收益</div>
            </div>
          </div>

          <div class="flex items-center space-x-2">
            <button class="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
              查看主页
            </button>
            <button class="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
              取消关注
            </button>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="false" class="text-center py-16">
        <div class="text-6xl mb-4">💫</div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">暂无关注</h3>
        <p class="text-gray-600 mb-6">关注优秀的交易员，获取最新动态</p>
        <router-link
          to="/community"
          class="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          发现交易员
        </router-link>
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

