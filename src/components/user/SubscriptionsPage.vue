<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <!-- Header -->
    <Header />

    <!-- 主容器 - 包含侧边栏和内容 -->
    <div class="max-w-7xl mx-auto pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div class="flex gap-8 relative">
        <!-- 用户侧边栏 -->
        <div class="w-64 flex-shrink-0">
          <UserSidebar activeItem="subscriptions" />
        </div>

        <!-- 主内容区域 -->
        <main class="flex-1 min-w-0">
        <!-- 页面标题 -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">我的订阅</h1>
          <p class="text-gray-600 mt-2">管理您订阅的策略和服务</p>
        </div>

      <!-- 统计卡片 -->
      <div class="grid md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 mb-1">活跃订阅</p>
              <p class="text-3xl font-bold text-gray-900">5</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 mb-1">月度支出</p>
              <p class="text-3xl font-bold text-gray-900">$299</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 mb-1">即将到期</p>
              <p class="text-3xl font-bold text-gray-900">2</p>
            </div>
            <div class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- 订阅列表 -->
      <div class="space-y-4">
        <div
          v-for="i in 5"
          :key="i"
          class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-start space-x-4 flex-1">
              <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
              </div>
              <div class="flex-1">
                <div class="flex items-center space-x-3 mb-2">
                  <h3 class="text-lg font-semibold text-gray-900">高级网格交易策略 {{ i }}</h3>
                  <span class="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    活跃
                  </span>
                </div>
                <p class="text-sm text-gray-600 mb-3">适合震荡市场的网格交易策略，自动低买高卖</p>
                <div class="flex items-center space-x-4 text-sm text-gray-500">
                  <span>订阅于: 2024-01-01</span>
                  <span>到期日: 2024-02-01</span>
                  <span class="text-green-600 font-medium">收益: +23.5%</span>
                </div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-xl font-bold text-gray-900">$59/月</div>
              <div class="text-sm text-gray-500 mt-1">自动续费</div>
            </div>
          </div>
          
          <div class="flex items-center justify-between pt-4 border-t border-gray-200">
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-600">下次扣费: 2024-02-01</span>
            </div>
            <div class="flex items-center space-x-3">
              <button class="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium">管理订阅</button>
              <button class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                查看详情
              </button>
              <button class="px-4 py-2 text-red-600 hover:text-red-700 font-medium">
                取消订阅
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="false" class="text-center py-16">
        <div class="text-6xl mb-4">🚀</div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">暂无订阅</h3>
        <p class="text-gray-600 mb-6">订阅优质策略，开启自动化交易</p>
        <router-link
          to="/strategies"
          class="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          浏览策略
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

